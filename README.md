# USV Diploma Calculator

Aplicație desktop pentru proiecte de diplomă - **Autovehicule Rutiere**
Universitatea "Ștefan cel Mare" din Suceava

## Funcționalități

- **Parametri Vehicul** - Introducere și gestionare date vehicul
- **Calcule Tehnice** - Rezistențe, tracțiune, performanțe, frânare
- **Editor Formule** - Scriere și vizualizare formule LaTeX (KaTeX)
- **Grafice Interactive** - Diagrame cu Plotly.js
- **Export Word** - Generare document formatat conform ghidului USV

## Instalare

### 1. Instalare dependențe Node.js

```bash
cd diploma-usv-app
npm install
```

### 2. Instalare dependențe Python

```bash
cd python
pip install -r requirements.txt
```

## Rulare în Development

### Terminal 1 - Backend Python

```bash
cd diploma-usv-app/python
uvicorn main:app --reload --port 8000
```

### Terminal 2 - Aplicație Electron

```bash
cd diploma-usv-app
npm run dev
```

## Build pentru Producție

```bash
npm run electron:build
```

Executabilul va fi generat în folderul `release/`.

## Structura Proiectului

```
diploma-usv-app/
├── electron/           # Electron main process
├── src/                # React frontend
│   ├── components/     # Componente UI
│   │   ├── Calculator/
│   │   ├── Charts/
│   │   ├── FormulaEditor/
│   │   ├── Layout/
│   │   └── WordPreview/
│   ├── store/          # State management (Zustand)
│   └── types/          # TypeScript types
├── python/             # Backend Python FastAPI
│   ├── calculations/   # Module de calcul
│   │   ├── resistance.py
│   │   ├── traction.py
│   │   ├── performance.py
│   │   └── braking.py
│   └── main.py
└── assets/             # Resurse statice
```

## API Backend

| Endpoint | Descriere |
|----------|-----------|
| `GET /health` | Status backend |
| `POST /calculate/rezistente` | Calcul Cap. 3 |
| `POST /calculate/tractiune` | Calcul Cap. 4 |
| `POST /calculate/performante` | Calcul Cap. 5 |
| `POST /calculate/franare` | Calcul Cap. 5.3 |

## Formule Implementate

### Rezistențe (Cap. 3)
- `F_r = f · G · cos(α)` - Rezistență rulare
- `F_a = 0.5 · ρ · Cx · A · v²` - Rezistență aerodinamică
- `F_p = G · sin(α)` - Rezistență pantă

### Tracțiune (Cap. 4)
- `P_e = P_max · (a·x + b·x² - c·x³)` - Caracteristica motor
- `F_t = (M_e · i_t · η_t) / r_d` - Forța de tracțiune

### Performanțe (Cap. 5)
- `D = (F_t - F_a) / G` - Factor dinamic
- `a = (D - f) · g / δ` - Accelerație

## Tehnologii

- **Frontend**: React 18, TypeScript, TailwindCSS
- **Math Rendering**: KaTeX
- **Charts**: Plotly.js
- **Word Export**: docx.js, docx-preview
- **Desktop**: Electron 28
- **Backend**: Python 3.10+, FastAPI, NumPy, SciPy

## Bibliografie Principală

1. Untaru et al. - "Dinamica autovehiculelor pe roți" (1981)
2. Frățilă et al. - "Calculul și construcția automobilelor" (1982)
3. Stoicescu - "Proiectarea performanțelor de tracțiune"
4. Frățilă, Mărculeșcu - "Sistemele de frânare ale autovehiculelor" (1986)

---

© 2024 USV Suceava - Autovehicule Rutiere
