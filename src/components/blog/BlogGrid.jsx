import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import "./BlogGrid.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";


const PAGE_SIZE = 12;

export default function BlogGrid() {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load blog posts from Firestore collection 'blog'
  useEffect(() => {
    let mounted = true;
    async function loadPosts() {
      setLoading(true);
      try {
        const q = collection(db, "blog");
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => {
          const data = doc.data();
          const ts = data.updatedAt || data.createdAt;
          let dateStr = "";
          if (ts) {
            if (typeof ts.toDate === "function") {
              dateStr = ts.toDate().toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
            } else {
              dateStr = new Date(ts).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
            }
          }
          return {
            id: doc.id,
            title: data.titulo || data.title || "",
            img: data.imagen || data.image || data.img || "",
            body: data.descripcion || data.body || data.text || "",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            date: dateStr,
          };
        });

        // Sort by updatedAt (or createdAt) descending
        const getTime = (ts) => {
          if (!ts) return 0;
          if (typeof ts.toDate === "function") return ts.toDate().getTime();
          return new Date(ts).getTime();
        };

        docs.sort((a, b) => getTime(b.updatedAt || b.createdAt) - getTime(a.updatedAt || a.createdAt));

        if (mounted) {
          if (docs.length > 0) setPosts(docs);
          else setPosts(POSTS); // fallback only after loading
        }
      } catch (err) {
        console.error("Error cargando posts desde Firestore:", err);
        if (mounted) setPosts(POSTS); // fallback on error
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadPosts();
    return () => {
      mounted = false;
    };
  }, []);

  const total = posts.length;
  const shown = posts.slice(0, visible);
  const hasMore = visible < total;
  const progress = total > 0 ? Math.round((shown.length / total) * 100) : 0;

  return (
    <div className="blog-grid-wrap">
      <div className="blog-grid">
        {loading ? (
          // Loading skeletons
          Array.from({ length: Math.min(PAGE_SIZE, 6) }).map((_, i) => (
            <div key={i} className="blog-skeleton">
              <div className="blog-skeleton-top">
                <div className="blog-skeleton-date skeleton" />
                <div className="blog-skeleton-img skeleton" />
              </div>
              <div className="blog-skeleton-title skeleton" />
            </div>
          ))
        ) : (
          shown.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))
        )}
      </div>

      {!loading && (
        <div className="blog-grid-footer">
          <p className="blog-grid-count">
            Mostrando {shown.length} de {posts.length} resultados
          </p>
          <div className="blog-grid-progress-bar">
            <div
              className="blog-grid-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          {hasMore && (
            <button
              className="blog-grid-more-btn"
              onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, posts.length))}
            >
              Mostrar más
            </button>
          )}
        </div>
      )}
    </div>
  );
}
