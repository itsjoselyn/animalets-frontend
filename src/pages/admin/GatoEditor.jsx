//crear o editar gato panel admin
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, deleteField, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { uploadImageToCloudinary } from '../../lib/uploadImageToCloudinary';
import { compressForUpload } from '../../lib/imageUtils';
import '../../components/contact/ContactForm.css';
import './GatoEditor.css';
import { optimizeCloudinaryImage } from '../../lib/optimizeCloudinaryImage';

const EMPTY = {
    nombre: '',
    edad: '',
    sexo: '',
    historia: '',
    estado: 'disponible',
    apadrinado: false,
    necesidades: [],
    imagenes: [], // array of { url, path }
    superpoderes: { nivelMimos: '', habilidadEspecial: '', estadoActual: '' },
};



function ArrayInput({ label, value = [], onChange, placeholder = '' }) {
    const v = Array.isArray(value) ? value : [];
    const setAt = (idx, val) => {
        const next = v.slice();
        next[idx] = val;
        onChange(next);
    };
    const add = () => onChange([...v, '']);
    const remove = (idx) => onChange(v.filter((_, i) => i !== idx));
    return (
        <div>
            <label className="cform-sublabel">{label}</label>
            {v.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input className="cform-input" value={item} onChange={(e) => setAt(i, e.target.value)} placeholder={placeholder} />
                    <button type="button" className="cayudar-btn" onClick={() => remove(i)}>Eliminar</button>
                </div>
            ))}
            <button type="button" className="cayudar-btn" onClick={add}>Añadir</button>
        </div>
    );
}

// removed generic key/value editor — editor limited to specified fields

export default function GatoEditor() {
    const { id } = useParams();
    const isNew = id === undefined || id === 'new';
    const [data, setData] = useState(EMPTY);
    const [imageFiles, setImageFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        if (!isNew) {
            setLoading(true);
            (async () => {
                try {
                    const dref = doc(db, 'gatos', id);
                    const snap = await getDoc(dref);
                    if (!snap.exists()) {
                        alert('Gato no encontrado');
                        navigate('/admin/gatos');
                        return;
                    }
                    const docData = snap.data() || {};
                    if (!mounted) return;
                    // map fields we accept
                    const resolvedEstado = docData.estado || (docData.adoptado === true ? 'adoptado' : 'disponible');
                    const mapped = {
                        nombre: docData.nombre || docData.name || '',
                        edad: docData.edad ?? docData.age ?? '',
                        sexo: docData.sexo || docData.gender || '',
                        historia: docData.historia || docData.bio || '',
                        estado: resolvedEstado,
                        apadrinado: !!docData.apadrinado,
                        // keep a derived boolean for UI compatibility, but we will not write this field anymore
                        adoptado: resolvedEstado === 'adoptado' || !!docData.adoptado,
                        necesidades: Array.isArray(docData.necesidades) ? docData.necesidades : (docData.necesito ? [docData.necesito] : []),
                        imagenes: Array.isArray(docData.imagenes) ? docData.imagenes : (docData.imagen ? [{ url: docData.imagen, path: null }] : []),
                        superpoderes: docData.superpoderes || docData.superpowers || { nivelMimos: '', habilidadEspecial: '', estadoActual: '' },
                    };
                    setData({ ...EMPTY, ...mapped });
                } catch (err) {
                    console.error(err);
                    alert('Error cargando el documento');
                } finally {
                    if (mounted) setLoading(false);
                }
            })();
        } else {
            setData(EMPTY);
        }
        return () => { mounted = false; };
    }, [id]);

    const setField = (k, v) => setData((p) => ({ ...p, [k]: v }));

    const handleDeleteImage = async (imgEntry) => {
        if (!confirm('Borrar esta imagen?')) return;
        try {
            setLoading(true);
            // We no longer delete remote files from Cloudinary here (requires authenticated API).
            // Soft-delete: remove the URL from the document's imagenes array.
            const next = (data.imagenes || []).filter((x) => (x && x.url ? x.url : x) !== (imgEntry && imgEntry.url ? imgEntry.url : imgEntry));
            setData((p) => ({ ...p, imagenes: next }));
            const dref = doc(db, 'gatos', id);
            await setDoc(dref, { imagenes: next }, { merge: true });
        } catch (e) {
            console.error('Error removing image entry', e);
            alert('No se pudo borrar la imagen');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            console.debug('GatoEditor: handleSave start', { id, isNew, imagenesBefore: data.imagenes, imageFilesLength: imageFiles.length });
            setLoading(true);
            const payload = { ...data };
            // Validation
            const errors = [];
            if (!payload.nombre || String(payload.nombre).trim() === '') errors.push('Nombre es obligatorio');
            if (payload.edad === undefined || payload.edad === '') errors.push('Edad es obligatoria');
            else {
                const n = Number(String(payload.edad).replace(',', '.'));
                if (Number.isNaN(n) || n < 0 || n > 25) errors.push('Edad debe ser un número entre 0 y 25');
                else payload.edad = n;
            }
            if (!payload.sexo || String(payload.sexo).trim() === '') errors.push('Sexo es obligatorio');
            if (!payload.estado || String(payload.estado).trim() === '') errors.push('Estado es obligatorio');
            if (!payload.superpoderes || typeof payload.superpoderes !== 'object') errors.push('Superpoderes incompletos');
            else {
                if (!String(payload.superpoderes.nivelMimos || '').trim()) errors.push('Nivel de mimos es obligatorio');
                if (!String(payload.superpoderes.habilidadEspecial || '').trim()) errors.push('Habilidad especial es obligatoria');
                if (!String(payload.superpoderes.estadoActual || '').trim()) errors.push('Estado actual es obligatorio');
            }
            if (errors.length > 0) {
                alert('Errores:\n' + errors.join('\n'));
                setLoading(false);
                return;
            }
            // normalize edad numeric
            if (payload.edad !== undefined && payload.edad !== '') {
                const n = Number(String(payload.edad).replace(',', '.'));
                if (!Number.isNaN(n)) payload.edad = n;
            }
            // ensure superpoderes present
            if (data.superpoderes) payload.superpoderes = data.superpoderes;

            // handle image files -> compress, upload to Cloudinary, collect URLs
            const uploadedImages = [];

            if (imageFiles && imageFiles.length > 0) {
                // If creating new doc, we need its id first
                let targetDocId = id;
                let createdRef = null;
                if (isNew) {
                    payload.createdAt = serverTimestamp();
                    const col = collection(db, 'gatos');
                    createdRef = await addDoc(col, payload);
                    targetDocId = createdRef.id;
                }

                for (let i = 0; i < imageFiles.length; i++) {
                    const f = imageFiles[i];
                    try {
                        console.debug('GatoEditor: compressing file', f.name);
                        const blob = await compressForUpload(f, { maxWidth: 1200, quality: 0.75, preferWebP: true });
                        console.debug('GatoEditor: compressed blob', blob);
                        console.debug('GatoEditor: uploading to Cloudinary', f.name);
                        const url = await uploadImageToCloudinary(blob, "gatos");
                        const entry = { url };
                        console.debug('GatoEditor: uploaded entry', entry);
                        uploadedImages.push(entry);
                    } catch (e) {
                        console.error('Error uploading image', e);
                    }
                }
                // For existing docs, append uploaded images atomically using arrayUnion to avoid overwriting
                if (!isNew && uploadedImages.length > 0) {
                    try {
                        const dref = doc(db, 'gatos', id);
                        await updateDoc(dref, { imagenes: arrayUnion(...uploadedImages) });
                    } catch (e) {
                        console.error('Error appending images to existing doc', e);
                    }
                }

                // merge uploadedImages into payload.imagenes for new docs
                if (isNew) {
                    console.debug('GatoEditor: existing payload.imagenes before merge', payload.imagenes);
                    const normalizedExisting = Array.isArray(payload.imagenes) ? payload.imagenes.map((it) => (it && it.url ? { url: it.url } : (typeof it === 'string' ? { url: it } : it))) : [];
                    payload.imagenes = normalizedExisting.concat(uploadedImages);
                    console.debug('GatoEditor: payload.imagenes after merge', payload.imagenes);

                    if (createdRef) {
                        // we've already created doc, update with imagenes
                        await setDoc(doc(db, 'gatos', createdRef.id), { imagenes: payload.imagenes }, { merge: true });
                        navigate('/admin/gatos');
                        setLoading(false);
                        return;
                    }
                }
            }
            // Derive canonical `estado` from the select and legacy checkbox (checkbox kept for UI compatibility)
            if (data.adoptado) payload.estado = 'adoptado';
            // Do not write the legacy boolean field anymore
            delete payload.adoptado;

            if (isNew) {
                payload.createdAt = serverTimestamp();
                const col = collection(db, 'gatos');
                const ref = await addDoc(col, payload);
                navigate('/admin/gatos');
            } else {
                const dref = doc(db, 'gatos', id);
                payload.updatedAt = serverTimestamp();
                // remove legacy `adoptado` field from document (soft migration)
                // Avoid overwriting imagenes if we already appended them above for existing docs
                const { imagenes, ...payloadWithoutImagenes } = payload;
                await setDoc(dref, { ...payloadWithoutImagenes, adoptado: deleteField() }, { merge: true });
                navigate('/admin/gatos');
            }
        } catch (err) {
            console.error(err);
            alert('Error guardando');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('¿Seguro que quieres eliminar este gato? Esta acción no se puede deshacer.')) return;
        try {
            setLoading(true);
            const dref = doc(db, 'gatos', id);
            await deleteDoc(dref);
            navigate('/admin/gatos');
        } catch (err) {
            console.error(err);
            alert('Error borrando');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h3>{isNew ? 'Crear gato' : `Editar gato ${data.nombre || id}`}</h3>
            {loading && <p>Cargando...</p>}

            <div className="gato-editor-grid">
                <div className="gato-editor-form">
                    <label className="cform-sublabel">Nombre</label>
                    <input className="cform-input" placeholder="Nombre" value={data.nombre || ''} onChange={(e) => setField('nombre', e.target.value)} />
                    <label className="cform-sublabel">Edad</label>
                    <input className="cform-input" placeholder="Edad (años)" value={data.edad || ''} onChange={(e) => setField('edad', e.target.value)} />
                    <label className="cform-sublabel">Sexo</label>
                    <select className="cform-select" value={data.sexo || ''} onChange={(e) => setField('sexo', e.target.value)}>
                        <option value="" disabled hidden>Elige sexo</option>
                        <option value="Macho">Macho</option>
                        <option value="Hembra">Hembra</option>
                        <option value="Desconocido">Desconocido</option>
                    </select>
                    <label className="cform-sublabel">Estado</label>
                    <select className="cform-select" value={data.estado || 'disponible'} onChange={(e) => setField('estado', e.target.value)}>
                        <option value="disponible">Disponible</option>
                        <option value="adoptado">Adoptado</option>
                        <option value="en_proceso">En proceso</option>
                    </select>

                    <label className="cform-sublabel">Descripción / Historia</label>
                    <textarea className="cform-textarea" rows={6} placeholder="Descripción — ej. encontrado en la calle, muy cariñoso" value={data.historia || ''} onChange={(e) => setField('historia', e.target.value)} />

                    <label className="cform-sublabel">Necesidades</label>
                    <ArrayInput value={data.necesidades || []} onChange={(v) => setField('necesidades', v)} placeholder="Necesidad (ej. comida especial)" />

                    <label className="cform-sublabel">Apadrinado</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="checkbox" checked={!!data.apadrinado} onChange={(e) => setField('apadrinado', e.target.checked)} />
                    </label>

                    <label className="cform-sublabel">Imágenes</label>
                    <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(e.target.files ? Array.from(e.target.files) : [])} />

                    {/* Existing uploaded images */}
                    {Array.isArray(data.imagenes) && data.imagenes.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                            {data.imagenes.map((img, idx) => (
                                <div key={idx} style={{ width: 120 }}>
                                    <img src={optimizeCloudinaryImage(img.url, 600)} alt={`img-${idx}`} style={{ width: '100%', borderRadius: 8 }} />
                                    <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                                        <button type="button" className="cayudar-btn" onClick={() => handleDeleteImage(img)}>Eliminar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* New selected files preview */}
                    {imageFiles && imageFiles.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                            {imageFiles.map((f, i) => (
                                <div key={i} style={{ width: 120 }}>
                                    <img src={URL.createObjectURL(f)} alt={f.name} style={{ width: '100%', borderRadius: 8 }} />
                                </div>
                            ))}
                        </div>
                    )}
                    <br></br>
                    <label className="cform-sublabel">Superpoderes</label><br></br>
                    <label className="cform-sublabel">Nivel de mimos:</label>
                    <input className="cform-input" placeholder="Ej. 5/10 o Alto" value={(data.superpoderes && data.superpoderes.nivelMimos) || ''} onChange={(e) => setField('superpoderes', { ...(data.superpoderes || {}), nivelMimos: e.target.value })} />
                    <label className="cform-sublabel">Habilidad especial:</label>
                    <input className="cform-input" placeholder="Ej. Dormilón, Juguetón" value={(data.superpoderes && data.superpoderes.habilidadEspecial) || ''} onChange={(e) => setField('superpoderes', { ...(data.superpoderes || {}), habilidadEspecial: e.target.value })} />
                    <label className="cform-sublabel">Estado actual:</label>
                    <input className="cform-input" placeholder="Ej. En adopción, Recuperándose" value={(data.superpoderes && data.superpoderes.estadoActual) || ''} onChange={(e) => setField('superpoderes', { ...(data.superpoderes || {}), estadoActual: e.target.value })} />

                    <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                        <button className="cform-submit" onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
                        {!isNew && <button className="cayudar-btn" onClick={handleDelete} disabled={loading} style={{ background: '#e53935', color: '#fff' }}>Eliminar</button>}
                        <button className="cayudar-btn" onClick={() => navigate('/admin/gatos')}>Cancelar</button>
                    </div>
                </div>

                <aside className="gato-editor-preview">
                    <div className="catprofile">
                        <div className="catprofile-img-wrap">
                            {Array.isArray(data.imagenes) && data.imagenes[0] && data.imagenes[0].url ? (
                                <img src={optimizeCloudinaryImage(data.imagenes[0].url, 900)} alt={data.nombre || 'Imagen gato'} className="catprofile-img" />
                            ) : (
                                <div className="skeleton" style={{ width: '100%', height: 300, borderRadius: 8 }} />
                            )}
                        </div>
                        <div className="catprofile-body">
                            <div className="catprofile-hero">
                                <h1 className="catprofile-name">{data.nombre || 'Nombre del gato'}</h1>
                                <div className="catprofile-meta">
                                    {data.edad !== undefined && data.edad !== '' && <span>{String(data.edad)} {Number(data.edad) === 1 ? 'año' : 'años'}</span>}
                                    <span style={{ marginLeft: 8 }}>{data.sexo || ''}</span>
                                </div>
                            </div>

                            <p className="catprofile-bio">{data.historia || 'Descripción breve del gato'}</p>

                            <div style={{ marginTop: 12 }}>
                                <strong>Estado:</strong> <span style={{ textTransform: 'capitalize' }}>{data.estado || 'disponible'}</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
