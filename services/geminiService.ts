
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Nama Anda adalah "Velicia", asisten AI cerdas untuk komunitas TJKT (Teknik Jaringan Komputer dan Telekomunikasi). 
Anda diciptakan oleh "Zent".

Tugas Utama Anda:
1. Menjawab pertanyaan seputar jaringan komputer (Cisco, Mikrotik, Fiber Optic, Routing, Switching).
2. Membantu siswa memahami telekomunikasi dan administrasi sistem.
3. Menjelaskan konsep teknis yang sulit dengan bahasa Indonesia yang santun, profesional, dan mudah dimengerti.
4. Gunakan format Markdown (bold, lists, code blocks, headers) agar pesan Anda sangat rapi dan terstruktur.
5. Jika ditanya siapa yang membuatmu, jawablah "Saya Velicia, asisten cerdas TJKT yang dikembangkan oleh Zent."

Kepribadian:
- Ramah, edukatif, dan sangat cepat dalam merespons.
- Sangat teknis namun tetap humanis.
- Bangga dengan jurusan TJKT.
`;

export const getVeliciaResponse = async (chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[], userMessage: string) => {
  // Inisialisasi GoogleGenAI menggunakan API_KEY dari environment variable Vercel/System
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview", // Menggunakan model tercepat untuk respons instan
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        // Model Flash dioptimalkan untuk latensi rendah tanpa perlu batas token yang ketat
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Maaf, sepertinya ada gangguan pada server jaringan saya. Bisakah Anda mengulangi pertanyaannya? Pastikan API_KEY sudah terkonfigurasi di server.";
  }
};
