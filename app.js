const FUEL_LABELS = {
  gasoline95: "Gasoline 95",
  diesel: "Diesel",
  lpg: "LPG"
};

const FALLBACK_RATES = {
  EUR: 1, USD: 1.08, GBP: 0.84, CHF: 0.94, NOK: 11.8, SEK: 11.1, DKK: 7.46,
  PLN: 4.25, CZK: 24.7, HUF: 390, RON: 4.98, BGN: 1.9558, TRY: 39, RSD: 117, ISK: 150
};

const ZERO_DECIMAL = new Set(["HUF", "ISK", "RSD"]);
let previousDocumentTitle = document.title;

const state = {
  countries: JSON.parse(JSON.stringify(window.EUROPE_COUNTRIES || [])),
  rates: { ...FALLBACK_RATES },
  fuel: "gasoline95",
  currency: "EUR",
  sortKey: "gasoline95",
  sortDirection: "asc",
  search: "",
  activeIso: null,
  selectedIso: null,
  priceStatus: "fallback",
  rateStatus: "fallback",
  lastUpdated: null,
  sourceUrl: ""
};

const $ = (id) => document.getElementById(id);
const landLayer = $("landLayer");
const countryLayer = $("countryLayer");
const microLayer = $("microLayer");
let highlightLayer = $("highlightLayer");
const tooltip = $("mapTooltip");
const tableBody = $("priceTableBody");
const sourceMeta = $("sourceMeta");
const technicalStatus = $("technicalStatus");
const selectedDetails = $("countryDetails");

// The selected/hovered outline is drawn above countries, while the microstate
// dot layer is always re-appended last so dots never get covered by borders.
if (!highlightLayer && $("europeSvg")) {
  highlightLayer = document.createElementNS("http://www.w3.org/2000/svg", "g");
  highlightLayer.id = "highlightLayer";
  highlightLayer.setAttribute("aria-hidden", "true");
  $("europeSvg").appendChild(highlightLayer);
}
if ($("europeSvg") && highlightLayer && microLayer) {
  $("europeSvg").appendChild(highlightLayer);
  $("europeSvg").appendChild(microLayer);
}

// Keep the tooltip outside animated layout containers. This makes cursor tracking
// exact even when the map/header/sections use CSS animations.
if (tooltip && tooltip.parentElement !== document.body) {
  document.body.appendChild(tooltip);
}

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function byIso(iso) {
  return state.countries.find((country) => country.iso === iso);
}

function flagPrimary(country) {
  return `https://flagdownload.com/wp-content/uploads/Flag_of_${country.flagSlug}_Flat_Square-1024x1024.png`;
}

function flagFallback(country) {
  const iso = country.iso === "XK" ? "xk" : country.iso.toLowerCase();
  return `https://flagcdn.com/w80/${iso}.png`;
}

function inlineFlag(country) {
  const label = encodeURIComponent(country.iso);
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 56'%3E%3Crect width='80' height='56' fill='%23f2f2f2'/%3E%3Crect y='18' width='80' height='20' fill='%23080808' opacity='.14'/%3E%3Ctext x='40' y='36' text-anchor='middle' font-family='Arial' font-size='18' font-weight='700' fill='%23080808'%3E${label}%3C/text%3E%3C/svg%3E`;
}

function setFlag(img, country) {
  img.src = flagPrimary(country);
  img.onerror = () => {
    img.onerror = () => {
      img.onerror = null;
      img.src = inlineFlag(country);
    };
    img.src = flagFallback(country);
  };
}

function priceEur(country, fuel = state.fuel) {
  const value = Number(country.prices?.[fuel]);
  return Number.isFinite(value) ? value : null;
}

function converted(country, fuel = state.fuel) {
  const value = priceEur(country, fuel);
  if (value === null) return null;
  const rate = Number(state.rates[state.currency] ?? 1);
  return value * rate;
}

function formatMoney(value) {
  if (!Number.isFinite(value)) return "—";
  const digits = ZERO_DECIMAL.has(state.currency) ? 0 : 2;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: state.currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits
    }).format(value);
  } catch {
    return `${value.toFixed(digits)} ${state.currency}`;
  }
}

function perLitre(value) {
  return `${formatMoney(value)}/L`;
}

function priceRange() {
  const values = state.countries.map((country) => converted(country)).filter(Number.isFinite);
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

function colorFor(value, min, max) {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || min === max) return "#3a3a3a";
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const level = Math.round(44 + t * 92);
  return `rgb(${level} ${level} ${level})`;
}

function printMapColorFor(value, min, max) {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || min === max) return "#e6e6e6";
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const level = Math.round(235 - t * 120);
  return `rgb(${level} ${level} ${level})`;
}

function renderMap() {
  const mapData = window.EUROPE_MAP;
  const markerOnlyCountries = new Set(Object.keys(mapData.markers || {}));
  const { min, max } = priceRange();
  landLayer.innerHTML = "";
  countryLayer.innerHTML = "";
  microLayer.innerHTML = "";

  // Draw every country shape in the base land layer, including microstates like
  // Luxembourg. Marker countries are still shown as dots for interaction, but
  // their real shape stays underneath so the map silhouette remains consistent.
  mapData.countries.forEach((feature) => {
    const base = document.createElementNS("http://www.w3.org/2000/svg", "path");
    base.setAttribute("d", feature.d);
    base.classList.add("land-path");
    if (markerOnlyCountries.has(feature.iso)) base.classList.add("micro-land-path");
    landLayer.appendChild(base);
  });

  mapData.countries.filter((feature) => !markerOnlyCountries.has(feature.iso)).forEach((feature) => {
    const country = byIso(feature.iso);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", feature.d);
    path.dataset.iso = feature.iso;
    path.classList.add("country-path");
    path.setAttribute("aria-label", country ? country.name : feature.name);
    path.setAttribute("focusable", "false");
    path.setAttribute("tabindex", "-1");

    const value = country ? converted(country) : null;
    path.style.fill = colorFor(value, min, max);
    if (!country) path.style.fill = "#262626";

    bindRegionEvents(path, feature.iso);
    countryLayer.appendChild(path);
  });

  Object.entries(mapData.markers || {}).forEach(([iso, point]) => {
    const country = byIso(iso);
    if (!country) return;
    const [x, y] = point;
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.dataset.iso = iso;
    group.setAttribute("focusable", "false");
    group.setAttribute("tabindex", "-1");
    group.setAttribute("aria-label", country.name);

    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.classList.add("micro-dot");
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
    dot.setAttribute("r", 4.5);

    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.classList.add("micro-label");
    label.setAttribute("x", Number(x) + 8);
    label.setAttribute("y", Number(y) + 4);
    label.textContent = iso;

    group.append(dot, label);
    bindRegionEvents(group, iso);
    microLayer.appendChild(group);
  });

  // Defensively keep the dot layer as the final SVG layer after every render.
  if ($("europeSvg") && highlightLayer && microLayer) {
    $("europeSvg").appendChild(highlightLayer);
    $("europeSvg").appendChild(microLayer);
  }

  applySelectionClasses();
}

function bindRegionEvents(el, iso) {
  el.addEventListener("pointerdown", (event) => event.preventDefault());
  el.addEventListener("mousedown", (event) => event.preventDefault());
  el.addEventListener("mouseenter", (event) => showCountry(iso, event));
  el.addEventListener("mousemove", moveTooltip);
  el.addEventListener("mouseleave", hideTooltip);
  el.addEventListener("click", (event) => {
    state.selectedIso = iso;
    showCountry(iso, event, true);
    applySelectionClasses();
    highlightTableRow();
  });
}

function showCountry(iso, event, pinned = false) {
  const country = byIso(iso);
  if (!country) return;
  state.activeIso = iso;
  renderDetails(country, pinned);
  renderTooltip(country);
  if (event) moveTooltip(event);
  tooltip.classList.add("is-visible");
  applySelectionClasses();
}

function hideTooltip() {
  tooltip.classList.remove("is-visible");
  state.activeIso = null;
  applySelectionClasses();
  if (state.selectedIso) renderDetails(byIso(state.selectedIso), true);
}

function renderTooltip(country) {
  const img = document.createElement("img");
  setFlag(img, country);

  tooltip.innerHTML = `
    <div class="tooltip-head">
      <span class="tooltip-flag"></span>
      <div><strong>${country.name}</strong><br><small>${state.priceStatus === "live" ? "Fuelo live data" : "Demo fallback data"}</small></div>
    </div>
    <div class="tooltip-grid">
      <span>Gasoline 95</span><span>${perLitre(converted(country, "gasoline95"))}</span>
      <span>Diesel</span><span>${perLitre(converted(country, "diesel"))}</span>
      <span>LPG</span><span>${perLitre(converted(country, "lpg"))}</span>
    </div>`;
  tooltip.querySelector(".tooltip-flag").replaceWith(img);
}

function moveTooltip(event) {
  if (!event) return;

  // Use viewport coordinates only. Previous versions calculated position relative
  // to the animated map container, which made Chrome push the tooltip far to the
  // right after parent transform animations were added.
  const margin = 14;
  const offset = 18;
  const width = tooltip.offsetWidth || 252;
  const height = tooltip.offsetHeight || 150;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let x = event.clientX + offset;
  let y = event.clientY + offset;

  if (x + width + margin > viewportWidth) {
    x = event.clientX - width - offset;
  }

  if (y + height + margin > viewportHeight) {
    y = event.clientY - height - offset;
  }

  tooltip.style.left = `${Math.max(margin, Math.min(x, viewportWidth - width - margin))}px`;
  tooltip.style.top = `${Math.max(margin, Math.min(y, viewportHeight - height - margin))}px`;
}

function renderDetails(country, pinned = false) {
  if (!country) return;
  const img = document.createElement("img");
  setFlag(img, country);
  selectedDetails.classList.remove("empty");
  selectedDetails.innerHTML = `
    <div class="country-title">
      <span class="country-flag"></span>
      <div><strong>${country.name}</strong><span>${country.iso} · ${pinned ? "Pinned" : "Hover"}</span></div>
    </div>
    <div class="price-list">
      ${Object.entries(FUEL_LABELS).map(([key, label]) => `
        <div class="price-row">
          <span>${label}</span>
          <strong>${perLitre(converted(country, key))}</strong>
        </div>
      `).join("")}
    </div>
    <p class="details-note">Prices are per litre. Currency conversion is calculated from EUR values.</p>`;
  selectedDetails.querySelector(".country-flag").replaceWith(img);
}

function applySelectionClasses() {
  const active = state.activeIso || state.selectedIso;
  document.querySelectorAll(".country-path, #microLayer g").forEach((el) => {
    const selected = el.dataset.iso === active;
    el.classList.toggle("is-selected", selected);
    el.classList.toggle("is-dimmed", Boolean(active) && !selected);
  });
  document.querySelectorAll(".micro-dot").forEach((dot) => {
    const selected = dot.parentElement?.dataset.iso === active;
    dot.classList.toggle("is-selected", selected);
  });
  renderMapHighlight(active);
}

function renderMapHighlight(activeIso) {
  if (!highlightLayer) return;
  highlightLayer.innerHTML = "";
  if (!activeIso) return;

  const mapData = window.EUROPE_MAP;
  const marker = mapData.markers?.[activeIso];

  if (marker) {
    const [x, y] = marker;
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.classList.add("highlight-dot-ring");
    ring.setAttribute("cx", x);
    ring.setAttribute("cy", y);
    ring.setAttribute("r", 8.5);
    highlightLayer.appendChild(ring);
    return;
  }

  const feature = mapData.countries.find((item) => item.iso === activeIso);
  if (!feature) return;

  const outline = document.createElementNS("http://www.w3.org/2000/svg", "path");
  outline.classList.add("highlight-path");
  outline.setAttribute("d", feature.d);
  highlightLayer.appendChild(outline);
}

function renderStats() {
  const values = state.countries
    .map((country) => ({ country, value: converted(country) }))
    .filter((item) => Number.isFinite(item.value));
  if (!values.length) return;
  values.sort((a, b) => a.value - b.value);
  const lowest = values[0];
  const highest = values[values.length - 1];
  const avg = values.reduce((sum, item) => sum + item.value, 0) / values.length;
  $("lowestStat").textContent = perLitre(lowest.value);
  $("lowestCountry").textContent = lowest.country.name;
  $("averageStat").textContent = perLitre(avg);
  $("highestStat").textContent = perLitre(highest.value);
  $("highestCountry").textContent = highest.country.name;
}

function getRows() {
  const query = normalize(state.search);
  const rows = state.countries.filter((country) => !query || normalize(country.name).includes(query) || normalize(country.iso).includes(query));
  rows.sort((a, b) => {
    let av;
    let bv;
    if (state.sortKey === "name") {
      av = a.name;
      bv = b.name;
      return state.sortDirection === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    av = converted(a, state.sortKey);
    bv = converted(b, state.sortKey);
    const result = (av ?? Infinity) - (bv ?? Infinity);
    return state.sortDirection === "asc" ? result : -result;
  });
  return rows;
}

function updateSortHeaders() {
  document.querySelectorAll("th[data-sort]").forEach((th) => {
    const isActive = th.dataset.sort === state.sortKey;
    th.classList.toggle("is-sort-active", isActive);
    th.classList.toggle("is-sort-asc", isActive && state.sortDirection === "asc");
    th.classList.toggle("is-sort-desc", isActive && state.sortDirection === "desc");
    th.setAttribute("aria-sort", isActive ? (state.sortDirection === "asc" ? "ascending" : "descending") : "none");
    th.setAttribute("title", isActive
      ? `Sorted ${state.sortDirection === "asc" ? "ascending" : "descending"}. Click to reverse.`
      : "Click to sort");
  });
}

function renderTable() {
  updateSortHeaders();
  const rows = getRows();
  tableBody.innerHTML = "";
  if (!rows.length) {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td colspan="4" class="no-results">No countries found.</td>`;
    tableBody.appendChild(tr);
    return;
  }

  rows.forEach((country) => {
    const tr = document.createElement("tr");
    tr.dataset.iso = country.iso;
    tr.classList.toggle("is-selected", country.iso === state.selectedIso);
    const img = document.createElement("img");
    setFlag(img, country);

    tr.innerHTML = `
      <td><div class="country-cell"><span class="flag-slot"></span><div>${country.name}<span>${country.iso}</span></div></div></td>
      <td class="price-cell ${state.fuel === "gasoline95" ? "active-price" : ""}">${perLitre(converted(country, "gasoline95"))}</td>
      <td class="price-cell ${state.fuel === "diesel" ? "active-price" : ""}">${perLitre(converted(country, "diesel"))}</td>
      <td class="price-cell ${state.fuel === "lpg" ? "active-price" : ""}">${perLitre(converted(country, "lpg"))}</td>`;
    tr.querySelector(".flag-slot").replaceWith(img);
    tr.addEventListener("mouseenter", (event) => showCountry(country.iso, event));
    tr.addEventListener("mouseleave", hideTooltip);
    tr.addEventListener("click", () => {
      state.selectedIso = country.iso;
      renderDetails(country, true);
      applySelectionClasses();
      highlightTableRow();
    });
    tableBody.appendChild(tr);
  });
}

function highlightTableRow() {
  document.querySelectorAll("tbody tr").forEach((row) => {
    row.classList.toggle("is-selected", row.dataset.iso === state.selectedIso);
  });
}

function renderStatus() {
  const priceText = state.priceStatus === "live" ? "Live price feed" : "Backup dataset";
  const rateText = state.rateStatus === "live" ? "Live FX" : "Backup FX";
  const date = state.lastUpdated ? new Date(state.lastUpdated).toLocaleString() : "not available";
  sourceMeta.innerHTML = `<strong>${priceText}</strong><br>${state.countries.length} countries · ${state.currency} · ${rateText}<br>Updated: ${date}`;
  if (technicalStatus) {
    technicalStatus.textContent = `${priceText} · ${rateText} · ${FUEL_LABELS[state.fuel]} · Updated ${date}`;
  }
}

function renderAll() {
  renderMap();
  renderStats();
  renderTable();
  renderStatus();
  if (state.selectedIso) renderDetails(byIso(state.selectedIso), true);
}

function mergeLivePrices(items = []) {
  if (!Array.isArray(items) || !items.length) return;
  const countryByName = new Map();
  state.countries.forEach((country) => {
    [country.name, ...(country.aliases || [])].forEach((name) => countryByName.set(normalize(name), country));
  });

  let merged = 0;
  items.forEach((item) => {
    const candidates = [item.name, item.country, item.iso, ...(item.aliases || [])].filter(Boolean).map(normalize);
    let country = null;
    for (const candidate of candidates) {
      country = countryByName.get(candidate) || state.countries.find((entry) => entry.iso.toLowerCase() === candidate);
      if (country) break;
    }
    if (!country || !item.prices) return;
    ["gasoline95", "diesel", "lpg"].forEach((key) => {
      const value = Number(item.prices[key]);
      if (Number.isFinite(value) && value > 0 && value < 5) country.prices[key] = value;
    });
    merged += 1;
  });
  if (merged >= 15) state.priceStatus = "live";
}

async function loadFuelPrices() {
  state.priceStatus = "fallback";
  try {
    const response = await fetch(`/api/fuelo?ts=${Date.now()}`, { cache: "no-store" });
    const payload = await response.json();
    if (payload?.items?.length) mergeLivePrices(payload.items);
    state.lastUpdated = payload?.updatedAt || new Date().toISOString();
    state.sourceUrl = payload?.sourceUrl || "https://fuelo.eu/";
    if (payload?.status === "live") state.priceStatus = "live";
  } catch (error) {
    state.lastUpdated = new Date().toISOString();
    console.warn("Fuel price fetch failed:", error);
  }
}

async function loadRates() {
  state.rateStatus = "fallback";
  try {
    const response = await fetch(`/api/rates?ts=${Date.now()}`, { cache: "no-store" });
    const payload = await response.json();
    if (payload?.rates) {
      state.rates = { ...FALLBACK_RATES, ...payload.rates, EUR: 1 };
      if (payload.status === "live") state.rateStatus = "live";
    }
  } catch (error) {
    console.warn("Exchange-rate fetch failed:", error);
  }
}


function getReportRows() {
  const rows = [...state.countries];
  rows.sort((a, b) => {
    if (state.sortKey === "name") {
      return state.sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    }
    const av = converted(a, state.sortKey);
    const bv = converted(b, state.sortKey);
    const result = (av ?? Infinity) - (bv ?? Infinity);
    return state.sortDirection === "asc" ? result : -result;
  });
  return rows;
}

function getReportSortDescription() {
  const label = state.sortKey === "name" ? "Country" : FUEL_LABELS[state.sortKey] || state.sortKey;
  if (state.sortKey === "name") {
    return `${label}, ${state.sortDirection === "asc" ? "A-Z" : "Z-A"}`;
  }
  return `${label}, ${state.sortDirection === "asc" ? "lowest first" : "highest first"}`;
}

function formatReportDate(value) {
  if (!value) return "Not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildPdfReportHtml() {
  const generatedAt = new Date();
  const infoDate = state.lastUpdated || generatedAt.toISOString();
  const priceText = state.priceStatus === "live" ? "Fuelo live" : "Backup sample";
  const rateText = state.rateStatus === "live" ? "live FX" : "backup FX";
  const host = window.location?.host || "fuelio";
  const rows = getReportRows().map((country, index) => `
    <tr>
      <td><span class="rank">${index + 1}</span>${escapeHtml(country.name)}</td>
      <td>${escapeHtml(country.iso)}</td>
      <td>${escapeHtml(perLitre(converted(country, "gasoline95")))}</td>
      <td>${escapeHtml(perLitre(converted(country, "diesel")))}</td>
      <td>${escapeHtml(perLitre(converted(country, "lpg")))}</td>
    </tr>`).join("");

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Fuelio fuel price report</title>
  <style>
    @page { size: A4 portrait; margin: 12mm 13mm; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      background: #ffffff !important;
      color: #111111 !important;
      font-family: "Times New Roman", Times, serif !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body { width: 100%; }
    .report { width: 100%; background: #ffffff !important; }
    .top {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16mm;
      padding-bottom: 6mm;
      border-bottom: 0.25mm solid #111111;
    }
    h1 {
      margin: 0;
      font-size: 23pt;
      line-height: 0.9;
      letter-spacing: -0.035em;
      font-weight: 700;
    }
    .subtitle {
      margin: 2.5mm 0 0;
      font-size: 8.5pt;
      line-height: 1.2;
      color: #555555 !important;
      font-weight: 400;
    }
    .prepared { text-align: right; min-width: 45mm; }
    .label {
      display: block;
      margin-bottom: 1.2mm;
      font-size: 5.8pt;
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #777777 !important;
      font-weight: 700;
    }
    .value {
      display: block;
      font-size: 8.2pt;
      line-height: 1.15;
      color: #111111 !important;
      font-weight: 400;
    }
    .meta {
      display: grid;
      grid-template-columns: 1.1fr 0.55fr 1.05fr 0.9fr;
      gap: 8mm;
      margin: 6mm 0 5.5mm;
      padding-bottom: 5.5mm;
      border-bottom: 0.15mm solid #d8d8d8;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 6.85pt;
      line-height: 1.06;
      background: #ffffff !important;
    }
    thead { display: table-header-group; }
    th {
      padding: 0 0 1.7mm;
      border: 0;
      border-bottom: 0.25mm solid #111111;
      text-align: left;
      font-size: 6pt;
      line-height: 1;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      font-weight: 700;
      color: #111111 !important;
      white-space: nowrap;
    }
    td {
      padding: 0.55mm 0;
      border: 0;
      border-bottom: 0.12mm solid #dddddd;
      color: #111111 !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
    th:nth-child(1), td:nth-child(1) { width: 42%; text-align: left; }
    th:nth-child(2), td:nth-child(2) { width: 9%; text-align: center; color: #555555 !important; }
    th:nth-child(n+3), td:nth-child(n+3) { width: 16.33%; text-align: right; }
    .rank {
      display: inline-block;
      width: 7mm;
      color: #888888 !important;
      font-variant-numeric: tabular-nums;
    }
    .footer {
      margin-top: 4.5mm;
      padding-top: 3mm;
      border-top: 0.15mm solid #d8d8d8;
      display: flex;
      justify-content: space-between;
      gap: 8mm;
      font-size: 6.6pt;
      line-height: 1.25;
      color: #666666 !important;
    }
    @media screen {
      body { padding: 12mm 13mm; }
    }
  </style>
</head>
<body>
  <main class="report">
    <header class="top">
      <div>
        <h1>Fuelio</h1>
        <p class="subtitle">European fuel price report</p>
      </div>
      <div class="prepared">
        <span class="label">Prepared</span>
        <span class="value">${escapeHtml(formatReportDate(generatedAt.toISOString()))}</span>
      </div>
    </header>

    <section class="meta">
      <div><span class="label">Information date</span><span class="value">${escapeHtml(formatReportDate(infoDate))}</span></div>
      <div><span class="label">Currency</span><span class="value">${escapeHtml(state.currency)}</span></div>
      <div><span class="label">Sort order</span><span class="value">${escapeHtml(getReportSortDescription())}</span></div>
      <div><span class="label">Data</span><span class="value">${escapeHtml(`${priceText} / ${rateText}`)}</span></div>
    </section>

    <table aria-label="Fuelio fuel price report table">
      <thead>
        <tr>
          <th>Country</th>
          <th>ISO</th>
          <th>Gasoline 95</th>
          <th>Diesel</th>
          <th>LPG</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>

    <footer class="footer">
      <span>Generated by Fuelio${host ? ` · ${escapeHtml(host)}` : ""}</span>
      <span>Prices are indicative and may vary locally.</span>
    </footer>
  </main>
</body>
</html>`;
}

function preparePdfReport() {
  const report = $("pdfReport");
  if (!report) return;

  const generatedAt = new Date();
  const infoDate = state.lastUpdated || generatedAt.toISOString();
  const priceText = state.priceStatus === "live" ? "Fuelo live" : "Backup sample";
  const rateText = state.rateStatus === "live" ? "live FX" : "backup FX";

  const preparedDate = $("pdfPreparedDate");
  const infoDateEl = $("pdfInfoDate");
  const currency = $("pdfCurrency");
  const sortOrder = $("pdfSortOrder");
  const status = $("pdfDataStatus");
  const website = $("pdfWebsite");

  if (preparedDate) preparedDate.textContent = formatReportDate(generatedAt.toISOString());
  if (infoDateEl) infoDateEl.textContent = formatReportDate(infoDate);
  if (currency) currency.textContent = state.currency;
  if (sortOrder) sortOrder.textContent = getReportSortDescription();
  if (status) status.textContent = `${priceText} / ${rateText}`;
  if (website) {
    const host = window.location?.host ? ` - ${window.location.host}` : "";
    website.textContent = host;
  }

  const tbody = $("pdfTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  getReportRows().forEach((country, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><span class="pdf-row-number">${index + 1}</span>${country.name}</td>
      <td>${country.iso}</td>
      <td>${perLitre(converted(country, "gasoline95"))}</td>
      <td>${perLitre(converted(country, "diesel"))}</td>
      <td>${perLitre(converted(country, "lpg"))}</td>`;
    tbody.appendChild(tr);
  });
}

function exportPdfReport() {
  const html = buildPdfReportHtml();
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";

  document.body.appendChild(iframe);
  const printWindow = iframe.contentWindow;
  const printDocument = iframe.contentDocument || printWindow.document;

  printDocument.open();
  printDocument.write(html);
  printDocument.close();

  const cleanup = () => {
    setTimeout(() => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, 250);
  };

  if (printWindow) {
    printWindow.addEventListener("afterprint", cleanup, { once: true });
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      setTimeout(cleanup, 1500);
    }, 120);
  } else {
    cleanup();
  }
}

window.addEventListener("beforeprint", preparePdfReport);
window.addEventListener("afterprint", () => {
  document.body.classList.remove("is-exporting-pdf");
  document.title = previousDocumentTitle || "Fuelio — Europe fuel prices";
});

function setupControls() {
  document.querySelectorAll("[data-fuel]").forEach((button) => {
    button.addEventListener("click", () => {
      state.fuel = button.dataset.fuel;
      state.sortKey = button.dataset.fuel;
      document.querySelectorAll("[data-fuel]").forEach((item) => {
        item.classList.toggle("is-active", item === button);
        item.setAttribute("aria-selected", item === button ? "true" : "false");
      });
      renderAll();
    });
  });

  $("currencySelect").addEventListener("change", (event) => {
    state.currency = event.target.value;
    renderAll();
  });

  $("searchInput").addEventListener("input", (event) => {
    state.search = event.target.value;
    renderTable();
  });

  $("refreshBtn").addEventListener("click", async () => {
    const btn = $("refreshBtn");
    btn.classList.add("is-loading");
    btn.textContent = "Refreshing";
    document.body.classList.add("is-fetching");
    sourceMeta.textContent = "Refreshing live data…";
    await Promise.all([loadFuelPrices(), loadRates()]);
    renderAll();
    document.body.classList.remove("is-fetching");
    btn.classList.remove("is-loading");
    btn.textContent = "Refresh";
  });

  const exportBtn = $("exportPdfBtn");
  if (exportBtn) {
    exportBtn.addEventListener("click", exportPdfReport);
  }

  document.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const key = th.dataset.sort;
      if (state.sortKey === key) state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      else {
        state.sortKey = key;
        state.sortDirection = key === "name" ? "asc" : "asc";
      }
      renderTable();
    });
  });
}

async function init() {
  const year = $("currentYear");
  if (year) year.textContent = new Date().getFullYear();
  setupControls();
  renderAll();
  requestAnimationFrame(() => {
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
  });
  document.body.classList.add("is-fetching");
  await Promise.all([loadFuelPrices(), loadRates()]);
  renderAll();
  document.body.classList.remove("is-fetching");
}

init();
