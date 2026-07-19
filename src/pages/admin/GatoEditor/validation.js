export function validateGato(data, imagenesPreview) {
    const errors = [];

    if (!data.nombre || String(data.nombre).trim() === '') {
        errors.push('Nombre es obligatorio');
    }

    if (data.edad === undefined || data.edad === '') {
        errors.push('Edad es obligatoria');
    } else {
        const n = Number(String(data.edad).replace(',', '.'));
        if (Number.isNaN(n) || n < 0 || n > 25) {
            errors.push('Edad debe ser un número entre 0 y 25');
        }
    }

    if (!data.sexo || String(data.sexo).trim() === '') {
        errors.push('Sexo es obligatorio');
    }

    if (!data.estado || String(data.estado).trim() === '') {
        errors.push('Estado es obligatorio');
    }

    if (!data.superpoderes || typeof data.superpoderes !== 'object') {
        errors.push('Superpoderes incompletos');
    } else {
        if (!String(data.superpoderes.nivelMimos || '').trim()) errors.push('Nivel de mimos es obligatorio');
        if (!String(data.superpoderes.habilidadEspecial || '').trim()) errors.push('Habilidad especial es obligatoria');
        if (!String(data.superpoderes.estadoActual || '').trim()) errors.push('Estado actual es obligatorio');
    }

    if (imagenesPreview.length === 0) {
        errors.push('Debes añadir al menos una imagen');
    }

    return errors;
}