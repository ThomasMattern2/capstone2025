import re
import pandas as pd
import os

def append_to_excel(df, excel_path):
    """
    Append a DataFrame to an Excel file.
    Creates the file if it doesn't exist.
    Keeps headers consistent across appends.
    """
    # Create directory if needed
    os.makedirs(os.path.dirname(excel_path), exist_ok=True)

    # If file doesn't exist, create a new one
    if not os.path.exists(excel_path):
        df.to_excel(excel_path, index=False)
        print(f"Created new Excel file: {excel_path}")
    else:
        # Load existing Excel data
        existing_df = pd.read_excel(excel_path)

        # Ensure both have same headers
        missing_cols = [c for c in existing_df.columns if c not in df.columns]
        for c in missing_cols:
            df[c] = None  # add missing columns as blank if needed

        # Reorder columns to match existing file
        df = df[existing_df.columns]

        # Concatenate and save back
        combined_df = pd.concat([existing_df, df], ignore_index=True)
        combined_df.to_excel(excel_path, index=False)
        print(f"Appended {len(df)} rows to {excel_path}")

def parse_motocalc_file(filepath):
    # --- Initialize data ---
    metadata = {
        "Motor": "",
        "Battery": "",
        "Drive System": "",
        "Speed Control": "",
    }
    rows = []

    # --- Read file (robust encoding) ---
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            lines = [line.strip() for line in f if line.strip()]
    except UnicodeDecodeError:
        with open(filepath, "r", encoding="windows-1252") as f:
            lines = [line.strip() for line in f if line.strip()]

    # --- Extract metadata ---
    header_index = None
    for i, line in enumerate(lines):
        if line.startswith("Motor:"):
            metadata["Motor"] = line.split("Motor:")[1].strip()
        elif line.startswith("Battery:"):
            metadata["Battery"] = line.split("Battery:")[1].strip()
        elif line.startswith("Drive System:"):
            metadata["Drive System"] = line.split("Drive System:")[1].strip()
        elif line.startswith("Speed Control:"):
            metadata["Speed Control"] = line.split("Speed Control:")[1].strip()
        elif re.match(r"^AirSpd", line):
            header_index = i
            break

    # --- Parse data table ---
    if header_index is not None:
        # Extract headers (split by spacing)
        headers = re.split(r"\s+", lines[header_index].strip())
        data_lines = lines[header_index + 2:]  # Skip units row

        for line in data_lines:
            if line.startswith("Note:"):
                break
            values = re.split(r"\s+", line.strip())
            if len(values) < len(headers):
                continue

            # Build row as dictionary
            row = dict(zip(headers, values))
            # Merge with metadata
            row.update(metadata)
            rows.append(row)

    # --- Convert to DataFrame ---
    df = pd.DataFrame(rows)

    # --- Convert numeric columns ---
    numeric_cols = [c for c in df.columns if c not in metadata.keys()]
    for col in numeric_cols:
        df[col] = pd.to_numeric(df[col], errors="ignore")

    return df

def get_all_txt_files(directory):
    """Return a list of all .txt files in the directory and subdirectories."""
    txt_files = []
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.txt'):
                txt_files.append(os.path.join(root, file))
    return txt_files

def append_all_to_excel():
    txt_files = get_all_txt_files(r"C:\Users\jjmik\NonOneDriveDesktop\Y4 S1\Engg 501 Capstone\createdReports")
    for file in txt_files:
        df = parse_motocalc_file(file)
        append_to_excel(df, r"C:\Users\jjmik\Downloads\motocalc_results3.xlsx")

if __name__ == "__main__":
    append_all_to_excel()