import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import { db } from "../../firebase/firebaseConfig";

export default function AdminGatos() {
    const [gatos, setGatos] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const q = collection(db, 'gatos');
                const snap = await getDocs(q);
                const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setGatos(items);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div>
            <h3>Gatos</h3>
            {loading ? <p>Cargando...</p> : (
                <>
                    <div style={{ marginBottom: 12 }}>
                        <button className="cayudar-btn" onClick={() => navigate('/admin/gatos/new')}>Crear gato</button>
                    </div>

                    {gatos.length === 0 ? <p>No hay gatos todavía.</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left', padding: 8 }}>Nombre</th>
                                    <th style={{ textAlign: 'left', padding: 8 }}>Edad</th>
                                    <th style={{ textAlign: 'left', padding: 8 }}>Sexo</th>
                                    <th style={{ textAlign: 'left', padding: 8 }}>Estado</th>
                                    <th style={{ padding: 8 }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {gatos.map(g => (
                                    <tr key={g.id} style={{ borderTop: '1px solid #eee' }}>
                                        <td style={{ padding: 8 }}>{g.nombre || '-'}</td>
                                        <td style={{ padding: 8 }}>{g.edad ?? g.age ?? '-'}</td>
                                        <td style={{ padding: 8 }}>{g.sexo ?? g.gender ?? '-'}</td>
                                        <td style={{ padding: 8 }}>{g.estado ?? '-'}</td>
                                        <td style={{ padding: 8 }}>
                                            <button className="cayudar-btn" onClick={() => navigate(`/admin/gatos/${g.id}`)}>Editar</button>
                                            <button className="cayudar-btn" style={{ marginLeft: 8, background: '#e53935', color: '#fff' }} onClick={async () => {
                                                if (!confirm('Eliminar este gato?')) return;
                                                try {
                                                    const dref = doc(db, 'gatos', g.id);
                                                    await deleteDoc(dref);
                                                    setGatos((s) => s.filter(x => x.id !== g.id));
                                                } catch (err) { console.error(err); alert('Error borrando'); }
                                            }}>Borrar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
}
