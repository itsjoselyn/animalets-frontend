import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./ContactForm.css";

const TIPOS = [
  { value: "",           label: "Tipo de consulta *" },
  { value: "voluntario", label: "Ser voluntario/a" },
  { value: "acogida",    label: "Casa de acogida" },
  { value: "apadrinar",  label: "Apadrinar un gato" },
  { value: "socio",      label: "Hacerme socio/a" },
  { value: "adoptar",    label: "Adoptar" },
  { value: "otra",       label: "Otra consulta" },
];

const CONOCIDO = [
  { value: "",              label: "¿Cómo nos has conocido?" },
  { value: "rrss",          label: "Redes sociales" },
  { value: "recomendacion", label: "Recomendación" },
  { value: "evento",        label: "Evento" },
  { value: "otro",          label: "Otro" },
];

export default function ContactForm() {
  const [searchParams] = useSearchParams();
  const [tipo, setTipo]           = useState("");
  const [privacidad, setPrivacidad] = useState(false);
  const [form, setForm]           = useState({
    nombre: "", correo: "", telefono: "", conocido: "", mensaje: "",
    // voluntario
    disponibilidad: [], tareas: [], experienciaVol: "",
    // acogida
    tipoHogar: "", personasCasa: "", animalesCasa: [], animalesTexto: "", tiempoAcogida: "", experienciaAcogida: "",
    // apadrinar
    nombreGato: "", tipoAportacion: "", comunicacion: "",
    // adoptar
    gatoEnMente: "", tipoVivienda: "", animalesActuales: [], animalesActualesTexto: "", personasAdoptar: "", experienciaAdoptar: "",
  });

  // Leer parámetro ?tipo= de la URL
  useEffect(() => {
    const t = searchParams.get("tipo");
    if (t) setTipo(t);
    const gato = searchParams.get("gato");
    if (gato) setForm((f) => ({ ...f, nombreGato: gato, gatoEnMente: gato }));
  }, [searchParams]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleArr = (key, val) => setForm((f) => {
    const arr = f[key];
    return { ...f, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ tipo, privacidad, ...form });
    // aquí irá la llamada a Firebase / backend
  };

  return (
    <section className="cform-wrap">
      <h2 className="cform-title">¿En qué podemos ayudarte?</h2>

      <form className="cform" onSubmit={handleSubmit}>

        {/* ---- CAMPOS COMUNES ---- */}
        <input className="cform-input" type="text" placeholder="Nombre completo *" value={form.nombre} onChange={(e) => set("nombre", e.target.value)} required />
        <input className="cform-input" type="email" placeholder="Correo *" value={form.correo} onChange={(e) => set("correo", e.target.value)} required />
        <input className="cform-input" type="tel" placeholder="Teléfono" value={form.telefono} onChange={(e) => set("telefono", e.target.value)} />

        <select className="cform-select" value={tipo} onChange={(e) => setTipo(e.target.value)} required>
          {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        <select className="cform-select" value={form.conocido} onChange={(e) => set("conocido", e.target.value)}>
          {CONOCIDO.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        <textarea className="cform-textarea" placeholder="Cuéntanos más *" value={form.mensaje} onChange={(e) => set("mensaje", e.target.value)} required rows={4} />

        {/* ---- CAMPOS DINÁMICOS: VOLUNTARIO ---- */}
        {tipo === "voluntario" && (
          <fieldset className="cform-fieldset">
            <legend className="cform-legend">Voluntariado</legend>
            <p className="cform-sublabel">Disponibilidad horaria *</p>
            <div className="cform-checks">
              {["Mañana", "Tarde", "Fin de semana"].map((v) => (
                <label key={v} className="cform-check">
                  <input type="checkbox" checked={form.disponibilidad.includes(v)} onChange={() => toggleArr("disponibilidad", v)} />
                  <span className="cform-check-box" />
                  {v}
                </label>
              ))}
            </div>
            <p className="cform-sublabel">Tareas que podrías realizar *</p>
            <div className="cform-checks">
              {["Limpieza", "Alimentación", "Medicación", "Fotos/vídeos", "Socialización"].map((v) => (
                <label key={v} className="cform-check">
                  <input type="checkbox" checked={form.tareas.includes(v)} onChange={() => toggleArr("tareas", v)} />
                  <span className="cform-check-box" />
                  {v}
                </label>
              ))}
            </div>
            <textarea className="cform-textarea" placeholder="¿Tienes experiencia previa con animales?" value={form.experienciaVol} onChange={(e) => set("experienciaVol", e.target.value)} rows={3} />
          </fieldset>
        )}

        {/* ---- CAMPOS DINÁMICOS: ACOGIDA ---- */}
        {tipo === "acogida" && (
          <fieldset className="cform-fieldset">
            <legend className="cform-legend">Casa de acogida</legend>
            <select className="cform-select" value={form.tipoHogar} onChange={(e) => set("tipoHogar", e.target.value)} required>
              <option value="">Tipo de hogar *</option>
              {["Piso", "Casa", "Con terraza", "Con patio"].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <input className="cform-input" type="text" placeholder="Personas en casa (adultos, niños y edades) *" value={form.personasCasa} onChange={(e) => set("personasCasa", e.target.value)} required />
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
            <input className="cform-input" type="text" placeholder="Especifica si hay otros animales" value={form.animalesTexto} onChange={(e) => set("animalesTexto", e.target.value)} />
            <select className="cform-select" value={form.tiempoAcogida} onChange={(e) => set("tiempoAcogida", e.target.value)} required>
              <option value="">Tiempo de acogida que puedes ofrecer *</option>
              {["Menos de 1 mes", "1-3 meses", "Indefinido"].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
            <textarea className="cform-textarea" placeholder="Experiencia previa acogiendo o conviviendo con gatos" value={form.experienciaAcogida} onChange={(e) => set("experienciaAcogida", e.target.value)} rows={3} />
          </fieldset>
        )}

        {/* ---- CAMPOS DINÁMICOS: APADRINAR ---- */}
        {tipo === "apadrinar" && (
          <fieldset className="cform-fieldset">
            <legend className="cform-legend">Apadrinar un gato</legend>
            <input className="cform-input" type="text" placeholder="Nombre del gato a apadrinar *" value={form.nombreGato} onChange={(e) => set("nombreGato", e.target.value)} required />
            <select className="cform-select" value={form.tipoAportacion} onChange={(e) => set("tipoAportacion", e.target.value)} required>
              <option value="">Tipo de aportación *</option>
              <option value="10">10€/mes</option>
              <option value="otra">Otra cantidad</option>
            </select>
            <select className="cform-select" value={form.comunicacion} onChange={(e) => set("comunicacion", e.target.value)} required>
              <option value="">Preferencia de comunicación *</option>
              {["Email", "WhatsApp", "Ambos"].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </fieldset>
        )}

        {/* ---- CAMPOS DINÁMICOS: ADOPTAR ---- */}
        {tipo === "adoptar" && (
          <fieldset className="cform-fieldset">
            <legend className="cform-legend">Adopción</legend>
            <input className="cform-input" type="text" placeholder="¿Tienes ya un gato en mente?" value={form.gatoEnMente} onChange={(e) => set("gatoEnMente", e.target.value)} />
            <select className="cform-select" value={form.tipoVivienda} onChange={(e) => set("tipoVivienda", e.target.value)} required>
              <option value="">Tipo de vivienda *</option>
              {["Piso", "Casa", "Con terraza", "Con patio"].map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
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
            <input className="cform-input" type="text" placeholder="Especifica si hay otros animales" value={form.animalesActualesTexto} onChange={(e) => set("animalesActualesTexto", e.target.value)} />
            <input className="cform-input" type="text" placeholder="Personas en casa (adultos, niños y edades) *" value={form.personasAdoptar} onChange={(e) => set("personasAdoptar", e.target.value)} required />
            <textarea className="cform-textarea" placeholder="Experiencia previa con gatos" value={form.experienciaAdoptar} onChange={(e) => set("experienciaAdoptar", e.target.value)} rows={3} />
          </fieldset>
        )}

        {/* ---- PRIVACIDAD + ENVÍO ---- */}
        <label className="cform-privacy">
          <input type="checkbox" checked={privacidad} onChange={() => setPrivacidad((v) => !v)} required />
          <span className="cform-check-box" />
          He leído y acepto la <a href="/privacidad" className="cform-privacy-link">política de privacidad</a> *
        </label>

        <button type="submit" className="cform-submit">Enviar</button>

      </form>
    </section>
  );
}
