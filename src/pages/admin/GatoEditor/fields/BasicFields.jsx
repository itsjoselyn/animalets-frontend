import ArrayInput from '../components/ArrayInput';

export default function BasicFields({ data, setField }) {
    return (
        <>
            <label className="cform-sublabel">Nombre</label>
            <input className="cform-input" placeholder="Nombre" value={data.nombre || ''} onChange={(e) => setField('nombre', e.target.value)} />

            <label className="cform-sublabel">Edad</label>
            <input className="cform-input" placeholder="Edad (años)" value={data.edad || ''} onChange={(e) => setField('edad', e.target.value)} />

            <label className="cform-sublabel">Sexo</label>
            <select className="cform-select" value={data.sexo || ''} onChange={(e) => setField('sexo', e.target.value)}>
                <option value="" disabled hidden>Elige sexo</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
                <option value="Desconocido">Desconocido</option>
            </select>

            <label className="cform-sublabel">Estado</label>
            <select className="cform-select" value={data.estado || 'disponible'} onChange={(e) => setField('estado', e.target.value)}>
                <option value="disponible">Disponible</option>
                <option value="adoptado">Adoptado</option>
            </select>

            <label className="cform-sublabel">Descripción / Historia</label>
            <textarea className="cform-textarea" rows={6} placeholder="Descripción" value={data.historia || ''} onChange={(e) => setField('historia', e.target.value)} />

            <ArrayInput value={data.necesidades || []} onChange={(v) => setField('necesidades', v)} placeholder="Necesidad (ej. comida especial)" />
        </>
    );
}