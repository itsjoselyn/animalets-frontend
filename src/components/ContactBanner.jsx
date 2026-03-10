import "./ContactBanner.css";
import { Link } from "react-router-dom";

export default function ContactBanner() {
  return (
    <section className="cbanner">

      <div className="cbanner-top">
        <h2 className="cbanner-question">¿Indeciso?</h2>
        <Link to="/contacto" className="cbanner-contact">Contáctanos</Link>
      </div>

      <div className="cbanner-img-block">
        <img
          src="https://placecats.com/500/600"
          alt="Gato"
          className="cbanner-img"
        />
        <div className="cbanner-img-text-left">
          <span>Juntos</span>
          <span>podemos</span>
        </div>
        <div className="cbanner-img-text-right">
          <span>Cambiar</span>
          <span>vidas</span>
        </div>
      </div>

      <div className="cbanner-bottom">
        <p className="cbanner-find">Encuéntranos en</p>
        <a
          href="https://www.instagram.com/animalets_la_llagosta/"
          target="_blank"
          rel="noopener noreferrer"
          className="cbanner-handle"
        >
          @animaletslallagosta
        </a>
      </div>

    </section>
  );
}
