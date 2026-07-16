import { Link } from "react-router-dom";
import "./AboutSnippet.css";

export default function AboutSnippet() {
  return (
    <div className="about-snippet-wrapper">

      {/* Nube blanca saliendo del hero */}
      <div className="cloud-white">
        {/* Burbujita flotante */}
        <Link to="/sobre-nosotros" className="about-bubble">
          Sobre nosotros
          <span className="about-bubble-arrow">→</span>
        </Link>
      </div>

      {/* Nube verde que da paso al carrusel */}
      <div className="cloud-green" />

    </div>
  );
}
