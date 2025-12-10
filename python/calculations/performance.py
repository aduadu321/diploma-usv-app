"""
Calcul performanțe dinamice (Capitolul 5)
Conform: Stoicescu - "Proiectarea performanțelor de tracțiune"
"""

import numpy as np
from scipy import integrate
from typing import Dict, Any

G = 9.81
RHO = 1.225

def engine_characteristic(n: np.ndarray, P_max: float, n_P: float,
                          engine_type: str = 'benzina') -> tuple:
    """Caracteristica motor Leiderman-Khlystov"""
    if engine_type == 'diesel':
        a, b, c = 0.53, 1.56, 1.09
    else:
        a, b, c = 0.87, 1.13, 1.0

    x = n / n_P
    P_e = P_max * (a * x + b * x**2 - c * x**3)
    P_e = np.maximum(P_e, 0)
    M_e = np.where(n > 0, (P_e * 1000 * 60) / (2 * np.pi * n), 0)
    return P_e, M_e

def calculate_performance(vehicle: Any) -> Dict[str, Any]:
    """
    Calculează performanțele dinamice ale automobilului.

    Conform Cap. 5:
    - 5.1 Performanțe dinamice de trecere
    - 5.2 Performanțe de demarare
    - 5.3 Performanțe de frânare
    """

    # Parametri
    m = vehicle.masa.masaTotala
    greutate = m * G
    f = vehicle.pneu.coefRulare
    Cx = vehicle.aerodinamic.coefAerodinamic
    A = vehicle.aerodinamic.arieFrontala
    r_d = vehicle.pneu.razaDinamica

    P_max = vehicle.motor.putereMaxima
    n_P = vehicle.motor.turatiePutereMax
    n_max = vehicle.motor.turatieMaxima
    n_min = vehicle.motor.turatieRalanti
    tip_motor = vehicle.motor.tip

    i_cv = np.array(vehicle.transmisie.raporturiCV)
    i_0 = vehicle.transmisie.raportPrincipal
    eta_t = vehicle.transmisie.randamentTransmisie

    # Factor mase rotative (aproximativ)
    # δ = 1 + δ_roți + δ_transmisie · i²
    delta_roti = 0.04
    delta_base = 0.05

    # Vectori pentru calcule
    n_motor = np.linspace(n_min, n_max, 50)
    P_e, M_e = engine_characteristic(n_motor, P_max, n_P, tip_motor)

    # ==================== 5.1 PERFORMANȚE DINAMICE ====================

    caracteristica_tractiune = []
    caracteristica_puteri = []
    caracteristica_dinamica = []
    caracteristica_acceleratii = []

    for idx, i_k in enumerate(i_cv):
        i_total = i_k * i_0
        delta = 1 + delta_roti + delta_base * i_k**2

        # Viteza
        v_ms = (np.pi * r_d * n_motor) / (30 * i_total)
        v_kmh = v_ms * 3.6

        # Forța de tracțiune
        F_t = (M_e * i_total * eta_t) / r_d

        # Rezistența aerodinamică
        F_a = 0.5 * RHO * Cx * A * v_ms**2

        # Rezistența la rulare
        F_r = f * greutate

        # Forța disponibilă
        F_disp = F_t - F_a - F_r

        # Puterea de tracțiune
        P_t = F_t * v_ms / 1000  # [kW]

        # Puterea de rezistență
        P_rez = (F_a + F_r) * v_ms / 1000  # [kW]

        # Factorul dinamic D = (F_t - F_a) / G
        D = (F_t - F_a) / greutate

        # Accelerația a = (D - f) · g / δ
        a = np.where(D > f, (D - f) * G / delta, 0)

        caracteristica_tractiune.append({
            "treapta": idx + 1,
            "viteze_kmh": np.round(v_kmh, 2).tolist(),
            "forte_tractiune_N": np.round(F_t, 2).tolist(),
            "forte_rezistenta_N": np.round(F_a + F_r, 2).tolist()
        })

        caracteristica_puteri.append({
            "treapta": idx + 1,
            "viteze_kmh": np.round(v_kmh, 2).tolist(),
            "putere_tractiune_kW": np.round(P_t, 2).tolist(),
            "putere_rezistenta_kW": np.round(P_rez, 2).tolist()
        })

        caracteristica_dinamica.append({
            "treapta": idx + 1,
            "viteze_kmh": np.round(v_kmh, 2).tolist(),
            "factor_dinamic": np.round(D, 4).tolist()
        })

        caracteristica_acceleratii.append({
            "treapta": idx + 1,
            "delta": round(delta, 3),
            "viteze_kmh": np.round(v_kmh, 2).tolist(),
            "acceleratii_m_s2": np.round(a, 3).tolist()
        })

    # ==================== 5.2 PERFORMANȚE DEMARARE ====================

    # Calculăm timpul și spațiul de demarare prin integrare numerică
    # Folosim prima treaptă pentru început, apoi schimbăm trepte

    viteze_demarare = np.linspace(0, 100, 101)  # 0-100 km/h
    viteze_demarare_ms = viteze_demarare / 3.6

    # Interpolare accelerație pentru fiecare viteză
    acceleratii_envelope = []

    for v in viteze_demarare_ms:
        max_a = 0
        for idx, i_k in enumerate(i_cv):
            i_total = i_k * i_0
            delta = 1 + delta_roti + delta_base * i_k**2

            # Turația corespunzătoare acestei viteze
            n = (30 * v * i_total) / (np.pi * r_d)

            if n_min <= n <= n_max:
                _, M_e_val = engine_characteristic(np.array([n]), P_max, n_P, tip_motor)
                F_t = (M_e_val[0] * i_total * eta_t) / r_d
                F_a = 0.5 * RHO * Cx * A * v**2
                D = (F_t - F_a) / greutate
                a = max(0, (D - f) * G / delta)
                max_a = max(max_a, a)

        acceleratii_envelope.append(max(max_a, 0.1))  # minim 0.1 pentru evitare div/0

    acceleratii_envelope = np.array(acceleratii_envelope)

    # Timp de demarare: t = ∫(1/a)dv
    timp_demarare = [0]
    for i in range(1, len(viteze_demarare_ms)):
        dv = viteze_demarare_ms[i] - viteze_demarare_ms[i-1]
        a_med = (acceleratii_envelope[i] + acceleratii_envelope[i-1]) / 2
        dt = dv / a_med
        timp_demarare.append(timp_demarare[-1] + dt)

    timp_demarare = np.array(timp_demarare)

    # Spațiu de demarare: s = ∫v·dt
    spatiu_demarare = [0]
    for i in range(1, len(viteze_demarare_ms)):
        v_med = (viteze_demarare_ms[i] + viteze_demarare_ms[i-1]) / 2
        dt = timp_demarare[i] - timp_demarare[i-1]
        ds = v_med * dt
        spatiu_demarare.append(spatiu_demarare[-1] + ds)

    spatiu_demarare = np.array(spatiu_demarare)

    # Timp 0-100 km/h
    timp_0_100 = float(timp_demarare[-1])
    spatiu_0_100 = float(spatiu_demarare[-1])

    # Viteza maximă (unde accelerația devine 0)
    v_max_idx = np.argmin(acceleratii_envelope)
    v_max = float(viteze_demarare[v_max_idx])

    # Accelerația maximă
    a_max = float(np.max(acceleratii_envelope))

    # Panta maximă
    # La limită: D_max = f + tan(α_max)
    D_max = float(np.max([np.max(c["factor_dinamic"]) for c in caracteristica_dinamica]))
    panta_maxima = np.degrees(np.arctan(D_max - f))

    return {
        "caracteristica_tractiune": caracteristica_tractiune,
        "caracteristica_puteri": caracteristica_puteri,
        "caracteristica_dinamica": caracteristica_dinamica,
        "caracteristica_acceleratii": caracteristica_acceleratii,
        "demarare": {
            "viteze_kmh": viteze_demarare.tolist(),
            "timpi_s": np.round(timp_demarare, 2).tolist(),
            "spatii_m": np.round(spatiu_demarare, 2).tolist(),
            "acceleratii_m_s2": np.round(acceleratii_envelope, 3).tolist()
        },
        "performante_cheie": {
            "viteza_maxima_kmh": round(v_max, 2),
            "acceleratie_maxima_m_s2": round(a_max, 3),
            "timp_0_100_s": round(timp_0_100, 2),
            "spatiu_0_100_m": round(spatiu_0_100, 2),
            "panta_maxima_grade": round(panta_maxima, 2),
            "panta_maxima_procente": round(np.tan(np.radians(panta_maxima)) * 100, 2)
        }
    }
