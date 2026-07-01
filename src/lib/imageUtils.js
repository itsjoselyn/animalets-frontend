export async function dataURLToBlob(dataUrl) {
    const res = await fetch(dataUrl);
    return res.blob();
}

function createImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('canvas.toBlob returned null'));
            resolve(blob);
        }, type, quality);
    });
}

export async function compressToWebP(file, maxWidth = 800, quality = 0.8) {
    if (!(file instanceof File || file instanceof Blob)) return null;
    // read as data URL
    const reader = new FileReader();
    const dataUrl = await new Promise((res, rej) => {
        reader.onerror = rej;
        reader.onload = () => res(reader.result);
        reader.readAsDataURL(file);
    });
    const img = await createImage(dataUrl);
    const ratio = img.width / img.height || 1;
    const targetWidth = Math.min(maxWidth, img.width);
    const targetHeight = Math.round(targetWidth / ratio);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    // try WebP
    try {
        const blob = await canvasToBlob(canvas, 'image/webp', quality);
        return blob;
    } catch (e) {
        console.warn('WebP conversion failed, falling back to JPEG', e);
        const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
        return blob;
    }
}

export async function compressToJpeg(file, maxWidth = 1024, quality = 0.7) {
    if (!(file instanceof File || file instanceof Blob)) return null;
    const reader = new FileReader();
    const dataUrl = await new Promise((res, rej) => {
        reader.onerror = rej;
        reader.onload = () => res(reader.result);
        reader.readAsDataURL(file);
    });
    const img = await createImage(dataUrl);
    const ratio = img.width / img.height || 1;
    const targetWidth = Math.min(maxWidth, img.width);
    const targetHeight = Math.round(targetWidth / ratio);
    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
    const blob = await canvasToBlob(canvas, 'image/jpeg', quality);
    return blob;
}

export async function compressForUpload(file, { maxWidth = 800, quality = 0.8, preferWebP = true } = {}) {
    if (!(file instanceof File || file instanceof Blob)) return null;
    try {
        if (preferWebP) {
            const webp = await compressToWebP(file, maxWidth, quality);
            if (webp) return webp;
        }
    } catch (e) {
        console.warn('compressForUpload: webp failed', e);
    }
    // fallback to jpeg
    try {
        const jpg = await compressToJpeg(file, maxWidth, Math.max(0.6, Math.min(0.8, quality)));
        return jpg;
    } catch (e) {
        console.warn('compressForUpload: jpeg fallback failed', e);
        // last resort: return original file/blob
        return file;
    }
}
