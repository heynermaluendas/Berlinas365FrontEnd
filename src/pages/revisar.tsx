import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Input, Button, Modal } from 'antd';
import TablasPDF from './eventos/tablasPDF';
import CombinedComponent from './eventos/EventCreate';

const Revisar: React.FC = () => {
  const [search, setSearch] = useState('');
  const [isModalVisible1, setIsModalVisible1] = useState<boolean>(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const showModal1 = () => {
    setIsModalVisible1(true);
  };

  const handleOk1 = () => {
    setIsModalVisible1(false);
  };

  const handleCancel1 = () => {
    setIsModalVisible1(false);
  };

  const renderContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Sección superior con búsqueda y botón */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <Input.Search
          value={search}
          onChange={handleSearch}
          placeholder="Buscar"
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          onClick={showModal1}
          style={{ marginLeft: '16px' }} // Espaciado entre el botón y la búsqueda
        >
          Crear Evento
        </Button>
      </div>
      {/* Sección inferior con TablasPDF */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <TablasPDF />
      </div>
    </div>
  );

  return (
    <PageContainer
      title="Revisar Formularios"
      content={renderContent()}
      style={{ userSelect: 'none' }}
    >
      <Modal
      style={{ marginTop: '-90px' }}
        title="Crear Reunión"
        visible={isModalVisible1}
        onOk={handleOk1}
        onCancel={handleCancel1}
        width={'80%'} // Ajusta el ancho del modal según tus necesidades
        footer={null}
      >
        <CombinedComponent />
      </Modal>
    </PageContainer>
  );
};

export default Revisar;
