import { FileWordFilled } from '@ant-design/icons';
import { Button } from 'antd';
import axios from 'axios';
import { Document, ImageRun, Packer, Paragraph, Table, TableCell, TableRow, TextRun ,Header,Footer} from 'docx';
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
    const imageBase64 = await fetchImageBase64('https://imgs.search.brave.com/ilp6HDoxHEYDxEkG_B_pV7LN9aJOpWFKeHs_oaaHDxE/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9waW5i/dXMuY29tL29wZXJh/ZG9yZXMvYmVybGlu/YXMuc3Zn');
    const imageBuffer = base64ToBuffer(imageBase64);

    // Fetch data using the provided id
    const response = await axios.get(`https://berlinas360backend.onrender.com/api/events/${id}/`);
    const data = response.data;

    // Prepare the data for the Word document
    const tamanoLetra = 16;
    const tipoletra = 'Yu Gothic';
    const colorGray = '#E0E0E0';
    const colorCabeza = '#E0E0E0';

    
    const footer = new Footer({
      children: [
        new Paragraph({
          alignment: 'center', // Centra el texto
          children: [
            new TextRun({
              text: 'Generado por Berlinas del fonce S.A.S',
              font: tipoletra,
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
                    fill: colorCabeza, //Cabeza Color de fondo en formato hexadecimal
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
                      spacing: { before: 300, after: 300 },
                      children: [
                        
                        new TextRun({
                          text: 'EVALUACIÓN EFICACIA DE LA CAPACITACIÓN Y ENTRENAMIENTO',
                          bold: true,
                          font: tipoletra,
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
            heading: 'Heading1',
            alignment: 'center',
          }),
      ],
    });
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
                        shading: {
                            fill: colorCabeza, // Color de fondo en formato hexadecimal
                          },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: 'I. Datos de interes', bold: true,font: tipoletra,  size:tamanoLetra, }),
                            ]
                          })
                        ],
                        columnSpan: 2
                      }),
                      
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: 'Tema de capacitacion:', bold: false,font: tipoletra,  size:tamanoLetra, }),
                              new TextRun({ text: ` ${data.nuevareunion?.nombre || 'Tema no disponible'}` ,font: tipoletra,  size:tamanoLetra,})
                            ]
                          })
                        ],
                        columnSpan: 2
                      }),
                      
                  ],
                }),
                new TableRow({
                    children: [
                      new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({ text: 'Nombres y apellidos del trabajador:', bold: false,font: tipoletra,  size:tamanoLetra, }),
                                new TextRun({ text: ` ${data.nuevareunion?.hora ? new Date(data.nuevareunion.hora).toLocaleTimeString() : 'Hora no disponible'}`,font: tipoletra,  size:tamanoLetra, })
                              ]
                            })
                          ]
                        }),
                      new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({ text: 'Cédula No.:', bold: false,font: tipoletra ,  size:tamanoLetra,}),
                                new TextRun({ text: ` ${data.nuevareunion?.hora ? new Date(data.nuevareunion.hora).toLocaleTimeString() : 'Hora no disponible'}`,font: tipoletra ,  size:tamanoLetra,})
                              ]
                            })
                          ]
                        }),
                        
                    ],
                  }),
                new TableRow({
                  children: [
                    new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: 'Cargo:',  size:tamanoLetra, bold: false,font: tipoletra }),
                              new TextRun({ text: ` ${data.nuevareunion?.fecha ? new Date(data.nuevareunion.fecha).toLocaleDateString() : 'Cargo no disponible'}`,font: tipoletra,  size:tamanoLetra, })
                            ]
                          })
                        ],
                        columnSpan: 2
                      }),
                      
                  ],
                }),
                
                new TableRow({
                  children: [
                    new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: 'Nombre Capacitador:', bold: false,font: tipoletra,  size:tamanoLetra, }),
                              new TextRun({ text: ` ${data.nuevareunion?.lugar || 'Nombre no disponible'}`,font: tipoletra ,  size:tamanoLetra,})
                            ]
                          })
                        ],
                        columnSpan: 2
                      }),
                      
                  ],
                }),
                new TableRow({
                    children: [
                      new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({ text: 'Fecha:', bold: false,font: tipoletra,  size:tamanoLetra, }),
                                new TextRun({ text: ` ${data.nuevareunion?.hora ? new Date(data.nuevareunion.hora).toLocaleTimeString() : 'Fecha no disponible'}`,font: tipoletra,  size:tamanoLetra, })
                              ]
                            })
                          ]
                        }),
                      new TableCell({
                          children: [
                            new Paragraph({
                              children: [
                                new TextRun({ text: 'Ciudad:', bold: false,font: tipoletra ,  size:tamanoLetra,}),
                                new TextRun({ text: ` ${data.nuevareunion?.hora ? new Date(data.nuevareunion.hora).toLocaleTimeString() : 'Ciudad no disponible'}`,font: tipoletra ,  size:tamanoLetra,})
                              ]
                            })
                          ]
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
                        shading: {
                            fill: colorCabeza, // Color de fondo en formato hexadecimal
                          },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: 'II. Objetivo', bold: true,font: tipoletra,  size:tamanoLetra, }),
                            ]
                          })
                        ],
                        columnSpan: 2
                      }),
                      
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: `Conocer y evaluar la percepción, pertinencia y calidad de la capacitación y/o entrenamiento, con el fin de llevar a cabo procesos de mejoramiento continuo.'}` ,font: tipoletra,  size:tamanoLetra,})
                            ]
                          })
                        ],
                        columnSpan: 2
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
              shading: {
                  fill: colorCabeza, // Color de fondo en formato hexadecimal
                },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'IV. Observaciones y/o sugerencias con respecto al tema de capacitación', bold: true,font: tipoletra,  size:tamanoLetra, }),
                  ]
                })
              ],
              columnSpan: 2
            }),
            
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
              children: [
                new Paragraph({
                    spacing: {
                        after: 200 * 3, // Espacio después del párrafo, ajusta según sea necesario
                      },
                  children: [
                    new TextRun({ 
                        text: '\n\n\n\n\n\n\n',
                        }),
                  ]
                })
              ],
              columnSpan: 2
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
                        shading: {
                            fill: colorCabeza, // Color de fondo en formato hexadecimal
                          },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: 'V. Evaluacion de la metodologia', bold: true,font: tipoletra,  size:tamanoLetra, }),
                            ]
                          })
                        ],
                        columnSpan: 2
                      }),
                      
                  ],
                }),
                new TableRow({
                  children: [
                    new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: `Marque una  X en la casilla correspondiente según su opinión: E = Excelente, B = Bueno, R = Regular y D = Deficiente` ,font: tipoletra,  size:tamanoLetra,})
                            ]
                          })
                        ],
                        columnSpan: 2
                      }),
                      
                  ],
                }),
              ],
            }),
            new Paragraph({
              heading: 'Heading2',
              alignment: 'center',
            }),

            /////1
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
                                    size: 100, // Full width
                                    type: 'pct',
                                  },
                                children: [
                                  new Paragraph({
                                    children: [
                                      new TextRun({ text: 'Contenido de la capacitación', bold: true,font: tipoletra,  size:tamanoLetra, })
                                    ],
                                  })
                                ],
                                shading: { fill: colorGray }, // Color de sombreado
                                columnSpan: 5, // Span across four columns
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
                            width: {
                                size: 84, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center',
                                children: [
                                  new TextRun({ text: 'Aspectos a Evaluar', bold: true ,font: tipoletra,  size:tamanoLetra,})
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center',
                                children: [
                                  new TextRun({ text: 'E', bold: true,font: tipoletra,  size:tamanoLetra, })
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center',
                                children: [
                                  new TextRun({ text: 'B', bold: true ,font: tipoletra,  size:tamanoLetra,})
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center', // Centrar el texto
                                children: [
                                  new TextRun({ text: 'R', bold: true,font: tipoletra,  size:tamanoLetra, })
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center', // Centrar el texto
                                children: [
                                  new TextRun({ text: 'D', bold: true,font: tipoletra,  size:tamanoLetra, })
                                ],
                              })
                            ]
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
                                    text: 'Cumplimiento de los objetivos propuestos',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'Claridad de conceptos',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'La capacitación contribuyó a su desarrollo personal',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'La capacitación contribuyó a su trabajo actual',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
              ////2
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
                                      new TextRun({ text: 'Desempeño del capacitador', bold: true,font: tipoletra,  size:tamanoLetra, })
                                    ],
                                  })
                                ],
                                shading: { fill: colorGray }, // Color de sombreado
                                columnSpan: 5, // Span across four columns
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
                            width: {
                                size: 84, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center',
                                children: [
                                  new TextRun({ text: 'Aspectos a Evaluar', bold: true ,font: tipoletra,  size:tamanoLetra,})
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },

                            children: [
                              new Paragraph({
                                alignment: 'center',
                                children: [
                                  new TextRun({ text: 'E', bold: true,font: tipoletra,  size:tamanoLetra, })
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center',
                                children: [
                                  new TextRun({ text: 'B', bold: true ,font: tipoletra,  size:tamanoLetra,})
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center', // Centrar el texto
                                children: [
                                  new TextRun({ text: 'R', bold: true,font: tipoletra,  size:tamanoLetra, })
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center', // Centrar el texto
                                children: [
                                  new TextRun({ text: 'D', bold: true,font: tipoletra,  size:tamanoLetra, })
                                ],
                              })
                            ]
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
                                    text: 'Conocimineto y dominio el tema',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'Habilidades de comunicación (Contacto visual, expresión facial y corporal, expresión vocal)',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'Capacidad para orientar al grupo a los objetivos propuestos',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'Habilidad para transmitir ideas y conocimientos',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'Manejo del tiempo según la agenda propuesta',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'Genera empatía y acogida dentro del grupo',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'Puntualidad',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
              /////3
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
                                      new TextRun({ text: 'Metodología y Logística', bold: true,font: tipoletra,  size:tamanoLetra, })
                                    ],
                                  })
                                ],
                                shading: { fill: colorGray }, // Color de sombreado
                                columnSpan: 5, // Span across four columns
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
                            width: {
                                size: 84, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center',
                                children: [
                                  new TextRun({ text: 'Aspectos a Evaluar', bold: true ,font: tipoletra,  size:tamanoLetra,})
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center',
                                children: [
                                  new TextRun({ text: 'E', bold: true,font: tipoletra,  size:tamanoLetra, })
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center',
                                children: [
                                  new TextRun({ text: 'B', bold: true ,font: tipoletra,  size:tamanoLetra,})
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center', // Centrar el texto
                                children: [
                                  new TextRun({ text: 'R', bold: true,font: tipoletra,  size:tamanoLetra, })
                                ],
                              })
                            ]
                          }),
                          new TableCell({
                            width: {
                                size: 4, // Full width
                                type: 'pct',
                              },
                            children: [
                              new Paragraph({
                                alignment: 'center', // Centrar el texto
                                children: [
                                  new TextRun({ text: 'D', bold: true,font: tipoletra,  size:tamanoLetra, })
                                ],
                              })
                            ]
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
                                    text: 'Material usado',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'Recursos empleados',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'Instalaciones',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
                                    text: 'Disposición y uso de aspectos logísticos',
                                    font: tipoletra,  size:tamanoLetra, // Aplicar la fuente "Yu Gothic"
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
///////

new Table({
    width: {
      size: 100, // Full width
      type: 'pct',
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
              shading: {
                  fill: colorCabeza, // Color de fondo en formato hexadecimal
                },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: 'VI. Observaciones y/o sugerencias con respecto a la metodología', bold: true,font: tipoletra,  size:tamanoLetra, }),
                  ]
                })
              ],
              columnSpan: 2
            }),
            
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
              children: [
                new Paragraph({
                    spacing: {
                        after: 200 * 7, // Espacio después del párrafo, ajusta según sea necesario
                      },
                  children: [
                    new TextRun({ 
                        text: '\n\n\n\n\n\n\n',
                        }),
                  ]
                })
              ],
              columnSpan: 2
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
    borders: {
        top: { size: 0 },
        bottom: { size: 1 }, // Add a border at the bottom if you want
        left: { size: 0 },
        right: { size: 0 },
        insideVertical: { style: 'none' },
      },
    width: {
      size: 100, // Full width
      type: 'pct',
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: {
              size: 50, // Half width
              type: 'pct',
            },
            children: [
              // Tabla interna en la primera columna
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
                          size: 40, // Half width
                          type: 'pct',
                        },
                        children: [
                            new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "   Firma",
                                    font: tipoletra,
                                    size: tamanoLetra,
                                  }),
                                  new TextRun({
                                    break: 1, // Esto agrega un salto de línea
                                  }),
                                  new TextRun({
                                    text: "   Asistente",
                                    font: tipoletra,
                                    size: tamanoLetra,
                                  }),
                                ],
                              }),
                              
                        ],
                      }),
                      new TableCell({
                        width: {
                          size: 60, // Half width
                          type: 'pct',
                        },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: " ",
                                font: tipoletra,
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
            ],
          }),
          new TableCell({
            width: {
              size: 50, // Half width
              type: 'pct',
            },
            children: [
              // Tabla interna en la segunda columna
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
                          size: 40, // Half width
                          type: 'pct',
                        },
                        children: [
                            new Paragraph({
                                children: [
                                  new TextRun({
                                    text: "   Firma",
                                    font: tipoletra,
                                    size: tamanoLetra,
                                  }),
                                  new TextRun({
                                    break: 1, // Esto agrega un salto de línea
                                  }),
                                  new TextRun({
                                    text: "   Capacitador",
                                    font: tipoletra,
                                    size: tamanoLetra,
                                  }),
                                ],
                              }),
                              
                        ],
                      }),
                      new TableCell({
                        width: {
                          size: 60, // Half width
                          type: 'pct',
                        },
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({
                                text: " ",
                                font: tipoletra,
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
            ],
          }),
        ],
      }),
    ],
  })
  
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
const Evaluacion = ({ id }) => {
  return (
    <Button type="primary" icon={<FileWordFilled />} onClick={() => generateWordDocument(id)} />
  );
};

export default Evaluacion;
