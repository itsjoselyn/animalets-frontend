import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import "../../components/sections/Contact/ContactForm.css";
import "./GatoEditor.css";
import { EMPTY_TESTIMONY } from "../../utils/constants";



function makePreview(text, maxWords = 15) {
    if (!text) return "";
    const words = String(text).trim().split(/\s+/);
    if (words.length <= maxWords) return words.join(" ") + "...";
    return words.slice(0, maxWords).join(" ") + "...";
}

export default function TestimonioEditor() {
    const { id } = useParams();
    const isNew = id === undefined || id === "new";
    const [data, setData] = useState(EMPTY_TESTIMONY);
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
                    setData({
                        titulo: docData.titulo || docData.title || "",
                        descripcion: docData.descripcion || docData.texto || docData.body || "",
                    });
                } catch (err) {
                    console.error(err);
                    alert("Error cargando el documento");
                } finally {
                    if (mounted) setLoading(false);
                }
            })();
        } else {
            setData(EMPTY_TESTIMONY);
        }
        return () => {
            mounted = false;
        };
    }, [id, isNew, navigate]);

    const setField = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

    const handleSave = async () => {
        const titulo = String(data.titulo || "").trim();
        const descripcion = String(data.descripcion || "").trim();
        const preview = makePreview(descripcion, 15);

        if (!titulo || !descripcion) {
            alert("Titulo y descripcion son obligatorios");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                titulo,
                descripcion,
                preview,
            };

            if (isNew) {
                payload.createdAt = serverTimestamp();
                await addDoc(collection(db, "testimonios"), payload);
            } else {
                payload.updatedAt = serverTimestamp();
                await setDoc(doc(db, "testimonios", id), payload, { merge: true });
            }

            navigate("/admin/testimonios");
        } catch (err) {
            console.error(err);
            alert("Error guardando");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
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
    };

    return (
        <div>
            <h3>{isNew ? "Crear testimonio" : `Editar testimonio ${data.titulo || id}`}</h3>
            {loading && <p>Cargando...</p>}
            <div className="gato-editor-grid">
                <div className="gato-editor-form">
                    <label className="cform-sublabel">Titulo</label>
                    <input className="cform-input" placeholder="Titulo" value={data.titulo} onChange={(e) => setField("titulo", e.target.value)} />

                    <label className="cform-sublabel">Descripcion</label>
                    <textarea className="cform-textarea" rows={10} placeholder="Descripcion" value={data.descripcion} onChange={(e) => setField("descripcion", e.target.value)} />
                </div>

                <aside className="gato-editor-preview">
                    <div className="catprofile">
                        <div className="catprofile-body" style={{ paddingTop: 0 }}>
                            <div className="catprofile-hero">
                                <h1 className="catprofile-name">{data.titulo || "Título del testimonio"}</h1>
                            </div>
                            <p className="catprofile-bio">{data.descripcion || "Descripción del testimonio"}</p>
                        </div>
                    </div>
                </aside>
            </div>

            <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                <button className="cform-submit" onClick={handleSave} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
                {!isNew && (
                    <button
                        className="cayudar-btn"
                        onClick={handleDelete}
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
