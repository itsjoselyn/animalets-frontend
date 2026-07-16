import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";

function formatDate(value) {
    if (!value) return "-";
    if (typeof value === "object" && typeof value.toDate === "function") {
        return value.toDate().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
    }
    return new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function makePreview(text, maxWords = 15) {
    if (!text) return "";
    const words = String(text).trim().split(/\s+/);
    if (words.length <= maxWords) return words.join(" ") + "...";
    return words.slice(0, maxWords).join(" ") + "...";
}

export default function AdminTestimonios() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const snap = await getDocs(collection(db, "testimonios"));
                const list = snap.docs.map((d) => {
                    const data = d.data() || {};
                    const ts = data.updatedAt || data.createdAt;
                    const preview = data.preview || makePreview(data.descripcion || data.texto || data.body || "");
                    return {
                        id: d.id,
                        titulo: data.titulo || data.title || "",
                        preview: data.preview || "",
                        descripcion: data.descripcion || data.texto || data.body || "",
                        date: formatDate(ts),
                        sortTime: ts,
                        generatedPreview: preview,
                    };
                });
                list.sort((a, b) => {
                    const getTime = (raw) => {
                        if (!raw) return 0;
                        if (typeof raw.toDate === "function") return raw.toDate().getTime();
                        return new Date(raw).getTime();
                    };
                    return getTime(b.sortTime) - getTime(a.sortTime);
                });
                setItems(list);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            <h3>Testimonios</h3>
            {loading ? <p>Cargando...</p> : (
                <>
                    <div style={{ marginBottom: 12 }}>
                        <button className="cayudar-btn" onClick={() => navigate("/admin/testimonios/new")}>Crear testimonio</button>
                    </div>

                    {items.length === 0 ? <p>No hay testimonios todavia.</p> : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", padding: 8 }}>Titulo</th>
                                    <th style={{ textAlign: "left", padding: 8 }}>Preview</th>
                                    <th style={{ textAlign: "left", padding: 8 }}>Fecha</th>
                                    <th style={{ padding: 8 }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} style={{ borderTop: "1px solid #eee" }}>
                                        <td style={{ padding: 8 }}>{item.titulo || "-"}</td>
                                        <td style={{ padding: 8 }}>{item.preview || item.generatedPreview || "-"}</td>
                                        <td style={{ padding: 8 }}>{item.date}</td>
                                        <td style={{ padding: 8 }}>
                                            <button className="cayudar-btn" onClick={() => navigate(`/admin/testimonios/${item.id}`)}>Editar</button>
                                            <button
                                                className="cayudar-btn"
                                                style={{ marginLeft: 8, background: "#e53935", color: "#fff" }}
                                                onClick={async () => {
                                                    if (!confirm("Eliminar este testimonio?")) return;
                                                    try {
                                                        await deleteDoc(doc(db, "testimonios", item.id));
                                                        setItems((prev) => prev.filter((it) => it.id !== item.id));
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert("Error borrando");
                                                    }
                                                }}
                                            >
                                                Borrar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
}
