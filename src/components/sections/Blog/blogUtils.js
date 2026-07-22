/**
 * Convierte un valor de fecha de Firestore, String, Date o Timestamp a milisegundos.
 */
export function getFirestoreTimestampMs(value) {
    if (!value) return 0;

    // Si es un Timestamp de Firestore cliente con método .toDate()
    if (typeof value.toDate === "function") return value.toDate().getTime();

    // Si es un objeto Timestamp serializado de Firestore ({ seconds, nanoseconds })
    if (typeof value.seconds === "number") return value.seconds * 1000;

    // Si es un objeto Date o un ISO string/número
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

/**
 * Formatea una fecha para mostrarla en los posts del blog (ej. "21 Jul 2026").
 */
export function formatBlogDate(value) {
    const ms = getFirestoreTimestampMs(value);
    if (!ms) return "-";

    const formatted = new Date(ms).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    // Limpia puntos flotantes de la abreviatura del mes en español ("21 jul. 2026" -> "21 Jul 2026")
    return formatted
        .replace(".", "")
        .replace(/\b[a-z]/g, (letter) => letter.toUpperCase());
}

/**
 * Normaliza y devuelve un array limpio de URLs de imágenes del post.
 */
export function normalizeBlogImages(source) {
    const data = Array.isArray(source) ? { imagenes: source } : source || {};

    // Comprueba tanto 'images' como 'imagenes'
    const rawList = Array.isArray(data.images) && data.images.length > 0
        ? data.images
        : Array.isArray(data.imagenes)
            ? data.imagenes
            : [];

    if (rawList.length > 0) {
        return rawList
            .map((item) => {
                if (!item) return null;
                if (typeof item === "string") return item;
                return item.url || item.src || item.image || null;
            })
            .filter(Boolean);
    }

    // Fallback para campos únicos de imagen
    const fallback = data.imagen || data.image || data.img || "";
    return fallback ? [fallback] : [];
}