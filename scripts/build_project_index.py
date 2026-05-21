#!/usr/bin/env python3
import csv
import json
from collections import defaultdict
from pathlib import Path


FACILITY_TYPES = {
    "Supercomputing": ["NERSC", "ALCF", "OLCF"],
    "X-ray Light Sources": ["ALS", "APS", "LCLS", "NSLS-II", "SSRL"],
    "Nanoscience Centers": ["CFN", "CINT", "CNMS", "CNM", "TMF"],
    "Fusion Facilities": ["DIII-D", "NSTX-U"],
    "Accelerator & Isotope Facilities": ["ATF", "FACET-II", "Fermilab AC", "CEBAF", "RHIC", "FRIB", "ATLAS"],
    "Neutron Sources": ["HFIR", "SNS"],
    "Biological & Environmental Facilities": ["ARM", "EMSL", "JGI"],
    "Network Testbed": ["ESnet (Testbed)", "Esnet (Testbed)"],
}


def main():
    source = Path("data/industry_projects_fy2025.csv")
    rows = list(csv.DictReader(source.open(encoding="utf-8")))
    facility_to_type = {
        facility: facility_type
        for facility_type, facilities in FACILITY_TYPES.items()
        for facility in facilities
    }

    grouped = defaultdict(lambda: defaultdict(lambda: defaultdict(lambda: defaultdict(int))))
    facility_names = {}

    for row in rows:
        facility = row["User Facility Acronym"]
        facility_type = facility_to_type.get(facility, "Other DOE User Facilities")
        company = row["Home Institution Name"].strip() or "Unknown company"
        title = row["Project/Experiment Title"].strip() or "Untitled project"
        facility_names[facility] = row["User Facility Full Name"]
        grouped[facility_type][facility][company][title] += 1

    index = []
    for facility_type in sorted(grouped):
        type_entry = {"type": facility_type, "facilities": []}
        for facility in sorted(grouped[facility_type]):
            facility_entry = {
                "acronym": facility,
                "name": facility_names.get(facility, facility),
                "companies": [],
            }
            for company in sorted(grouped[facility_type][facility]):
                projects = [
                    {"title": title, "rows": count}
                    for title, count in sorted(grouped[facility_type][facility][company].items())
                ]
                facility_entry["companies"].append(
                    {"name": company, "project_count": len(projects), "row_count": sum(p["rows"] for p in projects), "projects": projects}
                )
            type_entry["facilities"].append(facility_entry)
        index.append(type_entry)

    output = Path("data/industry_projects_index.json")
    output.write_text(json.dumps(index, indent=2), encoding="utf-8")
    js_output = Path("assets/project-index-data.js")
    js_output.write_text(
        "window.INDUSTRY_PROJECT_INDEX = "
        + json.dumps(index, separators=(",", ":"))
        + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {output}")
    print(f"Wrote {js_output}")


if __name__ == "__main__":
    main()
