import { useState, useRef } from "react";
import "./AboutMission.css";
import { optimizeCloudinaryImage } from '../../../lib/optimizeCloudinaryImage';

const CARDS = [
  {
    id: 1,
    num: "01",
    title: "Nacimos del abandono",
    text: "En 1996, huertos vacíos dejaron gatos solos bajo la lluvia. Un grupo de vecinos levantó refugios improvisados.",
    img: "https://placecats.com/neo/400/500",
  },
  {
    id: 2,
    num: "02",
    title: "Colonias con corazón",
    text: "200 gatos callejeros en la Llagosta: alimentadores dan su tiempo diario. 6 cathotels los cobijan del frío y protegen su comida.",
    img: "https://placecats.com/millie/400/500",
  },
  {
    id: 3,
    num: "03",
    title: "Gatera vs cemento",
    text: "2021: obras desahucian 50 gatos. ADIF construye gatera para 42 en semilibertad, reubicación.",
    img: "https://placecats.com/bella/400/500",
  },
];

function Card({ card, active, onDotClick, showDots }) {
  return (
    <div className="amission-card">
      <div className="amission-card-img-wrap">
        <img src={optimizeCloudinaryImage(card.img, 300)} alt={card.title} className="amission-card-img" />
        {showDots && (
          <div className="amission-dots">
            {CARDS.map((_, i) => (
              <button
                key={i}
                className={`amission-dot${i === active ? " amission-dot--active" : ""}`}
                onClick={() => onDotClick(i)}
                aria-label={`Ver ${CARDS[i].title}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="amission-card-body">
        <h3 className="amission-card-title">{card.title}</h3>
        <p className="amission-card-text">{card.text}</p>
      </div>
    </div>
  );
}

export default function AboutMission() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(0);

  const prev = () => setActive((a) => (a - 1 + CARDS.length) % CARDS.length);
  const next = () => setActive((a) => (a + 1) % CARDS.length);

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
  };

  return (
    <section className="amission">

      <div className="amission-header">
        <p className="amission-label">Nuestra misión</p>
        <p className="amission-body">
          Que ninguno de los gatos de la Llagosta vuelva a sentirse solo: los rescatamos,
          cuidamos y preparamos para su nuevo hogar.
        </p>
      </div>

      {/* Mobile: 1 card con dots */}
      <div className="amission-mobile" key={active} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        <Card card={CARDS[active]} active={active} onDotClick={setActive} showDots={true} />
      </div>

      {/* Desktop: 3 cards en grid, cada una con sus propios dots (decorativos) */}
      <div className="amission-desktop">
        {CARDS.map((card, i) => (
          <Card key={card.id} card={card} active={i} onDotClick={() => { }} showDots={false} />
        ))}
      </div>

    </section>
  );
}
