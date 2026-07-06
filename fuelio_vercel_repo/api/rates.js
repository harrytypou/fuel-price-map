const FALLBACK_RATES = {
  EUR: 1, USD: 1.08, GBP: 0.84, CHF: 0.94, NOK: 11.8, SEK: 11.1, DKK: 7.46,
  PLN: 4.25, CZK: 24.7, HUF: 390, RON: 4.98, BGN: 1.9558, TRY: 39, RSD: 117, ISK: 150
};

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  const symbols = Object.keys(FALLBACK_RATES).filter((code) => code !== 'EUR').join(',');
  const url = `https://api.frankfurter.app/latest?from=EUR&to=${symbols}`;

  try {
    const upstream = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    if (!upstream.ok) throw new Error(`Frankfurter ${upstream.status}`);
    const json = await upstream.json();
    response.status(200).json({
      status: 'live',
      base: 'EUR',
      date: json.date,
      rates: { EUR: 1, ...json.rates }
    });
  } catch (error) {
    response.status(200).json({
      status: 'fallback',
      base: 'EUR',
      error: error.message,
      rates: FALLBACK_RATES
    });
  }
}
