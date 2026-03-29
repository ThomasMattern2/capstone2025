import re
import pandas as pd
import os
from glob import glob

def parse_motocalc_file_fixedwidth(filepath):
    """
    Parse a MotoCalc report using header token spans (fixed-width style).
    This is more robust for columns like 'Prop RPM' that shift with spacing.
    """
    metadata = {"Motor": "", "Battery": "", "Drive System": "", "Speed Control": ""}
    rows = []

    # --- read lines robustly ---
    for enc in ("utf-8", "windows-1252"):
        try:
            with open(filepath, "r", encoding=enc) as f:
                raw_lines = [line.rstrip("\n") for line in f]  # keep leading/trailing spaces (important)
            break
        except UnicodeDecodeError:
            continue
    else:
        return pd.DataFrame()

    # strip-only-empty later; but we need original lines for fixed-width slicing
    lines = [ln for ln in (l.rstrip() for l in raw_lines) if ln.strip()]

    # --- find metadata and header index (using startswith to be safe) ---
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
        elif re.match(r"^\s*AirSpd\b", line):  # header likely starts with AirSpd (allow leading spaces)
            header_index = i
            break

    if header_index is None:
        return pd.DataFrame()

    header_line = raw_lines[header_index]  # use original (with spacing) for spans
    # The units/second header row usually follows; data starts after two lines
    data_start = header_index + 2

    # --- detect header token spans using regex that captures consecutive non-space groups ---
    tokens = []
    for m in re.finditer(r'\S+(?:\s*%s)?' % '', header_line):  # match runs of non-whitespace (keeps their span)
        # we want continuous blocks: find sequences of non-space characters and their spans
        # fallback: this loop just captures every non-space token
        tokens.append((m.group(0).strip(), m.start(), m.end()))

    # If tokens look fragmented (e.g., "Batt Motor" split), collapse tokens separated by only single space:
    # Build initial token spans by scanning header_line for groups of non-space separated by at least 2 spaces,
    # otherwise join single-space separated tokens.
    # Prefer splitting on 2+ spaces (table column separators).
    header_tokens = []
    parts = re.split(r'(\s{2,})', header_line)  # keep separators
    cur_start = 0
    for part in parts:
        if re.fullmatch(r'\s{2,}', part):
            cur_start += len(part)
            continue
        text = part.rstrip()
        if not text:
            cur_start += len(part)
            continue
        start = header_line.find(text, cur_start)
        end = start + len(text)
        header_tokens.append((text.strip(), start, end))
        cur_start = end

    # If header_tokens created nothing (fallback), use tokens detection
    if not header_tokens:
        header_tokens = tokens

    # Clean header names: collapse internal whitespace to single space
    headers = [re.sub(r'\s+', ' ', t[0]) for t in header_tokens]
    spans = [(t[1], t[2]) for t in header_tokens]

    # Expand spans to cover until next span start so slices can include values that are right up to separators
    col_ranges = []
    for i, (s, e) in enumerate(spans):
        start = s
        if i + 1 < len(spans):
            end = spans[i + 1][0]  # up to next start
        else:
            end = None  # slice to end of line
        col_ranges.append((start, end))

    # --- parse each data line using slices ---
    for raw_line in raw_lines[data_start:]:
        line = raw_line.rstrip("\n")
        if not line.strip():
            continue
        if line.strip().startswith("Note:"):
            break

        values = []
        for (start, end) in col_ranges:
            if end is None:
                piece = line[start:].rstrip()
            else:
                # make sure we don't index out of range
                if start >= len(line):
                    piece = ""
                else:
                    piece = line[start:end].strip()
            values.append(piece)

        # If the last columns are missing (line shorter), pad
        if len(values) < len(headers):
            values += [""] * (len(headers) - len(values))

        row = dict(zip([re.sub(r'\s+', ' ', h) for h in headers], values))
        row.update(metadata)
        rows.append(row)

    # --- DataFrame ---
    df = pd.DataFrame(rows)

    # --- normalize column names (strip) and convert numerics ###
    df.columns = [c.strip() for c in df.columns]
    meta_keys = set(metadata.keys())
    for col in df.columns:
        if col not in meta_keys:
            # remove commas in numbers, convert colons times etc if needed
            clean = df[col].astype(str).str.replace(',', '').str.strip()
            # try numeric conversion; keep as string if not convertable
            try:
                df[col] = pd.to_numeric(clean.replace('', pd.NA), errors='coerce')
            except Exception:
                df[col] = clean

    return df

def parse_motocalc_file(filepath):
    """
    Parse a MotoCalc report file (.txt) into a pandas DataFrame.
    Keeps all columns, handles inconsistent spacing, and fills missing values.
    """
    metadata = {
        "Motor": "",
        "Battery": "",
        "Drive System": "",
        "Speed Control": "",
    }
    rows = []

    # --- Read file with robust encoding ---
    for encoding in ("utf-8", "windows-1252"):
        try:
            with open(filepath, "r", encoding=encoding) as f:
                lines = [line.strip() for line in f if line.strip()]
            break
        except UnicodeDecodeError:
            continue

    # --- Extract metadata and find header ---
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
        elif re.match(r"^AirSpd", line):  # beginning of data table
            header_index = i
            break

    if header_index is None:
        return pd.DataFrame()  # skip if no data table found

    # --- Parse headers ---
    headers = re.split(r"\s{2,}", lines[header_index].strip())  # split by 2+ spaces
    data_lines = lines[header_index + 2:]  # skip header + units line

    # --- Parse data rows ---
    for line in data_lines:
        if line.startswith("Note:"):
            break

        # Split data columns using same rule
        values = re.split(r"\s{2,}", line.strip())

        # Align values with headers
        if len(values) < len(headers):
            values += [""] * (len(headers) - len(values))
        elif len(values) > len(headers):
            values = values[:len(headers)]

        row = dict(zip(headers, values))
        row.update(metadata)
        rows.append(row)

    # --- Convert to DataFrame ---
    df = pd.DataFrame(rows)

    # --- Convert numeric columns where possible ---
    for col in df.columns:
        if col not in metadata:
            df[col] = pd.to_numeric(df[col], errors="ignore")

    return df

def append_all_to_excel():
    base_dir = r"C:\Users\jjmik\NonOneDriveDesktop\Y4 S1\Engg 501 Capstone\updated motors 2"
    output_path = r"C:\Users\jjmik\Downloads\motocalc_results6.xlsx"

    txt_files = glob(os.path.join(base_dir, "**", "*.txt"), recursive=True)
    print(f"Found {len(txt_files)} .txt files")

    all_dfs = []
    for i, file in enumerate(txt_files, 1):
        if i % 10 == 0 or i == len(txt_files):
            print(f"Processing file {i}/{len(txt_files)}")
        df = parse_motocalc_file(file)
        if not df.empty:
            all_dfs.append(df)

    # Concatenate once — big speed boost
    if all_dfs:
        final_df = pd.concat(all_dfs, ignore_index=True)
        final_df.to_excel(output_path, index=False)
        print(f"✅ Wrote {len(final_df)} total rows to {output_path}")
    else:
        print("⚠️ No valid data found.")


if __name__ == "__main__":
    append_all_to_excel()
    #parse_motocalc_file_fixedwidth(r"C:\Users\jjmik\NonOneDriveDesktop\Y4 S1\Engg 501 Capstone\createdReports\ff17478f-7d82-4562-92a3-e42e4d49d825.txt").to_csv("testallrows.csv")
