import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, setDoc, updateDoc, deleteDoc, arrayUnion, deleteField } from 'firebase/firestore';
import { db } from "../../../firebase/firebaseConfig";
import { uploadImageToCloudinary } from "../../../lib/uploadImageToCloudinary";
import { compressForUpload } from '../../../lib/imageUtils';
import { EMPTY_CAT } from "../../../utils/constants";
import { validateGato } from './validation';
import { prepareCatPayload } from './buildPayload';

export function useGatoEditor(id) {
    const navigate = useNavigate();
    const isNew = id === undefined || id === 'new';

    const [data, setData] = useState(EMPTY_CAT);
    const [imagenesPreview, setImagenesPreview] = useState([]);
    const [selectedPreview, setSelectedPreview] = useState(0);
    const [loading, setLoading] = useState(false);

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

                    const resolvedEstado = docData.estado || (docData.adoptado === true ? 'adoptado' : 'disponible');
                    const mapped = {
                        nombre: docData.nombre || docData.name || '',
                        edad: docData.edad ?? docData.age ?? '',
                        sexo: docData.sexo || docData.gender || '',
                        historia: docData.historia || docData.bio || '',
                        estado: resolvedEstado,
                        apadrinado: !!docData.apadrinado,
                        adoptado: resolvedEstado === 'adoptado' || !!docData.adoptado,
                        necesidades: Array.isArray(docData.necesidades) ? docData.necesidades : (docData.necesito ? [docData.necesito] : []),
                        imagenes: Array.isArray(docData.imagenes) ? docData.imagenes : (docData.imagen ? [{ url: docData.imagen, path: null }] : []),
                        superpoderes: docData.superpoderes || docData.superpowers || { nivelMimos: '', habilidadEspecial: '', estadoActual: '' },
                    };
                    setData({ ...EMPTY_CAT, ...mapped });
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
            setData(EMPTY_CAT);
            setImagenesPreview([]);
        }
        return () => { mounted = false; };
    }, [id, isNew, navigate]);

    useEffect(() => {
        if (selectedPreview >= imagenesPreview.length) {
            setSelectedPreview(0);
        }
    }, [imagenesPreview, selectedPreview]);

    const setField = (k, v) => setData((p) => ({ ...p, [k]: v }));

    const setSuperpoder = (key, value) => {
        setData(p => ({
            ...p,
            superpoderes: { ...(p.superpoderes || {}), [key]: value }
        }));
    };

    const handleDeleteImage = async (imgEntry) => {
        if (!confirm('Borrar esta imagen?')) return;
        try {
            setLoading(true);
            const next = imagenesPreview.filter(img => img.url !== imgEntry.url);
            setImagenesPreview(next);
            setData(p => ({ ...p, imagenes: next.filter(img => !img.file) }));

            if (!isNew) {
                const dref = doc(db, 'gatos', id);
                await setDoc(dref, {
                    imagenes: next.filter(img => !img.file).map(img => ({ url: img.url }))
                }, { merge: true });
            }
        } catch (e) {
            console.error('Error removing image entry', e);
            alert('No se pudo borrar la imagen');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const errors = validateGato(data, imagenesPreview);
        if (errors.length > 0) {
            alert('Errores:\n' + errors.join('\n'));
            return;
        }

        try {
            setLoading(true);
            const payload = prepareCatPayload(data, isNew);
            const uploadedImages = [];
            let createdRef = null;

            if (isNew) {
                const col = collection(db, 'gatos');
                createdRef = await addDoc(col, payload);
            }

            for (const img of imagenesPreview) {
                if (!img.file) {
                    uploadedImages.push({ url: img.url });
                    continue;
                }
                try {
                    const blob = await compressForUpload(img.file, { maxWidth: 1200, quality: 0.75, preferWebP: true });
                    const url = await uploadImageToCloudinary(blob, "gatos");
                    uploadedImages.push({ url });
                } catch (e) {
                    console.error('Error uploading image', e);
                }
            }

            if (!isNew) {
                const dref = doc(db, 'gatos', id);
                if (uploadedImages.length > 0) {
                    await updateDoc(dref, { imagenes: arrayUnion(...uploadedImages) });
                }
                const { imagenes, ...payloadWithoutImagenes } = payload;
                await setDoc(dref, { ...payloadWithoutImagenes, adoptado: deleteField() }, { merge: true });
            } else if (isNew && createdRef) {
                const normalizedExisting = Array.isArray(payload.imagenes) ? payload.imagenes.map(it => typeof it === 'string' ? { url: it } : { url: it?.url }) : [];
                payload.imagenes = normalizedExisting.concat(uploadedImages);
                await setDoc(doc(db, 'gatos', createdRef.id), { imagenes: payload.imagenes }, { merge: true });
            }

            navigate('/admin/gatos');
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
            await deleteDoc(doc(db, 'gatos', id));
            navigate('/admin/gatos');
        } catch (err) {
            console.error(err);
            alert('Error borrando');
        } finally {
            setLoading(false);
        }
    };

    return {
        data, isNew, imagenesPreview, selectedPreview, loading,
        setField, setSuperpoder, setImagenesPreview, setSelectedPreview,
        handleSave, handleDelete, handleDeleteImage, navigate
    };
}