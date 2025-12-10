import { Moon, Sun, Wifi, WifiOff, Car } from 'lucide-react'
import { useAppStore } from '../../store/appStore'
import { useVehicleStore } from '../../store/vehicleStore'

export default function Header() {
  const { darkMode, toggleDarkMode, backendConnected } = useAppStore()
  const { vehicle } = useVehicleStore()

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <Car className="w-8 h-8 text-primary-600" />
        <div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-white">
            USV Diploma Calculator
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Autovehicule Rutiere
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Vehicle name */}
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="text-gray-400 mr-2">Proiect:</span>
          <span className="font-medium">{vehicle.nume}</span>
        </div>

        {/* Backend status */}
        <div className="flex items-center gap-2">
          {backendConnected ? (
            <div className="flex items-center gap-1 text-green-600">
              <Wifi className="w-4 h-4" />
              <span className="text-xs">Backend OK</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-500">
              <WifiOff className="w-4 h-4" />
              <span className="text-xs">Backend offline</span>
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={darkMode ? 'Mod luminos' : 'Mod întunecat'}
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
    </header>
  )
}
