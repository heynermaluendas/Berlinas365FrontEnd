import { FileWordFilled } from '@ant-design/icons';
import { Button } from 'antd';
import axios from 'axios';
import {
  Document,
  Footer,
  Header,
  ImageRun,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
} from 'docx';
import { saveAs } from 'file-saver';

// Function to convert base64 string to a Buffer
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
function chunkArray(array, size) {
  const chunked = [];
  for (let i = 0; i < array.length; i += size) {
    chunked.push(array.slice(i, i + size));
  }
  return chunked;
}

// Function to generate Word document
const generateWordDocument = async (id) => {
  try {
    // Fetch and convert image to base64
    const imageBase64 = await fetchImageBase64(
      'https://imgs.search.brave.com/ilp6HDoxHEYDxEkG_B_pV7LN9aJOpWFKeHs_oaaHDxE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9waW5i/dXMuY29tL29wZXJh/ZG9yZXMvYmVybGlu/YXMuc3Zn',
    );
    const imageBuffer = base64ToBuffer(imageBase64);

    // Fetch data using the provided id
    const response = await axios.get(`https://berlinas360backend.onrender.com/api/events/${id}/`);
    const data = response.data;

    // Prepare the data for the Word document
    const tamanoLetra = 16;
    const colorGray = '#AEB5AA';
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
          spacing: { after: 1200 }, // Espaciado adicional después del encabezado (ajusta según sea necesario)
        }),
        new Paragraph({
          children: [
            // Contenido adicional aquí (ej. botón)
          ],
        }),
      ],
    });
    
    
    
    
    const doc = new Document({
      sections: [
        {
          properties: {
            top: {
              size: 720, // Tamaño del margen superior (en twips), 720 twips = 1 pulgada
            },
          },
          headers: {
            default: header, // Apply the header to all pages
          },
          footers: {
            default: footer, // Aplica el pie de página a todas las páginas
          },
          children: [
            new Paragraph({
              heading: 'Heading1',
              alignment: 'center',
              spacing: {
                before: 240, // Espacio antes del párrafo (en puntos)
                after: 240,  // Espacio después del párrafo (en puntos)
            }}),

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
                              text: ` ${data.nuevareunión?.nombre || 'acta no disponible'}`,
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
                              text: ` ${
                                data.nuevareunión?.fecha
                                  ? new Date(data.nuevareunión.fecha).toLocaleDateString()
                                  : 'ciudad y Fecha no disponible'
                              }`,
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
            ////

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
                ...(data.cuestionarios?.map(
                  (cuestionario) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              alignment: 'center',
                              children: [
                                new TextRun({
                                  text: cuestionario.participants?.name || 'No. no disponible',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                  text: cuestionario.participants?.name || 'Nombre no disponible',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                  text: cuestionario.participants?.position || 'Cargo no disponible',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                ) || [
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
                                size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                          alignment: 'center', // Centrar el texto
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
                ...(data.cuestionarios?.map(
                  (cuestionario) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              alignment: 'center', // Centrar el texto
                              children: [
                                new TextRun({
                                  text: cuestionario.guests?.name || 'No. no disponible',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                  text: cuestionario.guests?.name || 'Nombre no disponible',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                  text: cuestionario.guests?.position || 'Cargo no disponible',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                  text: cuestionario.guests?.company || 'Empresa no disponible',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                ) || [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: 'No hay invitados',
                                font: 'Yu Gothic',
                                size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                ...(data.cuestionarios?.map(
                  (cuestionario) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({
                                  text: cuestionario.user?.name || 'Acciones no disponible',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                  text: cuestionario.user?.email || 'Responsable no disponible',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                  text: cuestionario.user?.email || 'Fecha limite no disponible',
                                  font: 'Yu Gothic',
                                  size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
                                }),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                ) || [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: 'No hay compromisos',
                                font: 'Yu Gothic',
                                size: tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                              text: 'FIRMAN',
                              bold: true,
                              font: 'Yu Gothic',
                              size: tamanoLetra,
                            }),
                          ],
                          alignment: 'center', // Centrar el texto
                        }),
                      ],
                      shading: { fill: colorGray }, // Color de sombreado
                      columnSpan: 2, // Abarcar dos columnas
                    }),
                  ],
                }),
                ...chunkArray(data.cuestionarios, 2).map(
                  (cuestionarioPair) =>
                    new TableRow({
                      children: [
                        ...cuestionarioPair.map(
                          (cuestionario) =>
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
                                      text: cuestionario.user?.nombre || 'Nombre no disponible',
                                      font: 'Yu Gothic',
                                      size: tamanoLetra,
                                    }),
                                  ],
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
                                      text: cuestionario.user?.cargo || 'Cargo no disponible',
                                      font: 'Yu Gothic',
                                      size: tamanoLetra,
                                    }),
                                  ],
                                }),
                              ],
                              width: { size: 50, type: 'pct' }, // 50% of table width
                              margins: { top: 100, bottom: 100 }, // Cell margins
                            }),
                        ),
                        // Add an empty cell if there's an odd number of cuestionarios
                        ...(cuestionarioPair.length < 2
                          ? [
                              new TableCell({
                                children: [],
                              }),
                            ]
                          : []),
                      ],
                      spacing: { before: 200, after: 200 }, // Space between rows
                    }),
                ),
              ],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `reunion_${id}.docx`);
    });
  } catch (error) {
    console.error('Error generating Word document:', error);
  }
};

// Component to render the Word export button
const ActaReunion = ({ id }) => {
  return (
    <Button type="primary" icon={<FileWordFilled />} onClick={() => generateWordDocument(id)} />
  );
};

export default ActaReunion;
