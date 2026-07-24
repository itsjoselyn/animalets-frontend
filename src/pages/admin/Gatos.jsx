import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { Button, Table, Tag, Space, Popconfirm, message, Card, Typography, Grid } from "antd";
import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    HeartOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function AdminGatos() {
    const [gatos, setGatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const navigate = useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const fetchGatos = async () => {
        setLoading(true);
        try {
            const q = collection(db, "gatos");
            const snap = await getDocs(q);
            const items = snap.docs.map((d) => {
                const docData = d.data() || {};
                const estado =
                    docData.estado || (docData.adoptado === true ? "adoptado" : "disponible");
                return { id: d.id, ...docData, estado };
            });
            setGatos(items);
        } catch (err) {
            console.error("Error cargando gatos:", err);
            message.error("Error al obtener la lista de gatos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGatos();
    }, []);

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            const dref = doc(db, "gatos", id);
            await deleteDoc(dref);
            setGatos((prev) => prev.filter((x) => x.id !== id));
            message.success("Gato eliminado correctamente");
        } catch (err) {
            console.error("Error borrando gato:", err);
            message.error("No se pudo eliminar el registro");
        } finally {
            setDeletingId(null);
        }
    };

    // Asignación de colores según el estado
    const renderEstadoTag = (estado) => {
        const estadoLower = String(estado || "").toLowerCase();
        let color = "default";

        if (estadoLower === "disponible") color = "green";
        if (estadoLower === "adoptado") color = "blue";
        if (estadoLower === "reservado" || estadoLower === "acogida") color = "orange";
        if (estadoLower === "urgente") color = "red";

        return <Tag color={color}>{estadoLower.toUpperCase() || "DESCONOCIDO"}</Tag>;
    };

    // Configuración de columnas para la tabla de Ant Design
    const columns = [
        {
            title: "Nombre",
            dataIndex: "nombre",
            key: "nombre",
            render: (text) => <strong>{text || "-"}</strong>,
            sorter: (a, b) => (a.nombre || "").localeCompare(b.nombre || ""),
        },
        {
            title: "Edad",
            key: "edad",
            render: (_, record) => record.edad ?? record.age ?? "-",
        },
        {
            title: "Sexo",
            key: "sexo",
            render: (_, record) => record.sexo ?? record.gender ?? "-",
        },
        {
            title: "Estado",
            dataIndex: "estado",
            key: "estado",
            render: (estado) => renderEstadoTag(estado),
            filters: [
                { text: "Disponible", value: "disponible" },
                { text: "Adoptado", value: "adoptado" },
            ],
            onFilter: (value, record) => record.estado?.toLowerCase() === value,
        },
        {
            title: "Acciones",
            key: "acciones",
            align: "center",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/gatos/${record.id}`)}
                    >
                        Editar
                    </Button>

                    <Popconfirm
                        title="Eliminar gato"
                        description={`¿Estás seguro de que deseas eliminar a ${record.nombre || "este gato"}?`}
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
            {/* Cabecera Adaptativa / Responsive */}
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
                    <HeartOutlined style={{ fontSize: isMobile ? 18 : 22, color: "#2e7d32" }} />
                    <Title level={isMobile ? 5 : 4} style={{ margin: 0, fontSize: isMobile ? 16 : undefined, color: "#2e7d32" }}>
                        Gestión de Gatos
                    </Title>
                </div>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/admin/gatos/new")}
                    block={isMobile}
                    style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32" }}
                >
                    Crear gato
                </Button>
            </div>

            <Table
                dataSource={gatos}
                columns={columns}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 8, showSizeChanger: true }}
                locale={{ emptyText: "No hay gatos registrados todavía." }}
                scroll={{ x: 600 }}
            />
        </Card>
    );
}   