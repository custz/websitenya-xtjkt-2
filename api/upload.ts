
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default async function handler(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        /* 
         * Di sini kamu bisa cek apakah user boleh upload atau tidak.
         * Untuk sekarang, kita izinkan semua (public).
         */
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'video/mp4', 'video/quicktime', 'image/gif'],
          tokenPayload: JSON.stringify({
            // Tambahkan info user jika perlu
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload selesai!', blob.url);
      },
    });

    return new Response(JSON.stringify(jsonResponse));
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400 }
    );
  }
}

export const config = {
  runtime: 'edge',
};
