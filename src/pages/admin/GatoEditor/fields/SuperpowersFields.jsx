export default function SuperpowersFields({ superpowers = {}, setSuperpoder }) {
    return (
        <>
            <br />
            <label className="cform-sublabel">Superpoderes</label><br />
            <label className="cform-sublabel">Nivel de mimos:</label>
            <input className="cform-input" placeholder="Ej. 5/10 o Alto" value={superpowers.nivelMimos || ''} onChange={(e) => setSuperpoder('nivelMimos', e.target.value)} />

            <label className="cform-sublabel">Habilidad especial:</label>
            <input className="cform-input" placeholder="Ej. Dormilón, Juguetón" value={superpowers.habilidadEspecial || ''} onChange={(e) => setSuperpoder('habilidadEspecial', e.target.value)} />

            <label className="cform-sublabel">Estado actual:</label>
            <input className="cform-input" placeholder="Ej. En adopción, Recuperándose" value={superpowers.estadoActual || ''} onChange={(e) => setSuperpoder('estadoActual', e.target.value)} />
        </>
    );
}