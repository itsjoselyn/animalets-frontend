import { Link } from "react-router-dom";
import { EnvironmentOutlined } from "@ant-design/icons";
import logo from "../../assets/animalets-logo.png";
import "./Footer.css";
import { NAV_LINKS, SOCIAL_LINKS } from "../../data/navigation";
import { Col, Layout, Row } from "antd";

const { Footer } = Layout;
const MAPS_URL = "https://www.google.com/maps/place/Animalets/@41.5102715,2.1890899,699m/data=!3m2!1e3!4b1!4m6!3m5!1s0x12a4bf0031c1e9cf:0x8f876865db3ff1f8!8m2!3d41.5102715!4d2.1916648!16s%2Fg%2F11vqvrbc26?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D";

export default function AppFooter() {
  return (
    <Footer className="app-footer">
      <Row gutter={[16, 16]} align={"start"}>
        <Col xs={24} md={8}>
          <div className="footer-logo-wrap">
            <img
              src={logo}
              alt="Animalets logo"
              className="footer-logo"
              style={{ height: 38, width: "auto", marginBottom: '16px' }}
            />
          </div>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-location"
            style={{ fontSize: "0.82rem", lineHeight: 1.3, textDecoration: "none", color: "inherit" }}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <EnvironmentOutlined style={{ color: '#2e7d32' }} />
              G56R+4M
            </span>
            <p>Montcada i Reixac</p>
          </a>
        </Col>
        <Col xs={24} md={8}>

          <nav aria-label="Enlaces del pie">
            <ul className="app-footer__nav">
              {NAV_LINKS.map((l) => (
                <li><a key={l.to} href={l.to}>{l.label}</a></li>
              ))}
            </ul>

          </nav>
        </Col>
        <Col xs={24} md={8}>
          <nav aria-label="Enlaces de contacto e información de privacidad">
            <ul className="app-footer__nav">
              {SOCIAL_LINKS.map((l) => (
                <li>
                  <a key={l.to} href={l.to} target="_blank" >{l.label}</a>
                </li>
              ))}
              <li>
                <a
                  href="mailto:animaletslallagosta@gmail.com"
                  style={{ fontSize: "0.82rem" }}
                >
                  animaletslallagosta@gmail.com
                </a></li>
            </ul>
          </nav>
        </Col>
      </Row>
    </Footer>
  );
}