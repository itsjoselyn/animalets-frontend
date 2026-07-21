import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import "../../components/sections/Contact/ContactForm.css";
import "./GatoEditor/GatoEditor.css";
import { EMPTY_TESTIMONY } from "../../utils/constants";
import { Button } from "antd";



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
            <h3>{isNew ? "Crear testimonio" : "Editar testimonio"}</h3>
            {loading && <p>Cargando...</p>}

            {/* Usamos un contendor Flex directo en lugar de la clase con estilos heredados */}
            <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>

                {/* Formulario a la izquierda */}
                <div style={{ flex: "1 1 400px" }}>
                    <label className="cform-sublabel">Título</label>
                    <input
                        className="cform-input"
                        placeholder="Título"
                        value={data.titulo}
                        onChange={(e) => setField("titulo", e.target.value)}
                    />

                    <label className="cform-sublabel">Descripción</label>
                    <textarea
                        className="cform-textarea"
                        rows={10}
                        placeholder="Descripción"
                        value={data.descripcion}
                        onChange={(e) => setField("descripcion", e.target.value)}
                    />
                </div>

                {/* Preview a la derecha (sin estilos que lo estiren hacia abajo) */}
                <aside style={{ flex: "1 1 300px", maxWidth: "450px" }}>
                    <div className="catprofile" style={{ minHeight: "auto" }}>
                        <div className="catprofile-body" style={{ paddingTop: 0 }}>
                            <div className="catprofile-hero">
                                <h1 className="catprofile-name">{data.titulo || "Título del testimonio"}</h1>
                            </div>
                            <p className="catprofile-bio">{data.descripcion || "Descripción del testimonio"}</p>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Botones pegados justo debajo */}
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
                <Button
                    type="primary"
                    htmlType="button"
                    onClick={handleSave}
                    loading={loading}
                >
                    Guardar
                </Button>
                {!isNew && (
                    <Button type="primary" onClick={handleDelete} disabled={loading} danger>
                        Eliminar
                    </Button>
                )}
                <Button onClick={() => navigate("/admin/testimonios")}>Cancelar</Button>
            </div>
        </div>
    );
}