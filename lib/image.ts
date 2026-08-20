import sharp from "sharp";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB — o cliente já comprime antes de enviar
const MAX_DIMENSION = 1080;

export class InvalidImageError extends Error {}

/**
 * Valida e reprocessa a foto no servidor: nunca confiamos apenas na
 * compressão feita no cliente. O sharp também remove metadados EXIF
 * (ex.: geolocalização) e recodifica para JPEG, então mesmo um arquivo
 * malicioso disfarçado de imagem precisa decodificar como imagem de verdade.
 */
export async function readAndValidateImage(file: File) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new InvalidImageError(
      "Formato de imagem não suportado. Envie JPG, PNG ou WEBP."
    );
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new InvalidImageError("Imagem muito grande.");
  }

  const arrayBuffer = await file.arrayBuffer();

  let bytes: Buffer;
  try {
    bytes = await sharp(Buffer.from(arrayBuffer))
      .rotate() // aplica a orientação EXIF antes de removê-la
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 82 })
      .toBuffer();
  } catch {
    throw new InvalidImageError("Não foi possível processar a imagem enviada.");
  }

  return { bytes, mimeType: "image/jpeg" as const };
}
