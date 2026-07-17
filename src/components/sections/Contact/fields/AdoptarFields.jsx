import ViviendaExperienciaFields from "./ViviendaExperienciaFields";

export default function AdoptarFields({ form, errors, setField, toggleArr, toggleMax }) {
  return (
    <fieldset className="cform-fieldset">
      <legend className="cform-legend">Adopción</legend>

      <ViviendaExperienciaFields
        form={form}
        errors={errors}
        setField={setField}
        toggleArr={toggleArr}
        toggleMax={toggleMax}
        required={false}
      />
    </fieldset>
  );
}
