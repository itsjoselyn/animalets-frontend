import { useEffect, useRef, useState } from "react";
import "./AboutIntro.css";
import { YOUTUBE_ID, TEXT, COUNT } from "../../../utils/constants";


function randomBalls() {
  return Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    size: 16 + Math.random() * 36,
    left: 2 + Math.random() * 96,
    // finalTop en % del componente entero (hero + video juntos)
    // las ponemos en la mitad superior para que no tapen el video
    finalTop: 8 + Math.random() * 55,
    delay: i * 0.08,
  }));
}

export default function AboutIntro() {
  const [balls] = useState(randomBalls);
  const [landed, setLanded] = useState(false);
  const sectionRef = useRef(null);
  const [rotation, setRotation] = useState(0);

  // Aterrizaje de bolitas
  useEffect(() => {
    const last = (COUNT - 1) * 0.08 + 0.7;
    const t = setTimeout(() => setLanded(true), (last + 0.1) * 1000);
    return () => clearTimeout(t);
  }, []);

  // Rotación del texto con scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      // empieza a rotar cuando la sección está al 150% del viewport (antes de entrar)
      const progress = 1 - (rect.top - windowH * -0.25) / windowH;
      setRotation(progress * 360);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textR = 148;

  return (
    <section className="about-intro" ref={sectionRef}>

      {/* Bolitas que caen */}
      {balls.map((b) => (
        <div
          key={b.id}
          className={`about-intro-ball${landed ? " about-intro-ball--landed" : ""}`}
          style={{
            width: b.size,
            height: b.size,
            left: `${b.left}%`,
            '--final-top': `${b.finalTop}%`,
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}

      {/* ---- BLOQUE TEXTO ---- */}
      <div className="about-intro-content">
        <p className="about-intro-label">Sobre nosotros</p>
        <h1 className="about-intro-title">¿Qué es Animalets<br />la Llagosta?</h1>
        <div className="about-intro-arrow">↓</div>
        <p className="about-intro-text">
          Animalets la Llagosta es una asociación sin ánimo de lucro dedicada al rescate,
          cuidado y adopción responsable de gatos abandonados o maltratados en la zona de
          la Llagosta. Nuestro objetivo es que cada gatito encuentre una familia que lo
          cuide para siempre.
        </p>
      </div>

      {/* ---- VÍDEO ---- */}
      <div className="about-intro-video-wrap">

        {/* Círculo de fondo del anillo (verde más oscuro) */}
        <div className="about-intro-ring-bg" />

        {/* SVG texto rotante */}
        <svg
          className="about-intro-svg"
          viewBox="0 0 340 340"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <defs>
            <path
              id="tc"
              d={`M170,170 m-${textR},0 a${textR},${textR} 0 1,1 ${textR * 2},0 a${textR},${textR} 0 1,1 -${textR * 2},0`}
            />
          </defs>
          <text
            fontFamily="'Lilita One', sans-serif"
            fontSize="13.5"
            fill="#2e7d32"
            letterSpacing="4"
          >
            <textPath href="#tc">{TEXT}</textPath>
          </text>
        </svg>

        {/* Círculo vídeo */}
        <div className="about-intro-circle">
          <iframe
            className="about-intro-iframe"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?controls=1&rel=0&modestbranding=1`}
            title="Animalets la Llagosta"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

      </div>

    </section>
  );
}
