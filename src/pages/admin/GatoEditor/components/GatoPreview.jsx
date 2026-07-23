export default function GatoPreview({ data, imagenesPreview, selectedPreview, setSelectedPreview }) {
    return (
        <aside className="gato-editor-preview">
            <div className="catprofile">
                {imagenesPreview.length > 1 && (
                    <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px", marginBottom: "10px" }}>
                        {imagenesPreview.map((img, i) => (
                            <img
                                key={i} src={img.url} alt={`preview-${i}`}
                                onClick={() => setSelectedPreview(i)}
                                style={{
                                    width: 70, height: 70, objectFit: "contain", borderRadius: 8, cursor: "pointer",
                                    border: i === selectedPreview ? "3px solid #4caf50" : "2px solid #ddd", flexShrink: 0
                                }}
                            />
                        ))}
                    </div>
                )}

                {imagenesPreview.length > 0 ? (
                    <img src={imagenesPreview[selectedPreview]?.url} alt="Preview" className="catprofile-img" />
                ) : (
                    <div className="skeleton" style={{ width: "100%", height: 300, borderRadius: 8 }} />
                )}

                <div className="catprofile-body">
                    <div className="catprofile-hero">
                        <h1 className="catprofile-name">{data.nombre || 'Nombre del gato'}</h1>
                        <div className="catprofile-meta">
                            {data.edad !== undefined && data.edad !== '' && (
                                <span>{String(data.edad)} {Number(data.edad) === 1 ? 'año' : 'años'}</span>
                            )}
                            <span style={{ marginLeft: 8 }}>{data.sexo || ''}</span>
                        </div>
                    </div>

                    <p className="catprofile-bio">{data.historia || 'Descripción breve del gato'}</p>

                    <div className="catprofile-section">
                        <h2 className="catprofile-section-title">Lo que necesito</h2>
                        <ul className="catprofile-list">
                            {(data.necesidades || []).map((n, i) => <li key={i} className="catprofile-list-item">{n}</li>)}
                        </ul>

                        <div className="catprofile-section">
                            <h2 className="catprofile-section-title">Mis superpoderes</h2>
                            <ul className="catprofile-powers">
                                <li className="catprofile-power"><span className="catprofile-power-label">Nivel de mimos:</span> {data.superpoderes?.nivelMimos}</li>
                                <li className="catprofile-power"><span className="catprofile-power-label">Habilidad especial:</span> {data.superpoderes?.habilidadEspecial}</li>
                                <li className="catprofile-power"><span className="catprofile-power-label">Estado actual:</span> {data.superpoderes?.estadoActual}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}