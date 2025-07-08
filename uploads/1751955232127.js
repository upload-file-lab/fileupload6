const { GoogleGenAI } = require("@google/genai");
async function geminiwithsystemInstruction(text, system) {
const ai = new GoogleGenAI({ apiKey: "AIzaSyB3Q74etnADQ_qSX3OJtzTnteGh-fd4df8" });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${text}`,
    config: {
      systemInstruction: `${system}`,
    },
  });
 const data = {
"text": response.text
}
return data
}


const { GoogleGenAI } = require("@google/genai");

async function gemini(text) {
const ai = new GoogleGenAI({ apiKey: "AIzaSyB3Q74etnADQ_qSX3OJtzTnteGh-fd4df8" });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${text}`
  });
  const data = {
  "text": response.text
  }
return data
}


const { fromBuffer } = require('file-type');
const { GoogleGenAI } = require("@google/genai");
async function geminireadfile(text, fileurl) {
const ai = new GoogleGenAI({ apiKey: "AIzaSyB3Q74etnADQ_qSX3OJtzTnteGh-fd4df8" });
const media = await fetch(
    `${fileurl}`
)
    .then((response) => response.arrayBuffer());
const hehe = await fromBuffer(media)
const base64ImageFile = Buffer.from(media).toString("base64")
const contents = [
  {
    inlineData: {
      mimeType: hehe.mime,
      data: base64ImageFile,
    },
  },
  { text: text },
];

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
});
 const data = {
  "text": response.text
  }
return data
}


ESM
const { fileTypeFromBuffer } = (await import('file-type'));
const { GoogleGenAI } = require("@google/genai");
async function geminireadfile(text, fileurl) {
const ai = new GoogleGenAI({ apiKey: "AIzaSyB3Q74etnADQ_qSX3OJtzTnteGh-fd4df8" });
const media = await fetch(
    `${fileurl}`
)
    .then((response) => response.arrayBuffer());
const hehe = await fileTypeFromBuffer(media)
const base64ImageFile = Buffer.from(media).toString("base64")
const contents = [
  {
    inlineData: {
      mimeType: hehe.mime,
      data: base64ImageFile,
    },
  },
  { text: text },
];

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
});
 const data = {
  "text": response.text
  }
return data
}
