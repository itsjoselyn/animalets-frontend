import "./ContactForm.css";
import { Button, Checkbox, Form, Input, Modal, Select, Space, Row, Col, Collapse, message } from 'antd';
import { useEffect, useState } from "react";
import PrivacidadPage from "../../../pages/PrivacidadPage";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

const { TextArea } = Input;

const HOW_DID_YOU_HEAR_ABOUT_US_OPTIONS = [
  { label: 'Web', value: 'web' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'Un amigo', value: 'amigo' },
  { label: 'Otro', value: 'otro' },
]

const TYPE_OF_INQUIRY_OPTIONS = [
  { label: 'Adoptar', value: 'adoptar' },
  { label: 'Apadrinar', value: 'apadrinar' },
  { label: 'Casa de acogida', value: 'acogida' },
  { label: 'Voluntariado', value: 'voluntariado' },
  { label: 'Otra consulta', value: 'otro' },
]

const ADOPTION_FIELDS = [
  { name: 'cat', label: '¿Tienes ya un gato en mente?', options: ['Sí', 'No'] },
  { name: 'house', label: '¿Qué tipo de vivienda tienes?', options: ["Piso", "Casa", "Con terraza", "Con patio"] },
  { name: 'pets', label: '¿Tienes animales en casa?', options: ['Perro', 'Gato', 'Otros', 'No'] },
  { name: 'people', label: '¿Hay más personas en casa?', options: ['Sí', 'No'] },
  { name: 'experience', label: '¿Tienes experiencia previa con gatos?', options: ['Sí', 'No'] },
]

const FORM_FIELDS_BY_TYPE = {
  adoptar: ADOPTION_FIELDS,
  apadrinar: [{ name: 'cat', label: 'Gato a apadrinar', options: [] }, { name: 'donation', label: 'Tipo de aportación', options: ['10€/mes', 'Otra cantidad'] }],
  acogida: [...ADOPTION_FIELDS, {
    name: 'duration', label: '¿Cuánto tiempo puedes acoger?', options: ['Temporal', 'Indefinida']
  }],
  voluntariado: [
    { name: 'availability', label: '¿Cuál sería tu disponibilidad?', options: ['Mañana', 'Tarde', 'Fin de semana'] },
    { name: 'tasks', label: '¿Qué tareas te gustaría realizar?', options: ['Limpieza', 'Alimentación', 'Medicación', 'Fotos', 'Socialización', 'Otros'] },
    { name: 'experience', label: '¿Tienes experiencia previa con animales?', options: ['Sí', 'No'] }],
  otro: [],
}

export default function ContactForm() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittable, setSubmittable] = useState(false);
  const values = Form.useWatch([], form);

  const tipo = Form.useWatch('type', form);
  const campos = FORM_FIELDS_BY_TYPE[tipo] ?? [];

  const openPrivacyModal = () => {
    setIsModalOpen(true);
  }
  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await addDoc(collection(db, "contactRequests"), values)
      console.log('daaaa res', res)
      if (!res.ok) throw new Error(`Error ${res.status}`)
      const data = await res.toJSON();
      message.success('Enviado correctamente');
      form.resetFields();
    } catch (err) {
      console.error(err) //TODO: DA ERROR, REVISAR
      message.error('No se pudo enviar: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    form
      .validateFields({ validateOnly: true })
      .then(() => setSubmittable(true))
      .catch(() => setSubmittable(false))
  }, [form, values])

  return (
    <section className="cform-wrap">
      <Form
        form={form}
        layout='vertical'
        style={{ padding: '1.5rem 2rem', border: '1px solid #4caf50', borderRadius: '16px', backgroundColor: '#f9fdf9' }}
        onFinish={onFinish}
        requiredMark="optional"
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item label="Nombre" name="name" rules={[{ required: true }]}>
              <Input placeholder="Introduce tu nombre" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
              <Input placeholder="Introduce tu email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 0]}>
          <Col xs={24} md={8}>
            <Form.Item label="Teléfono" name="phone">
              <Input placeholder="Introduce tu teléfono" />
            </Form.Item>
          </Col>
          <Col xs={24} md={6}>
            <Form.Item label="Edad" name="age">
              <Input placeholder="Introduce tu edad" />
            </Form.Item>
          </Col>
          <Col xs={24} md={10}>
            <Form.Item name="contact" label="¿Cómo nos conociste?">
              <Select
                allowClear
                placeholder="Elige una opción"
                options={HOW_DID_YOU_HEAR_ABOUT_US_OPTIONS}
              />
            </Form.Item>
          </Col>
        </Row>


        <Form.Item name="type" label="¿Cuál es tu consulta?" rules={[{ required: true }]} >
          <Select
            allowClear
            placeholder="Elige una opción"
            options={TYPE_OF_INQUIRY_OPTIONS}
          />
        </Form.Item>
        <Row gutter={[16, 0]}>
          {
            campos.map((campo) => (
              <Col xs={24} md={8} key={campo.name}>
                <Form.Item key={campo.name} name={campo.name} label={campo.label} rules={[{ required: true }]}>
                  <Select placeholder="Selecciona" options={campo.options.map((option) => ({ label: option, value: option }))} />
                </Form.Item>
              </Col>
            ))
          }
        </Row>

        <Form.Item name="mensaje" rules={[{ required: true }]}>
          <TextArea rows={4} placeholder="Escribe tu mensaje aquí..." />
        </Form.Item>
        <Form.Item name="privacy" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error('Debe aceptar la política de privacidad')) }]}>
          <Checkbox>He leído y acepto la <a onClick={openPrivacyModal}>política de privacidad</a></Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" disabled={!submittable} htmlType="submit" loading={loading}>
            Enviar
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Política de Privacidad"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%'
        }}
      >
        <PrivacidadPage></PrivacidadPage>
      </Modal>
    </section >
  );
}
