const COUNTRY_DATA = [
  { name: "Albania", iso: "AL", flagSlug: "Albania", lat: 41.15, lon: 20.17, prices: { gasoline95: 1.74, diesel: 1.71, lpg: 0.74 } },
  { name: "Andorra", iso: "AD", flagSlug: "Andorra", lat: 42.55, lon: 1.60, prices: { gasoline95: 1.43, diesel: 1.35, lpg: 0.79 } },
  { name: "Austria", iso: "AT", flagSlug: "Austria", lat: 47.52, lon: 14.55, prices: { gasoline95: 1.56, diesel: 1.55, lpg: 0.98 } },
  { name: "Belarus", iso: "BY", flagSlug: "Belarus", lat: 53.71, lon: 27.95, prices: { gasoline95: 0.82, diesel: 0.82, lpg: 0.43 } },
  { name: "Belgium", iso: "BE", flagSlug: "Belgium", lat: 50.85, lon: 4.55, prices: { gasoline95: 1.73, diesel: 1.78, lpg: 0.70 } },
  { name: "Bosnia and Herzegovina", iso: "BA", flagSlug: "Bosnia_and_Herzegovina", lat: 44.16, lon: 17.79, prices: { gasoline95: 1.41, diesel: 1.42, lpg: 0.75 } },
  { name: "Bulgaria", iso: "BG", flagSlug: "Bulgaria", lat: 42.73, lon: 25.49, prices: { gasoline95: 1.32, diesel: 1.34, lpg: 0.67 } },
  { name: "Croatia", iso: "HR", flagSlug: "Croatia", lat: 45.10, lon: 15.20, prices: { gasoline95: 1.49, diesel: 1.40, lpg: 0.78 } },
  { name: "Cyprus", iso: "CY", flagSlug: "Cyprus", lat: 35.10, lon: 33.33, prices: { gasoline95: 1.43, diesel: 1.52, lpg: 0.96 } },
  { name: "Czechia", iso: "CZ", flagSlug: "Czech_Republic", lat: 49.82, lon: 15.47, prices: { gasoline95: 1.49, diesel: 1.45, lpg: 0.67 } },
  { name: "Denmark", iso: "DK", flagSlug: "Denmark", lat: 56.20, lon: 10.00, prices: { gasoline95: 1.96, diesel: 1.74, lpg: 1.15 } },
  { name: "Estonia", iso: "EE", flagSlug: "Estonia", lat: 58.60, lon: 25.01, prices: { gasoline95: 1.69, diesel: 1.55, lpg: 0.75 } },
  { name: "Finland", iso: "FI", flagSlug: "Finland", lat: 61.92, lon: 25.75, prices: { gasoline95: 1.90, diesel: 1.72, lpg: 1.04 } },
  { name: "France", iso: "FR", flagSlug: "France", lat: 46.23, lon: 2.21, prices: { gasoline95: 1.78, diesel: 1.69, lpg: 0.99 } },
  { name: "Germany", iso: "DE", flagSlug: "Germany", lat: 51.16, lon: 10.45, prices: { gasoline95: 1.74, diesel: 1.63, lpg: 1.06 } },
  { name: "Greece", iso: "GR", flagSlug: "Greece", lat: 39.07, lon: 21.82, prices: { gasoline95: 1.82, diesel: 1.58, lpg: 0.89 } },
  { name: "Hungary", iso: "HU", flagSlug: "Hungary", lat: 47.16, lon: 19.50, prices: { gasoline95: 1.51, diesel: 1.52, lpg: 0.86 } },
  { name: "Iceland", iso: "IS", flagSlug: "Iceland", lat: 64.96, lon: -19.02, prices: { gasoline95: 2.10, diesel: 2.08, lpg: 1.35 } },
  { name: "Ireland", iso: "IE", flagSlug: "Ireland", lat: 53.41, lon: -8.24, prices: { gasoline95: 1.78, diesel: 1.72, lpg: 1.03 } },
  { name: "Italy", iso: "IT", flagSlug: "Italy", lat: 42.90, lon: 12.57, prices: { gasoline95: 1.83, diesel: 1.72, lpg: 0.74 } },
  { name: "Kosovo", iso: "XK", flagSlug: "Kosovo", lat: 42.60, lon: 20.90, prices: { gasoline95: 1.39, diesel: 1.38, lpg: 0.70 } },
  { name: "Latvia", iso: "LV", flagSlug: "Latvia", lat: 56.88, lon: 24.60, prices: { gasoline95: 1.63, diesel: 1.55, lpg: 0.76 } },
  { name: "Liechtenstein", iso: "LI", flagSlug: "Liechtenstein", lat: 47.16, lon: 9.55, prices: { gasoline95: 1.84, diesel: 1.90, lpg: 1.05 } },
  { name: "Lithuania", iso: "LT", flagSlug: "Lithuania", lat: 55.17, lon: 23.88, prices: { gasoline95: 1.51, diesel: 1.48, lpg: 0.72 } },
  { name: "Luxembourg", iso: "LU", flagSlug: "Luxembourg", lat: 49.82, lon: 6.13, prices: { gasoline95: 1.47, diesel: 1.43, lpg: 0.76 } },
  { name: "Malta", iso: "MT", flagSlug: "Malta", lat: 35.94, lon: 14.38, prices: { gasoline95: 1.34, diesel: 1.21, lpg: 0.70 } },
  { name: "Moldova", iso: "MD", flagSlug: "Moldova", lat: 47.41, lon: 28.37, prices: { gasoline95: 1.31, diesel: 1.18, lpg: 0.68 } },
  { name: "Monaco", iso: "MC", flagSlug: "Monaco", lat: 43.74, lon: 7.42, prices: { gasoline95: 1.93, diesel: 1.86, lpg: 1.05 } },
  { name: "Montenegro", iso: "ME", flagSlug: "Montenegro", lat: 42.71, lon: 19.37, prices: { gasoline95: 1.52, diesel: 1.42, lpg: 0.79 } },
  { name: "Netherlands", iso: "NL", flagSlug: "Netherlands", lat: 52.13, lon: 5.29, prices: { gasoline95: 2.04, diesel: 1.81, lpg: 0.95 } },
  { name: "North Macedonia", iso: "MK", flagSlug: "North_Macedonia", lat: 41.61, lon: 21.74, prices: { gasoline95: 1.33, diesel: 1.25, lpg: 0.69 } },
  { name: "Norway", iso: "NO", flagSlug: "Norway", lat: 62.47, lon: 8.47, prices: { gasoline95: 1.95, diesel: 1.82, lpg: 1.21 } },
  { name: "Poland", iso: "PL", flagSlug: "Poland", lat: 51.92, lon: 19.15, prices: { gasoline95: 1.45, diesel: 1.48, lpg: 0.72 } },
  { name: "Portugal", iso: "PT", flagSlug: "Portugal", lat: 39.40, lon: -8.22, prices: { gasoline95: 1.74, diesel: 1.58, lpg: 0.88 } },
  { name: "Romania", iso: "RO", flagSlug: "Romania", lat: 45.94, lon: 24.97, prices: { gasoline95: 1.43, diesel: 1.46, lpg: 0.75 } },
  { name: "Russia", iso: "RU", flagSlug: "Russia", lat: 57.40, lon: 38.20, prices: { gasoline95: 0.62, diesel: 0.74, lpg: 0.34 } },
  { name: "San Marino", iso: "SM", flagSlug: "San_Marino", lat: 43.94, lon: 12.46, prices: { gasoline95: 1.77, diesel: 1.66, lpg: 0.82 } },
  { name: "Serbia", iso: "RS", flagSlug: "Serbia", lat: 44.02, lon: 20.91, prices: { gasoline95: 1.55, diesel: 1.64, lpg: 0.82 } },
  { name: "Slovakia", iso: "SK", flagSlug: "Slovakia", lat: 48.67, lon: 19.70, prices: { gasoline95: 1.55, diesel: 1.48, lpg: 0.77 } },
  { name: "Slovenia", iso: "SI", flagSlug: "Slovenia", lat: 46.15, lon: 14.99, prices: { gasoline95: 1.48, diesel: 1.50, lpg: 0.84 } },
  { name: "Spain", iso: "ES", flagSlug: "Spain", lat: 40.46, lon: -3.75, prices: { gasoline95: 1.55, diesel: 1.46, lpg: 0.92 } },
  { name: "Sweden", iso: "SE", flagSlug: "Sweden", lat: 60.13, lon: 18.64, prices: { gasoline95: 1.64, diesel: 1.75, lpg: 1.15 } },
  { name: "Switzerland", iso: "CH", flagSlug: "Switzerland", lat: 46.82, lon: 8.23, prices: { gasoline95: 1.84, diesel: 1.95, lpg: 1.12 } },
  { name: "Turkey", iso: "TR", flagSlug: "Turkey", lat: 39.00, lon: 35.24, prices: { gasoline95: 1.28, diesel: 1.24, lpg: 0.66 } },
  { name: "Ukraine", iso: "UA", flagSlug: "Ukraine", lat: 49.01, lon: 31.17, prices: { gasoline95: 1.31, diesel: 1.28, lpg: 0.71 } },
  { name: "United Kingdom", iso: "GB", flagSlug: "United_Kingdom", lat: 54.70, lon: -3.20, prices: { gasoline95: 1.70, diesel: 1.78, lpg: 1.02 } },
  { name: "Vatican City", iso: "VA", flagSlug: "Vatican_City", lat: 41.90, lon: 12.45, prices: { gasoline95: 1.84, diesel: 1.73, lpg: 0.76 } }
];

const FUEL_LABELS = {
  gasoline95: "Gasoline 95",
  diesel: "Diesel",
  lpg: "LPG"
};

const CURRENCY_SYMBOLS = {
  EUR: "€", USD: "$", GBP: "£", CHF: "CHF", NOK: "kr", SEK: "kr", DKK: "kr", PLN: "zł", CZK: "Kč", HUF: "Ft", RON: "lei", BGN: "лв", TRY: "₺", RSD: "дин", ISK: "kr"
};

const FALLBACK_RATES = {
  EUR: 1, USD: 1.08, GBP: 0.84, CHF: 0.94, NOK: 11.8, SEK: 11.1, DKK: 7.46, PLN: 4.25,
  CZK: 24.7, HUF: 390, RON: 4.98, BGN: 1.9558, TRY: 39, RSD: 117, ISK: 150
};

const state = {
  countries: COUNTRY_DATA.map((country) => ({ ...country, source: "fallback" })),
  fuel: "gasoline95",
  currency: "EUR",
  rates: { ...FALLBACK_RATES },
  ratesSource: "fallback",
  priceSource: "fallback",
  selectedId: null,
  sortKey: "gasoline95",
  sortDirection: "asc",
  search: ""
};

const $ = (id) => document.getElementById(id);
const markerLayer = $("markerLayer");
const tooltip = $("mapTooltip");
const mapWrap = document.querySelector(".europe-map-wrap");

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function idFor(name) {
  return normalize(name).replace(/\s+/g, "-");
}

function flagUrl(country) {
  return `https://flagdownload.com/wp-content/uploads/Flag_of_${country.flagSlug}_Flat_Square-1024x1024.png`;
}

function placeholderFlag(country) {
  const label = encodeURIComponent(country.iso || country.name.slice(0, 2).toUpperCase());
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'%3E%3Crect width='128' height='128' rx='26' fill='%231e293b'/%3E%3Ctext x='64' y='74' text-anchor='middle' font-family='Arial' font-size='34' font-weight='700' fill='%23e2e8f0'%3E${label}%3C/text%3E%3C/svg%3E`;
}

function createFlag(country, alt = "") {
  const img = document.createElement("img");
  img.src = flagUrl(country);
  img.alt = alt;
  img.loading = "lazy";
  img.decoding = "async";
  img.onerror = () => {
    img.onerror = null;
    img.src = placeholderFlag(country);
  };
  return img;
}

function project(lat, lon) {
  const lonMin = -25;
  const lonMax = 45;
  const latMin = 34;
  const latMax = 72;
  const x = ((lon - lonMin) / (lonMax - lonMin)) * 1000;
  const y = ((latMax - lat) / (latMax - latMin)) * 700;
  return { x, y };
}

function convertedPrice(country, fuel = state.fuel) {
  const eur = Number(country.prices?.[fuel]);
  if (!Number.isFinite(eur)) return null;
  const rate = Number(state.rates[state.currency] || 1);
  return eur * rate;
}

function formatPrice(value, currency = state.currency) {
  if (!Number.isFinite(value)) return "—";
  const zeroDecimal = new Set(["HUF", "ISK", "RSD"]);
  const digits = zeroDecimal.has(currency) ? 0 : 2;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: digits,
      minimumFractionDigits: digits
    }).format(value);
  } catch {
    return `${value.toFixed(digits)} ${CURRENCY_SYMBOLS[currency] || currency}`;
  }
}

function formatPerLitre(value, currency = state.currency) {
  return `${formatPrice(value, currency)}/L`;
}

function priceExtent(fuel = state.fuel) {
  const values = state.countries.map((country) => convertedPrice(country, fuel)).filter(Number.isFinite);
  return { min: Math.min(...values), max: Math.max(...values) };
}

function colorFor(value, min, max) {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max) || min === max) return "#38bdf8";
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const hue = 145 - t * 240;
  const sat = 74;
  const light = 55 + Math.sin(t * Math.PI) * 5;
  return `hsl(${hue} ${sat}% ${light}%)`;
}

function buildTooltipHtml(country) {
  return `
    <div class="tooltip-head">
      <img src="${flagUrl(country)}" alt="" onerror="this.onerror=null;this.src='${placeholderFlag(country)}'" />
      <div><strong>${country.name}</strong><br><small>${country.source === "live" ? "Fuelo live" : "Fallback data"}</small></div>
    </div>
    <div class="tooltip-grid">
      <span>Gasoline 95</span><span>${formatPerLitre(convertedPrice(country, "gasoline95"))}</span>
      <span>Diesel</span><span>${formatPerLitre(convertedPrice(country, "diesel"))}</span>
      <span>LPG</span><span>${formatPerLitre(convertedPrice(country, "lpg"))}</span>
    </div>
  `;
}

function showTooltip(event, country) {
  tooltip.innerHTML = buildTooltipHtml(country);
  const rect = mapWrap.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  x = Math.max(120, Math.min(rect.width - 120, x));
  y = Math.max(80, Math.min(rect.height - 24, y));
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
  tooltip.classList.add("is-visible");
}

function hideTooltip() {
  tooltip.classList.remove("is-visible");
}

function updateActiveNodes() {
  document.querySelectorAll(".country-node").forEach((node) => {
    node.classList.toggle("is-active", node.dataset.id === state.selectedId);
  });
  document.querySelectorAll(".country-row").forEach((row) => {
    row.classList.toggle("is-active", row.dataset.id === state.selectedId);
  });
}

function selectCountry(id) {
  state.selectedId = id;
  const country = state.countries.find((item) => idFor(item.name) === id);
  if (!country) return;
  renderFocus(country);
  updateActiveNodes();
}

function renderMap() {
  markerLayer.innerHTML = "";
  const { min, max } = priceExtent(state.fuel);

  state.countries.forEach((country) => {
    const { x, y } = project(country.lat, country.lon);
    const value = convertedPrice(country);
    const color = colorFor(value, min, max);
    const id = idFor(country.name);
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("class", "country-node");
    group.setAttribute("data-id", id);
    group.setAttribute("tabindex", "0");
    group.setAttribute("role", "button");
    group.setAttribute("aria-label", `${country.name}: ${FUEL_LABELS[state.fuel]} ${formatPerLitre(value)}`);
    group.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
    group.style.setProperty("--marker-color", color);

    group.innerHTML = `
      <circle class="country-ring" r="15"></circle>
      <circle class="country-dot" r="7.5"></circle>
      <circle class="country-hit" r="20"></circle>
      <text class="country-label" x="12" y="5">${country.iso}</text>
    `;

    group.addEventListener("pointermove", (event) => showTooltip(event, country));
    group.addEventListener("pointerenter", () => selectCountry(id));
    group.addEventListener("pointerleave", hideTooltip);
    group.addEventListener("focus", () => {
      selectCountry(id);
      const mapRect = mapWrap.getBoundingClientRect();
      tooltip.innerHTML = buildTooltipHtml(country);
      tooltip.style.left = `${(x / 1000) * mapRect.width}px`;
      tooltip.style.top = `${(y / 700) * mapRect.height}px`;
      tooltip.classList.add("is-visible");
    });
    group.addEventListener("blur", hideTooltip);
    group.addEventListener("click", () => selectCountry(id));

    markerLayer.appendChild(group);
  });
  updateActiveNodes();
}

function renderStats() {
  const loaded = state.countries.filter((country) => Number.isFinite(country.prices?.[state.fuel]));
  const ranked = [...loaded].sort((a, b) => convertedPrice(a) - convertedPrice(b));
  const values = ranked.map((country) => convertedPrice(country));
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const cheapest = ranked[0];
  const highest = ranked[ranked.length - 1];

  $("activeFuelLabel").textContent = FUEL_LABELS[state.fuel];
  $("avgPrice").textContent = formatPerLitre(avg);
  $("cheapestPrice").textContent = cheapest ? formatPerLitre(convertedPrice(cheapest)) : "—";
  $("cheapestCountry").textContent = cheapest?.name || "—";
  $("highestPrice").textContent = highest ? formatPerLitre(convertedPrice(highest)) : "—";
  $("highestCountry").textContent = highest?.name || "—";
  $("countryCount").textContent = String(loaded.length);

  const mini = $("miniRanking");
  mini.innerHTML = "";
  ranked.slice(0, 5).forEach((country, index) => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "rank-pill";
    pill.dataset.id = idFor(country.name);
    const img = createFlag(country, "");
    pill.appendChild(img);
    const label = document.createElement("span");
    label.textContent = `${index + 1}. ${country.name}`;
    const price = document.createElement("strong");
    price.textContent = formatPerLitre(convertedPrice(country));
    pill.append(label, price);
    pill.addEventListener("click", () => selectCountry(idFor(country.name)));
    mini.appendChild(pill);
  });
}

function renderFocus(country) {
  $("focusCountry").textContent = country.name;
  $("focusMeta").textContent = `${country.iso} · ${country.source === "live" ? "Fetched from Fuelo" : "Fallback value until Fuelo responds"}`;
  const flag = $("focusFlag");
  flag.src = flagUrl(country);
  flag.alt = `${country.name} flag`;
  flag.onerror = () => {
    flag.onerror = null;
    flag.src = placeholderFlag(country);
  };
  $("focusGasoline").textContent = formatPerLitre(convertedPrice(country, "gasoline95"));
  $("focusDiesel").textContent = formatPerLitre(convertedPrice(country, "diesel"));
  $("focusLpg").textContent = formatPerLitre(convertedPrice(country, "lpg"));
}

function getFilteredSortedCountries() {
  const query = normalize(state.search);
  const filtered = state.countries.filter((country) => normalize(country.name).includes(query) || country.iso.toLowerCase().includes(query));
  const direction = state.sortDirection === "asc" ? 1 : -1;
  return filtered.sort((a, b) => {
    if (state.sortKey === "name") return a.name.localeCompare(b.name) * direction;
    const av = Number(a.prices?.[state.sortKey] ?? Infinity);
    const bv = Number(b.prices?.[state.sortKey] ?? Infinity);
    return (av - bv) * direction;
  });
}

function renderTable() {
  const rows = $("countryRows");
  rows.innerHTML = "";
  getFilteredSortedCountries().forEach((country) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "country-row";
    row.dataset.id = idFor(country.name);

    const nameCell = document.createElement("div");
    nameCell.className = "country-name";
    nameCell.appendChild(createFlag(country, `${country.name} flag`));
    const text = document.createElement("div");
    text.innerHTML = `<strong>${country.name}</strong><small>${country.source === "live" ? "Live from Fuelo" : "Fallback"}</small>`;
    nameCell.appendChild(text);

    const gas = document.createElement("div");
    gas.className = `price-cell ${state.fuel === "gasoline95" ? "is-active" : ""}`;
    gas.textContent = formatPerLitre(convertedPrice(country, "gasoline95"));
    const diesel = document.createElement("div");
    diesel.className = `price-cell ${state.fuel === "diesel" ? "is-active" : ""}`;
    diesel.textContent = formatPerLitre(convertedPrice(country, "diesel"));
    const lpg = document.createElement("div");
    lpg.className = `price-cell ${state.fuel === "lpg" ? "is-active" : ""}`;
    lpg.textContent = formatPerLitre(convertedPrice(country, "lpg"));

    row.append(nameCell, gas, diesel, lpg);
    row.addEventListener("click", () => selectCountry(idFor(country.name)));
    row.addEventListener("mouseenter", () => selectCountry(idFor(country.name)));
    rows.appendChild(row);
  });
  updateActiveNodes();
}

function renderSourceStatus() {
  const liveCount = state.countries.filter((country) => country.source === "live").length;
  if (state.priceSource === "live") {
    $("heroStatus").textContent = `Live Fuelo prices loaded · ${liveCount} countries`;
    $("sourceStatus").textContent = "Live Fuelo data active";
    $("sourceDetail").textContent = `Prices are fetched in EUR from Fuelo through /api/fuelo. Currency conversion uses ${state.ratesSource === "live" ? "live" : "fallback"} exchange rates.`;
  } else {
    $("heroStatus").textContent = "Showing fallback values";
    $("sourceStatus").textContent = "Fallback mode";
    $("sourceDetail").textContent = "The page is working, but Fuelo could not be parsed or reached by the serverless function. The map remains visible with built-in fallback values.";
  }
}

function renderAll() {
  document.querySelectorAll("[data-fuel-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.fuelTab === state.fuel);
  });
  $("fuelSelect").value = state.fuel;
  $("currencySelect").value = state.currency;
  renderMap();
  renderStats();
  renderTable();
  renderSourceStatus();
  if (!state.selectedId) {
    const cheapest = [...state.countries].sort((a, b) => convertedPrice(a) - convertedPrice(b))[0];
    if (cheapest) state.selectedId = idFor(cheapest.name);
  }
  const selected = state.countries.find((country) => idFor(country.name) === state.selectedId) || state.countries[0];
  if (selected) renderFocus(selected);
  updateActiveNodes();
}

function mergeFueloData(payload) {
  const liveCountries = Array.isArray(payload?.countries) ? payload.countries : [];
  if (liveCountries.length < 5) throw new Error("Fuelo response contained too few countries");
  const liveByName = new Map();
  liveCountries.forEach((entry) => liveByName.set(normalize(entry.name), entry));

  state.countries = COUNTRY_DATA.map((country) => {
    const aliases = [country.name];
    if (country.name === "Czechia") aliases.push("Czech Republic");
    if (country.name === "United Kingdom") aliases.push("Great Britain", "UK");
    if (country.name === "North Macedonia") aliases.push("Macedonia");
    const live = aliases.map(normalize).map((key) => liveByName.get(key)).find(Boolean);
    if (!live) return { ...country, source: "fallback" };
    return {
      ...country,
      source: "live",
      prices: {
        gasoline95: Number.isFinite(Number(live.gasoline95)) ? Number(live.gasoline95) : country.prices.gasoline95,
        diesel: Number.isFinite(Number(live.diesel)) ? Number(live.diesel) : country.prices.diesel,
        lpg: Number.isFinite(Number(live.lpg)) ? Number(live.lpg) : country.prices.lpg
      }
    };
  });

  state.priceSource = state.countries.some((country) => country.source === "live") ? "live" : "fallback";
}

async function fetchFuelo() {
  const response = await fetch("/api/fuelo", { cache: "no-store" });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.ok) throw new Error(payload?.error || "Fuelo API failed");
  mergeFueloData(payload);
}

async function fetchRates() {
  const response = await fetch("/api/rates", { cache: "no-store" });
  const payload = await response.json().catch(() => null);
  if (!response.ok || !payload?.rates) throw new Error(payload?.error || "Rates API failed");
  state.rates = { ...FALLBACK_RATES, ...payload.rates, EUR: 1 };
  state.ratesSource = payload.source === "frankfurter" ? "live" : "fallback";
}

async function refreshData() {
  $("heroStatus").textContent = "Refreshing live data…";
  try {
    await Promise.allSettled([fetchRates(), fetchFuelo()]).then((results) => {
      const rejected = results.filter((result) => result.status === "rejected");
      rejected.forEach((result) => console.warn(result.reason));
    });
  } finally {
    renderAll();
  }
}

function attachEvents() {
  $("fuelSelect").addEventListener("change", (event) => {
    state.fuel = event.target.value;
    state.sortKey = state.fuel;
    renderAll();
  });
  $("currencySelect").addEventListener("change", (event) => {
    state.currency = event.target.value;
    renderAll();
  });
  $("countrySearch").addEventListener("input", (event) => {
    state.search = event.target.value;
    renderTable();
  });
  $("refreshBtn").addEventListener("click", refreshData);
  $("themeBtn").addEventListener("click", () => {
    const html = document.documentElement;
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    html.dataset.theme = next;
    $("themeBtn").textContent = next === "dark" ? "☾" : "☀";
  });
  document.querySelectorAll("[data-fuel-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.fuel = button.dataset.fuelTab;
      state.sortKey = state.fuel;
      renderAll();
    });
  });
  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.sort;
      if (state.sortKey === key) state.sortDirection = state.sortDirection === "asc" ? "desc" : "asc";
      else {
        state.sortKey = key;
        state.sortDirection = key === "name" ? "asc" : "asc";
      }
      renderTable();
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  state.countries = state.countries.map((country) => ({ ...country, id: idFor(country.name) }));
  attachEvents();
  renderAll();
  refreshData();
});
