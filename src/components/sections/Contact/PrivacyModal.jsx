import { Button } from "antd";
export default function PrivacyModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="cform-privacy-modal-overlay" onClick={onClose}>
      <div className="cform-privacy-modal" onClick={(e) => e.stopPropagation()}>
        <Button aria-label="Cerrar" onClick={onClose}>✕</Button>
        <iframe src="/privacidad-bare" title="Política de privacidad" className="cform-privacy-iframe" />
      </div>
    </div>
  );
}
