import "./PrivacidadPage.css";

export default function PrivacidadPage() {
  const EMAIL_CONTACTO = "animaletslallagosta@gmail.com";

  return (
    <div>
      <div>

        {/* <h1 className="privacidad-title">Política de Privacidad</h1> */}
        <p className="privacidad-date">Última modificación: 12/01/2023</p>

        <div className="privacidad-content">

          <section>
            <h2>1. Responsable del tratamiento</h2>
            <p>
              Animalets la Llagosta es una asociación sin ánimo de lucro con domicilio en la Llagosta (Barcelona). Puedes contactarnos en{" "}
              <a href={`mailto:${EMAIL_CONTACTO}`}>{EMAIL_CONTACTO}</a>.
            </p>
          </section>

          <section>
            <h2>2. Datos que recogemos</h2>
            <p>
              Recogemos los datos que nos proporcionas voluntariamente a través de nuestros formularios de contacto: nombre, correo electrónico, teléfono y cualquier otra información que decidas compartir con nosotros.
            </p>
          </section>

          <section>
            <h2>3. Finalidad del tratamiento</h2>
            <p>
              Los datos recogidos se utilizan exclusivamente para gestionar tu solicitud de información, voluntariado, acogida, apadrinamiento, adopción o cualquier otra consulta que nos hayas enviado. No utilizamos tus datos para fines comerciales ni publicitarios.
            </p>
          </section>

          <section>
            <h2>4. Base legal</h2>
            <p>
              El tratamiento de tus datos se basa en tu consentimiento expreso, prestado al marcar la casilla de aceptación de esta política antes de enviar el formulario.
            </p>
          </section>

          <section>
            <h2>5. Conservación de los datos</h2>
            <p>
              Conservamos tus datos únicamente durante el tiempo necesario para atender tu consulta y, en su caso, para cumplir con las obligaciones legales que correspondan. Una vez finalizada la relación, los datos serán eliminados de forma segura.
            </p>
          </section>

          <section>
            <h2>6. Cesión de datos</h2>
            <p>
              No cedemos tus datos a terceros salvo obligación legal. No compartimos tu información con empresas externas ni la utilizamos para campañas de marketing.
            </p>
          </section>

          <section>
            <h2>7. Tus derechos</h2>
            <p>
              Tienes derecho a acceder, rectificar, suprimir, limitar el tratamiento, oponerte al mismo y a la portabilidad de tus datos. Para ejercer cualquiera de estos derechos, puedes escribirnos a{" "}
              <a href={`mailto:${EMAIL_CONTACTO}`}>{EMAIL_CONTACTO}</a>.
            </p>
          </section>

          <section>
            <h2>8. Seguridad</h2>
            <p>
              Adoptamos las medidas técnicas y organizativas necesarias para proteger tus datos frente a accesos no autorizados, pérdidas o alteraciones. Sin embargo, ningún sistema de transmisión de datos por internet es completamente seguro.
            </p>
          </section>

          <section>
            <h2>9. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política de privacidad en cualquier momento. La fecha de última modificación aparece al inicio de esta página. Te recomendamos revisarla periódicamente.
            </p>
          </section>

          <section>
            <h2>10. Contacto</h2>
            <p>
              Si tienes cualquier duda sobre esta política o sobre el tratamiento de tus datos, no dudes en contactarnos en{" "}
              <a href={`mailto:${EMAIL_CONTACTO}`}>{EMAIL_CONTACTO}</a>.
            </p>
          </section>

        </div>
    </div>
    </div>
  );
}