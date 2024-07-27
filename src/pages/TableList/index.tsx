import React, { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Input } from 'antd';
import { Tabla } from '../componentesPropios/TablaSisi';
import ExportToExcel from './ExportToExcel';

const tabList = [
  {
    key: 'siniestro',
    tab: 'Siniestro',
  },
  {
    key: 'administrativo',
    tab: 'Administrativo',
  },
  {
    key: 'funcionamiento',
    tab: 'Funcionamiento',
  },
  {
    key: 'vehiculos',
    tab: 'Vehiculos',
  },
];

const Search = () => {
  const [activeTabKey, setActiveTabKey] = useState('siniestro');
  const [searchValue, setSearchValue] = useState('');
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urls = [
          'http://localhost:3001/siniestro',
          'http://localhost:3001/administrativo',
          'http://localhost:3001/funcionamiento',
          'http://localhost:3001/vehiculos'
        ];

        const responses = await Promise.all(urls.map(url => fetch(url)));
        const jsonResponses = await Promise.all(responses.map(response => response.json()));
        const combinedData = jsonResponses.reduce((acc, data) => [...acc, ...data], []);

        setUsers(combinedData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredUsers = users.filter(user =>
    user.indicadores.toLowerCase().includes(search)
  );

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  const renderContent = () => {
    switch (activeTabKey) {
      case 'siniestro':
        return <Tabla searchQuery={search} baseURL="http://localhost:3001/siniestro" />;
      case 'administrativo':
        return <Tabla searchQuery={search} baseURL="http://localhost:3001/administrativo" />;
      case 'funcionamiento':
        return <Tabla searchQuery={search} baseURL="http://localhost:3001/funcionamiento" />;
      case 'vehiculos':
        return <Tabla searchQuery={search} baseURL="http://localhost:3001/vehiculos" />;
      default:
        return null;
    }
  };
   
  

  return (
    <PageContainer
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
          <div style={{ marginLeft: 20 }}>
            <ExportToExcel data={filteredUsers} fileName="datos_exportados" />
          </div>
        </div>
      }
      tabList={tabList}
      tabActiveKey={activeTabKey}
      onTabChange={handleTabChange}
      style={{ userSelect: 'none' }}
    >
      {renderContent()}
    </PageContainer>
  );
};

export default Search;

 