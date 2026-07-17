import "./HowToHelp.css";
import { Link } from "react-router-dom";
import { optimizeCloudinaryImage } from '../../../lib/optimizeCloudinaryImage';
import { OPTIONS } from "../../../utils/constants";

export default function HowToHelp() {
  return (
    <section className="hthelp">

      <div className="hthelp-header">
        <h2 className="hthelp-title">¿Cómo ayudar?</h2>
        <div className="hthelp-arrow-down">↓</div>
      </div>

      <div className="hthelp-grid">
        {OPTIONS.map((opt) => (
          <Link key={opt.id} to={opt.link} className="hthelp-card">
            <div className="hthelp-card-img-wrap">
              <img src={optimizeCloudinaryImage(opt.img, { width: 300 })} alt={opt.title} className="hthelp-card-img" />
            </div>
            <div className="hthelp-card-body">
              <h3 className="hthelp-card-title">{opt.title}</h3>
            </div>
          </Link>
        ))}

        <Link to="/como-ayudar" className="hthelp-card hthelp-card--more">
          <div className="hthelp-more-inner">
            <span className="hthelp-more-plus">+</span>
            <span className="hthelp-more-label">Ver más<br />formas de ayudar</span>
          </div>
        </Link>
      </div>

    </section>
  );
}
