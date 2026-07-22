import { Link } from "react-router-dom";
import { InstagramOutlined } from "@ant-design/icons";
import "./ContactBanner.css";

const GREEN_COLOR = "#2e7d32";

export default function ContactBanner() {
  return (
    <section className="cbanner" aria-label="Sección de contacto e Instagram">

      {/* Cabecera idéntica a la versión original */}
      <div className="cbanner-top">
        <h2 className="cbanner-question">¿Indeciso?</h2>
        <Link to="/contacto" className="cbanner-contact">
          Contáctanos
        </Link>
      </div>

      {/* Bloque Central de Texto e Imagen */}
      <div className="cbanner-mid">
        <div className="cbanner-mid-text">
          <span>Juntos</span>
          <span>podemos</span>
        </div>

        <div className="cbanner-img-block">
          <img
            src="https://placecats.com/millie_neo/400/500"
            alt="Gato en adopción"
            className="cbanner-img"
            loading="lazy"
          />
        </div>

        <div className="cbanner-mid-text">
          <span>Cambiar</span>
          <span>vidas</span>
        </div>
      </div>

      {/* Footer con icono de Instagram */}
      <div className="cbanner-bottom">
        <p className="cbanner-find">Encuéntranos en</p>
        <a
          href="https://instagram.com/animaletslallagosta"
          target="_blank"
          rel="noopener noreferrer"
          className="cbanner-handle"
          style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
        >
          <InstagramOutlined style={{ fontSize: "1.2rem", color: GREEN_COLOR }} />
          @animaletslallagosta
        </a>
      </div>

    </section>
  );
}