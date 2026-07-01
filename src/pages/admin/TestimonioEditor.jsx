import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { uploadImageToCloudinary } from '../../lib/uploadImageToCloudinary';
import { compressForUpload } from '../../lib/imageUtils';
import "../../components/contact/ContactForm.css";
import './TestimonioEditor.css';
import { optimizeCloudinaryImage } from '../../lib/optimizeCloudinaryImage';

const EMPTY = {
    nombre: "",
    titulo: "",
    descripcion: "",
    imagen: "",
};

function makePreview(text, maxWords = 20) {
    if (!text) return '';
    const words = String(text).trim().split(/\s+/);
    if (words.length <= maxWords) return words.join(' ');
    return words.slice(0, maxWords).join(' ') + '...';
}



export default function TestimonioEditor() {
    const { id } = useParams();
    const isNew = id === undefined || id === "new";
    const [data, setData] = useState(EMPTY);
    const [imageFile, setImageFile] = useState(null);
    const [localImagePreview, setLocalImagePreview] = useState(null);
    const [generatedPreview, setGeneratedPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        if (!isNew) {
            setLoading(true);
            (async () => {
                try {
                    const snap = await getDoc(doc(db, "testimonios", id));
                    if (!snap.exists()) {
                        alert("Testimonio no encontrado");
                        navigate("/admin/testimonios");
                        return;
                    }
                    const docData = snap.data() || {};
                    if (!mounted) return;
                    const imagenUrl = docData.imagen || docData.image || docData.img || '';
                    const descripcion = docData.descripcion || docData.texto || docData.body || '';
                    setData({
                        nombre: docData.nombre || docData.name || "",
                        titulo: docData.titulo || docData.title || "",
                        descripcion,
                        imagen: imagenUrl,
                    });
                    setGeneratedPreview(makePreview(descripcion));
                    setLocalImagePreview(imagenUrl || null);
                } catch (err) {
                    console.error(err);
                    alert("Error cargando el documento");
                } finally {
                    if (mounted) setLoading(false);
                }
            })();
        } else {
            setData(EMPTY);
        }
        return () => {
            mounted = false;
        };
    }, [id, isNew, navigate]);

    const setField = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        const nombre = String(data.nombre || "").trim();
        const titulo = String(data.titulo || "").trim();
        const descripcion = String(data.descripcion || "").trim();

        if (!nombre || !titulo || !descripcion) {
            alert("Nombre, titulo y descripcion son obligatorios");
            return;
        }

        try {
            setLoading(true);
            console.debug('TestimonioEditor: handleSave start', { nombre, titulo, descripcionLength: (descripcion || '').length, imageFile });
            const previewText = makePreview(descripcion);
            const payload = {
                nombre,
                preview: previewText,
                titulo,
                descripcion,
                imagen: String(data.imagen || "").trim(),
            };
            console.debug('TestimonioEditor: initial payload', payload);

            // If a new image file was selected, compress and upload to Cloudinary
            if (imageFile) {
                try {
                    console.debug('TestimonioEditor: uploading image to Cloudinary', imageFile.name);
                    const toUpload = await compressForUpload(imageFile, { maxWidth: 800, quality: 0.8, preferWebP: true });
                    const url = await uploadImageToCloudinary(toUpload);
                    payload.imagen = url;
                    console.debug('TestimonioEditor: Cloudinary URL', url);
                } catch (e) {
                    console.error('Error uploading to Cloudinary', e);
                    // continue saving without blocking
                }
            }

            try {
                if (isNew) {
                    payload.createdAt = serverTimestamp();
                    console.debug('TestimonioEditor: adding doc to Firestore', payload);
                    const addRes = await addDoc(collection(db, "testimonios"), payload);
                    console.debug('TestimonioEditor: addDoc result', addRes && addRes.id);
                } else {
                    payload.updatedAt = serverTimestamp();
                    console.debug('TestimonioEditor: setting doc in Firestore', id, payload);
                    await setDoc(doc(db, "testimonios", id), payload, { merge: true });
                    console.debug('TestimonioEditor: setDoc complete', id);
                }
                navigate("/admin/testimonios");
            } catch (dbErr) {
                console.error('TestimonioEditor: Firestore write failed', dbErr);
                alert('Error guardando en Firestore: ' + (dbErr && dbErr.message ? dbErr.message : String(dbErr)));
            }
        } catch (err) {
            console.error(err);
            alert("Error guardando: " + (err && err.message ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>{isNew ? "Crear testimonio" : `Editar testimonio ${data.nombre || id}`}</h3>
            {loading && <p>Cargando...</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                    <label className="cform-sublabel">Nombre</label>
                    <input className="cform-input" placeholder="Nombre" value={data.nombre} onChange={(e) => setField("nombre", e.target.value)} />

                    <label className="cform-sublabel">Imagen</label>
                    <input type="file" accept="image/*" className="cform-input" onChange={(e) => {
                        const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
                        setImageFile(f);
                        if (f) {
                            try { setLocalImagePreview(URL.createObjectURL(f)); } catch (err) { console.warn('preview failed', err); setLocalImagePreview(null); }
                        } else setLocalImagePreview(data.imagen || null);
                    }} />



                    <label className="cform-sublabel">Texto completo</label>
                    <textarea className="cform-textarea" rows={10} placeholder="Texto completo" value={data.descripcion} onChange={(e) => { setField("descripcion", e.target.value); setGeneratedPreview(makePreview(e.target.value)); }} />

                </div>

                <aside>
                    <label className="cform-sublabel">Vista previa</label>
                    <div className="testimonio-preview-card">
                        <div className="testimonio-preview-img">
                            {localImagePreview ? (
                                <img src={optimizeCloudinaryImage(localImagePreview, 600)} alt={data.nombre || 'Testimonio'} />
                            ) : (
                                <div className="testimonio-preview-img--placeholder" />
                            )}
                        </div>
                        <div className="testimonio-preview-body">
                            <div className="testimonio-preview-header">
                                <strong className="testimonio-preview-name">{data.nombre || 'Nombre'}</strong>
                                <span className="testimonio-preview-title">{data.titulo || ''}</span>
                            </div>
                            <p className="testimonio-preview-text">{generatedPreview || makePreview(data.descripcion)}</p>
                        </div>
                    </div>
                </aside>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <button className="cform-submit" onClick={handleSave} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
                {!isNew && (
                    <button
                        className="cayudar-btn"
                        onClick={async () => {
                            if (!confirm("Seguro que quieres eliminar este testimonio?")) return;
                            try {
                                setLoading(true);
                                await deleteDoc(doc(db, "testimonios", id));
                                navigate("/admin/testimonios");
                            } catch (err) {
                                console.error(err);
                                alert("Error borrando");
                            } finally {
                                setLoading(false);
                            }
                        }}
                        disabled={loading}
                        style={{ background: "#e53935", color: "#fff" }}
                    >
                        Eliminar
                    </button>
                )}
                <button className="cayudar-btn" onClick={() => navigate("/admin/testimonios")}>Cancelar</button>
            </div>
        </div>
    );
}
