// Parametri vehicul conform ghidului USV Autovehicule Rutiere

export interface VehicleDimensions {
  lungime: number;        // Lungime totală [mm]
  latime: number;         // Lățime totală [mm]
  inaltime: number;       // Înălțime totală [mm]
  ampatament: number;     // Ampatament [mm]
  ecartamentFata: number; // Ecartament față [mm]
  ecartamentSpate: number; // Ecartament spate [mm]
  gardaSol: number;       // Garda la sol [mm]
  consolaFata: number;    // Consola față [mm]
  consolaSpate: number;   // Consola spate [mm]
}

export interface VehicleMass {
  masaGoala: number;           // Masa vehiculului gol [kg]
  masaTotala: number;          // Masa totală maximă [kg]
  capacitateIncarcare: number; // Capacitate încărcare [kg]
  repartizareFata: number;     // Repartizare masă față [%]
  repartizareSpate: number;    // Repartizare masă spate [%]
  inaltimeCentruMasa: number;  // Înălțime centru masă [mm]
}

export interface TireParams {
  dimensiune: string;      // Ex: "205/55 R16"
  latime: number;          // Lățime [mm]
  raportProfil: number;    // Raport înălțime profil [%]
  diametruJanta: number;   // Diametru jantă [inch]
  razaStatica: number;     // Raza statică [m]
  razaDinamica: number;    // Raza dinamică [m]
  coefRulare: number;      // Coeficient rezistență rulare
}

export interface EngineParams {
  tip: 'benzina' | 'diesel' | 'electric' | 'hibrid';
  cilindree: number;           // Cilindree [cm³]
  putereMaxima: number;        // Putere maximă [kW]
  turatiePutereMax: number;    // Turație la putere maximă [rot/min]
  cuplMaxim: number;           // Cuplu maxim [N·m]
  turatieCuplMax: number;      // Turație la cuplu maxim [rot/min]
  turatieMaxima: number;       // Turație maximă [rot/min]
  turatieRalanti: number;      // Turație ralanti [rot/min]
}

export interface TransmissionParams {
  tipTransmisie: 'manuala' | 'automata' | 'cvt';
  numarTrepte: number;
  raporturiCV: number[];       // Rapoarte cutie viteze [i1, i2, ...]
  raportPrincipal: number;     // Raport transmisie principală (diferențial)
  randamentTransmisie: number; // Randament total transmisie [0-1]
}

export interface AerodynamicParams {
  coefAerodinamic: number;     // Cx - coeficient aerodinamic
  arieFrontala: number;        // Arie frontală [m²]
}

export interface VehicleParams {
  nume: string;
  dimensiuni: VehicleDimensions;
  masa: VehicleMass;
  pneu: TireParams;
  motor: EngineParams;
  transmisie: TransmissionParams;
  aerodinamic: AerodynamicParams;
}

// Valori implicite pentru un autoturism tipic (segment C)
export const DEFAULT_VEHICLE_PARAMS: VehicleParams = {
  nume: 'Autoturism Nou',
  dimensiuni: {
    lungime: 4500,
    latime: 1800,
    inaltime: 1450,
    ampatament: 2700,
    ecartamentFata: 1550,
    ecartamentSpate: 1540,
    gardaSol: 150,
    consolaFata: 900,
    consolaSpate: 900
  },
  masa: {
    masaGoala: 1350,
    masaTotala: 1850,
    capacitateIncarcare: 500,
    repartizareFata: 58,
    repartizareSpate: 42,
    inaltimeCentruMasa: 550
  },
  pneu: {
    dimensiune: '205/55 R16',
    latime: 205,
    raportProfil: 55,
    diametruJanta: 16,
    razaStatica: 0.316,
    razaDinamica: 0.308,
    coefRulare: 0.012
  },
  motor: {
    tip: 'benzina',
    cilindree: 1600,
    putereMaxima: 92,
    turatiePutereMax: 5500,
    cuplMaxim: 160,
    turatieCuplMax: 4000,
    turatieMaxima: 6500,
    turatieRalanti: 850
  },
  transmisie: {
    tipTransmisie: 'manuala',
    numarTrepte: 5,
    raporturiCV: [3.727, 2.048, 1.393, 1.029, 0.820],
    raportPrincipal: 4.058,
    randamentTransmisie: 0.92
  },
  aerodinamic: {
    coefAerodinamic: 0.30,
    arieFrontala: 2.2
  }
};
