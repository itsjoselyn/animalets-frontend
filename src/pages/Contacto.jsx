import { Col, Row } from "antd";
import ContactCloud from "../components/sections/Contact/ContactCloud";
import ContactForm from "../components/sections/Contact/ContactForm";

export default function Contacto() {
    return (
        <>
            <Row gutter={[16, 0]}>
                <Col xs={24} md={12}>
                    <ContactCloud />
                </Col>
                <Col xs={24} md={12}>
                    <ContactForm />
                </Col>
            </Row>
        </>
    )
}