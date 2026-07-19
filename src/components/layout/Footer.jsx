import logo from "../../assets/animalets-logo.jpeg";
import "./Footer.css";
import { NAV_LINKS, SOCIAL_LINKS } from "../../data/navigation";
import { UnderlineLink } from "../common/UnderlineLink";


function Footer() {
  return (
    <footer className="footer">
      {/* Línea verde superior */}
      <div className="footer-topline" />

      <div className="footer-inner">

        {/* Fila superior: logo + ubicación */}
        <div className="footer-top">
          <div className="footer-logo-wrap">
            <img src={logo} alt="Animalets logo" className="footer-logo" />
          </div>
          <div className="footer-location">
            <span>G56R+4M</span>
            <span>Montcada i Reixac</span>
          </div>
        </div>

        {/* Fila inferior: nav izquierda + social derecha */}
        <div className="footer-bottom">
          <nav className="footer-nav">
            {NAV_LINKS.map((l) => (
              <UnderlineLink key={l.to} to={l.to}>{l.label}</UnderlineLink>
            ))}
          </nav>

          <div className="footer-social">
            {SOCIAL_LINKS.map((l) => (
              <UnderlineLink key={l.label} to={l.to} href={l.href} external={l.external}>
                {l.label}
              </UnderlineLink>
            ))}
            <a href="mailto:animaletslallagosta@gmail.com" className="footer-link footer-email">
              animaletslallagosta@gmail.com
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
