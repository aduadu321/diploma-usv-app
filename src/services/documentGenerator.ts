import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  PageBreak,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  BorderStyle,
  convertInchesToTwip
} from 'docx'
import { VehicleParams } from '../types/vehicle'

// Conversie cm -> twips (1 cm = 567 twips)
const cmToTwip = (cm: number) => Math.round(cm * 567)

// Formatare USV
const USV_FORMAT = {
  margins: {
    top: cmToTwip(2.5),
    bottom: cmToTwip(2.5),
    left: cmToTwip(2.5),
    right: cmToTwip(2.5)
  },
  font: 'Arial',
  fontSize: 24, // 12pt în half-points
  lineSpacing: 360, // 1.5 linii (240 = single)
  firstLineIndent: cmToTwip(1.27)
}

interface DocumentOptions {
  student: string
  coordonator: string
  titlu: string
  an: number
}

export async function generateDiplomaDocument(
  vehicle: VehicleParams,
  calculations: any,
  options: DocumentOptions
): Promise<Blob> {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: USV_FORMAT.font,
            size: USV_FORMAT.fontSize
          },
          paragraph: {
            spacing: {
              line: USV_FORMAT.lineSpacing
            }
          }
        }
      }
    },
    sections: [
      {
        properties: {
          page: {
            margin: USV_FORMAT.margins
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'UNIVERSITATEA „ȘTEFAN CEL MARE" DIN SUCEAVA',
                    font: USV_FORMAT.font,
                    size: 20
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT]
                  })
                ]
              })
            ]
          })
        },
        children: [
          // Pagina de titlu
          ...generateTitlePage(options),

          // Capitolul 2 - Parametri principali
          new Paragraph({ children: [new PageBreak()] }),
          ...generateChapter2(vehicle),

          // Capitolul 3 - Condiții de autopropulsare
          new Paragraph({ children: [new PageBreak()] }),
          ...generateChapter3(vehicle, calculations?.rezistente),

          // Capitolul 4 - Calcul tracțiune
          new Paragraph({ children: [new PageBreak()] }),
          ...generateChapter4(vehicle, calculations?.tractiune),

          // Capitolul 5 - Performanțe
          new Paragraph({ children: [new PageBreak()] }),
          ...generateChapter5(calculations?.performante)
        ]
      }
    ]
  })

  return await Packer.toBlob(doc)
}

function generateTitlePage(options: DocumentOptions): Paragraph[] {
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: 'UNIVERSITATEA „ȘTEFAN CEL MARE" DIN SUCEAVA',
          bold: true,
          size: 28
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: 'Facultatea de Inginerie Mecanică, Mecatronică și Management',
          size: 24
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
      children: [
        new TextRun({
          text: 'Departamentul de Mecanică și Tehnologii',
          size: 24
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1200, after: 400 },
      children: [
        new TextRun({
          text: 'PROIECT DE DIPLOMĂ',
          bold: true,
          size: 36
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
      children: [
        new TextRun({
          text: options.titlu,
          bold: true,
          size: 32
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 800 },
      children: [
        new TextRun({ text: 'Coordonator: ', size: 24 }),
        new TextRun({ text: options.coordonator, bold: true, size: 24 })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { after: 800 },
      children: [
        new TextRun({ text: 'Student: ', size: 24 }),
        new TextRun({ text: options.student, bold: true, size: 24 })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 1600 },
      children: [
        new TextRun({
          text: `Suceava, ${options.an}`,
          size: 24
        })
      ]
    })
  ]
}

function generateChapter2(vehicle: VehicleParams): Paragraph[] {
  return [
    // Titlu capitol
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: '2. ALEGEREA PARAMETRILOR PRINCIPALI AI AUTOVEHICULULUI',
          bold: true,
          size: 28
        })
      ]
    }),

    // Subcapitol 2.1
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: '2.1. Soluția de organizare generală și amenajare interioară',
          bold: true,
          size: 26
        })
      ]
    }),

    new Paragraph({
      spacing: { after: 200 },
      indent: { firstLine: USV_FORMAT.firstLineIndent },
      children: [
        new TextRun({
          text: `Autovehiculul proiectat este un ${vehicle.nume}, având următoarele caracteristici principale de organizare:`,
          size: 24
        })
      ]
    }),

    // Tabel dimensiuni
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'Tabelul 2.1. Dimensiunile principale ale autovehiculului',
          italics: true,
          size: 22
        })
      ]
    }),

    createDimensionsTable(vehicle),

    // Subcapitol 2.2
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: '2.2. Masa autovehiculului și repartizarea pe punți',
          bold: true,
          size: 26
        })
      ]
    }),

    new Paragraph({
      alignment: AlignmentType.RIGHT,
      spacing: { before: 200, after: 100 },
      children: [
        new TextRun({
          text: 'Tabelul 2.2. Parametrii de masă ai autovehiculului',
          italics: true,
          size: 22
        })
      ]
    }),

    createMassTable(vehicle),

    // Subcapitol 2.3
    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: '2.3. Alegerea pneurilor și determinarea razelor roților',
          bold: true,
          size: 26
        })
      ]
    }),

    new Paragraph({
      spacing: { after: 200 },
      indent: { firstLine: USV_FORMAT.firstLineIndent },
      children: [
        new TextRun({
          text: `Pneurile alese sunt de dimensiune ${vehicle.pneu.dimensiune}, cu raza statică de ${vehicle.pneu.razaStatica} m și raza dinamică de ${vehicle.pneu.razaDinamica} m.`,
          size: 24
        })
      ]
    })
  ]
}

function generateChapter3(vehicle: VehicleParams, rezistente: any): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: '3. DEFINIREA CONDIȚIILOR DE AUTOPROPULSARE',
          bold: true,
          size: 28
        })
      ]
    }),

    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: '3.1. Rezistențele la înaintarea autovehiculului',
          bold: true,
          size: 26
        })
      ]
    }),

    new Paragraph({
      spacing: { after: 200 },
      indent: { firstLine: USV_FORMAT.firstLineIndent },
      children: [
        new TextRun({
          text: 'Rezistența la rulare se calculează cu relația:',
          size: 24
        })
      ]
    }),

    // Formula rezistență rulare
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 200 },
      children: [
        new TextRun({
          text: 'Fr = f · G · cos(α)                    (3.1)',
          size: 24
        })
      ]
    })
  ]

  if (rezistente) {
    paragraphs.push(
      new Paragraph({
        spacing: { after: 200 },
        indent: { firstLine: USV_FORMAT.firstLineIndent },
        children: [
          new TextRun({
            text: `Pentru autovehiculul proiectat, cu f = ${vehicle.pneu.coefRulare} și G = ${rezistente.parametri_intrare?.greutate_N} N, rezultă Fr = ${rezistente.rezistenta_rulare?.valoare_N} N.`,
            size: 24
          })
        ]
      })
    )
  }

  return paragraphs
}

function generateChapter4(vehicle: VehicleParams, tractiune: any): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: '4. CALCULUL DE TRACȚIUNE',
          bold: true,
          size: 28
        })
      ]
    }),

    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: '4.1. Alegerea mărimii randamentului transmisiei',
          bold: true,
          size: 26
        })
      ]
    }),

    new Paragraph({
      spacing: { after: 200 },
      indent: { firstLine: USV_FORMAT.firstLineIndent },
      children: [
        new TextRun({
          text: `Randamentul transmisiei adoptat este ηt = ${vehicle.transmisie.randamentTransmisie}.`,
          size: 24
        })
      ]
    }),

    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: '4.2. Determinarea caracteristicii exterioare a motorului',
          bold: true,
          size: 26
        })
      ]
    }),

    new Paragraph({
      spacing: { after: 200 },
      indent: { firstLine: USV_FORMAT.firstLineIndent },
      children: [
        new TextRun({
          text: `Motorul ales este de tip ${vehicle.motor.tip}, cu cilindreea de ${vehicle.motor.cilindree} cm³, puterea maximă de ${vehicle.motor.putereMaxima} kW la ${vehicle.motor.turatiePutereMax} rot/min și cuplul maxim de ${vehicle.motor.cuplMaxim} N·m la ${vehicle.motor.turatieCuplMax} rot/min.`,
          size: 24
        })
      ]
    })
  ]

  return paragraphs
}

function generateChapter5(performante: any): Paragraph[] {
  const paragraphs: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: '5. PERFORMANȚELE AUTOMOBILULUI',
          bold: true,
          size: 28
        })
      ]
    }),

    new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: '5.1. Performanțele dinamice de trecere',
          bold: true,
          size: 26
        })
      ]
    })
  ]

  if (performante?.performante_cheie) {
    paragraphs.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 200, after: 100 },
        children: [
          new TextRun({
            text: 'Tabelul 5.1. Performanțele cheie ale autovehiculului',
            italics: true,
            size: 22
          })
        ]
      }),
      createPerformanceTable(performante.performante_cheie)
    )
  }

  return paragraphs
}

function createDimensionsTable(vehicle: VehicleParams): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow(['Parametru', 'Valoare', 'Unitate'], true),
      createTableRow(['Lungime', vehicle.dimensiuni.lungime.toString(), 'mm']),
      createTableRow(['Lățime', vehicle.dimensiuni.latime.toString(), 'mm']),
      createTableRow(['Înălțime', vehicle.dimensiuni.inaltime.toString(), 'mm']),
      createTableRow(['Ampatament', vehicle.dimensiuni.ampatament.toString(), 'mm']),
      createTableRow(['Ecartament față', vehicle.dimensiuni.ecartamentFata.toString(), 'mm']),
      createTableRow(['Ecartament spate', vehicle.dimensiuni.ecartamentSpate.toString(), 'mm']),
      createTableRow(['Gardă la sol', vehicle.dimensiuni.gardaSol.toString(), 'mm'])
    ]
  })
}

function createMassTable(vehicle: VehicleParams): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow(['Parametru', 'Valoare', 'Unitate'], true),
      createTableRow(['Masa în gol', vehicle.masa.masaGoala.toString(), 'kg']),
      createTableRow(['Masa totală', vehicle.masa.masaTotala.toString(), 'kg']),
      createTableRow(['Capacitate încărcare', vehicle.masa.capacitateIncarcare.toString(), 'kg']),
      createTableRow(['Repartizare față', vehicle.masa.repartizareFata.toString(), '%']),
      createTableRow(['Repartizare spate', vehicle.masa.repartizareSpate.toString(), '%'])
    ]
  })
}

function createPerformanceTable(perf: any): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      createTableRow(['Performanță', 'Valoare'], true),
      createTableRow(['Viteza maximă', `${perf.viteza_maxima_kmh} km/h`]),
      createTableRow(['Timp 0-100 km/h', `${perf.timp_0_100_s} s`]),
      createTableRow(['Accelerație maximă', `${perf.acceleratie_maxima_m_s2} m/s²`]),
      createTableRow(['Pantă maximă', `${perf.panta_maxima_grade}° (${perf.panta_maxima_procente}%)`]),
      createTableRow(['Spațiu 0-100 km/h', `${perf.spatiu_0_100_m} m`])
    ]
  })
}

function createTableRow(cells: string[], isHeader = false): TableRow {
  return new TableRow({
    children: cells.map(
      (text) =>
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text,
                  bold: isHeader,
                  size: 22
                })
              ]
            })
          ],
          shading: isHeader ? { fill: 'E0E0E0' } : undefined
        })
    )
  })
}

export async function downloadDocument(blob: Blob, filename: string): Promise<void> {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
