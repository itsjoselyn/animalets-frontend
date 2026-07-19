import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import "./CatCarousel.css";
import { optimizeCloudinaryImage } from '../../../lib/optimizeCloudinaryImage';
import { AUTO_SCROLL_INTERVAL } from "../../../utils/constants";
import Button from "../../common/Button/Button";


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
        const docs = snapshot.docs.map((doc, idx) => {
          const data = doc.data() || {};
          return {
            id: doc.id,
            name: data.nombre || data.name || `Gato ${idx + 1}`,
            age: typeof data.edad === "number" ? (data.edad === 1 ? "1 año" : `${data.edad} años`) : (data.edad || data.age || ""),
            gender: data.sexo || data.gender || "",
            img: (Array.isArray(data.imagenes) && data.imagenes[0] && data.imagenes[0].url) || data.imagen || data.image || data.img || "",
          };
        });
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
    <section className="cat-carousel">

      {/* Header */}
      <div className="cat-carousel-header">
        <h2 className="cat-carousel-title">Nuestros peludos</h2>
      </div>

      {/* Carrusel */}
      <div className="cat-carousel-track-wrapper">
        {/* Flecha izquierda */}
        <Button variant="carousel-arrow-left" onClick={prev} aria-label="Anterior">←</Button>

        {/* Cards */}
        <div className="cat-carousel-track">
          {loading ? (
            <div className="cat-card cat-card--active">
              <div className="cat-card-inner">
                <div className="cat-card-img-wrapper">
                  <div className="skeleton" style={{ width: "100%", height: "100%" }} />
                </div>
                <div className="cat-card-info">
                  <div className="skeleton" style={{ height: 22, width: "60%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 14, width: "40%", marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 14, width: "40%" }} />
                </div>
              </div>
            </div>
          ) : cats.length === 0 ? (
            <p>No hay gatos publicados todavía.</p>
          ) : cats.map((cat, index) => {
            const pos = getPosition(index);
            return (
              <div
                key={cat.id}
                className={`cat-card cat-card--${pos}`}
                onMouseEnter={pos === "active" ? () => setIsHovered(true) : undefined}
                onMouseLeave={pos === "active" ? () => setIsHovered(false) : undefined}
              >
                {pos === "active" ? (
                  <Link to={`/nuestros-peludos/${cat.id}`} className="cat-card-inner">
                    <div className="cat-card-img-wrapper">
                      {cat.img ? <img src={optimizeCloudinaryImage(cat.img, { width: 300 })} alt={cat.name} className="cat-card-img" /> : <div className="skeleton" style={{ width: "100%", height: "100%" }} />}
                    </div>
                    <div className="cat-card-info">
                      <h3 className="cat-card-name">{cat.name}</h3>
                      <p className="cat-card-details">{cat.age}</p>
                      <p className="cat-card-details">{cat.gender}</p>
                    </div>
                  </Link>
                ) : (
                  <div className="cat-card-inner">
                    <div className="cat-card-img-wrapper">
                      {cat.img ? <img src={optimizeCloudinaryImage(cat.img, { width: 300 })} alt={cat.name} className="cat-card-img" /> : <div className="skeleton" style={{ width: "100%", height: "100%" }} />}
                    </div>
                    <div className="cat-card-info">
                      <h3 className="cat-card-name">{cat.name}</h3>
                      <p className="cat-card-details">{cat.age}</p>
                      <p className="cat-card-details">{cat.gender}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Flecha derecha */}
        <Button variant="carousel-arrow-right" onClick={next} aria-label="Siguiente">→</Button>      </div>

      {/* Barra de progreso */}
      <div className="cat-carousel-progress-wrapper">
        <div className="cat-carousel-progress-bar">
          <div
            className="cat-carousel-progress-fill"
            style={{ width: totalSlides ? `${((current + 1) / totalSlides) * 100}%` : "0%" }}
          />
        </div>
        <div className="cat-carousel-progress-auto">
          <div
            className="cat-carousel-progress-auto-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Contador */}
      <p className="cat-carousel-counter">
        {totalSlides ? `${String(current + 1).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}` : "00 / 00"}
      </p>

    </section>
  );
}
