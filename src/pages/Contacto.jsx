import { Col, Row } from "antd";
import ContactCloud from "../components/sections/Contact/ContactCloud";
import ContactForm from "../components/sections/Contact/ContactForm";
import ContactHeader from "../components/sections/Contact/ContactHeader";

export default function Contacto() {
    return (
    <>
            {/* <ContactHeader />
    <ContactCloud />
    <ContactForm /> */}
            <Row gutter={[16, 16]}>
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