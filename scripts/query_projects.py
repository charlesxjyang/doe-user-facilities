#!/usr/bin/env python3
import csv
import sys
from collections import Counter, defaultdict


def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "data/industry_projects_fy2025.csv"
    terms = [term.lower() for term in sys.argv[2:]]
    with open(path, newline="", encoding="utf-8") as fh:
        rows = list(csv.DictReader(fh))

    if terms:
        rows = [
            row
            for row in rows
            if any(term in " ".join(row.values()).lower() for term in terms)
        ]

    grouped = defaultdict(Counter)
    for row in rows:
        key = (row["Home Institution Name"], row["User Facility Acronym"], row["User Facility Full Name"])
        grouped[key][row["Project/Experiment Title"]] += 1

    for (company, acronym, full_name), titles in sorted(
        grouped.items(), key=lambda item: (-sum(item[1].values()), item[0][0])
    ):
        print(f"\n{company} | {acronym} | {full_name} | rows={sum(titles.values())}")
        for title, count in titles.most_common(12):
            print(f"  - {title} ({count})")


if __name__ == "__main__":
    main()
