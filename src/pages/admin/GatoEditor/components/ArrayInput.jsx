import { Button } from "antd";

export default function ArrayInput({ label, value = [], onChange, placeholder = '' }) {
    const v = Array.isArray(value) ? value : [];

    const setAt = (idx, val) => {
        const next = [...v];
        next[idx] = val;
        onChange(next);
    };

    return (
        <div>
            <label className="cform-sublabel">{label}</label>
            {v.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <input
                        className="cform-input"
                        value={item}
                        onChange={(e) => setAt(i, e.target.value)}
                        placeholder={placeholder}
                    />
                    <Button
                        type="primary"
                        onClick={() => onChange(v.filter((_, idx) => idx !== i))}
                        danger
                    >
                        Eliminar
                    </Button>
                </div>
            ))}
            <Button onClick={() => onChange([...v, ''])}>Añadir</Button>
        </div>
    );
}