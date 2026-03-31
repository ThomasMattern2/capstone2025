import pandas as pd
import json

# Load the sheet
df = pd.read_excel("motocalc_results.xlsx", sheet_name="MotoCalc Data")

# Keep relevant columns
df = df[["Motor", "Speed", "Thrust"]]

# Group by Motor for easier use in React
grouped = {}
for motor, group in df.groupby("Motor"):
    grouped[motor] = group[["Speed", "Thrust"]].to_dict(orient="records")

# Save as JSON for React
output_path = r"C:\Users\jjmik\NonOneDriveDesktop\Y4 S1\Engg 501 Capstone\capstone2025\sw\frontend\src\components\aboutComponents\motocalc_results.json"
with open(output_path, "w") as f:
    json.dump(grouped, f, indent=2)

output_path
