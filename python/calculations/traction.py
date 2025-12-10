"""
Calcul de tracțiune (Capitolul 4)
Conform: Frățilă, Untaru, Poțîncu - "Calculul și construcția automobilelor" (1982)
"""

import numpy as np
from typing import Dict, Any

G = 9.81  # Accelerația gravitațională [m/s²]
RHO = 1.225  # Densitatea aerului [kg/m³]

def engine_characteristic_leiderman(n: np.ndarray, P_max: float, n_P: float,
                                     engine_type: str = 'benzina') -> tuple:
    """
    Calculează caracteristica exterioară a motorului folosind formula Leiderman-Khlystov.

    P_e = P_max · (a·x + b·x² - c·x³), unde x = n/n_P

    Coeficienți:
    - Benzină: a=0.87, b=1.13, c=1.0
    - Diesel: a=0.53, b=1.56, c=1.09
    """

    if engine_type == 'diesel':
        a, b, c = 0.53, 1.56, 1.09
    else:  # benzină
        a, b, c = 0.87, 1.13, 1.0

    x = n / n_P

    # Putere [kW]
    P_e = P_max * (a * x + b * x**2 - c * x**3)
    P_e = np.maximum(P_e, 0)  # Evită valori negative

    # Cuplu [N·m]
    # M_e = (P_e · 1000 · 60) / (2π · n)
    M_e = np.where(n > 0, (P_e * 1000 * 60) / (2 * np.pi * n), 0)

    return P_e, M_e

def calculate_traction(vehicle: Any) -> Dict[str, Any]:
    """
    Calculează caracteristicile de tracțiune ale autovehiculului.

    Include:
    - Caracteristica exterioară a motorului
    - Rapoarte de transmitere
    - Forța de tracțiune per treaptă
    - Viteza maximă teoretică
    """

    # Parametri motor
    P_max = vehicle.motor.putereMaxima  # [kW]
    n_P = vehicle.motor.turatiePutereMax  # [rot/min]
    M_max = vehicle.motor.cuplMaxim  # [N·m]
    n_M = vehicle.motor.turatieCuplMax  # [rot/min]
    n_max = vehicle.motor.turatieMaxima  # [rot/min]
    n_min = vehicle.motor.turatieRalanti  # [rot/min]
    tip_motor = vehicle.motor.tip

    # Parametri transmisie
    i_cv = np.array(vehicle.transmisie.raporturiCV)  # Rapoarte cutie viteze
    i_0 = vehicle.transmisie.raportPrincipal  # Raport transmisie principală
    eta_t = vehicle.transmisie.randamentTransmisie  # Randament transmisie

    # Parametri roți
    r_d = vehicle.pneu.razaDinamica  # [m]

    # Parametri vehicul
    m = vehicle.masa.masaTotala  # [kg]
    greutate = m * G  # [N]
    f = vehicle.pneu.coefRulare
    Cx = vehicle.aerodinamic.coefAerodinamic
    A = vehicle.aerodinamic.arieFrontala  # [m²]

    # Caracteristica exterioară motor
    n_motor = np.linspace(n_min, n_max, 100)
    P_e, M_e = engine_characteristic_leiderman(n_motor, P_max, n_P, tip_motor)

    # Găsim cuplul maxim real din caracteristică
    M_e_max = np.max(M_e)

    # Calculul rapoartelor de transmitere
    # i_max = (G · ψ_max · r_d) / (M_max · η_t)
    psi_max = 0.35  # Coeficient rezistență totală maximă (pantă + rulare)
    i_t_max = (greutate * psi_max * r_d) / (M_e_max * eta_t)

    # i_min = (G · ψ_min · r_d) / (M_max · η_t)
    # La viteză maximă, ψ_min ≈ f + rezistență aer
    v_max_estimat = 180 / 3.6  # [m/s] estimare
    psi_min = f + (RHO * Cx * A * v_max_estimat**2) / (2 * greutate)
    i_t_min = (greutate * psi_min * r_d) / (M_e_max * eta_t)

    # Forța de tracțiune și viteza pentru fiecare treaptă
    trepte_tractiune = []

    for idx, i_k in enumerate(i_cv):
        i_total = i_k * i_0

        # Viteza la fiecare turație: v = (π · r_d · n) / (30 · i_t) [m/s]
        v_ms = (np.pi * r_d * n_motor) / (30 * i_total)
        v_kmh = v_ms * 3.6

        # Forța de tracțiune: F_t = (M_e · i_t · η_t) / r_d
        F_t = (M_e * i_total * eta_t) / r_d

        trepte_tractiune.append({
            "treapta": idx + 1,
            "raport_cv": round(i_k, 3),
            "raport_total": round(i_total, 3),
            "viteze_kmh": np.round(v_kmh, 2).tolist(),
            "forte_tractiune_N": np.round(F_t, 2).tolist(),
            "viteza_min_kmh": round(float(np.min(v_kmh)), 2),
            "viteza_max_kmh": round(float(np.max(v_kmh)), 2)
        })

    # Viteza maximă teoretică (în treapta superioară)
    v_max_teoretica = (np.pi * r_d * n_max) / (30 * i_cv[-1] * i_0) * 3.6

    # Calculul rapoartelor geometrice
    # i_k = i_1 · q^(k-1), unde q = (i_n/i_1)^(1/(n-1))
    n_trepte = len(i_cv)
    q = (i_cv[-1] / i_cv[0]) ** (1 / (n_trepte - 1))
    rapoarte_geometrice = [i_cv[0] * (q ** k) for k in range(n_trepte)]

    return {
        "parametri_motor": {
            "putere_maxima_kW": P_max,
            "turatie_putere_max": n_P,
            "cuplu_maxim_Nm": M_max,
            "cuplu_maxim_calculat_Nm": round(M_e_max, 2),
            "tip_motor": tip_motor
        },
        "caracteristica_motor": {
            "formula_putere": "P_e = P_max · (a·x + b·x² - c·x³)",
            "formula_cuplu": "M_e = (P_e · 1000 · 60) / (2π · n)",
            "turatii_rot_min": np.round(n_motor, 0).tolist(),
            "puteri_kW": np.round(P_e, 2).tolist(),
            "cupluri_Nm": np.round(M_e, 2).tolist()
        },
        "rapoarte_transmisie": {
            "rapoarte_cv": i_cv.tolist(),
            "raport_principal": i_0,
            "randament": eta_t,
            "i_total_max": round(i_cv[0] * i_0, 3),
            "i_total_min": round(i_cv[-1] * i_0, 3),
            "raport_maxim_teoretic": round(i_t_max, 3),
            "raport_minim_teoretic": round(i_t_min, 3),
            "q_progresie_geometrica": round(q, 4),
            "rapoarte_geometrice_ideale": [round(r, 3) for r in rapoarte_geometrice]
        },
        "tractiune_pe_trepte": trepte_tractiune,
        "viteza_maxima": {
            "teoretica_kmh": round(v_max_teoretica, 2),
            "formula": "v_max = (π · r_d · n_max) / (30 · i_min)"
        }
    }
