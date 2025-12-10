import { useState } from 'react'
import { Download, RefreshCw } from 'lucide-react'

type ChartType = 'tractiune' | 'puteri' | 'dinamic' | 'acceleratii' | 'demarare' | 'franare'

export default function ChartsPanel() {
  const [activeChart, setActiveChart] = useState<ChartType>('tractiune')

  const charts = [
    { id: 'tractiune', label: 'Caracteristica de Tracțiune', description: 'Ft = f(v)' },
    { id: 'puteri', label: 'Caracteristica Puterilor', description: 'P = f(v)' },
    { id: 'dinamic', label: 'Caracteristica Dinamică', description: 'D = f(v)' },
    { id: 'acceleratii', label: 'Caracteristica Accelerațiilor', description: 'a = f(v)' },
    { id: 'demarare', label: 'Timp/Spațiu Demarare', description: 't, s = f(v)' },
    { id: 'franare', label: 'Caracteristica Frânare', description: 'afr, sfr = f(v)' }
  ] as const

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Grafice și Diagrame
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Conform Cap. 5 - Performanțele automobilului
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4" />
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
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Graficul va fi afișat aici după efectuarea calculelor
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Plotly.js - {charts.find(c => c.id === activeChart)?.label}
            </p>
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 font-mono">
                {`<Plot data={...} layout={...} />`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Legend info */}
      <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <h4 className="font-medium text-gray-800 dark:text-white mb-2">Legendă</h4>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-blue-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Treapta I</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Treapta II</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-yellow-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Treapta III</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-orange-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Treapta IV</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Treapta V</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-gray-500 rounded border-dashed"></div>
            <span className="text-gray-600 dark:text-gray-400">Rezistențe</span>
          </div>
        </div>
      </div>
    </div>
  )
}
