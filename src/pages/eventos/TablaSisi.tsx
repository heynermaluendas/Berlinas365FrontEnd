import './Cuestionario.css';
import './tabla.scss';
import { Input, Table } from 'antd';
import { useEffect, useState } from 'react';

const normalizeString = (str) => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const Tabla = ({ searchQuery, data }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [artista, setArtista] = useState({
    id: '',
    variable: '',
    indicadores: '',
    fecha: '',
    valor: '',
    dato: '',
  });

  useEffect(() => {
    // Filtrar los datos según la búsqueda
    if (searchQuery) {
      const filtered = data.filter((item) =>
        normalizeString(item.indicadores)
          .toLowerCase()
          .includes(normalizeString(searchQuery).toLowerCase()),
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchQuery, data]);

  const handleDoubleClick = (record) => {
    setArtista({ ...record });
    setEditingKey(record.id);
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    setArtista({ ...artista, valor: value });
  };

  const handleSave = () => {
    try {
      // Simulación de actualización de datos locales
      const updatedData = data.map((item) =>
        item.id === artista.id ? { ...item, valor: artista.valor } : item,
      );
      setFilteredData(updatedData);
      setEditingKey('');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const columns = [
    {
      title: 'Variable',
      dataIndex: 'variable',
      key: 'variable',
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'center', cursor: 'default', userSelect: 'none' }}>{text}</div>
      ),
    },
    {
      title: 'Indicadores',
      dataIndex: 'indicadores',
      key: 'indicadores',
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'left', paddingLeft: 8, userSelect: 'none', cursor: 'default' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'center', cursor: 'default', userSelect: 'none' }}>{text}</div>
      ),
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
      key: 'valor',
      align: 'center',
      render: (text, record) => {
        const editable = record.id === editingKey;
        return editable ? (
          <Input
            value={artista.valor}
            onChange={handleInputChange}
            onPressEnter={handleSave}
            onBlur={handleSave}
            autoFocus
            style={{
              width: '100px',
              height: '32px',
              textAlign: 'center',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              boxShadow: 'none',
              padding: 0,
              margin: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: '100px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              border: 'none',
              background: 'transparent',
              outline: 'none',
              boxShadow: 'none',
              padding: 0,
              margin: '0 auto',
            }}
            onClick={() => handleDoubleClick(record)}
          >
            {text || '--'}
          </div>
        );
      },
    },
    {
      title: 'Dato',
      dataIndex: 'dato',
      key: 'dato',
      align: 'center',
      render: (text) => (
        <div style={{ textAlign: 'center', cursor: 'default', userSelect: 'none' }}>{text}</div>
      ),
    },
  ];

  return (
    <div style={{ padding: 0 }} className="no-padding-table">
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        style={{ textAlign: 'center', cursor: 'default', userSelect: 'none' }}
      />
    </div>
  );
};
