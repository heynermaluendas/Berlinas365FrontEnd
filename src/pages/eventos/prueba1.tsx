import React, { useState, useEffect, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Button, Col, Form, Input, InputNumber, message, Modal, Row } from 'antd';
const DocumentForm = () => {
   
  const [formData, setFormData] = useState({
    actaNo: '',
    ciudadFecha: '',
    horaInicio: '',
    horaFin: '',
    lugar: '',
    temaCapacitacion: '',
    nombreTrabajador: '',
    cedulaNo: '',
    cargo: '',
    nombreCapacitador: '',
    fecha: '',
    ciudad: '',
    observaciones: '',
    preguntas: '', // Añadido para el textarea de preguntas
    cumplimientoObjetivos: '',
    claridadConceptos: '',
    desarrolloPersonal: '',
    trabajoActual: '',
    conocimientoDominioTema:'',
    habilidadesComunicacion:'',
    capacidadOrientar:'',
    transmisionIdeasConocimientos:'',
    manejoTiempo:'',
    generacionEmpatia:'',
    puntualidad:'',
    materialUsado:'', 
    recursosEmpleados:'', 
    instalaciones:'', 
    aspectosLogisticos:'',  
  });
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const sigCanvas1 = useRef<SignatureCanvas | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
  const [isSignatureEmpty1, setIsSignatureEmpty1] = useState(true);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleSaveSignature = () => {
    if (sigCanvas.current) {
      const signatureDataUrl = sigCanvas.current.toDataURL();
      console.log('Firma guardada:', signatureDataUrl);
    }
    setIsModalVisible(false);
  };

  const handleResetSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsSignatureEmpty(true);
    }
  };

  const handleOpenModal1 = () => {
    setIsModalVisible1(true);
  };

  const handleCloseModal1 = () => {
    setIsModalVisible1(false);
  };

  const handleSaveSignature1 = () => {
    if (sigCanvas1.current) {
      const signatureDataUrl = sigCanvas1.current.toDataURL();
      console.log('Firma 1 guardada:', signatureDataUrl);
    }
    setIsModalVisible1(false);
  };

  const handleResetSignature1 = () => {
    if (sigCanvas1.current) {
      sigCanvas1.current.clear();
      setIsSignatureEmpty1(true);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://berlinas360backend.onrender.com/api/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Datos enviados correctamente');
        setFormData({
          actaNo: '',
          ciudadFecha: '',
          horaInicio: '',
          horaFin: '',
          lugar: '',
          temaCapacitacion: '',
          nombreTrabajador: '',
          cedulaNo: '',
          cargo: '',
          nombreCapacitador: '',
          fecha: '',
          ciudad: '',
          observaciones: '',
          preguntas: '',
          cumplimientoObjetivos: '',
          claridadConceptos: '',
          desarrolloPersonal: '',
          trabajoActual: '',
          conocimientoDominioTema:'',
          habilidadesComunicacion:'',
          capacidadOrientar:'',
          transmisionIdeasConocimientos:'',
          manejoTiempo:'',
          generacionEmpatia:'',
          puntualidad:'', 
          materialUsado:'', 
          recursosEmpleados:'', 
          instalaciones:'', 
          aspectosLogisticos:'',    
        });
      } else {
        alert('Error al enviar los datos');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'white', width: '900px' }}>
          <Section title={<span style={{ fontWeight: 'bold' }}>I. Datos de interés</span>}>
            <InputRow title="Tema de capacitación:" name="temaCapacitacion" value={formData.temaCapacitacion} onChange={handleChange} />
            <InputRow title="Nombre y Apellidos del trabajador:" name="nombreTrabajador" value={formData.nombreTrabajador} onChange={handleChange} />
            <div style={{display:'flex'}}>
              <div  style={{width: '50%'}}>
              <InputRow title="Cargo:" name="cargo" value={formData.cargo} onChange={handleChange} />
              </div>
              <div  style={{width: '50%'}}>
              <InputRow title="Cedula No.:" name="cedulaNo" value={formData.cedulaNo} onChange={handleChange} />
              </div>
            </div>
            <InputRow title="Nombre Capacitador:" name="nombreCapacitador" value={formData.nombreCapacitador} onChange={handleChange} />
            <div style={{display:'flex'}}>
              <div  style={{width: '50%'}}>
            <InputRow title="Fecha:" name="fecha" value={formData.fecha} onChange={handleChange} />
              </div>
              <div  style={{width: '50%'}}>
            <InputRow title="Ciudad:" name="ciudad" value={formData.ciudad} onChange={handleChange} />
              </div>
            </div>
          </Section>

          <Section  title={  <span style={{ fontWeight: 'bold' }}>II. Objetivo</span>}>
            
            <TextRow text="Conocer y evaluar la percepción, pertinencia y calidad de la capacitación y/o entrenamiento, con el fin de llevar a cabo procesos de mejoramiento continuo." />
          </Section>

          <Section  title={  <span style={{ fontWeight: 'bold' }}>III. Preguntas</span>}>
            <TextRow text="Responda cada una de las preguntas descritas a continuación, si es insuficiente el espacio para sus respuestas utilice el respaldo de la hoja." />
            <TextAreaRow name="preguntas" value={formData.preguntas} onChange={handleChange} />
          </Section>

          <Section title={<span style={{ fontWeight: 'bold' }}>IV. Observaciones y/o sugerencias con respecto al tema de capacitación</span>} >

            <TextAreaRow name="observaciones" value={formData.observaciones} onChange={handleChange} />
          </Section>

          <Section title={<span style={{ fontWeight: 'bold' }}>V. Evaluación de la metodología</span>} >

            <TextRow text="Marque una X en la casilla correspondiente según su opinión: E = Excelente, B = Bueno, R = Regular y D = Deficiente" />
            <TableRow
            aspectoEvaluar="Contenido de la capacitación"
              rows={[
                {
                  id: 'cumplimientoObjetivos',
                  text: 'Cumplimiento de los objetivos propuestos',
                  value: formData.cumplimientoObjetivos,
                },
                {
                  id: 'claridadConceptos',
                  text: 'Claridad de conceptos',
                  value: formData.claridadConceptos,
                },
                {
                  id: 'desarrolloPersonal',
                  text: 'La capacitación contribuyó a su desarrollo personal',
                  value: formData.desarrolloPersonal,
                },
                {
                  id: 'trabajoActual',
                  text: 'La capacitación contribuyó a su trabajo actual',
                  value: formData.trabajoActual,
                },
              ]}
              onChange={handleChange}
            />
            <TableRow
  aspectoEvaluar="Desempeño del capacitador"
  rows={[
    {
      id: 'conocimientoDominioTema',
      text: 'Conocimiento y dominio del tema',
      value: formData.conocimientoDominioTema,
    },
    {
      id: 'habilidadesComunicacion',
      text: 'Habilidades de comunicación (Contacto visual, expresión facial y corporal, expresión vocal)',
      value: formData.habilidadesComunicacion,
    },
    {
      id: 'capacidadOrientar',
      text: 'Capacidad para orientar al grupo a los objetivos propuestos',
      value: formData.capacidadOrientar,
    },
    {
      id: 'transmisionIdeasConocimientos',
      text: 'Habilidad para transmitir ideas y conocimientos',
      value: formData.transmisionIdeasConocimientos,
    },
    {
      id: 'manejoTiempo',
      text: 'Manejo del tiempo según la agenda propuesta',
      value: formData.manejoTiempo,
    },
    {
      id: 'generacionEmpatia',
      text: 'Genera empatía y acogida dentro del grupo',
      value: formData.generacionEmpatia,
    },
    {
      id: 'puntualidad',
      text: 'Puntualidad',
      value: formData.puntualidad,
    },
  ]}
  onChange={handleChange}
/>

<TableRow
  aspectoEvaluar="Metodología y Logística"
  rows={[
    {
      id: 'materialUsado',
      text: 'Material usado',
      value: formData.materialUsado,
    },
    {
      id: 'recursosEmpleados',
      text: 'Recursos empleados',
      value: formData.recursosEmpleados,
    },
    {
      id: 'instalaciones',
      text: 'Instalaciones',
      value: formData.instalaciones,
    },
    {
      id: 'aspectosLogisticos',
      text: 'Disposición y uso de aspectos logísticos',
      value: formData.aspectosLogisticos,
    },
  ]}
  onChange={handleChange}
/>
<br />
          <Section title={<span style={{ fontWeight: 'bold' }}>IV. Observaciones y/o sugerencias con respecto a la metodología</span>} >
            <TextAreaRow name="observaciones" value={formData.observaciones} onChange={handleChange} />
          </Section>

          </Section>

          <Section title={<span style={{ fontWeight: 'bold' }}>  Firmas</span>}>
  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
    <div style={{ flex: '1', marginRight: '10px', border: '1px solid #d9d9d9', padding: '10px', height: '200px' }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Firma Asistente</div>
      <div style={{ border: '1px solid #000', height: '100%', width: '100%' }}>
      <div
         
      >
        <Button
           type="primary"
          onClick={handleOpenModal}
          style={{width:'421px',height:'176px'}}
        >
         Firma Asistente
        </Button>

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

      <Modal
  visible={isModalVisible}
  onOk={handleSaveSignature}
  onCancel={handleCloseModal}
  okText="Guardar"
  cancelText="Cancelar"
  style={{ top: 20 }}  // Ajusta la posición vertical del modal
  bodyStyle={{ padding: 0 }}  // Quita el padding del cuerpo del modal
  width={1500}  // Establece el ancho del modal
  footer={null}  // Elimina el footer para tener más control sobre el tamaño
>
  <SignatureCanvas
    ref={sigCanvas}
    penColor="black"
    canvasProps={{ width: 1450, height: 700, className: 'sigCanvas' }}
    onBegin={() => setIsSignatureEmpty(false)}
    onEnd={() => setIsSignatureEmpty(sigCanvas.current?.isEmpty() ?? true)}
  />
  <div style={{ textAlign: 'right', padding: '10px' }}>
    <Button onClick={handleSaveSignature} type="primary" style={{ marginRight: '10px' }}>Guardar</Button>
    <Button onClick={handleCloseModal}>Cancelar</Button>
  </div>
</Modal>


      </div>
      
    </div>
    <div style={{ flex: '1', border: '1px solid #d9d9d9', padding: '10px', height: '200px' }}>
      <div style={{ marginBottom: '10px', fontWeight: 'bold' }}>Firma Capacitador</div>
      <div style={{ border: '1px solid #000', height: '100%', width: '100%' }}>
      <div
        
      >
        <Button
          type="primary"
          onClick={handleOpenModal1}
          style={{width:'421px',height:'176px'}}
        >
          Firmar 2
        </Button>

        <div style={{ position: 'absolute', bottom: '-25px', left: '0' }}>
          <Button
            type="link"
            onClick={handleResetSignature1}
            style={{ padding: '0', margin: '0' }}
            disabled={isSignatureEmpty1}
          >
            Borrar Firma
          </Button>
        </div>
      </div>

      <Modal
        title="Firma 2"
        visible={isModalVisible1}
        onOk={handleSaveSignature1}
        onCancel={handleCloseModal1}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <SignatureCanvas
          ref={sigCanvas1}
          penColor="black"
          canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
          onBegin={() => setIsSignatureEmpty1(false)}
          onEnd={() => setIsSignatureEmpty1(sigCanvas1.current?.isEmpty() ?? true)}
        />
      </Modal>
      </div>
    </div>
  </div>
</Section>
 


          <button type="submit" style={{ marginTop: '20px' }}>Enviar Datos</button>
        </div>
      </form>
    </>
  );
};

const Section = ({ title, children }) => (
  <>
    <div style={{ display: 'flex', border: '1px solid black', height: '25px', backgroundColor: '#e0dad7' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px', boxSizing: 'border-box', backgroundColor: '#e0dad7' }}>
        <h1 style={{ margin: 0, fontSize: '16px' }}>{title}</h1>
      </div>
    </div>
    {children}
    <br />
  </>
);

const InputRow = ({ title, name, value, onChange }) => (
  <div style={{ display: 'flex', border: '1px solid black', height: '25px', backgroundColor: 'white' }}>
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px', boxSizing: 'border-box', backgroundColor: 'white' }}>
      <h1 style={{ margin: 0, fontSize: '16px' }}>{title}</h1>
    </div>
    <div style={{ flex: '1 1 auto', display: 'flex', alignItems: 'center', boxSizing: 'border-box', backgroundColor: 'white' }}>
      <input type="text" name={name} value={value} onChange={onChange} style={{ fontSize: '16px', width: '100%', border: 'none', outline: 'none', backgroundColor: 'white' }} maxLength="60" />
    </div>
  </div>
);

const TextRow = ({ text }) => (
  <div style={{ display: 'flex', border: '1px solid black', height: '50px', backgroundColor: 'white' }}>
    <div style={{ display: 'flex', alignItems: 'center', padding: '0 5px', boxSizing: 'border-box', backgroundColor: 'white' }}>
      <h1 style={{ margin: 0, fontSize: '16px' }}>{text}</h1>
    </div>
  </div>
);

const TextAreaRow = ({ name, value, onChange }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      name={name}
      value={value}
      onChange={onChange}
      style={{
        fontSize: '16px',
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        border: '1px solid black',
        outline: 'none',
        backgroundColor: 'white',
        resize: 'none',
        overflow: 'hidden'
      }}
    />
  );
};

const TableRow = ({ aspectoEvaluar, rows, onChange }) => (
  <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '20px' }}>
    <thead>
      <tr>
        <th colSpan="5" style={{ fontWeight: 'bold', textAlign: 'left', padding: '10px', border: '1px solid black', backgroundColor: '#f2f2f2' }}>
          {aspectoEvaluar}
        </th>
      </tr>
      <tr>
        <th style={thStyle}>Aspectos a Evaluar</th>
        <th style={smallThStyle}>E</th>
        <th style={smallThStyle}>B</th>
        <th style={smallThStyle}>R</th>
        <th style={smallThStyle}>D</th>
      </tr>
    </thead>
    <tbody>
      {rows.map(({ id, text, value }) => (
        <tr key={id}>
          <td style={tdStyle}>{text}</td>
          <td style={smallTdStyle}>
            <input
              type="radio"
              name={id}
              value="E"
              checked={value === 'E'}
              onChange={onChange}
            />
          </td>
          <td style={smallTdStyle}>
            <input
              type="radio"
              name={id}
              value="B"
              checked={value === 'B'}
              onChange={onChange}
            />
          </td>
          <td style={smallTdStyle}>
            <input
              type="radio"
              name={id}
              value="R"
              checked={value === 'R'}
              onChange={onChange}
            />
          </td>
          <td style={smallTdStyle}>
            <input
              type="radio"
              name={id}
              value="D"
              checked={value === 'D'}
              onChange={onChange}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const thStyle = {
  border: '1px solid black',
  padding: '8px',
  textAlign: 'center',
  backgroundColor: '#e0dad7',
};

const smallThStyle = {
  ...thStyle,
  width: '40px', // Ancho de 40px para las casillas E, B, R, D
};

const tdStyle = {
  border: '1px solid black',
  padding: '8px',
  textAlign: 'left',
};

const smallTdStyle = {
  ...tdStyle,
  width: '40px', 
  textAlign: 'center',
};


export default DocumentForm;
//git status
//git add .
//git commit -m "Tu mensaje aquí" --no-verify
//git push origin main


//git pull origin main


