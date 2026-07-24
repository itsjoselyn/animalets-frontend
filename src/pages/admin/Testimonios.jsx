import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import {
    Button,
    Table,
    Space,
    Popconfirm,
    message,
    Card,
    Typography,
    Grid,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    MessageOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

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
    const [deletingId, setDeletingId] = useState(null);

    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const fetchTestimonios = async () => {
        setLoading(true);
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
                    return new Date(raw).getTime() || 0;
                };
                return getTime(b.sortTime) - getTime(a.sortTime);
            });

            setItems(list);
        } catch (err) {
            console.error("Error cargando testimonios:", err);
            message.error("Error al obtener la lista de testimonios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonios();
    }, []);

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteDoc(doc(db, "testimonios", id));
            setItems((prev) => prev.filter((it) => it.id !== id));
            message.success("Testimonio eliminado correctamente");
        } catch (err) {
            console.error("Error eliminando testimonio:", err);
            message.error("No se pudo eliminar el testimonio");
        } finally {
            setDeletingId(null);
        }
    };

    const columns = [
        {
            title: "Título",
            dataIndex: "titulo",
            key: "titulo",
            render: (text) => (
                <Text strong style={{ color: "#262626" }}>
                    {text || "-"}
                </Text>
            ),
            sorter: (a, b) => (a.titulo || "").localeCompare(b.titulo || ""),
        },
        {
            title: "Preview",
            key: "preview",
            render: (_, record) => (
                <Text type="secondary" ellipsis style={{ maxWidth: 300, display: "inline-block" }}>
                    {record.preview || record.generatedPreview || "-"}
                </Text>
            ),
        },
        {
            title: "Fecha",
            dataIndex: "date",
            key: "date",
            width: 150,
            render: (dateStr) => <Text type="secondary">{dateStr || "-"}</Text>,
        },
        {
            title: "Acciones",
            key: "acciones",
            align: "center",
            width: 200,
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/testimonios/${record.id}`)}
                    >
                        Editar
                    </Button>

                    <Popconfirm
                        title="Eliminar testimonio"
                        description={`¿Estás seguro de eliminar el testimonio "${record.titulo || ""}"?`}
                        icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                        onConfirm={() => handleDelete(record.id)}
                        okText="Sí, eliminar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true, loading: deletingId === record.id }}
                    >
                        <Button type="primary" danger icon={<DeleteOutlined />}>
                            Borrar
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Card bodyStyle={{ padding: isMobile ? 12 : 24 }}>
            {/* Cabecera Responsiva */}
            <div
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "stretch" : "center",
                    gap: 12,
                    marginBottom: 20,
                    borderBottom: "1px solid #f0f0f0",
                    paddingBottom: 16,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <MessageOutlined style={{ fontSize: isMobile ? 18 : 22, color: "#2e7d32" }} />
                    <Title level={isMobile ? 5 : 4} style={{ margin: 0, fontSize: isMobile ? 16 : undefined, color: "#2e7d32" }}>
                        Gestión de Testimonios
                    </Title>
                </div>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/admin/testimonios/new")}
                    block={isMobile}
                    style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32" }}
                >
                    Crear testimonio
                </Button>
            </div>

            {/* Tabla Ant Design */}
            <Table
                dataSource={items}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 8, showSizeChanger: true }}
                locale={{ emptyText: "No hay testimonios registrados todavía." }}
                scroll={{ x: 600 }}
            />
        </Card>
    );
}