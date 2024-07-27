import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Input, Button, Image, Space } from 'antd';
import TablasPDF from './componentesPropios/tablasPDF';
interface Formulario {
  id: string;
  user: {
    name: string;
    email: string;
    age: number;
    signature: string | null; // Nuevo campo para la firma, puede ser una URL, base64, etc.
  };
  images: { type: string; src: string }[]; // Definir tipo para las imágenes
}

const Revisar: React.FC = () => {
  const [search, setSearch] = useState('');
  const [formularios, setFormularios] = useState<Formulario[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

   
  const renderContent = () => (
    <TablasPDF/>
  );

  return (
    <PageContainer
      title="Revisar Formularios"
      content={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', userSelect: 'none', padding: '0 20px' }}>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <Input.Search
              value={search}
              onChange={handleSearch}
              type="text"
              placeholder="Buscar"
            />
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
