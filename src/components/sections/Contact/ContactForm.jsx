import "./ContactForm.css";
import { useContactForm } from "./useContactForm";
import CommonFields from "./fields/CommonFields";
import VoluntarioFields from "./fields/VoluntarioFields";
import AcogidaFields from "./fields/AcogidaFields";
import ApadrinarFields from "./fields/ApadrinarFields";
import AdoptarFields from "./fields/AdoptarFields";
import PrivacyModal from "./PrivacyModal";
import Toast from "./Toast";
import { Button } from "antd";

export default function ContactForm() {
  const {
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
  } = useContactForm();

  return (
    <section className="cform-wrap">
      <form ref={formRef} className="cform" onSubmit={handleSubmit} noValidate>
        <CommonFields
          form={form}
          errors={errors}
          tipo={tipo}
          setField={setField}
          handleTipoChange={handleTipoChange}
        />

        {tipo === "voluntario" && (
          <VoluntarioFields form={form} errors={errors} setField={setField} toggleArr={toggleArr} />
        )}

        {tipo === "acogida" && (
          <AcogidaFields form={form} errors={errors} setField={setField} toggleArr={toggleArr} toggleMax={toggleMax} />
        )}

        {tipo === "apadrinar" && (
          <ApadrinarFields form={form} errors={errors} setField={setField} />
        )}

        {tipo === "adoptar" && (
          <AdoptarFields form={form} errors={errors} setField={setField} toggleArr={toggleArr} toggleMax={toggleMax} />
        )}

        <label className="cform-privacy">
          <input data-field="privacidad" type="checkbox" checked={privacidad} onChange={togglePrivacidad} />
          <span className="cform-check-box" />
          He leído y acepto la <a href="/privacidad" className="cform-privacy-link" onClick={openPrivacyModal}>política de privacidad</a> *
        </label>
        {errors.privacidad && <p className="cform-field-error">{errors.privacidad}</p>}

        <Button type="primary" htmlType="submit" disabled={sending}>
          {sending ? "Enviando..." : "Enviar"}
        </Button>      </form>

      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <Toast toast={toast} onClose={dismissToast} />
    </section>
  );
}
