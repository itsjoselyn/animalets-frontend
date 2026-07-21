import { useState, useEffect, useMemo } from "react";
import BlogCard from "./BlogCard";
import "./BlogGrid.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { formatBlogDate, getFirestoreTimestampMs, normalizeBlogImages } from "./blogUtils";
import { PAGE_SIZE } from "../../../utils/constants";
import { Pagination, Empty, Card } from "antd";

export default function BlogGrid() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar posts del blog desde Firestore
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
            imagenes: images.map((url) => ({ url })),
            body: data.descripcion || data.body || data.text || "",
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            date: formatBlogDate(publishedAt),
            sortTime: getFirestoreTimestampMs(data.updatedAt || data.createdAt),
          };
        });

        // Ordenar del más reciente al más antiguo
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

  // Artículos a mostrar en la página actual
  const shown = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return posts.slice(start, start + pageSize);
  }, [posts, currentPage, pageSize]);

  // Manejador del cambio de página
  const handlePageChange = (page, newPageSize) => {
    setCurrentPage(page);
    setPageSize(newPageSize);
    // Scroll suave hacia arriba
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  return (
    <div className="blog-grid-wrap">
      {/* Rejilla de Noticias */}
      <div className="blog-grid">
        {loading ? (
          // Skeleton loader oficial usando Card de Antd
          Array.from({ length: pageSize }).map((_, i) => (
            <Card key={i} style={{ borderRadius: 12 }} loading active />
          ))
        ) : posts.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", padding: "40px 0" }}>
            <Empty description="No hay noticias publicadas todavía." />
          </div>
        ) : (
          shown.map((post) => <BlogCard key={post.id} post={post} />)
        )}
      </div>

      {/* Paginación de Ant Design */}
      {!loading && posts.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40, marginBottom: 20 }}>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={posts.length}
            onChange={handlePageChange}
            showSizeChanger
            pageSizeOptions={["6", "9", "12", "18"]}
            showTotal={(total, range) => `${range[0]}-${range[1]} de ${total} artículos`}
          />
        </div>
      )}
    </div>
  );
}