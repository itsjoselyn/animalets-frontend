export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`cform-toast cform-toast--${toast.type || "info"}`} role="status">
      <span className="cform-toast-text">{toast.text}</span>
      <button className="cform-toast-close" aria-label="Cerrar" onClick={onClose}>✕</button>
    </div>
  );
}
