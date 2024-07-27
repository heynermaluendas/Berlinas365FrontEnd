import React from 'react';
import { Form, Input, DatePicker, TimePicker, Button, Space, Row, Col } from 'antd';
import moment from 'moment';

interface CrearReunionProps {
  initialValues?: {
    nombre?: string;
    fecha?: moment.Moment;
    hora?: moment.Moment;
    tema?: string;
    lugar?: string;
  };
  onSave: (values: any) => void;
  form: any;
}

const CrearReunion: React.FC<CrearReunionProps> = ({ initialValues = {}, onSave, form }) => {
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const onFinish = (values: any) => {
    console.log('Formulario de creación de reunión enviado:', values);
    onSave(values); // Llama a la función onSave pasando los valores del formulario
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className='important-border' style={{ maxWidth: 800, width: '100%', padding: '0 16px', border: '1px solid', borderRadius: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center', marginTop: '10px' }}>Crear reunión</div>
        <Form
          {...layout}
          form={form}
          name="nest-messages"
          onFinish={onFinish}
          style={{ textAlign: 'center', justifyContent: 'center' }}
          labelAlign="top"
        >
          <Row justify="center" gutter={16} style={{ marginBottom: '1rem' }}>
            <Col xs={12} sm={8}>
              <Form.Item
                label="Fecha"
                name="fecha"
                initialValue={initialValues.fecha}
                rules={[{ required: true, message: 'Por favor ingrese la fecha de la reunión' }]}
                style={{ margin: 0 }}
              >
                <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
              </Form.Item>
            </Col>
            <Col xs={12} sm={8}>
              <Form.Item
                label="Hora"
                name="hora"
                initialValue={initialValues.hora}
                rules={[{ required: true, message: 'Por favor ingrese la hora de la reunión' }]}
                style={{ margin: 0 }}
              >
                <TimePicker style={{ width: '100%' }} format="HH:mm" />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center" gutter={16}>
            <Col xs={24} sm={16}>
              <Form.Item
                label="Nombre De Reunion"
                name="nombre"
                initialValue={initialValues.nombre}
                rules={[{ required: true, message: 'Por favor, ingrese el nombre de la reunión' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={16}>
              <Form.Item
                label="Lugar"
                name="lugar"
                initialValue={initialValues.lugar}
                rules={[{ required: true, message: 'Por favor ingrese el lugar de la reunión' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row justify="center" style={{ marginBottom: '1rem' }}>
            <Col xs={24} sm={16}>
              <Form.Item
                label="Tema"
                name="tema"
                initialValue={initialValues.tema}
                rules={[{ required: true, message: 'Por favor ingrese el tema de la reunión' }]}
              >
                <Input.TextArea />
              </Form.Item>
            </Col>
          </Row>
 
        </Form>
      </div>
    </div>
  );
};

export default CrearReunion;
