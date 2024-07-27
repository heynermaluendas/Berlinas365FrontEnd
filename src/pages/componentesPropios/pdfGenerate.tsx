import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import html2pdf from 'html2pdf.js';

const GenerateAllPDFs = () => {
  const [formData, setFormData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3003/formulario');
        console.log('Datos obtenidos:', response.data);
        if (response.data && Array.isArray(response.data)) {
          setFormData(response.data);
        } else {
          console.error('Estructura de datos inválida:', response.data);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const generatePDF = (data: any, index: number) => {
    console.log('Generando PDF para:', data);

    // Crear un elemento de HTML para el PDF
    const element = document.createElement('div');
    element.innerHTML = `
      <style>
        body {
          font-family: 'Arial', sans-serif;
          color: black;
          background-color: #fff;
          padding: 1rem;
        }
        h1 {
          font-size: 24px;
          text-align: center;
          color: #fff;
          background-color: #004d00; /* Verde oscuro para el título principal */
          padding: 10px;
          margin-bottom: 10px;
        }
        h2 {
          font-size: 20px;
          text-align: center;
          color: #fff;
          background-color: #009900; /* Verde medio para los subtítulos */
          padding: 8px;
          margin-bottom: 10px;
        }
        h3 {
          font-size: 18px;
          text-align: center;
          color: #fff;
          background-color: #004d00; /* Verde oscuro para los títulos de sección dentro de los cuestionarios */
          padding: 8px;
        }
        h4 {
          font-size: 16px;
          background-color: #e9ecef; /* Gris muy claro para los títulos de imágenes dentro de los cuestionarios y conclusiones */
          padding: 6px;
        }
        p {
          font-size: 14px;
          line-height: 1.6;
        }
        table {
          width: 100%;
      page-break-inside: avoid;
      border-collapse: collapse;
           
        }
        th, td {
          border: 1px solid #dee2e6;
          padding: 6px; /* Reducido para ajustar el tamaño */
          text-align: left;
        }
        th {
          background-color: #e9ecef; /* Gris muy claro para los encabezados de la tabla */
        }
        td {
         page-break-inside: avoid;
          background-color: #f8f9fa; /* Gris muy claro para el contenido de la tabla */
        }
        .details-table th {
          padding-left: 4px; /* Espacio reducido a la izquierda de las celdas */
        }
        .details-table td {
          padding-left: 4px; /* Espacio reducido a la izquierda de las celdas */
        }
        .details-table  {
           margin-bottom: 10px
           
        }
        .img-normal {
          height: 250px;
          margin: 5px 0;
        }
        .img-normali {
   
         
         margin: 10px 5px;
       width:48%;
      height: 200px;
      page-break-inside: avoid;
     
          }

        .img-signature {
            
          height: auto;
          margin: 5px 10px; /* Centrar la firma */
          display: block;
        }
        .container {
          max-width: 700px;
          margin: 2rem auto;
        }

         

        .section {
          background-color: #f1f3f5; /* Gris claro para las secciones */
          padding: 10px;
          border-radius: 4px;
           margin-top:20px;
           margin-botton:20px;
           
        }
        .section2 {
          background-color: #f1f3f5; /* Gris claro para las secciones */
          padding: 10px;
          border-radius: 4px;
           
           
        }
         
        .footer {
          text-align: center;
          font-size: 12px;
          color: black;
          margin-top: 20px;
        }
        .details-table   {
            margin-bottom:20px;
        }
        .user-info {
            margin-bottom:10px;
            height:466px;
          overflow: hidden; /* Evita el desbordamiento */
        }
        .user-info tr {
          page-break-inside: avoid; /* Evita que las filas se dividan entre páginas */
        }
        
        .page-break {
          page-break-before: always; /* Forzar salto de página antes de la sección */
        }
       
        .user-info th, .user-info td {
          background-color: #f8f9fa; /* Gris muy claro para el contenido de Usuario */
          color: #333; /* Gris oscuro para el texto del contenido de Usuario */
        }
        .centered {
          justify-content: center;
text-align: center;
align-items: center;
        }
          .conclusion{
          margin-top:50px;
           
          }
 .details-table2 {
  width: 100%; /* Asegura que la tabla ocupe el ancho completo */
  border-collapse: collapse; /* Elimina el espacio entre celdas */
}

.details-table2 th,
.details-table2 td {
  border: 1px solid #ddd; /* Agrega borde a las celdas */
  padding: 10px; /* Espacio alrededor de las celdas */
   
}

.details-table2 th {
  background-color: #f0f0f0; /* Color de fondo para las cabeceras */
  font-weight: bold; /* Texto en negrita para las cabeceras */
}

.details-table2 td img.img-signature {
  max-width: 100px; /* Ajusta el tamaño de la imagen según sea necesario */
  height: auto;
}

.img-signature {
  max-width: 100px; /* Ajusta el tamaño de la imagen según sea necesario */
  height: auto;
   margin:0;
  padding:0;
}
  .conclucioni{
  margin-top:20px;
   
  }
  .details-table {
  width: 100%; /* Asegura que la tabla ocupe el ancho completo */
  border-collapse: collapse; /* Elimina el espacio entre celdas */
}

 
.details-table td {
  border: 1px solid #ddd; /* Agrega borde a las celdas */
  padding: 10px; /* Espacio alrededor de las celdas */
  text-align: left; /* Alineación del texto a la izquierda */
}
.details-table th  {
  border: 1px solid #ddd; /* Agrega borde a las celdas */
  padding: 10px; /* Espacio alrededor de las celdas */
  text-align: center; /* Alineación del texto a la izquierda */
}

.details-table th.left-column {
  width: 20%; /* Ajusta el ancho de las celdas de cabecera */
}

.details-table td.right-column {
  width: 80%; /* Ajusta el ancho de las celdas de datos */
}

.centered {
  text-align: center; /* Alinea el texto al centro */
}
.info-table {
  width: 100%; /* Asegura que la tabla ocupe el ancho completo */
  border-collapse: collapse; /* Elimina el espacio entre celdas */
  
}

.info-table td {
  border: 1px solid #ddd; /* Agrega borde a las celdas */
  padding: 10px; /* Espacio alrededor de las celdas */
   
  text-align: left; /* Alineación del texto a la izquierda */
}

.formatted-text {
  white-space: pre-wrap; /* Asegura que los saltos de línea y los espacios en blanco se respeten */
   
}

 @media print {
 @page {
    size: A4; /* Tamaño de página (puedes ajustar esto según tus necesidades) */
    margin: 1rem; /* Ajusta los márgenes para todos los lados de la página */
    padding: 1rem; /* Ajusta los márgenes para todos los lados de la página */
  }
  .page-break {
    page-break-before: always; /* Inserta un salto de página antes del elemento con esta clase */
  }
}

   
</style>
      <div class="container">
        <div class="section details-section">
          <h1>Reporte de Reunión</h1>
        </div>
        <div class="section ">
          <h2>Detalles de la Reunión</h2>
          <table class="details-table">
  <tr><th class="left-column centered">Nombre</th><td class="right-column">${data.nuevareunion?.nombre || 'Nombre no disponible'}</td></tr>
  <tr><th class="left-column">Fecha</th><td class="right-column">${data.nuevareunion?.fecha ? new Date(data.nuevareunion.fecha).toLocaleDateString() : 'Fecha no disponible'}</td></tr>
  <tr><th class="left-column">Hora</th><td class="right-column">${data.nuevareunion?.hora ? new Date(data.nuevareunion.hora).toLocaleTimeString() : 'Hora no disponible'}</td></tr>
  <tr><th class="left-column">Lugar</th><td class="right-column">${data.nuevareunion?.lugar || 'Lugar no disponible'}</td></tr>
  <tr><th class="left-column">Tema</th><td class="right-column">${data.nuevareunion?.tema || 'Tema no disponible'}</td></tr>
</table>
        </div>
      <div class="section2  ">
  <h2>Registro de asistencia</h2>
  <table class="details-table2">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Email</th>
        <th>Edad</th>
        <th>Firma</th>
      </tr>
    </thead>
    <tbody>
      ${data.cuestionarios?.map((cuestionario: any) => `
        <tr>
          <td>${cuestionario.user?.name || 'Nombre no disponible'}</td>
          <td>${cuestionario.user?.email || 'Email no disponible'}</td>
          <td class="centered">${cuestionario.user?.age || 'Edad no disponible'}</td>
          <td>
            ${cuestionario.images?.filter((image: any) => image.type === 'signature').map((image: any) => `
              <img class="img-signature" src="${image.src}" alt="Firma" />
            `).join('') || 'No hay firmas'}
          </td>
        </tr>
      `).join('') || '<tr><td colspan="4">No hay cuestionarios</td></tr>'}
    </tbody>
  </table>
</div>

        <div class="section2  page-break " >
          <h2 class="centered">Conclusiones</h2>
          <table class="info-table " >
    <thead>
      <tr>
        <th  class="centered " >Concluciones</th>
      </tr>
    </thead>
    <tbody>
        <tr>
         <td class="formatted-text">${data.conclusiones?.conclusion || 'Conclusión no disponible'}</td>
        </tr>
    </tbody>
  </table>
           
          <table   >
          <thead>
      <tr>
        <th class="centered">Imagenes</th>
      </tr>
    </thead>
      <tbody>
        <tr>
          
        
        <td>
        ${data.conclusiones?.images?.map((image) => `
          <img class="img-normali" src="${image.src}" alt="Imagen" />
          `).join('') || 'No hay imágenes de conclusiones'}
          </td>
        
          </tr>
      </tbody>
    </table>
        </div>
        <div class="footer">
          <p>Generado por Berlinas del fonce S.A.S</p>
        </div>
      </div>
    `;

    html2pdf().from(element).save(`formulario_${index}.pdf`);
  };

  const generateAllPDFs = () => {
    console.log('Datos para generar PDFs:', formData);

    if (!Array.isArray(formData) || formData.length === 0) {
      console.error('No hay datos válidos para generar PDFs.');
      return;
    }

    formData.forEach((data, index) => {
      generatePDF(data, index);
    });
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
       
      <Button type='primary' onClick={generateAllPDFs}>
     PDF
      </Button>

    </div>
  );
};

export default GenerateAllPDFs;
