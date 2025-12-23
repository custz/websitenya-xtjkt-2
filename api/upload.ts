
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default async function handler(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        /* 
         * Token generator untuk mengizinkan upload dari client.
         * Di sini kita batasi tipe file yang boleh masuk.
         */
        return {
          allowedContentTypes: [
            'image/jpeg', 
            'image/png', 
            'image/gif', 
            'video/mp4', 
            'video/quicktime', 
            'video/webm'
          ],
          tokenPayload: JSON.stringify({
            // Bisa ditambahkan metadata tambahan di sini
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Logika setelah upload selesai (opsional)
        console.log('Upload selesai di server:', blob.url);
      },
    });

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
