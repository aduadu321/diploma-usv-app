"""
Calcul performanțe de frânare (Capitolul 5.3)
Conform: Frățilă, Mărculeșcu - "Sistemele de frânare ale autovehiculelor" (1986)
"""

import numpy as np
from typing import Dict, Any

G = 9.81

def calculate_braking(vehicle: Any) -> Dict[str, Any]:
    """
    Calculează performanțele de frânare ale automobilului.

    Include:
    - Decelerația maximă
    - Distanța și timpul de frânare
    - Repartizarea forțelor de frânare
    """

    # Parametri vehicul
    m = vehicle.masa.masaTotala  # [kg]
    greutate = m * G  # [N]

    # Repartizare masă
    repartizare_fata = vehicle.masa.repartizareFata / 100
    repartizare_spate = vehicle.masa.repartizareSpate / 100

    # Coordonate centru masă
    L = vehicle.dimensiuni.ampatament / 1000  # Ampatament [m]
    h_g = vehicle.masa.inaltimeCentruMasa / 1000  # Înălțime centru masă [m]

    # Distanțe de la centrul de masă la punți
    L1 = L * repartizare_spate  # Distanța până la puntea față [m]
    L2 = L * repartizare_fata   # Distanța până la puntea spate [m]

    # Coeficient de aderență (valori tipice)
    phi_uscat = 0.8  # Asfalt uscat
    phi_umed = 0.5   # Asfalt umed
    phi_zapada = 0.2 # Zăpadă/gheață

    # Decelerație maximă (limitată de aderență)
    a_fr_max = phi_uscat * G  # [m/s²]

    # Repartizarea ideală a forțelor de frânare
    # F_f/F_s = (L2 + h_g·φ) / (L1 - h_g·φ)
    raport_ideal = (L2 + h_g * phi_uscat) / (L1 - h_g * phi_uscat)

    # Forțele normale pe punți la frânare
    # N_f = G·(L2 + h_g·a/g) / L
    # N_s = G·(L1 - h_g·a/g) / L
    N_f = greutate * (L2 + h_g * a_fr_max / G) / L  # [N]
    N_s = greutate * (L1 - h_g * a_fr_max / G) / L  # [N]

    # Forțele de frânare maxime
    F_f_max = phi_uscat * N_f  # [N]
    F_s_max = phi_uscat * N_s  # [N]
    F_total = F_f_max + F_s_max

    # Procentul forței de frânare pe puntea față
    procent_fata = (F_f_max / F_total) * 100

    # Vectori de viteză pentru calcul [km/h]
    viteze_kmh = np.arange(10, 151, 10)
    viteze_ms = viteze_kmh / 3.6

    # Calcul pentru diferite condiții de aderență
    rezultate_aderenta = {}

    for nume, phi in [("uscat", phi_uscat), ("umed", phi_umed), ("zapada", phi_zapada)]:
        a_fr = phi * G

        # Distanța de frânare: s = v² / (2·a_fr)
        distante = viteze_ms**2 / (2 * a_fr)

        # Timpul de frânare: t = v / a_fr
        timpi = viteze_ms / a_fr

        rezultate_aderenta[nume] = {
            "coef_aderenta": phi,
            "deceleratie_m_s2": round(a_fr, 2),
            "distante_m": np.round(distante, 2).tolist(),
            "timpi_s": np.round(timpi, 2).tolist()
        }

    # Valori la 100 km/h (benchmark standard)
    v_100 = 100 / 3.6  # [m/s]
    s_100 = v_100**2 / (2 * a_fr_max)
    t_100 = v_100 / a_fr_max

    # Energie cinetică la frânare
    E_cin = 0.5 * m * v_100**2  # [J]

    # Puterea medie de frânare
    P_fr_med = E_cin / t_100 / 1000  # [kW]

    return {
        "parametri_vehicul": {
            "masa_kg": m,
            "ampatament_m": round(L, 3),
            "inaltime_centru_masa_m": round(h_g, 3),
            "distanta_L1_m": round(L1, 3),
            "distanta_L2_m": round(L2, 3)
        },
        "deceleratie_maxima": {
            "formula": "a_fr = φ · g",
            "valoare_m_s2": round(a_fr_max, 2),
            "valoare_g": round(a_fr_max / G, 2),
            "coef_aderenta_uscat": phi_uscat
        },
        "repartizare_franare": {
            "formula": "F_f/F_s = (L2 + h_g·φ) / (L1 - h_g·φ)",
            "raport_ideal": round(raport_ideal, 3),
            "forta_fata_N": round(F_f_max, 2),
            "forta_spate_N": round(F_s_max, 2),
            "procent_fata": round(procent_fata, 1),
            "procent_spate": round(100 - procent_fata, 1),
            "forta_normala_fata_N": round(N_f, 2),
            "forta_normala_spate_N": round(N_s, 2)
        },
        "franare_100_kmh": {
            "distanta_m": round(s_100, 2),
            "timp_s": round(t_100, 2),
            "energie_cinetica_kJ": round(E_cin / 1000, 2),
            "putere_medie_kW": round(P_fr_med, 2)
        },
        "caracteristici_franare": {
            "viteze_kmh": viteze_kmh.tolist(),
            "conditii": rezultate_aderenta
        },
        "formule": {
            "distanta": "s_fr = v² / (2 · a_fr)",
            "timp": "t_fr = v / a_fr",
            "forta_normala_fata": "N_f = G·(L2 + h_g·a/g) / L",
            "forta_normala_spate": "N_s = G·(L1 - h_g·a/g) / L"
        }
    }
