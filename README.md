# 📊 Data Drift Monitoring Platform

An end-to-end **Data Drift Detection & Monitoring Platform** that helps ML engineers and data teams detect, visualize, and track dataset drift across versions.

Built with **FastAPI (backend)** and **React + Tailwind (frontend)**, this project provides statistical drift detection, feature-level insights, health scoring, and drift evolution over time.

---

## 🚀 Features

### ✅ Dataset Management
- Upload **baseline** and **current** datasets (CSV)
- Automatic dataset versioning
- Supports multiple versions per dataset

### 📈 Drift Analysis
- Statistical drift detection (KS test, distance-based metrics)
- Feature-wise drift severity classification (Low / Medium / High)
- Overall **Data Health Score**

### 🎯 Feature Drift Prioritization
- Scatter plot showing:
  - Drift magnitude
  - Severity
- Helps identify **high-impact features first**

### 📊 Feature Distribution Comparison
- Binned distribution comparison
- Interactive feature selection
- Baseline vs current visualization

### ⏳ Drift Over Time
- Track how drift evolves across dataset versions
- Feature-wise historical drift trends

### 🤖 AI-Powered Insights
- Auto-generated summary
- Impacted features list
- Actionable recommendations:
  - Safe to use
  - Monitor closely
  - Retrain recommended

---

## 🧱 Tech Stack

### Backend
- **FastAPI**
- **SQLAlchemy**
- **SQLite**
- **Pandas / NumPy**
- **Scipy**

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **Recharts**
- **Axios**

---

## 📁 Project Structure

```
data_drift_platform/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   ├── requirements.txt
│   └── data_drift.db
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## ⚙️ How to Run Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/data-drift-monitor.git
cd data-drift-monitor
```

### 2️⃣ Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Mac/Linux
# venv\Scripts\activate    # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload
```

📍 Backend will run at:
http://127.0.0.1:8000

📄 API docs:
http://127.0.0.1:8000/docs

### 3️⃣ Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```

📍 Frontend will run at:
http://localhost:5173

### 📤 How to Use the Application
-	Enter a dataset name
-	Upload:
   	-	Baseline CSV
	-	Current CSV
-	Click Upload & Analyze
-	View:
  	-	Health score
	-	Drifted features
	-	Feature prioritization
	-	Distribution comparisons
	-	Drift over time
	-	AI recommendations
