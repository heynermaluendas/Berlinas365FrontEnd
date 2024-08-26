import React, { useState,useRef } from 'react';
import { Button, Form, Input, message, Modal, Table, DatePicker, Typography ,Row,Col} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined,SignatureOutlined, } from '@ant-design/icons';
import SignatureCanvas from 'react-signature-canvas';
import moment from 'moment';

const { Title } = Typography;

export const DataActa: React.FC<{
  id: string;
  onSave: (formData: any) => Promise<void>;
  stopCapture: React.Dispatch<React.SetStateAction<() => void>>;
  onButtonClick: () => void;
}> = ({ onSave, stopCapture, onButtonClick }) => {
  const [participants, setParticipants] = useState<{ name: string; position: string; signature: string }[]>([]);
  const [guests, setGuests] = useState<{ name: string; position: string; company: string; signature: string }[]>([]);
  const [actions, setActions] = useState<{ action: string; responsible: string; deadline: string }[]>([]);

  const [isParticipantModalVisible, setIsParticipantModalVisible] = useState(false);
  const [isGuestModalVisible, setIsGuestModalVisible] = useState(false);
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);
  const [isSignatureModalVisible, setIsSignatureModalVisible] = useState(false);

  const [editParticipantIndex, setEditParticipantIndex] = useState<number | null>(null);
  const [editGuestIndex, setEditGuestIndex] = useState<number | null>(null);
  const [editActionIndex, setEditActionIndex] = useState<number | null>(null);
  const [currentSignatureIndex, setCurrentSignatureIndex] = useState<number | null>(null);
  const [isEditingGuestSignature, setIsEditingGuestSignature] = useState(false);

  const [mainForm] = Form.useForm(); 
  const [participantForm] = Form.useForm(); 
  const [guestForm] = Form.useForm(); 
  const [actionForm] = Form.useForm(); 
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);

  const handleOpenSignatureModal = (index: number, isGuest: boolean = false) => {
    setCurrentSignatureIndex(index);
    setIsEditingGuestSignature(isGuest);
    setIsSignatureModalVisible(true);
  };

  const handleSaveSignature = () => {
    if (sigCanvas.current && currentSignatureIndex !== null) {
      const signatureDataUrl = sigCanvas.current.toDataURL();
      if (isEditingGuestSignature) {
        const updatedGuests = [...guests];
        updatedGuests[currentSignatureIndex].signature = signatureDataUrl;
        setGuests(updatedGuests);
      } else {
        const updatedParticipants = [...participants];
        updatedParticipants[currentSignatureIndex].signature = signatureDataUrl;
        setParticipants(updatedParticipants);
      }
    }
    setIsSignatureModalVisible(false);
    handleResetSignature();
  };

  const handleResetSignature = () => {
    if (sigCanvas.current) {
      sigCanvas.current.clear();
      setIsSignatureEmpty(true);
    }
  };

  const saveAndReturn = async () => {
    try {
      await mainForm.validateFields();
      const values = mainForm.getFieldsValue();
      const formData = {
        noActa: values.noActa,
        objective: values.objective,
        agenda: values.agenda,
        desarrollo: values.desarrollo,
        participants,
        guests,
        actions,
        type:'actaReunion'
      };
      await onSave(formData);
      message.success('Datos guardados correctamente');
    } catch (error) {
      message.error('Error al guardar los datos');
      console.error('Validation Failed:', error);
    }
  };

  const addParticipant = () => {
    setEditParticipantIndex(null); 
    participantForm.resetFields(); 
    setIsParticipantModalVisible(true);
  };

  const handleAddOrEditParticipant = (values: { name: string; position: string }) => {
    if (editParticipantIndex !== null) {
      const updatedParticipants = [...participants];
      updatedParticipants[editParticipantIndex] = { ...values, signature: updatedParticipants[editParticipantIndex].signature || '' };
      setParticipants(updatedParticipants);
    } else {
      setParticipants([...participants, { ...values, signature: '' }]);
    }
    setIsParticipantModalVisible(false);
    participantForm.resetFields(); 
  };

  const editParticipant = (index: number) => {
    setEditParticipantIndex(index);
    participantForm.setFieldsValue(participants[index]);
    setIsParticipantModalVisible(true);
  };

  const deleteParticipant = (index: number) => {
    Modal.confirm({
      title: 'Confirmar eliminación',
      content: '¿Estás seguro de que deseas eliminar este participante?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        const updatedParticipants = participants.filter((_, i) => i !== index);
        setParticipants(updatedParticipants);
      },
    });
  };

  const addGuest = () => {
    setEditGuestIndex(null); 
    guestForm.resetFields(); 
    setIsGuestModalVisible(true);
  };

  const handleAddOrEditGuest = (values: { name: string; position: string; company: string }) => {
    if (editGuestIndex !== null) {
      const updatedGuests = [...guests];
      updatedGuests[editGuestIndex] = { ...values, signature: updatedGuests[editGuestIndex].signature || '' };
      setGuests(updatedGuests);
    } else {
      setGuests([...guests, { ...values, signature: '' }]);
    }
    setIsGuestModalVisible(false);
    guestForm.resetFields(); 
  };

  const editGuest = (index: number) => {
    setEditGuestIndex(index);
    guestForm.setFieldsValue(guests[index]);
    setIsGuestModalVisible(true);
  };

  const deleteGuest = (index: number) => {
    Modal.confirm({
      title: 'Confirmar eliminación',
      content: '¿Estás seguro de que deseas eliminar este invitado?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        const updatedGuests = guests.filter((_, i) => i !== index);
        setGuests(updatedGuests);
      },
    });
  };

  const addAction = () => {
    setEditActionIndex(null); 
    actionForm.resetFields(); 
    setIsActionModalVisible(true);
  };

  const handleAddOrEditAction = (values: { action: string; responsible: string; deadline: moment.Moment | null }) => {
    if (editActionIndex !== null) {
      const updatedActions = [...actions];
      updatedActions[editActionIndex] = {
        ...values,
        deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : '',
      };
      setActions(updatedActions);
    } else {
      setActions([
        ...actions,
        {
          ...values,
          deadline: values.deadline ? values.deadline.format('YYYY-MM-DD') : '',
        },
      ]);
    }
    setIsActionModalVisible(false);
    actionForm.resetFields(); 
  };

  const editAction = (index: number) => {
    setEditActionIndex(index);
    const action = actions[index];
    actionForm.setFieldsValue({
      ...action,
      deadline: action.deadline ? moment(action.deadline) : null,
    });
    setIsActionModalVisible(true);
  };

  const deleteAction = (index: number) => {
    Modal.confirm({
      title: 'Confirmar eliminación',
      content: '¿Estás seguro de que deseas eliminar esta acción?',
      okText: 'Sí',
      cancelText: 'No',
      onOk: () => {
        const updatedActions = actions.filter((_, i) => i !== index);
        setActions(updatedActions);
      },
    });
  };

  // Definición de columnas para la tabla de participantes
  const participantColumns = [
    { 
      title: 'Nombre', 
      dataIndex: 'name', 
      key: 'name', 
      width: 350  // Ajusta este valor según lo que necesites
    },
    { 
      title: 'Cargo', 
      dataIndex: 'position', 
      key: 'position', 
      width: 350  // Ajusta este valor según lo que necesites
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 200, // Ajusta este valor según lo que necesites
      render: (_, record, index) => (
        <span>
          <Button icon={<EditOutlined />} onClick={() => editParticipant(index)}></Button>
          <Button icon={<DeleteOutlined />} onClick={() => deleteParticipant(index)}></Button>
          <Button  onClick={() => handleOpenSignatureModal(index)}>Firmar</Button>
        </span>
      ),
    },
  ];
  
  // Definición de columnas para la tabla de invitados
  const guestColumns = [
    { 
      title: 'Nombre', 
      dataIndex: 'name', 
      key: 'name', 
      width: 350  // Ajusta este valor según lo que necesites
    },
    { 
      title: 'Cargo', 
      dataIndex: 'position', 
      key: 'position', 
      width: 200  // Ajusta este valor según lo que necesites
    },
    { 
      title: 'Empresa', 
      dataIndex: 'company', 
      key: 'company', 
      width: 150  // Ajusta este valor según lo que necesites
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 200, // Ajusta este valor según lo que necesites
      render: (_, record, index) => (
        <span>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => editGuest(index)}
            aria-label="Editar invitado"
            style={{ marginRight: 8 }} // Espaciado entre botones
          >
             
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            onClick={() => deleteGuest(index)}
            aria-label="Eliminar invitado"
            style={{ marginRight: 8 }} // Espaciado entre botones
          >
             
          </Button>
          <Button 
            onClick={() => handleOpenSignatureModal(index, true)}
            aria-label="Firmar invitado"
          >
            Firmar
          </Button>
        </span>
      ),
    },
];


  // Nueva tabla para firmantes
  const combinedSignatories = [...participants, ...guests.map(guest => ({ name: guest.name, position: guest.position, signature: guest.signature }))];

  const signatoryColumns = [
    { 
      title: 'Nombre', 
      dataIndex: 'name', 
      key: 'name',
      width: 300 // Ajusta el ancho según sea necesario
    },
    { 
      title: 'Cargo', 
      dataIndex: 'position', 
      key: 'position',
      width: 300 // Ajusta el ancho según sea necesario
    },
    {
      title: 'Firma',
      dataIndex: 'signature',
      key: 'signature',
      width: 300, // Ajusta el ancho según sea necesario
      render: (text) => (
        text ? 
          <img 
            src={text} 
            alt="Firma" 
            style={{ 
              maxWidth: '200px',  // Limita el ancho máximo
              maxHeight: '50px', // Limita el alto máximo
              width: 'auto',      // Ajusta el ancho automáticamente manteniendo la proporción
              height: 'auto'      // Ajusta el alto automáticamente manteniendo la proporción
            }} 
          /> 
          : 'No firmado'
      )
    },
    
  ];
  
  

  const renderParticipantTable = () => (
    <Table
      dataSource={participants.map((participant, index) => ({
        ...participant,
        key: index + 1,
      }))}
      columns={participantColumns}
    />
  );

  const renderGuestTable = () => (
    <Table
      dataSource={guests.map((guest, index) => ({
        ...guest,
        key: index + 1,
      }))}
      columns={guestColumns}
    />
  );

  const renderActionTable = () => (
    <Table
      dataSource={actions.map((action, index) => ({
        ...action,
        key: index + 1,
      }))}
      columns={[
        { 
          title: 'Acción', 
          dataIndex: 'action', 
          key: 'action',
          width: 300  // Ajusta este valor según lo que necesites
        },
        { 
          title: 'Responsable', 
          dataIndex: 'responsible', 
          key: 'responsible',
          width: 300  // Ajusta este valor según lo que necesites
        },
        { 
          title: 'Fecha Límite', 
          dataIndex: 'deadline', 
          key: 'deadline',
          width: 150  // Ajusta este valor según lo que necesites
        },
        {
          title: 'Acciones',
          key: 'actions',
          width: 150, // Ajusta este valor según lo que necesites
          render: (_, record, index) => (
            <span>
              <Button 
                icon={<EditOutlined />} 
                onClick={() => editAction(index)}
                aria-label="Editar acción"
                style={{ marginRight: 8 }} // Espaciado entre botones
              />
              <Button 
                icon={<DeleteOutlined />} 
                onClick={() => deleteAction(index)}
                aria-label="Eliminar acción"
                style={{ marginRight: 8 }} // Espaciado entre botones
              />
            </span>
          ),
        },
      ]}
    />
  );

  // Render para la tabla de firmantes
  const renderSignatoryTable = () => (
    <Table
      dataSource={combinedSignatories.map((signatory, index) => ({
        ...signatory,
        key: index + 1,
      }))}
      columns={signatoryColumns}
    />
  );

  const { TextArea } = Input;

  return (

    <div  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>

   
    <Form 
    form={mainForm}
    style={{  
      maxWidth: '99%',
      width: '1000px',
      padding: '0 16px',
      border: '1px solid',
      borderRadius: '20px',
    }}
    >
     <Row gutter={16}>
  <Col span={10}>
    <Form.Item
      label="No. de Acta"
      name="noActa"
      rules={[{ required: true, message: 'Por favor ingrese el número de acta' }]}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input 
  type="number" 
  placeholder="No. de Acta" 
  min={0}  // Opcional: Establece el valor mínimo permitido
  step={1} // Opcional: Establece el incremento permitido, en este caso, 1
/>

    </Form.Item>
  </Col>
</Row>
<Row gutter={16}>
  <Col span={24}>
    <Form.Item
      label="Objetivo"
      name="objective"
      rules={[{ required: true, message: 'Por favor ingrese el objetivo' }]}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input.TextArea placeholder="Ingrese el objetivo" rows={2} />
    </Form.Item>
  </Col>
</Row>

      

<Row justify="space-between" align="middle">
  <Col flex="auto" style={{ textAlign: 'center' }}>
    <Title level={4} style={{ marginBottom: 0 }}>Participantes</Title>
  </Col>
  <Col flex="none">
    <Button
      type="dashed"
      onClick={addParticipant}
      style={{ marginBottom: 16 }}
      icon={<PlusOutlined />}
    >
    </Button>
  </Col>
</Row>
{renderParticipantTable()}

<Row justify="space-between" align="middle">
  <Col flex="auto" style={{ textAlign: 'center' }}>
    <Title level={4} style={{ marginBottom: 0 }}>Invitados</Title>
  </Col>
  <Col flex="none">
    <Button
      type="dashed"
      onClick={addGuest}
      style={{ marginBottom: 16 }}
      icon={<PlusOutlined />}
    >
    </Button>
  </Col>
</Row>
{renderGuestTable()}


<Row gutter={16}>
  <Col span={24}>
    <Form.Item
      name="agenda"
      rules={[{ required: true, message: 'Por favor ingrese la agenda' }]}
      style={{ marginBottom: '20px' }} // Ajusta el margen inferior según sea necesario
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ marginBottom: '8px' }}>Agenda</span> {/* Etiqueta arriba */}
        <TextArea
          placeholder="Ingrese la agenda"
          rows={4}
        />
      </div>
    </Form.Item>
  </Col>
  <Col span={24}>
    <Form.Item
      name="desarrollo"
      rules={[{ required: true, message: 'Por favor ingrese el desarrollo' }]}
      style={{ marginBottom: '20px' }} // Ajusta el margen inferior según sea necesario
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <span style={{ marginBottom: '8px' }}>Desarrollo</span> {/* Etiqueta arriba */}
        <TextArea
          placeholder="Ingrese el desarrollo"
          rows={4}
        />
      </div>
    </Form.Item>
  </Col>
</Row>


      <Row justify="space-between" align="middle">
  <Col flex="auto" style={{ textAlign: 'center' }}>
    <Title level={4} style={{ marginBottom: 0 }}>Acciones</Title>
  </Col>
  <Col flex="none">
    <Button
      type="dashed"
      onClick={addAction}
      style={{ marginBottom: 16 }}
      icon={<PlusOutlined />}
    >
    </Button>
  </Col>
</Row>
{renderActionTable()}


      {/* Nueva tabla de firmantes */}
      <div style={{ textAlign: 'center' }}>
    <Title level={4}>Firmantes</Title>
    {renderSignatoryTable()}
  </div>
  <Form.Item style={{ textAlign: 'center', marginTop: '20px'}}>
      <Button type="primary" onClick={saveAndReturn}>
        Guardar
      </Button>
    </Form.Item>

      {/* Modal de firma */}
      <Modal
        title="Firma"
        visible={isSignatureModalVisible}
        onOk={handleSaveSignature}
        onCancel={() => setIsSignatureModalVisible(false)}
        okText="Guardar Firma"
        cancelText="Cancelar"
        width="100vw"
        style={{ top: 0, margin: 0 }}
      >
        <div style={{ width: '100vw', height: '80vh', position: 'relative' }}>
          <SignatureCanvas
            ref={sigCanvas}
            canvasProps={{
              width: window.innerWidth * 0.9, // Adjust width
              height: window.innerHeight * 0.7, // Adjust height
               className: 'sigCanvas' }}
            onEnd={() => setIsSignatureEmpty(false)}
          />
          <Button onClick={handleResetSignature} disabled={isSignatureEmpty} style={{ marginTop: 16 }}>
            Limpiar Firma
          </Button>
        </div>
      </Modal>

      {/* Modales de participantes, invitados y acciones */}
      <Modal
        title={editParticipantIndex !== null ? 'Editar Participante' : 'Agregar Participante'}
        visible={isParticipantModalVisible}
        onOk={() => participantForm.submit()}
        onCancel={() => setIsParticipantModalVisible(false)}
        okText={editParticipantIndex !== null ? 'Guardar Cambios' : 'Agregar'}
        cancelText="Cancelar"
      >
        <Form
          form={participantForm}
          onFinish={handleAddOrEditParticipant}
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: 'Por favor ingrese el nombre del participante' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Cargo"
            name="position"
            rules={[{ required: true, message: 'Por favor ingrese el cargo del participante' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editGuestIndex !== null ? 'Editar Invitado' : 'Agregar Invitado'}
        visible={isGuestModalVisible}
        onOk={() => guestForm.submit()}
        onCancel={() => setIsGuestModalVisible(false)}
        okText={editGuestIndex !== null ? 'Guardar Cambios' : 'Agregar'}
        cancelText="Cancelar"
      >
        <Form
          form={guestForm}
          onFinish={handleAddOrEditGuest}
        >
          <Form.Item
            label="Nombre"
            name="name"
            rules={[{ required: true, message: 'Por favor ingrese el nombre del invitado' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Cargo"
            name="position"
            rules={[{ required: true, message: 'Por favor ingrese el cargo del invitado' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Empresa"
            name="company"
            rules={[{ required: true, message: 'Por favor ingrese la empresa del invitado' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editActionIndex !== null ? 'Editar Acción' : 'Agregar Acción'}
        visible={isActionModalVisible}
        onOk={() => actionForm.submit()}
        onCancel={() => setIsActionModalVisible(false)}
        okText={editActionIndex !== null ? 'Guardar Cambios' : 'Agregar'}
        cancelText="Cancelar"
      >
        <Form
          form={actionForm}
          onFinish={handleAddOrEditAction}
        >
          <Form.Item
  label="Acción"
  name="action"
  rules={[{ required: true, message: 'Por favor ingrese la acción' }]}
>
  <TextArea
    placeholder="Ingrese la acción"
    autoSize={{ minRows: 3, maxRows: 10 }} // Ajusta el tamaño automático según el contenido
  />
</Form.Item>

          <Form.Item
            label="Responsable"
            name="responsible"
            rules={[{ required: true, message: 'Por favor ingrese el responsable' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Fecha Límite"
            name="deadline"
            rules={[{ required: true, message: 'Por favor ingrese la fecha límite' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Form>
    </div>
  );
};
