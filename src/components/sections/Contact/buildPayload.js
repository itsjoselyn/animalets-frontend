import { serverTimestamp } from "firebase/firestore";
import { TYPE_FIELDS } from "../../../utils/constants";

// Filtra valores vacíos (string vacío, array vacío, null/undefined) para no
// guardar placeholders sin rellenar. Extraído tal cual del componente original.
export function filterEmpty(form) {
    const filtered = Object.fromEntries(
        Object.entries(form).filter(([, v]) => {
            if (v === null || v === undefined) return false;
            if (typeof v === "string" && v.trim() === "") return false;
            if (Array.isArray(v) && v.length === 0) return false;
            return true;
        })
    );

    if (filtered.edad !== undefined) {
        const n = Number(filtered.edad);
        if (!Number.isNaN(n)) filtered.edad = Math.trunc(n);
    }

    if (filtered.cantidadAportacion !== undefined) {
        const n = Number(String(filtered.cantidadAportacion).replace(',', '.'));
        if (!Number.isNaN(n)) filtered.cantidadAportacion = Math.round(n * 100) / 100;
    }
    if (filtered.tipoAportacion !== undefined && filtered.tipoAportacion !== 'otra') {
        const asNum = Number(filtered.tipoAportacion);
        if (!Number.isNaN(asNum)) filtered.cantidadAportacion = asNum;
    }

    return filtered;
}



export function buildPayload(tipo, filteredForm, privacidad) {
    const payload = {};
    payload.tipo = tipo;
    payload.createdAt = serverTimestamp();
    payload.estado = "nuevo";

    if (filteredForm.nombre !== undefined) payload.nombre = filteredForm.nombre;
    if (filteredForm.correo !== undefined) payload.correo = filteredForm.correo;
    if (filteredForm.telefono !== undefined) payload.telefono = filteredForm.telefono;
    if (filteredForm.edad !== undefined) payload.edad = filteredForm.edad;
    if (filteredForm.mensaje !== undefined) payload.mensaje = filteredForm.mensaje;

    const fields = TYPE_FIELDS[tipo] || [];
    fields.forEach((f) => {
        if (filteredForm[f] !== undefined) payload[f] = filteredForm[f];
    });

    payload.privacidad = privacidad;

    return payload;
}
