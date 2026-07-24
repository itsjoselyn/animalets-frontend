import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import "./CatCarousel.css";
import { optimizeCloudinaryImage } from "../../../lib/optimizeCloudinaryImage";
import { AUTO_SCROLL_INTERVAL } from "../../../utils/constants";
import { Button, Card, Tag, Empty } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const GREEN_COLOR = "#2e7d32";

export default function CatCarousel() {
  const [cats, setCats] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const progressStartRef = useRef(null);

  const totalSlides = cats.length;

  useEffect(() => {
    let mounted = true;
    async function loadCats() {
      setLoading(true);
      try {
        const snapshot = await getDocs(collection(db, "gatos"));
        const docs = snapshot.docs
          .map((doc, idx) => {
            const data = doc.data() || {};

            const firstImg = Array.isArray(data.imagenes) && data.imagenes.length > 0
              ? (typeof data.imagenes[0] === "string" ? data.imagenes[0] : data.imagenes[0]?.url)
              : data.img || data.imagen || data.image || "";

            return {
              id: doc.id,
              name: data.nombre || data.name || `Gato ${idx + 1}`,
              age: typeof data.edad === "number" ? (data.edad === 1 ? "1 año" : `${data.edad} años`) : (data.edad || data.age || ""),
              gender: data.sexo || data.gender || "",
              img: firstImg,
              adoptado: data.estado === "adoptado" || data.adoptado || false,
            };
          })
          .filter((cat) => !cat.adoptado);

        if (mounted) {
          setCats(docs.slice(0, 6));
          setCurrent(0);
        }
      } catch (err) {
        console.error("Error cargando carrusel de gatos:", err);
        if (mounted) setCats([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadCats();
    return () => {
      mounted = false;
    };
  }, []);

  const goTo = useCallback((index) => {
    if (!totalSlides) return;
    setCurrent((index + totalSlides) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (!totalSlides) return;
    if (isHovered) {
      clearInterval(intervalRef.current);
      cancelAnimationFrame(progressRef.current);
      return;
    }

    setProgress(0);
    progressStartRef.current = performance.now();

    const animate = (now) => {
      const elapsed = now - progressStartRef.current;
      const pct = Math.min((elapsed / AUTO_SCROLL_INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        progressRef.current = requestAnimationFrame(animate);
      }
    };

    progressRef.current = requestAnimationFrame(animate);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % totalSlides);
      setProgress(0);
      progressStartRef.current = performance.now();
      cancelAnimationFrame(progressRef.current);
      progressRef.current = requestAnimationFrame(animate);
    }, AUTO_SCROLL_INTERVAL);

    return () => {
      clearInterval(intervalRef.current);
      cancelAnimationFrame(progressRef.current);
    };
  }, [isHovered, totalSlides, current]);

  const getPosition = (index) => {
    const diff = (index - current + totalSlides) % totalSlides;
    if (diff === 0) return "active";
    if (diff === 1) return "next";
    if (diff === totalSlides - 1) return "prev";
    return "hidden";
  };

  return (
    <section className="cat-carousel" style={{ padding: "32px 0" }}>

      <div className="cat-carousel-header">
        <h2 className="cat-carousel-title" style={{ fontSize: "2rem", fontWeight: 800, textAlign: "center", marginBottom: 24 }}>
          Nuestros peludos
        </h2>
      </div>

      <div className="cat-carousel-track-wrapper" style={{ position: "relative", display: "flex", alignItems: "center" }}>

        <Button
          type="default"
          shape="circle"
          size="large"
          icon={<LeftOutlined />}
          onClick={prev}
          aria-label="Anterior"
          className="carousel-arrow-left"
          style={{ zIndex: 10 }}
        />

        <div className="cat-carousel-track">
          {loading ? (
            <Card style={{ width: 280, borderRadius: 16 }} loading />
          ) : cats.length === 0 ? (
            <div style={{ width: "100%", padding: "20px 0" }}>
              <Empty description="No hay peludos disponibles en este momento." />
            </div>
          ) : (
            cats.map((cat, index) => {
              const pos = getPosition(index);
              const isActive = pos === "active";

              const cardContent = (
                <Card
                  hoverable={isActive}
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    border: isActive ? `2px solid ${GREEN_COLOR}` : "1px solid #f0f0f0",
                  }}
                  cover={
                    <div style={{ position: "relative", height: 260, overflow: "hidden", backgroundColor: "#f5f5f5" }}>
                      {cat.img ? (
                        <>
                          {/* Fondo desenfocado que rellena el hueco */}
                          <div
                            style={{
                              position: "absolute",
                              inset: 0,
                              backgroundImage: `url(${optimizeCloudinaryImage(cat.img, { width: 100 })})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              filter: "blur(20px) brightness(0.9)",
                              transform: "scale(1.2)",
                            }}
                          />
                          <img
                            src={optimizeCloudinaryImage(cat.img, { width: 400 })}
                            alt={cat.name}
                            style={{
                              position: "relative",
                              zIndex: 1,
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              objectPosition: "center",
                              display: "block",
                            }}
                          />
                        </>
                      ) : (
                        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#bfbfbf" }}>
                          Sin foto
                        </div>
                      )}
                    </div>
                  }
                >
                  <Card.Meta
                    title={<span style={{ fontSize: "1.2rem", fontWeight: 700 }}>{cat.name}</span>}
                    description={
                      <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                        {cat.age && (
                          <Tag style={{ color: GREEN_COLOR, borderColor: GREEN_COLOR, background: "#f6ffed", fontWeight: 500 }}>
                            {cat.age}
                          </Tag>
                        )}
                        {cat.gender && (
                          <Tag style={{ color: GREEN_COLOR, borderColor: GREEN_COLOR, background: "#f6ffed", fontWeight: 500 }}>
                            {cat.gender}
                          </Tag>
                        )}
                      </div>
                    }
                  />
                </Card>
              );

              return (
                <div
                  key={cat.id}
                  className={`cat-card cat-card--${pos}`}
                  onMouseEnter={isActive ? () => setIsHovered(true) : undefined}
                  onMouseLeave={isActive ? () => setIsHovered(false) : undefined}
                >
                  {isActive ? (
                    <Link to={`/nuestros-peludos/${cat.id}`} style={{ textDecoration: "none" }}>
                      {cardContent}
                    </Link>
                  ) : (
                    cardContent
                  )}
                </div>
              );
            })
          )}
        </div>

        <Button
          type="default"
          shape="circle"
          size="large"
          icon={<RightOutlined />}
          onClick={next}
          aria-label="Siguiente"
          className="carousel-arrow-right"
          style={{ zIndex: 10 }}
        />
      </div>

      <div className="cat-carousel-footer" style={{ marginTop: 24 }}>
        <div className="cat-carousel-progress-wrapper">
          <div className="cat-carousel-progress-bar">
            <div
              className="cat-carousel-progress-fill"
              style={{
                width: totalSlides ? `${((current + 1) / totalSlides) * 100}%` : "0%",
                backgroundColor: GREEN_COLOR,
              }}
            />
          </div>
          <div className="cat-carousel-progress-auto">
            <div
              className="cat-carousel-progress-auto-fill"
              style={{ width: `${progress}%`, backgroundColor: GREEN_COLOR }}
            />
          </div>
        </div>

        <p className="cat-carousel-counter" style={{ fontWeight: 600, color: "#595959" }}>
          {totalSlides ? `${String(current + 1).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}` : "00 / 00"}
        </p>
      </div>

    </section>
  );
}