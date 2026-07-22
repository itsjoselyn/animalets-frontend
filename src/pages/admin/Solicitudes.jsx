import { useEffect, useMemo, useState } from "react";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import "./Solicitudes.css";
import { TYPE_LABELS, STATUS_LABELS } from "../../utils/constants";
import { Button, Grid, Select, Popconfirm, message, Card, Typography, Space, Empty } from "antd";
import { LeftOutlined, DeleteOutlined, CheckOutlined, ExclamationCircleOutlined, MailOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

function formatDate(value) {
    if (!value) return "-";
    if (typeof value === "object" && typeof value.toDate === "function") {
        return value.toDate().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
    }
    return new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function toDisplayValue(value) {
    if (value === null || value === undefined || value === "") return "-";
    if (Array.isArray(value)) return value.length ? value.join(", ") : "-";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
}

function getTypeValue(item) {
    return String(item.tipo || item.tipoSolicitud || item.tipo_solicitud || "otros").toLowerCase();
}

function getStatusValue(item) {
    return String(item.estado || "nuevo").toLowerCase();
}

function getTimestampMs(value) {
    if (!value) return 0;
    if (typeof value?.toDate === "function") return value.toDate().getTime();
    return new Date(value).getTime() || 0;
}

function getFriendlyType(item) {
    const value = getTypeValue(item);
    return TYPE_LABELS[value] || TYPE_LABELS.otros;
}

function getFriendlyStatus(item) {
    const value = getStatusValue(item);
    return STATUS_LABELS[value] || STATUS_LABELS.nuevo;
}

function renderExtraFieldLabel(key) {
    const labels = {
        mensaje: "Mensaje",
        text: "Mensaje",
        nota: "Nota",
        motivo: "Motivo",
        animal: "Animal",
        gato: "Gato",
        nombreGato: "Gato",
        tipoHogar: "Tipo de hogar",
        tiempoAcogida: "Tiempo de acogida",
        experienciaAcogida: "Experiencia en acogida",
        tieneAnimalesCasa: "Tiene animales en casa",
        animalesActuales: "Animales actuales",
        animalesActualesTexto: "Detalles de animales actuales",
        hayPersonasCasa: "¿Hay más personas en casa?",
        personasAdoptar: "Edades / Detalles de personas en casa",
        personasEnCasa: "Número de personas en casa",
        tieneExperienciaGatos: "Tiene experiencia con gatos",
        tipoVivienda: "Tipo de vivienda",
        gatoEnMente: "Gato en mente",
        tipoAportacion: "Tipo de aportación",
        cantidadAportacion: "Cantidad de aportación",
        telefono: "Teléfono",
        edad: "Edad",
        correo: "Correo",
        nombre: "Nombre",
    };
    return labels[key] || key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function renderExtraValue(key, value) {
    if (typeof value === "boolean") return value ? "Sí" : "No";
    if (Array.isArray(value)) return value.length ? value.join(", ") : "";
    if (typeof value === "object" && value !== null) return "";
    return String(value);
}

function getExtraFields(item) {
    const ignored = new Set([
        "id", "createdAtValue", "createdAt", "estado", "tipo", "tipoSolicitud",
        "tipo_solicitud", "nombre", "name", "correo", "email", "telefono",
        "edad", "mensaje", "text", "preview", "titulo", "title", "descripcion", "body"
    ]);

    const seenLabels = new Set();

    return Object.entries(item)
        .filter(([key, value]) => !ignored.has(key) && value !== null && value !== undefined && value !== "")
        .filter(([, value]) => !(typeof value === "object" && !Array.isArray(value)))
        .map(([key, value]) => {
            const label = renderExtraFieldLabel(key);
            const formattedValue = renderExtraValue(key, value);
            return { key, label, value: formattedValue };
        })
        .filter((field) => field.value !== "")
        .filter((field) => {
            if (seenLabels.has(field.label)) return false;
            seenLabels.add(field.label);
            return true;
        });
}

export default function AdminSolicitudes() {
    const [items, setItems] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("todas");
    const [typeFilter, setTypeFilter] = useState("todos");

    const screens = useBreakpoint();
    const isMobile = !screens.md;

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
                list.sort((a, b) => getTimestampMs(b.createdAtValue) - getTimestampMs(a.createdAtValue));
                setItems(list);

                if (screens.md) {
                    setSelectedId(list[0]?.id || null);
                }
            } catch (err) {
                console.error(err);
                message.error("Error al cargar las solicitudes");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [screens.md]);

    const selected = useMemo(() => items.find((item) => item.id === selectedId) || null, [items, selectedId]);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const status = getStatusValue(item);
            const type = getTypeValue(item);
            const matchesStatus = statusFilter === "todas" || status === statusFilter;
            const matchesType = typeFilter === "todos" || type === typeFilter;
            return matchesStatus && matchesType;
        });
    }, [items, statusFilter, typeFilter]);

    const visibleSelected = selected && filteredItems.some((item) => item.id === selected.id)
        ? selected
        : (isMobile ? null : filteredItems[0] || null);

    const pendingCount = useMemo(() => items.filter((item) => getStatusValue(item) === "nuevo").length, [items]);

    const detailSections = useMemo(() => {
        if (!visibleSelected) return [];
        const infoPersonal = [
            { label: "Nombre", value: visibleSelected.nombre || visibleSelected.name },
            { label: "Correo", value: visibleSelected.correo || visibleSelected.email },
            { label: "Teléfono", value: visibleSelected.telefono },
            { label: "Edad", value: visibleSelected.edad },
        ].filter((field) => field.value !== undefined && field.value !== null && field.value !== "");

        const solicitud = [
            { label: "Tipo de solicitud", value: getFriendlyType(visibleSelected) },
            { label: "Mensaje completo", value: visibleSelected.mensaje || visibleSelected.text || visibleSelected.body || "" },
        ].filter((field) => field.value !== undefined && field.value !== null && field.value !== "");

        const extra = getExtraFields(visibleSelected);

        return [
            { title: "Información personal", fields: infoPersonal },
            { title: "Solicitud", fields: solicitud },
            { title: "Información adicional", fields: extra },
        ];
    }, [visibleSelected]);

    const markRead = async (item) => {
        try {
            await setDoc(doc(db, "contactRequests", item.id), { estado: "leido" }, { merge: true });
            setItems((prev) => prev.map((current) => current.id === item.id ? { ...current, estado: "leido" } : current));
            message.success("Marcado como leído");
        } catch (err) {
            console.error(err);
            message.error("No se pudo actualizar la solicitud");
        }
    };

    const removeItem = async (item) => {
        try {
            await deleteDoc(doc(db, "contactRequests", item.id));
            setItems((prev) => prev.filter((current) => current.id !== item.id));
            setSelectedId((current) => (current === item.id ? null : current));
            message.success("Solicitud eliminada correctamente");
        } catch (err) {
            console.error(err);
            message.error("Error al borrar la solicitud");
        }
    };

    return (
        <div className="solicitudes-panel">
            <div className="solicitudes-header">
                <div>
                    <Title level={3} style={{ color: "#2e7d32", margin: 0 }}>
                        Solicitudes de contacto
                    </Title>
                    <Text type="secondary">Gestiona aquí todas las peticiones recibidas desde la web.</Text>
                </div>
                <div className="solicitudes-counter">
                    <span className="solicitudes-counter-label">Pendientes</span>
                    <strong>{pendingCount}</strong>
                </div>
            </div>

            {loading ? <p>Cargando...</p> : (
                <div className="solicitudes-layout">
                    {/* Lista: Se oculta en móvil si hay una solicitud seleccionada */}
                    {(!isMobile || !selectedId) && (
                        <section className="solicitudes-list-panel">
                            <div className="solicitudes-filters" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <span style={{ display: "block", fontSize: 12, color: "#595959", marginBottom: 4 }}>Estado</span>
                                    <Select
                                        style={{ width: "100%" }}
                                        value={statusFilter}
                                        onChange={(val) => setStatusFilter(val)}
                                        options={[
                                            { value: "todas", label: "Todas" },
                                            { value: "nuevo", label: "Nuevas" },
                                            { value: "leido", label: "Leídas" },
                                        ]}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ display: "block", fontSize: 12, color: "#595959", marginBottom: 4 }}>Tipo</span>
                                    <Select
                                        style={{ width: "100%" }}
                                        value={typeFilter}
                                        onChange={(val) => setTypeFilter(val)}
                                        options={[
                                            { value: "todos", label: "Todos" },
                                            { value: "acogida", label: "Acogida" },
                                            { value: "adopcion", label: "Adopción" },
                                            { value: "apadrinar", label: "Apadrinamiento" },
                                            { value: "voluntariado", label: "Voluntariado" },
                                            { value: "otros", label: "Otros" },
                                        ]}
                                    />
                                </div>
                            </div>

                            {filteredItems.length === 0 ? (
                                <Empty description="No hay solicitudes para los filtros seleccionados." style={{ margin: "40px 0" }} />
                            ) : (
                                <div className="solicitudes-cards">
                                    {filteredItems.map((item) => {
                                        const status = getStatusValue(item);
                                        return (
                                            <article
                                                key={item.id}
                                                className={`solicitud-card${item.id === selectedId ? " solicitud-card--active" : ""}`}
                                                onClick={() => setSelectedId(item.id)}
                                            >
                                                <div className="solicitud-card-main">
                                                    <div className="solicitud-card-top">
                                                        <span className="solicitud-card-type">{getFriendlyType(item)}</span>
                                                        <span className={`solicitud-badge solicitud-badge--${status}`}>{getFriendlyStatus(item)}</span>
                                                    </div>
                                                    <h4 className="solicitud-card-name">{item.nombre || "Sin nombre"}</h4>
                                                    <p className="solicitud-card-email">{item.correo || item.email || "Sin correo"}</p>
                                                    <p className="solicitud-card-date">{formatDate(item.createdAtValue)}</p>
                                                </div>
                                                <div className="solicitud-card-actions">
                                                    {status === "nuevo" && (
                                                        <Button
                                                            size="small"
                                                            icon={<CheckOutlined />}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markRead(item);
                                                            }}
                                                        >
                                                            Marcar leído
                                                        </Button>
                                                    )}

                                                    <Popconfirm
                                                        title="Eliminar solicitud"
                                                        description="¿Estás seguro de eliminar esta solicitud?"
                                                        icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                                                        onConfirm={() => removeItem(item)}
                                                        okText="Sí, eliminar"
                                                        cancelText="Cancelar"
                                                        okButtonProps={{ danger: true }}
                                                    >
                                                        <Button
                                                            type="primary"
                                                            danger
                                                            size="small"
                                                            icon={<DeleteOutlined />}
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            Borrar
                                                        </Button>
                                                    </Popconfirm>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    )}

                    {/* Detalle: Se oculta en móvil si NO hay ninguna solicitud seleccionada */}
                    {(!isMobile || selectedId) && (
                        <aside className="solicitudes-detail-panel">
                            {isMobile && selectedId && (
                                <Button
                                    icon={<LeftOutlined />}
                                    onClick={() => setSelectedId(null)}
                                    style={{ marginBottom: 16 }}
                                >
                                    Volver a la lista
                                </Button>
                            )}

                            <Title level={4} style={{ marginTop: 0 }}>Detalle de solicitud</Title>
                            {!visibleSelected ? (
                                <Text type="secondary">Selecciona una solicitud para ver sus detalles.</Text>
                            ) : (
                                <div className="solicitudes-detail">
                                    <div className="solicitudes-detail-meta">
                                        <span className="solicitud-card-type">{getFriendlyType(visibleSelected)}</span>
                                        <span className={`solicitud-badge solicitud-badge--${getStatusValue(visibleSelected)}`}>{getFriendlyStatus(visibleSelected)}</span>
                                    </div>

                                    {detailSections.map((section) => (
                                        <section key={section.title} className="solicitudes-detail-section">
                                            <h5>{section.title}</h5>
                                            <div className="solicitudes-detail-fields">
                                                {section.fields.length === 0 ? (
                                                    <p className="solicitudes-detail-empty">Sin datos</p>
                                                ) : (
                                                    section.fields.map((field) => (
                                                        <div key={field.label} className="solicitudes-detail-field">
                                                            <span className="solicitudes-detail-label">{field.label}</span>
                                                            <span className="solicitudes-detail-value" style={{ whiteSpace: field.label === "Mensaje completo" ? "pre-wrap" : "normal" }}>
                                                                {toDisplayValue(field.value)}
                                                            </span>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </section>
                                    ))}
                                </div>
                            )}
                        </aside>
                    )}
                </div>
            )}
        </div>
    );
}