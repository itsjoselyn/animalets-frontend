import { Link } from "react-router-dom";
import "./AboutJoin.css";

export default function AboutJoin() {
  return (
    <section className="aboutjoin">
      <div className="aboutjoin-body">
        <h2 className="aboutjoin-title">Únete a nuestra manada</h2>
        <p className="aboutjoin-text">Cada adopción, cada voluntario y cada donación salva vidas</p>
        <div className="aboutjoin-btns">
          <Link to="/nuestros-peludos" className="aboutjoin-btn">Adoptar</Link>
          <Link to="/como-ayudar" className="aboutjoin-btn">Ayudar</Link>
        </div>
      </div>
    </section>
  );
}
