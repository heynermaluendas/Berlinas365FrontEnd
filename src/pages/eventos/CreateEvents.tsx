import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, message, Steps } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConclucionesReunion from './ConclucionesReunion';
import CrearReunion from './CrearReunion';
import { DataActa } from './dataActa';

const { Step } = Steps;

const CreateEvents: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [formData, setFormData] = useState<any>({ cuestionarios: [], nuevareunion: {}, conclusiones: {} });
  const [form] = Form.useForm();
  const conclucionesRef = useRef<any>(null);
  const navigate = useNavigate();
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const handleSaveStepData = (data: any, stepName: string) => {
    console.log(`Guardando datos para ${stepName}:`, data);
    setFormData((prevData) => {
      const updatedData = { ...prevData, [stepName]: data };
      console.log('Estado actualizado:', updatedData);
      return updatedData;
    });
  };

  useEffect(() => {
    if (shouldSubmit) {
      const submitData = async () => {
        try {
          console.log('Enviando datos al servidor...', formData);
          const response = await axios.post('https://berlinas360backend.onrender.com/api/events/', formData);
          console.log('Respuesta del servidor:', response);
          if (response.status === 200 || response.status === 201) {
            message.success('Datos enviados correctamente');
            navigate('/revisar');
          } else {
            throw new Error(`Error en la respuesta del servidor: ${response.statusText}`);
          }
        } catch (error) {
          if (error.response) {
            console.error('Error de respuesta:', error.response.data);
            console.error('Código de estado:', error.response.status);
            console.error('Encabezados:', error.response.headers);
          } else if (error.request) {
            console.error('Error en la solicitud:', error.request);
          } else {
            console.error('Error', error.message);
          }
          message.error(`Error al guardar los datos: ${error.message}`);
        }
      };
      submitData();
      setShouldSubmit(false);
    }
  }, [shouldSubmit, formData, navigate]);

  const handleFinalSubmit = async () => {
    try {
      if (conclucionesRef.current) {
        console.log('Obteniendo datos de conclusiones...');
        const conclusionData = await conclucionesRef.current.submitFinalData();
        console.log('Datos de conclusiones:', conclusionData);
        setFormData((prevData) => ({
          ...prevData,
          conclusiones: conclusionData,
        }));
      }

      setShouldSubmit(true);
    } catch (error) {
      console.error('Error en la obtención de conclusiones:', error);
      message.error(`Error al obtener conclusiones: ${error.message}`);
    }
  };

  const steps = [
    {
      title: 'Nueva reunión',
      content: (
        <CrearReunion
          onSave={(data: any) => {
            console.log('Datos recibidos en CrearReunion:', data);
            handleSaveStepData(data, 'nuevareunion');
          }}
          form={form}
        />
      ),
    },
    {
      title: 'Acta de reunion',
      content: (
        <DataActa
          id="dataActaId"
          onSave={async (data: any) => {
            console.log('Datos recibidos en onSave desde DataActa:', data);
            await handleSaveStepData(data, 'cuestionarios');
          }}
          onButtonClick={handleFinalSubmit}
        />
      ),
    },
    {
      title: 'Conclusiones',
      content: (
        <ConclucionesReunion
          onDataSubmit={(data: any) => {
            console.log('Datos recibidos en ConclucionesReunion:', data);
            handleSaveStepData(data, 'conclusiones');
          }}
          ref={conclucionesRef}
        />
      ),
    },
  ];

  const next = async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue();
      console.log('Datos del formulario en el paso actual:', formValues);
      handleSaveStepData(formValues, steps[currentStep].title.toLowerCase().replace(' ', ''));
      setCurrentStep((prevStep) => prevStep + 1);
      form.resetFields();
    } catch (error) {
      console.error('Error en la validación:', error);
      message.error('Error en la validación del formulario. Por favor, corrige los errores e intenta nuevamente.');
    }
  };

  const prev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div style={{ maxWidth: '100%', minWidth: '70%', margin: '20px auto' }}>
      <Steps progressDot current={currentStep}>
        {steps.map((step, index) => (
          <Step key={index} title={step.title} />
        ))}
      </Steps>
      <div className="steps-content" style={{ marginTop: '16px', marginBottom: '16px' }}>
        {steps[currentStep].content}
      </div>
      <div className="steps-action" style={{ textAlign: 'center' }}>
        {currentStep > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={prev}>
            Anterior
          </Button>
        )}
        {currentStep < steps.length - 1 && (
          <Button type="primary" onClick={next}>
            Siguiente
          </Button>
        )}
        {currentStep === steps.length - 1 && (
          <Button type="primary" onClick={handleFinalSubmit}>
            Enviar Datos
          </Button>
        )}
      </div>
    </div>
  );
};

export default CreateEvents;
