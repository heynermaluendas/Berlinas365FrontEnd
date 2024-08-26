import { PlusOutlined, SettingFilled } from '@ant-design/icons';
import { Button, Modal, Table } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { CuestionarioId } from './CuestionarioId';
import Settingstable from './ajustes';
import YourComponent from './paginacion.tsx/wordAndPdf';

const TablasPDF = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isModalVisible1, setIsModalVisible1] = useState<boolean>(false);
  const [stopCapture, setStopCapture] = useState<() => void | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://192.168.0.110:3100/api/events/');
        console.log
        if (response.data && Array.isArray(response.data)) {
          const formattedData = response.data.map((item: any) => ({
            key: item.id_event,
            reuniones: item.form_event && item.form_event[0] && item.form_event[0].event_data
              ? item.form_event[0].event_data.event_name
              : 'No disponible',
            fecha: item.form_event && item.form_event[0] && item.form_event[0].event_data
              ? new Date(item.form_event[0].event_data.event_date).toLocaleDateString()
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

  const showModal = (id_event: string) => {
    setSelectedId(id_event);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    if (stopCapture) stopCapture();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    if (stopCapture) stopCapture();
  };

  const showModal1 = (id_event: string) => {
    setSelectedId(id_event);
    const selected = dataSource.find((item) => item.key === id_event);
    setSelectedData(selected);
    setIsModalVisible1(true);
  };

  const handleOk1 = () => {
    setIsModalVisible1(false);
  };

  const handleCancel1 = () => {
    setIsModalVisible1(false);
  };

  const generateWordContent = (id_event: string) => {
    const selectedData = dataSource.find((item) => item.key === id_event);
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

  const handleSave = async (formData: any) => {
    try {
      await axios.post('http://192.168.0.110:3100/api/events/', formData);
      const updatedDataSource = dataSource.map((item) =>
        item.key === formData.id_event ? { ...item, ...formData } : item,
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
      render: (text: any, record: any) => (
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal(record.key)}
        ></Button>
      ),
    },

    {
      title: 'Word',
      dataIndex: 'word',
      width: 50,
      key: 'word',
      render: (text: any, record: any) => (
        <YourComponent id={record.key} data={generateWordContent(record.key)} />
      ),
    },

    {
      title: 'Ajustes',
      dataIndex: 'ajustes',
      width: 50,
      key: 'ajustes',
      render: (text: any, record: any) => (
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
        width={'80%'}
        footer={null}
      >
        {selectedData && 
        <Settingstable 
          id_event={selectedId!}
          onSave={(formData) => {
            handleSave(formData);
            handleOk1();
          }}
          handleCancel1={handleCancel1}
          stopCapture={setStopCapture}
        />}
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
              handleOk();
            }}
            stopCapture={setStopCapture}
          />
        )}
      </Modal>
    </>
  );
};

export default TablasPDF;
