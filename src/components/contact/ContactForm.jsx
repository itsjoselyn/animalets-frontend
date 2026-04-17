import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import "./ContactForm.css";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const TIPOS = [
  { value: "adoptar", label: "Adoptar" },
  { value: "apadrinar", label: "Apadrinar" },
  { value: "acogida", label: "Casa de acogida" },
  { value: "voluntario", label: "Voluntariado" },
  { value: "otros", label: "Otra consulta" },
];

const CONOCIDO = [
  { value: "web", label: "Web" },
  { value: "facebook", label: "Facebook" },
  { value: "instagram", label: "Instagram" },
  { value: "amigo", label: "Por un amigo" },
  { value: "otro", label: "Otro" },
];

const initialFormState = {
  nombre: "",
  correo: "",
  telefono: "",
  edad: "",
  mensaje: "",
  conocido: "",
  disponibilidad: [],
  tareas: [],
  tareasOtros: "",
  experienciaVol: "",
  gatoAcogida: "",
  tipoHogar: "",
  personasCasa: "",
  animalesCasa: [],
  animalesTexto: "",
  tiempoAcogida: "",
  experienciaAcogida: "",
  nombreGato: "",
  tipoAportacion: "",
  cantidadAportacion: "",
  gatoEnMente: "",
  tipoVivienda: "",
  animalesActuales: [],
  animalesActualesTexto: "",
  personasAdoptar: "",
  experienciaAdoptar: "",
};

export default function ContactForm() {
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

  const setField = (key, value) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((e) => {
      if (!e[key]) return e;
      const ne = { ...e };
      delete ne[key];
      return ne;
    });
  };

  const toggleArr = (field, value) => {
    setForm((p) => {
      const arr = p[field] || [];
      const next = arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
      return { ...p, [field]: next };
    });
    setErrors((e) => {
      if (!e[field]) return e;
      const ne = { ...e };
      delete ne[field];
      return ne;
    });
  };

  const clearError = (k) => setErrors((e) => { const ne = { ...e }; delete ne[k]; return ne; });

  const validateAll = () => {
    const e = {};
    if (!form.nombre || form.nombre.trim().length < 2) e.nombre = "Introduce tu nombre";
    else if (/\d/.test(form.nombre)) e.nombre = "El nombre no puede contener números";
    if (!form.correo || !/^\S+@\S+\.\S+$/.test(form.correo)) e.correo = "Introduce un correo válido";
    if (form.telefono) {
      const telDigits = String(form.telefono).replace(/\D/g, '');
      if (!/^\d{7,15}$/.test(telDigits)) e.telefono = "Introduce un número de teléfono válido (7-15 dígitos)";
    }
    // `mensaje` obligatorio solo si la consulta es 'otros'. En otros casos es opcional pero se valida si se escribe.
    if (tipo === "otros") {
      if (!form.mensaje || form.mensaje.trim().length < 6) e.mensaje = "Escribe un mensaje más detallado";
    } else {
      if (form.mensaje && form.mensaje.trim().length > 0 && form.mensaje.trim().length < 6) e.mensaje = "Escribe un mensaje más detallado";
    }
    if (!privacidad) e.privacidad = "Debes aceptar la política de privacidad";
    if (!tipo) e.tipo = "Selecciona el tipo de consulta";
    if (!form.edad && tipo !== "otros") {
      e.edad = "Indica la edad";
    } else if (form.edad) {
      const ageNum = Number(form.edad);
      if (!Number.isInteger(ageNum) || ageNum < 0) e.edad = "La edad debe ser un número entero no negativo";
    }

    if (tipo === "voluntario") {
      if (!form.disponibilidad || form.disponibilidad.length === 0) e.disponibilidad = "Indica tu disponibilidad";
      if (!form.tareas || form.tareas.length === 0) e.tareas = "Selecciona al menos una tarea";
      if (form.tareas.includes("Otros") && !form.tareasOtros) e.tareasOtros = "Especifica otras tareas";
    }

    if (tipo === "acogida") {
      if (!form.tipoHogar) e.tipoHogar = "Selecciona el tipo de hogar";
      if (!form.personasCasa) e.personasCasa = "Indica las personas en casa";
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
      if (!form.tipoVivienda) e.tipoVivienda = "Selecciona el tipo de vivienda";
      if (!form.personasAdoptar) e.personasAdoptar = "Indica las personas en casa";
    }

    return e;
  };

  const focusFirstError = (errObj) => {
    const keys = Object.keys(errObj || {});
    if (!keys.length) return;
    const el = formRef.current?.querySelector(`[data-field="${keys[0]}"]`);
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      try { el.focus(); } catch (e) {}
    }
  };

  const handleTipoChange = (value) => {
    setTipo(value);
    clearError("tipo");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateAll();
    if (Object.keys(errs).length) {
      setErrors(errs);
      focusFirstError(errs);
      setToast({ type: "error", text: "Por favor corrige los errores del formulario" });
      return;
    }

    setSending(true);
    // filter out empty values (e.g. placeholder or unchecked arrays) so we don't store the prompt text
    const filteredForm = Object.fromEntries(
      Object.entries(form).filter(([k, v]) => {
        if (v === null || v === undefined) return false;
        if (typeof v === "string" && v.trim() === "") return false;
        if (Array.isArray(v) && v.length === 0) return false;
        return true;
      })
    );

    // convert edad to a number (integer) if present
    if (filteredForm.edad !== undefined) {
      const n = Number(filteredForm.edad);
      if (!Number.isNaN(n)) filteredForm.edad = Math.trunc(n);
    }

    // convert cantidadAportacion to number if present (allow decimals) or derive from tipoAportacion
    if (filteredForm.cantidadAportacion !== undefined) {
      const n = Number(String(filteredForm.cantidadAportacion).replace(',', '.'));
      if (!Number.isNaN(n)) filteredForm.cantidadAportacion = Math.round(n * 100) / 100;
    }
    if (filteredForm.tipoAportacion !== undefined && filteredForm.tipoAportacion !== 'otra') {
      const asNum = Number(filteredForm.tipoAportacion);
      if (!Number.isNaN(asNum)) filteredForm.cantidadAportacion = asNum;
    }

    const payload = {
      tipo,
      privacidad,
      ...filteredForm,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "contactRequests"), payload);
      setToast({ type: "success", text: "Mensaje enviado correctamente" });
      setForm(initialFormState);
      setTipo("");
      setPrivacidad(false);
      setErrors({});
    } catch (err) {
      console.error(err);
      setToast({ type: "error", text: "Error al enviar el formulario, inténtalo de nuevo" });
    } finally {
      setSending(false);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => setToast(null), 5000);
    }
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  return (
    <section className="cform-wrap">
      <h2 className="cform-title">¿En qué podemos ayudarte?</h2>

      <form ref={formRef} className="cform" onSubmit={handleSubmit} noValidate>

        {/* ---- CAMPOS COMUNES ---- */}
        <input data-field="nombre" className={`cform-input${errors.nombre ? ' cform-input--error' : ''}`} type="text" placeholder="Nombre completo *" value={form.nombre} onChange={(e) => setField("nombre", e.target.value.replace(/[0-9]/g, ''))} />
        {errors.nombre && <p className="cform-field-error">{errors.nombre}</p>}

        <input data-field="correo" className={`cform-input${errors.correo ? ' cform-input--error' : ''}`} type="email" placeholder="Correo *" value={form.correo} onChange={(e) => setField("correo", e.target.value)} />
        {errors.correo && <p className="cform-field-error">{errors.correo}</p>}

        <input data-field="telefono" className={`cform-input${errors.telefono ? ' cform-input--error' : ''}`} type="tel" placeholder="Teléfono" value={form.telefono} onChange={(e) => setField("telefono", e.target.value.replace(/\D/g, ''))} />
        {errors.telefono && <p className="cform-field-error">{errors.telefono}</p>}

        <input data-field="edad" className={`cform-input${errors.edad ? ' cform-input--error' : ''}`} type="number" min="0" placeholder="Edad *" value={form.edad} onChange={(e) => setField("edad", e.target.value)} />
        {errors.edad && <p className="cform-field-error">{errors.edad}</p>}

        <select data-field="tipo" className={`cform-select${errors.tipo ? ' cform-select--error' : ''}`} value={tipo} onChange={(e) => handleTipoChange(e.target.value)}>
          <option value="" disabled hidden>¿Cuál es tu consulta?</option>
          {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        {errors.tipo && <p className="cform-field-error">{errors.tipo}</p>}

        <select data-field="conocido" className="cform-select" value={form.conocido} onChange={(e) => setField("conocido", e.target.value)}>
          <option value="" disabled hidden>¿Cómo nos conociste?</option>
          {CONOCIDO.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        <textarea data-field="mensaje" className={`cform-textarea${errors.mensaje ? ' cform-textarea--error' : ''}`} placeholder={tipo === 'otros' ? 'Cuéntanos más *' : 'Cuéntanos más'} value={form.mensaje} onChange={(e) => setField("mensaje", e.target.value)} rows={4} />
        {errors.mensaje && <p className="cform-field-error">{errors.mensaje}</p>}

        {/* ---- CAMPOS DINÁMICOS: VOLUNTARIO ---- */}
        {tipo === "voluntario" && (
          <fieldset className="cform-fieldset">
            <legend className="cform-legend">Voluntariado</legend>
            <p className="cform-sublabel">Disponibilidad horaria *</p>
            <div data-field="disponibilidad" className={`cform-checks${errors.disponibilidad ? ' cform-checks--error' : ''}`}>
              {["Mañana", "Tarde", "Fin de semana"].map((v) => (
                <label key={v} className="cform-check">
                  <input type="checkbox" checked={form.disponibilidad.includes(v)} onChange={() => toggleArr("disponibilidad", v)} />
                  <span className="cform-check-box" />
                  {v}
                </label>
              ))}
            </div>
            {errors.disponibilidad && <p className="cform-field-error">{errors.disponibilidad}</p>}

            <p className="cform-sublabel">Tareas que podrías realizar *</p>
            <div data-field="tareas" className={`cform-checks${errors.tareas ? ' cform-checks--error' : ''}`}>
              {["Limpieza", "Alimentación", "Medicación", "Fotos", "Socialización", "Otros"].map((v) => (
                <label key={v} className="cform-check">
                  <input type="checkbox" checked={form.tareas.includes(v)} onChange={() => toggleArr("tareas", v)} />
                  <span className="cform-check-box" />
                  {v}
                </label>
              ))}
            </div>
            {errors.tareas && <p className="cform-field-error">{errors.tareas}</p>}

            {form.tareas.includes("Otros") && (
              <>
                <input data-field="tareasOtros" className={`cform-input${errors.tareasOtros ? ' cform-input--error' : ''}`} type="text" placeholder="Especifica otras tareas *" value={form.tareasOtros} onChange={(e) => setField("tareasOtros", e.target.value)} />
                {errors.tareasOtros && <p className="cform-field-error">{errors.tareasOtros}</p>}
              </>
            )}

            <textarea className="cform-textarea" placeholder="¿Tienes experiencia previa con animales?" value={form.experienciaVol} onChange={(e) => setField("experienciaVol", e.target.value)} rows={3} />
          </fieldset>
        )}

        {/* ---- CAMPOS DINÁMICOS: ACOGIDA ---- */}
        {tipo === "acogida" && (
          <fieldset className="cform-fieldset">
            <legend className="cform-legend">Casa de acogida</legend>
            <input data-field="gatoAcogida" className="cform-input" type="text" placeholder="¿Tienes ya un gato en mente?" value={form.gatoAcogida} onChange={(e) => setField("gatoAcogida", e.target.value)} />
            <select data-field="tipoHogar" className={`cform-select${errors.tipoHogar ? ' cform-select--error' : ''}`} value={form.tipoHogar} onChange={(e) => setField("tipoHogar", e.target.value)}>
              <option value="">Tipo de hogar *</option>
              {["Piso", "Casa", "Con terraza", "Con patio"].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            {errors.tipoHogar && <p className="cform-field-error">{errors.tipoHogar}</p>}
            <input data-field="personasCasa" className={`cform-input${errors.personasCasa ? ' cform-input--error' : ''}`} type="text" placeholder="Personas en casa (adultos, niños y edades) *" value={form.personasCasa} onChange={(e) => setField("personasCasa", e.target.value)} />
            {errors.personasCasa && <p className="cform-field-error">{errors.personasCasa}</p>}
            <p className="cform-sublabel">Animales en casa</p>
            <div className="cform-checks">
              {["Perros", "Gatos", "Otros"].map((v) => (
                <label key={v} className="cform-check">
                  <input type="checkbox" checked={form.animalesCasa.includes(v)} onChange={() => toggleArr("animalesCasa", v)} />
                  <span className="cform-check-box" />
                  {v}
                </label>
              ))}
            </div>
            <input data-field="animalesTexto" className="cform-input" type="text" placeholder="Especifica si hay otros animales" value={form.animalesTexto} onChange={(e) => setField("animalesTexto", e.target.value)} />
            <select data-field="tiempoAcogida" className={`cform-select${errors.tiempoAcogida ? ' cform-select--error' : ''}`} value={form.tiempoAcogida} onChange={(e) => setField("tiempoAcogida", e.target.value)}>
              <option value="">Tiempo de acogida que puedes ofrecer *</option>
              {["Menos de 1 mes", "1-3 meses", "Indefinido"].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            {errors.tiempoAcogida && <p className="cform-field-error">{errors.tiempoAcogida}</p>}
            <textarea className="cform-textarea" placeholder="Experiencia previa acogiendo o conviviendo con gatos" value={form.experienciaAcogida} onChange={(e) => setField("experienciaAcogida", e.target.value)} rows={3} />
          </fieldset>
        )}

        {/* ---- CAMPOS DINÁMICOS: APADRINAR ---- */}
        {tipo === "apadrinar" && (
          <fieldset className="cform-fieldset">
            <legend className="cform-legend">Apadrinar un gato</legend>
            <input data-field="nombreGato" className={`cform-input${errors.nombreGato ? ' cform-input--error' : ''}`} type="text" placeholder="Nombre del gato a apadrinar *" value={form.nombreGato} onChange={(e) => setField("nombreGato", e.target.value)} />
            {errors.nombreGato && <p className="cform-field-error">{errors.nombreGato}</p>}
            <select
              data-field="tipoAportacion"
              className={`cform-select${errors.tipoAportacion ? ' cform-select--error' : ''}`}
              value={form.tipoAportacion}
              onChange={(e) => {
                const v = e.target.value;
                setField("tipoAportacion", v);
                if (v !== "otra") setField("cantidadAportacion", "");
              }}
            >
              <option value="">Tipo de aportación *</option>
              <option value="10">10€/mes</option>
              <option value="otra">Otra cantidad</option>
            </select>
            {errors.tipoAportacion && <p className="cform-field-error">{errors.tipoAportacion}</p>}

            {form.tipoAportacion === "otra" && (
              <>
                <input
                  data-field="cantidadAportacion"
                  className={`cform-input${errors.cantidadAportacion ? ' cform-input--error' : ''}`}
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="Cantidad en € *"
                  value={form.cantidadAportacion}
                  onChange={(e) => setField("cantidadAportacion", e.target.value)}
                />
                {errors.cantidadAportacion && <p className="cform-field-error">{errors.cantidadAportacion}</p>}
              </>
            )}
          </fieldset>
        )}

        {/* ---- CAMPOS DINÁMICOS: ADOPTAR ---- */}
        {tipo === "adoptar" && (
          <fieldset className="cform-fieldset">
            <legend className="cform-legend">Adopción</legend>
            <input data-field="gatoEnMente" className="cform-input" type="text" placeholder="¿Tienes ya un gato en mente?" value={form.gatoEnMente} onChange={(e) => setField("gatoEnMente", e.target.value)} />
            <select data-field="tipoVivienda" className={`cform-select${errors.tipoVivienda ? ' cform-select--error' : ''}`} value={form.tipoVivienda} onChange={(e) => setField("tipoVivienda", e.target.value)}>
              <option value="">Tipo de vivienda *</option>
              {["Piso", "Casa", "Con terraza", "Con patio"].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            {errors.tipoVivienda && <p className="cform-field-error">{errors.tipoVivienda}</p>}
            <p className="cform-sublabel">Animales actuales en casa</p>
            <div className="cform-checks">
              {["Perros", "Gatos", "Otros"].map((v) => (
                <label key={v} className="cform-check">
                  <input type="checkbox" checked={form.animalesActuales.includes(v)} onChange={() => toggleArr("animalesActuales", v)} />
                  <span className="cform-check-box" />
                  {v}
                </label>
              ))}
            </div>
            <input data-field="animalesActualesTexto" className="cform-input" type="text" placeholder="Especifica si hay otros animales" value={form.animalesActualesTexto} onChange={(e) => setField("animalesActualesTexto", e.target.value)} />
            <input data-field="personasAdoptar" className={`cform-input${errors.personasAdoptar ? ' cform-input--error' : ''}`} type="text" placeholder="Personas en casa (adultos, niños y edades) *" value={form.personasAdoptar} onChange={(e) => setField("personasAdoptar", e.target.value)} />
            {errors.personasAdoptar && <p className="cform-field-error">{errors.personasAdoptar}</p>}
            <textarea className="cform-textarea" placeholder="Experiencia previa con gatos" value={form.experienciaAdoptar} onChange={(e) => setField("experienciaAdoptar", e.target.value)} rows={3} />
          </fieldset>
        )}

        {/* ---- PRIVACIDAD + ENVÍO ---- */}
        <label className="cform-privacy">
          <input data-field="privacidad" type="checkbox" checked={privacidad} onChange={() => { setPrivacidad((v) => { const nv = !v; if (nv) clearError('privacidad'); return nv; }); }} />
          <span className="cform-check-box" />
          He leído y acepto la <a href="/privacidad" className="cform-privacy-link" onClick={(e) => { e.preventDefault(); setPrivacyOpen(true); setPrivacidad(true); clearError('privacidad'); }}>política de privacidad</a> *
        </label>
        {errors.privacidad && <p className="cform-field-error">{errors.privacidad}</p>}

        {/* inline status removed: using toast only */}

        <button type="submit" className="cform-submit" disabled={sending}>{sending ? "Enviando..." : "Enviar"}</button>

      </form>

      {privacyOpen && (
        <div className="cform-privacy-modal-overlay" onClick={() => setPrivacyOpen(false)}>
          <div className="cform-privacy-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cform-privacy-modal-close" aria-label="Cerrar" onClick={() => setPrivacyOpen(false)}>✕</button>
            <iframe src="/privacidad-bare" title="Política de privacidad" className="cform-privacy-iframe" />
          </div>
        </div>
      )}

      {toast && (
        <div
          className={`cform-toast cform-toast--${toast.type || "info"}`}
          role="status"
        >
          <span className="cform-toast-text">{toast.text}</span>
          <button
            className="cform-toast-close"
            aria-label="Cerrar"
            onClick={() => { setToast(null); if (toastTimeoutRef.current) { clearTimeout(toastTimeoutRef.current); toastTimeoutRef.current = null; } }}
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
