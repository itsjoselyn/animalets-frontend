import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "./CatCarousel.css";

const CATS = [
  { id: 1, name: "Steven", age: "6 años", gender: "Macho", img: "https://placecats.com/neo/300/400" },
  { id: 2, name: "Luna", age: "2 años", gender: "Hembra", img: "https://placecats.com/millie/300/400" },
  { id: 3, name: "Mochi", age: "1 año", gender: "Macho", img: "https://placecats.com/bella/300/400" },
  { id: 4, name: "Nala", age: "3 años", gender: "Hembra", img: "https://placecats.com/neo_2/300/400" },
  { id: 5, name: "Simba", age: "4 años", gender: "Macho", img: "https://placecats.com/millie_neo/300/400" },
  { id: 6, name: "Cleo", age: "2 años", gender: "Hembra", img: "https://placecats.com/300/400" },
];

const AUTO_SCROLL_INTERVAL = 3000;

export default function CatCarousel() {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const progressStartRef = useRef(null);

  const totalSlides = CATS.length;

  const goTo = useCallback((index) => {
    setCurrent((index + totalSlides) % totalSlides);
    setProgress(0);
  }, [totalSlides]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
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
        <span className="cat-carousel-paw">🐾</span>
        <h2 className="cat-carousel-title">Nuestros peludos</h2>
      </div>

      {/* Carrusel */}
      <div className="cat-carousel-track-wrapper">
        {/* Flecha izquierda */}
        <button className="cat-carousel-arrow cat-carousel-arrow--left" onClick={prev} aria-label="Anterior">
          ←
        </button>

        {/* Cards */}
        <div className="cat-carousel-track">
          {CATS.map((cat, index) => {
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
                      <img src={cat.img} alt={cat.name} className="cat-card-img" />
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
                      <img src={cat.img} alt={cat.name} className="cat-card-img" />
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
        <button className="cat-carousel-arrow cat-carousel-arrow--right" onClick={next} aria-label="Siguiente">
          →
        </button>
      </div>

      {/* Barra de progreso */}
      <div className="cat-carousel-progress-wrapper">
        <div className="cat-carousel-progress-bar">
          <div
            className="cat-carousel-progress-fill"
            style={{ width: `${((current + 1) / totalSlides) * 100}%` }}
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
        {String(current + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
      </p>

    </section>
  );
}
