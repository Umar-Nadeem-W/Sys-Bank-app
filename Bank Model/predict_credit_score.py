"""
Credit Score Prediction Engine
-------------------------------
Fixes the notebook's THRESHOLD = 0.02 bug (drops all features),
trains a Gradient Boosting Regressor on all available features, then predicts
a credit score for Umar's financial profile and writes the result
to ../server/data/credit_score.json
"""

import os
import json
import warnings
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, r2_score

warnings.filterwarnings('ignore')

# ── 1. Load data ─────────────────────────────────────────────────────────────
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH  = os.path.join(SCRIPT_DIR, 'synthetic_personal_finance_dataset.csv')
OUT_DIR    = os.path.join(SCRIPT_DIR, '..', 'server', 'data')
OUT_PATH   = os.path.join(OUT_DIR, 'credit_score.json')

print('Loading dataset...')
df = pd.read_csv(DATA_PATH)
print(f'  Shape: {df.shape}')

# ── 2. Clean ──────────────────────────────────────────────────────────────────
df['record_date'] = pd.to_datetime(df['record_date'], format='mixed')
df['record_year']  = df['record_date'].dt.year
df['record_month'] = df['record_date'].dt.month
df.drop(columns=['user_id', 'record_date'], inplace=True)

df['has_loan'] = df['has_loan'].map({'Yes': 1, 'No': 0})
df['loan_type'] = df['loan_type'].fillna('None')

# ── 3. Encode ─────────────────────────────────────────────────────────────────
cat_cols = ['gender', 'education_level', 'employment_status',
            'job_title', 'loan_type', 'region']
df_enc = pd.get_dummies(df, columns=cat_cols, drop_first=True)

bool_cols = df_enc.select_dtypes(include='bool').columns
df_enc[bool_cols] = df_enc[bool_cols].astype(int)

print(f'  Encoded shape: {df_enc.shape}')

# ── 4. FIX: skip the broken correlation threshold filter ─────────────────────
#  The notebook used THRESHOLD = 0.02 which dropped ALL 37 features because
#  this synthetic dataset has max |corr| = 0.014. We keep every feature and
#  let the GBR decide importance via boosting.

X = df_enc.drop(columns=['credit_score'])
y = df_enc['credit_score']
print(f'  Features used: {X.shape[1]}')

# ── 5. Train / test split ─────────────────────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f'  Train: {X_train.shape}  Test: {X_test.shape}')

# ── 6. Train Gradient Boosting Regressor ─────────────────────────────────────
print('Training Gradient Boosting Regressor...')
gbr = GradientBoostingRegressor(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=4,
    subsample=0.8,
    random_state=42
)
gbr.fit(X_train, y_train)

y_pred = gbr.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
r2  = r2_score(y_test, y_pred)
print(f'  MAE: {mae:.2f}   R2: {r2:.4f}')

# ── 7. Build Umar's feature vector ───────────────────────────────────────────
#  Profile derived from the Bank App dummy data:
#    income=5500, avg_expenses=2893, savings=13600, loan_remaining=720000
#    Assumptions: age=32, Male, Bachelor, Employed, Manager, Home loan, Asia

umar_raw = {
    'age':                    32,
    'monthly_income_usd':     5500.0,
    'monthly_expenses_usd':   2893.0,
    'savings_usd':            13600.0,
    'has_loan':               1,
    'loan_amount_usd':        1200000.0,
    'loan_term_months':       360,
    'monthly_emi_usd':        1688.0,
    'debt_to_income_ratio':   round(1688.0 / 5500.0, 4),
    'savings_to_income_ratio': round(13600.0 / 5500.0, 4),
    'record_year':            2024,
    'record_month':           5,
    # One-hot fields (drop_first=True; base categories dropped)
    'gender_Male':            1,
    'gender_Other':           0,
    'education_level_High School': 0,
    'education_level_Master': 0,
    'education_level_Other':  0,
    'education_level_PhD':    0,
    'employment_status_Self-employed': 0,
    'employment_status_Student':       0,
    'employment_status_Unemployed':    0,
    'job_title_Doctor':       0,
    'job_title_Driver':       0,
    'job_title_Engineer':     0,
    'job_title_Manager':      1,
    'job_title_Salesperson':  0,
    'job_title_Student':      0,
    'job_title_Teacher':      0,
    'job_title_Unemployed':   0,
    'loan_type_Education':    0,
    'loan_type_Home':         1,
    'loan_type_None':         0,
    'region_Asia':            1,
    'region_Europe':          0,
    'region_North America':   0,
    'region_Other':           0,
}

umar_df = pd.DataFrame([umar_raw]).reindex(columns=X_train.columns, fill_value=0)

# ── 8. Predict ────────────────────────────────────────────────────────────────
raw_score    = gbr.predict(umar_df)[0]
credit_score = int(round(float(np.clip(raw_score, 300, 850))))

def rating(score):
    if score >= 750: return 'Excellent'
    if score >= 700: return 'Very Good'
    if score >= 650: return 'Good'
    if score >= 600: return 'Fair'
    if score >= 550: return 'Average'
    return 'Poor'

print(f"\n  Umar's predicted credit score: {credit_score}  ({rating(credit_score)})")

# ── 9. Write JSON ─────────────────────────────────────────────────────────────
os.makedirs(OUT_DIR, exist_ok=True)
payload = {
    'creditScore': credit_score,
    'rating':      rating(credit_score),
    'maxScore':    850,
    'minScore':    300,
    'model':       'Gradient Boosting Regressor',
    'modelMAE':    round(float(mae), 2),
    'modelR2':     round(float(r2), 4),
}
with open(OUT_PATH, 'w') as f:
    json.dump(payload, f, indent=2)

print(f'  Written to: {OUT_PATH}')
print('Done.')
