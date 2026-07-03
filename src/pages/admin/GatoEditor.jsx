//crear o editar gato panel admin
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, serverTimestamp, deleteField, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { uploadImageToCloudinary } from '../../lib/uploadImageToCloudinary';
import { compressForUpload } from '../../lib/imageUtils';
import '../../components/contact/ContactForm.css';
import './GatoEditor.css';

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
    const [imagenesPreview, setImagenesPreview] = useState([]);
    const [selectedPreview, setSelectedPreview] = useState(0);
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
                    setImagenesPreview(mapped.imagenes || []);
                    setSelectedPreview(0);
                } catch (err) {
                    console.error(err);
                    alert('Error cargando el documento');
                } finally {
                    if (mounted) setLoading(false);
                }
            })();
        } else {
            setData(EMPTY);
            setImagenesPreview([]);
        }
        return () => { mounted = false; };
    }, [id]);

    const setField = (k, v) => setData((p) => ({ ...p, [k]: v }));

    useEffect(() => {
        if (selectedPreview >= imagenesPreview.length) {
            setSelectedPreview(0);
        }
    }, [imagenesPreview, selectedPreview]);

    const handleDeleteImage = async (imgEntry) => {
        if (!confirm('Borrar esta imagen?')) return;
        try {
            setLoading(true);
            // We no longer delete remote files from Cloudinary here (requires authenticated API).
            // Soft-delete: remove the URL from the document's imagenes array.
            const next = imagenesPreview.filter(
                img => img.url !== imgEntry.url
            );
            setImagenesPreview(next);
            setData(p => ({
                ...p,
                imagenes: next.filter(img => !img.file)
            }));
            const dref = doc(db, 'gatos', id);
            await setDoc(
                dref,
                {
                    imagenes: next
                        .filter(img => !img.file)
                        .map(img => ({ url: img.url }))
                },
                { merge: true }
            );
        } catch (e) {
            console.error('Error removing image entry', e);
            alert('No se pudo borrar la imagen');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            console.debug('GatoEditor: handleSave start', { id, isNew, imagenesBefore: data.imagenes, imagenesPreviewlength: imagenesPreview.length });
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
            if (imagenesPreview.length === 0) {
                errors.push('Debes añadir al menos una imagen');
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

            if (imagenesPreview.length > 0) {
                let createdRef = null;
                if (isNew) {
                    payload.createdAt = serverTimestamp();
                    const col = collection(db, 'gatos');
                    createdRef = await addDoc(col, payload);
                }

                for (const img of imagenesPreview) {

                    // Si ya estaba subida no la volvemos a subir
                    if (!img.file) {
                        uploadedImages.push({ url: img.url });
                        continue;
                    }

                    const f = img.file;
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
                        await updateDoc(dref, {
                            imagenes: arrayUnion(...uploadedImages)
                        });
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

            if (!isNew) {
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
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                            if (!e.target.files) return;

                            const nuevos = Array.from(e.target.files).map(file => ({
                                file,
                                url: URL.createObjectURL(file),
                                uploaded: false,
                            }));

                            setImagenesPreview(prev =>
                                [...prev, ...nuevos].slice(0, 5)
                            );
                        }}
                    />

                    {imagenesPreview.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                            {imagenesPreview.map((img, i) => (
                                <div key={i} style={{ width: 120 }}>
                                    <img
                                        src={img.url}
                                        alt={`img-${i}`}
                                        style={{ width: '100%', borderRadius: 8 }}
                                    />

                                    <button
                                        type="button"
                                        className="cayudar-btn"
                                        onClick={() => handleDeleteImage(img)}
                                    >
                                        Eliminar
                                    </button>
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
                        <>
                            {imagenesPreview.length > 1 && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: 8,
                                        overflowX: "auto",
                                        padding: "10px",
                                        marginBottom: "10px",
                                    }}
                                >
                                    {imagenesPreview.map((img, i) => (
                                        <img
                                            key={i}
                                            src={img.url}
                                            alt={`preview-${i}`}
                                            onClick={() => setSelectedPreview(i)}
                                            style={{
                                                width: 70,
                                                height: 70,
                                                objectFit: "cover",
                                                borderRadius: 8,
                                                cursor: "pointer",
                                                border:
                                                    i === selectedPreview
                                                        ? "3px solid #4caf50"
                                                        : "2px solid #ddd",
                                                flexShrink: 0,
                                            }}
                                        />
                                    ))}
                                </div>
                            )}

                            {imagenesPreview.length > 0 ? (
                                <img
                                    src={imagenesPreview[selectedPreview]?.url}
                                    alt="Preview"
                                    className="catprofile-img"
                                />
                            ) : (
                                <div
                                    className="skeleton"
                                    style={{
                                        width: "100%",
                                        height: 300,
                                        borderRadius: 8,
                                    }}
                                />
                            )}
                        </>
                        <div className="catprofile-body">
                            <div className="catprofile-hero">
                                <h1 className="catprofile-name">{data.nombre || 'Nombre del gato'}</h1>
                                <div className="catprofile-meta">
                                    {data.edad !== undefined && data.edad !== '' && <span>{String(data.edad)} {Number(data.edad) === 1 ? 'año' : 'años'}</span>}
                                    <span style={{ marginLeft: 8 }}>{data.sexo || ''}</span>
                                </div>
                            </div>

                            <p className="catprofile-bio">{data.historia || 'Descripción breve del gato'}</p>

                            <div className="catprofile-section">

                                <h2 className="catprofile-section-title">
                                    Lo que necesito
                                </h2>

                                <ul className="catprofile-list">
                                    {(data.necesidades || []).map((n, i) => (
                                        <li
                                            key={i}
                                            className="catprofile-list-item"
                                        >
                                            {n}
                                        </li>
                                    ))}
                                </ul>
                                <div className="catprofile-section">

                                    <h2 className="catprofile-section-title">
                                        Mis superpoderes
                                    </h2>

                                    <ul className="catprofile-powers">

                                        <li className="catprofile-power">
                                            <span className="catprofile-power-label">
                                                Nivel de mimos:
                                            </span>{" "}
                                            {data.superpoderes?.nivelMimos}
                                        </li>

                                        <li className="catprofile-power">
                                            <span className="catprofile-power-label">
                                                Habilidad especial:
                                            </span>{" "}
                                            {data.superpoderes?.habilidadEspecial}
                                        </li>

                                        <li className="catprofile-power">
                                            <span className="catprofile-power-label">
                                                Estado actual:
                                            </span>{" "}
                                            {data.superpoderes?.estadoActual}
                                        </li>

                                    </ul>

                                </div>

                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
