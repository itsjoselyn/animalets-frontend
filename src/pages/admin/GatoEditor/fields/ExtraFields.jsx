import Button from "../../../../components/common/Button/Button";
export default function ExtraFields({ data, setField, imagenesPreview, setImagenesPreview, handleDeleteImage }) {
    const handleFileChange = (e) => {
        if (!e.target.files) return;
        const nuevos = Array.from(e.target.files).map(file => ({
            file,
            url: URL.createObjectURL(file),
            uploaded: false,
        }));
        setImagenesPreview(prev => [...prev, ...nuevos].slice(0, 5));
    };

    return (
        <>
            <label className="cform-sublabel">Apadrinado</label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" checked={!!data.apadrinado} onChange={(e) => setField('apadrinado', e.target.checked)} />
            </label>

            <label className="cform-sublabel">Imágenes</label>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} />

            {imagenesPreview.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    {imagenesPreview.map((img, i) => (
                        <div key={i} style={{ width: 120 }}>
                            <img src={img.url} alt={`img-${i}`} style={{ width: '100%', borderRadius: 8 }} />
                            <Button type="button" variant="admin-btn" onClick={() => handleDeleteImage(img)}>Eliminar</Button>                        </div>
                    ))}
                </div>
            )}
        </>
    );
}