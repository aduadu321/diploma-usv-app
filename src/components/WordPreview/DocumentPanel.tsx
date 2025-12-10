import { useState } from 'react'
import { FileText, Download, Eye, Settings } from 'lucide-react'
import { useVehicleStore } from '../../store/vehicleStore'

type ChapterType = 'cap2' | 'cap3' | 'cap4' | 'cap5' | 'full'

export default function DocumentPanel() {
  const { vehicle } = useVehicleStore()
  const [selectedChapter, setSelectedChapter] = useState<ChapterType>('cap2')
  const [previewMode, setPreviewMode] = useState(false)

  const chapters = [
    { id: 'cap2', label: 'Cap. 2 - Parametri Principali', description: 'Dimensiuni, mase, organizare' },
    { id: 'cap3', label: 'Cap. 3 - Condiții Autopropulsare', description: 'Rezistențe la înaintare' },
    { id: 'cap4', label: 'Cap. 4 - Calcul Tracțiune', description: 'Motor, transmisie, raporturi' },
    { id: 'cap5', label: 'Cap. 5 - Performanțe', description: 'Dinamice, demarare, frânare' },
    { id: 'full', label: 'Document Complet', description: 'Toate capitolele' }
  ] as const

  const generateDocument = async () => {
    // This will use docx.js to generate the Word document
    console.log('Generating document for chapter:', selectedChapter)
    console.log('Vehicle data:', vehicle)
    // Implementation will come in phase 6
  }

  const downloadDocument = async () => {
    // Export to .docx
    console.log('Downloading document...')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Generator Document Word
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Export conform formatării USV (Arial 12pt, 1.5 spațiere, margini 2.5cm)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              previewMode
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          <button
            onClick={downloadDocument}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export DOCX
          </button>
        </div>
      </div>

      {/* Chapter selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => setSelectedChapter(chapter.id)}
            className={`px-4 py-2 rounded-lg transition-colors text-left ${
              selectedChapter === chapter.id
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-700'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="block font-medium">{chapter.label}</span>
            <span className="text-xs opacity-70">{chapter.description}</span>
          </button>
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 grid grid-cols-3 gap-6 overflow-hidden">
        {/* Document settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm overflow-auto">
          <h3 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Setări Document
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                Student
              </label>
              <input
                type="text"
                placeholder="Nume Prenume"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                Coordonator
              </label>
              <input
                type="text"
                placeholder="Prof. dr. ing. ..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                Titlu Proiect
              </label>
              <input
                type="text"
                value={vehicle.nume}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                readOnly
              />
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>Formatare:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Font: Arial 12pt</li>
                <li>Spațiere: 1.5 linii</li>
                <li>Margini: 2.5 cm (toate)</li>
                <li>Indent: 1.27 cm</li>
                <li>Tabele: titlu dreapta, sus</li>
                <li>Figuri: titlu centrat, jos</li>
                <li>Ecuații: centrate, nr. dreapta</li>
              </ul>
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded" defaultChecked />
                Include formule
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded" defaultChecked />
                Include diagrame
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded" defaultChecked />
                Include tabele date
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input type="checkbox" className="rounded" />
                Generează și PDF
              </label>
            </div>
          </div>
        </div>

        {/* Preview area */}
        <div className="col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Preview Document
            </h3>
            <span className="text-sm text-gray-500">
              {chapters.find(c => c.id === selectedChapter)?.label}
            </span>
          </div>

          <div className="flex-1 overflow-auto p-6 bg-gray-100 dark:bg-gray-900">
            {/* Simulated A4 page */}
            <div className="mx-auto bg-white shadow-lg" style={{ width: '210mm', minHeight: '297mm', padding: '25mm' }}>
              {/* Header */}
              <div className="text-center mb-8">
                <p className="text-sm text-gray-500">UNIVERSITATEA „ȘTEFAN CEL MARE" DIN SUCEAVA</p>
                <p className="text-sm text-gray-500">Facultatea de Inginerie Mecanică, Mecatronică și Management</p>
                <p className="text-sm text-gray-500 mb-4">Departamentul de Mecanică și Tehnologii</p>
              </div>

              {/* Title */}
              <h1 className="text-xl font-bold text-center mb-6">
                {selectedChapter === 'cap2' && '2. Alegerea parametrilor principali ai autovehiculului'}
                {selectedChapter === 'cap3' && '3. Definirea condițiilor de autopropulsare'}
                {selectedChapter === 'cap4' && '4. Calculul de tracțiune'}
                {selectedChapter === 'cap5' && '5. Performanțele automobilului'}
                {selectedChapter === 'full' && 'PROIECT DE DIPLOMĂ'}
              </h1>

              {/* Sample content */}
              <div className="text-justify leading-relaxed" style={{ fontFamily: 'Arial', fontSize: '12pt' }}>
                <p className="mb-4" style={{ textIndent: '1.27cm' }}>
                  Autovehiculul proiectat este un {vehicle.nume} cu următorii parametri principali:
                </p>

                <p className="text-right text-sm text-gray-500 mb-2">
                  Tabelul 2.1. Parametrii dimensionali ai autovehiculului
                </p>
                <table className="w-full border-collapse border border-gray-400 text-sm mb-4">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 p-2 text-left">Parametru</th>
                      <th className="border border-gray-400 p-2 text-left">Valoare</th>
                      <th className="border border-gray-400 p-2 text-left">Unitate</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 p-2">Lungime</td>
                      <td className="border border-gray-400 p-2">{vehicle.dimensiuni.lungime}</td>
                      <td className="border border-gray-400 p-2">mm</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 p-2">Lățime</td>
                      <td className="border border-gray-400 p-2">{vehicle.dimensiuni.latime}</td>
                      <td className="border border-gray-400 p-2">mm</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 p-2">Înălțime</td>
                      <td className="border border-gray-400 p-2">{vehicle.dimensiuni.inaltime}</td>
                      <td className="border border-gray-400 p-2">mm</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 p-2">Ampatament</td>
                      <td className="border border-gray-400 p-2">{vehicle.dimensiuni.ampatament}</td>
                      <td className="border border-gray-400 p-2">mm</td>
                    </tr>
                  </tbody>
                </table>

                <p className="mb-4" style={{ textIndent: '1.27cm' }}>
                  Masa totală a autovehiculului este de {vehicle.masa.masaTotala} kg, cu o repartizare de {vehicle.masa.repartizareFata}% pe puntea față și {vehicle.masa.repartizareSpate}% pe puntea spate.
                </p>

                <p className="mb-4" style={{ textIndent: '1.27cm' }}>
                  Motorul este de tip {vehicle.motor.tip} cu cilindreea de {vehicle.motor.cilindree} cm³, dezvoltând o putere maximă de {vehicle.motor.putereMaxima} kW la {vehicle.motor.turatiePutereMax} rot/min și un cuplu maxim de {vehicle.motor.cuplMaxim} N·m la {vehicle.motor.turatieCuplMax} rot/min.
                </p>
              </div>

              {/* Footer */}
              <div className="absolute bottom-6 left-0 right-0 text-center text-sm text-gray-400">
                - 1 -
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
