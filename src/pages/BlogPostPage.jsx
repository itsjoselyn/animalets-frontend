import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import BlogArticleView from "../components/sections/Blog/BlogArticleView";
import { getFirestoreTimestampMs } from "../components/sections/Blog/blogUtils";

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No se indicó el ID del artículo");
      setLoading(false);
      return;
    }

    // Llevar la pantalla arriba al cambiar de artículo
    window.scrollTo(0, 0);

    let mounted = true;

    async function fetchPost() {
      setLoading(true);
      setError(null);

      try {
        // 1. Obtener el artículo actual
        const docRef = doc(db, "blog", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          if (mounted) {
            setError("Artículo no encontrado");
            setLoading(false);
          }
          return;
        }

        const data = docSnap.data() || {};

        const normalized = {
          id: docSnap.id,
          title: data.titulo || data.title || "",
          imagenes:
            Array.isArray(data.imagenes) && data.imagenes.length > 0
              ? data.imagenes
                .map((item) => {
                  if (!item) return null;
                  if (typeof item === "string") return { url: item };
                  return { url: item.url || item.src || item.image || null };
                })
                .filter((item) => item && item.url)
              : data.imagen || data.image || data.img
                ? [{ url: data.imagen || data.image || data.img }]
                : [],
          body: data.descripcion || data.body || data.text || "",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };

        if (mounted) setPost(normalized);

        // 2. Obtener el siguiente artículo ordenado por fecha
        const blogQuery = query(collection(db, "blog"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(blogQuery);

        const docs = snapshot.docs.map((d) => {
          const dd = d.data() || {};
          const time = getFirestoreTimestampMs(dd.updatedAt || dd.createdAt);
          return {
            id: d.id,
            title: dd.titulo || dd.title || "",
            time,
          };
        });

        // Ordenamos por tiempo calculado
        docs.sort((a, b) => b.time - a.time);
        const index = docs.findIndex((p) => p.id === id);

        const next = index >= 0 && index + 1 < docs.length ? docs[index + 1] : null;

        if (mounted) {
          setNextPost(next);
        }
      } catch (err) {
        console.error("Error fetching blog post:", err);
        if (mounted) setError("Error al cargar el artículo");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchPost();

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="blogpost-skeleton-wrap">
        <div className="blogpost-hero">
          <div
            className="blogpost-title-skel skeleton"
            style={{ width: "60%", height: "36px", borderRadius: 6 }}
          />
          <div className="blogpost-nav-top">
            <div
              className="blogpost-back-skel skeleton"
              style={{ width: "120px", height: "12px", borderRadius: 6 }}
            />
            <div
              className="blogpost-date-skel skeleton"
              style={{ width: "80px", height: "12px", borderRadius: 6 }}
            />
          </div>
        </div>
        <div className="blogpost-body">
          <div className="blogpost-img-wrap">
            <div
              className="blogpost-img-skel skeleton"
              style={{ width: "100%", height: "220px", borderRadius: 8 }}
            />
          </div>
          <div className="blogpost-text">
            <div
              className="skel-line skeleton"
              style={{ width: "100%", height: "14px", borderRadius: 6 }}
            />
            <div
              className="skel-line skeleton"
              style={{ width: "95%", height: "14px", borderRadius: 6 }}
            />
            <div
              className="skel-line skeleton"
              style={{ width: "90%", height: "14px", borderRadius: 6 }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blogpost-notfound" style={{ textAlign: "center", padding: "40px 16px" }}>
        <p style={{ marginBottom: 16 }}>{error || "Artículo no encontrado."}</p>
        <Link to="/blog" className="ant-btn ant-btn-primary">
          <span>Volver al blog</span>
        </Link>
      </div>
    );
  }

  return <BlogArticleView post={post} nextPost={nextPost} showDate />;
}