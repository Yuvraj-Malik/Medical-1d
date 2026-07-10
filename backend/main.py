from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pickle
import pandas as pd
import numpy as np
import os
import math
import joblib

app = FastAPI(title="POPF Prediction API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models and artifacts
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SAVED_MODEL_DIR = os.path.join(BASE_DIR, 'saved_model')

def load_pickle(filename):
    with open(os.path.join(SAVED_MODEL_DIR, filename), 'rb') as f:
        return pickle.load(f)

def load_joblib(filename):
    import warnings
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        return joblib.load(os.path.join(SAVED_MODEL_DIR, filename))

print("Loading models and preprocessors...")
model = load_pickle('popf_model.pkl')
scaler = load_joblib('scaler.pkl')
knn_imputer = load_joblib('knn_imputer.pkl')
features_list = load_pickle('features.pkl')
continuous_cols = load_pickle('continuous_columns.pkl')
binary_cols = load_pickle('binary_columns.pkl')

class PredictionRequest(BaseModel):
    age: str = ""
    jaundice: str = ""
    weightLoss: str = ""
    recentDiabetes: str = ""
    fever: str = ""
    hb: str = ""
    comorbidity: str = ""
    ca199: str = ""
    pancreasTexture: str = ""
    cbdDiameter: str = ""
    dfa1: str = ""
    dfa3: str = ""
    rtDays: str = ""
    neoadjuvant: str = ""
    albumin: str = ""
    bill: str = ""
    alp: str = ""
    hba1c: str = ""
    cea: str = ""
    otTime: str = ""
    bloodLoss: str = ""
    tumorSize: str = ""

def parse_float(val):
    if not val or val.strip() == "":
        return np.nan
    try:
        return float(val)
    except:
        return np.nan

@app.post("/predict")
async def predict_popf(request: PredictionRequest):
    try:
        # Create a dictionary mapping the required exact feature names
        data_dict = {
            'Age ': parse_float(request.age),
            'jaundice': parse_float(request.jaundice),
            'weight loss ': parse_float(request.weightLoss),
            'RECENT DIABETES': parse_float(request.recentDiabetes),
            'fever ': parse_float(request.fever),
            'hb': parse_float(request.hb),
            'comorbidity': parse_float(request.comorbidity),
            'ca 19-9': parse_float(request.ca199),
            'PANCREAS TEXTURE ': parse_float(request.pancreasTexture),
            'CBD DIAMETER': parse_float(request.cbdDiameter),
            'dfa1': parse_float(request.dfa1),
            'dfa3': parse_float(request.dfa3),
            'RT days': parse_float(request.rtDays),
            'neoadjuvant ': parse_float(request.neoadjuvant),
            'albumin ': parse_float(request.albumin),
            'bill ': parse_float(request.bill),
            'ALP': parse_float(request.alp),
            'HBA1C': parse_float(request.hba1c),
            'Cea': parse_float(request.cea),
            'OT TIME': parse_float(request.otTime),
            'BLOOD LOSS ': parse_float(request.bloodLoss),
            'TUMOR SIZE': parse_float(request.tumorSize)
        }
        
        # Add missing columns expected by knn_imputer
        data_dict['Sex'] = np.nan
        data_dict['PANCREATIC DIAMETER'] = np.nan
        
        # 1. Impute continuous columns using knn_imputer
        cont_df = pd.DataFrame([data_dict])[continuous_cols]
        imputed_cont = knn_imputer.transform(cont_df)
        
        # Update data_dict with imputed continuous values
        for i, col in enumerate(continuous_cols):
            data_dict[col] = imputed_cont[0, i]
            
        # 2. Impute binary columns using mode (0.0 usually, but frontend should provide them)
        # If missing, we default to 0.0 for binary
        for col in binary_cols:
            if pd.isna(data_dict.get(col)):
                data_dict[col] = 0.0
                
        # 3. Create final feature array (22 features)
        final_df = pd.DataFrame([data_dict])[features_list]
        X = final_df.values.copy()
        
        # 4. Scale ONLY the continuous features among the 22 final features
        final_cont_mask = np.array([f not in binary_cols for f in features_list])
        
        # Extract the continuous part, scale it, and put it back
        cont_part = X[:, final_cont_mask]
        X[:, final_cont_mask] = scaler.transform(cont_part)
        
        # Predict
        prob = model.predict_proba(X)[0][1] # Probability of class 1
        
        # Determine risk level based on probability
        # Optional: if you have threshold.pkl, you could use it, but typically > 0.5 is high risk
        risk_level = "High Risk" if prob >= 0.5 else "Low Risk"
        if prob >= 0.75:
            risk_level = "Very High Risk"
        elif prob < 0.25:
            risk_level = "Very Low Risk"
        elif prob >= 0.25 and prob < 0.5:
            risk_level = "Low Risk"
        elif prob >= 0.5 and prob < 0.75:
            risk_level = "High Risk"
            
        return {
            "prediction": float(prob),
            "riskLevel": risk_level,
            "success": True
        }
    except Exception as e:
        print(f"Error during prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
