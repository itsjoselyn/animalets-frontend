import { useState, useEffect, useRef, useCallback } from "react";
import "./HowToHelp.css";

const OPTIONS = [
  {
    id: 1,
    num: "01.",
    title: "Voluntariado",
    link: "/como-ayudar",
    img: "https://placecats.com/neo/300/400",
  },
  {
    id: 2,
    num: "02.",
    title: "Apadrinar un Gato",
    link: "/como-ayudar",
    img: "https://placecats.com/millie/300/400",
  },
  {
    id: 3,
    num: "03.",
    title: "Hacerse Socio",
    link: "/como-ayudar",
    img: "https://placecats.com/bella/300/400",
  },
  {
    id: 4,
    num: "04.",
    title: "Casa de Acogida",
    link: "/como-ayudar",
    img: "https://placecats.com/neo_2/300/400",
  },
  {
    id: "more",
    num: "\u00a0",
    title: "\u00a0",
    link: "/como-ayudar",
    img: "https://placecats.com/millie_neo/300/400",
    isMore: true,
  },
];

const AUTO_INTERVAL = 3000;
const TOTAL = OPTIONS.length;

export default function HowToHelp() {
  const [slide, setSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const goToSlide = useCallback((idx) => {
    setSlide(((idx % TOTAL) + TOTAL) % TOTAL);
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => goToSlide(slide + 1), [slide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(slide - 1), [slide, goToSlide]);

  useEffect(() => {
    if (isHovered) {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
      return;
    }

    setProgress(0);
    startRef.current = performance.now();

    const animate = (now) => {
      const pct = Math.min(((now - startRef.current) / AUTO_INTERVAL) * 100, 100);
      setProgress(pct);
      if (pct < 100) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    timerRef.current = setTimeout(() => {
      setSlide((s) => (s + 1) % TOTAL);
      setProgress(0);
    }, AUTO_INTERVAL);

    return () => {
      clearTimeout(timerRef.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, [slide, isHovered]);

  const current = OPTIONS[slide];

  return (
    <section className="hthelp">

      {/* Header */}
      <div className="hthelp-header">
        <h2 className="hthelp-title">¿Cómo ayudar?</h2>
        <div className="hthelp-arrow-down">↓</div>
      </div>

      {/* Título — ENCIMA de la foto, siempre mismo espacio */}
      <div className="hthelp-info">
        <span className="hthelp-option-title">{current.title}</span>
      </div>

      {/* Stage: flechas + círculo */}
      <div className="hthelp-stage">
        <button className="hthelp-nav" onClick={prevSlide} aria-label="Anterior">←</button>

        <div
          className="hthelp-circle"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img src={current.img} alt={current.title || "Ver más"} className="hthelp-circle-img" />
        </div>

        <button className="hthelp-nav" onClick={nextSlide} aria-label="Siguiente">→</button>
      </div>

      {/* Botón — siempre presente */}
      <div className="hthelp-cta-wrapper">
        <a href={current.link} className="hthelp-cta">
          {current.isMore ? "Ver más" : "Ayuda ahora"}
        </a>
      </div>

      {/* Progress */}
      <div className="hthelp-progress-wrapper">
        <div className="hthelp-progress-bar">
          <div
            className="hthelp-progress-fill"
            style={{ width: `${((slide + 1) / TOTAL) * 100}%` }}
          />
        </div>
        <div className="hthelp-progress-auto">
          <div
            className="hthelp-progress-auto-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="hthelp-counter">
        {String(slide + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </p>

    </section>
  );
}
