
import Button from "../../common/Button/Button";
export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`cform-toast cform-toast--${toast.type || "info"}`} role="status">
      <span className="cform-toast-text">{toast.text}</span>
      <Button variant="close-toast" aria-label="Cerrar" onClick={onClose}>✕</Button>    </div>
  );
}
