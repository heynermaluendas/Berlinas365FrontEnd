import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Table, message } from 'antd';
import { TableOutlined } from '@ant-design/icons'; // Importa el ícono

const MyTinyMCEEditor = () => {
  const [content, setContent] = useState('');
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [tableRows, setTableRows] = useState(2);
  const [tableCols, setTableCols] = useState(3);
  const [shouldInsertTable, setShouldInsertTable] = useState(false);
  const [selectedCells, setSelectedCells] = useState({ rows: 0, cols: 0 });
  const editorRef = useRef(null);

  useEffect(() => {
    if (shouldInsertTable) {
      insertTable();
      setShouldInsertTable(false);
    }
  }, [shouldInsertTable, tableRows, tableCols]);

  const handleChange = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  const insertTable = () => {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) {
      message.warning('Please select a location in the editor where you want to insert the table.');
      return;
    }

    const range = selection.getRangeAt(0);
    let tableHtml = `<table border="0" style="width:100%; border-collapse: separate; border-spacing: 1px;">`;
    for (let i = 0; i < tableRows; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < tableCols; j++) {
        tableHtml += `<td contenteditable="true" style="width:11px; height:11px; text-align:center; vertical-align:middle; background-color: ${i < selectedCells.rows && j < selectedCells.cols ? 'lightblue' : 'transparent'}; padding: 0; margin: 0; border: 1px solid black;">Row ${i + 1}, Cell ${j + 1}</td>`;
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</table>';

    range.deleteContents();
    range.insertNode(document.createRange().createContextualFragment(tableHtml));
    handleChange();
    setShowTableSelector(false);
  };

  const removeTable = () => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedNode = range.startContainer.parentNode;
      if (selectedNode.tagName === 'TABLE') {
        selectedNode.remove();
      }
    }
  };

  const showTableSelectorBox = () => {
    setShowTableSelector(true);
  };

  const handleCellClick = (rows, cols) => {
    setTableRows(rows);
    setTableCols(cols);
    setSelectedCells({ rows, cols });
    setShowTableSelector(false);
    setShouldInsertTable(true);
  };

  const handleMouseEnter = (rows, cols) => {
    setSelectedCells({ rows, cols });
  };

  const handleModalCancel = () => {
    setShowTableSelector(false);
    setSelectedCells({ rows: 0, cols: 0 });
  };

  const generateTableData = () => {
    let data = [];
    for (let i = 0; i < 11; i++) { // Cambiado a 11 para que el total sea 11x11
      data.push({
        key: i,
        ...Array.from({ length: 11 }, (_, j) => ({
          col: j + 1
        }))
      });
    }
    return data;
  };

  const columns = Array.from({ length: 11 }, (_, i) => ({
    title: '', // Se ha eliminado el texto del título de la columna
    dataIndex: i,
    key: i,
    render: (text, record) => (
      <Button
        type="link"
        style={{
          display: 'block',
          width: '15px', // Ancho de las celdas
          height: '15px', // Altura de las celdas
          backgroundColor:
            i < selectedCells.cols && record.key < selectedCells.rows
              ? 'lightblue'
              : 'transparent',
          border: '1px solid black',
          margin: '0', // Elimina el margen
          padding: '0', // Elimina el padding
          lineHeight: '0px', // Ajusta el lineHeight al tamaño del cuadro
          textAlign: 'center',
          verticalAlign: 'middle', // Centra el contenido verticalmente
          cursor: 'pointer',
          boxSizing: 'border-box', // Incluye el borde en el tamaño del botón
          borderRadius: '0' // Asegura que los botones sean cuadrados eliminando el borde redondeado
        }}
        onClick={() => handleCellClick(record.key + 1, i + 1)}
        onMouseEnter={() => handleMouseEnter(record.key + 1, i + 1)}
        onMouseLeave={() => handleMouseEnter(0, 0)} // Limpiar la selección al salir
      >
      </Button>
    )
  }));

  const calculateSelectionPercentage = () => {
    const totalCells = 121; // Cambiado a 11x11
    const selectedCellsCount = selectedCells.rows * selectedCells.cols;
    const percentage = ((selectedCellsCount / totalCells) * 100).toFixed(2);
    return `${percentage}%`;
  };

  return (
    <div>
      <div>
        <Button
          type="primary"
          icon={<TableOutlined />} // Usa el ícono de la tabla
          onClick={showTableSelectorBox}
        />
        <Button type="danger" onClick={removeTable}>Remove Table</Button>
      </div>

      <Modal
        title="Select Table Size"
        visible={showTableSelector}
        onCancel={handleModalCancel}
        footer={null}
        style={{ width: '300px' }} // Ajusta el ancho del modal
      >
       
        <div style={{ overflow: 'auto', display: 'inline-block' }}> {/* Contenedor ajustado */}
          <Table
            columns={columns}
            dataSource={generateTableData()}
            pagination={false}
            bordered={false}
            size="small"
            scroll={{ x: true }}
            style={{
              fontSize: '0', // Oculta los encabezados de columna
              padding: 0,
              
              tableLayout: 'fixed',
              borderCollapse: 'separate',
              borderSpacing: '1px' // Espaciado entre celdas
            }}
          />
        </div>
        <div style={{
             marginBottom: '10px' 
             }}>
            {selectedCells.rows} x {selectedCells.cols}  
        </div>
      </Modal>

      <div
        contentEditable
        style={{ border: '1px solid black', padding: '10px', minHeight: '200px' }}
        onInput={handleChange}
        ref={editorRef}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
};

export default MyTinyMCEEditor;
