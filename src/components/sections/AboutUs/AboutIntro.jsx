import { useEffect, useRef, useState } from "react";
import { ArrowDownOutlined } from "@ant-design/icons";
import "./AboutIntro.css";
import { YOUTUBE_ID, TEXT, COUNT, textR } from "../../../utils/constants";

const GREEN_COLOR = "#2e7d32";

function randomBalls() {
  return Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    size: 16 + Math.random() * 36,
    left: 2 + Math.random() * 96,
    finalTop: 8 + Math.random() * 55,
    delay: i * 0.08,
  }));
}

export default function AboutIntro() {
  const [balls] = useState(randomBalls);
  const [landed, setLanded] = useState(false);
  const sectionRef = useRef(null);
  const [rotation, setRotation] = useState(0);

  // Aterrizaje suave de bolitas
  useEffect(() => {
    const last = (COUNT - 1) * 0.08 + 0.7;
    const t = setTimeout(() => setLanded(true), (last + 0.1) * 1000);
    return () => clearTimeout(t);
  }, []);

  // Rotación optimizada del texto con scroll usando requestAnimationFrame
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowH = window.innerHeight;
            const progress = 1 - (rect.top - windowH * -0.25) / windowH;
            setRotation(progress * 360);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="about-intro"
      ref={sectionRef}
      aria-label="Introducción sobre Animalets la Llagosta"
    >
      {/* Bolitas decorativas que caen */}
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
          aria-hidden="true"
        />
      ))}

      {/* BLOQUE DE TEXTO */}
      <div className="about-intro-content">
        <p className="about-intro-label">Sobre nosotros</p>
        <h1 className="about-intro-title">
          ¿Qué es Animalets<br />la Llagosta?
        </h1>
        <div className="about-intro-arrow" style={{ margin: "12px 0" }}>
          <ArrowDownOutlined style={{ fontSize: "1.4rem", color: GREEN_COLOR }} />
        </div>
        <p className="about-intro-text">
          Animalets la Llagosta es una asociación sin ánimo de lucro dedicada al rescate,
          cuidado y adopción responsable de gatos abandonados o maltratados en la zona de
          la Llagosta. Nuestro objetivo es que cada gatito encuentre una familia que lo
          cuide para siempre.
        </p>
      </div>

      {/* BLOQUE DE VÍDEO */}
      <div className="about-intro-video-wrap">
        {/* Círculo de fondo del anillo */}
        <div className="about-intro-ring-bg" />

        {/* SVG con texto rotante */}
        <svg
          className="about-intro-svg"
          viewBox="0 0 340 340"
          style={{ transform: `rotate(${rotation}deg)` }}
          aria-hidden="true"
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
            fill={GREEN_COLOR}
            letterSpacing="4"
          >
            <textPath href="#tc">{TEXT}</textPath>
          </text>
        </svg>

        {/* Círculo con Iframe de Vídeo */}
        <div className="about-intro-circle">
          <iframe
            className="about-intro-iframe"
            src={`https://www.youtube.com/embed/${YOUTUBE_ID}?controls=1&rel=0&modestbranding=1`}
            title="Vídeo de presentación de Animalets la Llagosta"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      </div>
    </section>
  );
}