#!/usr/bin/env python3
import json
import math
from pathlib import Path

EXCLUDE = {"02", "15", "60", "66", "69", "72", "78"}
WIDTH = 900
HEIGHT = 540
PADDING = 18


def albers_raw(lon, lat):
    phi = math.radians(lat)
    lam = math.radians(lon)
    phi1 = math.radians(29.5)
    phi2 = math.radians(45.5)
    phi0 = math.radians(37.5)
    lam0 = math.radians(-96)
    n = 0.5 * (math.sin(phi1) + math.sin(phi2))
    c = math.cos(phi1) ** 2 + 2 * n * math.sin(phi1)
    theta = n * (lam - lam0)
    rho = math.sqrt(max(0, c - 2 * n * math.sin(phi))) / n
    rho0 = math.sqrt(max(0, c - 2 * n * math.sin(phi0))) / n
    return rho * math.sin(theta), rho0 - rho * math.cos(theta)


def decode_arcs(topology):
    scale = topology["transform"]["scale"]
    translate = topology["transform"]["translate"]
    decoded = []
    for arc in topology["arcs"]:
        x = y = 0
        points = []
        for dx, dy in arc:
            x += dx
            y += dy
            points.append((x * scale[0] + translate[0], y * scale[1] + translate[1]))
        decoded.append(points)
    return decoded


def arc_points(arcs, idx):
    points = arcs[~idx] if idx < 0 else arcs[idx]
    return list(reversed(points)) if idx < 0 else points


def rings_for_geometry(arcs, geometry):
    if geometry["type"] == "Polygon":
        polygons = [geometry["arcs"]]
    else:
        polygons = geometry["arcs"]
    for polygon in polygons:
        for ring in polygon:
            points = []
            for arc_idx in ring:
                part = arc_points(arcs, arc_idx)
                if points and part:
                    points.extend(part[1:])
                else:
                    points.extend(part)
            if len(points) > 2:
                yield points


def main():
    topology_path = Path("data/raw/us-states-10m.json")
    output_path = Path("assets/us-map-paths.js")
    topology = json.loads(topology_path.read_text(encoding="utf-8"))
    arcs = decode_arcs(topology)
    geometries = [
        g
        for g in topology["objects"]["states"]["geometries"]
        if g.get("id") not in EXCLUDE
    ]

    raw_points = []
    state_rings = []
    for geometry in geometries:
        rings = list(rings_for_geometry(arcs, geometry))
        state_rings.append((geometry, rings))
        for ring in rings:
            raw_points.extend(albers_raw(lon, lat) for lon, lat in ring)

    min_x = min(x for x, _ in raw_points)
    max_x = max(x for x, _ in raw_points)
    min_y = min(y for _, y in raw_points)
    max_y = max(y for _, y in raw_points)
    k = min((WIDTH - PADDING * 2) / (max_x - min_x), (HEIGHT - PADDING * 2) / (max_y - min_y))
    tx = (WIDTH - k * (min_x + max_x)) / 2
    ty = (HEIGHT + k * (min_y + max_y)) / 2

    def project(lon, lat):
        x, y = albers_raw(lon, lat)
        return round(x * k + tx, 2), round(-y * k + ty, 2)

    states = []
    for geometry, rings in state_rings:
        parts = []
        for ring in rings:
            coords = [project(lon, lat) for lon, lat in ring]
            if not coords:
                continue
            d = [f"M{coords[0][0]},{coords[0][1]}"]
            d.extend(f"L{x},{y}" for x, y in coords[1:])
            d.append("Z")
            parts.append("".join(d))
        states.append(
            {
                "id": geometry["id"],
                "name": geometry["properties"]["name"],
                "path": "".join(parts),
            }
        )

    payload = {
        "viewBox": f"0 0 {WIDTH} {HEIGHT}",
        "projection": {
            "scale": k,
            "translate": [tx, ty],
            "width": WIDTH,
            "height": HEIGHT,
        },
        "states": states,
    }
    output_path.write_text(
        "window.US_MAP = " + json.dumps(payload, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"Wrote {output_path} with {len(states)} state paths")


if __name__ == "__main__":
    main()
