import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./BlogPostPage.css";
import { optimizeCloudinaryImage } from '../lib/optimizeCloudinaryImage';
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function BlogPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [nextPost, setNextPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("No se indicó id del artículo");
      setLoading(false);
      return;
    }

    let mounted = true;
    async function fetchPost() {
      setLoading(true);
      try {
        const docRef = doc(db, "blog", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          setError("Artículo no encontrado");
          setLoading(false);
          return;
        }

        const data = docSnap.data();
        const ts = data.updatedAt || data.createdAt;
        let dateStr = "";
        if (ts) {
          if (typeof ts.toDate === "function") {
            dateStr = ts.toDate().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
          } else {
            dateStr = new Date(ts).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
          }
        }

        const normalized = {
          id: docSnap.id,
          title: data.titulo || data.title || "",
          img: (Array.isArray(data.imagenes) && data.imagenes[0] && (data.imagenes[0].url || data.imagenes[0])) || data.imagen || data.image || data.img || "",
          body: data.descripcion || data.body || data.text || "",
          date: dateStr,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        };

        if (mounted) setPost(normalized);

        // Fetch all posts to determine the "next" article by date
        const snapshot = await getDocs(collection(db, "blog"));
        const docs = snapshot.docs.map((d) => {
          const dd = d.data();
          const t = dd.updatedAt || dd.createdAt;
          const time = t ? (typeof t.toDate === "function" ? t.toDate().getTime() : new Date(t).getTime()) : 0;
          return {
            id: d.id,
            title: dd.titulo || dd.title || "",
            time,
          };
        });
        docs.sort((a, b) => b.time - a.time);
        const index = docs.findIndex((p) => p.id === id);
        if (index >= 0 && index + 1 < docs.length) {
          if (mounted) setNextPost(docs[index + 1]);
        }

      } catch (err) {
        console.error("Error fetching blog post:", err);
        if (mounted) setError("Error cargando artículo");
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
          <div className="blogpost-title-skel skeleton" style={{ width: '60%', height: '36px', borderRadius: 6 }} />
          <div className="blogpost-nav-top">
            <div className="blogpost-back-skel skeleton" style={{ width: '120px', height: '12px', borderRadius: 6 }} />
            <div className="blogpost-date-skel skeleton" style={{ width: '80px', height: '12px', borderRadius: 6 }} />
          </div>
        </div>
        <div className="blogpost-body">
          <div className="blogpost-img-wrap">
            <div className="blogpost-img-skel skeleton" style={{ width: '100%', height: '220px', borderRadius: 8 }} />
          </div>
          <div className="blogpost-text">
            <div className="skel-line skeleton" style={{ width: '100%', height: '14px', borderRadius: 6 }} />
            <div className="skel-line skeleton" style={{ width: '95%', height: '14px', borderRadius: 6 }} />
            <div className="skel-line skeleton" style={{ width: '90%', height: '14px', borderRadius: 6 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blogpost-notfound">
        <p>{error || "Artículo no encontrado."}</p>
        <Link to="/blog">Volver al blog</Link>
      </div>
    );
  }

  return (
    <div className="blogpost">

      {/* Hero verde: título + nav */}
      <div className="blogpost-hero">
        <h1 className="blogpost-title">{post.title}</h1>
        <div className="blogpost-nav-top">
          <Link to="/blog" className="blogpost-back">
            <span className="blogpost-dot" />
            Todos los artículos
          </Link>
          <span className="blogpost-date">{post.date}</span>
        </div>
      </div>

      {/* Contenido blanco */}
      <div className="blogpost-body">
        <div className="blogpost-img-wrap">
          {post.img ? <img src={optimizeCloudinaryImage(post.img, 1200)} alt={post.title} className="blogpost-img" /> : null}
        </div>

        <div className="blogpost-text">
          {String(post.body).split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Siguiente artículo */}
        {nextPost && (
          <div className="blogpost-next">
            <Link to={`/blog/${nextPost.id}`} className="blogpost-next-link">
              Siguiente artículo
              <span className="blogpost-dot blogpost-dot--green" />
            </Link>
          </div>
        )}
      </div>

    </div>
  );
}
