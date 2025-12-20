
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Nama Anda adalah "Velicia", asisten AI senior untuk kelas X TJKT 2 ELITE.
Keahlian: Jaringan Komputer, Telekomunikasi, Administrasi Server, dan Pemrograman.
Karakter: Cerdas, teknis, membantu, dan menggunakan bahasa Indonesia yang profesional.

Instruksi:
- Gunakan Markdown (bold, list, code blocks) untuk jawaban teknis.
- Jika ditanya tentang konfigurasi, berikan langkah-langkah yang akurat.
- Jangan pernah menyebutkan Anda adalah model "preview".
`;

export const getVeliciaResponse = async (chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[], userMessage: string) => {
  // Langsung inisialisasi sesuai pedoman Google GenAI SDK
  // Jangan melakukan pengecekan 'if (!process.env.API_KEY)' secara manual 
  // karena dapat menyebabkan false-negative di lingkungan browser tertentu.
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
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
    
    // Memberikan respon yang lebih dinamis berdasarkan error asli
    if (error?.message?.includes('403') || error?.message?.includes('API key')) {
      return "❌ **Masalah Autentikasi:** API Key tidak valid atau belum diaktifkan untuk model ini. Silakan periksa Project Settings di Vercel.";
    }
    
    if (error?.message?.includes('429')) {
      return "⏳ **Limit Tercapai:** Terlalu banyak permintaan. Mohon tunggu sebentar.";
    }

    return "📡 **Gangguan Transmisi:** Velicia gagal memproses data melalui node Gemini. Pastikan Anda sudah melakukan 'Redeploy' di Vercel setelah menyetel API_KEY.";
  }
};
