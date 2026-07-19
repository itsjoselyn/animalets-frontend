import { serverTimestamp } from 'firebase/firestore';

export function prepareCatPayload(data, isNew) {
    const payload = { ...data };

    // Normalizar edad a numérico
    if (payload.edad !== undefined && payload.edad !== '') {
        const n = Number(String(payload.edad).replace(',', '.'));
        if (!Number.isNaN(n)) payload.edad = n;
    }

    // Derivar canonical 'estado' desde el checkbox de compatibilidad UI anterior
    if (data.adoptado) payload.estado = 'adoptado';

    // Quitar campos legacy que ya no queremos escribir en la DB
    delete payload.adoptado;

    // Agregar timestamps del servidor de Firebase según corresponda
    if (isNew) {
        payload.createdAt = serverTimestamp();
    } else {
        payload.updatedAt = serverTimestamp();
    }

    return payload;
}