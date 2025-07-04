module.exports = slips => {
   slips.getFile = async (PATH, returnAsFilename) => {
      let res, filename
      const data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,` [1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer() : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
      if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')
      const type = await FileType.fromBuffer(data) || {
         mime: 'application/octet-stream',
         ext: '.bin'
      }
      if (data && returnAsFilename && !filename)(filename = path.join('../../tmp/' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))
      return {
         res,
         filename,
         ...type,
         data,
         deleteFile() {
            return filename && fs.promises.unlink(filename)
         }
      }
   }
   
   slips.sendFileV2 = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
      let type = await slips.getFile(path, true)
      let { res, data: file, filename: pathFile } = type
      if (res && res.status !== 200 || file.length <= 65536) {
        try {
          throw {
            json: JSON.parse(file.toString())
          }
        } catch (e) {
          if (e.json) throw e.json
        }
      }
      let opt = { filename }
      if (quoted) opt.quoted = quoted
      if (!type) options.asDocument = true
      let mtype = '', mimetype = type.mime, convert
      if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'
      else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'
      else if (/video/.test(type.mime)) mtype = 'video'
      else if (/audio/.test(type.mime)) (convert = await (ptt ? toPTT : toAudio)(file, type.ext), file = convert.data, pathFile = convert.filename, mtype = 'audio', mimetype = 'audio/ogg; codecs=opus')
      else mtype = 'document'
      if (options.asDocument) mtype = 'document'

      delete options.asSticker
      delete options.asLocation
      delete options.asVideo
      delete options.asDocument
      delete options.asImage

      let message = {
        ...options,
        caption,
        ptt,
        [mtype]: { url: pathFile },
        mimetype
      }
      let m
      try {
         m = await slips.sendMessage(jid, message, {
            ...opt,
            ...options
         })
      } catch (e) {
        console.error(e)
        m = null
      } finally {
      if (!m) m = await slips.sendMessage(jid, {
        ...message,
        [mtype]: file
      }, {
        ...opt,
        ...options
      })
      return m
    }
  }
   
   slips.sendStickerV2 = async (jid, path, quoted, options = {}) => {
      let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer() : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
      let buffer
      if (options && (options.packname || options.author)) {
         buffer = await Exif.writeExifImg(buff, options)
      } else {
         buffer = await Exif.imageToWebp(buff)
      }
      await slips.sendPresenceUpdate('composing', jid)
      await slips.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
      return buffer
   }
   
   slips.sendAlbumMessageV2 = async (jid, medias, options = {}) => {
      for (const media of medias) {
         if (!media.image && !media.video) throw new TypeError('Heyy oniichan medias[i] must have image or video property')
      }
      const time = options.delay || 500
      delete options.delay
      const album = await generateWAMessageFromContent(jid, {
         albumMessage: {
            expectedImageCount: medias.filter(media => media.image).length,
            expectedVideoCount: medias.filter(media => media.video).length,
            ...options
         }
      }, { userJid: slips.user.jid, ...options })
      await slips.relayMessage(jid, album.message, { messageId: album.key.id })
      let mediaHandle
      let msg
      for (const i in medias) {
         const media = medias[i]
         if (media.image) {
            msg = await generateWAMessage(jid, { image: media.image, ...media, ...options }, { userJid: slips.user.jid, upload: async (readStream, opts) => {
               const up = await slips.waUploadToServer(readStream, { ...opts, newsletter: isJidNewsletter(jid) })
               mediaHandle = up.handle
               return up
            },  ...options })
         } else if (media.video) {
            msg = await generateWAMessage(jid, { video: media.video, ...media, ...options }, { userJid: slips.user.jid, upload: async (readStream, opts) => {
               const up = await slips.waUploadToServer(readStream, { ...opts, newsletter: isJidNewsletter(jid) })
               mediaHandle = up.handle
               return up
            }, ...options })
         }
         if (msg) {
            msg.message.messageContextInfo = {
               messageSecret: crypto.randomBytes(32), 
               messageAssociation: {
                  associationType: 1,
                  parentMessageKey: album.key
               }
            }
         }
         await slips.relayMessage(jid, msg.message, { messageId: msg.key.id })
         await Func.delay(time)
      }
      return album
   }
   
   /** work on ch **/
   slips.sendHydratedButton = async (jid, content = {}, options = {}) => {
      let mediaContent = {}
      if (options.media) {
         const media = await slips.getFile(options.media, true)
         const upload = { upload: slips.waUploadToServer }
         if (/image|video/.test(media.mime)) {
            const prep = await prepareWAMessageMedia({ [media.mime.includes('image') ? 'image' : 'video']: { url: media.filename } }, upload)
            mediaContent = media.mime.includes('image') ? { imageMessage: prep.imageMessage } : { videoMessage: prep.videoMessage }
         }
      }
      const msg = generateWAMessageFromContent(jid, {
         viewOnceMessage: {
            message: {
               templateMessage: {
                  hydratedTemplate: {
                     ...mediaContent,
                     hydratedContentText: content.text || '',
                     hydratedTitleText: content.title || '',
                     hydratedFooterText: content.footer || '',
                     hydratedButtons: content.buttons || []
                  }
               }
            }
         }
      }, {})
      await slips.relayMessage(jid, msg.message, { messageId: msg.key.id })
      return msg
   }
   
   // appenTextMessage
   slips.appenTextMessage = async (m, text, chatUpdate) => {
      let messages = await generateWAMessage(m.chat, { text: text, mentions: m.mentionedJid || [m.sender] }, { userJid: slips.user?.jid || slips.user?.id, quoted: m.quoted && m.quoted?.fakeObj })
         messages.key.fromMe = areJidsSameUser(m.sender, slips.user?.jid || slips.user?.id)
         messages.key.id = m.key.id
         messages.pushName = m.pushName || m.name
      if (m.isGroup)
         messages.participant = m.sender || m.key.remoteJid || m.chat
      let msg = {
         ...chatUpdate,
         messages: [proto.WebMessageInfo.fromObject(messages)],
         type: 'append'
      }
      slips.ev.emit('messages.upsert', msg)
   }
   
   // put the other code here. . . 
}

Func.updateFile(require.resolve(__filename))