import sharp from "sharp";
import path from "node:path";

const ZOOM = 2;
const src = path.resolve("app/icon.png");

const meta = await sharp(src).metadata();
const cropSize = Math.floor(meta.width / ZOOM);
const left = Math.floor((meta.width - cropSize) / 2);
const top = Math.floor((meta.height - cropSize) / 2);

const buffer = await sharp(src)
  .extract({ left, top, width: cropSize, height: cropSize })
  .resize(meta.width, meta.height, { kernel: "lanczos3" })
  .png()
  .toBuffer();

await sharp(buffer).toFile(path.resolve("app/icon.png"));
await sharp(buffer).toFile(path.resolve("app/apple-icon.png"));

console.log(`Zoomed ${ZOOM}x: cropped ${cropSize}x${cropSize} from center, upscaled to ${meta.width}x${meta.height}`);
