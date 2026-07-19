import ViviendaExperienciaFields from "./ViviendaExperienciaFields";

export default function AcogidaFields({ form, errors, setField, toggleArr, toggleMax }) {
  return (
    <fieldset className="cform-fieldset">
      <legend className="cform-legend">Casa de acogida</legend>

      <ViviendaExperienciaFields
        form={form}
        errors={errors}
        setField={setField}
        toggleArr={toggleArr}
        toggleMax={toggleMax}
        required
      />

      <p className="cform-sublabel">Tiempo de acogida que puedes ofrecer *</p>
      <select data-field="tiempoAcogida" className={`cform-select${errors.tiempoAcogida ? ' cform-select--error' : ''}`} value={form.tiempoAcogida} onChange={(e) => setField("tiempoAcogida", e.target.value)}>
        <option value="" disabled hidden>Elige una opción</option>
        {["Menos de 1 mes", "1-3 meses", "Indefinido"].map((v) => <option key={v} value={v}>{v}</option>)}
      </select>
      {errors.tiempoAcogida && <p className="cform-field-error">{errors.tiempoAcogida}</p>}
    </fieldset>
  );
}
