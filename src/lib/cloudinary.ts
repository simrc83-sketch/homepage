import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(
  buffer: Buffer,
  folder = "design-nadeul"
): Promise<{ url: string; publicId: string }> {
  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error || !result) reject(error ?? new Error("Upload failed"));
          else resolve(result);
        }
      );
      stream.end(buffer);
    }
  );

  const optimizedUrl = result.secure_url.replace(
    "/image/upload/",
    "/image/upload/f_auto,q_auto/"
  );

  return { url: optimizedUrl, publicId: result.public_id };
}

export async function deleteFromCloudinary(
  publicId: string
): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export async function deleteUrlsFromCloudinary(
  urls: (string | null | undefined)[]
): Promise<void> {
  const cloudinaryUrls = urls.filter(
    (u): u is string =>
      typeof u === "string" && u.includes("res.cloudinary.com")
  );
  if (cloudinaryUrls.length === 0) return;

  const results = await Promise.allSettled(
    cloudinaryUrls.map(async (url) => {
      const publicId = extractPublicIdFromUrl(url);
      if (publicId) await deleteFromCloudinary(publicId);
    })
  );

  const failures = results.filter((r) => r.status === "rejected");
  if (failures.length > 0) {
    console.error(
      "Cloudinary delete failures:",
      failures.map((r) => (r as PromiseRejectedResult).reason)
    );
  }
}

export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/");
    const uploadIdx = pathParts.indexOf("upload");
    if (uploadIdx === -1 || uploadIdx === pathParts.length - 1) return null;

    let startIdx = uploadIdx + 1;
    while (startIdx < pathParts.length && !/^v\d+$/.test(pathParts[startIdx])) {
      startIdx++;
    }
    if (startIdx < pathParts.length && /^v\d+$/.test(pathParts[startIdx])) {
      startIdx++;
    }

    const publicIdParts = pathParts.slice(startIdx);
    if (publicIdParts.length === 0) return null;

    const lastPart = publicIdParts[publicIdParts.length - 1];
    publicIdParts[publicIdParts.length - 1] = lastPart.replace(/\.[^.]+$/, "");

    return publicIdParts.join("/");
  } catch {
    return null;
  }
}
