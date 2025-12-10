"""
USV Diploma Calculator - Python Backend
Calcule tehnice pentru proiecte de diplomă Autovehicule Rutiere
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np

from calculations.resistance import calculate_resistances
from calculations.traction import calculate_traction
from calculations.performance import calculate_performance
from calculations.braking import calculate_braking

app = FastAPI(
    title="USV Diploma Calculator API",
    description="Backend pentru calcule tehnice automotive",
    version="1.0.0"
)

# CORS pentru Electron
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== Pydantic Models ==============

class VehicleDimensions(BaseModel):
    lungime: float
    latime: float
    inaltime: float
    ampatament: float
    ecartamentFata: float
    ecartamentSpate: float
    gardaSol: float
    consolaFata: float
    consolaSpate: float

class VehicleMass(BaseModel):
    masaGoala: float
    masaTotala: float
    capacitateIncarcare: float
    repartizareFata: float
    repartizareSpate: float
    inaltimeCentruMasa: float

class TireParams(BaseModel):
    dimensiune: str
    latime: float
    raportProfil: float
    diametruJanta: float
    razaStatica: float
    razaDinamica: float
    coefRulare: float

class EngineParams(BaseModel):
    tip: str
    cilindree: float
    putereMaxima: float
    turatiePutereMax: float
    cuplMaxim: float
    turatieCuplMax: float
    turatieMaxima: float
    turatieRalanti: float

class TransmissionParams(BaseModel):
    tipTransmisie: str
    numarTrepte: int
    raporturiCV: List[float]
    raportPrincipal: float
    randamentTransmisie: float

class AerodynamicParams(BaseModel):
    coefAerodinamic: float
    arieFrontala: float

class VehicleParams(BaseModel):
    nume: str
    dimensiuni: VehicleDimensions
    masa: VehicleMass
    pneu: TireParams
    motor: EngineParams
    transmisie: TransmissionParams
    aerodinamic: AerodynamicParams

# ============== API Endpoints ==============

@app.get("/")
async def root():
    return {"message": "USV Diploma Calculator API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "python-backend"}

@app.post("/calculate/rezistente")
async def calc_resistances(vehicle: VehicleParams):
    """Calculează rezistențele la înaintare (Cap. 3)"""
    return calculate_resistances(vehicle)

@app.post("/calculate/tractiune")
async def calc_traction(vehicle: VehicleParams):
    """Calculează caracteristicile de tracțiune (Cap. 4)"""
    return calculate_traction(vehicle)

@app.post("/calculate/performante")
async def calc_performance(vehicle: VehicleParams):
    """Calculează performanțele dinamice (Cap. 5)"""
    return calculate_performance(vehicle)

@app.post("/calculate/franare")
async def calc_braking(vehicle: VehicleParams):
    """Calculează performanțele de frânare (Cap. 5.3)"""
    return calculate_braking(vehicle)

@app.post("/calculate/all")
async def calc_all(vehicle: VehicleParams):
    """Calculează toate capitolele"""
    return {
        "rezistente": calculate_resistances(vehicle),
        "tractiune": calculate_traction(vehicle),
        "performante": calculate_performance(vehicle),
        "franare": calculate_braking(vehicle)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
