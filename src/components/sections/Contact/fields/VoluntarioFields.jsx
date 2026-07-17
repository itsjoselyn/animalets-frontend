export default function VoluntarioFields({ form, errors, setField, toggleArr }) {
  return (
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

      <p className="cform-sublabel">¿Tienes experiencia previa con animales? *</p>
      <div data-field="tieneExperienciaAnimales" className={`cform-radios${errors.tieneExperienciaAnimales ? ' cform-radios--error' : ''}`}>
        <label className="cform-check">
          <input type="radio" name="tieneExperienciaAnimales" checked={form.tieneExperienciaAnimales === 'si'} onChange={() => { setField('tieneExperienciaAnimales', 'si'); }} />
          <span className="cform-check-box" /> Sí
        </label>
        <label className="cform-check">
          <input type="radio" name="tieneExperienciaAnimales" checked={form.tieneExperienciaAnimales === 'no'} onChange={() => { setField('tieneExperienciaAnimales', 'no'); setField('experienciaVol', ''); }} />
          <span className="cform-check-box" /> No
        </label>
      </div>
      {errors.tieneExperienciaAnimales && <p className="cform-field-error">{errors.tieneExperienciaAnimales}</p>}

      {form.tieneExperienciaAnimales === 'si' && (
        <>
          <textarea data-field="experienciaVol" className={`cform-textarea${errors.experienciaVol ? ' cform-textarea--error' : ''}`} placeholder="Cuéntanos un poco tu experiencia *" value={form.experienciaVol} onChange={(e) => setField("experienciaVol", e.target.value)} rows={3} />
          {errors.experienciaVol && <p className="cform-field-error">{errors.experienciaVol}</p>}
        </>
      )}
    </fieldset>
  );
}
