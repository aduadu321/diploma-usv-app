import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { VehicleParams, DEFAULT_VEHICLE_PARAMS } from '../types/vehicle'

interface VehicleStore {
  vehicle: VehicleParams;
  savedVehicles: VehicleParams[];

  // Actions
  updateVehicle: (updates: Partial<VehicleParams>) => void;
  updateDimensions: (updates: Partial<VehicleParams['dimensiuni']>) => void;
  updateMass: (updates: Partial<VehicleParams['masa']>) => void;
  updateTire: (updates: Partial<VehicleParams['pneu']>) => void;
  updateEngine: (updates: Partial<VehicleParams['motor']>) => void;
  updateTransmission: (updates: Partial<VehicleParams['transmisie']>) => void;
  updateAerodynamic: (updates: Partial<VehicleParams['aerodinamic']>) => void;

  resetToDefault: () => void;
  saveVehicle: () => void;
  loadVehicle: (index: number) => void;
  deleteVehicle: (index: number) => void;
}

export const useVehicleStore = create<VehicleStore>()(
  persist(
    (set, get) => ({
      vehicle: { ...DEFAULT_VEHICLE_PARAMS },
      savedVehicles: [],

      updateVehicle: (updates) =>
        set((state) => ({
          vehicle: { ...state.vehicle, ...updates }
        })),

      updateDimensions: (updates) =>
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            dimensiuni: { ...state.vehicle.dimensiuni, ...updates }
          }
        })),

      updateMass: (updates) =>
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            masa: { ...state.vehicle.masa, ...updates }
          }
        })),

      updateTire: (updates) =>
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            pneu: { ...state.vehicle.pneu, ...updates }
          }
        })),

      updateEngine: (updates) =>
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            motor: { ...state.vehicle.motor, ...updates }
          }
        })),

      updateTransmission: (updates) =>
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            transmisie: { ...state.vehicle.transmisie, ...updates }
          }
        })),

      updateAerodynamic: (updates) =>
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            aerodinamic: { ...state.vehicle.aerodinamic, ...updates }
          }
        })),

      resetToDefault: () =>
        set({ vehicle: { ...DEFAULT_VEHICLE_PARAMS } }),

      saveVehicle: () =>
        set((state) => ({
          savedVehicles: [...state.savedVehicles, { ...state.vehicle }]
        })),

      loadVehicle: (index) =>
        set((state) => ({
          vehicle: { ...state.savedVehicles[index] }
        })),

      deleteVehicle: (index) =>
        set((state) => ({
          savedVehicles: state.savedVehicles.filter((_, i) => i !== index)
        }))
    }),
    {
      name: 'diploma-vehicle-storage'
    }
  )
)
