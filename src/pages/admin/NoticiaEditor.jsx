import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { uploadImageToCloudinary } from '../../lib/uploadImageToCloudinary';
import "../../components/contact/ContactForm.css";
import { optimizeCloudinaryImage } from '../../lib/optimizeCloudinaryImage';
import { compressForUpload } from '../../lib/imageUtils';

const EMPTY = {
    titulo: "",
    descripcion: "",
    imagen: "",
};

export default function NoticiaEditor() {
    const { id } = useParams();
    const isNew = id === undefined || id === "new";
    const [data, setData] = useState(EMPTY);
    const [loading, setLoading] = useState(false);
    const [imageFiles, setImageFiles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        if (!isNew) {
            setLoading(true);
            (async () => {
                try {
                    const snap = await getDoc(doc(db, "blog", id));
                    if (!snap.exists()) {
                        alert("Noticia no encontrada");
                        navigate("/admin/noticias");
                        return;
                    }
                    const docData = snap.data() || {};
                    if (!mounted) return;
                    setData({
                        titulo: docData.titulo || docData.title || "",
                        descripcion: docData.descripcion || docData.body || docData.text || "",
                        imagen: docData.imagen || docData.image || docData.img || "",
                    });
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
        const titulo = String(data.titulo || "").trim();
        const descripcion = String(data.descripcion || "").trim();

        if (!titulo || !descripcion) {
            alert("Titulo y descripcion son obligatorios");
            return;
        }

        setLoading(true);
        try {
            const payload = {
                titulo,
                descripcion,
                imagen: String(data.imagen || "").trim(),
            };

            // If image files selected, compress and upload to Cloudinary and store array in imagenes
            if (imageFiles && imageFiles.length > 0) {
                const uploaded = [];
                for (let i = 0; i < imageFiles.length && i < 3; i++) {
                    try {
                        const f = imageFiles[i];
                        const toUpload = await compressForUpload(f, { maxWidth: 800, quality: 0.75, preferWebP: true });
                        const url = await uploadImageToCloudinary(toUpload);
                        if (url) uploaded.push({ url });
                    } catch (e) {
                        console.error('Error uploading noticia image', e);
                    }
                }
                if (uploaded.length > 0) {
                    payload.imagenes = uploaded;
                    // keep single-image compatibility
                    payload.imagen = uploaded[0].url;
                }
            }

            if (isNew) {
                payload.createdAt = serverTimestamp();
                await addDoc(collection(db, "blog"), payload);
            } else {
                payload.updatedAt = serverTimestamp();
                await setDoc(doc(db, "blog", id), payload, { merge: true });
            }

            navigate("/admin/noticias");
        } catch (err) {
            console.error(err);
            alert("Error guardando: " + (err && err.message ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>{isNew ? "Crear noticia" : `Editar noticia ${data.titulo || id}`}</h3>
            {loading && <p>Cargando...</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, maxWidth: 900 }}>
                <div>
                    <label className="cform-sublabel">Titulo</label>
                    <input className="cform-input" placeholder="Titulo" value={data.titulo} onChange={(e) => setField("titulo", e.target.value)} />

                    <label className="cform-sublabel">Imágenes (hasta 3)</label>
                    <input type="file" accept="image/*" className="cform-input" multiple onChange={(e) => {
                        const files = e.target.files ? Array.from(e.target.files).slice(0, 3) : [];
                        setImageFiles(files);
                    }} />

                    <label className="cform-sublabel">Contenido</label>
                    <textarea className="cform-textarea" rows={10} placeholder="Texto del articulo" value={data.descripcion} onChange={(e) => setField("descripcion", e.target.value)} />
                </div>

                {data.imagen ? (
                    <div>
                        <label className="cform-sublabel">Vista previa</label>
                        <img src={optimizeCloudinaryImage(data.imagen, 600)} alt={data.titulo || "Vista previa"} style={{ width: "100%", maxWidth: 520, borderRadius: 12 }} />
                    </div>
                ) : null}
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <button className="cform-submit" onClick={handleSave} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
                {!isNew && (
                    try {
                    setLoading(true);
                const payload = {
                    titulo,
                    descripcion,
                    imagen: String(data.imagen || "").trim(),
                        };

                        // If image files selected, upload to Cloudinary and store array in imagenes
                        if (imageFiles && imageFiles.length > 0) {
                            const uploaded = [];
                for (let i = 0; i < imageFiles.length && i < 3; i++) {
                                try {
                                    const f = imageFiles[i];
                // no local compression here; upload directly (Cloudinary will optimize)
                const url = await uploadImageToCloudinary(f);
                if (url) uploaded.push({url});
                                } catch (e) {console.error('Error uploading noticia image', e); }
                            }
                            if (uploaded.length > 0) {
                    payload.imagenes = uploaded;
                // keep single-image compatibility
                payload.imagen = uploaded[0].url;
                            }
                        }

                if (isNew) {
                    payload.createdAt = serverTimestamp();
                await addDoc(collection(db, "blog"), payload);
                        } else {
                    payload.updatedAt = serverTimestamp();
                await setDoc(doc(db, "blog", id), payload, {merge: true });
                        }

                navigate("/admin/noticias");
                    } catch (err) {
                    console.error(err);
                alert("Error guardando: " + (err && err.message ? err.message : String(err)));
                    } finally {
                    setLoading(false);
                    }
            </div>
            );
}
