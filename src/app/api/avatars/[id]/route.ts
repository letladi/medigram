import { NextRequest, NextResponse } from "next/server";
import { getGridFSBucket } from "@/lib/gridfs";
import { ObjectId } from "mongodb";
import { Readable } from "stream";

/**
 * Helper: Convert GridFSBucketReadStream to Buffer.
 */
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
}

/**
 * GET: Serve an avatar file from the "avatars" bucket by ID.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const bucket = await getGridFSBucket();

  try {
    const avatarId = new ObjectId(params.id);
    const downloadStream = bucket.openDownloadStream(avatarId);

    const buffer = await streamToBuffer(downloadStream);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return NextResponse.json({ error: "Avatar not found" }, { status: 404 });
  }
}
