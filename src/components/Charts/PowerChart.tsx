import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'

interface PowerData {
  treapta: number
  viteze_kmh: number[]
  putere_tractiune_kW: number[]
  putere_rezistenta_kW: number[]
}

interface PowerChartProps {
  data: PowerData[]
  title?: string
}

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6']

export default function PowerChart({
  data,
  title = 'Caracteristica Puterilor'
}: PowerChartProps) {
  const traces: Data[] = []

  // Curbe putere tracțiune
  data.forEach((treapta, idx) => {
    traces.push({
      x: treapta.viteze_kmh,
      y: treapta.putere_tractiune_kW,
      type: 'scatter',
      mode: 'lines',
      name: `Pt - Treapta ${treapta.treapta}`,
      line: {
        color: COLORS[idx % COLORS.length],
        width: 2
      },
      hovertemplate: 'v = %{x:.1f} km/h<br>Pt = %{y:.1f} kW<extra></extra>'
    })
  })

  // Curbă putere rezistență (una singură, de la prima treaptă)
  if (data[0]?.putere_rezistenta_kW) {
    traces.push({
      x: data[0].viteze_kmh,
      y: data[0].putere_rezistenta_kW,
      type: 'scatter',
      mode: 'lines',
      name: 'Pr - Rezistență',
      line: {
        color: '#6b7280',
        width: 2,
        dash: 'dash'
      },
      hovertemplate: 'v = %{x:.1f} km/h<br>Pr = %{y:.1f} kW<extra></extra>'
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
      zerolinecolor: '#9ca3af'
    },
    yaxis: {
      title: 'Puterea P [kW]',
      gridcolor: '#e5e7eb',
      zeroline: true,
      zerolinecolor: '#9ca3af'
    },
    legend: {
      x: 0,
      y: 1,
      bgcolor: 'rgba(255,255,255,0.8)'
    },
    margin: { t: 50, r: 20, b: 50, l: 70 },
    hovermode: 'closest',
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    annotations: [{
      x: 0.5,
      y: -0.15,
      xref: 'paper',
      yref: 'paper',
      text: 'Pt - putere tracțiune, Pr - putere rezistență',
      showarrow: false,
      font: { size: 10, color: '#6b7280' }
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
          filename: 'caracteristica_puteri',
          scale: 2
        }
      }}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
