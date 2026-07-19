import { TIPOS, CONOCIDO } from "../../../../utils/constants";

export default function CommonFields({ form, errors, tipo, setField, handleTipoChange }) {
  return (
    <>
      <input data-field="nombre" className={`cform-input${errors.nombre ? ' cform-input--error' : ''}`} type="text" placeholder="Nombre completo *" value={form.nombre} onChange={(e) => setField("nombre", e.target.value.replace(/[0-9]/g, ''))} />
      {errors.nombre && <p className="cform-field-error">{errors.nombre}</p>}

      <input data-field="correo" className={`cform-input${errors.correo ? ' cform-input--error' : ''}`} type="email" placeholder="Correo *" value={form.correo} onChange={(e) => setField("correo", e.target.value)} />
      {errors.correo && <p className="cform-field-error">{errors.correo}</p>}

      <input data-field="telefono" className={`cform-input${errors.telefono ? ' cform-input--error' : ''}`} type="tel" placeholder="Teléfono" value={form.telefono} onChange={(e) => setField("telefono", e.target.value.replace(/\D/g, ''))} />
      {errors.telefono && <p className="cform-field-error">{errors.telefono}</p>}

      <input data-field="edad" className={`cform-input${errors.edad ? ' cform-input--error' : ''}`} type="number" min="0" placeholder="Edad *" value={form.edad} onChange={(e) => setField("edad", e.target.value)} />
      {errors.edad && <p className="cform-field-error">{errors.edad}</p>}

      <p className="cform-sublabel">¿Cómo nos conociste?</p>
      <select data-field="conocido" className="cform-select" value={form.conocido} onChange={(e) => setField("conocido", e.target.value)}>
        <option value="" disabled hidden>Elige una opción</option>
        {CONOCIDO.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
      </select>

      <p className="cform-sublabel">¿Cuál es tu consulta? *</p>
      <select data-field="tipo" className={`cform-select${errors.tipo ? ' cform-select--error' : ''}`} value={tipo} onChange={(e) => handleTipoChange(e.target.value)}>
        <option value="" disabled hidden>Elige una opción</option>
        {TIPOS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
      </select>
      {errors.tipo && <p className="cform-field-error">{errors.tipo}</p>}

      <textarea data-field="mensaje" className={`cform-textarea${errors.mensaje ? ' cform-textarea--error' : ''}`} placeholder={tipo === 'otros' ? 'Cuéntanos más *' : 'Cuéntanos más'} value={form.mensaje} onChange={(e) => setField("mensaje", e.target.value)} rows={4} />
      {errors.mensaje && <p className="cform-field-error">{errors.mensaje}</p>}
    </>
  );
}
