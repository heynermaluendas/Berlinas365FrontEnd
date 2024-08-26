import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Button, Upload, Row, Col, Image, Modal, Popconfirm } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import SignatureCanvas from 'react-signature-canvas';

const Settingstable = ({ id_event, onSave, handleCancel1 }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentSignatureIndex, setCurrentSignatureIndex] = useState(null);
  const [currentSignatureType, setCurrentSignatureType] = useState(null);
  const [signatureData, setSignatureData] = useState(null);

  const signatureRefs = {
    participants: [],
    guests: [],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://192.168.0.110:3100/api/events/${id_event}/`);
        const data = response.data.event_data;
        console.log('Fetched data:', data);
        setData(data);
        form.setFieldsValue(data);

        if (data.form_event && data.form_event[0].event_evidence) {
          const evidenceImages = data.form_event[0].event_evidence.map(evidence => ({
            type: 'uploaded',
            src: evidence.evidence_src
          }));

          console.log('Fetched images:', evidenceImages);
          setImageList(evidenceImages);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id_event, form]);

  const handleSave = async () => {
    try {
      // Validar los campos del formulario
      const values = await form.validateFields();
      console.log('Form values before saving:', values);
  
      // Convertir firmas a base64 para participantes
      if (values.form_event && values.form_event[0].event_participants) {
        values.form_event[0].event_participants.forEach((participant, index) => {
          if (signatureRefs.participants[index]) {
            participant.signature = signatureRefs.participants[index].getTrimmedCanvas().toDataURL('image/png');
          }
        });
        console.log('Participants with signatures:', values.form_event[0].event_participants);
      }
  
      // Convertir firmas a base64 para huéspedes
      if (values.form_event && values.form_event[0].event_guests) {
        values.form_event[0].event_guests.forEach((guest, index) => {
          if (signatureRefs.guests[index]) {
            guest.signature = signatureRefs.guests[index].getTrimmedCanvas().toDataURL('image/png');
          }
        });
        console.log('Guests with signatures:', values.form_event[0].event_guests);
      }
  
      // Incluir imágenes en los valores del formulario
      if (!values.form_event[0]) {
        values.form_event[0] = {};
      }
      values.form_event[0].event_evidence = imageList;
      console.log('Form values with images:', values);
  
      // Enviar los valores actualizados del formulario
      await axios.put(`http://192.168.0.110:3100/api/events/${id_event}/`, values);
      onSave(values);
    } catch (error) {
      console.error('Error saving form data:', error);
    }  
    handleCancel1();
  };
  
  const handleImageUpload = ({ file, onSuccess }) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      const imageURL = `data:${file.type};base64,${base64String}`;
      const newImage = { type: 'uploaded', src: imageURL };

      console.log('New image:', newImage);

      setImageList((prevImages) => [...prevImages, newImage]);

      const newValues = form.getFieldsValue();
      if (!newValues.form_event) {
        newValues.form_event = {};
      }
      if (!Array.isArray(newValues.form_event[0].event_evidence)) {
        newValues.form_event[0].event_evidence = [];
      }
      newValues.form_event[0].event_evidence.push(newImage);
      form.setFieldsValue(newValues);

      onSuccess();
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (index) => {
    const updatedImageList = imageList.filter((_, i) => i !== index);
    console.log('Updated image list after removal:', updatedImageList);
    setImageList(updatedImageList);

    const newValues = form.getFieldsValue();
    if (newValues.form_event[0] && Array.isArray(newValues.form_event[0].event_evidence)) {
      newValues.form_event[0].event_evidence = updatedImageList;
      form.setFieldsValue(newValues);
    }
  };

  const openSignatureModal = (type, index) => {
    setCurrentSignatureType(type);
    setCurrentSignatureIndex(index);
  
    let existingSignature = '';
  
    if (type === 'participants') {
      existingSignature = data.form_event[0].event_participants[index]?.participant_signature || '';
    } else if (type === 'guests') {
      existingSignature = data.form_event[0].event_guests[index]?.guest_signature || '';
    }
    // Add other types as necessary
  
    console.log('Existing signature:', existingSignature);
    setSignatureData(existingSignature);
  
    setIsModalVisible(true);
  };
  
  const handleOk = () => {
    if (currentSignatureType && currentSignatureIndex !== null) {
      const signaturePad = signatureRefs[currentSignatureType]?.[currentSignatureIndex];
    
      if (!signaturePad) {
        console.error('No signature pad found for type:', currentSignatureType, 'and index:', currentSignatureIndex);
        return;
      }
    
      const signatureDataURL = signaturePad.getTrimmedCanvas().toDataURL('image/png');
    
      const currentValues = form.getFieldsValue(true);
      const updatedValues = JSON.parse(JSON.stringify(currentValues));
    
      updatedValues.form_event = updatedValues.form_event.map(event => {
        if (event) {
          if (currentSignatureType === 'participants') {
            event.event_participants = event.event_participants?.map((participant, index) =>
              index === currentSignatureIndex ? { ...participant, participant_signature: signatureDataURL } : participant
            );
          } else if (currentSignatureType === 'guests') {
            event.event_guests = event.event_guests?.map((guest, index) =>
              index === currentSignatureIndex ? { ...guest, guest_signature: signatureDataURL } : guest
            );
          }
        }
        return event;
      });
    
      form.setFieldsValue(updatedValues);
      
      // Actualiza el estado de firma para el uso en la UI
      if (currentSignatureType && signatureDataURL) {
        if (currentSignatureType === 'participants') {
          const updatedParticipants = updatedValues.form_event[0].event_participants.map((participant, index) =>
            index === currentSignatureIndex ? { ...participant, participant_signature: signatureDataURL } : participant
          );
          setData(prevData => ({
            ...prevData,
            form_event: [{
              ...prevData.form_event[0],
              event_participants: updatedParticipants
            }]
          }));
        } else if (currentSignatureType === 'guests') {
          const updatedGuests = updatedValues.form_event[0].event_guests.map((guest, index) =>
            index === currentSignatureIndex ? { ...guest, guest_signature: signatureDataURL } : guest
          );
          setData(prevData => ({
            ...prevData,
            form_event: [{
              ...prevData.form_event[0],
              event_guests: updatedGuests
            }]
          }));
        }
      }
      
      setIsModalVisible(false);
    } else {
      console.warn('No valid signature type or index provided.');
    }
    clearSignature()
  };
 
  const handleCancel = () => {
    setIsModalVisible(false);
    clearSignature()
  };

  const clearSignature = () => {
    if (currentSignatureType && currentSignatureIndex !== null) {
      console.log('Clearing signature pad at index:', currentSignatureIndex);
      signatureRefs[currentSignatureType][currentSignatureIndex]?.clear();
    }
  };
  
  if (!data) return <div>Loading...</div>;

  return (
    <Form form={form} layout="vertical" initialValues={data}>
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
        
        <Col xs={24} sm={8}>
        {/* fecha */}
        <Form.Item
          name={['form_event', 0,'event_data','event_date']}
          label="fecha"
          rules={[{ required: true, message: 'fecha es requerido' }]}
        >
          <Input placeholder="Ingrese fecha" />
        </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
        {/* horaInicio */}
        <Form.Item
          name={['form_event', 0,'event_data','event_start_date']}
          label="horaInicio"
          rules={[{ required: true, message: 'horaInicio es requerido' }]}
        >
          <Input placeholder="Ingrese horaInicio" />
        </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
        {/* horaFin */}
        <Form.Item
          name={['form_event', 0,'event_data','event_end_date']}
          label="horaFin"
          rules={[{ required: true, message: 'horaFin es requerido' }]}
        >
          <Input placeholder="Ingrese horaFin" />
        </Form.Item>
        </Col>
        <Col  xs={24} sm={8}>
        {/* lugar */}
        <Form.Item
          name={['form_event', 0,'event_data','event_place']}
          label="lugar"
          rules={[{ required: true, message: 'lugar es requerido' }]}
        >
          <Input placeholder="Ingrese el lugar" />
        </Form.Item>
        </Col>
        <Col  xs={24} sm={8}>
        {/* ciudad*/}
        <Form.Item
          name={['form_event', 0,'event_data','event_city']}
          label="ciudad"
          rules={[{ required: true, message: 'ciudad es requerido' }]}
        >
          <Input placeholder="Ingrese ciudad" />
        </Form.Item>
        </Col>
        <Col xs={24} sm={8}>
        {/* No Acta */}
        <Form.Item
          name={['form_event', 0,'event_data','event_record_number']}
          label="No Acta"
          rules={[{ required: true, message: 'No Acta es requerido' }]}
        >
          <Input placeholder="Ingrese el número de acta" />
        </Form.Item>
        </Col>
        <Col  xs={24} sm={12}>
        {/* tema*/}
        <Form.Item
          name={['form_event', 0,'event_data','event_issue']}
          label="tema"
          rules={[{ required: true, message: 'tema es requerido' }]}
        >
          <Input placeholder="Ingrese el tema" />
        </Form.Item>
        </Col>
        <Col  xs={24} sm={12}>
        {/* nombre */}
        <Form.Item
          name={['form_event', 0,'event_data','event_name']}
          label="nombre"
          rules={[{ required: true, message: 'nombre es requerido' }]}
        >
          <Input placeholder="Ingrese nombre" />
        </Form.Item>
        </Col>
        
        <Col xs={24} sm={24}>
        {/* Objective */}
        <Form.Item
          name={['form_event', 0,'event_data','event_aim']}
          label="Objetivo"
          rules={[{ required: true, message: 'Objetivo es requerido' }]}
        >
          <Input.TextArea placeholder="Ingrese el objetivo" />
        </Form.Item>
        </Col>
        <Col xs={24} sm={24}>
        {/* Agenda */}
        <Form.Item
          name={['form_event', 0,'event_data','event_agenda']}
          label="Agenda"
          rules={[{ required: true, message: 'Agenda es requerida' }]}
        >
          <Input.TextArea placeholder="Ingrese la agenda" />
        </Form.Item>
        </Col>
        <Col xs={24} sm={24}>
        {/* Desarrollo */}
        <Form.Item
          name={['form_event', 0,'event_data','event_development']}
          label="Desarrollo"
          rules={[{ required: true, message: 'Desarrollo es requerido' }]}
        >
          <Input.TextArea placeholder="Ingrese el desarrollo" />
        </Form.Item>
        </Col>
      </Row>
  
      {/* Participants */}
      <Form.Item name={['form_event',0, 'event_participants']}>
        <div
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
            textTransform: 'uppercase',
            backgroundColor: '#f0f0f0',
            padding: '10px',
            borderRadius: '4px',
          }}
        >
          Participantes
        </div>

        <Form.List name={['form_event',0, 'event_participants']}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                <Row key={key} gutter={16} style={{ padding: 0 }}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'participant_name']}
                      fieldKey={[fieldKey, 'participant_name']}
                      label="Nombre"
                      rules={[{ required: true, message: 'Nombre es requerido' }]}
                    >
                      <Input placeholder="Nombre del participante" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item
                      {...restField}
                      name={[name, 'participant_position']}
                      fieldKey={[fieldKey, 'participant_position']}
                      label="Cargo"
                      rules={[{ required: true, message: 'Cargo es requerido' }]}
                    >
                      <Input placeholder="Cargo del participante" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={4} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Form.Item
                      label="Firma"
                      name={[name, 'participant_signature']}
                      fieldKey={[fieldKey, 'participant_signature']}
                    >
                      <Button onClick={() => openSignatureModal('participants', index)}>Firmar</Button>
                    </Form.Item>
                  </Col>
                  <Col
                    xs={24}
                    sm={24}
                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Popconfirm
                      title="¿Estás seguro de que quieres eliminar este participante?"
                      onConfirm={() => remove(name)}
                      okText="Sí"
                      cancelText="No"
                    >
                      <Button type="link">Eliminar Participante</Button>
                    </Popconfirm>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Agregar Participante
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      {/* Guests */}
      <Form.Item name={['form_event',0, 'event_guests']}  >
      <div style={{
        fontSize: '16px',
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
        backgroundColor: '#f0f0f0', // Fondo gris claro
        padding: '10px', // Espaciado interior
        borderRadius: '4px' // Bordes redondeados (opcional)
      }}>
        Invitados
      </div>
        <Form.List name={['form_event',0, 'event_guests']}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                <Row key={key} gutter={16}>
                  <Col xs={24} sm={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'guest_name']}
                      fieldKey={[fieldKey, 'guest_name']}
                      label="Nombre"
                      rules={[{ required: true, message: 'Nombre es requerido' }]}
                    >
                      <Input placeholder="Nombre del invitado" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={6}>
                    <Form.Item
                      {...restField}
                      name={[name, 'guest_position']}
                      fieldKey={[fieldKey, 'guest_position']}
                      label="Cargo"
                      rules={[{ required: true, message: 'Cargo es requerido' }]}
                    >
                      <Input placeholder="Cargo del invitado" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={5}>
                    <Form.Item
                      {...restField}
                      name={[name, 'guest_company']}
                      fieldKey={[fieldKey, 'guest_company']}
                      label="Empresa"
                    >
                      <Input placeholder="Empresa del invitado" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Form.Item
                      label="Firma"
                      name={[name, 'guest_signature']}
                      fieldKey={[fieldKey, 'guest_signature']}
                    >
                      <Button onClick={() => openSignatureModal('guests', index)}>
                        Firmar
                      </Button>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button type="link" onClick={() => remove(name)}>
                      Eliminar Invitado
                    </Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Agregar Invitado
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      {/* actions */}
      <Form.Item name={['form_event',0, 'event_actions']}  >
      <div style={{
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
        <Form.List name={['form_event',0, 'event_actions']}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }, index) => (
                <Row key={key} gutter={16}>
                  <Col xs={24} sm={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'action_name']}
                      fieldKey={[fieldKey, 'action_name']}
                      label="Accion"
                      rules={[{ required: true, message: 'Accion es requerido' }]}
                    >
                      <Input placeholder="Accion" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'action_responsible']}
                      fieldKey={[fieldKey, 'action_responsible']}
                      label="Responsable"
                      rules={[{ required: true, message: 'Responsable es requerido' }]}
                    >
                      <Input placeholder="Responsable" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={4}>
                    <Form.Item
                      {...restField}
                      name={[name, 'action_deadline']}
                      fieldKey={[fieldKey, 'action_deadline']}
                      label="Fecha Limite"
                    >
                      <Input placeholder="Fecha Limite" />
                    </Form.Item>
                  </Col>
                  
                  <Col xs={24} sm={24} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <Popconfirm
                    title="¿Estás seguro de que quieres eliminar esta acción?"
                    onConfirm={() => remove(name)}
                    okText="Sí"
                    cancelText="No"
                  >
                    <Button type="link">
                      Eliminar acción
                    </Button>
                  </Popconfirm>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block>
                  Agregar accion
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>

    {/* conclusion */}
    <div style={{
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
      <Form.Item
        name={['form_event',0, 'event_data','event_conclusions']}
        label="Conclusion"
        rules={[{ required: true, message: 'conclusion es requerida' }]}
        style={{ marginBottom: '24px',textAlign: 'center' }}
      >
        <Input.TextArea placeholder="Ingrese la conclusion" />
      </Form.Item>
            {/* Images */}
            <Form.Item
            label="Imágenes"
            extra="Cargue imágenes relacionadas con las conclusiones."
            style={{ marginBottom: '24px', textAlign: 'center' }}
          >
            <Upload
              customRequest={handleImageUpload}
              showUploadList={false}
              accept="image/*"
              multiple
              style={{ marginBottom: '16px' }}
            >
              <Button icon={<UploadOutlined />} style={{ marginBottom: '16px' }}>
                Subir Imágenes
              </Button>
            </Upload>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: '16px',
                justifyContent: 'center'
              }}
            >
              {imageList.length === 0 ? (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#888' }}>
                  No hay imágenes cargadas
                </div>
              ) : (
                imageList.map((image, index) => {
                  console.log(`Rendering image ${index}:`, image.src);
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '8px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        backgroundColor: '#fafafa'
                      }}
                    >
                      <img
                        src={image.src}
                        alt={`Imagen ${index}`}
                        style={{ maxWidth: '150px', maxHeight: '100px', objectFit: 'cover' }}
                      />
                      <Popconfirm
                        title="¿Estás seguro de que quieres eliminar esta imagen?"
                        onConfirm={() => handleRemoveImage(index)}
                        okText="Sí"
                        cancelText="No"
                      >
                        <Button
                          type="link"
                          style={{ color: '#ff4d4f', marginTop: '8px' }}
                        >
                          Eliminar Imagen
                        </Button>
                      </Popconfirm>
                    </div>
                  );
                })
              )}
            </div>
          </Form.Item>
          <Form.Item
            style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}
          >
            <Button type="primary" onClick={handleSave}>
              Guardar
            </Button>
          </Form.Item>
        <Modal
          title="Firma"
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[
            <Button key="clear" onClick={clearSignature}>
              Limpiar
            </Button>,
            <Button key="back" onClick={handleCancel}>
              Cancelar
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk}>
              Guardar
            </Button>,
          ]}
        >
        <SignatureCanvas
          ref={(ref) => {
            if (ref && currentSignatureType && currentSignatureIndex !== null) {
              // Asegúrate de que la referencia se asigna solo si el índice es válido
              if (!signatureRefs[currentSignatureType]) {
                signatureRefs[currentSignatureType] = [];
              }
              signatureRefs[currentSignatureType][currentSignatureIndex] = ref;
            }
          }}
          penColor="black"
          canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
        />
        {signatureData && <Image src={signatureData} />}
      </Modal>
    </Form>
  );
};

export default Settingstable;
