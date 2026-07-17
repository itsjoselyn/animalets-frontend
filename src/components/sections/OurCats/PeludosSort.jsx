import "./PeludosSort.css";
import { OPTIONS_FILTER } from "../../../utils/constants";

export default function PeludosSort({ isOpen, onClose, value, onChange }) {
  return (
    <>
      {isOpen && <div className="psort-overlay" onClick={onClose} />}
      {isOpen && (
        <div className="psort-dropdown">
          {OPTIONS_FILTER.map((opt) => (
            <button
              key={opt.value}
              className={`psort-option${value === opt.value ? " psort-option--active" : ""}`}
              onClick={() => { onChange(value === opt.value ? null : opt.value); onClose(); }}
            >
              {opt.label}
              {value === opt.value && <span className="psort-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
