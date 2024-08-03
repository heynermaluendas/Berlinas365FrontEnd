import { Button, Form, message, Steps } from 'antd';
import axios from 'axios';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConclucionesReunion from '../eventos/ConclucionesReunion';
import CrearReunion from '../eventos/CrearReunion';

const { Step } = Steps;

const Welcome: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  // const [stopCapture, setStopCapture] = useState<number>(0);
  const [formData, setFormData] = useState<any>({ cuestionarios: [] });
  const [form] = Form.useForm();
  const conclucionesRef = useRef<any>(null);
  const navigate = useNavigate(); // Hook para redireccionar

  const handleSaveStepData = (data: any, stepName: string) => {
    if (stepName === 'cuestionario') {
      setFormData((prevData) => ({
        ...prevData,
        cuestionarios: [...prevData.cuestionarios, data],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [stepName]: data,
      }));
    }
  };

  const handleFinalSubmit = async () => {
    try {
      if (conclucionesRef.current) {
        await conclucionesRef.current.submitFinalData(); // Wait for conclusions to be processed
      }

      await axios.post('http://localhost:3003/formulario', formData);
      message.success('Datos enviados correctamente');

      // Redirigir a la página de "Revisar"
      navigate('/revisar');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      message.error('Error al guardar los datos');
    }
  };

  const steps = [
    {
      title: 'Nueva reunion',
      content: (
        <CrearReunion
          onSave={(data: any) => handleSaveStepData(data, 'crearReunion')}
          form={form}
        />
      ),
    },
    // {
    //   title: 'Registro de asistencia',
    //   content: (
    //     <Cuestionario
    //       stopCapture={setStopCapture}
    //       onSave={(data: any) => handleSaveStepData(data, 'cuestionario')}
    //     />
    //   ),
    // },
    {
      title: 'Conclusiones',
      content: (
        <ConclucionesReunion
          onDataSubmit={(data: any) => handleSaveStepData(data, 'conclusiones')}
          ref={conclucionesRef}
        />
      ),
    },
  ];

  const next = async () => {
    try {
      await form.validateFields();
      const formValues = form.getFieldsValue();
      handleSaveStepData(formValues, steps[currentStep].title.toLowerCase().replace(' ', ''));
      setCurrentStep((prevStep) => prevStep + 1);
      form.resetFields();
    } catch (error) {
      console.error('Error en la validación:', error);
    }
  };

  const prev = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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

export default Welcome;
