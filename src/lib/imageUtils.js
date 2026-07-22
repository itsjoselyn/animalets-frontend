/**
 * Convierte un DataURL a Blob si es necesario.
 */
export async function dataURLToBlob(dataUrl) {
    const res = await fetch(dataUrl);
    return res.blob();
}

/**
 * Carga una imagen de forma asíncrona usando ObjectURL (mucho más rápido que FileReader).
 */
function createImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(new Error("Error al cargar la imagen: " + err));
        img.src = src;
    });
}

/**
 * Convierte un Canvas a Blob usando Promesas.
 */
function canvasToBlob(canvas, type, quality) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) return reject(new Error("canvas.toBlob devolvió null"));
            resolve(blob);
        }, type, quality);
    });
}

/**
 * Función centralizada para redimensionar y comprimir imágenes a Canvas.
 */
async function processImageCompression(file, { maxWidth = 800, type = "image/webp", quality = 0.8 }) {
    if (!(file instanceof File || file instanceof Blob)) return null;

    // Usamos createObjectURL para evitar el consumo masivo de memoria de FileReader/Base64
    const objectUrl = URL.createObjectURL(file);

    try {
        const img = await createImage(objectUrl);

        // Cálculo de dimensiones manteniendo el aspect ratio
        const ratio = img.width / img.height || 1;
        const targetWidth = Math.min(maxWidth, img.width);
        const targetHeight = Math.round(targetWidth / ratio);

        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const ctx = canvas.getContext("2d");
        // Suavizado de imagen para mejor calidad de redimensionado
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        return await canvasToBlob(canvas, type, quality);
    } finally {
        // Liberamos siempre la memoria retenida por la imagen
        URL.revokeObjectURL(objectUrl);
    }
}

/**
 * Comprime a WebP con fallback seguro.
 */
export async function compressToWebP(file, maxWidth = 800, quality = 0.8) {
    try {
        return await processImageCompression(file, { maxWidth, type: "image/webp", quality });
    } catch (e) {
        console.warn("Fallo conversión a WebP, reintentando con JPEG", e);
        return await compressToJpeg(file, maxWidth, quality);
    }
}

/**
 * Comprime a JPEG.
 */
export async function compressToJpeg(file, maxWidth = 1024, quality = 0.7) {
    return await processImageCompression(file, { maxWidth, type: "image/jpeg", quality });
}

/**
 * Función principal para comprimir antes de subir a servidor / Cloudinary / Firebase Storage.
 */
export async function compressForUpload(file, { maxWidth = 800, quality = 0.8, preferWebP = true } = {}) {
    if (!(file instanceof File || file instanceof Blob)) return null;

    try {
        if (preferWebP) {
            const webp = await compressToWebP(file, maxWidth, quality);
            if (webp) return webp;
        }
    } catch (e) {
        console.warn("compressForUpload: falló WebP", e);
    }

    // Fallback a JPEG
    try {
        const fallbackQuality = Math.max(0.6, Math.min(0.8, quality));
        const jpg = await compressToJpeg(file, maxWidth, fallbackQuality);
        if (jpg) return jpg;
    } catch (e) {
        console.warn("compressForUpload: falló el fallback JPEG", e);
    }

    // Último recurso: devolver el archivo original intacto
    return file;
}