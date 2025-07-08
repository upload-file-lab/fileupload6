import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'

/*--------[ OWNER SETTING ]------------*/
global.nomorbot = '6281949448422' //Nomor Bot
global.nomorown = '6287860644193' //Nomor Ownerlobal.namebot 
global.nameown = 'Takashi' // Nama Owner
global.owner = [['6287860644193', 'Taka?', true]]//Nomor owner 
global.mods = ['', '']
global.prems = ['', '', '']
/*--------[ API SETTING ]------------*/
global.APIs = { 
  // name: 'https://website'
}
global.APIKeys = { // APIKey Here*
  // 'https://website': 'apikey'
}
/*--------[ MAIN SETTINGS ]------------*/
global.wm = 'AnnaBot' //Main Watermark
global.titlebot = 'Anna-Botz'
global.version = "v3.0"
global.namebot = 'Anna-Botz' // ini nama bot nya di all
global.wait = '`Mengeksekusi Command, Tunggu Sebentar`'
global.packname = ''
global.author = 'Takashi'
global.nsfw = '🥵'
global.done = '☑️'
global.error = '`Error Command Failed!`'
global.newsid = '120363414329890254@newsletter'//isi
global.namach = "Klik Dan Follow aku dong kak!"
/*--------[ THUMB & URL SETTING ]------------*/
global.imgbot ='https://telegra.ph/file/082a4ae9d2a7c28e72efd.jpg'
global.imgbot2 = 'https://telegra.ph/file/ebc31e6041812a4241a91.jpg'
global.sch = 'https://whatsapp.com/channel/0029VbA6ZQp72WTpwhiTlo3W'
global.sgc = ``
global.thumb = "https://files.catbox.moe/2tdun6.jpg"
/*--------[ PFP SETTING ]------------*/
global.ppKosong = 'https://i.ibb.co/3Fh9V6p/avatar-contact.png'
global.ppUrl = 'https://i.ibb.co/3Fh9V6p/avatar-contact.png'

/*--------[ USER SETTING ]------------*/
global.multiplier = 100
global.maxwarn = '2' // maximal warn
global.adReply = {
        contextInfo: {
            mentionedJid: [],
            groupMentions: [],
            isForwarded: true,
            forwardingScore: 1,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363198449115557@newsletter',
               newsletterName: "✅ KLIK BUTTON HERE",
                serverMessageId: -1
            },
        }
    }

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
