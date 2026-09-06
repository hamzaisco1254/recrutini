import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Issues a short-lived token so a student can upload their card straight to
 * blob storage. The token is deliberately narrow: images and PDFs only, 6 MB,
 * random pathname, and it can't be reused to overwrite anything.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Uploads are not configured." }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"],
        maximumSizeInBytes: 6 * 1024 * 1024,
        addRandomSuffix: true,
        tokenPayload: null,
      }),
      // Nothing to do on completion: the URL travels back with the booking form.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed." },
      { status: 400 },
    );
  }
}
