// Preguntas compartidas por "acogida" y "adoptar": tipo de vivienda, animales
// en casa, personas en casa y experiencia con gatos.
export default function ViviendaExperienciaFields({ form, errors, setField, toggleArr, toggleMax, required }) {

  return (
    <>
      <input data-field="gatoEnMente" className="cform-input" type="text" placeholder="¿Tienes ya un gato en mente?" value={form.gatoEnMente} onChange={(e) => setField("gatoEnMente", e.target.value)} />

      <p className="cform-sublabel">Tipo de vivienda (elige 1-2) *</p>
      <div data-field="tipoVivienda" className={`cform-checks${errors.tipoVivienda ? ' cform-checks--error' : ''}`}>
        {["Piso", "Casa", "Con terraza", "Con patio"].map((v) => (
          <label key={v} className="cform-check">
            <input type="checkbox" checked={form.tipoVivienda.includes(v)} onChange={() => toggleMax("tipoVivienda", v, 2)} />
            <span className="cform-check-box" />
            {v}
          </label>
        ))}
      </div>
      {errors.tipoVivienda && <p className="cform-field-error">{errors.tipoVivienda}</p>}

      <p className="cform-sublabel">{`¿Tienes animales en casa? *`}</p>
      <div data-field="tieneAnimalesCasa" className={`cform-radios${errors.tieneAnimalesCasa ? ' cform-radios--error' : ''}`}>
        <label className="cform-check">
          <input type="radio" name="tieneAnimalesCasa" checked={form.tieneAnimalesCasa === 'si'} onChange={() => { setField('tieneAnimalesCasa', 'si'); }} />
          <span className="cform-check-box" /> Sí
        </label>
        <label className="cform-check">
          <input type="radio" name="tieneAnimalesCasa" checked={form.tieneAnimalesCasa === 'no'} onChange={() => { setField('tieneAnimalesCasa', 'no'); setField('animalesActuales', []); setField('animalesActualesTexto', ''); }} />
          <span className="cform-check-box" /> No
        </label>
      </div>
      {errors.tieneAnimalesCasa && <p className="cform-field-error">{errors.tieneAnimalesCasa}</p>}

      {form.tieneAnimalesCasa === 'si' && (
        <>
          <p className="cform-sublabel">{`Animales actuales en casa *`}</p>
          <div data-field="animalesActuales" className={`cform-checks${errors.animalesActuales ? ' cform-checks--error' : ''}`}>
            {["Perros", "Gatos", "Otros"].map((v) => (
              <label key={v} className="cform-check">
                <input type="checkbox" checked={form.animalesActuales.includes(v)} onChange={() => toggleArr("animalesActuales", v)} />
                <span className="cform-check-box" />
                {v}
              </label>
            ))}
          </div>
          {errors.animalesActuales && <p className="cform-field-error">{errors.animalesActuales}</p>}
          {form.animalesActuales.includes('Otros') && (
            <input data-field="animalesActualesTexto" className={`cform-input${errors.animalesActualesTexto ? ' cform-input--error' : ''}`} type="text" placeholder={`Especifica si hay otros animales`} value={form.animalesActualesTexto} onChange={(e) => setField("animalesActualesTexto", e.target.value)} />
          )}
          {errors.animalesActualesTexto && <p className="cform-field-error">{errors.animalesActualesTexto}</p>}
        </>
      )}

      <p className="cform-sublabel">{`¿Hay otras personas en casa? *`}</p>
      <div data-field="hayPersonasCasa" className={`cform-radios${errors.hayPersonasCasa ? ' cform-radios--error' : ''}`}>
        <label className="cform-check">
          <input type="radio" name="hayPersonasCasa" checked={form.hayPersonasCasa === 'si'} onChange={() => { setField('hayPersonasCasa', 'si'); }} />
          <span className="cform-check-box" /> Sí
        </label>
        <label className="cform-check">
          <input type="radio" name="hayPersonasCasa" checked={form.hayPersonasCasa === 'no'} onChange={() => { setField('hayPersonasCasa', 'no'); setField('personasAdoptar', ''); }} />
          <span className="cform-check-box" /> No
        </label>
      </div>
      {errors.hayPersonasCasa && <p className="cform-field-error">{errors.hayPersonasCasa}</p>}

      {form.hayPersonasCasa === 'si' && (
        <input data-field="personasAdoptar" className={`cform-input${errors.personasAdoptar ? ' cform-input--error' : ''}`} type="text" placeholder={`Especifica cuántas personas y sus edades`} value={form.personasAdoptar} onChange={(e) => setField("personasAdoptar", e.target.value)} />
      )}
      {errors.personasAdoptar && <p className="cform-field-error">{errors.personasAdoptar}</p>}

      <p className="cform-sublabel">{`¿Tienes experiencia previa con gatos? *`}</p>
      <div data-field="tieneExperienciaGatos" className={`cform-radios${errors.tieneExperienciaGatos ? ' cform-radios--error' : ''}`}>
        <label className="cform-check">
          <input type="radio" name="tieneExperienciaGatos" checked={form.tieneExperienciaGatos === 'si'} onChange={() => { setField('tieneExperienciaGatos', 'si'); }} />
          <span className="cform-check-box" /> Sí
        </label>
        <label className="cform-check">
          <input type="radio" name="tieneExperienciaGatos" checked={form.tieneExperienciaGatos === 'no'} onChange={() => { setField('tieneExperienciaGatos', 'no'); setField('experienciaAdoptar', ''); }} />
          <span className="cform-check-box" /> No
        </label>
      </div>
      {errors.tieneExperienciaGatos && <p className="cform-field-error">{errors.tieneExperienciaGatos}</p>}

      {form.tieneExperienciaGatos === 'si' && (
        <textarea data-field="experienciaAdoptar" className={`cform-textarea${errors.experienciaAdoptar ? ' cform-textarea--error' : ''}`} placeholder={`Cuéntanos un poco de tu experiencia`} value={form.experienciaAdoptar} onChange={(e) => setField("experienciaAdoptar", e.target.value)} rows={3} />
      )}
      {errors.experienciaAdoptar && <p className="cform-field-error">{errors.experienciaAdoptar}</p>}
    </>
  );
}
