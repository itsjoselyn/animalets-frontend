// Validación pura: recibe el estado del formulario y devuelve un objeto de errores.
// Extraído tal cual de ContactForm.jsx, sin cambios de comportamiento.
export function validateAll(tipo, form, privacidad) {
    const e = {};

    if (!form.nombre || form.nombre.trim().length < 2) e.nombre = "Introduce tu nombre";
    else if (/\d/.test(form.nombre)) e.nombre = "El nombre no puede contener números";

    if (!form.correo || !/^\S+@\S+\.\S+$/.test(form.correo)) e.correo = "Introduce un correo válido";

    if (form.telefono) {
        const telDigits = String(form.telefono).replace(/\D/g, '');
        if (!/^[6-9]\d{8}$/.test(telDigits)) {
            e.telefono = "Introduce un teléfono español válido";
        }
    }

    // `mensaje` obligatorio solo si la consulta es 'otros'. En otros casos es opcional pero se valida si se escribe.
    if (tipo === "otros") {
        if (!form.mensaje || form.mensaje.trim().length < 6) e.mensaje = "Escribe un mensaje más detallado";
    } else {
        if (form.mensaje && form.mensaje.trim().length > 0 && form.mensaje.trim().length < 6) e.mensaje = "Escribe un mensaje más detallado";
    }

    if (!privacidad) e.privacidad = "Debes aceptar la política de privacidad";
    if (!tipo) e.tipo = "Selecciona el tipo de consulta";

    if (!form.edad) {
        e.edad = "Indica la edad";
    } else {
        const ageNum = Number(form.edad);
        if (!Number.isInteger(ageNum) || ageNum < 18) e.edad = "Debes ser mayor de edad (18+) para realizar una consulta";
    }

    if (tipo === "voluntario") {
        if (!form.disponibilidad || form.disponibilidad.length === 0) e.disponibilidad = "Indica tu disponibilidad";
        if (!form.tareas || form.tareas.length === 0) e.tareas = "Selecciona al menos una tarea";
        if (form.tareas.includes("Otros") && !form.tareasOtros) e.tareasOtros = "Especifica otras tareas";
        if (form.tieneExperienciaAnimales === "" || form.tieneExperienciaAnimales === undefined) {
            e.tieneExperienciaAnimales = "Indica si tienes experiencia previa con animales";
        } else if (form.tieneExperienciaAnimales === "si") {
            if (!form.experienciaVol || form.experienciaVol.trim().length < 5) e.experienciaVol = "Cuéntanos un poco tu experiencia (mínimo 5 caracteres)";
        }
    }

    if (tipo === "acogida") {
        if (!form.tipoVivienda || form.tipoVivienda.length === 0) e.tipoVivienda = "Selecciona el tipo de vivienda";
        else if (form.tipoVivienda.length > 2) e.tipoVivienda = "Selecciona como máximo 2 opciones";

        if (form.tieneAnimalesCasa === "" || form.tieneAnimalesCasa === undefined) {
            e.tieneAnimalesCasa = "Indica si tienes animales en casa";
        } else if (form.tieneAnimalesCasa === "si") {
            if (!form.animalesActuales || form.animalesActuales.length === 0) e.animalesActuales = "Selecciona los animales en casa";
            if (form.animalesActuales && form.animalesActuales.includes("Otros")) {
                const text = String(form.animalesActualesTexto || "").trim();
                const letters = (text.match(/[A-Za-zÁÉÍÓÚáéíóúÑñÜü]/g) || []).length;
                if (letters < 3) e.animalesActualesTexto = "Especifica los otros animales (mínimo 3 letras)";
            }
        }

        if (form.hayPersonasCasa === "" || form.hayPersonasCasa === undefined) {
            e.hayPersonasCasa = "Indica si hay otras personas en casa";
        } else if (form.hayPersonasCasa === "si") {
            if (!form.personasAdoptar || form.personasAdoptar.trim().length < 5) e.personasAdoptar = "Especifica cuántas personas y sus edades (mínimo 5 caracteres)";
        }

        if (form.tieneExperienciaGatos === "" || form.tieneExperienciaGatos === undefined) {
            e.tieneExperienciaGatos = "Indica si tienes experiencia previa con gatos";
        } else if (form.tieneExperienciaGatos === "si") {
            if (!form.experienciaAdoptar || form.experienciaAdoptar.trim().length < 5) e.experienciaAdoptar = "Cuéntanos un poco de tu experiencia (mínimo 5 caracteres)";
        }

        if (!form.tiempoAcogida) e.tiempoAcogida = "Indica el tiempo de acogida";
    }

    if (tipo === "apadrinar") {
        if (!form.nombreGato) e.nombreGato = "Indica el gato a apadrinar";
        if (!form.tipoAportacion) e.tipoAportacion = "Selecciona una aportación";
        if (form.tipoAportacion === "otra") {
            if (!form.cantidadAportacion || String(form.cantidadAportacion).trim() === "") {
                e.cantidadAportacion = "Indica la cantidad";
            } else {
                const num = Number(String(form.cantidadAportacion).replace(',', '.'));
                if (Number.isNaN(num) || num <= 0) e.cantidadAportacion = "Introduce una cantidad válida mayor que 0";
            }
        }
    }

    if (tipo === "adoptar") {
        if (!form.tipoVivienda || form.tipoVivienda.length === 0) e.tipoVivienda = "Selecciona el tipo de vivienda";
        else if (form.tipoVivienda.length > 2) e.tipoVivienda = "Selecciona como máximo 2 opciones";

        if (form.tieneAnimalesCasa === "" || form.tieneAnimalesCasa === undefined) {
            e.tieneAnimalesCasa = "Indica si tienes animales en casa";
        } else if (form.tieneAnimalesCasa === "si") {
            if (!form.animalesActuales || form.animalesActuales.length === 0) e.animalesActuales = "Selecciona los animales en casa";
            if (form.animalesActuales && form.animalesActuales.includes("Otros")) {
                const text = String(form.animalesActualesTexto || "").trim();
                const letters = (text.match(/[A-Za-zÁÉÍÓÚáéíóúÑñÜü]/g) || []).length;
                if (letters < 3) e.animalesActualesTexto = "Especifica los otros animales (mínimo 3 letras)";
            }
        }

        if (form.hayPersonasCasa === "" || form.hayPersonasCasa === undefined) {
            e.hayPersonasCasa = "Indica si hay otras personas en casa";
        } else if (form.hayPersonasCasa === "si") {
            if (!form.personasAdoptar || form.personasAdoptar.trim().length < 5) e.personasAdoptar = "Especifica cuántas personas y sus edades (mínimo 5 caracteres)";
        }

        if (form.tieneExperienciaGatos === "" || form.tieneExperienciaGatos === undefined) {
            e.tieneExperienciaGatos = "Indica si tienes experiencia previa con gatos";
        } else if (form.tieneExperienciaGatos === "si") {
            if (!form.experienciaAdoptar || form.experienciaAdoptar.trim().length < 5) e.experienciaAdoptar = "Cuéntanos un poco de tu experiencia (mínimo 5 caracteres)";
        }
    }

    return e;
}
