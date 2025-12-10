import { useState, useEffect } from 'react'
import { Download, RefreshCw, AlertCircle, Loader2 } from 'lucide-react'
import { useVehicleStore } from '../../store/vehicleStore'
import { useAppStore } from '../../store/appStore'
import TractionChart from './TractionChart'
import PowerChart from './PowerChart'
import DynamicChart from './DynamicChart'
import AccelerationChart from './AccelerationChart'
import DemarareChart from './DemarareChart'
import EngineChart from './EngineChart'

type ChartType = 'motor' | 'tractiune' | 'puteri' | 'dinamic' | 'acceleratii' | 'demarare'

interface CalculationResults {
  tractiune?: any
  performante?: any
}

export default function ChartsPanel() {
  const [activeChart, setActiveChart] = useState<ChartType>('motor')
  const [results, setResults] = useState<CalculationResults | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { vehicle } = useVehicleStore()
  const { backendConnected } = useAppStore()

  const charts = [
    { id: 'motor', label: 'Caracteristica Motor', description: 'Pe, Me = f(n)' },
    { id: 'tractiune', label: 'Caracteristica de Tracțiune', description: 'Ft = f(v)' },
    { id: 'puteri', label: 'Caracteristica Puterilor', description: 'P = f(v)' },
    { id: 'dinamic', label: 'Caracteristica Dinamică', description: 'D = f(v)' },
    { id: 'acceleratii', label: 'Caracteristica Accelerațiilor', description: 'a = f(v)' },
    { id: 'demarare', label: 'Timp/Spațiu Demarare', description: 't, s = f(v)' }
  ] as const

  const fetchCalculations = async () => {
    if (!backendConnected) {
      setError('Backend Python nu este conectat')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const [tractionRes, performanceRes] = await Promise.all([
        fetch('http://localhost:8000/calculate/tractiune', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehicle)
        }),
        fetch('http://localhost:8000/calculate/performante', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(vehicle)
        })
      ])

      if (!tractionRes.ok || !performanceRes.ok) {
        throw new Error('Eroare la calculul datelor')
      }

      const tractiune = await tractionRes.json()
      const performante = await performanceRes.json()

      setResults({ tractiune, performante })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (backendConnected) {
      fetchCalculations()
    }
  }, [backendConnected])

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-full flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          <span className="ml-2 text-gray-500">Se calculează...</span>
        </div>
      )
    }

    if (error) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
            <p className="text-red-500">{error}</p>
            <button
              onClick={fetchCalculations}
              className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Reîncearcă
            </button>
          </div>
        </div>
      )
    }

    if (!results) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Apasă pentru a genera graficele</p>
            <button
              onClick={fetchCalculations}
              disabled={!backendConnected}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              Calculează
            </button>
          </div>
        </div>
      )
    }

    switch (activeChart) {
      case 'motor':
        return results.tractiune?.caracteristica_motor ? (
          <EngineChart
            data={results.tractiune.caracteristica_motor}
            putereMax={results.tractiune.parametri_motor.putere_maxima_kW}
            turatiePutere={results.tractiune.parametri_motor.turatie_putere_max}
            cuplMax={results.tractiune.parametri_motor.cuplu_maxim_calculat_Nm}
            turatieCuplu={results.tractiune.parametri_motor.turatie_cuplu_max || 4000}
          />
        ) : null

      case 'tractiune':
        return results.performante?.caracteristica_tractiune ? (
          <TractionChart
            data={results.performante.caracteristica_tractiune}
            showResistance={true}
          />
        ) : null

      case 'puteri':
        return results.performante?.caracteristica_puteri ? (
          <PowerChart data={results.performante.caracteristica_puteri} />
        ) : null

      case 'dinamic':
        return results.performante?.caracteristica_dinamica ? (
          <DynamicChart
            data={results.performante.caracteristica_dinamica}
            coefRulare={vehicle.pneu.coefRulare}
          />
        ) : null

      case 'acceleratii':
        return results.performante?.caracteristica_acceleratii ? (
          <AccelerationChart data={results.performante.caracteristica_acceleratii} />
        ) : null

      case 'demarare':
        return results.performante?.demarare ? (
          <DemarareChart data={results.performante.demarare} />
        ) : null

      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Grafice și Diagrame
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Conform Cap. 4-5 - Tracțiune și Performanțe
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchCalculations}
            disabled={isLoading || !backendConnected}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizează
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <Download className="w-4 h-4" />
            Export PNG
          </button>
        </div>
      </div>

      {/* Chart selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {charts.map((chart) => (
          <button
            key={chart.id}
            onClick={() => setActiveChart(chart.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeChart === chart.id
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="block font-medium">{chart.label}</span>
            <span className="text-xs opacity-70">{chart.description}</span>
          </button>
        ))}
      </div>

      {/* Chart area */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {renderChart()}
      </div>

      {/* Performance summary */}
      {results?.performante?.performante_cheie && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <h4 className="font-medium text-gray-800 dark:text-white mb-3">Performanțe Cheie</h4>
          <div className="grid grid-cols-5 gap-4 text-sm">
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Viteză max</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {results.performante.performante_cheie.viteza_maxima_kmh} km/h
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">0-100 km/h</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {results.performante.performante_cheie.timp_0_100_s} s
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Accelerație max</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {results.performante.performante_cheie.acceleratie_maxima_m_s2} m/s²
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Pantă max</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {results.performante.performante_cheie.panta_maxima_grade}°
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Spațiu 0-100</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {results.performante.performante_cheie.spatiu_0_100_m} m
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
