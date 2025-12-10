import {
  Settings,
  Calculator,
  LineChart,
  FileText,
  FunctionSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAppStore } from '../../store/appStore'

const tabs = [
  { id: 'parametri', label: 'Parametri Vehicul', icon: Settings },
  { id: 'calcule', label: 'Calcule', icon: Calculator },
  { id: 'grafice', label: 'Grafice', icon: LineChart },
  { id: 'formule', label: 'Editor Formule', icon: FunctionSquare },
  { id: 'document', label: 'Document Word', icon: FileText }
] as const

export default function Sidebar() {
  const { activeTab, setActiveTab, sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <aside
      className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-20 -right-3 z-10 w-6 h-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 dark:hover:bg-gray-600"
        style={{ left: sidebarCollapsed ? '52px' : '252px' }}
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? tab.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-600' : ''}`} />
              {!sidebarCollapsed && (
                <span className="font-medium text-sm">{tab.label}</span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 text-center">
            USV Suceava © 2024
          </p>
          <p className="text-xs text-gray-400 text-center mt-1">
            Autovehicule Rutiere
          </p>
        </div>
      )}
    </aside>
  )
}
