import { Link } from "react-router-dom";
import "./AboutJoin.css";
import { Button } from 'antd';

export default function AboutJoin() {
  return (
    <section className="aboutjoin">
      <div className="aboutjoin-body">
        <h2 className="aboutjoin-title">Únete a nuestra manada</h2>
        <p className="aboutjoin-text">Cada adopción, cada voluntario y cada donación salva vidas</p>
        <div className="aboutjoin-btns">
          <Button type="primary" href='/nuestros-peludos' target="_blank">Adoptar</Button>
          <Button type="primary" href='/como-ayudar' target="_blank">Ayudar</Button>
        </div>
      </div>
    </section>
  );
}
