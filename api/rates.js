const DEFAULT_QUOTES = [
  "USD", "GBP", "CHF", "NOK", "SEK", "DKK", "PLN", "CZK", "HUF", "RON", "BGN", "TRY", "RSD", "ISK"
];

const FALLBACK_RATES = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.84,
  CHF: 0.94,
  NOK: 11.8,
  SEK: 11.1,
  DKK: 7.46,
  PLN: 4.25,
  CZK: 24.7,
  HUF: 390,
  RON: 4.98,
  BGN: 1.9558,
  TRY: 39,
  RSD: 117,
  ISK: 150
};

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const queryQuotes = typeof req.query?.quotes === "string"
    ? req.query.quotes.split(",").map((item) => item.trim().toUpperCase()).filter(Boolean)
    : DEFAULT_QUOTES;
  const quotes = [...new Set(queryQuotes)].filter((code) => /^[A-Z]{3}$/.test(code) && code !== "EUR");
  const url = `https://api.frankfurter.dev/v2/rates?base=EUR&quotes=${encodeURIComponent(quotes.join(","))}`;

  try {
    const upstream = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "User-Agent": "EuroFuelAtlas/2.0 (+https://vercel.com/)"
      }
    });

    if (!upstream.ok) {
      throw new Error(`Frankfurter returned HTTP ${upstream.status}`);
    }

    const payload = await upstream.json();
    const rates = { EUR: 1, ...(payload.rates || {}) };

    return res.status(200).json({
      ok: true,
      source: "frankfurter",
      base: "EUR",
      date: payload.date || null,
      rates
    });
  } catch (error) {
    return res.status(200).json({
      ok: true,
      source: "fallback",
      base: "EUR",
      warning: error.message,
      rates: FALLBACK_RATES
    });
  }
};
