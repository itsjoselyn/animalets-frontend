import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { optimizeCloudinaryImage } from '../../lib/optimizeCloudinaryImage';

function formatDate(value) {
    if (!value) return "-";
    if (typeof value === "object" && typeof value.toDate === "function") {
        return value.toDate().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
    }
    return new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

export default function AdminNoticias() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const snap = await getDocs(collection(db, "blog"));
                const items = snap.docs.map((d) => {
                    const data = d.data() || {};
                    const ts = data.updatedAt || data.createdAt;
                    const imgFromArray = Array.isArray(data.imagenes) && data.imagenes[0] ? (data.imagenes[0].url || data.imagenes[0]) : null;
                    return {
                        id: d.id,
                        titulo: data.titulo || data.title || "",
                        descripcion: data.descripcion || data.body || data.text || "",
                        imagen: imgFromArray || data.imagen || data.image || data.img || "",
                        date: formatDate(ts),
                        sortTime: ts,
                    };
                });
                items.sort((a, b) => {
                    const getTime = (raw) => {
                        if (!raw) return 0;
                        if (typeof raw.toDate === "function") return raw.toDate().getTime();
                        return new Date(raw).getTime();
                    };
                    return getTime(b.sortTime) - getTime(a.sortTime);
                });
                setPosts(items);
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
            <h3>Noticias</h3>
            {loading ? <p>Cargando...</p> : (
                <>
                    <div style={{ marginBottom: 12 }}>
                        <button className="cayudar-btn" onClick={() => navigate("/admin/noticias/new")}>Crear noticia</button>
                    </div>

                    {posts.length === 0 ? <p>No hay noticias todavia.</p> : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", padding: 8 }}>Titulo</th>
                                    <th style={{ textAlign: "left", padding: 8 }}>Fecha</th>
                                    <th style={{ textAlign: "left", padding: 8 }}>Imagen</th>
                                    <th style={{ padding: 8 }}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {posts.map((post) => (
                                    <tr key={post.id} style={{ borderTop: "1px solid #eee" }}>
                                        <td style={{ padding: 8 }}>{post.titulo || "-"}</td>
                                        <td style={{ padding: 8 }}>{post.date}</td>
                                        <td style={{ padding: 8 }}>
                                            {post.imagen ? <img src={optimizeCloudinaryImage(post.imagen, 300)} alt={post.titulo} style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 6 }} /> : "-"}
                                        </td>
                                        <td style={{ padding: 8 }}>
                                            <button className="cayudar-btn" onClick={() => navigate(`/admin/noticias/${post.id}`)}>Editar</button>
                                            <button
                                                className="cayudar-btn"
                                                style={{ marginLeft: 8, background: "#e53935", color: "#fff" }}
                                                onClick={async () => {
                                                    if (!confirm("Eliminar esta noticia?")) return;
                                                    try {
                                                        await deleteDoc(doc(db, "blog", post.id));
                                                        setPosts((prev) => prev.filter((item) => item.id !== post.id));
                                                    } catch (err) {
                                                        console.error(err);
                                                        alert("Error borrando");
                                                    }
                                                }}
                                            >
                                                Borrar
                                            </button>
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
