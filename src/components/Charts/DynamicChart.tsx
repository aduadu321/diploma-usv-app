import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'

interface DynamicData {
  treapta: number
  viteze_kmh: number[]
  factor_dinamic: number[]
}

interface DynamicChartProps {
  data: DynamicData[]
  coefRulare?: number
  title?: string
}

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6']

export default function DynamicChart({
  data,
  coefRulare = 0.012,
  title = 'Caracteristica Dinamică'
}: DynamicChartProps) {
  const traces: Data[] = []

  // Curbe factor dinamic
  data.forEach((treapta, idx) => {
    traces.push({
      x: treapta.viteze_kmh,
      y: treapta.factor_dinamic,
      type: 'scatter',
      mode: 'lines',
      name: `D - Treapta ${treapta.treapta}`,
      line: {
        color: COLORS[idx % COLORS.length],
        width: 2
      },
      hovertemplate: 'v = %{x:.1f} km/h<br>D = %{y:.4f}<extra></extra>'
    })
  })

  // Linie coeficient rulare (ψ = f pentru teren plan)
  const maxV = Math.max(...data.flatMap(d => d.viteze_kmh))
  traces.push({
    x: [0, maxV],
    y: [coefRulare, coefRulare],
    type: 'scatter',
    mode: 'lines',
    name: `f = ${coefRulare}`,
    line: {
      color: '#dc2626',
      width: 1,
      dash: 'dot'
    },
    hovertemplate: 'f = %{y:.4f}<extra>Coef. rulare</extra>'
  })

  // Linii pante tipice
  const pante = [5, 10, 15, 20]
  pante.forEach(panta => {
    const psi = coefRulare + Math.tan(panta * Math.PI / 180)
    traces.push({
      x: [0, maxV],
      y: [psi, psi],
      type: 'scatter',
      mode: 'lines',
      name: `${panta}%`,
      line: {
        color: '#9ca3af',
        width: 1,
        dash: 'dash'
      },
      showlegend: false,
      hovertemplate: `Pantă ${panta}°: ψ = %{y:.3f}<extra></extra>`
    })
  })

  const layout: Partial<Layout> = {
    title: {
      text: title,
      font: { size: 16, family: 'Arial' }
    },
    xaxis: {
      title: 'Viteza v [km/h]',
      gridcolor: '#e5e7eb',
      zeroline: true,
      zerolinecolor: '#9ca3af'
    },
    yaxis: {
      title: 'Factorul dinamic D [-]',
      gridcolor: '#e5e7eb',
      zeroline: true,
      zerolinecolor: '#9ca3af',
      range: [0, Math.max(...data.flatMap(d => d.factor_dinamic)) * 1.1]
    },
    legend: {
      x: 1,
      y: 1,
      xanchor: 'right',
      bgcolor: 'rgba(255,255,255,0.8)'
    },
    margin: { t: 50, r: 20, b: 50, l: 70 },
    hovermode: 'closest',
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    shapes: [{
      type: 'line',
      x0: 0,
      x1: maxV,
      y0: coefRulare,
      y1: coefRulare,
      line: { color: '#dc2626', width: 1, dash: 'dot' }
    }]
  }

  return (
    <Plot
      data={traces}
      layout={layout}
      config={{
        responsive: true,
        displayModeBar: true,
        toImageButtonOptions: {
          format: 'png',
          filename: 'caracteristica_dinamica',
          scale: 2
        }
      }}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
