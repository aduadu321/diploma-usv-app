import { useState, useEffect } from 'react'
import { FileText, Download, Eye, Settings, Loader2, CheckCircle } from 'lucide-react'
import { useVehicleStore } from '../../store/vehicleStore'
import { useAppStore } from '../../store/appStore'
import { generateDiplomaDocument, downloadDocument } from '../../services/documentGenerator'

type ChapterType = 'cap2' | 'cap3' | 'cap4' | 'cap5' | 'full'

export default function DocumentPanel() {
  const { vehicle } = useVehicleStore()
  const { backendConnected } = useAppStore()

  const [selectedChapter, setSelectedChapter] = useState<ChapterType>('full')
  const [student, setStudent] = useState('')
  const [coordonator, setCoordonator] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [calculations, setCalculations] = useState<any>(null)

  const [includeFormulas, setIncludeFormulas] = useState(true)
  const [includeDiagrams, setIncludeDiagrams] = useState(true)
  const [includeTables, setIncludeTables] = useState(true)

  const chapters = [
    { id: 'cap2', label: 'Cap. 2 - Parametri Principali', description: 'Dimensiuni, mase, organizare' },
    { id: 'cap3', label: 'Cap. 3 - Condiții Autopropulsare', description: 'Rezistențe la înaintare' },
    { id: 'cap4', label: 'Cap. 4 - Calcul Tracțiune', description: 'Motor, transmisie, raporturi' },
    { id: 'cap5', label: 'Cap. 5 - Performanțe', description: 'Dinamice, demarare, frânare' },
    { id: 'full', label: 'Document Complet', description: 'Toate capitolele' }
  ] as const

  // Fetch calculations from backend
  useEffect(() => {
    const fetchCalculations = async () => {
      if (!backendConnected) return

      try {
        const response = await fetch('http://localhost:8000/calculate/all', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehicle)
        })

        if (response.ok) {
          const data = await response.json()
          setCalculations(data)
        }
      } catch (err) {
        console.error('Error fetching calculations:', err)
      }
    }

    fetchCalculations()
  }, [backendConnected, vehicle])

  const handleExport = async () => {
    setIsGenerating(true)
    setGenerated(false)

    try {
      const blob = await generateDiplomaDocument(vehicle, calculations, {
        student: student || 'Student Nume',
        coordonator: coordonator || 'Prof. dr. ing. Coordonator',
        titlu: vehicle.nume,
        an: new Date().getFullYear()
      })

      const filename = `Proiect_Diploma_${vehicle.nume.replace(/\s+/g, '_')}.docx`
      await downloadDocument(blob, filename)

      setGenerated(true)
      setTimeout(() => setGenerated(false), 3000)
    } catch (err) {
      console.error('Error generating document:', err)
    } finally {
      setIsGenerating(false)
    }
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
            onClick={handleExport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Se generează...
              </>
            ) : generated ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Descărcat!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export DOCX
              </>
            )}
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
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                placeholder="Nume Prenume"
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                Coordonator
              </label>
              <input
                type="text"
                value={coordonator}
                onChange={(e) => setCoordonator(e.target.value)}
                placeholder="Prof. dr. ing. ..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                Titlu Proiect
              </label>
              <input
                type="text"
                value={vehicle.nume}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white"
                readOnly
              />
            </div>

            <hr className="border-gray-200 dark:border-gray-700" />

            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>Formatare conformă USV:</strong></p>
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
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={includeFormulas}
                  onChange={(e) => setIncludeFormulas(e.target.checked)}
                />
                Include formule
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={includeDiagrams}
                  onChange={(e) => setIncludeDiagrams(e.target.checked)}
                />
                Include diagrame
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={includeTables}
                  onChange={(e) => setIncludeTables(e.target.checked)}
                />
                Include tabele date
              </label>
            </div>

            {/* Calculation status */}
            <hr className="border-gray-200 dark:border-gray-700" />
            <div className="text-xs">
              <p className="text-gray-500 mb-1">Status calcule:</p>
              <div className="space-y-1">
                <div className={`flex items-center gap-1 ${calculations?.rezistente ? 'text-green-600' : 'text-gray-400'}`}>
                  {calculations?.rezistente ? '✓' : '○'} Rezistențe
                </div>
                <div className={`flex items-center gap-1 ${calculations?.tractiune ? 'text-green-600' : 'text-gray-400'}`}>
                  {calculations?.tractiune ? '✓' : '○'} Tracțiune
                </div>
                <div className={`flex items-center gap-1 ${calculations?.performante ? 'text-green-600' : 'text-gray-400'}`}>
                  {calculations?.performante ? '✓' : '○'} Performanțe
                </div>
                <div className={`flex items-center gap-1 ${calculations?.franare ? 'text-green-600' : 'text-gray-400'}`}>
                  {calculations?.franare ? '✓' : '○'} Frânare
                </div>
              </div>
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
                <p className="text-sm text-gray-500 font-semibold">UNIVERSITATEA „ȘTEFAN CEL MARE" DIN SUCEAVA</p>
                <p className="text-sm text-gray-500">Facultatea de Inginerie Mecanică, Mecatronică și Management</p>
                <p className="text-sm text-gray-500 mb-4">Departamentul de Mecanică și Tehnologii</p>
              </div>

              {selectedChapter === 'full' ? (
                // Title page for full document
                <div className="text-center mt-16">
                  <h1 className="text-2xl font-bold mb-8">PROIECT DE DIPLOMĂ</h1>
                  <h2 className="text-xl font-semibold mb-16">{vehicle.nume}</h2>
                  <div className="text-right mt-24">
                    <p>Coordonator: <strong>{coordonator || 'Prof. dr. ing. ...'}</strong></p>
                    <p>Student: <strong>{student || 'Nume Prenume'}</strong></p>
                  </div>
                  <p className="mt-32">Suceava, {new Date().getFullYear()}</p>
                </div>
              ) : (
                // Chapter content
                <>
                  <h1 className="text-xl font-bold text-center mb-6">
                    {selectedChapter === 'cap2' && '2. ALEGEREA PARAMETRILOR PRINCIPALI AI AUTOVEHICULULUI'}
                    {selectedChapter === 'cap3' && '3. DEFINIREA CONDIȚIILOR DE AUTOPROPULSARE'}
                    {selectedChapter === 'cap4' && '4. CALCULUL DE TRACȚIUNE'}
                    {selectedChapter === 'cap5' && '5. PERFORMANȚELE AUTOMOBILULUI'}
                  </h1>

                  <div className="text-justify leading-relaxed" style={{ fontFamily: 'Arial', fontSize: '12pt' }}>
                    <p className="mb-4" style={{ textIndent: '1.27cm' }}>
                      Autovehiculul proiectat este un {vehicle.nume} cu următorii parametri principali:
                    </p>

                    <p className="text-right text-sm text-gray-500 mb-2 italic">
                      Tabelul 2.1. Parametrii dimensionali ai autovehiculului
                    </p>
                    <table className="w-full border-collapse border border-gray-400 text-sm mb-6">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-400 p-2 text-center">Parametru</th>
                          <th className="border border-gray-400 p-2 text-center">Valoare</th>
                          <th className="border border-gray-400 p-2 text-center">Unitate</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-400 p-2 text-center">Lungime</td>
                          <td className="border border-gray-400 p-2 text-center">{vehicle.dimensiuni.lungime}</td>
                          <td className="border border-gray-400 p-2 text-center">mm</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-2 text-center">Lățime</td>
                          <td className="border border-gray-400 p-2 text-center">{vehicle.dimensiuni.latime}</td>
                          <td className="border border-gray-400 p-2 text-center">mm</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-2 text-center">Înălțime</td>
                          <td className="border border-gray-400 p-2 text-center">{vehicle.dimensiuni.inaltime}</td>
                          <td className="border border-gray-400 p-2 text-center">mm</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-2 text-center">Ampatament</td>
                          <td className="border border-gray-400 p-2 text-center">{vehicle.dimensiuni.ampatament}</td>
                          <td className="border border-gray-400 p-2 text-center">mm</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-400 p-2 text-center">Masă totală</td>
                          <td className="border border-gray-400 p-2 text-center">{vehicle.masa.masaTotala}</td>
                          <td className="border border-gray-400 p-2 text-center">kg</td>
                        </tr>
                      </tbody>
                    </table>

                    <p className="mb-4" style={{ textIndent: '1.27cm' }}>
                      Masa totală a autovehiculului este de {vehicle.masa.masaTotala} kg, cu o repartizare de {vehicle.masa.repartizareFata}% pe puntea față și {vehicle.masa.repartizareSpate}% pe puntea spate.
                    </p>

                    <p className="mb-4" style={{ textIndent: '1.27cm' }}>
                      Motorul este de tip {vehicle.motor.tip} cu cilindreea de {vehicle.motor.cilindree} cm³, dezvoltând o putere maximă de {vehicle.motor.putereMaxima} kW la {vehicle.motor.turatiePutereMax} rot/min și un cuplu maxim de {vehicle.motor.cuplMaxim} N·m la {vehicle.motor.turatieCuplMax} rot/min.
                    </p>

                    {calculations?.performante?.performante_cheie && (
                      <>
                        <p className="text-right text-sm text-gray-500 mb-2 mt-6 italic">
                          Tabelul 5.1. Performanțele cheie ale autovehiculului
                        </p>
                        <table className="w-full border-collapse border border-gray-400 text-sm mb-4">
                          <thead>
                            <tr className="bg-gray-100">
                              <th className="border border-gray-400 p-2 text-center">Performanță</th>
                              <th className="border border-gray-400 p-2 text-center">Valoare</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-400 p-2 text-center">Viteza maximă</td>
                              <td className="border border-gray-400 p-2 text-center">{calculations.performante.performante_cheie.viteza_maxima_kmh} km/h</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-400 p-2 text-center">Timp 0-100 km/h</td>
                              <td className="border border-gray-400 p-2 text-center">{calculations.performante.performante_cheie.timp_0_100_s} s</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-400 p-2 text-center">Accelerație maximă</td>
                              <td className="border border-gray-400 p-2 text-center">{calculations.performante.performante_cheie.acceleratie_maxima_m_s2} m/s²</td>
                            </tr>
                            <tr>
                              <td className="border border-gray-400 p-2 text-center">Pantă maximă</td>
                              <td className="border border-gray-400 p-2 text-center">{calculations.performante.performante_cheie.panta_maxima_grade}°</td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Page number */}
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
