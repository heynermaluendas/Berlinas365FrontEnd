import { SmileOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';

const PhotoCapture: React.FC = () => {
  const [isCapturing, setIsCapturing] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const intervalId = useRef<NodeJS.Timeout | null>(null);
  const endpoint = 'https://berlinas360backend.onrender.com/api/events/'; // Cambia esto a tu endpoint

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
    if (isCapturing) {
      intervalId.current = setInterval(() => {
        capturePhoto();
      }, 2000);
    } else {
      if (intervalId.current) clearInterval(intervalId.current);
    }

    // Cleanup on component unmount
    return () => {
      if (intervalId.current) clearInterval(intervalId.current);
    };
  }, [isCapturing]);

  return (
    <div>
      <Button
        icon={<SmileOutlined style={{ fontSize: '40px' }} />}
        onClick={() => setIsCapturing(!isCapturing)}
        style={{ marginBottom: '10px' }}
      >
        {isCapturing ? 'Detener Captura' : 'Reconocimiento'}
      </Button>

      {isCapturing && (
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="300px"
          height="auto"
          style={{ borderRadius: '10px' }}
        />
      )}
    </div>
  );
};

export default PhotoCapture;
