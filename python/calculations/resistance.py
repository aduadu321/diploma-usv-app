"""
Calcul rezistențe la înaintare (Capitolul 3)
Conform: Untaru et al. - "Dinamica autovehiculelor pe roți" (1981)
"""

import numpy as np
from typing import Dict, Any

# Constante fizice
G = 9.81  # Accelerația gravitațională [m/s²]
RHO = 1.225  # Densitatea aerului la 20°C [kg/m³]

def calculate_resistances(vehicle: Any) -> Dict[str, Any]:
    """
    Calculează rezistențele la înaintare ale autovehiculului.

    Rezistențe calculate:
    - Rezistența la rulare (F_r)
    - Rezistența aerodinamică (F_a)
    - Rezistența la urcarea pantei (F_p)
    - Rezistența totală (F_t)
    """

    # Extragere parametri
    m = vehicle.masa.masaTotala  # Masa totală [kg]
    f = vehicle.pneu.coefRulare  # Coeficient rezistență rulare
    Cx = vehicle.aerodinamic.coefAerodinamic  # Coeficient aerodinamic
    A = vehicle.aerodinamic.arieFrontala  # Arie frontală [m²]

    # Greutatea vehiculului
    greutate = m * G  # [N]

    # Vector viteze pentru calcul [km/h]
    viteze_kmh = np.arange(0, 201, 5)  # 0 la 200 km/h, pas 5
    viteze_ms = viteze_kmh / 3.6  # Conversie în m/s

    # 1. Rezistența la rulare F_r = f · G · cos(α)
    # Pentru teren plan (α = 0), cos(0) = 1
    forta_rulare = f * greutate  # [N] - constantă

    # 2. Rezistența aerodinamică F_a = 0.5 · ρ · Cx · A · v²
    forta_aer = 0.5 * RHO * Cx * A * viteze_ms**2  # [N]

    # 3. Rezistența la urcarea pantei F_p = G · sin(α)
    # Calculăm pentru câteva unghiuri tipice
    unghiuri_grade = [0, 5, 10, 15, 20, 25, 30]
    unghiuri_rad = np.radians(unghiuri_grade)
    forte_panta = [greutate * np.sin(alpha) for alpha in unghiuri_rad]

    # Panta maximă teoretică (aderență ~ 0.8)
    phi = 0.8  # Coeficient de aderență
    panta_maxima_grad = np.degrees(np.arctan(phi - f))

    # 4. Rezistența totală pe teren plan F_t = F_r + F_a
    forta_totala = forta_rulare + forta_aer  # [N]

    # 5. Puterea necesară pentru deplasare P = F_t · v
    putere_necesara = forta_totala * viteze_ms / 1000  # [kW]

    # Calculul coeficientului de rezistență totală ψ
    # ψ = f + (ρ · Cx · A · v²) / (2 · G)
    psi = f + (RHO * Cx * A * viteze_ms**2) / (2 * greutate)

    return {
        "parametri_intrare": {
            "masa_totala_kg": m,
            "greutate_N": round(greutate, 2),
            "coef_rulare": f,
            "coef_aerodinamic": Cx,
            "arie_frontala_m2": A
        },
        "rezistenta_rulare": {
            "formula": "F_r = f · G · cos(α)",
            "valoare_N": round(forta_rulare, 2),
            "descriere": "Constantă pe teren plan"
        },
        "rezistenta_aerodinamica": {
            "formula": "F_a = 0.5 · ρ · Cx · A · v²",
            "viteze_kmh": viteze_kmh.tolist(),
            "forte_N": np.round(forta_aer, 2).tolist()
        },
        "rezistenta_panta": {
            "formula": "F_p = G · sin(α)",
            "unghiuri_grade": unghiuri_grade,
            "forte_N": [round(f, 2) for f in forte_panta],
            "panta_maxima_grade": round(panta_maxima_grad, 2)
        },
        "rezistenta_totala": {
            "formula": "F_t = F_r + F_a",
            "viteze_kmh": viteze_kmh.tolist(),
            "forte_N": np.round(forta_totala, 2).tolist(),
            "putere_necesara_kW": np.round(putere_necesara, 2).tolist()
        },
        "coef_rezistenta_totala": {
            "formula": "ψ = f + (ρ · Cx · A · v²) / (2 · G)",
            "viteze_kmh": viteze_kmh.tolist(),
            "psi": np.round(psi, 4).tolist()
        }
    }
