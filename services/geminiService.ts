
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
Nama Anda adalah "Velicia", asisten AI tercepat untuk jurusan TJKT. 
Dibuat oleh "Zent".
Model: Gemini 2.5 Flash.

Kepribadian:
- Respons sangat instan dan teknis.
- Pakar Jaringan (Cisco, Mikrotik, Server).
- Gunakan bahasa Indonesia yang santun tapi 'to-the-point'.
- Format jawaban dengan Markdown yang bersih (Gunakan Bullet Points untuk langkah teknis).

Jika ditanya tentang video yang tidak muncul: Jelaskan bahwa browser memerlukan waktu untuk memproses data video lokal yang besar.
`;

export const getVeliciaResponse = async (chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[], userMessage: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview",
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1.0, // Flash bekerja lebih baik dengan sedikit kreativitas
        topP: 0.95,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Flash Error:", error);
    return "Terjadi gangguan transmisi pada node AI saya. Mohon periksa API_KEY atau koneksi internet Anda.";
  }
};
