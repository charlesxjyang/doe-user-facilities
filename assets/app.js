const WIDTH = 1600;
const HEIGHT = 900;
const MAP = { x: 340, y: 150, w: 920, h: 552 };
const MAP_SCALE = MAP.w / 900;
const LOGOS = {
  "geaerospace.com": "assets/logos/geaerospace.png",
  "jpmorganchase.com": "assets/logos/jpmorganchase.png",
  "nvidia.com": "assets/logos/nvidia.svg",
  "boeing.com": "assets/logos/boeing.svg",
  "formenergy.com": "assets/logos/formenergy.png",
  "gm.com": "assets/logos/generalmotors.svg",
  "ibm.com": "assets/logos/ibm.svg",
  "intel.com": "assets/logos/intel.svg",
  "microsoft.com": "assets/logos/microsoft.svg",
  "skynano.co": "assets/logos/skynano.png",
  "westerndigital.com": "assets/logos/westerndigital.svg",
  "c12qe.com": "assets/logos/c12quantum.png",
  "ga.com": "assets/logos/generalatomics.png",
  "nextstepfusion.com": "assets/logos/nextstepfusion.png",
  "tokamakenergy.co.uk": "assets/logos/tokamakenergy.png",
  "novaphotonics.com": "assets/logos/novaphotonics.png",
  "spacex.com": "assets/logos/spacex.svg",
  "ti.com": "assets/logos/texasinstruments.png",
  "powerbeaminc.com": "assets/logos/powerbeam.png",
  "walischmiller.de": "assets/logos/walischmiller.png",
  "kairospower.com": "assets/logos/kairospower.png",
  "henkel.com": "assets/logos/henkel.png",
  "slb.com": "assets/logos/slb.png",
  "sandia.gov": "assets/logos/sandia.png"
  ,"cerebras.net": "assets/logos/cerebras.png"
  ,"cfs.energy": "assets/logos/commonwealthfusion.svg"
  ,"cubicpv.com": "assets/logos/cubicpv.png"
  ,"gevernova.com": "assets/logos/gevernova.png"
  ,"prattwhitney.com": "assets/logos/prattwhitney.png"
  ,"lamresearch.com": "assets/logos/lamresearch.png"
  ,"dow.com": "assets/logos/dow.svg"
  ,"seagate.com": "assets/logos/seagate.svg"
  ,"limelightsteel.com": "assets/logos/limelightsteel.png"
  ,"helionenergy.com": "assets/logos/helionenergy.png"
  ,"northropgrumman.com": "assets/logos/northropgrumman.png"
  ,"thermofisher.com": "assets/logos/thermofisher.png"
  ,"toyota.com": "assets/logos/toyota.svg"
};

function albersRaw(lon, lat) {
  const rad = Math.PI / 180;
  const phi = lat * rad;
  const lam = lon * rad;
  const phi1 = 29.5 * rad;
  const phi2 = 45.5 * rad;
  const phi0 = 37.5 * rad;
  const lam0 = -96 * rad;
  const n = 0.5 * (Math.sin(phi1) + Math.sin(phi2));
  const c = Math.cos(phi1) ** 2 + 2 * n * Math.sin(phi1);
  const theta = n * (lam - lam0);
  const rho = Math.sqrt(Math.max(0, c - 2 * n * Math.sin(phi))) / n;
  const rho0 = Math.sqrt(Math.max(0, c - 2 * n * Math.sin(phi0))) / n;
  return [rho * Math.sin(theta), rho0 - rho * Math.cos(theta)];
}

function projectFacility(facility) {
  const [rawX, rawY] = albersRaw(facility.lon, facility.lat);
  const p = window.US_MAP.projection;
  return {
    x: MAP.x + (rawX * p.scale + p.translate[0]) * MAP_SCALE,
    y: MAP.y + (-rawY * p.scale + p.translate[1]) * MAP_SCALE
  };
}

function normalizeProjects(slide) {
  const minGap = slide.cardGap ?? 12;
  const normalized = slide.projects.map((project) => {
    const minHeight = slide.compactCards ? 136 : 168;
    const next = { ...project, h: Math.max(project.h, minHeight) };
    if (next.y < 135) next.y = 148;
    const maxY = 838 - next.h;
    if (next.y > maxY) next.y = maxY;
    return next;
  });
  const columns = new Map();
  normalized.forEach((project) => {
    const key = Math.round(project.x / 10) * 10;
    if (!columns.has(key)) columns.set(key, []);
    columns.get(key).push(project);
  });
  columns.forEach((projects) => {
    projects
      .sort((a, b) => a.y - b.y)
      .forEach((project, index) => {
        if (index === 0) return;
        const previous = projects[index - 1];
        const minY = previous.y + previous.h + minGap;
        if (project.y < minY) project.y = minY;
      });
    for (let i = projects.length - 1; i >= 0; i -= 1) {
      const maxY = i === projects.length - 1
        ? 838 - projects[i].h
        : projects[i + 1].y - projects[i].h - minGap;
      if (projects[i].y > maxY) projects[i].y = maxY;
    }
  });
  return normalized;
}

function initials(company) {
  return company
    .replace(/\([^)]*\)/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function logoMarkup(project) {
  const src = LOGOS[project.domain];
  if (!src) {
    return `<div class="logo-fallback">${escapeHtml(initials(project.company))}</div>`;
  }
  return `<img src="${src}" alt="${escapeHtml(project.company)} logo" />`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cardAnchor(project, target) {
  const cy = project.y + project.h / 2;
  return {
    x: target.x > project.x + project.w / 2 ? project.x + project.w : project.x,
    y: cy
  };
}

function facilityPositions(slide) {
  const counts = new Map();
  const positions = {};

  slide.facilities.forEach((id) => {
    const base = projectFacility(window.GRAPHIC_DATA.facilities[id]);
    const key = `${Math.round(base.x / 4)}:${Math.round(base.y / 4)}`;
    const count = counts.get(key) || 0;
    counts.set(key, count + 1);
    positions[id] = { ...base, collisionKey: key, collisionIndex: count };
  });

  const totals = new Map();
  Object.values(positions).forEach((pos) => {
    totals.set(pos.collisionKey, (totals.get(pos.collisionKey) || 0) + 1);
  });

  Object.entries(positions).forEach(([, pos]) => {
    const total = totals.get(pos.collisionKey);
    pos.collisionTotal = total;
    if (total > 1) {
      const angle = (-90 + (360 / total) * pos.collisionIndex) * Math.PI / 180;
      pos.x += Math.cos(angle) * 10;
      pos.y += Math.sin(angle) * 10;
    }
  });

  Object.entries(slide.facilityOffsets || {}).forEach(([id, offset]) => {
    if (!positions[id]) return;
    positions[id].x += offset.dx || 0;
    positions[id].y += offset.dy || 0;
  });

  const minDistance = slide.minFacilityDistance ?? 24;
  const positionList = Object.entries(positions);
  for (let pass = 0; pass < 10; pass += 1) {
    let moved = false;
    for (let i = 0; i < positionList.length; i += 1) {
      for (let j = i + 1; j < positionList.length; j += 1) {
        const a = positionList[i][1];
        const b = positionList[j][1];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy) || 1;
        if (distance >= minDistance) continue;
        const push = (minDistance - distance) / 2;
        const ux = dx / distance;
        const uy = dy / distance;
        a.x -= ux * push;
        a.y -= uy * push;
        b.x += ux * push;
        b.y += uy * push;
        moved = true;
      }
    }
    if (!moved) break;
  }

  return positions;
}

function renderMap(svg, slide, positions) {
  const states = document.createElementNS("http://www.w3.org/2000/svg", "g");
  states.setAttribute("class", "states");
  states.setAttribute("transform", `translate(${MAP.x} ${MAP.y}) scale(${MAP_SCALE})`);
  window.US_MAP.states.forEach((state) => {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", state.path);
    path.setAttribute("data-name", state.name);
    states.append(path);
  });
  svg.append(states);

  const markers = document.createElementNS("http://www.w3.org/2000/svg", "g");
  markers.setAttribute("class", "markers");
  slide.facilities.forEach((id) => {
    const pos = positions[id];
    const used = slide.projects.some((project) => project.facility === id);
    const facility = window.GRAPHIC_DATA.facilities[id];
    const labelOffset = slide.labelOffsets?.[id] || labelOffsetFor(pos);
    const marker = document.createElementNS("http://www.w3.org/2000/svg", "g");
    marker.setAttribute("class", `facility-marker ${used ? "is-featured" : ""}`);
    marker.setAttribute("transform", `translate(${pos.x} ${pos.y})`);
    marker.innerHTML = `
      <circle r="7"></circle>
      <text x="${labelOffset.dx}" y="${labelOffset.dy}" text-anchor="${labelOffset.anchor || "start"}">${escapeHtml(id)}</text>
      <title>${escapeHtml(facility.name)} (${escapeHtml(facility.host)})</title>
    `;
    markers.append(marker);
  });
  svg.append(markers);
}

function labelOffsetFor(pos) {
  if (pos.collisionTotal > 1) {
    const dy = (pos.collisionIndex - (pos.collisionTotal - 1) / 2) * 18 + 4;
    return { dx: 14, dy };
  }
  return { dx: 12, dy: 4 };
}

function renderCallouts(svg, slide, positions) {
  const lines = document.createElementNS("http://www.w3.org/2000/svg", "g");
  lines.setAttribute("class", "connectors");
  slide.projects.forEach((project) => {
    const target = positions[project.facility];
    const start = cardAnchor(project, target);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const midX = start.x + (target.x - start.x) * 0.5;
    if (Array.isArray(project.connectorControls) && project.connectorControls.length === 2) {
      const [c1, c2] = project.connectorControls;
      line.setAttribute("d", `M${start.x},${start.y} C${c1.x},${c1.y} ${c2.x},${c2.y} ${target.x},${target.y}`);
    } else if (typeof project.connectorY === "number") {
      const controlInset = target.x > start.x ? 80 : -80;
      line.setAttribute("d", `M${start.x},${start.y} C${start.x + controlInset},${project.connectorY} ${target.x - controlInset},${project.connectorY} ${target.x},${target.y}`);
    } else {
      line.setAttribute("d", `M${start.x},${start.y} C${midX},${start.y} ${midX},${target.y} ${target.x},${target.y}`);
    }
    line.setAttribute("stroke", slide.accent);
    lines.append(line);
  });
  const markerLayer = svg.querySelector(".markers");
  if (markerLayer) {
    svg.insertBefore(lines, markerLayer);
  } else {
    svg.append(lines);
  }

  const cards = document.createElementNS("http://www.w3.org/2000/svg", "g");
  cards.setAttribute("class", "callouts");
  slide.projects.forEach((project) => {
    const cardClass = slide.compactCards ? "callout-card is-compact" : "callout-card";
    const foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    foreign.setAttribute("x", project.x);
    foreign.setAttribute("y", project.y);
    foreign.setAttribute("width", project.w);
    foreign.setAttribute("height", project.h);
    foreign.innerHTML = `
      <div class="${cardClass}" xmlns="http://www.w3.org/1999/xhtml" style="--accent:${slide.accent}">
        <div class="logo-box">
          ${logoMarkup(project)}
        </div>
        <div class="callout-copy">
          <div class="company">${escapeHtml(project.company)}</div>
          <div class="facility">${escapeHtml(project.facility)} · ${escapeHtml(project.project)}</div>
          <div class="description">${escapeHtml(project.description)}</div>
        </div>
      </div>
    `;
    cards.append(foreign);
  });
  svg.append(cards);
  if (markerLayer) {
    svg.append(markerLayer);
  }
}

function renderSlide(slide) {
  slide = { ...slide, projects: normalizeProjects(slide) };
  const frame = document.createElement("section");
  frame.className = "graphic-frame";
  frame.id = slide.id;

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "graphic");
  svg.setAttribute("viewBox", `0 0 ${WIDTH} ${HEIGHT}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${slide.title}: ${slide.kicker}`);
  svg.style.setProperty("--accent", slide.accent);

  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("class", "page-bg");
  background.setAttribute("width", WIDTH);
  background.setAttribute("height", HEIGHT);
  svg.append(background);

  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("class", "graphic-title");
  title.setAttribute("x", 64);
  title.setAttribute("y", 78);
  title.textContent = slide.title;
  svg.append(title);

  const kicker = document.createElementNS("http://www.w3.org/2000/svg", "text");
  kicker.setAttribute("class", "graphic-kicker");
  kicker.setAttribute("x", 64);
  kicker.setAttribute("y", 118);
  kicker.textContent = slide.kicker;
  svg.append(kicker);

  const positions = facilityPositions(slide);
  renderMap(svg, slide, positions);
  renderCallouts(svg, slide, positions);

  const sourceLink = document.createElementNS("http://www.w3.org/2000/svg", "a");
  sourceLink.setAttribute("href", "https://science.osti.gov/User-Facilities/User-Statistics/Data-Archive");
  sourceLink.setAttribute("target", "_blank");
  sourceLink.setAttribute("rel", "noopener noreferrer");
  const note = document.createElementNS("http://www.w3.org/2000/svg", "text");
  note.setAttribute("class", "source-note");
  note.setAttribute("x", 64);
  note.setAttribute("y", 856);
  note.textContent = "Source: DOE-SC User Statistics by Project FY2025 workbook";
  sourceLink.append(note);
  svg.append(sourceLink);

  frame.append(svg);
  return frame;
}

function render() {
  const params = new URLSearchParams(window.location.search);
  const exportMode = params.get("export") === "1";
  if (exportMode) {
    document.body.classList.add("export-mode");
  }
  const nav = document.querySelector(".nav-links");
  const app = document.querySelector("#graphics");
  const selectedSlide = params.get("slide");
  const slides = selectedSlide
    ? window.GRAPHIC_DATA.slides.filter((slide) => slide.id === selectedSlide)
    : window.GRAPHIC_DATA.slides;

  window.GRAPHIC_DATA.slides.forEach((slide, index) => {
    const link = document.createElement("a");
    link.href = selectedSlide ? `index.html?slide=${slide.id}` : `#${slide.id}`;
    link.textContent = `${index + 1}. ${slide.title}`;
    nav.append(link);
  });

  slides.forEach((slide) => {
    app.append(renderSlide(slide));
  });

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) target.scrollIntoView();
  }
}

render();
