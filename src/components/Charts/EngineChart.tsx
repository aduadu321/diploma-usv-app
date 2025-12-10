import Plot from 'react-plotly.js'
import { Data, Layout } from 'plotly.js'

interface EngineData {
  turatii_rot_min: number[]
  puteri_kW: number[]
  cupluri_Nm: number[]
}

interface EngineChartProps {
  data: EngineData
  putereMax?: number
  turatiePutere?: number
  cuplMax?: number
  turatieCuplu?: number
  title?: string
}

export default function EngineChart({
  data,
  putereMax,
  turatiePutere,
  cuplMax,
  turatieCuplu,
  title = 'Caracteristica Exterioară a Motorului'
}: EngineChartProps) {
  const traces: Data[] = [
    {
      x: data.turatii_rot_min,
      y: data.puteri_kW,
      type: 'scatter',
      mode: 'lines',
      name: 'Putere Pe',
      yaxis: 'y',
      line: {
        color: '#ef4444',
        width: 2.5
      },
      fill: 'tozeroy',
      fillcolor: 'rgba(239, 68, 68, 0.1)',
      hovertemplate: 'n = %{x:.0f} rot/min<br>Pe = %{y:.1f} kW<extra></extra>'
    },
    {
      x: data.turatii_rot_min,
      y: data.cupluri_Nm,
      type: 'scatter',
      mode: 'lines',
      name: 'Cuplu Me',
      yaxis: 'y2',
      line: {
        color: '#3b82f6',
        width: 2.5
      },
      hovertemplate: 'n = %{x:.0f} rot/min<br>Me = %{y:.0f} N·m<extra></extra>'
    }
  ]

  // Markere pentru valori maxime
  if (putereMax && turatiePutere) {
    traces.push({
      x: [turatiePutere],
      y: [putereMax],
      type: 'scatter',
      mode: 'markers+text',
      name: 'P_max',
      yaxis: 'y',
      marker: { color: '#ef4444', size: 10, symbol: 'circle' },
      text: [`${putereMax} kW`],
      textposition: 'top center',
      textfont: { size: 11, color: '#ef4444' },
      showlegend: false,
      hoverinfo: 'skip'
    })
  }

  if (cuplMax && turatieCuplu) {
    traces.push({
      x: [turatieCuplu],
      y: [cuplMax],
      type: 'scatter',
      mode: 'markers+text',
      name: 'M_max',
      yaxis: 'y2',
      marker: { color: '#3b82f6', size: 10, symbol: 'circle' },
      text: [`${cuplMax} N·m`],
      textposition: 'top center',
      textfont: { size: 11, color: '#3b82f6' },
      showlegend: false,
      hoverinfo: 'skip'
    })
  }

  const layout: Partial<Layout> = {
    title: {
      text: title,
      font: { size: 16, family: 'Arial' }
    },
    xaxis: {
      title: 'Turația n [rot/min]',
      gridcolor: '#e5e7eb',
      zeroline: true,
      zerolinecolor: '#9ca3af',
      range: [0, Math.max(...data.turatii_rot_min) * 1.05]
    },
    yaxis: {
      title: 'Puterea Pe [kW]',
      titlefont: { color: '#ef4444' },
      tickfont: { color: '#ef4444' },
      gridcolor: '#e5e7eb',
      zeroline: true,
      zerolinecolor: '#9ca3af',
      side: 'left',
      range: [0, Math.max(...data.puteri_kW) * 1.15]
    },
    yaxis2: {
      title: 'Cuplul Me [N·m]',
      titlefont: { color: '#3b82f6' },
      tickfont: { color: '#3b82f6' },
      overlaying: 'y',
      side: 'right',
      zeroline: false,
      range: [0, Math.max(...data.cupluri_Nm) * 1.15]
    },
    legend: {
      x: 0.5,
      y: 1.12,
      xanchor: 'center',
      orientation: 'h',
      bgcolor: 'rgba(255,255,255,0.8)'
    },
    margin: { t: 80, r: 70, b: 50, l: 70 },
    hovermode: 'x unified',
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
          filename: 'caracteristica_motor',
          scale: 2
        }
      }}
      style={{ width: '100%', height: '100%' }}
    />
  )
}
