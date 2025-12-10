import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'

interface DemarareData {
  viteze_kmh: number[]
  timpi_s: number[]
  spatii_m: number[]
}

interface DemarareChartProps {
  data: DemarareData
  title?: string
}

export default function DemarareChart({
  data,
  title = 'Timpul și Spațiul de Demarare'
}: DemarareChartProps) {
  const traces: Data[] = [
    {
      x: data.viteze_kmh,
      y: data.timpi_s,
      type: 'scatter',
      mode: 'lines',
      name: 'Timp t(v)',
      yaxis: 'y',
      line: {
        color: '#3b82f6',
        width: 2
      },
      hovertemplate: 'v = %{x:.0f} km/h<br>t = %{y:.1f} s<extra></extra>'
    },
    {
      x: data.viteze_kmh,
      y: data.spatii_m,
      type: 'scatter',
      mode: 'lines',
      name: 'Spațiu s(v)',
      yaxis: 'y2',
      line: {
        color: '#22c55e',
        width: 2
      },
      hovertemplate: 'v = %{x:.0f} km/h<br>s = %{y:.0f} m<extra></extra>'
    }
  ]

  // Găsește indexul pentru 100 km/h
  const idx100 = data.viteze_kmh.findIndex(v => v >= 100)
  const t100 = idx100 !== -1 ? data.timpi_s[idx100] : null
  const s100 = idx100 !== -1 ? data.spatii_m[idx100] : null

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
      title: 'Timpul t [s]',
      titlefont: { color: '#3b82f6' },
      tickfont: { color: '#3b82f6' },
      gridcolor: '#e5e7eb',
      zeroline: true,
      zerolinecolor: '#9ca3af',
      side: 'left'
    },
    yaxis2: {
      title: 'Spațiul s [m]',
      titlefont: { color: '#22c55e' },
      tickfont: { color: '#22c55e' },
      overlaying: 'y',
      side: 'right',
      zeroline: false
    },
    legend: {
      x: 0.5,
      y: 1.1,
      xanchor: 'center',
      orientation: 'h',
      bgcolor: 'rgba(255,255,255,0.8)'
    },
    margin: { t: 70, r: 70, b: 50, l: 70 },
    hovermode: 'closest',
    plot_bgcolor: 'white',
    paper_bgcolor: 'white',
    annotations: t100 && s100 ? [
      {
        x: 100,
        y: t100,
        xref: 'x',
        yref: 'y',
        text: `0-100: ${t100.toFixed(1)}s`,
        showarrow: true,
        arrowhead: 2,
        ax: 40,
        ay: -30,
        font: { size: 11, color: '#3b82f6' }
      },
      {
        x: 100,
        y: s100,
        xref: 'x',
        yref: 'y2',
        text: `${s100.toFixed(0)}m`,
        showarrow: true,
        arrowhead: 2,
        ax: -40,
        ay: 30,
        font: { size: 11, color: '#22c55e' }
      }
    ] : []
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
          filename: 'demarare',
          scale: 2
        }
      }}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
