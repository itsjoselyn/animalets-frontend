export function optimizeCloudinaryImage(url, size = 900) {
    if (!url || typeof url !== 'string') return url;
    // Only operate on Cloudinary URLs
    // common hosts: res.cloudinary.com, cloudinary.com
    if (!/cloudinary\.com/.test(url)) return url;

    try {
        const uploadMarker = '/upload/';
        const idx = url.indexOf(uploadMarker);
        if (idx === -1) return url;
        const before = url.slice(0, idx + uploadMarker.length);
        const after = url.slice(idx + uploadMarker.length);

        // If already has transformations (e.g., starts with w_ or q_ or f_), avoid duplicating
        const firstSegment = after.split('/')[0] || '';
        if (/\b(w_|q_|f_|c_|c_fill|c_limit)\b/.test(firstSegment)) {
            // already transformed; do not modify
            return url;
        }

        const transform = `w_${size},c_limit,q_auto,f_auto`;
        return before + transform + '/' + after;
    } catch (e) {
        console.warn('optimizeCloudinaryImage failed', e);
        return url;
    }
}
export function optimizeCloudinaryModal(url) {
    if (!url || typeof url !== "string") return url;

    if (!/cloudinary\.com/.test(url)) return url;

    try {
        const uploadMarker = "/upload/";
        const idx = url.indexOf(uploadMarker);

        if (idx === -1) return url;

        const before = url.slice(0, idx + uploadMarker.length);
        const after = url.slice(idx + uploadMarker.length);

        // Si ya tiene transformaciones, las sustituimos
        const firstSegment = after.split("/")[0] || "";
        const rest = /\b(w_|q_|f_|c_|g_)\b/.test(firstSegment)
            ? after.split("/").slice(1).join("/")
            : after;

        return (
            before +
            "w_1200,h_900,c_fill,g_auto,q_auto,f_auto/" +
            rest
        );
    } catch (e) {
        console.warn(e);
        return url;
    }
}