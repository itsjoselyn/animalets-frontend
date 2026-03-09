import "./HowItWorks.css";

const STEPS = [
  {
    id: "01",
    title: "Rellena el formulario",
    description: "Rellena la información y cuéntanos un poco sobre ti.",
    emoji: "📋",
  },
  {
    id: "02",
    title: "Te contactamos",
    description: "Quedamos un día para que puedas conocer a nuestra familia gatuna.",
    emoji: "📱",
  },
  {
    id: "03",
    title: "El encuentro",
    description: "Prepárate para descubrir a tu compañero gatuno.",
    emoji: "🐱",
  },
  {
    id: "04",
    title: "Bienvenido",
    description: "Últimos pasos y tu compañero felino será parte de tu familia.",
    emoji: "🏠",
  },
];

export default function HowItWorks() {
  return (
    <section className="how-it-works">

      {/* Título */}
      <div className="how-it-works-header">
        <h2 className="how-it-works-title">¿Cómo funciona?</h2>
      </div>

      {/* Cards */}
      <div className="how-it-works-track">
        {STEPS.map((step) => (
          <div key={step.id} className="step-card">
            <div className="step-card-top">
              <p className="step-number">{step.id}.</p>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
            <div className="step-illustration">
              <span className="step-emoji">{step.emoji}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Indicador scroll mobile */}
      <div className="how-it-works-scroll-hint">
        <span>desliza</span>
        <span className="scroll-hint-arrow">→</span>
      </div>

    </section>
  );
}
