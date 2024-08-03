import { CameraOutlined, DeleteTwoTone, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row, Space } from 'antd';
import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const ConclucionesReunion: React.FC<{ onDataSubmit: (data: any) => void }> = ({ onDataSubmit }) => {
  const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 },
  };

  const [concluciones, setConcluciones] = useState<{
    imagen: { type: string; src: string }[];
    conclusion: string;
  }>({
    imagen: [],
    conclusion: '',
  });
  const [form] = Form.useForm(); // Use Form.useForm to access form methods
  const webcamRef = useRef<any>(null);
  const fileInputRef = useRef<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [facingMode, setFacingMode] = useState('user');

  const toggleFacingMode = () => {
    setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
  };

  const capture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setConcluciones((prevConcluciones) => ({
      ...prevConcluciones,
      imagen: [...prevConcluciones.imagen, { type: 'captured', src: imageSrc }],
    }));
    setModalVisible(false);
  };

  const handleUploadButtonClick = (e: any) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result as string;

        const imageExists = concluciones.imagen.some((image) => image.src === imageSrc);
        if (!imageExists) {
          setConcluciones((prevConcluciones) => ({
            ...prevConcluciones,
            imagen: [...prevConcluciones.imagen, { type: 'uploaded', src: imageSrc }],
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = null; // Clear the input value to allow re-upload of the same file
  };

  const handleDeleteImage = (index: number) => {
    setConcluciones((prevConcluciones) => {
      const updatedImages = [...prevConcluciones.imagen];
      updatedImages.splice(index, 1);
      return {
        ...prevConcluciones,
        imagen: updatedImages,
      };
    });
  };

  const onFinish = (values: any) => {
    message.success('Conclusiones guardadas correctamente');
    const formData = {
      conclusion: values.conclusion,
      images: concluciones.imagen.filter((img) => img.src.trim() !== ''),
    };

    onDataSubmit(formData);

    // Reset form and clear images and conclusion
    form.resetFields();
    setConcluciones({
      imagen: [],
      conclusion: '',
    });
  };

  const WhiteDeleteIcon = () => <DeleteTwoTone twoToneColor="black" />;

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
          Fotos y Conclusiones
        </div>
        <Form
          {...layout}
          name="nest-messages"
          form={form}
          onFinish={onFinish}
          style={{ textAlign: 'center', justifyContent: 'center' }}
          labelAlign="top"
        >
          <Row justify="center" gutter={16} style={{ marginBottom: '1rem' }}>
            <Col xs={24} sm={20}>
              <Form.Item label="Fotos" style={{ textAlign: 'center' }}>
                <>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      marginBottom: '16px',
                    }}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      onClick={() => fileInputRef.current.click()}
                      style={{ width: '40%', margin: '8px' }}
                    >
                      Subir Foto
                    </Button>
                    <Button
                      icon={<CameraOutlined />}
                      onClick={() => setModalVisible(true)}
                      style={{ width: '40%', margin: '8px' }}
                    >
                      Tomar Foto
                    </Button>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {concluciones.imagen.map((image, index) => (
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
                    ref={fileInputRef}
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
                      videoConstraints={{
                        facingMode,
                      }}
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
          </Row>
          <Row justify="center" style={{ marginBottom: '1rem' }}>
            <Col xs={24} sm={16}>
              <Form.Item
                label="Conclusiones"
                name="conclusion"
                rules={[{ required: true, message: 'Por favor ingrese las conclusiones' }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="Escribe las conclusiones de la reunión aquí"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="center" align="middle">
            <Col xs={24} sm={16}>
              <Form.Item>
                <Space style={{ display: 'flex', justifyContent: 'center' }}>
                  <Button type="primary" htmlType="submit">
                    Finalizar
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default ConclucionesReunion;
