import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../../firebase/firebaseConfig';
import { ref as sref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import '../../components/contact/ContactForm.css';

const EMPTY = {
    nombre: '',
    edad: '',
    sexo: '',
    historia: '',
    estado: 'disponible',
    apadrinado: false,
    adoptado: false,
    necesidades: [],
    imagenes: [], // array of { url, path }
    superpoderes: { nivelMimos: '', habilidadEspecial: '', estadoActual: '' },
};

async function compressImage(file, maxWidth = 1024, quality = 0.7) {
    if (!(file instanceof File)) return null;
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const ratio = img.width / img.height;
                const targetWidth = Math.min(maxWidth, img.width);
                const targetHeight = Math.round(targetWidth / ratio);
                const canvas = document.createElement('canvas');
                canvas.width = targetWidth;
                canvas.height = targetHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
                // export as JPEG to reduce size
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = reject;
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

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
                    const mapped = {
                        nombre: docData.nombre || docData.name || '',
                        edad: docData.edad ?? docData.age ?? '',
                        sexo: docData.sexo || docData.gender || '',
                        historia: docData.historia || docData.bio || '',
                        estado: docData.estado || 'disponible',
                        apadrinado: !!docData.apadrinado,
                        adoptado: !!docData.adoptado,
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
        if (!imgEntry || !imgEntry.path) {
            // if no path (maybe legacy URL) just remove from state
            const next = (data.imagenes || []).filter((x) => x.url !== imgEntry.url);
            setData((p) => ({ ...p, imagenes: next }));
            try {
                const dref = doc(db, 'gatos', id);
                await setDoc(dref, { imagenes: next }, { merge: true });
            } catch (e) {
                console.error('Error updating doc after remove', e);
            }
            return;
        }
        if (!confirm('Borrar esta imagen?')) return;
        try {
            setLoading(true);
            const storageRef = sref(storage, imgEntry.path);
            await deleteObject(storageRef);
            const next = (data.imagenes || []).filter((x) => x.path !== imgEntry.path);
            setData((p) => ({ ...p, imagenes: next }));
            const dref = doc(db, 'gatos', id);
            await setDoc(dref, { imagenes: next }, { merge: true });
        } catch (e) {
            console.error('Error deleting image', e);
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

            // handle image files -> compress, upload to Storage, collect URLs
            const uploadedImages = [];
            const uploadBlob = async (blob, docId, idx) => {
                const path = `gatos/${docId}/${Date.now()}_${idx}.jpg`;
                const storageRef = sref(storage, path);
                await uploadBytes(storageRef, blob);
                const url = await getDownloadURL(storageRef);
                return { url, path };
            };

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
                        const compressedDataUrl = await compressImage(f, 1024, 0.7);
                        console.debug('GatoEditor: compressed size', compressedDataUrl ? compressedDataUrl.length : null);
                        // convert dataURL to blob
                        const res = await fetch(compressedDataUrl);
                        const blob = await res.blob();
                        console.debug('GatoEditor: uploading blob for file', f.name);
                        const entry = await uploadBlob(blob, targetDocId, i);
                        console.debug('GatoEditor: uploaded entry', entry);
                        uploadedImages.push(entry);
                    } catch (e) {
                        console.error('Error uploading image', e);
                    }
                }

                // merge uploadedImages into payload.imagenes
                console.debug('GatoEditor: existing payload.imagenes before merge', payload.imagenes);
                payload.imagenes = Array.isArray(payload.imagenes) ? payload.imagenes.concat(uploadedImages) : uploadedImages;
                console.debug('GatoEditor: payload.imagenes after merge', payload.imagenes);

                if (isNew && createdRef) {
                    // we've already created doc, update with imagenes
                    await setDoc(doc(db, 'gatos', createdRef.id), { imagenes: payload.imagenes }, { merge: true });
                    navigate('/admin/gatos');
                    setLoading(false);
                    return;
                }
            }
            if (isNew) {
                payload.createdAt = serverTimestamp();
                const col = collection(db, 'gatos');
                const ref = await addDoc(col, payload);
                navigate('/admin/gatos');
            } else {
                const dref = doc(db, 'gatos', id);
                payload.updatedAt = serverTimestamp();
                await setDoc(dref, payload, { merge: true });
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
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
                    <label className="cform-sublabel">Adoptado</label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <input type="checkbox" checked={!!data.adoptado} onChange={(e) => setField('adoptado', e.target.checked)} />
                    </label>

                </div>

                <div>
                    <label className="cform-sublabel">Imágenes — subir una o varias (se guardarán en Storage)</label>
                    <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(e.target.files ? Array.from(e.target.files) : [])} />

                    {/* Existing uploaded images */}
                    {Array.isArray(data.imagenes) && data.imagenes.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                            {data.imagenes.map((img, idx) => (
                                <div key={idx} style={{ width: 120 }}>
                                    <img src={img.url} alt={`img-${idx}`} style={{ width: '100%', borderRadius: 8 }} />
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

                    <label className="cform-sublabel">Superpoderes</label><br></br>
                    <label className="cform-sublabel">Nivel de mimos:</label>
                    <input className="cform-input" placeholder="Ej. 5/10 o Alto" value={(data.superpoderes && data.superpoderes.nivelMimos) || ''} onChange={(e) => setField('superpoderes', { ...(data.superpoderes || {}), nivelMimos: e.target.value })} />
                    <label className="cform-sublabel">Habilidad especial:</label>
                    <input className="cform-input" placeholder="Ej. Dormilón, Juguetón" value={(data.superpoderes && data.superpoderes.habilidadEspecial) || ''} onChange={(e) => setField('superpoderes', { ...(data.superpoderes || {}), habilidadEspecial: e.target.value })} />
                    <label className="cform-sublabel">Estado actual:</label>
                    <input className="cform-input" placeholder="Ej. En adopción, Recuperándose" value={(data.superpoderes && data.superpoderes.estadoActual) || ''} onChange={(e) => setField('superpoderes', { ...(data.superpoderes || {}), estadoActual: e.target.value })} />

                </div>
            </div>

            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
                <button className="cform-submit" onClick={handleSave} disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</button>
                {!isNew && <button className="cayudar-btn" onClick={handleDelete} disabled={loading} style={{ background: '#e53935', color: '#fff' }}>Eliminar</button>}
                <button className="cayudar-btn" onClick={() => navigate('/admin/gatos')}>Cancelar</button>
            </div>
        </div>
    );
}
