import "./PeludosSort.css";
import { OPTIONS_FILTER } from "../../../utils/constants";
import Button from "../../common/Button/Button";

export default function PeludosSort({ isOpen, onClose, value, onChange }) {
  return (
    <>
      {isOpen && <div className="psort-overlay" onClick={onClose} />}
      {isOpen && (
        <div className="psort-dropdown">
          {OPTIONS_FILTER.map((opt) => (
            <Button
              key={opt.value}
              variant="sort-option"
              active={value === opt.value}
              onClick={() => { onChange(value === opt.value ? null : opt.value); onClose(); }}
            >
              {opt.label}
              {value === opt.value && <span className="psort-check">✓</span>}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
