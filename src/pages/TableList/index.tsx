import ExportToExcel from '../eventos/ExportToExcel';
import { PageContainer } from '@ant-design/pro-components';
import { Input } from 'antd';
import { useEffect, useState } from 'react';
import { Tabla } from '../eventos/TablaSisi';

// Importa el archivo JSON local
import dataJson from './db.json'; // Asegúrate de que la ruta sea correcta

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
  const [search, setSearch] = useState('');
  const [data, setData] = useState({
    siniestro: [],
    administrativo: [],
    funcionamiento: [],
    vehiculos: [],
  });

  useEffect(() => {
    const { siniestro, administrativo, funcionamiento, vehiculos } = dataJson;
    setData({
      siniestro,
      administrativo,
      funcionamiento,
      vehiculos,
    });
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredData = (category) =>
    data[category].filter((item) => item.indicadores.toLowerCase().includes(search));

  const handleTabChange = (key) => {
    setActiveTabKey(key);
  };

  const renderContent = () => {
    const filteredCategoryData = filteredData(activeTabKey);
    return <Tabla data={filteredCategoryData} />;
  };

  return (
    <PageContainer
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
          <div style={{ marginLeft: 20 }}>
            <ExportToExcel data={filteredData(activeTabKey)} fileName="datos_exportados" />
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
