export function optimizeCloudinaryImage(url, options = {}) {
    if (!url || typeof url !== "string") return url;
    if (!/cloudinary\.com/.test(url)) return url;

    const normalizedOptions = typeof options === "number" ? { width: options } : (options || {});
    const {
        width = 1200,
        height = 900,
        crop = "fill",
        gravity = "auto",
        quality = "auto",
        format = "auto",
    } = normalizedOptions;

    try {
        const uploadMarker = "/upload/";
        const idx = url.indexOf(uploadMarker);

        if (idx === -1) return url;

        const before = url.slice(0, idx + uploadMarker.length);
        const after = url.slice(idx + uploadMarker.length);

        const firstSegment = after.split("/")[0] || "";

        const rest = /\b(w_|h_|q_|f_|c_|g_)\b/.test(firstSegment)
            ? after.split("/").slice(1).join("/")
            : after;
        // Cloudinary solo permite aplicar gravity (g_*) en ciertos modos de recorte
        // como "fill" o "crop". Si se usa con "fit" u otros modos devuelve un 400.
        const transformations = [];

        if (width) transformations.push(`w_${width}`);
        if (height) transformations.push(`h_${height}`);

        transformations.push(`c_${crop}`);

        if (gravity && (crop === "fill" || crop === "crop")) {
            transformations.push(`g_${gravity}`);
        }

        if (quality) transformations.push(`q_${quality}`);
        if (format) transformations.push(`f_${format}`);

        return before + transformations.join(",") + "/" + rest;
    } catch (e) {
        console.warn("optimizeCloudinaryImage failed", e);
        return url;
    }
}