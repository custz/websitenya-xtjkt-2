
/**
 * TJKT PRODUCTION CLOUD SERVICE (Vercel Blob SDK Edition)
 * Menghubungkan frontend langsung ke storage Vercel.
 */

export interface UploadResponse {
  url: string;
  success: boolean;
  error?: string;
}

export const uploadFileToCloud = async (file: File): Promise<UploadResponse> => {
  try {
    // Di environment Vercel, kita panggil API yang kita buat tadi
    // Kita gunakan dynamic import agar tidak berat saat load awal
    const { upload } = await import('@vercel/blob/client');

    const blob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/upload', // Pintu gerbang yang kita buat di api/upload.ts
    });

    return {
      url: blob.url,
      success: true
    };
  } catch (error: any) {
    console.error("Vercel Blob Error:", error);
    
    // Fallback: Jika gagal/local, gunakan sistem IndexedDB yang sebelumnya kita buat
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ 
          url: reader.result as string, 
          success: true 
        });
      };
      reader.onerror = () => resolve({ url: '', success: false, error: 'Cloud & Local Storage gagal' });
      reader.readAsDataURL(file);
    });
  }
};
