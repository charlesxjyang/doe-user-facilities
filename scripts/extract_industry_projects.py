#!/usr/bin/env python3
import csv
import json
import sys
import zipfile
from collections import Counter, defaultdict
from pathlib import Path
from xml.etree.ElementTree import iterparse

NS = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"


def read_shared_strings(zf):
    strings = []
    with zf.open("xl/sharedStrings.xml") as fh:
        for _event, elem in iterparse(fh, events=("end",)):
            if elem.tag == f"{NS}si":
                parts = []
                for text in elem.iter(f"{NS}t"):
                    if text.text:
                        parts.append(text.text)
                strings.append("".join(parts))
                elem.clear()
    return strings


def cell_col(ref):
    letters = []
    for ch in ref:
        if ch.isalpha():
            letters.append(ch)
        else:
            break
    n = 0
    for ch in letters:
        n = n * 26 + (ord(ch.upper()) - 64)
    return n - 1


def read_sheet_rows(zf, shared_strings, sheet_name="xl/worksheets/sheet1.xml"):
    with zf.open(sheet_name) as fh:
        for _event, row in iterparse(fh, events=("end",)):
            if row.tag != f"{NS}row":
                continue
            values = []
            for cell in row:
                if cell.tag != f"{NS}c":
                    continue
                ref = cell.attrib.get("r", "")
                idx = cell_col(ref)
                while len(values) <= idx:
                    values.append("")
                value_node = cell.find(f"{NS}v")
                inline_node = cell.find(f"{NS}is/{NS}t")
                if value_node is None and inline_node is None:
                    value = ""
                elif cell.attrib.get("t") == "s":
                    value = shared_strings[int(value_node.text)]
                elif inline_node is not None:
                    value = inline_node.text or ""
                else:
                    value = value_node.text if value_node is not None else ""
                values[idx] = value
            yield values
            row.clear()


def main():
    workbook = Path(sys.argv[1] if len(sys.argv) > 1 else "DOE-SC_User_Statistics_by_Project_FY2025.xlsx")
    output_dir = Path(sys.argv[2] if len(sys.argv) > 2 else "data")
    output_dir.mkdir(parents=True, exist_ok=True)

    with zipfile.ZipFile(workbook) as zf:
        shared_strings = read_shared_strings(zf)
        rows = read_sheet_rows(zf, shared_strings)
        headers = next(rows)
        header_index = {name: i for i, name in enumerate(headers)}
        keep = [
            "Program Acronym",
            "Program Full Name",
            "User Facility Acronym",
            "User Facility Full Name",
            "User Facility Host Institution Acronym",
            "User Facility Host Institution Name",
            "Project/Experiment Title",
            "Project/Experiment Type",
            "Home Institution Name",
            "Home Institution City",
            "Home Institution State/Province/Territory",
            "Home Institution Country",
            "Industry?",
            "Home Institution Type",
        ]
        records = []
        by_facility = Counter()
        by_company = Counter()
        company_facility_titles = defaultdict(set)

        for row in rows:
            get = lambda col: row[header_index[col]] if header_index[col] < len(row) else ""
            is_industry = get("Industry?").strip().lower() == "yes"
            institution_type = get("Home Institution Type").strip().lower()
            if not is_industry and institution_type != "industry":
                continue
            record = {col: get(col) for col in keep}
            records.append(record)
            by_facility[record["User Facility Acronym"]] += 1
            by_company[record["Home Institution Name"]] += 1
            company_facility_titles[(record["Home Institution Name"], record["User Facility Acronym"])].add(
                record["Project/Experiment Title"]
            )

    csv_path = output_dir / "industry_projects_fy2025.csv"
    with csv_path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=keep)
        writer.writeheader()
        writer.writerows(records)

    summary = {
        "records": len(records),
        "top_facilities": by_facility.most_common(30),
        "top_companies": by_company.most_common(80),
        "top_company_facility_pairs": [
            {"company": c, "facility": f, "unique_titles": len(titles)}
            for (c, f), titles in sorted(
                company_facility_titles.items(), key=lambda item: len(item[1]), reverse=True
            )[:80]
        ],
    }
    summary_path = output_dir / "industry_summary_fy2025.json"
    summary_path.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
