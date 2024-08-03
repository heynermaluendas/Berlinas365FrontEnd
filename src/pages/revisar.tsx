import TablasPDF from '@/eventos/tablasPDF';
import { PageContainer } from '@ant-design/pro-components';
import { Input } from 'antd';
import React, { useState } from 'react';

const Revisar: React.FC = () => {
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const renderContent = () => <TablasPDF />;

  return (
    <PageContainer
      title="Revisar Formularios"
      content={
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            userSelect: 'none',
            padding: '0 20px',
          }}
        >
          <div style={{ flex: 1, textAlign: 'left' }}>
            <Input.Search value={search} onChange={handleSearch} type="text" placeholder="Buscar" />
          </div>
        </div>
      }
      style={{ userSelect: 'none' }}
    >
      {renderContent()}
    </PageContainer>
  );
};

export default Revisar;
