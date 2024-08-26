import { PageContainer } from '@ant-design/pro-components';
import React, { useState } from 'react';
import WordForm from './eventos/boton1';
const documentos: React.FC = () => {
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value.toLowerCase());
  };

  const renderContent = () => 
  
    <>

    
    <WordForm />
    </>
  
  ;

  return (
    <PageContainer
    >
      {renderContent()}
    </PageContainer>
  );
};

export default documentos;
