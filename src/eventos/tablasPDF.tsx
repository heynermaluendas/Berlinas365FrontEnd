import { FilePdfFilled, PlusOutlined, SettingFilled } from '@ant-design/icons';
import { Button, Modal, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CuestionarioId } from './CuestionarioId';
import Settingstable from './ajustes';
import GenerarPDF from './pdfGenerate';
import WordExporter from './wordDouloap';

const TablasPDF = () => {
  const [dataSource, setDataSource] = useState([]);
  const [pdfId, setPdfId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [stopCapture, setStopCapture] = useState(() => {});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3003/formulario');
        if (response.data && Array.isArray(response.data)) {
          const formattedData = response.data.map((item) => ({
            key: item.id,
            reuniones: item.nuevareunion ? item.nuevareunion.nombre : 'No disponible',
            fecha:
              item.nuevareunion && item.nuevareunion.fecha
                ? new Date(item.nuevareunion.fecha).toLocaleDateString()
                : 'No disponible',
            asistir: '',
            pdf: '',
            ajustes: '',
            word: '',
          }));
          setDataSource(formattedData);
        } else {
          console.error('Invalid data structure:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const showModal = (id) => {
    setSelectedId(id);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    stopCapture(); // Stop capturing photos when the modal is closed
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    stopCapture(); // Stop capturing photos when the modal is closed
  };

  const showModal1 = (id) => {
    setSelectedId(id);
    const selected = dataSource.find((item) => item.key === id);
    setSelectedData(selected); // Set the selected data to pass to Settingstable
    setIsModalVisible1(true);
  };

  const handleOk1 = () => {
    setIsModalVisible1(false);
  };

  const handleCancel1 = () => {
    setIsModalVisible1(false);
  };

  const generatePDF = (id) => {
    setPdfId(id);
  };

  const generateWordContent = (id) => {
    const selectedData = dataSource.find((item) => item.key === id);
    if (selectedData) {
      const data = [
        { text: `Reunión: ${selectedData.reuniones}`, bold: true },
        { text: `Fecha: ${selectedData.fecha}` },
        { text: '\n', newLine: true },
        // Puedes agregar más contenido aquí basado en `selectedData`
      ];
      return data;
    }
    return [];
  };

  const handleSave = async (formData) => {
    try {
      await axios.post('http://localhost:3003/update-formulario', formData);
      const updatedDataSource = dataSource.map((item) =>
        item.key === formData.id ? { ...item, ...formData } : item,
      );
      setDataSource(updatedDataSource);
      console.log('Form data saved:', formData);
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const columns = [
    {
      title: 'Reuniones',
      dataIndex: 'reuniones',
      key: 'reuniones',
    },
    {
      title: 'Fecha',
      dataIndex: 'fecha',
      key: 'fecha',
    },
    {
      title: 'Asistir',
      dataIndex: 'asistir',
      width: 50,
      key: 'asistir',
      render: (text, record) => (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal(record.key)}
        ></Button>
      ),
    },
    {
      title: 'PDF',
      dataIndex: 'pdf',
      width: 50,
      key: 'pdf',
      render: (text, record) => (
        <Button type="primary" icon={<FilePdfFilled />} onClick={() => generatePDF(record.key)} />
      ),
    },
    {
      title: 'Word',
      dataIndex: 'word',
      width: 50,
      key: 'word',
      render: (text, record) => (
        <WordExporter id={record.key} data={generateWordContent(record.key)} />
      ),
    },
    {
      title: 'Ajustes',
      dataIndex: 'ajustes',
      width: 50,
      key: 'ajustes',
      render: (text, record) => (
        <Button type="primary" icon={<SettingFilled />} onClick={() => showModal1(record.key)} />
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={dataSource} />

      <Modal
        style={{ marginTop: '-90px' }}
        title="Ajustes de Reunión"
        visible={isModalVisible1}
        onOk={handleOk1}
        onCancel={handleCancel1}
        width={800}
        footer={null}
      >
        {selectedData && <Settingstable data={selectedData} />}
      </Modal>
      <Modal
        style={{ marginTop: '-90px' }}
        title="Asistir a la reunión"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        {selectedId && (
          <CuestionarioId
            id={selectedId}
            onSave={(formData) => {
              handleSave(formData);
              handleOk(); // Close the modal after saving
            }}
            stopCapture={setStopCapture} // Pass the stopCapture function to CuestionarioId
          />
        )}
      </Modal>

      {pdfId && <GenerarPDF id={pdfId} onSave={handleCancel} />}
    </>
  );
};

export default TablasPDF;
