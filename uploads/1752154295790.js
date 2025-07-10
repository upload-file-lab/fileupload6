/*
Nih free Gemini buat apikey nya di Gemini https://aistudio.google.com/app/apikey
*/

import fetch from 'node-fetch';

// Fungsi untuk mengirim permintaan ke API Gemini
const sendToGemini = async (prompt) => {
    const apiKey = 'AIzaSyDvizr_N6hVj99bEVFzJyYfo6tVpj65WBg';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
    
    const body = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok) {
            return data; // Mengembalikan data respons dari API
        } else {
            throw new Error(data.error.message || 'Request failed');
        }
    } catch (error) {
        console.error('Error:', error.message);
        return null;
    }
};

// Fungsi handler untuk command gemini2
const handler = async (m, { text }) => {
    const prompt = text.trim();

    if (!prompt) {
        return m.reply("Masukkan prompt untuk digunakan! Contoh: .gemini2 Explain how AI works");
    }

    try {
        const response = await sendToGemini(prompt); 
        if (response) {
            // Mengambil teks dari respons API
            const candidates = response.candidates;
            const message = candidates && candidates.length > 0
                ? candidates[0].content.parts[0].text // Mengambil bagian teks
                : 'Tidak ada respons yang diterima dari model.';

            // Menampilkan respons yang didapat dari Gemini
            m.reply(`[ GOOGLE GEMINI ]\n\n${message}`);
        } else {
            m.reply('Gagal mendapatkan respons dari Gemini API.');
        }
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat memproses permintaan Anda.');
    }
};

// Definisi command
handler.command = ['gemini','bard'];
handler.help = ['gemini <prompt>'];
handler.tags = ['ai'];

export default handler