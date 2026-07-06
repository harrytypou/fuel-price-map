const COUNTRY_ALIASES = new Map(Object.entries({
  "albania": "Albania",
  "andorra": "Andorra",
  "austria": "Austria",
  "belarus": "Belarus",
  "belgium": "Belgium",
  "bosnia and herzegovina": "Bosnia and Herzegovina",
  "bosnia": "Bosnia and Herzegovina",
  "bulgaria": "Bulgaria",
  "croatia": "Croatia",
  "cyprus": "Cyprus",
  "czechia": "Czechia",
  "czech republic": "Czechia",
  "denmark": "Denmark",
  "estonia": "Estonia",
  "finland": "Finland",
  "france": "France",
  "germany": "Germany",
  "greece": "Greece",
  "hungary": "Hungary",
  "iceland": "Iceland",
  "ireland": "Ireland",
  "italy": "Italy",
  "kosovo": "Kosovo",
  "latvia": "Latvia",
  "liechtenstein": "Liechtenstein",
  "lithuania": "Lithuania",
  "luxembourg": "Luxembourg",
  "malta": "Malta",
  "moldova": "Moldova",
  "monaco": "Monaco",
  "montenegro": "Montenegro",
  "netherlands": "Netherlands",
  "north macedonia": "North Macedonia",
  "macedonia": "North Macedonia",
  "norway": "Norway",
  "poland": "Poland",
  "portugal": "Portugal",
  "romania": "Romania",
  "russia": "Russia",
  "san marino": "San Marino",
  "serbia": "Serbia",
  "slovakia": "Slovakia",
  "slovenia": "Slovenia",
  "spain": "Spain",
  "sweden": "Sweden",
  "switzerland": "Switzerland",
  "turkey": "Turkey",
  "turkiye": "Turkey",
  "ukraine": "Ukraine",
  "united kingdom": "United Kingdom",
  "great britain": "United Kingdom",
  "uk": "United Kingdom",
  "vatican city": "Vatican City"
}));

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/gi, " ")
    .trim()
    .toLowerCase();
}

function decodeEntities(text) {
  return String(text || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&euro;/gi, "€");
}

function stripHtml(html) {
  return decodeEntities(String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function parsePrice(text) {
  const match = String(text || "").match(/\b\d{1,2}(?:[,.]\d{2,4})\b/);
  if (!match) return null;
  const value = Number(match[0].replace(",", "."));
  if (!Number.isFinite(value) || value < 0.1 || value > 4.5) return null;
  return Math.round(value * 1000) / 1000;
}

function parsePricesFromText(text) {
  const matches = [...String(text || "").matchAll(/\b\d{1,2}(?:[,.]\d{2,4})\b/g)]
    .map((match) => Number(match[0].replace(",", ".")))
    .filter((value) => Number.isFinite(value) && value > 0.1 && value < 4.5);

  // Fuelo rows may include daily/weekly deltas after the three fuel prices.
  // The first three valid litre-sized values are gasoline 95, diesel, and LPG.
  return matches.slice(0, 3).map((value) => Math.round(value * 1000) / 1000);
}

function detectCountry(text) {
  const normal = normalize(text);
  const aliases = [...COUNTRY_ALIASES.keys()].sort((a, b) => b.length - a.length);
  const exact = COUNTRY_ALIASES.get(normal);
  if (exact) return exact;
  for (const alias of aliases) {
    if (normal.startsWith(`${alias} `) || normal.includes(` ${alias} `) || normal.endsWith(` ${alias}`)) {
      return COUNTRY_ALIASES.get(alias);
    }
  }
  return null;
}

function parseTableRows(html) {
  const rows = [];
  const rowRegex = /<tr\b[^>]*>([\s\S]*?)<\/tr>/gi;
  let rowMatch;
  while ((rowMatch = rowRegex.exec(html))) {
    const rowHtml = rowMatch[1];
    const cells = [];
    const cellRegex = /<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowHtml))) {
      cells.push(stripHtml(cellMatch[1]));
    }

    if (cells.length < 2) continue;
    const rowText = cells.join(" ");
    const country = detectCountry(cells[0]) || detectCountry(rowText);
    if (!country) continue;

    const candidateCells = cells.slice(1);
    const cellPrices = candidateCells.map(parsePrice).filter((value) => value !== null);
    const prices = cellPrices.length >= 3 ? cellPrices.slice(0, 3) : parsePricesFromText(rowText);
    if (prices.length < 2) continue;

    rows.push({
      name: country,
      gasoline95: prices[0] ?? null,
      diesel: prices[1] ?? null,
      lpg: prices[2] ?? null
    });
  }
  return rows;
}

function parseLooseText(html) {
  const text = stripHtml(html);
  const countries = [...new Set(COUNTRY_ALIASES.values())];
  const rows = [];

  for (const country of countries) {
    const aliases = [...COUNTRY_ALIASES.entries()]
      .filter(([, canonical]) => canonical === country)
      .map(([alias]) => alias);

    const countryPattern = aliases
      .sort((a, b) => b.length - a.length)
      .map((alias) => alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    const regex = new RegExp(`(?:${countryPattern})\\s+(.{0,120})`, "i");
    const match = normalize(text).match(regex);
    if (!match) continue;

    const prices = parsePricesFromText(match[1]);
    if (prices.length >= 2) {
      rows.push({
        name: country,
        gasoline95: prices[0] ?? null,
        diesel: prices[1] ?? null,
        lpg: prices[2] ?? null
      });
    }
  }

  return rows;
}

function dedupeRows(rows) {
  const map = new Map();
  for (const row of rows) {
    const previous = map.get(row.name);
    if (!previous || Object.values(row).filter((value) => typeof value === "number").length > Object.values(previous).filter((value) => typeof value === "number").length) {
      map.set(row.name, row);
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function parseFuelo(html) {
  const tableRows = parseTableRows(html);
  const looseRows = tableRows.length >= 10 ? [] : parseLooseText(html);
  return dedupeRows([...tableRows, ...looseRows]);
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const upstreamUrl = "https://fuelo.eu/?convertto=eur";

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        "User-Agent": "Mozilla/5.0 (compatible; EuroFuelAtlas/2.0; +https://vercel.com/)"
      }
    });

    if (!upstream.ok) {
      throw new Error(`Fuelo returned HTTP ${upstream.status}`);
    }

    const html = await upstream.text();
    const countries = parseFuelo(html);

    if (countries.length < 5) {
      throw new Error("Could not parse enough country rows from Fuelo. Their HTML may have changed.");
    }

    return res.status(200).json({
      ok: true,
      source: "fuelo.eu",
      currency: "EUR",
      fetchedAt: new Date().toISOString(),
      countryCount: countries.length,
      countries
    });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      source: "fuelo.eu",
      error: error.message,
      hint: "Fuelo may be temporarily blocking the serverless function or may have changed its table markup. The frontend will continue with fallback values."
    });
  }
};
