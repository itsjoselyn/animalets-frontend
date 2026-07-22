import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { optimizeCloudinaryImage } from "../../lib/optimizeCloudinaryImage";
import {
    formatBlogDate,
    getFirestoreTimestampMs,
    normalizeBlogImages,
} from "../../components/sections/Blog/blogUtils";

import {
    Button,
    Table,
    Space,
    Popconfirm,
    message,
    Card,
    Image,
    Typography,
    Grid,
} from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    FileTextOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

export default function AdminNoticias() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const fetchNoticias = async () => {
        setLoading(true);
        try {
            const snap = await getDocs(collection(db, "blog"));
            const items = snap.docs.map((d) => {
                const data = d.data() || {};
                const images = normalizeBlogImages(data);
                const publishedAt = data.createdAt || data.updatedAt;
                return {
                    id: d.id,
                    titulo: data.titulo || data.title || "",
                    descripcion: data.descripcion || data.body || data.text || "",
                    imagenes: images,
                    imagen: images[0] || "",
                    createdAt: data.createdAt,
                    updatedAt: data.updatedAt,
                    date: formatBlogDate(publishedAt),
                    updatedDate: formatBlogDate(data.updatedAt),
                    sortTime: getFirestoreTimestampMs(data.updatedAt || data.createdAt),
                };
            });

            items.sort((a, b) => b.sortTime - a.sortTime);
            setPosts(items);
        } catch (err) {
            console.error("Error cargando noticias:", err);
            message.error("Error al obtener la lista de noticias");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNoticias();
    }, []);

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await deleteDoc(doc(db, "blog", id));
            setPosts((prev) => prev.filter((item) => item.id !== id));
            message.success("Noticia eliminada correctamente");
        } catch (err) {
            console.error("Error eliminando noticia:", err);
            message.error("No se pudo eliminar la noticia");
        } finally {
            setDeletingId(null);
        }
    };

    const columns = [
        {
            title: "Imagen",
            dataIndex: "imagen",
            key: "imagen",
            width: 90,
            render: (imgUrl, record) => {
                if (!imgUrl) return <Text type="secondary">-</Text>;
                const optimized = optimizeCloudinaryImage(imgUrl, { width: 160, height: 120, crop: "fill" });
                return (
                    <Image
                        src={optimized}
                        alt={record.titulo}
                        width={60}
                        height={45}
                        style={{ objectFit: "cover", borderRadius: 6 }}
                        fallback="https://via.placeholder.com/60x45?text=Sin+Foto"
                    />
                );
            },
        },
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
            title: "Fecha de publicación",
            dataIndex: "date",
            key: "date",
            width: 180,
            render: (dateStr) => <Text type="secondary">{dateStr || "-"}</Text>,
            sorter: (a, b) => a.sortTime - b.sortTime,
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
                        onClick={() => navigate(`/admin/noticias/${record.id}`)}
                    >
                        Editar
                    </Button>

                    <Popconfirm
                        title="Eliminar noticia"
                        description={`¿Estás seguro de que deseas eliminar "${record.titulo || "esta noticia"}"?`}
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
            {/* Cabecera Adaptativa y Responsiva */}
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
                    <FileTextOutlined style={{ fontSize: isMobile ? 18 : 22, color: "#2e7d32" }} />
                    <Title level={isMobile ? 5 : 4} style={{ margin: 0, fontSize: isMobile ? 16 : undefined, color: "#2e7d32" }}>
                        Gestión de Noticias y Blog
                    </Title>
                </div>

                {/* Botón con el verde corporativo exacto de crear gatos */}
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/admin/noticias/new")}
                    block={isMobile}
                    style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32" }}
                >
                    Crear noticia
                </Button>
            </div>

            {/* Tabla */}
            <Table
                dataSource={posts}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 8, showSizeChanger: true }}
                locale={{ emptyText: "No hay noticias registradas todavía." }}
                scroll={{ x: 500 }}
            />
        </Card>
    );
}