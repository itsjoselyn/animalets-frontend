import { useParams, useNavigate } from 'react-router-dom';
import { useGatoEditor } from './useGatoEditor';
import BasicFields from './fields/BasicFields';
import ExtraFields from './fields/ExtraFields';
import SuperpowersFields from './fields/SuperpowersFields';
import GatoPreview from './components/GatoPreview';
import "../../../components/sections/Contact/ContactForm.css";
import './GatoEditor.css';
import { Button, Card, Popconfirm, Typography, Grid, Spin } from "antd";
import {
    SaveOutlined,
    DeleteOutlined,
    ArrowLeftOutlined,
    ExclamationCircleOutlined,
    HeartOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { useBreakpoint } = Grid;

export default function GatoEditor() {
    const { id } = useParams();
    const {
        data, isNew, imagenesPreview, selectedPreview, loading,
        setField, setSuperpoder, setImagenesPreview, setSelectedPreview,
        handleSave, handleDelete, handleDeleteImage, navigate
    } = useGatoEditor(id);

    const screens = useBreakpoint();
    const isMobile = !screens.md;

    return (
        <div style={{ paddingBottom: 40 }}>
            {/* Cabecera Adaptativa / Responsive */}
            <div
                style={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    justifyContent: "space-between",
                    alignItems: isMobile ? "stretch" : "center",
                    gap: 12,
                    marginBottom: 20,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <HeartOutlined style={{ fontSize: isMobile ? 18 : 22, color: "#2e7d32" }} />
                    <Title level={isMobile ? 5 : 4} style={{ margin: 0, fontSize: isMobile ? 16 : undefined, color: "#2e7d32" }}>
                        {isNew ? "Crear gato" : `Editar gato: ${data.nombre || id}`}
                    </Title>
                </div>

                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/admin/gatos')}
                    block={isMobile}
                >
                    Volver a la lista
                </Button>
            </div>

            {loading && isNew === false && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <Spin size="large" description="Cargando datos del gato..." />
                </div>
            )}

            {/* Grid Principal del Editor */}
            <div className="gato-editor-grid">
                <Card className="gato-editor-form" title="Información del felino">
                    <BasicFields data={data} setField={setField} />

                    <ExtraFields
                        data={data}
                        setField={setField}
                        imagenesPreview={imagenesPreview}
                        setImagenesPreview={setImagenesPreview}
                        handleDeleteImage={handleDeleteImage}
                    />

                    <SuperpowersFields
                        superpowers={data.superpoderes}
                        setSuperpoder={setSuperpoder}
                    />

                    {/* Botones de Acción */}
                    <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: "wrap" }}>
                        <Button
                            type="primary"
                            onClick={handleSave}
                            loading={loading}
                            icon={<SaveOutlined />}
                            size="large"
                            style={{ backgroundColor: "#2e7d32", borderColor: "#2e7d32" }}
                        >
                            {loading ? "Guardando..." : "Guardar gato"}
                        </Button>

                        {!isNew && (
                            <Popconfirm
                                title="Eliminar gato"
                                description={`¿Seguro que quieres eliminar a ${data.nombre || "este gato"}? Esta acción no se puede deshacer.`}
                                icon={<ExclamationCircleOutlined style={{ color: "red" }} />}
                                onConfirm={handleDelete}
                                okText="Sí, eliminar"
                                cancelText="Cancelar"
                                okButtonProps={{ danger: true, loading: loading }}
                            >
                                <Button type="primary" danger icon={<DeleteOutlined />} size="large">
                                    Eliminar
                                </Button>
                            </Popconfirm>
                        )}

                        <Button size="large" onClick={() => navigate('/admin/gatos')}>
                            Cancelar
                        </Button>
                    </div>
                </Card>

                {/* Vista Previa a la derecha */}
                <aside style={{ width: "100%" }}>
                    <GatoPreview
                        data={data}
                        imagenesPreview={imagenesPreview}
                        selectedPreview={selectedPreview}
                        setSelectedPreview={setSelectedPreview}
                    />
                </aside>
            </div>
        </div>
    );
}