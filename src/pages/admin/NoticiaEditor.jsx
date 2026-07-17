import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "../../components/sections/Contact/ContactForm.css";
import "./GatoEditor.css";
import BlogArticleView from "../../components/sections/Blog/BlogArticleView";
import { compressForUpload } from "../../lib/imageUtils";
import { uploadImageToCloudinary } from "../../lib/uploadImageToCloudinary";
import { EMPTY_NEWS } from "../../utils/constants";


export default function NoticiaEditor() {
    const { id } = useParams();
    const isNew = id === undefined || id === "new";
    const [data, setData] = useState(EMPTY);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [loading, setLoading] = useState(false);
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

                    const images = Array.isArray(docData.imagenes) && docData.imagenes.length > 0
                        ? docData.imagenes
                            .map((item) => {
                                if (!item) return null;
                                if (typeof item === "string") return { url: item };
                                return { url: item.url || item.src || item.image || null };
                            })
                            .filter((item) => item && item.url)
                        : (docData.imagen || docData.image || docData.img
                            ? [{ url: docData.imagen || docData.image || docData.img }]
                            : []);
                    const firstImage = images[0] || null;
                    setData({
                        titulo: docData.titulo || docData.title || "",
                        descripcion: docData.descripcion || docData.body || docData.text || "",
                        imagenes: images,
                    });
                    setImagenPreview(firstImage);
                } catch (err) {
                    console.error(err);
                    alert("Error cargando el documento");
                } finally {
                    if (mounted) setLoading(false);
                }
            })();
        } else {
            setData(EMPTY_NEWS);
            setImagenPreview(null);
        }

        return () => {
            mounted = false;
        };
    }, [id, isNew, navigate]);

    const setField = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

    const handleDeleteImage = async (imgEntry) => {
        if (!confirm("¿Borrar esta imagen?")) return;

        setImagenPreview(null);
        setData((prev) => ({
            ...prev,
            imagenes: [],
        }));
    };

    const handleAddImage = (file) => {
        if (!file) return;

        const next = {
            file,
            url: URL.createObjectURL(file),
        };

        setImagenPreview(next);
        setData((prev) => ({
            ...prev,
            imagenes: [next],
        }));
    };

    const handleSave = async () => {
        const titulo = String(data.titulo || "").trim();
        const descripcion = String(data.descripcion || "").trim();
        const errors = [];

        if (!titulo) errors.push("El titulo es obligatorio");
        if (!descripcion) errors.push("La descripcion es obligatoria");
        if (!imagenPreview) errors.push("Debes añadir al menos una imagen");

        if (errors.length > 0) {
            alert("Errores:\n" + errors.join("\n"));
            return;
        }

        try {
            setLoading(true);

            let uploadedImage = null;
            if (imagenPreview?.file) {
                const compressed = await compressForUpload(imagenPreview.file, { maxWidth: 1400, quality: 0.78, preferWebP: true });
                const url = await uploadImageToCloudinary(compressed, "blog");
                uploadedImage = { url };
            } else if (imagenPreview?.url) {
                uploadedImage = { url: imagenPreview.url };
            }

            const payload = {
                titulo,
                descripcion,
                imagenes: uploadedImage ? [uploadedImage] : [],
            };

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
            alert("Error guardando");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("¿Seguro que quieres eliminar esta noticia? Esta acción no se puede deshacer.")) return;

        try {
            setLoading(true);
            await deleteDoc(doc(db, "blog", id));
            navigate("/admin/noticias");
        } catch (err) {
            console.error(err);
            alert("Error borrando");
        } finally {
            setLoading(false);
        }
    };

    const previewPost = {
        id: id || "preview",
        title: data.titulo,
        body: data.descripcion,
        imagenes: imagenPreview ? [imagenPreview] : [],
        createdAt: null,
        updatedAt: null,
    };

    return (
        <div>
            <h3>{isNew ? "Crear noticia" : `Editar noticia ${data.titulo || id}`}</h3>
            {loading && <p>Cargando...</p>}

            <div className="gato-editor-grid">
                <div className="gato-editor-form">
                    <label className="cform-sublabel">Titulo</label>
                    <input className="cform-input" placeholder="Titulo" value={data.titulo} onChange={(e) => setField("titulo", e.target.value)} />

                    <label className="cform-sublabel">Descripcion</label>
                    <textarea className="cform-textarea" rows={10} placeholder="Texto del articulo" value={data.descripcion} onChange={(e) => setField("descripcion", e.target.value)} />

                    <label className="cform-sublabel">Imagenes</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                            handleAddImage(e.target.files?.[0]);
                            e.target.value = "";
                        }}
                    />

                    {imagenPreview && (
                        <div style={{ width: 220, marginTop: 8 }}>
                            <img src={imagenPreview.url} alt={data.titulo || "Vista previa"} style={{ width: "100%", borderRadius: 8 }} />
                            <button type="button" className="cayudar-btn" onClick={() => handleDeleteImage(imagenPreview)}>
                                Eliminar
                            </button>
                        </div>
                    )}

                    <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                        <button className="cform-submit" onClick={handleSave} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
                        {!isNew && <button className="cayudar-btn" onClick={handleDelete} disabled={loading} style={{ background: "#e53935", color: "#fff" }}>Eliminar</button>}
                        <button className="cayudar-btn" onClick={() => navigate("/admin/noticias")}>Cancelar</button>
                    </div>
                </div>

                <aside className="gato-editor-preview">
                    <BlogArticleView post={previewPost} preview />
                </aside>
            </div>
        </div>
    );
}
