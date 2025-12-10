import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'

interface AccelerationData {
  treapta: number
  viteze_kmh: number[]
  acceleratii_m_s2: number[]
}

interface AccelerationChartProps {
  data: AccelerationData[]
  title?: string
}

const COLORS = ['#3b82f6', '#22c55e', '#eab308', '#f97316', '#ef4444', '#8b5cf6']

export default function AccelerationChart({
  data,
  title = 'Caracteristica Accelerațiilor'
}: AccelerationChartProps) {
  const traces: Data[] = []

  data.forEach((treapta, idx) => {
    traces.push({
      x: treapta.viteze_kmh,
      y: treapta.acceleratii_m_s2,
      type: 'scatter',
      mode: 'lines',
      name: `Treapta ${treapta.treapta}`,
      line: {
        color: COLORS[idx % COLORS.length],
        width: 2
      },
      hovertemplate: 'v = %{x:.1f} km/h<br>a = %{y:.3f} m/s²<extra></extra>'
    })
  })

  // Înfășurătoare (envelope) - accelerația maximă la fiecare viteză
  const allViteze = [...new Set(data.flatMap(d => d.viteze_kmh))].sort((a, b) => a - b)
  const envelope: number[] = []

  allViteze.forEach(v => {
    let maxA = 0
    data.forEach(treapta => {
      const idx = treapta.viteze_kmh.findIndex(vel => Math.abs(vel - v) < 0.5)
      if (idx !== -1 && treapta.acceleratii_m_s2[idx] > maxA) {
        maxA = treapta.acceleratii_m_s2[idx]
      }
    })
    envelope.push(maxA)
  })

  traces.push({
    x: allViteze,
    y: envelope,
    type: 'scatter',
    mode: 'lines',
    name: 'Înfășurătoare',
    line: {
      color: '#000000',
      width: 3,
      dash: 'dot'
    },
    hovertemplate: 'v = %{x:.1f} km/h<br>a_max = %{y:.3f} m/s²<extra></extra>'
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
      title: 'Accelerația a [m/s²]',
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
        toImageButtonOptions: {
          format: 'png',
          filename: 'caracteristica_acceleratii',
          scale: 2
        }
      }}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
