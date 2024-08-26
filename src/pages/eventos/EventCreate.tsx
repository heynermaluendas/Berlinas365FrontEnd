import React, { useState, useRef } from 'react';
import { Form, Input, DatePicker, Button, Upload, Modal, Typography,TimePicker, Row ,Col,Popconfirm,Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import SignatureCanvas from 'react-signature-canvas';
import moment from 'moment';
import axios from 'axios';

const { TextArea } = Input;
const { Title } = Typography;

const FormComponent = () => {
  const [form] = Form.useForm();
  const [signingData, setSigningData] = useState({ open: false, fieldName: '', fieldType: '', index: null });
  const [signatures, setSignatures] = useState({ participants: {}, guests: {} });
  const [signature, setSignature] = useState('');
  const [conclusions, setConclusions] = useState('');
  const [evidenceImages, setEvidenceImages] = useState([]);
  const signaturePadRef = useRef(null);

  const handleImageUpload = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        setEvidenceImages(prev => [
          ...prev,
          { evidence_type: 'uploaded', evidence_src: reader.result },
        ]);
        resolve();
      };
  
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = (index) => {
    setEvidenceImages((prev) => prev.filter((_, i) => i !== index));
  };
   
  const handleSignature = () => {
    const { fieldType, index } = signingData;
    if (fieldType === 'participant') {
      setSignatures(prev => ({
        ...prev,
        participants: {
          ...prev.participants,
          [index]: signature,
        }
      }));
    } else if (fieldType === 'guest') {
      setSignatures(prev => ({
        ...prev,
        guests: {
          ...prev.guests,
          [index]: signature,
        }
      }));
    }
    setSigningData({ open: false, fieldName: '', fieldType: '', index: null });
    setSignature('');
  };

  const onFinish = async (values) => {
    const formattedData = {
      form_event: [
        {
          event_data: {
            event_date: values.event_date ? moment(values.event_date).format("YYYY-MM-DD") : '',
            event_start_date: values.event_start_date ? moment(values.event_start_date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") : '',
            event_end_date: values.event_end_date ? moment(values.event_end_date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") : '',
            event_place: values.event_place || '',
            event_city: values.event_city || '',
            event_issue: values.event_issue || '',
            event_name: values.event_name || '',
            event_conclusions: conclusions || '',
            event_record_number: values.event_record_number || '',
            event_aim: values.event_aim || '',
            event_agenda: values.event_agenda || '',
            event_development: values.event_development || '',
          },
          event_participants: (values.event_participants || []).map((participant, index) => ({
            participant_name: participant.participant_name || '',
            participant_position: participant.participant_position || '',
            participant_signature: signatures.participants[index] || '',
          })) || [],
          event_guests: (values.event_guests || []).map((guest, index) => ({
            guest_name: guest.guest_name || '',
            guest_position: guest.guest_position || '',
            guest_company: guest.guest_company || '',
            guest_signature: signatures.guests[index] || '',
          })) || [],
          event_actions: (values.event_actions || []).map(action => ({
            action_name: action.action_name || '',
            action_responsible: action.action_responsible || '',
            action_deadline: action.action_deadline ? moment(action.action_deadline).format("YYYY-MM-DD") : '',
          })) || [],
          event_evidence: evidenceImages.length > 0 ? evidenceImages : [],
        },
      ],
    };
  
    try {
      console.log(formattedData.form_event[0])
      const response = await axios.post('http://192.168.0.110:3100/api/events/', formattedData.form_event[0]);
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };
  

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {/* Campos del formulario */}
      <div style={{
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center',
  textTransform: 'uppercase',
  backgroundColor: '#f0f0f0', // Fondo gris claro
  padding: '10px', // Espaciado interior
  borderRadius: '4px' // Bordes redondeados (opcional)
}}>
  detalles de la reunión
</div>
<Row gutter={16} justify="center">
  <Col xs={24} sm={6}>
    <Form.Item
      name="event_date"
      label="Fecha del Evento"
      rules={[{ required: true, message: 'Por favor seleccione la fecha del evento' }]}
    >
      <DatePicker 
        format="YYYY-MM-DD" // Muestra solo año, mes y día
        showToday={false} // No muestra el tiempo actual
        picker="date" // Solo selecciona fecha
        allowClear // Permite limpiar la selección
        onChange={(date) => form.setFieldsValue({ event_date: date })} // Actualiza el valor del formulario
      />
    </Form.Item>
  </Col>
  <Col xs={24} sm={6}>
    <Form.Item
      name="event_start_date"
      label="Fecha de Inicio"
      rules={[{ required: true, message: 'Por favor seleccione la fecha de inicio' }]}
    >
      <TimePicker showTime format="HH:mm" />
    </Form.Item>
  </Col>
  <Col xs={24} sm={6}>
    <Form.Item
      name="event_end_date"
      label="Fecha de Fin"
      rules={[{ required: true, message: 'Por favor seleccione la fecha de fin' }]}
    >
      <TimePicker showTime format="HH:mm" />
    </Form.Item>
  </Col>
  <Col xs={24} sm={6}>
    <Form.Item
      name="event_record_number"
      label="No Acta"
      rules={[{ required: true, message: 'Por favor ingrese el número del acta' }]}
    >
      <Input type="number" />
    </Form.Item>
  </Col>
  <Col xs={24} sm={12}>
    <Form.Item
      name="event_place"
      label="Lugar"
      rules={[{ required: true, message: 'Por favor ingrese el lugar del evento' }]}
    >
      <Input />
    </Form.Item>
  </Col>
  <Col xs={24} sm={12}>
    <Form.Item
      name="event_city"
      label="Ciudad"
      rules={[{ required: true, message: 'Por favor ingrese la ciudad' }]}
    >
      <Input />
    </Form.Item>
  </Col>
  <Col xs={24} sm={12}>
    <Form.Item
      name="event_issue"
      label="Tema"
      rules={[{ required: true, message: 'Por favor ingrese el tema del evento' }]}
    >
      <TextArea
        autoSize={{ minRows: 1, maxRows: 6 }} // Ajusta el número mínimo y máximo de filas
      />
    </Form.Item>
  </Col>
  <Col xs={24} sm={12}>
    <Form.Item
      name="event_name"
      label="Nombre de Reunion"
      rules={[{ required: true, message: 'Por favor ingrese el nombre de la reunión' }]}
    >
      <Input />
    </Form.Item>
  </Col>
  <Col xs={24} sm={24}>
    <Form.Item
      name="event_aim"
      label="Objetivo"
      rules={[{ required: true, message: 'Por favor ingrese el objetivo del evento' }]}
    >
      <TextArea rows={4} />
    </Form.Item>
  </Col>
  <Col xs={24} sm={24}>
    <Form.Item
      name="event_agenda"
      label="Agenda"
      rules={[{ required: true, message: 'Por favor ingrese la agenda del evento' }]}
    >
      <TextArea rows={4} />
    </Form.Item>
  </Col>
  <Col xs={24} sm={24}>
    <Form.Item
      name="event_development"
      label="Desarrollo"
      rules={[{ required: true, message: 'Por favor ingrese el desarrollo del evento' }]}
    >
      <TextArea rows={4} />
    </Form.Item>
  </Col>
</Row>

      {/* Participantes */}
      <div style={{
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center',
  textTransform: 'uppercase',
  backgroundColor: '#f0f0f0', // Fondo gris claro
  padding: '10px', // Espaciado interior
  borderRadius: '4px', // Bordes redondeados (opcional)
  marginTop:'20px'
}}>
  Participantes
</div>
<Form.List name="event_participants">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, fieldKey, ...restField }) => (
        <Form.Item key={key} style={{ marginBottom: 0 }}>
          <Row gutter={16}>
            <Col  xs={24} sm={10}>
              <Form.Item
                {...restField}
                name={[name, 'participant_name']}
                fieldKey={[fieldKey, 'participant_name']}
                label="Nombre del Participante"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col  xs={24} sm={10}>
              <Form.Item
                {...restField}
                name={[name, 'participant_position']}
                fieldKey={[fieldKey, 'participant_position']}
                label="Posición del Participante"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col  xs={24} sm={4}>
              <Form.Item
                {...restField}
                name={[name, 'participant_signature']}
                fieldKey={[fieldKey, 'participant_signature']}
                label="Firma"
              >
                <Button
                  onClick={() =>
                    setSigningData({
                      open: true,
                      fieldName: `participant_signature_${key}`,
                      fieldType: 'participant',
                      index: key,
                    })
                  }
                >
                  Firmar
                </Button>
              </Form.Item>
            </Col>
            <Col span={24} style={{ marginTop: '8px' }}>
              <Popconfirm
                title="¿Estás seguro de que quieres eliminar este participante?"
                onConfirm={() => remove(name)}
                okText="Sí"
                cancelText="No"
              >
                <Button type="dashed" block
                 style={{ color: 'red' }}
                >
                  Eliminar Participante
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </Form.Item>
      ))}
      <Button type="primary" onClick={() => add()} block style={{ marginTop: '16px' }}>
        Añadir Participante
      </Button>
    </>
  )}
</Form.List>

      <div style={{
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center',
  textTransform: 'uppercase',
  backgroundColor: '#f0f0f0', // Fondo gris claro
  padding: '10px', // Espaciado interior
  borderRadius: '4px' ,
  marginTop:'50px'
}}>
  Invitados
</div>
      {/* Invitados */}
      <Form.List name="event_guests">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, fieldKey, ...restField }) => (
        <Form.Item key={key} style={{ marginBottom: 0 }}>
          <Row gutter={16}>
            <Col xs={24} sm={10}>
              <Form.Item
                {...restField}
                name={[name, 'guest_name']}
                fieldKey={[fieldKey, 'guest_name']}
                label="Nombre del Invitado"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={5}>
              <Form.Item
                {...restField}
                name={[name, 'guest_position']}
                fieldKey={[fieldKey, 'guest_position']}
                label="Posición del Invitado"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={5}>
              <Form.Item
                {...restField}
                name={[name, 'guest_company']}
                fieldKey={[fieldKey, 'guest_company']}
                label="Empresa del Invitado"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={4}>
              <Form.Item
                {...restField}
                name={[name, 'guest_signature']}
                fieldKey={[fieldKey, 'guest_signature']}
                label="Firma"
              >
                <Button
                  onClick={() =>
                    setSigningData({
                      open: true,
                      fieldName: `guest_signature_${key}`,
                      fieldType: 'guest',
                      index: key,
                    })
                  }
                >
                  Firmar
                </Button>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24 } style={{ marginTop: '8px' }}>
              <Popconfirm
                title="¿Estás seguro de que quieres eliminar este invitado?"
                onConfirm={() => remove(name)}
                okText="Sí"
                cancelText="No"
              >
                <Button type="dashed" block
                 style={{ color: 'red' }}
                >
                  Eliminar Invitado
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </Form.Item>
      ))}
      <Button type="primary" onClick={() => add()} block style={{ marginTop: '16px' }}>
        Añadir Invitado
      </Button>
    </>
  )}
</Form.List>

      <div style={{
         marginTop:'50px',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center',
  textTransform: 'uppercase',
  backgroundColor: '#f0f0f0', // Fondo gris claro
  padding: '10px', // Espaciado interior
  borderRadius: '4px' // Bordes redondeados (opcional)
}}>
  Acciones
</div>
      {/* Acciones */}
      <Form.List name="event_actions">
  {(fields, { add, remove }) => (
    <>
      {fields.map(({ key, name, fieldKey, ...restField }) => (
        <Form.Item key={key} style={{ marginBottom: 0 }}>
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <Form.Item
                {...restField}
                name={[name, 'action_name']}
                fieldKey={[fieldKey, 'action_name']}
                label="Nombre de la Acción"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item
                {...restField}
                name={[name, 'action_responsible']}
                fieldKey={[fieldKey, 'action_responsible']}
                label="Responsable de la Acción"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={6}>
              <Form.Item
                {...restField}
                name={[name, 'action_deadline']}
                fieldKey={[fieldKey, 'action_deadline']}
                label="Fecha Límite"
              >
                <DatePicker />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24}style={{ marginTop: '8px' }}>
              <Popconfirm
                title="¿Estás seguro de que quieres eliminar esta acción?"
                onConfirm={() => remove(name)}
                okText="Sí"
                cancelText="No"
              >
                <Button type="dashed" block
                 style={{ color: 'red' }}
                >
                  Eliminar Acción
                </Button>
              </Popconfirm>
            </Col>
          </Row>
        </Form.Item>
      ))}
      <Button type="primary" onClick={() => add()} block style={{ marginTop: '16px'  }}>
        Añadir Acción
      </Button>
    </>
  )}
</Form.List>

      <div style={{
         marginTop:'50px',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center',
  textTransform: 'uppercase',
  backgroundColor: '#f0f0f0', // Fondo gris claro
  padding: '10px', // Espaciado interior
  borderRadius: '4px', // Bordes redondeados (opcional)
  marginBottom:'10px'
}}>
  Conclusiones
</div>
      {/* Conclusiones */}
      <Form.Item
  name="event_conclusions"
  label="Conclusiones"
  rules={[{ required: true, message: 'Por favor ingrese las conclusiones' }]}
>
  <TextArea
    rows={4}
    onChange={(e) => setConclusions(e.target.value)}
  />
</Form.Item>


      {/* Evidencias */}
      <Form.Item label="Imágenes">
  <div style={{ textAlign: 'center' }}>
    <Upload
      customRequest={({ file, onSuccess, onError }) => {
        handleImageUpload(file)
          .then(() => onSuccess()) // Resuelve correctamente cuando se completa la carga
          .catch((error) => onError(error)); // Maneja el error correctamente
      }}
      showUploadList={false}
      multiple
      style={{ marginBottom: '16px' }}
    >
      <Button icon={<UploadOutlined />}>Subir Imágenes</Button>
    </Upload>
  </div>
  <div style={{
    display: 'flex',
    justifyContent: 'center', // Centra el contenedor de la cuadrícula horizontalmente
    width: '100%',
    overflow: 'hidden',
    marginTop: '10px'
  }}>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', // Ajusta automáticamente el número de columnas con un mínimo de 200px
      gap: '16px', // Espacio entre las imágenes
      maxWidth: '1000px', // Ancho máximo para centrar el contenido de la cuadrícula
      width: '100%', // Ancho del contenedor de la cuadrícula
      justifyContent: 'center', // Centra el contenido dentro del contenedor de la cuadrícula
      margin: '0 auto', // Centra el contenedor de la cuadrícula horizontalmente
    }}>
      {evidenceImages.length === 0 ? (
        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888' }}>
          No hay imágenes cargadas
        </div>
      ) : (
        evidenceImages.map((img, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: '25%', // Asegura que el div tenga un ancho mínimo
              maxWidth: '100%', // Evita que el div se expanda más allá del tamaño deseado
              height: 'auto',
              padding: '8px',
              boxSizing: 'border-box',
              border: '1px solid rgb(217, 217, 217)',
              borderRadius: '4px',
              backgroundColor: 'rgb(250, 250, 250)',
              overflow: 'hidden',
              // Centra verticalmente el contenido
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Image
              src={img.evidence_src}
              alt={`evidence_${index}`}
              style={{
                maxWidth: '180px', // Ancho máximo considerando el padding
                maxHeight: '120px', // Altura máxima considerando el padding
                marginBottom: '8px', // Espacio entre la imagen y el botón
                alignSelf: 'center', // Centra la imagen horizontalmente
              }}
            />
            <div style={{ alignSelf: 'center' }}> {/* Centra el botón horizontalmente */}
              <Popconfirm
                title="¿Estás seguro de que quieres eliminar esta imagen?"
                onConfirm={() => handleDeleteImage(index)}
                okText="Sí"
                cancelText="No"
              >
                <Button
                  type="text"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: 'red',
                    padding: '2px 8px',
                    fontSize: '14px', // Ajusta el tamaño de la fuente si es necesario
                  }}
                >
                  Eliminar imagen
                </Button>
              </Popconfirm>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
</Form.Item>
















<Form.Item style={{ textAlign: 'center' }}>
  <Button type="primary" htmlType="submit">
    Enviar Datos
  </Button>
</Form.Item>


      {/* Modal para firma */}
      <Modal
        title="Firma"
        visible={signingData.open}
        onOk={handleSignature}
        onCancel={() => setSigningData({ open: false, fieldName: '', fieldType: '', index: null })}
      >
        <Title level={4}>Firma para {signingData.fieldName}</Title>
        <SignatureCanvas
          ref={signaturePadRef}
          penColor="black"
          canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
          onEnd={() => setSignature(signaturePadRef.current.toDataURL())}
        />
        <Button onClick={() => signaturePadRef.current.clear()}>Borrar</Button>
      </Modal>
    </Form>
  );
};

export default FormComponent;
