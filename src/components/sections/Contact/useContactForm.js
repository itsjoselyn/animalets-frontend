import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { initialFormState } from "../../../utils/constants";
import { validateAll } from "./validation";
import { filterEmpty, buildPayload } from "./buildPayload";

export function useContactForm() {
    const [searchParams] = useSearchParams();
    const [tipo, setTipo] = useState("");
    const [form, setForm] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [privacidad, setPrivacidad] = useState(false);
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState(null);
    const [privacyOpen, setPrivacyOpen] = useState(false);

    const formRef = useRef(null);
    const toastTimeoutRef = useRef(null);

    useEffect(() => {
        const preTipo = searchParams.get("tipo");
        if (preTipo) setTipo(preTipo);
    }, [searchParams]);

    useEffect(() => {
        return () => {
            if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        };
    }, []);

    const clearError = (k) => setErrors((e) => {
        if (!e[k]) return e;
        const ne = { ...e };
        delete ne[k];
        return ne;
    });

    const setField = (key, value) => {
        setForm((p) => ({ ...p, [key]: value }));
        clearError(key);
    };

    const toggleArr = (field, value) => {
        setForm((p) => {
            const arr = p[field] || [];
            const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
            return { ...p, [field]: next };
        });
        clearError(field);
    };

    const toggleMax = (field, value, max) => {
        const arr = form[field] || [];
        if (arr.includes(value)) {
            setForm((p) => ({ ...p, [field]: arr.filter((x) => x !== value) }));
            clearError(field);
            return;
        }
        if (arr.length >= max) {
            setErrors((e) => ({ ...e, [field]: `Selecciona como máximo ${max} opciones` }));
            return;
        }
        setForm((p) => ({ ...p, [field]: [...arr, value] }));
        clearError(field);
    };

    const focusFirstError = (errObj) => {
        const keys = Object.keys(errObj || {});
        if (!keys.length) return;
        const el = formRef.current?.querySelector(`[data-field="${keys[0]}"]`);
        if (el && el.scrollIntoView) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            try { el.focus(); } catch (e) { /* noop */ }
        }
    };

    const handleTipoChange = (value) => {
        setTipo(value);
        clearError("tipo");
    };

    const showToast = (toastValue) => {
        setToast(toastValue);
        if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = setTimeout(() => setToast(null), 6000);
    };

    const dismissToast = () => {
        setToast(null);
        if (toastTimeoutRef.current) {
            clearTimeout(toastTimeoutRef.current);
            toastTimeoutRef.current = null;
        }
    };

    const openPrivacyModal = (e) => {
        e.preventDefault();
        setPrivacyOpen(true);
        setPrivacidad(true);
        clearError('privacidad');
    };

    const togglePrivacidad = () => {
        setPrivacidad((v) => {
            const nv = !v;
            if (nv) clearError('privacidad');
            return nv;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validateAll(tipo, form, privacidad);
        if (Object.keys(errs).length) {
            setErrors(errs);
            focusFirstError(errs);
            return;
        }

        setSending(true);
        try {
            const filteredForm = filterEmpty(form);
            const payload = buildPayload(tipo, filteredForm, privacidad);
            await addDoc(collection(db, "contactRequests"), payload);
            showToast({ type: "success", text: "¡Gracias por contactar con Animalets! Hemos recibido tu mensaje y te responderemos lo antes posible." });
            setForm(initialFormState);
            setTipo("");
            setPrivacidad(false);
            setErrors({});
        } catch (err) {
            console.error(err);
            showToast({ type: "error", text: "Error al enviar el formulario, inténtalo de nuevo" });
        } finally {
            setSending(false);
        }
    };

    return {
        form,
        tipo,
        errors,
        privacidad,
        sending,
        toast,
        privacyOpen,
        formRef,
        setField,
        toggleArr,
        toggleMax,
        handleTipoChange,
        handleSubmit,
        togglePrivacidad,
        openPrivacyModal,
        setPrivacyOpen,
        dismissToast,
    };
}
