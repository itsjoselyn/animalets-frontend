import { Link } from "react-router-dom";
import "./AboutSnippet.css";
import { Button } from 'antd';

export default function AboutSnippet() {
  return (
    <div className="about-snippet-wrapper">

      {/* Nube blanca saliendo del hero */}
      <div className="cloud-white">
        {/* Burbujita flotante */}
        <Button href="/sobre-nosotros" className="about-bubble">
          Sobre nosotros
          <span className="about-bubble-arrow">→</span>
        </Button>
      </div>

      {/* Nube verde que da paso al carrusel */}
      <div className="cloud-green" />

    </div>
  );
}
