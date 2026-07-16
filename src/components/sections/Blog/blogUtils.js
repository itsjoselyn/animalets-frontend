export function getFirestoreTimestampMs(value) {
    if (!value) return 0;
    if (typeof value.toDate === "function") return value.toDate().getTime();
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

export function formatBlogDate(value) {
    const ms = getFirestoreTimestampMs(value);
    if (!ms) return "-";
    return new Date(ms).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function normalizeBlogImages(source) {
    const data = Array.isArray(source)
        ? { imagenes: source }
        : (source || {});

    if (Array.isArray(data.images) && data.images.length > 0) {
        return data.images
            .map((item) => {
                if (!item) return null;
                if (typeof item === "string") return item;
                return item.url || item.src || item.image || null;
            })
            .filter(Boolean);
    }

    const images = Array.isArray(data.imagenes)
        ? data.imagenes
            .map((item) => {
                if (!item) return null;
                if (typeof item === "string") return item;
                return item.url || item.src || item.image || null;
            })
            .filter(Boolean)
        : [];

    if (images.length > 0) return images;

    const fallback = data.imagen || data.image || data.img || "";
    return fallback ? [fallback] : [];
}