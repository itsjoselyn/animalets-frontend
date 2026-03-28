import "./PeludosSort.css";

const OPTIONS = [
  { value: "age_asc",  label: "Jóvenes" },
  { value: "age_desc", label: "Mayores" },
  { value: "macho",    label: "Gatos (machos)" },
  { value: "hembra",   label: "Gatas (hembras)" },
];

export default function PeludosSort({ isOpen, onClose, value, onChange }) {
  return (
    <>
      {isOpen && <div className="psort-overlay" onClick={onClose} />}
      {isOpen && (
        <div className="psort-dropdown">
          {OPTIONS.map((opt) => (
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
