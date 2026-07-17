import { useState, useEffect } from "react";
import BlogCard from "./BlogCard";
import "./BlogGrid.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { formatBlogDate, getFirestoreTimestampMs, normalizeBlogImages } from "./blogUtils";
import { PAGE_SIZE } from "../../../utils/constants";



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
          const data = doc.data() || {};
          const images = normalizeBlogImages(data);
          const publishedAt = data.createdAt || data.updatedAt;
          return {
            id: doc.id,
            title: data.titulo || data.title || "",
            img: images[0] || "",
            imagenes: images.map(url => ({ url })),
            body: data.descripcion || data.body || data.text || "",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            date: formatBlogDate(publishedAt),
            sortTime: getFirestoreTimestampMs(data.updatedAt || data.createdAt),
          };
        });

        docs.sort((a, b) => b.sortTime - a.sortTime);

        if (mounted) {
          setPosts(docs);
        }
      } catch (err) {
        console.error("Error cargando posts desde Firestore:", err);
        if (mounted) setPosts([]);
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
        ) : posts.length === 0 ? (
          <p>No hay noticias publicadas todavía.</p>
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
