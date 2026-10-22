export type PhotoExif = {
  make?: string;
  model?: string;
  iso?: number;
  aperture?: number;
  shutter?: number;
  focalLength?: number;
  lens?: string;
  dateTaken?: string;
};

function readAscii(view: DataView, offset: number, length: number) {
  let value = "";
  for (let i = 0; i < length; i += 1) {
    const code = view.getUint8(offset + i);
    if (code === 0) break;
    value += String.fromCharCode(code);
  }
  return value.trim();
}

function readRational(view: DataView, offset: number, littleEndian: boolean) {
  const numerator = view.getUint32(offset, littleEndian);
  const denominator = view.getUint32(offset + 4, littleEndian);
  if (!denominator) return undefined;
  return numerator / denominator;
}

function readIfd(view: DataView, offset: number, littleEndian: boolean, tiffStart: number) {
  if (offset + 2 > view.byteLength) return {} as Record<number, number | string>;
  const entries = view.getUint16(offset, littleEndian);
  const values: Record<number, number | string> = {};

  for (let i = 0; i < entries; i += 1) {
    const entry = offset + 2 + i * 12;
    if (entry + 12 > view.byteLength) break;
    const tag = view.getUint16(entry, littleEndian);
    const type = view.getUint16(entry + 2, littleEndian);
    const count = view.getUint32(entry + 4, littleEndian);
    const valueOffset = entry + 8;
    const unit = type === 3 ? 2 : type === 4 || type === 9 ? 4 : type === 5 || type === 10 ? 8 : 1;
    const size = unit * count;
    const dataOffset = size > 4 ? tiffStart + view.getUint32(valueOffset, littleEndian) : valueOffset;
    if (dataOffset < 0 || dataOffset + Math.min(size, 64) > view.byteLength) continue;

    if (type === 2) values[tag] = readAscii(view, dataOffset, count);
    else if (type === 3 && count === 1) values[tag] = view.getUint16(dataOffset, littleEndian);
    else if ((type === 4 || type === 9) && count === 1) values[tag] = view.getUint32(dataOffset, littleEndian);
    else if ((type === 5 || type === 10) && count >= 1) {
      const rational = readRational(view, dataOffset, littleEndian);
      if (rational !== undefined) values[tag] = rational;
    }
  }

  return values;
}

export async function readPhotoExif(file: File): Promise<PhotoExif | null> {
  if (!file.type.includes("jpeg") && !file.type.includes("jpg") && !/\.jpe?g$/i.test(file.name)) {
    return null;
  }

  try {
    const buffer = await file.slice(0, Math.min(file.size, 128 * 1024)).arrayBuffer();
    const view = new DataView(buffer);
    if (view.byteLength < 4 || view.getUint16(0, false) !== 0xffd8) return null;

    let offset = 2;
    while (offset + 4 < view.byteLength) {
      if (view.getUint8(offset) !== 0xff) { offset += 1; continue; }
      const marker = view.getUint8(offset + 1);
      const size = view.getUint16(offset + 2, false);
      if (marker === 0xe1) {
        const start = offset + 4;
        if (readAscii(view, start, 5) !== "Exif") break;
        const tiffStart = start + 6;
        const littleEndian = view.getUint16(tiffStart, false) === 0x4949;
        if (view.getUint16(tiffStart + 2, littleEndian) !== 0x002a) break;
        const ifd0 = tiffStart + view.getUint32(tiffStart + 4, littleEndian);
        const ifd0Values = readIfd(view, ifd0, littleEndian, tiffStart);
        const exifPointer = typeof ifd0Values[0x8769] === "number" ? ifd0Values[0x8769] : undefined;
        const exifValues = exifPointer ? readIfd(view, tiffStart + exifPointer, littleEndian, tiffStart) : {};

        const aperture = typeof exifValues[0x829d] === "number" ? exifValues[0x829d] : typeof exifValues[0x9202] === "number" ? 2 ** (exifValues[0x9202] / 2) : undefined;
        const shutter = typeof exifValues[0x829a] === "number" ? exifValues[0x829a] : undefined;
        const iso = typeof exifValues[0x8827] === "number" ? exifValues[0x8827] : undefined;
        const focalLength = typeof exifValues[0x920a] === "number" ? exifValues[0x920a] : undefined;

        return {
          make: typeof ifd0Values[0x010f] === "string" ? ifd0Values[0x010f] : undefined,
          model: typeof ifd0Values[0x0110] === "string" ? ifd0Values[0x0110] : undefined,
          iso: iso && Number.isFinite(iso) ? Math.round(iso) : undefined,
          aperture: aperture && Number.isFinite(aperture) ? Number(aperture.toFixed(1)) : undefined,
          shutter: shutter && Number.isFinite(shutter) ? shutter : undefined,
          focalLength: focalLength && Number.isFinite(focalLength) ? Number(focalLength.toFixed(1)) : undefined,
          lens: typeof exifValues[0xa434] === "string" ? exifValues[0xa434] : undefined,
          dateTaken: typeof exifValues[0x9003] === "string" ? exifValues[0x9003] : typeof ifd0Values[0x0132] === "string" ? ifd0Values[0x0132] : undefined,
        };
      }
      if (size < 2) break;
      offset += 2 + size;
    }
  } catch {
    return null;
  }

  return null;
}

export function formatShutter(seconds?: number) {
  if (!seconds || !Number.isFinite(seconds) || seconds <= 0) return undefined;
  if (seconds >= 1) return `${Number(seconds.toFixed(1))} s`;
  const reciprocal = Math.round(1 / seconds);
  return `1/${reciprocal} s`;
}

export function formatAperture(value?: number) {
  if (!value || !Number.isFinite(value)) return undefined;
  return `f/${value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)}`;
}
