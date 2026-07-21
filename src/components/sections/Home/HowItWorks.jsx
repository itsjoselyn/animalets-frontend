import { Card } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";
import "./HowItWorks.css";
import { STEPS } from "../../../utils/constants";

export default function HowItWorks() {
  return (
    <section className="how-it-works" aria-label="Pasos para adoptar">

      {/* Título */}
      <div className="how-it-works-header">
        <h2 className="how-it-works-title">
          ¿Quieres adoptar?
        </h2>
      </div>

      {/* Rejilla / Contenedor deslizante de Tarjetas */}
      <div className="how-it-works-track">
        {STEPS.map((step) => (
          <Card
            key={step.id}
            className="step-card"
            style={{ borderRadius: 16 }}
          >
            <div className="step-card-top">
              <span className="step-number">
                {step.id}.
              </span>
              <h3 className="step-title">
                {step.title}
              </h3>
              <p className="step-description">
                {step.description}
              </p>
            </div>

            <div className="step-illustration">
              <span className="step-emoji" role="img" aria-hidden="true">
                {step.emoji}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Indicador de scroll (Visibilidad controlada por clase CSS) */}
      <div className="how-it-works-scroll-hint">
        <span>desliza</span>
        <ArrowRightOutlined className="scroll-hint-arrow" />
      </div>

    </section>
  );
}