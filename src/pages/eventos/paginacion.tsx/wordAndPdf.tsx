import { CloseCircleFilled, EyeFilled, FilePdfOutlined, FileWordOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import axios from 'axios';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Footer,
  Header,
  ImageRun,
  Table,
  TableCell,
  TableRow,
} from 'docx';
import html2pdf from 'html2pdf.js';
import { useState } from 'react';
import { saveAs } from 'file-saver';

const fetchDataById = async (id) => {
  try {
    const response = await axios.get(`https://berlinas360backend.onrender.com/api/events/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};

const tamanoLetra = 16;
const colorGray = '#AEB5AA';

const YourComponent = ({ id }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState(null);

  const handleClick = async () => {
    setIsGenerating(true);
    const fetchedData = await fetchDataById(id);
    if (fetchedData) {
      setData(fetchedData);
      try {
        const htmlContent = `
          <div>
            <h1>Formulario ID: ${id}</h1>
            <p>Objetivo: ${fetchedData.cuestionarios.objective}</p>
            <p>Agenda: ${fetchedData.cuestionarios.agenda}</p>
            <p>Desarrollo: ${fetchedData.cuestionarios.desarrollo}</p>
          </div>
        `;
        const pdfBlob = await html2pdf().from(htmlContent).toPdf().output('blob');
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (err) {
        console.error('Error generating PDF:', err);
      }
    }
    setIsGenerating(false);
  };

  const imageToImageRun = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new ImageRun({
      data: blob,
      transformation: {
        width: 100, // Ancho de la imagen
        height: 50, // Alto de la imagen
      },
    });
  };
  const base64ToBuffer = (base64) => {
    const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  };
  
  // Function to fetch image as base64
  const fetchImageBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const generateWordDocument = async (data, id) => {
    const {
      participants = [],  // Si data.cuestionarios no tiene participants, será un array vacío
      guests = [],        // Lo mismo para guests
      actions = []        // Lo mismo para actions
    } = data.cuestionarios || {};  // Si data.cuestionarios es undefined, usa un objeto vacío
    
    const rows = [];
    
    // Función para agregar participantes o invitados a la tabla
    const addParticipantOrGuest = async (person) => {
      if (person) {
        // Convertir la imagen de la firma a un formato adecuado
        const signatureImage = await imageToImageRun(person.signature);
    
        // Crear una fila con dos columnas, donde la primera columna contiene Nombre y Cargo alineados a la izquierda, y la segunda columna contiene la Firma centrada
        rows.push(
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'NOMBRE: ',
                        bold: true,
                        font: 'Yu Gothic',
                        size: tamanoLetra,
                      }),
                      new TextRun({
                        text: person.name || 'Nombre no disponible',
                        font: 'Yu Gothic',
                        size: tamanoLetra,
                      }),
                    ],
                    alignment: 'left', // Alinear el texto al lado izquierdo
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'CARGO: ',
                        bold: true,
                        font: 'Yu Gothic',
                        size: tamanoLetra,
                      }),
                      new TextRun({
                        text: person.position || 'Cargo no disponible',
                        font: 'Yu Gothic',
                        size: tamanoLetra,
                      }),
                    ],
                    alignment: 'left', // Alinear el texto al lado izquierdo
                  }),
                ],
                width: { size: 50, type: 'pct' }, // 50% del ancho de la tabla
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: 'FIRMA',
                        bold: true,
                        font: 'Yu Gothic',
                        size: tamanoLetra,
                      }),
                    ],
                    alignment: 'center', // Centrar el texto
                  }),
                  new Paragraph({
                    children: [signatureImage],
                    alignment: 'center', // Centrar la imagen
                  }),
                ],
                width: { size: 50, type: 'pct' }, // 50% del ancho de la tabla
              }),
            ],
            spacing: { before: 200, after: 200 }, // Espacio entre filas
          })
        );
      }
    };

    const imageBase64 = await fetchImageBase64(
      'https://imgs.search.brave.com/ilp6HDoxHEYDxEkG_B_pV7LN9aJOpWFKeHs_oaaHDxE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9waW5i/dXMuY29tL29wZXJh/ZG9yZXMvYmVybGlu/YXMuc3Zn',
    );
    const imageBuffer = base64ToBuffer(imageBase64);

    
   
    
  
    // Agregar participantes
    if (participants && participants.length > 0) {
      for (const participant of participants) {
        await addParticipantOrGuest(participant);
      }
    } else {
      console.error('No se encontraron participantes.');
    }
  
    // Agregar invitados
    if (guests && guests.length > 0) {
      for (const guest of guests) {
        await addParticipantOrGuest(guest);
      }
    } else {
      console.error('No se encontraron invitados.');
    }
    const colorCabeza = '#E0E0E0';


    const footer = new Footer({
      children: [
        new Paragraph({
          alignment: 'center', // Centra el texto
          children: [
            new TextRun({
              text: 'Generado por Berlinas del fonce S.A.S',
              font: 'Yu Gothic',
              size: 16, // Tamaño de fuente en puntos (24 = 12pt)
            }),
          ],
        }),
      ],
    });

    const header = new Header({
      children: [
        new Table({
          width: {
            size: 100, // Full width
            type: 'pct',
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: {
                    size: 25, // Ajusta el tamaño según sea necesario (en pct o twip)
                    type: 'pct',
                  },
                  shading: {
                    fill: colorCabeza, // Color de fondo en formato hexadecimal
                  },
                  children: [
                    new Paragraph({
                      children: [
                        new ImageRun({
                          data: imageBuffer, // Buffer de la imagen
                          transformation: {
                            width: 140, // Ajusta el ancho según sea necesario
                            height: 60, // Ajusta la altura según sea necesario
                          },
                        }),
                      ],
                    }),
                  ],
                }),
                new TableCell({
                  width: {
                    size: 75, // Ajusta el tamaño según sea necesario (en pct o twip)
                    type: 'pct',
                  },
                  shading: {
                    fill: colorCabeza, // Color de fondo en formato hexadecimal
                  },
                  children: [
                    new Paragraph({
                      alignment: 'center', // Centrar el texto
                      spacing: { before: 300, after: 300 }, // Espaciado antes y después del párrafo
                      children: [
                        new TextRun({
                          text: 'ACTA DE REUNION',
                          bold: true,
                          font: 'Yu Gothic',
                          color: '000000',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: '',
              break: 1, // Añadir un salto de línea para asegurar separación
            }),
          ],
          spacing: { after: 20 }, // Espaciado adicional después del encabezado (ajusta según sea necesario)
        }),
        new Paragraph({
          children: [
            // Contenido adicional aquí (ej. botón)
          ],
        }),
      ],
    });
    
    // Crear el documento
    const doc = new Document({
      sections: [
        {
          properties: {},
          headers: {
            default: header, // Apply the header to all pages
          },
          footers: {
            default: footer, // Aplica el pie de página a todas las páginas
          },
          children: [


            new Table({
              width: {
                size: 100, // Full width
                type: 'pct',
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'ACTA No:',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                            new TextRun({
                              text: ` ${data.cuestionarios?.noActa || 'acta no disponible'}`,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                        }),
                      ],
                      columnSpan: 2,
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'CIUDAD Y FECHA:',
                              size: tamanoLetra,
                              bold: true,
                              font: 'Yu Gothic',
                            }),
                            new TextRun({
                              text: ` ${data.nuevareunión?.fecha || 'fecha no disponible'}`,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                        }),
                      ],
                      columnSpan: 2,
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'HORA DE INICIACION:',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                            new TextRun({
                              text: ` ${
                                data.nuevareunión?.horaInicio
                                  ? new Date(data.nuevareunión.horaInicio).toLocaleTimeString()
                                  : 'Hora no disponible'
                              }`,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'HORA DE FINALIZACION:',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                            new TextRun({
                              text: ` ${
                                data.nuevareunión?.horaFin
                                  ? new Date(data.nuevareunión.horaFin).toLocaleTimeString()
                                  : 'Hora no disponible'
                              }`,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'LUGAR:',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                            new TextRun({
                              text: ` ${data.nuevareunión?.lugar || 'Lugar no disponible'}`,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                        }),
                      ],
                      columnSpan: 2,
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              heading: 'Heading1',
              alignment: 'center',
            }),
            new Table({
              width: {
                size: 100, // Full width
                type: 'pct',
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'OBJETIVO:',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                        }),
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: ` ${data.cuestionarios?.objective || 'Objetivo no disponible'}`,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              heading: 'Heading2',
              alignment: 'center',
            }),
  
            new Table({
              width: {
                size: 100, // Full width
                type: 'pct',
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'PARTICIPANTES',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          alignment: 'center', // Centrar el texto
                        }),
                      ],
                      shading: { fill: colorGray }, // Color de sombreado
                      columnSpan: 3, // Abarcar tres columnas
                      borders: {
                        top: { size: 0 },
                        bottom: { size: 1 }, // Borde en la parte inferior
                        left: { size: 0 },
                        right: { size: 0 },
                      },
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: 'center',
                          children: [
                            new TextRun({
                              text: 'No.:',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          shading: { fill: colorGray },
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: 'center',
                          children: [
                            new TextRun({
                              text: 'NOMBRE Y APELLIDOS:',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          shading: { fill: colorGray },
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: 'center',
                          children: [
                            new TextRun({
                              text: 'CARGO:',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          shading: { fill: colorGray },
                        }),
                      ],
                    }),
                  ],
                }),
                ...(participants.length > 0
                  ? participants.map((participant, index) => 
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: 'center',
                                children: [
                                  new TextRun({
                                    text: (index + 1).toString(), // Número de participante
                                    font: 'Yu Gothic',
                                    size: tamanoLetra,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: participant.name || 'Nombre no disponible',
                                    font: 'Yu Gothic',
                                    size: tamanoLetra,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: participant.position || 'Cargo no disponible',
                                    font: 'Yu Gothic',
                                    size: tamanoLetra,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                    )
                  : [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              alignment: 'center',
                              children: [
                                new TextRun({
                                  text: 'No hay participantes',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell(),
                        new TableCell(),
                      ],
                    }),
                  ]),
              ],
            }),
            new Paragraph({
              heading: 'Heading2',
              alignment: 'center',
            }),
            new Table({
              width: {
                size: 100, // Full width
                type: 'pct',
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'INVITADOS',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          alignment: 'center', // Center the text
                        }),
                      ],
                      shading: { fill: colorGray }, // Color de sombreado
                      columnSpan: 4, // Span across four columns
                      borders: {
                        top: { size: 0 },
                        bottom: { size: 1 }, // Add a border at the bottom if you want
                        left: { size: 0 },
                        right: { size: 0 },
                      },
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: 'center',
                          children: [
                            new TextRun({
                              text: 'No.',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          shading: { fill: colorGray },
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: 'center',
                          children: [
                            new TextRun({
                              text: 'NOMBRE Y APELLIDOS',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          shading: { fill: colorGray },
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: 'center',
                          children: [
                            new TextRun({
                              text: 'CARGO',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          shading: { fill: colorGray },
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: 'center',
                          children: [
                            new TextRun({
                              text: 'EMPRESA',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          shading: { fill: colorGray },
                        }),
                      ],
                    }),
                  ],
                }),
                ...(guests.length  > 0
                  ?  guests.map((guest, index) => 
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            alignment: 'center',
                            children: [
                              new TextRun({
                                text: (index + 1).toString(), // Número de participante
                                font: 'Yu Gothic',
                                size: tamanoLetra,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text:  guest?.name || 'Nombre no disponible',
                                font: 'Yu Gothic',
                                size: tamanoLetra,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text:  guest?.position || 'Cargo no disponible',
                                font: 'Yu Gothic',
                                size: tamanoLetra,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text:  guest?.company || 'Empresa no disponible',
                                font: 'Yu Gothic',
                                size: tamanoLetra,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
                ) : [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: 'No hay invitados',
                                font: 'Yu Gothic',
                                size: tamanoLetra,
                              }),
                            ],
                          }),
                        ],
                      }),
                      new TableCell(),
                      new TableCell(),
                      new TableCell(),
                    ],
                  }),
                ]),
              ],
            }),
            new Paragraph({
              heading: 'Heading2',
              alignment: 'center',
            }),
            new Table({
              width: {
                size: 100, // Full width
                type: 'pct',
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'AGENDA DEL DIA:',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                        }),
                        new Paragraph({
                          // Nuevo Paragraph para el contenido
                          children: [
                            new TextRun({
                              text: `${data.cuestionarios?.agenda || 'Agenda no disponible'}`,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              heading: 'Heading2',
              alignment: 'center',
            }),
            new Table({
              width: {
                size: 100, // Full width
                type: 'pct',
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: 'DESARROLLO:',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                        }),
                        new Paragraph({
                          // Nuevo Paragraph para el contenido
                          children: [
                            new TextRun({
                              text: `${data.cuestionarios?.desarollo || 'Desarrollo no disponible'}`,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              heading: 'Heading2',
              alignment: 'center',
            }),
            new Table({
              width: {
                size: 100, // Full width
                type: 'pct',
              },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: 'center',
                          children: [
                            new TextRun({
                              text: 'ACCIONES Y COMPROMISO',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          shading: { fill: colorGray },
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: 'center',
                          children: [
                            new TextRun({
                              text: 'RESPONSABLE',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          shading: { fill: colorGray },
                        }),
                      ],
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          alignment: 'center',
                          children: [
                            new TextRun({
                              text: 'FECHA LIMITE',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          shading: { fill: colorGray },
                        }),
                      ],
                    }),
                  ],
                }),
            
                ...(actions.length > 0
                  ? actions.map((action) => 
                      new TableRow({
                        children: [
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: action?.action || 'Acciones no disponible',
                                    font: 'Yu Gothic',
                                    size: tamanoLetra,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                children: [
                                  new TextRun({
                                    text: action?.responsible || 'Responsable no disponible',
                                    font: 'Yu Gothic',
                                    size: tamanoLetra,
                                  }),
                                ],
                              }),
                            ],
                          }),
                          new TableCell({
                            children: [
                              new Paragraph({
                                alignment: 'center',
                                children: [
                                  new TextRun({
                                    text: action?.deadline || 'Fecha limite no disponible',
                                    font: 'Yu Gothic',
                                    size: tamanoLetra,
                                  }),
                                ],
                              }),
                            ],
                          }),
                        ],
                      })
                    )
                  : [
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: 'No hay compromisos',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra,
                                }),
                              ],
                            }),
                          ],
                        }),
                        new TableCell(), // Las otras celdas vacías
                        new TableCell(),
                        new TableCell(),
                      ],
                    }),
                  ]
                ),
              ],
            }),
            new Paragraph({
              heading: 'Heading2',
              alignment: 'center',
            }),
            new Table({
              width: {
                size: 100, // Ancho total de la tabla
                type: 'pct',
              },
              rows: rows, // Agregar filas de participantes e invitados
            }),
          ],
        },
      ],
    });
  
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `documento_${id}.docx`);
  };
  
  

  const handleDownloadWord = async () => {
    if (data) {
      try {
        await generateWordDocument(data, id);
      } catch (err) {
        console.error('Error generating Word document:', err);
      }
    }
  };

  const handleClose = () => {
    setPdfUrl(null);
  };

  return (
    <div>
      <Button
        onClick={handleClick}
        disabled={isGenerating}
        type="primary"
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px',
          padding: 0,
        }}
      >
        <EyeFilled style={{ fontSize: '20px' }} />
      </Button>

      {pdfUrl && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '15px',
              right: '130px',
              zIndex: 1100,
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '100px',
              padding: '0px 0px',
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s, box-shadow 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#000')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#333')}
          >
            <CloseCircleFilled style={{ fontSize: '30px' }} />
          </Button>

          <iframe
            src={pdfUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Document Viewer"
          />
          <a
            href={pdfUrl}
            download={`documento_${id}.pdf`}
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              zIndex: 1100,
              backgroundColor: 'white',
            }}
          >
            <Button
              icon={<FilePdfOutlined />}
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '20px',
                zIndex: 1100,
                backgroundColor: '#d32f2f',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '10px 20px',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                width: '180px',
                gap: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'background-color 0.3s, box-shadow 0.3s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#c62828')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#d32f2f')}
            >
              <FilePdfOutlined style={{ fontSize: '20px' }} />
              Descargar PDF
            </Button>
          </a>
          <Button
            onClick={handleDownloadWord}
            icon={<FileWordOutlined />}
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '200px',
              zIndex: 1100,
              backgroundColor: '#007acc',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 20px',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              width: '200px',
              gap: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s, box-shadow 0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#005f99')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007acc')}
          >
            <FileWordOutlined style={{ fontSize: '20px' }} />
            Descargar Word
          </Button>
        </div>
      )}
    </div>
  );
};

export default YourComponent;
