import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

function formatDate(value) {
    if (!value) return "-";
    if (typeof value === "object" && typeof value.toDate === "function") {
        return value.toDate().toLocaleString("es-ES");
    }
    return new Date(value).toLocaleString("es-ES");
}

function toDisplayValue(value) {
    if (value === null || value === undefined || value === "") return "-";
    if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
}

export default function AdminSolicitudes() {
    const [items, setItems] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const snap = await getDocs(collection(db, "contactRequests"));
                const list = snap.docs.map((d) => {
                    const data = d.data() || {};
                    return {
                        id: d.id,
                        ...data,
                        createdAtValue: data.createdAt,
                    };
                });
                list.sort((a, b) => {
                    const getTime = (value) => {
                        const raw = value?.createdAtValue;
                        if (!raw) return 0;
                        if (typeof raw.toDate === "function") return raw.toDate().getTime();
                        return new Date(raw).getTime();
                    };
                    return getTime(b) - getTime(a);
                });
                setItems(list);
                setSelectedId((current) => current || list[0]?.id || null);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const selected = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId]);

    const markRead = async (item) => {
        try {
            await setDoc(doc(db, "contactRequests", item.id), { estado: "leido" }, { merge: true });
            setItems((prev) => prev.map((current) => current.id === item.id ? { ...current, estado: "leido" } : current));
        } catch (err) {
            console.error(err);
            alert("No se pudo actualizar la solicitud");
        }
    };

    const removeItem = async (item) => {
        if (!confirm("Eliminar esta solicitud?")) return;
        try {
            await deleteDoc(doc(db, "contactRequests", item.id));
            setItems((prev) => prev.filter((current) => current.id !== item.id));
            setSelectedId((current) => (current === item.id ? null : current));
        } catch (err) {
            console.error(err);
            alert("Error borrando");
        }
    };

    return (
        <div>
            <h3>Solicitudes de contacto</h3>
            {loading ? <p>Cargando...</p> : (
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
                    <div>
                        {items.length === 0 ? <p>No hay solicitudes todavia.</p> : (
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr>
                                        <th style={{ textAlign: "left", padding: 8 }}>Tipo</th>
                                        <th style={{ textAlign: "left", padding: 8 }}>Nombre</th>
                                        <th style={{ textAlign: "left", padding: 8 }}>Correo</th>
                                        <th style={{ textAlign: "left", padding: 8 }}>Estado</th>
                                        <th style={{ textAlign: "left", padding: 8 }}>Fecha</th>
                                        <th style={{ padding: 8 }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item) => (
                                        <tr
                                            key={item.id}
                                            style={{
                                                borderTop: "1px solid #eee",
                                                background: item.id === selectedId ? "#f5fbf5" : "transparent",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => setSelectedId(item.id)}
                                        >
                                            <td style={{ padding: 8 }}>{item.tipo || "-"}</td>
                                            <td style={{ padding: 8 }}>{item.nombre || "-"}</td>
                                            <td style={{ padding: 8 }}>{item.correo || "-"}</td>
                                            <td style={{ padding: 8 }}>{item.estado || "nuevo"}</td>
                                            <td style={{ padding: 8 }}>{formatDate(item.createdAtValue)}</td>
                                            <td style={{ padding: 8, whiteSpace: "nowrap" }}>
                                                <button className="cayudar-btn" onClick={(e) => { e.stopPropagation(); setSelectedId(item.id); }}>Ver</button>
                                                {(item.estado || "nuevo") !== "leido" && (
                                                    <button className="cayudar-btn" style={{ marginLeft: 8 }} onClick={(e) => { e.stopPropagation(); markRead(item); }}>
                                                        Marcar leido
                                                    </button>
                                                )}
                                                <button className="cayudar-btn" style={{ marginLeft: 8, background: "#e53935", color: "#fff" }} onClick={(e) => { e.stopPropagation(); removeItem(item); }}>
                                                    Borrar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <aside style={{ border: "1px solid #e5e5e5", borderRadius: 12, padding: 16, alignSelf: "start", position: "sticky", top: 16 }}>
                        <h4 style={{ marginTop: 0 }}>Detalle</h4>
                        {!selected ? (
                            <p>Selecciona una solicitud.</p>
                        ) : (
                            <div style={{ display: "grid", gap: 8 }}>
                                <div><strong>Tipo:</strong> {toDisplayValue(selected.tipo)}</div>
                                <div><strong>Nombre:</strong> {toDisplayValue(selected.nombre)}</div>
                                <div><strong>Correo:</strong> {toDisplayValue(selected.correo)}</div>
                                <div><strong>Telefono:</strong> {toDisplayValue(selected.telefono)}</div>
                                <div><strong>Edad:</strong> {toDisplayValue(selected.edad)}</div>
                                <div><strong>Estado:</strong> {toDisplayValue(selected.estado)}</div>
                                <div><strong>Fecha:</strong> {formatDate(selected.createdAtValue)}</div>
                                {selected.mensaje ? <div><strong>Mensaje:</strong><p style={{ whiteSpace: "pre-wrap" }}>{selected.mensaje}</p></div> : null}
                                <div>
                                    <strong>Campos extra:</strong>
                                    <pre style={{ whiteSpace: "pre-wrap", overflowX: "auto", margin: "8px 0 0" }}>
                                        {toDisplayValue(
                                            Object.fromEntries(
                                                Object.entries(selected).filter(([key]) =>
                                                    !["id", "createdAtValue", "createdAt", "estado", "tipo", "nombre", "correo", "telefono", "edad", "mensaje"].includes(key)
                                                )
                                            )
                                        )}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            )}
        </div>
    );
}
