import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "../../components/contact/ContactForm.css";

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

        try {
            setLoading(true);
            const payload = {
                titulo,
                descripcion,
                imagen: String(data.imagen || "").trim(),
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

    return (
        <div>
            <h3>{isNew ? "Crear noticia" : `Editar noticia ${data.titulo || id}`}</h3>
            {loading && <p>Cargando...</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, maxWidth: 900 }}>
                <div>
                    <label className="cform-sublabel">Titulo</label>
                    <input className="cform-input" placeholder="Titulo" value={data.titulo} onChange={(e) => setField("titulo", e.target.value)} />

                    <label className="cform-sublabel">Imagen</label>
                    <input className="cform-input" placeholder="https://..." value={data.imagen} onChange={(e) => setField("imagen", e.target.value)} />

                    <label className="cform-sublabel">Contenido</label>
                    <textarea className="cform-textarea" rows={10} placeholder="Texto del articulo" value={data.descripcion} onChange={(e) => setField("descripcion", e.target.value)} />
                </div>

                {data.imagen ? (
                    <div>
                        <label className="cform-sublabel">Vista previa</label>
                        <img src={data.imagen} alt={data.titulo || "Vista previa"} style={{ width: "100%", maxWidth: 520, borderRadius: 12 }} />
                    </div>
                ) : null}
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <button className="cform-submit" onClick={handleSave} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
                {!isNew && (
                    <button
                        className="cayudar-btn"
                        onClick={async () => {
                            if (!confirm("Seguro que quieres eliminar esta noticia?")) return;
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
                        }}
                        disabled={loading}
                        style={{ background: "#e53935", color: "#fff" }}
                    >
                        Eliminar
                    </button>
                )}
                <button className="cayudar-btn" onClick={() => navigate("/admin/noticias")}>Cancelar</button>
            </div>
        </div>
    );
}
