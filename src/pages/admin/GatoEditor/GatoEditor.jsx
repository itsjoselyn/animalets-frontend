import { useParams } from 'react-router-dom';
import { useGatoEditor } from './useGatoEditor';
import BasicFields from './fields/BasicFields';
import ExtraFields from './fields/ExtraFields';
import SuperpowersFields from './fields/SuperpowersFields';
import GatoPreview from './components/GatoPreview';
import "../../../components/sections/Contact/ContactForm.css";
import './GatoEditor.css';
import Button from "../../../components/common/Button/Button";

export default function GatoEditor() {
    const { id } = useParams();
    const {
        data, isNew, imagenesPreview, selectedPreview, loading,
        setField, setSuperpoder, setImagenesPreview, setSelectedPreview,
        handleSave, handleDelete, handleDeleteImage, navigate
    } = useGatoEditor(id);

    return (
        <div>
            <h3>{isNew ? 'Crear gato' : `Editar gato ${data.nombre || id}`}</h3>
            {loading && <p>Cargando...</p>}

            <div className="gato-editor-grid">
                <div className="gato-editor-form">
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

                    <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                        <Button variant="submit" onClick={handleSave} disabled={loading}>{loading ? "Guardando..." : "Guardar"}</Button>
                        {!isNew && (
                            <Button variant="admin-btn" onClick={handleDelete} disabled={loading} style={{ background: '#e53935', color: '#fff' }}>Eliminar</Button>
                        )}
                        <Button variant="admin-btn" onClick={() => navigate('/admin/gatos')}>Cancelar</Button>                    </div>
                </div>

                <GatoPreview
                    data={data}
                    imagenesPreview={imagenesPreview}
                    selectedPreview={selectedPreview}
                    setSelectedPreview={setSelectedPreview}
                />
            </div>
        </div>
    );
}