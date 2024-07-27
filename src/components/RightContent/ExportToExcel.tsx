import React from 'react';
import { Button } from 'antd';
import * as XLSX from 'xlsx';

interface ExportToExcelProps {
  data: any[] | string; // Puede ser un arreglo de datos o una URL base
  fileName: string;
  baseURL?: string; // URL base opcional para la petición GET
}

const ExportToExcel: React.FC<ExportToExcelProps> = ({ data, fileName, baseURL }) => {
  const handleExport = async () => {
    let dataArray = [];

    // Si data es una URL, realizar la petición GET para obtener los datos
    if (typeof data === 'string' && baseURL) {
      try {
        const response = await fetch(`${baseURL}/${data}`);
        dataArray = await response.json();
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    } else {
      // Si data es un arreglo de datos, usarlo directamente
      dataArray = data as any[];
    }

    const worksheet = XLSX.utils.json_to_sheet(dataArray);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <Button type='primary' onClick={handleExport}>
      Exportar a Excel
    </Button>
  );
};

export default ExportToExcel;
