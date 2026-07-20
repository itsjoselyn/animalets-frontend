import { useEffect, useRef, useState } from "react";
import "./ContactCloud.css";
import { RING_TEXT } from "../../../utils/constants";
import { textContactR } from "../../../utils/constants";
import { MailFilled, InstagramFilled, FacebookFilled } from '@ant-design/icons';
import { Button } from "antd";


export default function ContactCloud() {
  const sectionRef = useRef(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = 1 - (rect.top - window.innerHeight * 0.25) / window.innerHeight;
      setRotation(progress * 360);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <section ref={sectionRef}>
      <h2 className="cform-title">¿En qué podemos ayudarte?</h2>
      <p>Contáctanos y te ayudaremos lo antes posible. Puedes contactarnos a través de nuestras redes sociales o enviarnos un mensaje por el formulario.</p>

      <div className="ccloud-email-container">
        <span className="ccloud-email-icon">
          <MailFilled /></span>
        <div className="ccloud-email-text">
          <span>Email:</span>
          <a href="mailto:animaletslallagosta@gmail.com">animaletslallagosta@gmail.com</a>
        </div>
      </div>
      <div className="ccloud-email-container">
        <span className="ccloud-email-icon">
          <InstagramFilled /></span>
        <div className="ccloud-email-text">
          <span>Instagram:</span>
          <a href="https://instagram.com/animaletslallagosta" className="ccloud-email">
            @animaletslallagosta
          </a>
        </div>
      </div>
      <div className="ccloud-email-container">
        <span className="ccloud-email-icon">
          <FacebookFilled /></span>
        <div className="ccloud-email-text">
          <span>Facebook:</span>
          <a href="https://facebook.com/animaletslallagosta" className="ccloud-email">
            @animaletslallagosta
          </a>
        </div>
      </div>


      {/* Zona central: Instagram + círculo giratorio + Facebook */}
      {/* <div className="ccloud-middle">
        <div className="ccloud-ring-wrap">
          <svg
            className="ccloud-svg"
            viewBox="0 0 140 140"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <defs>
              <path
                id="ringPath"
                d={`M70,70 m-${textContactR},0 a${textContactR},${textContactR} 0 1,1 ${textContactR * 2},0 a${textContactR},${textContactR} 0 1,1 -${textContactR * 2},0`}
              />
            </defs>
            <text
              fontFamily="'Lilita One', sans-serif"
              fontSize="11"
              fill="#4caf50"
              letterSpacing="3"
            >
              <textPath href="#ringPath">{RING_TEXT}</textPath>
            </text>
          </svg>

          <div className="ccloud-yarn">
            🧶
          </div>
        </div>

      </div> */}

    </section>
  );
}
