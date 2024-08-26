import React, { useState } from 'react';
import { Form, Input, DatePicker, Button, Upload, message, Modal, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import SignatureCanvas from 'react-signature-canvas'; // Asegúrate de instalar esta librería

const { TextArea } = Input;
const { Title } = Typography;

const FormComponent = () => {
  const [form] = Form.useForm();
  const [signingData, setSigningData] = useState({ open: false, fieldName: '', fieldType: '' });
  const [signature, setSignature] = useState('');
  const [conclusions, setConclusions] = useState('');
  const [evidenceImages, setEvidenceImages] = useState([]);

  const handleImageUpload = async (file) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const base64Image = reader.result;
      if (base64Image) {
        setEvidenceImages((prev) => [
          ...prev,
          { evidence_type: 'uploaded', evidence_src: base64Image },
        ]);
      }
      message.success(`${file.name} cargada correctamente.`);
    };
    
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload
  };

  const handleSignature = () => {
    setSigningData({ open: false, fieldName: '', fieldType: '' });
    setSignature('');
  };

  const onFinish = async (values) => {
    const formattedData = {
      form_event: [
        {
          event_data: {
            id_event: "5081", // Establecido estáticamente como en el ejemplo
            event_date: moment(values.event_date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            event_start_date: moment(values.event_start_date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            event_end_date: moment(values.event_end_date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
            event_place: values.event_place,
            event_city: values.event_city,
            event_issue: values.event_issue,
            event_name: values.event_name,
            event_conclusions: conclusions,
            event_record_number: values.event_record_number,
            event_aim: values.event_aim,
            event_agenda: values.event_agenda,
            event_development: values.event_development,
          },
          event_participants: values.event_participants.map(participant => ({
            participant_name: participant.participant_name,
            participant_position: participant.participant_position,
            participant_signature: participant.participant_signature,
          })),
          event_guests: values.event_guests.map(guest => ({
            guest_name: guest.guest_name,
            guest_position: guest.guest_position,
            guest_company: guest.guest_company,
            guest_signature: guest.guest_signature,
          })),
          event_actions: values.event_actions.map(action => ({
            action_name: action.action_name,
            action_responsible: action.action_responsible,
            action_deadline: moment(action.action_deadline).format("YYYY-MM-DD"),
          })),
          event_evidence: evidenceImages,
        },
      ],
    };

    try {
      const response = await axios.post('https://berlinas360backend.onrender.com/api/events/', formattedData);
      console.log('Respuesta del servidor:', response.data);
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <Form form={form} onFinish={onFinish}>
      {/* Campos del formulario */}
      <Form.Item name="event_date" label="Fecha del Evento">
        <DatePicker showTime />
      </Form.Item>
      <Form.Item name="event_start_date" label="Hora de Inicio">
        <DatePicker showTime />
      </Form.Item>
      <Form.Item name="event_end_date" label="Hora de Fin">
        <DatePicker showTime />
      </Form.Item>
      <Form.Item name="event_place" label="Lugar del Evento">
        <Input />
      </Form.Item>
      <Form.Item name="event_city" label="Ciudad del Evento">
        <Input />
      </Form.Item>
      <Form.Item name="event_issue" label="Asunto del Evento">
        <Input />
      </Form.Item>
      <Form.Item name="event_name" label="Nombre del Evento">
        <Input />
      </Form.Item>
      <Form.Item name="event_name" label="Nombre del Evento">
        <Input />
      </Form.Item>
      <Form.Item name="event_name" label="Nombre del Evento">
        <Input />
      </Form.Item>
      <Form.Item name="event_name" label="Nombre del Evento">
        <Input />
      </Form.Item>
      <Form.Item name="event_development" label="Nombre del Evento">
        <Input />
      </Form.Item>

      {/* Participantes */}
      <Form.List name="event_participants">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Form.Item key={key} style={{ marginBottom: 0 }}>
                <Form.Item {...restField} name={[name, 'participant_name']} fieldKey={[fieldKey, 'participant_name']} label="Nombre del Participante">
                  <Input />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'participant_position']} fieldKey={[fieldKey, 'participant_position']} label="Posición del Participante">
                  <Input />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'participant_signature']} fieldKey={[fieldKey, 'participant_signature']} label="Firma del Participante">
                  <Button onClick={() => setSigningData({ open: true, fieldName: `participant_signature_${key}`, fieldType: 'participant' })}>
                    Firmar
                  </Button>
                </Form.Item>
                <Button type="dashed" onClick={() => remove(name)} block>
                  Eliminar Participante
                </Button>
              </Form.Item>
            ))}
            <Button type="dashed" onClick={() => add()} block>
              Añadir Participante
            </Button>
          </>
        )}
      </Form.List>

      {/* Invitados */}
      <Form.List name="event_guests">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Form.Item key={key} style={{ marginBottom: 0 }}>
                <Form.Item {...restField} name={[name, 'guest_name']} fieldKey={[fieldKey, 'guest_name']} label="Nombre del Invitado">
                  <Input />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'guest_position']} fieldKey={[fieldKey, 'guest_position']} label="Posición del Invitado">
                  <Input />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'guest_company']} fieldKey={[fieldKey, 'guest_company']} label="Empresa del Invitado">
                  <Input />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'guest_signature']} fieldKey={[fieldKey, 'guest_signature']} label="Firma del Invitado">
                  <Button onClick={() => setSigningData({ open: true, fieldName: `guest_signature_${key}`, fieldType: 'guest' })}>
                    Firmar
                  </Button>
                </Form.Item>
                <Button type="dashed" onClick={() => remove(name)} block>
                  Eliminar Invitado
                </Button>
              </Form.Item>
            ))}
            <Button type="dashed" onClick={() => add()} block>
              Añadir Invitado
            </Button>
          </>
        )}
      </Form.List>

      {/* Acciones */}
      <Form.List name="event_actions">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <Form.Item key={key} style={{ marginBottom: 0 }}>
                <Form.Item {...restField} name={[name, 'action_name']} fieldKey={[fieldKey, 'action_name']} label="Nombre de la Acción">
                  <Input />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'action_responsible']} fieldKey={[fieldKey, 'action_responsible']} label="Responsable de la Acción">
                  <Input />
                </Form.Item>
                <Form.Item {...restField} name={[name, 'action_deadline']} fieldKey={[fieldKey, 'action_deadline']} label="Fecha Límite">
                  <DatePicker />
                </Form.Item>
                <Button type="dashed" onClick={() => remove(name)} block>
                  Eliminar Acción
                </Button>
              </Form.Item>
            ))}
            <Button type="dashed" onClick={() => add()} block>
              Añadir Acción
            </Button>
          </>
        )}
      </Form.List>

      {/* Conclusiones */}
      <Form.Item name="event_conclusions" label="Conclusiones">
        <TextArea
          rows={4}
          value={conclusions}
          onChange={(e) => setConclusions(e.target.value)}
        />
      </Form.Item>

      {/* Imágenes de Conclusiones */}
      <Form.Item name="conclusion_images" label="Imágenes de Conclusiones">
        <Upload
          name="file"
          action="https://berlinas360backend.onrender.com/api/events/"
          listType="picture"
          showUploadList={false}
          customRequest={({ file, onSuccess }) => {
            handleImageUpload(file);
            onSuccess(null, file);
          }}
        >
          <Button icon={<UploadOutlined />}>Subir Imagen</Button>
        </Upload>
      </Form.Item>

      {/* Botones */}
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Enviar
        </Button>
      </Form.Item>

      {/* Modal de Firma */}
      <Modal
        title="Firma"
        visible={signingData.open}
        onOk={handleSignature}
        onCancel={() => setSigningData({ ...signingData, open: false })}
      >
        <SignatureCanvas
          penColor='black'
          canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
          ref={(ref) => { if (ref) { ref.clear(); } }}
        />
      </Modal>
    </Form>
  );
};

export default FormComponent;
