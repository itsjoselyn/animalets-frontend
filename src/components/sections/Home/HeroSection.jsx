import { Button } from "antd";
import {
  InstagramOutlined,
  FacebookFilled,
  TikTokOutlined,
} from "@ant-design/icons";
import "./HeroSection.css";

const GREEN_COLOR = "#2e7d32";

export default function HeroSection() {
  return (
    <>
      {/* ——— MOBILE ——— */}
      <section className="hero hero-mobile">
        <p className="hero-tagline">Un hogar para cada ronroneo</p>
        <h1 className="hero-title">Encuentra a tu compañero ideal</h1>
        <div className="hero-cat-wrapper">
          <img
            src="https://placecats.com/500/600"
            alt="Gato en adopción"
            className="hero-cat-img"
            loading="eager"
            fetchPriority="high"
          />
        </div>
        <p className="hero-hook">Match gatuno garantizado</p>
      </section>

      {/* ——— DESKTOP ——— */}
      <section className="hero hero-desktop">
        {/* Texto izquierda */}
        <div className="hero-left">
          <h1 className="hero-title-left">
            <span>Encuentra</span>
            <span>a tu</span>
          </h1>
        </div>

        {/* Centro: imagen + hook debajo */}
        <div className="hero-center">
          <img
            src="https://res.cloudinary.com/dhb3yos4y/image/upload/v1784814756/DSC_0264_1_w2y6ps.jpg"
            alt="Gato en adopción"
            className="hero-cat-img"
            loading="eager"
            fetchPriority="high"
          />
          <p className="hero-hook">Match gatuno garantizado</p>
        </div>

        {/* Texto derecha */}
        <div className="hero-right">
          <p className="hero-tagline-desktop">
            Un hogar para<br />cada ronroneo
          </p>
          <h1 className="hero-title-right">
            <span>compañero</span>
            <span>ideal</span>
          </h1>
        </div>

        {/* Spacer para empujar derecha y rrss abajo */}
        <div className="hero-left-spacer" />

        {/* Redes Sociales usando Ant Design Icons */}
        <div className="hero-social" style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a
            href="https://www.instagram.com/animalets_la_llagosta?igsh=NTc1a2RudDV2dG5l&utm_source=qr"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
          >
            <Button
              type="text"
              shape="circle"
              size="large"
              icon={<InstagramOutlined style={{ fontSize: "1.5rem", color: GREEN_COLOR }} />}
            />
          </a>

          <a
            href="https://www.tiktok.com/@animalets_la_llagosta"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
          >
            <Button
              type="text"
              shape="circle"
              size="large"
              icon={<TikTokOutlined style={{ fontSize: "1.5rem", color: GREEN_COLOR }} />}
            />
          </a>

          <a
            href="https://www.facebook.com/animalets.lallagosta.5/"
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
          >
            <Button
              type="text"
              shape="circle"
              size="large"
              icon={<FacebookFilled style={{ fontSize: "1.5rem", color: GREEN_COLOR }} />}
            />
          </a>
        </div>
      </section>
    </>
  );
}