import "./BlogHeader.css";

export default function BlogHeader() {
  return (
    <header className="blog-header">
      <div className="blog-header-title-wrap">
        <h1 className="blog-header-title">
          Blog<br />Animalets<br />la Llagosta
        </h1>
        {/* aria-hidden para que los lectores de pantalla no lean "Huellas de patas" */}
        <span className="blog-header-paw" role="img" aria-label="Huella animal" aria-hidden="true">
          🐾
        </span>
      </div>
    </header>
  );
}