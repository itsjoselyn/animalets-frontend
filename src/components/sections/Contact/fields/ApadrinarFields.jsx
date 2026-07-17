export default function ApadrinarFields({ form, errors, setField }) {
  return (
    <fieldset className="cform-fieldset">
      <legend className="cform-legend">Apadrinar un gato</legend>

      <input data-field="nombreGato" className={`cform-input${errors.nombreGato ? ' cform-input--error' : ''}`} type="text" placeholder="Nombre del gato a apadrinar *" value={form.nombreGato} onChange={(e) => setField("nombreGato", e.target.value)} />
      {errors.nombreGato && <p className="cform-field-error">{errors.nombreGato}</p>}

      <p className="cform-sublabel">Tipo de aportación *</p>
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
        <option value="" disabled hidden>Elige una opción</option>
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
  );
}
