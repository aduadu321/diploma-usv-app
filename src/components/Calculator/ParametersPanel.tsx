import { useState } from 'react'
import { useVehicleStore } from '../../store/vehicleStore'
import { Save, RotateCcw, Car, Gauge, Circle, Cog, Wind } from 'lucide-react'

type SectionType = 'dimensiuni' | 'masa' | 'pneu' | 'motor' | 'transmisie' | 'aerodinamic'

export default function ParametersPanel() {
  const [activeSection, setActiveSection] = useState<SectionType>('dimensiuni')
  const {
    vehicle,
    updateVehicle,
    updateDimensions,
    updateMass,
    updateTire,
    updateEngine,
    updateTransmission,
    updateAerodynamic,
    resetToDefault,
    saveVehicle
  } = useVehicleStore()

  const sections = [
    { id: 'dimensiuni', label: 'Dimensiuni', icon: Car },
    { id: 'masa', label: 'Mase', icon: Gauge },
    { id: 'pneu', label: 'Pneuri', icon: Circle },
    { id: 'motor', label: 'Motor', icon: Cog },
    { id: 'transmisie', label: 'Transmisie', icon: Cog },
    { id: 'aerodinamic', label: 'Aerodinamică', icon: Wind }
  ] as const

  const InputField = ({
    label,
    value,
    unit,
    onChange,
    step = 1,
    min,
    max
  }: {
    label: string
    value: number
    unit: string
    onChange: (value: number) => void
    step?: number
    min?: number
    max?: number
  }) => (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          step={step}
          min={min}
          max={max}
          className="flex-1 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400 w-16">{unit}</span>
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'dimensiuni':
        return (
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Lungime" value={vehicle.dimensiuni.lungime} unit="mm" onChange={(v) => updateDimensions({ lungime: v })} />
            <InputField label="Lățime" value={vehicle.dimensiuni.latime} unit="mm" onChange={(v) => updateDimensions({ latime: v })} />
            <InputField label="Înălțime" value={vehicle.dimensiuni.inaltime} unit="mm" onChange={(v) => updateDimensions({ inaltime: v })} />
            <InputField label="Ampatament" value={vehicle.dimensiuni.ampatament} unit="mm" onChange={(v) => updateDimensions({ ampatament: v })} />
            <InputField label="Ecartament față" value={vehicle.dimensiuni.ecartamentFata} unit="mm" onChange={(v) => updateDimensions({ ecartamentFata: v })} />
            <InputField label="Ecartament spate" value={vehicle.dimensiuni.ecartamentSpate} unit="mm" onChange={(v) => updateDimensions({ ecartamentSpate: v })} />
            <InputField label="Gardă la sol" value={vehicle.dimensiuni.gardaSol} unit="mm" onChange={(v) => updateDimensions({ gardaSol: v })} />
            <InputField label="Consolă față" value={vehicle.dimensiuni.consolaFata} unit="mm" onChange={(v) => updateDimensions({ consolaFata: v })} />
            <InputField label="Consolă spate" value={vehicle.dimensiuni.consolaSpate} unit="mm" onChange={(v) => updateDimensions({ consolaSpate: v })} />
          </div>
        )

      case 'masa':
        return (
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Masă goală" value={vehicle.masa.masaGoala} unit="kg" onChange={(v) => updateMass({ masaGoala: v })} />
            <InputField label="Masă totală" value={vehicle.masa.masaTotala} unit="kg" onChange={(v) => updateMass({ masaTotala: v })} />
            <InputField label="Capacitate încărcare" value={vehicle.masa.capacitateIncarcare} unit="kg" onChange={(v) => updateMass({ capacitateIncarcare: v })} />
            <InputField label="Repartizare față" value={vehicle.masa.repartizareFata} unit="%" onChange={(v) => updateMass({ repartizareFata: v, repartizareSpate: 100 - v })} min={0} max={100} />
            <InputField label="Repartizare spate" value={vehicle.masa.repartizareSpate} unit="%" onChange={(v) => updateMass({ repartizareSpate: v, repartizareFata: 100 - v })} min={0} max={100} />
            <InputField label="Înălțime centru masă" value={vehicle.masa.inaltimeCentruMasa} unit="mm" onChange={(v) => updateMass({ inaltimeCentruMasa: v })} />
          </div>
        )

      case 'pneu':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Dimensiune pneu</label>
              <input
                type="text"
                value={vehicle.pneu.dimensiune}
                onChange={(e) => updateTire({ dimensiune: e.target.value })}
                placeholder="205/55 R16"
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
              />
            </div>
            <InputField label="Lățime" value={vehicle.pneu.latime} unit="mm" onChange={(v) => updateTire({ latime: v })} />
            <InputField label="Raport profil" value={vehicle.pneu.raportProfil} unit="%" onChange={(v) => updateTire({ raportProfil: v })} />
            <InputField label="Diametru jantă" value={vehicle.pneu.diametruJanta} unit="inch" onChange={(v) => updateTire({ diametruJanta: v })} />
            <InputField label="Rază statică" value={vehicle.pneu.razaStatica} unit="m" step={0.001} onChange={(v) => updateTire({ razaStatica: v })} />
            <InputField label="Rază dinamică" value={vehicle.pneu.razaDinamica} unit="m" step={0.001} onChange={(v) => updateTire({ razaDinamica: v })} />
            <InputField label="Coef. rulare" value={vehicle.pneu.coefRulare} unit="-" step={0.001} onChange={(v) => updateTire({ coefRulare: v })} />
          </div>
        )

      case 'motor':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Tip motor</label>
              <select
                value={vehicle.motor.tip}
                onChange={(e) => updateEngine({ tip: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <option value="benzina">Benzină</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hibrid">Hibrid</option>
              </select>
            </div>
            <InputField label="Cilindree" value={vehicle.motor.cilindree} unit="cm³" onChange={(v) => updateEngine({ cilindree: v })} />
            <InputField label="Putere maximă" value={vehicle.motor.putereMaxima} unit="kW" onChange={(v) => updateEngine({ putereMaxima: v })} />
            <InputField label="Turație putere max" value={vehicle.motor.turatiePutereMax} unit="rot/min" onChange={(v) => updateEngine({ turatiePutereMax: v })} />
            <InputField label="Cuplu maxim" value={vehicle.motor.cuplMaxim} unit="N·m" onChange={(v) => updateEngine({ cuplMaxim: v })} />
            <InputField label="Turație cuplu max" value={vehicle.motor.turatieCuplMax} unit="rot/min" onChange={(v) => updateEngine({ turatieCuplMax: v })} />
            <InputField label="Turație maximă" value={vehicle.motor.turatieMaxima} unit="rot/min" onChange={(v) => updateEngine({ turatieMaxima: v })} />
            <InputField label="Turație ralanti" value={vehicle.motor.turatieRalanti} unit="rot/min" onChange={(v) => updateEngine({ turatieRalanti: v })} />
          </div>
        )

      case 'transmisie':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Tip transmisie</label>
              <select
                value={vehicle.transmisie.tipTransmisie}
                onChange={(e) => updateTransmission({ tipTransmisie: e.target.value as any })}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"
              >
                <option value="manuala">Manuală</option>
                <option value="automata">Automată</option>
                <option value="cvt">CVT</option>
              </select>
            </div>
            <InputField label="Număr trepte" value={vehicle.transmisie.numarTrepte} unit="-" onChange={(v) => updateTransmission({ numarTrepte: v })} min={3} max={10} />
            <InputField label="Raport principal" value={vehicle.transmisie.raportPrincipal} unit="-" step={0.001} onChange={(v) => updateTransmission({ raportPrincipal: v })} />
            <InputField label="Randament" value={vehicle.transmisie.randamentTransmisie} unit="-" step={0.01} min={0} max={1} onChange={(v) => updateTransmission({ randamentTransmisie: v })} />

            <div className="col-span-2">
              <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Rapoarte cutie de viteze</label>
              <div className="grid grid-cols-5 gap-2">
                {vehicle.transmisie.raporturiCV.map((raport, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-xs text-gray-500 mb-1">i{index + 1}</span>
                    <input
                      type="number"
                      value={raport}
                      step={0.001}
                      onChange={(e) => {
                        const newRapoarte = [...vehicle.transmisie.raporturiCV]
                        newRapoarte[index] = parseFloat(e.target.value) || 0
                        updateTransmission({ raporturiCV: newRapoarte })
                      }}
                      className="w-full px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'aerodinamic':
        return (
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Coeficient Cx" value={vehicle.aerodinamic.coefAerodinamic} unit="-" step={0.01} onChange={(v) => updateAerodynamic({ coefAerodinamic: v })} />
            <InputField label="Arie frontală" value={vehicle.aerodinamic.arieFrontala} unit="m²" step={0.01} onChange={(v) => updateAerodynamic({ arieFrontala: v })} />
          </div>
        )
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Parametri Vehicul
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Conform Cap. 2 - Alegerea parametrilor principali
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={saveVehicle}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Salvează
          </button>
        </div>
      </div>

      {/* Vehicle name */}
      <div className="mb-6">
        <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
          Denumire proiect
        </label>
        <input
          type="text"
          value={vehicle.nume}
          onChange={(e) => updateVehicle({ nume: e.target.value })}
          className="w-full max-w-md px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white"
        />
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm overflow-auto">
        {renderSection()}
      </div>
    </div>
  )
}
