import { Link } from "react-router-dom";
import { Button } from "antd";
import "./AboutJoin.css";

export default function AboutJoin() {
  return (
    <section className="aboutjoin" aria-label="Sección de llamada a la acción: Únete a nuestra manada">
      <div className="aboutjoin-body">
        <h2 className="aboutjoin-title">Únete a nuestra manada</h2>
        <p className="aboutjoin-text">
          Cada adopción, cada voluntario y cada donación salva vidas
        </p>

        <div className="aboutjoin-btns">
          {/* Navegación instantánea SPA con Link + Antd Button */}
          <Link to="/nuestros-peludos">
            <Button type="primary" size="large">
              Adoptar
            </Button>
          </Link>

          <Link to="/como-ayudar">
            <Button type="default" size="large">
              Ayudar
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}