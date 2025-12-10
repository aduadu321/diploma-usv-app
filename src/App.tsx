import { useEffect } from 'react'
import { useAppStore } from './store/appStore'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import ParametersPanel from './components/Calculator/ParametersPanel'
import CalculationsPanel from './components/Calculator/CalculationsPanel'
import ChartsPanel from './components/Charts/ChartsPanel'
import FormulaPanel from './components/FormulaEditor/FormulaPanel'
import DocumentPanel from './components/WordPreview/DocumentPanel'

function App() {
  const { activeTab, darkMode, setBackendStatus } = useAppStore()

  // Check Python backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/health')
        if (response.ok) {
          setBackendStatus(true)
        } else {
          setBackendStatus(false, 'Backend nu răspunde corect')
        }
      } catch {
        setBackendStatus(false, 'Nu se poate conecta la backend Python')
      }
    }

    checkBackend()
    const interval = setInterval(checkBackend, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [setBackendStatus])

  const renderContent = () => {
    switch (activeTab) {
      case 'parametri':
        return <ParametersPanel />
      case 'calcule':
        return <CalculationsPanel />
      case 'grafice':
        return <ChartsPanel />
      case 'formule':
        return <FormulaPanel />
      case 'document':
        return <DocumentPanel />
      default:
        return <ParametersPanel />
    }
  }

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App
