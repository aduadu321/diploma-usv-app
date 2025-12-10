// Tipuri pentru rezultatele calculelor

export interface ResistanceResults {
  // Rezistența la rulare
  fortaRulare: number;           // F_r [N]

  // Rezistența aerodinamică (la diferite viteze)
  fortaAer: number[];            // F_a [N]
  vitezeCalcul: number[];        // v [km/h]

  // Rezistența la pantă
  fortaPanta: number;            // F_p [N]
  unghiPanta: number;            // α [grade]

  // Rezistența totală
  fortaTotala: number[];         // F_t [N]
}

export interface TractionResults {
  // Caracteristica motor
  turatiMotor: number[];         // n_e [rot/min]
  putereMoror: number[];         // P_e [kW]
  cuplMotor: number[];           // M_e [N·m]

  // Forțe de tracțiune per treaptă
  fortaTractiune: {
    treapta: number;
    viteze: number[];            // v [km/h]
    forte: number[];             // F_t [N]
  }[];

  // Rapoarte transmisie calculate
  raportMaxim: number;           // i_max
  raportMinim: number;           // i_min
  raporturiOptimizate: number[]; // [i1, i2, ...]
}

export interface PerformanceResults {
  // Caracteristica de tracțiune
  caracteristicaTractiune: {
    treapta: number;
    viteze: number[];
    forte: number[];
  }[];

  // Caracteristica puterilor
  caracteristicaPuteri: {
    treapta: number;
    viteze: number[];
    puteriTractiune: number[];   // P_t [kW]
    puteriRezistenta: number[];  // P_r [kW]
  }[];

  // Caracteristica dinamică
  caracteristicaDinamica: {
    treapta: number;
    viteze: number[];
    factorDinamic: number[];     // D [-]
  }[];

  // Accelerații
  caracteristicaAcceleratii: {
    treapta: number;
    viteze: number[];
    acceleratii: number[];       // a [m/s²]
  }[];

  // Demarare
  timpDemarare: number[];        // t [s]
  spatiuDemarare: number[];      // s [m]
  vitezeDemerare: number[];      // v [km/h]

  // Performanțe cheie
  vitezaMaxima: number;          // v_max [km/h]
  acceleratieMaxima: number;     // a_max [m/s²]
  timp0_100: number;             // t_0-100 [s]
  pantaMaxima: number;           // α_max [%]
}

export interface BrakingResults {
  // Performanțe frânare
  deceleratieMaxima: number;     // a_fr [m/s²]
  distantaFranare100: number;    // s_fr la 100 km/h [m]
  timpFranare100: number;        // t_fr la 100 km/h [s]

  // Forțe de frânare
  fortaFranaFata: number;        // F_f [N]
  fortaFranaSpate: number;       // F_s [N]
  repartizareFranare: number;    // % față

  // Caracteristica frânare
  vitezeFranare: number[];       // v [km/h]
  distanteFranare: number[];     // s [m]
  timpiFranare: number[];        // t [s]
}

export interface CalculationState {
  isCalculating: boolean;
  error: string | null;
  lastCalculated: Date | null;

  resistance: ResistanceResults | null;
  traction: TractionResults | null;
  performance: PerformanceResults | null;
  braking: BrakingResults | null;
}
