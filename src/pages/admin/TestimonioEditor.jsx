import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import "../../components/contact/ContactForm.css";

const EMPTY = {
    nombre: "",
    preview: "",
    titulo: "",
    descripcion: "",
    imagen: "",
};

export default function TestimonioEditor() {
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
                    const snap = await getDoc(doc(db, "testimonios", id));
                    if (!snap.exists()) {
                        alert("Testimonio no encontrado");
                        navigate("/admin/testimonios");
                        return;
                    }
                    const docData = snap.data() || {};
                    if (!mounted) return;
                    setData({
                        nombre: docData.nombre || docData.name || "",
                        preview: docData.preview || "",
                        titulo: docData.titulo || docData.title || "",
                        descripcion: docData.descripcion || docData.texto || docData.body || "",
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
        const nombre = String(data.nombre || "").trim();
        const preview = String(data.preview || "").trim();
        const titulo = String(data.titulo || "").trim();
        const descripcion = String(data.descripcion || "").trim();

        if (!nombre || !preview || !titulo || !descripcion) {
            alert("Nombre, preview, titulo y descripcion son obligatorios");
            return;
        }

        try {
            setLoading(true);
            const payload = {
                nombre,
                preview,
                titulo,
                descripcion,
                imagen: String(data.imagen || "").trim(),
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

    return (
        <div>
            <h3>{isNew ? "Crear testimonio" : `Editar testimonio ${data.nombre || id}`}</h3>
            {loading && <p>Cargando...</p>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                    <label className="cform-sublabel">Nombre</label>
                    <input className="cform-input" placeholder="Nombre" value={data.nombre} onChange={(e) => setField("nombre", e.target.value)} />

                    <label className="cform-sublabel">Preview</label>
                    <textarea className="cform-textarea" rows={4} placeholder="Texto resumido" value={data.preview} onChange={(e) => setField("preview", e.target.value)} />

                    <label className="cform-sublabel">Titulo</label>
                    <input className="cform-input" placeholder="Titulo" value={data.titulo} onChange={(e) => setField("titulo", e.target.value)} />

                    <label className="cform-sublabel">Texto completo</label>
                    <textarea className="cform-textarea" rows={10} placeholder="Texto completo" value={data.descripcion} onChange={(e) => setField("descripcion", e.target.value)} />

                    <label className="cform-sublabel">Imagen</label>
                    <input className="cform-input" placeholder="https://..." value={data.imagen} onChange={(e) => setField("imagen", e.target.value)} />
                </div>

                <div>
                    <label className="cform-sublabel">Vista previa</label>
                    <div style={{ padding: 16, border: "1px solid #e5e5e5", borderRadius: 12 }}>
                        {data.imagen ? <img src={data.imagen} alt={data.nombre || "Testimonio"} style={{ width: "100%", borderRadius: 10, marginBottom: 12 }} /> : null}
                        <strong>{data.nombre || "Nombre"}</strong>
                        <p style={{ marginTop: 8 }}>{data.preview || "Preview"}</p>
                        <p style={{ whiteSpace: "pre-wrap" }}>{data.descripcion || "Texto completo"}</p>
                    </div>
                </div>
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
