import { useEffect, useState } from "react";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebaseConfig";
import { optimizeCloudinaryImage } from '../../lib/optimizeCloudinaryImage';
import { formatBlogDate, getFirestoreTimestampMs, normalizeBlogImages } from "../../components/sections/Blog/blogUtils";
import { Button } from "antd";

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
                    const images = normalizeBlogImages(data);
                    const publishedAt = data.createdAt || data.updatedAt;
                    return {
                        id: d.id,
                        titulo: data.titulo || data.title || "",
                        descripcion: data.descripcion || data.body || data.text || "",
                        imagenes: images,
                        imagen: images[0] || "",
                        createdAt: data.createdAt,
                        updatedAt: data.updatedAt,
                        date: formatBlogDate(publishedAt),
                        updatedDate: formatBlogDate(data.updatedAt),
                        sortTime: getFirestoreTimestampMs(data.updatedAt || data.createdAt),
                    };
                });
                items.sort((a, b) => b.sortTime - a.sortTime);
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
                        <Button type="primary" onClick={() => navigate('/admin/noticias/new')}>Crear noticia</Button>                    </div>

                    {posts.length === 0 ? <p>No hay noticias todavia.</p> : (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: "left", padding: 8 }}>Titulo</th>
                                    <th style={{ textAlign: "left", padding: 8 }}>Creada</th>
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
                                            {post.imagen ? <img src={optimizeCloudinaryImage(post.imagen, { width: 300 })} alt={post.titulo} style={{ width: 64, height: 48, objectFit: "cover", borderRadius: 6 }} /> : "-"}
                                        </td>
                                        <td style={{ padding: 8 }}>
                                            <Button onClick={() => navigate(`/admin/noticias/${post.id}`)}>Editar</Button>
                                            <Button
                                                type="primary"
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
                                                danger>
                                                Borrar
                                            </Button>
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
