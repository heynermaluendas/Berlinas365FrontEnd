import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'antd';
import html2pdf from 'html2pdf.js';

const GeneratePDFById = ({ meetingId }: { meetingId: number }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/formulario/${meetingId}`);
        if (response.data) {
          setData(response.data);
        } else {
          console.error('No se encontraron datos para el ID:', meetingId);
        }
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  const generatePDF = () => {
    if (!data) return;

    const element = document.createElement('div');
    element.innerHTML = `
      <style>
        /* Estilos aquí */
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
        <div class="section2">
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
        <div class="section2 page-break">
          <h2 class="centered">Conclusiones</h2>
          <table class="info-table">
            <thead>
              <tr>
                <th class="centered">Conclusiones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="formatted-text">${data.conclusiones?.conclusion || 'Conclusión no disponible'}</td>
              </tr>
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th class="centered">Imágenes</th>
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

    html2pdf().from(element).save(`formulario_${meetingId}.pdf`);
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <Button type="primary" onClick={generatePDF}>
      Generar PDF para ID {meetingId}
    </Button>
  );
};

export default GeneratePDFById;
