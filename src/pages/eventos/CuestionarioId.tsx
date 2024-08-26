import { SmileOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row, Tabs } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Webcam from 'react-webcam';

export const CuestionarioId: React.FC<{
  id: string;
  onSave: (formData: any) => void;
  stopCapture: React.Dispatch<React.SetStateAction<() => void>>;
}> = ({ id, onSave, stopCapture }) => {
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const validateMessages = {
    required: '${label} es requerido!',
    types: {
      email: '${label} no es un email válido!',
      number: '${label} no es un número válido!',
    },
    number: {
      range: '${label} debe estar entre ${min} y ${max}',
    },
  };

  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
  const [images, setImages] = useState<{ type: string; src: string }[]>([]);
  const [form] = Form.useForm();
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [facingMode, setFacingMode] = useState('user');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isComponentOpen, setIsComponentOpen] = useState(true);
  const [selectedTab, setSelectedTab] = useState('participant');
  const [signatureImage, setSignatureImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const endpoint = 'https://berlinas360backend.onrender.com/api/events/';

  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImages((prevImages) => [...prevImages, { type: 'captured', src: imageSrc }]);
    }
    setModalVisible(false);
  };

  const onFinish = async (values: any) => {
    const filteredImages = images.filter((img) => img.src.trim() !== '');
    const newUser = {
      user: {
        name: values.user.name,
        position: values.user.position,
        signature: signatureImage,  // Incluye la firma aquí
      },
      images: filteredImages,
    };
  
    try {
      const response = await axios.get(`https://berlinas360backend.onrender.com/api/events/${id}/`);
      const formulario = response.data;
  
      if (formulario.cuestionarios) {
        if (selectedTab === 'participant') {
          formulario.cuestionarios.participants = formulario.cuestionarios.participants || [];
          formulario.cuestionarios.participants.push({
            name: values.user.name,
            position: values.user.position,
            signature: signatureImage,  // Incluye la firma aquí
          });
        } else if (selectedTab === 'guest') {
          formulario.cuestionarios.guests = formulario.cuestionarios.guests || [];
          formulario.cuestionarios.guests.push({
            name: values.user.name,
            position: values.user.position,
            company: values.user.company,
            signature: signatureImage,  // Incluye la firma aquí
          });
        }
      } else {
        formulario.cuestionarios = {
          participants: selectedTab === 'participant' ? [{
            name: values.user.name,
            position: values.user.position,
            signature: signatureImage,  // Incluye la firma aquí
          }] : [],
          guests: selectedTab === 'guest' ? [{
            name: values.user.name,
            position: values.user.position,
            company: values.user.company,
            signature: signatureImage,  // Incluye la firma aquí
          }] : [],
          actions: []
        };
      }
  
      await axios.put(`https://berlinas360backend.onrender.com/api/events/${id}/`, formulario);
      message.success('Usuario añadido correctamente al cuestionario');
      onSave(newUser);
    } catch (error) {
      console.error('Error saving form data:', error.response?.data || error.message);
      message.error('Error al añadir el usuario al cuestionario');
    }
  
    form.resetFields();
    setImages([]);
    setIsSignatureEmpty(true);
    setSignatureImage(null); // Resetear la firma
    sigCanvas.current?.clear();
  };

  const handleResetSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsSignatureEmpty(true);
      setSignatureImage(null); // Resetear la firma
    }
  };

  const capturePhoto = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      try {
        await axios.post(endpoint, { image: imageSrc });
        console.log('Photo sent successfully');
      } catch (error) {
        console.error('Error sending photo:', error);
      }
    }
  };

  useEffect(() => {
    if (isCapturing && isComponentOpen) {
      intervalId.current = setInterval(() => {
        capturePhoto();
      }, 2000);
    } else {
      if (intervalId.current) clearInterval(intervalId.current);
    }

    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [isCapturing, isComponentOpen]);

  const stopCapturingPhotos = () => {
    setIsCapturing(false);
  };

  useEffect(() => {
    stopCapture(() => stopCapturingPhotos);
    return () => {
      stopCapturingPhotos();
      setIsComponentOpen(false);
    };
  }, [stopCapture]);

  const handleTabChange = (key: string) => {
    setSelectedTab(key);
    form.resetFields();
    setIsSignatureEmpty(true);
    setSignatureImage(null); // Resetear la firma al cambiar de pestaña
    sigCanvas.current?.clear();
  };

  const handleOpenSignatureModal = () => {
    setModalVisible(true);
  };

  const handleSaveSignature = () => {
    const signatureDataUrl = sigCanvas.current?.getTrimmedCanvas().toDataURL();
    if (signatureDataUrl) {
      setSignatureImage(signatureDataUrl); // Actualiza el estado con la firma
      setIsSignatureEmpty(false);
      setModalVisible(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ maxWidth: 800, width: '100%', padding: '0 16px', borderRadius: '20px' }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            textAlign: 'center',
            marginTop: '10px',
            
          }}
        >
          <div>
            <Button
              icon={<SmileOutlined style={{ fontSize: '40px', marginLeft: '8px' }} />}
              onClick={() => setIsCapturing(!isCapturing)}
              style={{
                marginBottom: '10px',
                height: '50px',
                width: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isCapturing ? ' ' : ' '}
            </Button>
          </div>
          {isCapturing && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width="300px"
              height="auto"
              style={{
                borderRadius: '50%',
                objectFit: 'cover',
                width: '300px',
                height: '400px',
                marginTop: '10px',
              }}
            />
          )}
          Formulario
        </div>
        <Tabs
  defaultActiveKey="participant"
  onChange={handleTabChange}
  style={{ textAlign: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}
  tabBarStyle={{ textAlign: 'center', justifyContent: 'center' }}
  centered
>
  <Tabs.TabPane tab="Participante" key="participant">
    <div style={{ display: 'flex', flexDirection: 'column'  }}>
      <Form
        {...layout}
        form={form}
        name="participant-form"
        onFinish={onFinish}
        validateMessages={validateMessages}
        style={{ textAlign: 'center', justifyContent: 'center' }}
      >
        <Row gutter={15} justify="center" align="middle">
          <Col span={15}>
            <Form.Item
              name={['user', 'name']}
              label="Nombre"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nombre del participante" />
            </Form.Item>
          </Col>
          <Col span={15}>
            <Form.Item
              name={['user', 'position']}
              label="Puesto"
              rules={[{ required: true }]}
            >
              <Input placeholder="Puesto del participante" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          {isSignatureEmpty ? (
            <Button type="primary" onClick={handleOpenSignatureModal}>
              Añadir Firma
            </Button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={signatureImage ?? ''}
                alt="Firma"
                style={{ maxWidth: '350px', maxHeight: '150px' }}
              />
              <Button onClick={handleResetSignature}>Resetear Firma</Button>
            </div>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </div>
  </Tabs.TabPane>
  <Tabs.TabPane tab="Invitado" key="guest">
    <div style={{ display: 'flex', flexDirection: 'column', flex: 'none' }}>
      <Form
        {...layout}
        form={form}
        name="guest-form"
        onFinish={onFinish}
        validateMessages={validateMessages}
        style={{ textAlign: 'center', justifyContent: 'center' }}
      >
        <Row gutter={15} justify="center" align="middle">
          <Col span={15}>
            <Form.Item
              name={['user', 'name']}
              label="Nombre"
              rules={[{ required: true }]}
            >
              <Input placeholder="Nombre del invitado" />
            </Form.Item>
          </Col>
          <Col span={15}>
            <Form.Item
              name={['user', 'position']}
              label="Puesto"
              rules={[{ required: true }]}
            >
              <Input placeholder="Puesto del invitado" />
            </Form.Item>
          </Col>
          <Col span={15}>
            <Form.Item
              name={['user', 'company']}
              label="Empresa"
            >
              <Input placeholder="Empresa del invitado" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          {isSignatureEmpty ? (
            <Button type="primary" onClick={handleOpenSignatureModal}>
              Añadir Firma
            </Button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img
                src={signatureImage ?? ''}
                alt="Firma"
                style={{ maxWidth: '350px', maxHeight: '150px', marginBottom: '10px' }}
              />
              <Button onClick={handleResetSignature}>Resetear Firma</Button>
            </div>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </div>
  </Tabs.TabPane>
</Tabs>

      </div>

      {/* Modal para capturar firma */}
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleSaveSignature}
        title="Captura tu Firma"
        width="100vw"
        centered
      >
        <SignatureCanvas
          ref={sigCanvas}
          penColor="black"
          canvasProps={{ width: 1500, height: 500, className: 'sigCanvas' }}
          onEnd={() => setIsSignatureEmpty(false)}
        />
      </Modal>
    </div>
  );
};
