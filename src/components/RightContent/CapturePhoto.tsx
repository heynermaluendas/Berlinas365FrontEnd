import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Button, Modal } from 'antd';
import { UploadOutlined, CameraOutlined, ReloadOutlined, DeleteOutlined } from '@ant-design/icons';

export const CapturePhoto = ({ onCapture }) => {
  const webcamRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState([]);
  const [facingMode, setFacingMode] = useState('user'); // 'user' para cámara frontal, 'environment' para cámara trasera

  // Cambiar entre cámara frontal y trasera
  const toggleFacingMode = () => {
    setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
  };

  // Capturar imagen desde la cámara
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImages(prevImages => [...prevImages, { type: 'captured', src: imageSrc }]);
    onCapture(imageSrc); // Llamar a la función onCapture con la imagen capturada
    setModalVisible(false); // Cerrar el modal después de capturar
  }, [webcamRef, onCapture]);

  // Manejar la subida de imágenes desde archivos
  const handleUploadButtonClick = (e) => {
    const files = Array.from(e.target.files); // Convertir FileList a Array de archivos

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result;

        // Verificar si la imagen ya existe en el estado
        const imageExists = images.some(image => image.src === imageSrc);
        if (!imageExists) {
          setImages(prevImages => [...prevImages, { type: 'uploaded', src: imageSrc }]);
          onCapture(imageSrc); // Llamar a la función onCapture con la imagen subida
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Eliminar una imagen del estado local
  const handleDeleteImage = (index) => {
    setImages(prevImages => {
      const updatedImages = [...prevImages];
      const deletedImage = updatedImages.splice(index, 1)[0];
  
      // Si la imagen fue previamente guardada en la base de datos, maneja la eliminación aquí
      if (deletedImage.type === 'captured') {
        // No se guarda en la base de datos, por lo que no se necesita lógica aquí
      } else if (deletedImage.type === 'uploaded') {
        // No se guarda en la base de datos, por lo que no se necesita lógica aquí
      }
  
      // Asegúrate de actualizar el estado local correctamente
      return updatedImages;
    });
  };
  
  

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
        <Button
          icon={<UploadOutlined />}
          onClick={() => document.getElementById('fileInput').click()}
          style={{ width: '48%' }}
        >
          Subir Foto
        </Button>
        <input
          type="file"
          id="fileInput"
          accept="image/*"
          multiple // Permitir la selección múltiple de archivos
          style={{ display: 'none' }}
          onChange={handleUploadButtonClick}
        />
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
          <div key={`image-${index}`} style={{ marginRight: '10px', marginBottom: '10px', position: 'relative' }}>
            <img
              src={image.src}
              alt={`image-${index}`}
              style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              style={{ position: 'absolute', top: '5px', right: '5px' }}
              onClick={() => handleDeleteImage(index)}
            />
          </div>
        ))}
      </div>
      <Modal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button
            key="reload"
            icon={<ReloadOutlined />}
            onClick={toggleFacingMode}
            style={{ float: 'left', marginTop: '0px', marginLeft: '10px' }}
          />,
          <Button key="back" onClick={() => setModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="capture" type="primary" onClick={capture}>
            Capturar
          </Button>,
        ]}
      >
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={{ facingMode }}
          style={{ borderRadius: '8px', marginBottom: '16px' }}
        />
      </Modal>
    </>
  );
};
