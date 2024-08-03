import '@/eventos/Cuestionario.css';
import '@/eventos/tabla.scss';
import {
  CameraOutlined,
  DeleteTwoTone,
  ReloadOutlined,
  SmileOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { Button, Col, Form, Input, InputNumber, message, Modal, Row } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Webcam from 'react-webcam';

export const Cuestionario: React.FC<{
  id: string;
  onSave: (formData: any) => void;
  stopCapture: React.Dispatch<React.SetStateAction<() => void>>;
}> = ({ onSave, stopCapture }) => {
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
  const [isCapturing, setIsCapturing] = useState(false);
  const [isComponentOpen, setIsComponentOpen] = useState(true); // Nuevo estado
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const endpoint = 'http://localhost:3003/formulario'; // Cambia esto a tu endpoint

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

  const handleUploadButtonClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    console.log('Files selected:', files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        console.log('Image source:', imageSrc);

        const imageExists = images.some((image) => image.src === imageSrc);
        console.log('Image exists:', imageExists);

        if (!imageExists) {
          setImages((prevImages) => {
            const updatedImages = [...prevImages, { type: 'uploaded', src: imageSrc }];
            console.log('Images after update:', updatedImages);
            return updatedImages;
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDeleteImage = (index: number) => {
    setImages((prevImages) => {
      const updatedImages = [...prevImages];
      updatedImages.splice(index, 1);
      return updatedImages;
    });
  };

  const onFinish = (values: any) => {
    const filteredImages = images.filter((img) => img.src.trim() !== '');
    const signatureImage = sigCanvas.current?.isEmpty()
      ? ''
      : sigCanvas.current?.getTrimmedCanvas().toDataURL();

    if (signatureImage && !filteredImages.some((img) => img.type === 'signature')) {
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

  const WhiteDeleteIcon = () => <DeleteTwoTone twoToneColor="black" />;

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
    // When CuestionarioId mounts, set the stopCapture function
    stopCapture(() => stopCapturingPhotos);

    return () => {
      // When CuestionarioId unmounts, also stop capturing photos
      stopCapturingPhotos();
      setIsComponentOpen(false); // Indica que el componente se cerró
    };
  }, [stopCapture]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div
        className="important-border"
        style={{
          maxWidth: 800,
          width: '100%',
          padding: '0 16px',
          border: '1px solid',
          borderRadius: '20px',
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: '1.5rem',
            marginBottom: '1rem',
            textAlign: 'center',
            marginTop: '10px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Button
              icon={<SmileOutlined style={{ fontSize: '40px' }} />}
              onClick={() => setIsCapturing(!isCapturing)}
              style={{
                marginBottom: '10px',
                height: '50px',
                width: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0, // Elimina el padding para que el ícono esté completamente centrado
              }}
            >
              {/* El contenido del botón está vacío, así que no es necesario poner nada aquí */}
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {isCapturing && (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                style={{
                  borderRadius: '50%', // Hace que el contorno sea ovalado
                  objectFit: 'cover', // Asegura que la imagen cubra todo el espacio del contenedor
                  width: '300px', // Ajusta el ancho de la cámara
                  height: '400px', // Ajusta la altura de la cámara
                  marginTop: '10px',
                }}
              />
            )}
            Formulario
          </div>
        </div>
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
              <Form.Item label="Fotos" style={{ textAlign: 'center' }}>
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '16px',
                    }}
                  >
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
                      <div
                        key={index}
                        style={{
                          position: 'relative',
                          margin: '4px',
                          width: '100px',
                          height: '50px',
                        }}
                      >
                        <img
                          src={image.src}
                          alt={`Foto ${index}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: '5px',
                          }}
                        />
                        <Button
                          type="link"
                          icon={<WhiteDeleteIcon />}
                          onClick={() => handleDeleteImage(index)}
                          style={{
                            position: 'absolute',
                            top: '1px',
                            right: '1px',
                            backgroundColor: 'white',
                            width: '18px',
                            height: '18px',
                            border: '1px solid black',
                            borderRadius: '6px',
                          }}
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
                    <Button
                      onClick={toggleFacingMode}
                      icon={<ReloadOutlined />}
                      style={{ marginTop: '8px' }}
                    >
                      Cambiar Cámara
                    </Button>
                  </Modal>
                </>
              </Form.Item>
            </Col>
            <Col xs={24} sm={11}>
              <Form.Item
                label="Firma"
                style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}
              >
                <div
                  style={{
                    border: '1px solid gray',
                    padding: '5px',
                    display: 'inline-block',
                    position: 'relative',
                  }}
                >
                  <SignatureCanvas
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{ width: 340, height: 150, className: 'sigCanvas' }}
                    onBegin={() => setIsSignatureEmpty(false)}
                    onEnd={() => setIsSignatureEmpty(sigCanvas.current?.isEmpty() ?? true)}
                  />

                  <div style={{ position: 'absolute', bottom: '-25px', left: '0' }}>
                    <Button
                      type="link"
                      onClick={handleResetSignature}
                      style={{ padding: '0', margin: '0' }}
                      disabled={isSignatureEmpty}
                    >
                      Borrar Firma
                    </Button>
                  </div>
                </div>
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
