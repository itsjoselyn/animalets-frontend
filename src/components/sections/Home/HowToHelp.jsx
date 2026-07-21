import { Link } from "react-router-dom";
import { Card, Row, Col } from "antd";
import { ArrowDownOutlined, PlusOutlined } from "@ant-design/icons";
import "./HowToHelp.css";
import { optimizeCloudinaryImage } from "../../../lib/optimizeCloudinaryImage";
import { OPTIONS } from "../../../utils/constants";

const GREEN_COLOR = "#2e7d32";

export default function HowToHelp() {
  return (
    <section className="hthelp" aria-label="Cómo ayudar a la asociación" style={{ width: "100%", padding: "20px 16px", boxSizing: "border-box", overflow: "hidden" }}>

      {/* Header */}
      <div className="hthelp-header" style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 className="hthelp-title">¿Cómo ayudar?</h2>
        <div className="hthelp-arrow-down" style={{ marginTop: 8 }}>
          <ArrowDownOutlined style={{ fontSize: "1.5rem", color: GREEN_COLOR }} />
        </div>
      </div>

      {/* Grid Usando Ant Design Row/Col */}
      <Row gutter={[16, 16]} style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        {OPTIONS.map((opt) => (
          <Col key={opt.id} xs={24} sm={12} md={6} style={{ width: "100%" }}>
            <Link to={opt.link} style={{ textDecoration: "none", display: "block", height: "100%" }}>
              <Card
                hoverable
                className="hthelp-card"
                style={{ borderRadius: 16, overflow: "hidden", height: "100%" }}
                styles={{ body: { padding: 12 } }}
                cover={
                  <div className="hthelp-card-img-wrap" style={{ height: 180, overflow: "hidden" }}>
                    <img
                      src={opt.img ? optimizeCloudinaryImage(opt.img, { width: 400 }) : "https://placecats.com/300/200"}
                      alt={opt.title}
                      className="hthelp-card-img"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy"
                    />
                  </div>
                }
              >
                <div className="hthelp-card-body">
                  <h3 className="hthelp-card-title" style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>
                    {opt.title}
                  </h3>
                </div>
              </Card>
            </Link>
          </Col>
        ))}

        {/* Tarjeta "+ Ver más" Ocupando el 100% de la fila */}
        <Col xs={24} style={{ width: "100%" }}>
          <Link to="/como-ayudar" style={{ textDecoration: "none", display: "block", width: "100%" }}>
            <Card
              hoverable
              className="hthelp-card hthelp-card--more"
              style={{
                borderRadius: 16,
                overflow: "hidden",
                background: "#f6ffed",
                borderColor: "#b7eb8f",
                width: "100%",
              }}
              styles={{
                body: {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "14px 16px",
                  textAlign: "center",
                }
              }}
            >
              <PlusOutlined style={{ fontSize: "1.5rem", color: GREEN_COLOR }} />
              <span
                className="hthelp-more-label"
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: GREEN_COLOR,
                }}
              >
                Ver más formas de ayudar
              </span>
            </Card>
          </Link>
        </Col>
      </Row>

    </section>
  );
}