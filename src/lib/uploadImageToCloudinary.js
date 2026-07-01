export async function uploadImageToCloudinary(file, folder = "general") {
    if (!file) return null;

    const url = 'https://api.cloudinary.com/v1_1/dhb3yos4y/image/upload';

    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'animalets_upload');

    // 👉 carpeta en Cloudinary
    form.append('folder', `protectora/${folder}`);

    try {
        const res = await fetch(url, { method: 'POST', body: form });

        if (!res.ok) {
            const text = await res.text();
            throw new Error(
                `Cloudinary upload failed: ${res.status} ${res.statusText} ${text}`
            );
        }

        const data = await res.json();

        return data.secure_url || data.url || null;
    } catch (err) {
        console.error('uploadImageToCloudinary error', err);
        throw err;
    }
}