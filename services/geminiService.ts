
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

// Fungsi untuk mendapatkan respon dari asisten Velicia menggunakan Gemini SDK
export const getVeliciaResponse = async (chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[], userMessage: string) => {
  try {
    // Inisialisasi client baru setiap kali pemanggilan sesuai pedoman untuk memastikan API Key terbaru digunakan
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Menggunakan gemini-3-flash-preview untuk tugas Q&A teks dasar
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

    // Mengakses teks langsung dari properti .text (bukan metode .text())
    const text = response.text;
    
    if (!text) {
      throw new Error("Response text is undefined");
    }

    return text;
  } catch (error: any) {
    console.error("Gemini API Error Detail:", error);
    
    // Penanganan error yang informatif tanpa mengekspos detail teknis berlebih
    if (error?.message?.includes('403') || error?.message?.includes('API key')) {
      return "❌ **Masalah Autentikasi:** API Key tidak valid atau belum diaktifkan. Silakan periksa konfigurasi sistem.";
    }
    
    if (error?.message?.includes('429')) {
      return "⏳ **Limit Tercapai:** Terlalu banyak permintaan. Mohon tunggu beberapa saat.";
    }

    return "📡 **Gangguan Transmisi:** Velicia gagal memproses data melalui node Gemini. Pastikan koneksi internet Anda stabil.";
  }
};
