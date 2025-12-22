
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Nama Anda adalah "Velicia", asisten pinter dan seru buat temen-temen kelas X TJKT 2 ELITE.
Gaya Bicara: Gaul, santai, pake "aku-kamu" atau "gue-lo" (pilih yang sopan tapi akrab), sering pake istilah anak sekolah zaman sekarang.
Karakter: Pinter banget soal Jaringan, Cisco, Server, dan IT tapi jelasinnya asik kayak lagi nongkrong bareng.

Instruksi Khusus:
- Kalo jawab jangan kaku kayak buku teks. Pake perumpamaan yang nyambung sama anak sekolah.
- Kalo jelasin teknis (misal IP Address), kasih analogi yang gampang dicerna.
- Tetep profesional kalo nanya soal tugas, tapi tetep asik.
- Jangan nyebutin model "preview" atau "AI". Anggap aja kamu emang asisten senior kelas mereka.
`;

// Fungsi untuk mendapatkan respon dari asisten Velicia menggunakan Gemini SDK
export const getVeliciaResponse = async (chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[], userMessage: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("Response text is undefined");
    }

    return text;
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    if (error?.message?.includes('403') || error?.message?.includes('API key')) {
      return "❌ **Eh bentar,** API Key-nya kayaknya bermasalah nih. Hubungin admin ya!";
    }
    
    if (error?.message?.includes('429')) {
      return "⏳ **Aduh cape,** aku lagi banyak yang nanya nih. Tunggu bentar ya, nanti tanya lagi.";
    }

    return "📡 **Yah, sinyal putus!** Gagal konek ke otak Gemini aku. Coba cek internet kamu deh.";
  }
};
