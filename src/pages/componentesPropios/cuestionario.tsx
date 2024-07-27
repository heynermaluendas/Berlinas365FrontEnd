import { Button, Modal, Form, Input, InputNumber, Upload, Row, Col,message } from 'antd';
import { DeleteTwoTone, UploadOutlined, CameraOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Webcam from 'react-webcam';
import '@/components/RightContent/tabla.scss';
import '@/components/RightContent/Cuestionario.css';

export const Cuestionario: React.FC<{ onSave: (formData: any) => void }> = ({ onSave }) => {
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
  const form = Form.useForm()[0];
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const webcamRef = useRef<Webcam | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [facingMode, setFacingMode] = useState('user');

  const toggleFacingMode = () => {
    setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const capture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setImages(prevImages => [...prevImages, { type: 'captured', src: imageSrc }]);
    }
    setModalVisible(false);
  };

  const handleUploadButtonClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        const imageExists = images.some(image => image.src === imageSrc);
        if (!imageExists) {
          setImages(prevImages => [...prevImages, { type: 'uploaded', src: imageSrc }]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages(prevImages => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const onFinish = (values: any) => {
    const filteredImages = images.filter(img => img.src.trim() !== '');
    const signatureImage = sigCanvas.current?.isEmpty() ? '' : sigCanvas.current?.getTrimmedCanvas().toDataURL();

    if (signatureImage && !filteredImages.some(img => img.type === 'signature')) {
      filteredImages.push({ type: 'signature', src: signatureImage });
    }
    message.success('Datos guardados correctamente');
    const formData = {
      user: values.user,
      images: filteredImages,
    };

    // Pasar los datos al componente padre sin enviarlos al servidor
    onSave(formData);

    // Limpiar los datos del formulario y estado
    form.resetFields();
    setImages([]);
    setIsSignatureEmpty(true);
    sigCanvas.current?.clear();
  };

  const handleResetSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsSignatureEmpty(true);
    }
  };

  const WhiteDeleteIcon = () => (
    <DeleteTwoTone twoToneColor="black" />
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className='important-border' style={{ maxWidth: 800, width: '100%', padding: '0 16px', border: '1px solid', borderRadius: '20px' }}>
        <div style={{ fontWeight: 700, fontSize: '1.5rem', marginBottom: '1rem', textAlign: 'center', marginTop: '10px' }}>Formulario</div>
        <Form
          {...layout}
          form={form}
          name="nest-messages"
          onFinish={onFinish}
          validateMessages={validateMessages}
          style={{ textAlign: 'center', justifyContent: 'center' }}
        >
          <Row gutter={16} justify="center">
            <Col xs={24} sm={15}>
              <Form.Item
                name={['user', 'name']}
                label="Nombre"
                rules={[{ required: true, message: 'Por favor, ingrese su nombre' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={10}>
              <Form.Item
                name={['user', 'email']}
                label="Email"
                rules={[{ type: 'email', message: 'Ingrese un email válido' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={5} offset={0}>
              <Form.Item
                name={['user', 'age']}
                label="Edad"
                rules={[{ type: 'number', min: 0, max: 99 }]}
                style={{ textAlign: 'left' }}
              >
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16} justify="center">
            <Col xs={24} sm={15}>
              <Form.Item
                label="Fotos"
                style={{ textAlign: 'center' }}
              >
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <Button
                      icon={<UploadOutlined />}
                      onClick={() => document.getElementById('fileInput')?.click()}
                      style={{ width: '48%' }}
                    >
                      Subir Foto
                    </Button>
                    <Button
                      icon={<CameraOutlined />}
                      onClick={() => setModalVisible(true)}
                      style={{ width: '48%' }}
                    >
                      Tomar Foto
                    </Button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {images.map((image, index) => (
                      <div key={index} style={{ position: 'relative', margin: '4px', width: '100px', height: '50px' }}>
                        <img src={image.src} alt={`Foto ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '5px' }} />
                        <Button
                          type="link"
                          icon={<WhiteDeleteIcon />}
                          onClick={() => handleDeleteImage(index)}
                          style={{ position: 'absolute', top: '1px', right: '1px', backgroundColor: 'white', width: '18px', height: '18px', border: '1px solid black', borderRadius: '6px' }}
                        />
                      </div>
                    ))}
                  </div>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleUploadButtonClick(e)}
                    style={{ display: 'none' }}
                  />
                  <Modal
                    title="Tomar Foto"
                    visible={modalVisible}
                    onOk={capture}
                    onCancel={() => setModalVisible(false)}
                    width={800}
                  >
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width="100%"
                      height="100%"
                      videoConstraints={{ facingMode }}
                      style={{ borderRadius: '10px' }}
                    />
                    <Button onClick={toggleFacingMode} icon={<ReloadOutlined />} style={{ marginTop: '8px' }}>
                      Cambiar Cámara
                    </Button>
                  </Modal>
                </>
              </Form.Item>
            </Col>
            <Col xs={24} sm={11}>
              <Form.Item label="Firma" style={{ textAlign: 'left' }}>
                <div style={{ border: '1px solid gray', padding: '5px', display: 'inline-block' }}>
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{ width: 340, height: 150, className: 'sigCanvas' }}
                    onBegin={() => setIsSignatureEmpty(false)}
                    onEnd={() => setIsSignatureEmpty(sigCanvas.current?.isEmpty() ?? true)}
                  />
                </div>
                <Button
                  type="link"
                  onClick={handleResetSignature}
                  style={{ marginTop: '8px', padding: '0' }}
                  disabled={isSignatureEmpty}
                >
                  Borrar Firma
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 0 }}>
            <Button type="primary" htmlType="submit">
              Asistí al evento
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
