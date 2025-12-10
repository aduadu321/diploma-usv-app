import { useState, useEffect, useRef } from 'react'
import { Plus, Copy, Trash2, Book } from 'lucide-react'
import katex from 'katex'

interface Formula {
  id: string
  name: string
  latex: string
  description: string
}

const PREDEFINED_FORMULAS: Formula[] = [
  {
    id: 'rolling',
    name: 'Rezistența la rulare',
    latex: 'F_r = f \\cdot G \\cdot \\cos\\alpha',
    description: 'f - coeficient rulare, G - greutate [N], α - unghi pantă [rad]'
  },
  {
    id: 'air',
    name: 'Rezistența aerodinamică',
    latex: 'F_a = \\frac{1}{2} \\cdot \\rho \\cdot C_x \\cdot A \\cdot v^2',
    description: 'ρ - densitate aer [kg/m³], Cx - coef. aerodinamic, A - arie frontală [m²], v - viteză [m/s]'
  },
  {
    id: 'grade',
    name: 'Rezistența la pantă',
    latex: 'F_p = G \\cdot \\sin\\alpha',
    description: 'G - greutate [N], α - unghi pantă [rad]'
  },
  {
    id: 'traction',
    name: 'Forța de tracțiune',
    latex: 'F_t = \\frac{M_e \\cdot i_t \\cdot \\eta_t}{r_d}',
    description: 'Me - cuplu motor [N·m], it - raport total, ηt - randament, rd - rază dinamică [m]'
  },
  {
    id: 'dynamic',
    name: 'Factorul dinamic',
    latex: 'D = \\frac{F_t - F_a}{G}',
    description: 'Ft - forță tracțiune [N], Fa - rezistență aer [N], G - greutate [N]'
  },
  {
    id: 'acceleration',
    name: 'Accelerația',
    latex: 'a = \\frac{(D - f) \\cdot g}{\\delta}',
    description: 'D - factor dinamic, f - coef. rulare, g - 9.81 m/s², δ - factor mase rotative'
  },
  {
    id: 'engine',
    name: 'Caracteristica motor',
    latex: 'P_e = P_{max} \\cdot \\left( a \\cdot \\frac{n}{n_P} + b \\cdot \\left(\\frac{n}{n_P}\\right)^2 - c \\cdot \\left(\\frac{n}{n_P}\\right)^3 \\right)',
    description: 'Formula Leiderman-Khlystov: a=0.87, b=1.13, c=1.0 (benzină)'
  },
  {
    id: 'torque',
    name: 'Cuplu motor',
    latex: 'M_e = \\frac{P_e \\cdot 1000 \\cdot 60}{2\\pi \\cdot n}',
    description: 'Pe - putere [kW], n - turație [rot/min]'
  },
  {
    id: 'max_ratio',
    name: 'Raport maxim transmisie',
    latex: 'i_{max} = \\frac{G \\cdot \\psi_{max} \\cdot r_d}{M_{max} \\cdot \\eta_t}',
    description: 'ψmax - coef. rezistență totală maximă, Mmax - cuplu maxim'
  },
  {
    id: 'braking_dist',
    name: 'Distanța de frânare',
    latex: 's_{fr} = \\frac{v^2}{2 \\cdot a_{fr}}',
    description: 'v - viteză inițială [m/s], afr - decelerație [m/s²]'
  }
]

export default function FormulaPanel() {
  const [customLatex, setCustomLatex] = useState('')
  const [selectedFormula, setSelectedFormula] = useState<Formula | null>(null)
  const [customFormulas, setCustomFormulas] = useState<Formula[]>([])
  const previewRef = useRef<HTMLDivElement>(null)

  // Render KaTeX preview
  useEffect(() => {
    if (previewRef.current && customLatex) {
      try {
        katex.render(customLatex, previewRef.current, {
          throwOnError: false,
          displayMode: true
        })
      } catch {
        previewRef.current.innerHTML = '<span class="text-red-500">Eroare LaTeX</span>'
      }
    }
  }, [customLatex])

  const copyToClipboard = (latex: string) => {
    navigator.clipboard.writeText(latex)
  }

  const addCustomFormula = () => {
    if (customLatex) {
      const newFormula: Formula = {
        id: `custom-${Date.now()}`,
        name: 'Formulă personalizată',
        latex: customLatex,
        description: 'Adăugată de utilizator'
      }
      setCustomFormulas([...customFormulas, newFormula])
      setCustomLatex('')
    }
  }

  const renderFormulaPreview = (latex: string) => {
    try {
      return { __html: katex.renderToString(latex, { throwOnError: false, displayMode: false }) }
    } catch {
      return { __html: '<span class="text-red-500">Eroare</span>' }
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Editor Formule
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Scriere și vizualizare formule LaTeX
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6 overflow-hidden">
        {/* Left: Formula library */}
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
              <Book className="w-5 h-5" />
              Bibliotecă Formule Automotive
            </h3>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {PREDEFINED_FORMULAS.map((formula) => (
              <div
                key={formula.id}
                onClick={() => {
                  setSelectedFormula(formula)
                  setCustomLatex(formula.latex)
                }}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedFormula?.id === formula.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-300 dark:border-primary-700'
                    : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-800 dark:text-white text-sm">
                    {formula.name}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyToClipboard(formula.latex)
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                    title="Copiază LaTeX"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div
                  className="text-center py-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600"
                  dangerouslySetInnerHTML={renderFormulaPreview(formula.latex)}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {formula.description}
                </p>
              </div>
            ))}

            {/* Custom formulas */}
            {customFormulas.length > 0 && (
              <>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 pt-4">
                  Formule personalizate
                </div>
                {customFormulas.map((formula) => (
                  <div
                    key={formula.id}
                    className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800 dark:text-white text-sm">
                        {formula.name}
                      </span>
                      <button
                        onClick={() => setCustomFormulas(customFormulas.filter(f => f.id !== formula.id))}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div
                      className="text-center py-2 bg-white dark:bg-gray-800 rounded"
                      dangerouslySetInnerHTML={renderFormulaPreview(formula.latex)}
                    />
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Right: Editor */}
        <div className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-white">
              Editor LaTeX
            </h3>
          </div>

          {/* Preview */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Preview:</p>
            <div
              ref={previewRef}
              className="min-h-[60px] flex items-center justify-center text-2xl text-gray-800 dark:text-white"
            >
              {!customLatex && (
                <span className="text-gray-400">Introdu o formulă LaTeX...</span>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 flex-1 flex flex-col">
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Cod LaTeX:
            </label>
            <textarea
              value={customLatex}
              onChange={(e) => setCustomLatex(e.target.value)}
              placeholder="Ex: F_t = \frac{M_e \cdot i_t}{r_d}"
              className="flex-1 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-mono text-sm resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />

            {/* Quick symbols */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Simboluri rapide:</p>
              <div className="flex flex-wrap gap-1">
                {['\\frac{}{}', '\\sqrt{}', '^2', '_{}', '\\cdot', '\\alpha', '\\beta', '\\eta', '\\rho', '\\pi', '\\delta', '\\sum', '\\int'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => setCustomLatex(customLatex + sym)}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded font-mono"
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={addCustomFormula}
                disabled={!customLatex}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Adaugă la bibliotecă
              </button>
              <button
                onClick={() => copyToClipboard(customLatex)}
                disabled={!customLatex}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Copy className="w-4 h-4" />
                Copiază
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
