import { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { EMPTY_TESTIMONY } from "../../utils/constants";
import {
    Button,
    Card,
    Form,
    Input,
    Space,
    Popconfirm,
    message,
    Spin,
    Typography,
    Grid,
} from "antd";
import {
    SaveOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    ExclamationCircleOutlined,
    MessageOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

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
    const [saving, setSaving] = useState(false);

    const navigate = useNavigate();
    const [form] = Form.useForm();
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    useEffect(() => {
        let mounted = true;
        if (!isNew) {
            setLoading(true);
            (async () => {
                try {
                    const snap = await getDoc(doc(db, "testimonios", id));
                    if (!snap.exists()) {
                        message.error("Testimonio no encontrado");
                        navigate("/admin/testimonios", { replace: true });
                        return;
                    }
                    const docData = snap.data() || {};
                    if (!mounted) return;

                    const loadedData = {
                        titulo: docData.titulo || docData.title || "",
                        descripcion: docData.descripcion || docData.texto || docData.body || "",
                    };

                    setData(loadedData);
                    form.setFieldsValue(loadedData);
                } catch (err) {
                    console.error("Error cargando testimonio:", err);
                    message.error("Error al cargar el documento");
                } finally {
                    if (mounted) setLoading(false);
                }
            })();
        } else {
            setData(EMPTY_TESTIMONY);
            form.resetFields();
        }
        return () => {
            mounted = false;
        };
    }, [id, isNew, navigate, form]);

    const handleValuesChange = (_, allValues) => {
        setData({
            titulo: allValues.titulo || "",
            descripcion: allValues.descripcion || "",
        });
    };

    const handleSave = async (values) => {
        const titulo = String(values.titulo || "").trim();
        const descripcion = String(values.descripcion || "").trim();
        const preview = makePreview(descripcion, 15);

        try {
            setSaving(true);
            const payload = {
                titulo,
                descripcion,
                preview,
            };

            if (isNew) {
                payload.createdAt = serverTimestamp();
                await addDoc(collection(db, "testimonios"), payload);
                message.success("Testimonio creado correctamente");
            } else {
                payload.updatedAt = serverTimestamp();
                await setDoc(doc(db, "testimonios", id), payload, { merge: true });
                message.success("Testimonio actualizado correctamente");
            }

            navigate("/admin/testimonios");
        } catch (err) {
            console.error("Error guardando testimonio:", err);
            message.error("Error al guardar el testimonio");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        try {
            setSaving(true);
            await deleteDoc(doc(db, "testimonios", id));
            message.success("Testimonio eliminado correctamente");
            navigate("/admin/testimonios");
        } catch (err) {
            console.error("Error borrando testimonio:", err);
            message.error("No se pudo eliminar el testimonio");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "60px 16px" }}>
                <Spin size="large" tip="Cargando testimonio..." />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: 40 }}>
            {/* Cabecera adaptativa */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 20,
                }}
            >
                <Title level={3} style={{ margin: 0, color: "#2e7d32" }}>
                    {isNew ? "Crear testimonio" : `Editar testimonio: ${data.titulo || id}`}
                </Title>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/admin/testimonios")}
                >
                    Volver
                </Button>
            </div>

            {/* Grid principal */}
            <div
                style={{
                    display: "flex",
                    gap: "24px",
                    alignItems: "flex-start",
                    flexDirection: isMobile ? "column" : "row",
                }}
            >
                {/* Formulario a la izquierda */}
                <Card title="Datos del testimonio" style={{ flex: "1 1 50%", width: "100%" }}>
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSave}
                        onValuesChange={handleValuesChange}
                        initialValues={data}
                    >
                        <Form.Item
                            label="Título"
                            name="titulo"
                            rules={[{ required: true, message: "El título es obligatorio" }]}
                        >
                            <Input placeholder="Ej: Una adopción maravillosa" size="large" />
                        </Form.Item>

                        <Form.Item
                            label="Descripción"
                            name="descripcion"
                            rules={[{ required: true, message: "La descripción es obligatoria" }]}
                        >
                            <Input.TextArea
                                rows={8}
                                placeholder="Escribe aquí la experiencia o testimonio..."
                                showCount
                            />
                        </Form.Item>

                        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
                            <Space wrap size="middle">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={saving}
                                    size="large"
                                >
                                    Guardar
                                </Button>

                                {!isNew && (
                                    <Popconfirm
                                        title="Eliminar testimonio"
                                        description="¿Seguro que quieres eliminar este testimonio? Esta acción no se puede deshacer."
                                        icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                                        onConfirm={handleDelete}
                                        okText="Sí, eliminar"
                                        cancelText="Cancelar"
                                        okButtonProps={{ danger: true, loading: saving }}
                                    >
                                        <Button type="primary" danger icon={<DeleteOutlined />} size="large">
                                            Eliminar
                                        </Button>
                                    </Popconfirm>
                                )}

                                <Button size="large" onClick={() => navigate("/admin/testimonios")}>
                                    Cancelar
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>

                {/* Preview a la derecha */}
                <aside style={{ flex: "1 1 50%", width: "100%" }}>
                    <Card
                        title={
                            <Space>
                                <MessageOutlined style={{ color: "#2e7d32" }} />
                                <span>Vista previa en tiempo real</span>
                            </Space>
                        }
                    >
                        <div
                            style={{
                                background: "#fafafa",
                                border: "1px solid #f0f0f0",
                                borderRadius: 12,
                                padding: 20,
                            }}
                        >
                            <Title level={4} style={{ color: "#2e7d32", marginTop: 0 }}>
                                {data.titulo || "Título del testimonio"}
                            </Title>
                            <Paragraph style={{ color: "#595959", whiteSpace: "pre-wrap", marginBottom: 0 }}>
                                {data.descripcion || "La descripción del testimonio aparecerá aquí conforme la vayas escribiendo..."}
                            </Paragraph>
                        </div>
                    </Card>
                </aside>
            </div>
        </div>
    );
}