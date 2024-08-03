import { FileWordFilled } from '@ant-design/icons';
import { Button } from 'antd';
import axios from 'axios';
import { Document, ImageRun, Packer, Paragraph, Table, TableCell, TableRow, TextRun } from 'docx';
import { saveAs } from 'file-saver';

// Function to convert base64 string to a Buffer
const base64ToBuffer = (base64) => {
  const base64Data = base64.replace(/^data:image\/[a-z]+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
};

// Función para dividir el array en partes (chunking)
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
    // Fetch data using the provided id
    const response = await axios.get(`http://localhost:3003/formulario/${id}`);
    const data = response.data;

    // Prepare the data for the Word document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: 'Reporte de Reunión',
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
                    new TableCell({ children: [new Paragraph('Nombre')] }),
                    new TableCell({
                      children: [
                        new Paragraph(data.nuevareunion?.nombre || 'Nombre no disponible'),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Fecha')] }),
                    new TableCell({
                      children: [
                        new Paragraph(
                          data.nuevareunion?.fecha
                            ? new Date(data.nuevareunion.fecha).toLocaleDateString()
                            : 'Fecha no disponible',
                        ),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Hora')] }),
                    new TableCell({
                      children: [
                        new Paragraph(
                          data.nuevareunion?.hora
                            ? new Date(data.nuevareunion.hora).toLocaleTimeString()
                            : 'Hora no disponible',
                        ),
                      ],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Lugar')] }),
                    new TableCell({
                      children: [new Paragraph(data.nuevareunion?.lugar || 'Lugar no disponible')],
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph('Tema')] }),
                    new TableCell({
                      children: [new Paragraph(data.nuevareunion?.tema || 'Tema no disponible')],
                    }),
                  ],
                }),
              ],
            }),
            new Paragraph({
              text: 'Registro de asistencia',
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
                    new TableCell({ children: [new Paragraph('Nombre')] }),
                    new TableCell({ children: [new Paragraph('Email')] }),
                    new TableCell({ children: [new Paragraph('Edad')] }),
                    new TableCell({ children: [new Paragraph('Firma')] }),
                  ],
                }),
                ...(data.cuestionarios?.map(
                  (cuestionario) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [
                            new Paragraph(cuestionario.user?.name || 'Nombre no disponible'),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph(cuestionario.user?.email || 'Email no disponible'),
                          ],
                        }),
                        new TableCell({
                          children: [
                            new Paragraph(
                              cuestionario.user?.age !== undefined
                                ? cuestionario.user.age.toString()
                                : 'Edad no disponible',
                            ),
                          ],
                        }),
                        new TableCell({
                          children: [
                            ...(cuestionario.images?.filter((image) => image.type === 'signature')
                              .length > 0
                              ? [
                                  ...cuestionario.images
                                    .filter((image) => image.type === 'signature')
                                    .map(
                                      (image) =>
                                        new Paragraph({
                                          children: [
                                            new ImageRun({
                                              data: base64ToBuffer(image.src),
                                              transformation: {
                                                width: 40,
                                                height: 20,
                                              },
                                            }),
                                          ],
                                          alignment: 'center', // Center align images within the paragraph
                                        }),
                                    ),
                                ]
                              : [new Paragraph('No hay firmas')]),
                          ],
                        }),
                      ],
                    }),
                ) || [
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph('No hay cuestionarios')] }),
                      new TableCell(),
                      new TableCell(),
                      new TableCell(),
                    ],
                  }),
                ]),
              ],
            }),
            new Paragraph({
              text: 'Conclusiones',
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
                          text: 'Conclusión',
                          alignment: 'center', // Centra el texto
                        }),
                      ],
                      columnSpan: 2, // Combina dos columnas
                      borders: {
                        top: { size: 0 },
                        bottom: { size: 0 },
                        left: { size: 0 },
                        right: { size: 0 },
                      },
                    }),
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                      columnSpan: 2, // Combina dos columnas
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun(
                              data.conclusiones?.conclusion || 'Conclusión no disponible',
                            ),
                          ],
                          alignment: 'start', // Centra el texto
                        }),
                      ],
                      width: { size: 100, type: 'pct' }, // Full width
                      borders: {
                        top: { size: 0 },
                        bottom: { size: 0 },
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
                          text: 'Imágenes',
                          alignment: 'center', // Centra el texto
                        }),
                      ],
                      columnSpan: 2, // Combina dos columnas
                      borders: {
                        top: { size: 0 },
                        bottom: { size: 0 },
                        left: { size: 0 },
                        right: { size: 0 },
                      },
                    }),
                  ],
                }),
              ],
            }),
            ...(data.conclusiones?.images?.length > 0
              ? [
                  new Table({
                    width: {
                      size: 100, // Full width
                      type: 'pct',
                    },
                    borders: {
                      insideHorizontal: { size: 0 },
                      insideVertical: { size: 0 },
                    },
                    rows: [
                      ...chunkArray(data.conclusiones.images, 2).map(
                        (imagePair) =>
                          new TableRow({
                            children: [
                              ...imagePair.map(
                                (image) =>
                                  new TableCell({
                                    children: [
                                      new Paragraph({
                                        children: [
                                          new ImageRun({
                                            data: base64ToBuffer(image.src),
                                            transformation: {
                                              width: 290,
                                              height: 170,
                                            },
                                          }),
                                        ],
                                        alignment: 'center', // Center images
                                      }),
                                    ],
                                    width: { size: 50, type: 'pct' }, // 50% of table width
                                    margins: { top: 100, bottom: 100 }, // Cell margins
                                    borders: {
                                      top: { size: 0 },
                                      bottom: { size: 0 },
                                      left: { size: 0 },
                                      right: { size: 0 },
                                    },
                                  }),
                              ),
                              // Add an empty cell if there's an odd number of images
                              ...(imagePair.length < 2
                                ? [
                                    new TableCell({
                                      children: [],
                                      borders: {
                                        top: { size: 0 },
                                        bottom: { size: 0 },
                                        left: { size: 0 },
                                        right: { size: 0 },
                                      },
                                    }),
                                  ]
                                : []),
                            ],
                            spacing: { before: 200, after: 200 }, // Space between rows
                          }),
                      ),
                    ],
                  }),
                ]
              : [
                  new Table({
                    width: {
                      size: 100, // Full width
                      type: 'pct',
                    },
                    rows: [
                      new TableRow({
                        children: [new TableCell({ children: [new Paragraph('No hay imágenes')] })],
                      }),
                    ],
                  }),
                ]),
            new Paragraph({
              text: 'Generado por Berlinas del fonce S.A.S',
              alignment: 'center',
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
const WordExporter = ({ id }) => {
  return (
    <Button type="primary" icon={<FileWordFilled />} onClick={() => generateWordDocument(id)} />
  );
};

export default WordExporter;
