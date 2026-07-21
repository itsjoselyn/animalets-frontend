import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import BlogArticleView from "../../components/sections/Blog/BlogArticleView";
import { compressForUpload } from "../../lib/imageUtils";
import { uploadImageToCloudinary } from "../../lib/uploadImageToCloudinary";
import { EMPTY_NEWS } from "../../utils/constants";
import {
    Button,
    Card,
    Form,
    Input,
    Upload,
    Space,
    Popconfirm,
    message,
    Spin,
    Typography,
} from "antd";
import {
    UploadOutlined,
    SaveOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    ExclamationCircleOutlined,
    FileImageOutlined,
} from "@ant-design/icons";

import "../../components/sections/Contact/ContactForm.css";
import "./GatoEditor/GatoEditor.css";

const { Title } = Typography;

export default function NoticiaEditor() {
    const { id } = useParams();
    const isNew = !id || id === "new";
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [data, setData] = useState(EMPTY_NEWS);
    const [imagenPreview, setImagenPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Carga inicial del documento si es edición
    useEffect(() => {
        let mounted = true;

        if (!isNew) {
            setLoading(true);
            (async () => {
                try {
                    const snap = await getDoc(doc(db, "blog", id));
                    if (!snap.exists()) {
                        message.error("Noticia no encontrada");
                        navigate("/admin/noticias", { replace: true });
                        return;
                    }

                    const docData = snap.data() || {};
                    if (!mounted) return;

                    const images =
                        Array.isArray(docData.imagenes) && docData.imagenes.length > 0
                            ? docData.imagenes
                                .map((item) => {
                                    if (!item) return null;
                                    if (typeof item === "string") return { url: item };
                                    return { url: item.url || item.src || item.image || null };
                                })
                                .filter((item) => item && item.url)
                            : docData.imagen || docData.image || docData.img
                                ? [{ url: docData.imagen || docData.image || docData.img }]
                                : [];

                    const firstImage = images[0] || null;

                    const loadedData = {
                        titulo: docData.titulo || docData.title || "",
                        descripcion:
                            docData.descripcion || docData.body || docData.text || "",
                        imagenes: images,
                    };

                    setData(loadedData);
                    setImagenPreview(firstImage);

                    // Sincronizar con el formulario de Antd
                    form.setFieldsValue({
                        titulo: loadedData.titulo,
                        descripcion: loadedData.descripcion,
                    });
                } catch (err) {
                    console.error("Error cargando la noticia:", err);
                    message.error("Error al cargar la noticia");
                } finally {
                    if (mounted) setLoading(false);
                }
            })();
        } else {
            setData(EMPTY_NEWS);
            setImagenPreview(null);
            form.resetFields();
        }

        return () => {
            mounted = false;
        };
    }, [id, isNew, navigate, form]);

    // Actualizar previsualización al cambiar inputs
    const handleValuesChange = (_, allValues) => {
        setData((prev) => ({
            ...prev,
            titulo: allValues.titulo || "",
            descripcion: allValues.descripcion || "",
        }));
    };

    // Manejo de la subida local de imagen
    const handleImageChange = ({ file }) => {
        if (!file) return;

        // Si es un File nativo extraído del componente Upload
        const originFile = file.originFileObj || file;

        if (originFile instanceof File) {
            const previewUrl = URL.createObjectURL(originFile);
            const next = {
                file: originFile,
                url: previewUrl,
            };

            setImagenPreview(next);
            setData((prev) => ({
                ...prev,
                imagenes: [next],
            }));
        }
    };

    const handleDeleteImage = () => {
        if (imagenPreview?.url && imagenPreview.file) {
            URL.revokeObjectURL(imagenPreview.url);
        }
        setImagenPreview(null);
        setData((prev) => ({
            ...prev,
            imagenes: [],
        }));
        message.info("Imagen eliminada");
    };

    // Guardar en Firebase / Cloudinary
    const handleSave = async (values) => {
        if (!imagenPreview) {
            message.warning("Debes añadir al menos una imagen para la noticia");
            return;
        }

        const titulo = String(values.titulo || "").trim();
        const descripcion = String(values.descripcion || "").trim();

        try {
            setSaving(true);

            let uploadedImage = null;

            // Subir a Cloudinary solo si es una imagen local nueva
            if (imagenPreview?.file) {
                message.loading({ content: "Comprimiendo y subiendo imagen...", key: "upload" });
                const compressed = await compressForUpload(imagenPreview.file, {
                    maxWidth: 1400,
                    quality: 0.78,
                    preferWebP: true,
                });
                const url = await uploadImageToCloudinary(compressed, "blog");
                uploadedImage = { url };
                message.success({ content: "Imagen subida correctamente", key: "upload" });
            } else if (imagenPreview?.url) {
                uploadedImage = { url: imagenPreview.url };
            }

            const payload = {
                titulo,
                descripcion,
                imagenes: uploadedImage ? [uploadedImage] : [],
            };

            if (isNew) {
                payload.createdAt = serverTimestamp();
                await addDoc(collection(db, "blog"), payload);
                message.success("Noticia creada correctamente");
            } else {
                payload.updatedAt = serverTimestamp();
                await setDoc(doc(db, "blog", id), payload, { merge: true });
                message.success("Noticia actualizada correctamente");
            }

            navigate("/admin/noticias");
        } catch (err) {
            console.error("Error guardando noticia:", err);
            message.error("Error al guardar la noticia");
        } finally {
            setSaving(false);
        }
    };

    // Eliminar la noticia entera
    const handleDelete = async () => {
        try {
            setSaving(true);
            await deleteDoc(doc(db, "blog", id));
            message.success("Noticia eliminada correctamente");
            navigate("/admin/noticias");
        } catch (err) {
            console.error("Error borrando noticia:", err);
            message.error("No se pudo eliminar la noticia");
        } finally {
            setSaving(false);
        }
    };

    // Estructura adaptada para el componente de vista previa
    const previewPost = {
        id: id || "preview",
        title: data.titulo,
        body: data.descripcion,
        imagenes: imagenPreview ? [imagenPreview] : [],
        createdAt: null,
        updatedAt: null,
    };

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "60px 16px" }}>
                <Spin size="large" tip="Cargando noticia..." />
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: 40 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 20,
                }}
            >
                <Title level={3} style={{ margin: 0, color: "#2e7d32" }}>
                    {isNew ? "Crear noticia" : `Editar noticia: ${data.titulo || id}`}
                </Title>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate("/admin/noticias")}
                >
                    Volver
                </Button>
            </div>

            <div className="gato-editor-grid">
                {/* Lado izquierdo: Formulario de edición */}
                <Card title="Datos del artículo" className="gato-editor-form">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSave}
                        onValuesChange={handleValuesChange}
                        initialValues={{
                            titulo: data.titulo,
                            descripcion: data.descripcion,
                        }}
                    >
                        <Form.Item
                            label="Título de la noticia"
                            name="titulo"
                            rules={[
                                { required: true, message: "El título es obligatorio" },
                                { min: 4, message: "Debe tener al menos 4 caracteres" },
                            ]}
                        >
                            <Input
                                placeholder="Ej: Gran jornada de adopción este sábado"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Contenido / Descripción"
                            name="descripcion"
                            rules={[
                                { required: true, message: "La descripción es obligatoria" },
                            ]}
                        >
                            <Input.TextArea
                                rows={8}
                                placeholder="Escribe aquí todo el cuerpo del artículo..."
                                showCount
                            />
                        </Form.Item>

                        <Form.Item label="Imagen principal">
                            {!imagenPreview ? (
                                <Upload
                                    accept="image/*"
                                    showUploadList={false}
                                    beforeUpload={() => false} // Evitar subida automática
                                    onChange={handleImageChange}
                                >
                                    <Button icon={<UploadOutlined />} size="large">
                                        Seleccionar imagen
                                    </Button>
                                </Upload>
                            ) : (
                                <Card
                                    size="small"
                                    style={{ width: 240, marginTop: 8 }}
                                    cover={
                                        <img
                                            src={imagenPreview.url}
                                            alt={data.titulo || "Vista previa"}
                                            style={{
                                                height: 140,
                                                objectFit: "cover",
                                                borderRadius: "8px 8px 0 0",
                                            }}
                                        />
                                    }
                                    actions={[
                                        <Button
                                            type="text"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={handleDeleteImage}
                                            key="delete"
                                        >
                                            Quitar foto
                                        </Button>,
                                    ]}
                                />
                            )}
                        </Form.Item>

                        <Form.Item style={{ marginTop: 24, marginBottom: 0 }}>
                            <Space wrap size="middle">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<SaveOutlined />}
                                    loading={saving}
                                    size="large"
                                    style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32" }}
                                >
                                    Guardar noticia
                                </Button>

                                {!isNew && (
                                    <Popconfirm
                                        title="Eliminar noticia"
                                        description="¿Seguro que quieres eliminar esta noticia? Esta acción no se puede deshacer."
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

                                <Button
                                    size="large"
                                    onClick={() => navigate("/admin/noticias")}
                                >
                                    Cancelar
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Card>

                {/* Lado derecho: Vista previa dinámica */}
                <aside className="gato-editor-preview">
                    <Title level={5} style={{ color: "#595959", marginBottom: 12 }}>
                        <FileImageOutlined /> Vista previa en tiempo real
                    </Title>
                    <div style={{ border: "1px solid #f0f0f0", borderRadius: 12, overflow: "hidden" }}>
                        <BlogArticleView post={previewPost} preview />
                    </div>
                </aside>
            </div>
        </div>
    );
}