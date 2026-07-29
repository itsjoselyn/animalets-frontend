import "./ContactCloud.css";
import { RING_TEXT } from "../../../utils/constants";
import { MailFilled, InstagramFilled, FacebookFilled } from '@ant-design/icons';
import { Button } from "antd";

export default function ContactCloud() {
  return (
    <section>
      <h2 className="cform-title">¿En qué podemos ayudarte?</h2>
      <p>Contáctanos y te ayudaremos lo antes posible. Puedes contactarnos a través de nuestras redes sociales o enviarnos un mensaje por el formulario.</p>

      <div className="ccloud-container">
        <span className="ccloud-icon">
          <MailFilled />
        </span>
        <div className="ccloud-text">
          <span>Email:</span>
          <a href="mailto:animaletslallagosta@gmail.com">animaletslallagosta@gmail.com</a>
        </div>
      </div>
      <div className="ccloud-container">
        <span className="ccloud-icon">
          <InstagramFilled /></span>
        <div className="ccloud-text">
          <span>Instagram:</span>
          <a href="https://instagram.com/animalets_la_llagosta" className="ccloud-email">
            @animaletslallagosta
          </a>
        </div>
      </div>
      <div className="ccloud-container">
        <span className="ccloud-icon">
          <FacebookFilled /></span>
        <div className="ccloud-text">
          <span>Facebook:</span>
          <a href="https://facebook.com/animalets.lallagosta.5" className="ccloud-email">
            @animaletslallagosta
          </a>
        </div>
      </div>
    </section>
  );
}
