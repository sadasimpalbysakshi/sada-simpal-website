import { supabase } from "@/lib/supabase";

const MAX_SIDE = 1400;

/** Shrinks a phone photo (often 5–10 MB) to a web-friendly WebP before uploading. */
const toWebp = async (file: File): Promise<Blob> => {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not process image"))), "image/webp", 0.85)
  );
};

/** Uploads one photo to the public "product-images" bucket and returns its web address. */
export const uploadProductImage = async (file: File): Promise<string> => {
  const blob = await toWebp(file);
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;
  const { error } = await supabase.storage
    .from("product-images")
    .upload(name, blob, { contentType: "image/webp", cacheControl: "31536000" });
  if (error) throw error;
  return supabase.storage.from("product-images").getPublicUrl(name).data.publicUrl;
};

export const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "product";
