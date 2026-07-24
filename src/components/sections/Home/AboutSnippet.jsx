import { Link } from "react-router-dom";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "./AboutSnippet.css";

export default function AboutSnippet() {
  return (
    <section className="about-snippet-wrapper" aria-label="Sección Sobre Nosotros">

      {/* Nube blanca saliendo del hero */}
      <div className="cloud-white">
        {/* Burbujita flotante con navegación fluida React Router */}
        <Link to="/sobre-nosotros">
          <Button
            type="default"
            shape="round"
            size="large"
            className="about-bubble"
            icon={<ArrowRightOutlined />}
            iconPlacement="end"
          >
            Sobre nosotros
          </Button>
        </Link>
      </div>

      {/* Nube verde que da paso al carrusel */}
      <div className="cloud-green" />

    </section>
  );
}