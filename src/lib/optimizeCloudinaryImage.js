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

        return (
            before +
            `w_${width},h_${height},c_${crop},g_${gravity},q_${quality},f_${format}/` +
            rest
        );
    } catch (e) {
        console.warn("optimizeCloudinaryImage failed", e);
        return url;
    }
}