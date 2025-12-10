import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'

interface TractionData {
  treapta: number
  viteze_kmh: number[]
  forte_tractiune_N: number[]
  forte_rezistenta_N?: number[]
}

interface TractionChartProps {
  data: TractionData[]
  title?: string
  showResistance?: boolean
}

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6']

export default function TractionChart({
  data,
  title = 'Caracteristica de Tracțiune',
  showResistance = true
}: TractionChartProps) {
  const traces: Data[] = []

  // Adăugare curbe tracțiune pentru fiecare treaptă
  data.forEach((treapta, idx) => {
    traces.push({
      x: treapta.viteze_kmh,
      y: treapta.forte_tractiune_N,
      type: 'scatter',
      mode: 'lines',
      name: `Treapta ${treapta.treapta}`,
      line: {
        color: COLORS[idx % COLORS.length],
        width: 2
      },
      hovertemplate: 'v = %{x:.1f} km/h<br>Ft = %{y:.0f} N<extra>Tr. %{fullData.name}</extra>'
    })
  })

  // Adăugare curbă rezistență (dacă există date)
  if (showResistance && data[0]?.forte_rezistenta_N) {
    traces.push({
      x: data[0].viteze_kmh,
      y: data[0].forte_rezistenta_N,
      type: 'scatter',
      mode: 'lines',
      name: 'Rezistență totală',
      line: {
        color: '#6b7280',
        width: 2,
        dash: 'dash'
      },
      hovertemplate: 'v = %{x:.1f} km/h<br>Fr = %{y:.0f} N<extra></extra>'
    })
  }

  const layout: Partial<Layout> = {
    title: {
      text: title,
      font: { size: 16, family: 'Arial' }
    },
    xaxis: {
      title: 'Viteza v [km/h]',
      gridcolor: '#e5e7eb',
      zeroline: true,
      zerolinecolor: '#9ca3af',
      range: [0, Math.max(...data.flatMap(d => d.viteze_kmh)) * 1.05]
    },
    yaxis: {
      title: 'Forța de tracțiune Ft [N]',
      gridcolor: '#e5e7eb',
      zeroline: true,
      zerolinecolor: '#9ca3af'
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
    paper_bgcolor: 'white'
  }

  return (
    <Plot
      data={traces}
      layout={layout}
      config={{
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToRemove: ['lasso2d', 'select2d'],
        toImageButtonOptions: {
          format: 'png',
          filename: 'caracteristica_tractiune',
          scale: 2
        }
      }}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
