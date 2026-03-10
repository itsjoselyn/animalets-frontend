import { useState } from "react";
import { Link } from "react-router-dom";
import "./Testimonials.css";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Juana",
    preview: "Desde el primer día me sentí parte de algo especial. El equipo de Animalets me recibió con los brazos abiertos y los gatitos hicieron el resto. Nunca había experimentado una conexión tan bonita con los animales...",
    full: "/testimonios/juana",
  },
  {
    id: 2,
    name: "Josep",
    preview: "Apadrinar a Mochi cambió mi vida por completo. Cada visita es una alegría enorme, verle crecer y saber que mi aportación mensual le da una vida digna y llena de amor es algo que no tiene precio...",
    full: "/testimonios/josep",
  },
  {
    id: 3,
    name: "Maria",
    preview: "Nunca pensé que abrir mi casa temporalmente me daría tanto. Los gatitos llegan asustados y en pocas semanas se convierten en pequeños valientes. El apoyo de Animalets durante todo el proceso es increíble...",
    full: "/testimonios/maria",
  },
  {
    id: 4,
    name: "Carles",
    preview: "Hacerse socio fue la mejor decisión del año. Saber que cada mes contribuyo a que más gatos tengan una oportunidad real de encontrar un hogar me llena de satisfacción. La transparencia del equipo es total...",
    full: "/testimonios/carles",
  },
  {
    id: 5,
    name: "Laura",
    preview: "El proceso de acogida fue muy sencillo y el apoyo del equipo constante en todo momento. Cuando llegó el día de la adopción definitiva lloré de emoción. Fue una experiencia que repetiría mil veces...",
    full: "/testimonios/laura",
  },
];

function Timeline({ items, active, onSelect }) {
  return (
    <div className="testi-timeline">
      <div className="testi-line" />
      {items.map((t) => (
        <button
          key={t.id}
          className={`testi-node${active === t.id ? " testi-node--active" : ""}`}
          onClick={() => onSelect(t.id)}
          aria-label={t.name}
        >
          <span className="testi-node-dot" />
          <span className="testi-node-name">{t.name}</span>
        </button>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(1);
  const current = TESTIMONIALS.find((t) => t.id === active);

  // Si en mobile el activo es 4 o 5, forzar al 1 al montar — no hace falta,
  // simplemente si el usuario está en mobile y clica un nodo del desktop-timeline
  // no puede porque no se renderiza.

  const mobileList = TESTIMONIALS.slice(0, 3);
  const desktopList = TESTIMONIALS;

  // En mobile, si active > 3 resetear a 1
  const mobileActive = active > 3 ? 1 : active;

  return (
    <section className="testi">
      <div className="testi-body">

        <h2 className="testi-title">Testimonios</h2>

        {/* Timeline mobile: solo 3 */}
        <div className="testi-timeline-mobile">
          <Timeline items={mobileList} active={mobileActive} onSelect={setActive} />
        </div>

        {/* Timeline desktop: 5 */}
        <div className="testi-timeline-desktop">
          <Timeline items={desktopList} active={active} onSelect={setActive} />
        </div>

        <div className="testi-content" key={active}>
          <Link to={current.full} className="testi-preview">
            {current.preview}
          </Link>
        </div>

      </div>
    </section>
  );
}
