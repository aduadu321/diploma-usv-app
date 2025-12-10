import { useState } from 'react'
import { Play, Download, AlertCircle, CheckCircle } from 'lucide-react'
import { useVehicleStore } from '../../store/vehicleStore'
import { useAppStore } from '../../store/appStore'

type CalcModule = 'rezistente' | 'tractiune' | 'performante' | 'franare'

export default function CalculationsPanel() {
  const { vehicle } = useVehicleStore()
  const { backendConnected } = useAppStore()
  const [activeModule, setActiveModule] = useState<CalcModule>('rezistente')
  const [isCalculating, setIsCalculating] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const modules = [
    { id: 'rezistente', label: 'Rezistențe la Înaintare', chapter: 'Cap. 3' },
    { id: 'tractiune', label: 'Calcul Tracțiune', chapter: 'Cap. 4' },
    { id: 'performante', label: 'Performanțe Dinamice', chapter: 'Cap. 5' },
    { id: 'franare', label: 'Performanțe Frânare', chapter: 'Cap. 5.3' }
  ] as const

  const runCalculation = async () => {
    if (!backendConnected) {
      setError('Backend-ul Python nu este conectat. Pornește serverul cu: npm run python:dev')
      return
    }

    setIsCalculating(true)
    setError(null)

    try {
      const response = await fetch(`http://localhost:8000/calculate/${activeModule}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicle)
      })

      if (!response.ok) {
        throw new Error('Eroare la calcul')
      }

      const data = await response.json()
      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Eroare necunoscută')
    } finally {
      setIsCalculating(false)
    }
  }

  const renderFormulas = () => {
    switch (activeModule) {
      case 'rezistente':
        return (
          <div className="space-y-4">
            <FormulaCard
              title="Rezistența la rulare"
              formula="F_r = f \cdot G \cdot \cos\alpha"
              description="f - coef. rulare, G - greutate, α - unghi pantă"
            />
            <FormulaCard
              title="Rezistența aerodinamică"
              formula="F_a = \frac{1}{2} \cdot \rho \cdot C_x \cdot A \cdot v^2"
              description="ρ - densitate aer, Cx - coef. aerodinamic, A - arie frontală, v - viteză"
            />
            <FormulaCard
              title="Rezistența la urcarea pantei"
              formula="F_p = G \cdot \sin\alpha"
              description="G - greutate, α - unghi pantă"
            />
            <FormulaCard
              title="Rezistența la accelerare"
              formula="F_j = \delta \cdot m \cdot a"
              description="δ - factor mase rotative, m - masă, a - accelerație"
            />
          </div>
        )

      case 'tractiune':
        return (
          <div className="space-y-4">
            <FormulaCard
              title="Forța de tracțiune"
              formula="F_t = \frac{M_e \cdot i_t \cdot \eta_t}{r_d}"
              description="Me - cuplu motor, it - raport total, ηt - randament, rd - rază dinamică"
            />
            <FormulaCard
              title="Caracteristica motor (Leiderman-Khlystov)"
              formula="P_e = P_{max} \cdot \left( a \cdot \frac{n}{n_P} + b \cdot \left(\frac{n}{n_P}\right)^2 - c \cdot \left(\frac{n}{n_P}\right)^3 \right)"
              description="a, b, c - coeficienți (benzină: 0.87, 1.13, 1.0)"
            />
            <FormulaCard
              title="Raport transmisie maxim"
              formula="i_{max} = \frac{G \cdot \psi_{max} \cdot r_d}{M_{max} \cdot \eta_t}"
              description="ψmax - coef. rezistență totală max, Mmax - cuplu maxim"
            />
          </div>
        )

      case 'performante':
        return (
          <div className="space-y-4">
            <FormulaCard
              title="Factorul dinamic"
              formula="D = \frac{F_t - F_a}{G}"
              description="Ft - forță tracțiune, Fa - rezistență aer, G - greutate"
            />
            <FormulaCard
              title="Accelerația"
              formula="a = \frac{(D - f) \cdot g}{\delta}"
              description="D - factor dinamic, f - coef. rulare, δ - factor mase rotative"
            />
            <FormulaCard
              title="Timpul de demarare"
              formula="t = \int_0^v \frac{dv}{a}"
              description="Integrat numeric din caracteristica accelerațiilor"
            />
            <FormulaCard
              title="Spațiul de demarare"
              formula="s = \int_0^v \frac{v \cdot dv}{a}"
              description="Integrat numeric"
            />
          </div>
        )

      case 'franare':
        return (
          <div className="space-y-4">
            <FormulaCard
              title="Decelerația maximă"
              formula="a_{fr} = \varphi \cdot g"
              description="φ - coef. aderență, g - accelerație gravitațională"
            />
            <FormulaCard
              title="Distanța de frânare"
              formula="s_{fr} = \frac{v^2}{2 \cdot a_{fr}}"
              description="v - viteză inițială, afr - decelerație"
            />
            <FormulaCard
              title="Repartizare forțe frânare"
              formula="\frac{F_{f}}{F_{s}} = \frac{L_2 + h_g \cdot \varphi}{L_1 - h_g \cdot \varphi}"
              description="L1, L2 - distanțe centru masă, hg - înălțime centru masă"
            />
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Calcule Tehnice
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Calcule conform ghidului USV Autovehicule Rutiere
          </p>
        </div>
        <button
          onClick={runCalculation}
          disabled={isCalculating || !backendConnected}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {isCalculating ? 'Se calculează...' : 'Rulează Calcul'}
        </button>
      </div>

      {/* Module tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => setActiveModule(module.id)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeModule === module.id
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-xs text-gray-400 block">{module.chapter}</span>
            {module.label}
          </button>
        ))}
      </div>

      {/* Error/Success message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {results && (
        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-300">
          <CheckCircle className="w-5 h-5" />
          Calcul finalizat cu succes!
        </div>
      )}

      {/* Content */}
      <div className="flex-1 grid grid-cols-2 gap-6 overflow-auto">
        {/* Formulas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm overflow-auto">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Formule de Calcul
          </h3>
          {renderFormulas()}
        </div>

        {/* Results */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm overflow-auto">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Rezultate
          </h3>
          {results ? (
            <pre className="text-sm text-gray-600 dark:text-gray-300 overflow-auto">
              {JSON.stringify(results, null, 2)}
            </pre>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              Apasă "Rulează Calcul" pentru a genera rezultatele.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

function FormulaCard({ title, formula, description }: { title: string; formula: string; description: string }) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <h4 className="font-medium text-gray-800 dark:text-white mb-2">{title}</h4>
      <div className="bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-600 mb-2 font-mono text-sm overflow-x-auto">
        {formula}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  )
}
