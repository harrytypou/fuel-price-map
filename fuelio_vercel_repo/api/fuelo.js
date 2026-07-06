const FALLBACK = [
  ['Albania','AL',1.74,1.71,0.74], ['Andorra','AD',1.43,1.35,0.79], ['Armenia','AM',1.31,1.41,0.77],
  ['Austria','AT',1.61,1.64,1.02], ['Azerbaijan','AZ',0.97,0.65,0.44], ['Belarus','BY',0.81,0.81,0.43],
  ['Belgium','BE',1.70,1.74,0.70], ['Bosnia and Herzegovina','BA',1.41,1.42,0.75], ['Bulgaria','BG',1.32,1.34,0.67],
  ['Croatia','HR',1.49,1.40,0.78], ['Cyprus','CY',1.43,1.52,0.96], ['Czechia','CZ',1.49,1.45,0.67],
  ['Denmark','DK',1.90,1.70,1.15], ['Estonia','EE',1.69,1.55,0.75], ['Finland','FI',1.84,1.69,1.04],
  ['France','FR',1.72,1.63,0.99], ['Georgia','GE',1.16,1.21,0.72], ['Germany','DE',1.79,1.68,1.10],
  ['Greece','GR',1.83,1.58,0.89], ['Hungary','HU',1.51,1.52,0.86], ['Iceland','IS',2.05,2.02,1.35],
  ['Ireland','IE',1.72,1.66,1.03], ['Italy','IT',1.83,1.72,0.74], ['Kosovo','XK',1.39,1.38,0.70],
  ['Latvia','LV',1.63,1.55,0.76], ['Liechtenstein','LI',1.84,1.90,1.05], ['Lithuania','LT',1.51,1.48,0.72],
  ['Luxembourg','LU',1.47,1.43,0.76], ['Malta','MT',1.34,1.21,0.70], ['Moldova','MD',1.31,1.18,0.68],
  ['Monaco','MC',1.93,1.86,1.05], ['Montenegro','ME',1.52,1.42,0.79], ['Netherlands','NL',2.01,1.79,0.95],
  ['North Macedonia','MK',1.33,1.25,0.69], ['Norway','NO',1.95,1.82,1.21], ['Poland','PL',1.45,1.48,0.72],
  ['Portugal','PT',1.71,1.56,0.88], ['Romania','RO',1.43,1.46,0.75], ['Russia','RU',0.62,0.74,0.34],
  ['San Marino','SM',1.77,1.66,0.82], ['Serbia','RS',1.55,1.64,0.82], ['Slovakia','SK',1.55,1.48,0.77],
  ['Slovenia','SI',1.48,1.50,0.84], ['Spain','ES',1.55,1.46,0.92], ['Sweden','SE',1.64,1.75,1.15],
  ['Switzerland','CH',1.82,1.94,1.12], ['Turkey','TR',1.28,1.24,0.66], ['Ukraine','UA',1.31,1.28,0.71],
  ['United Kingdom','GB',1.70,1.78,1.02], ['Vatican City','VA',1.84,1.73,0.76]
].map(([name, iso, gasoline95, diesel, lpg]) => ({ name, iso, prices: { gasoline95, diesel, lpg } }));

const COUNTRIES = [
  'Albania','Andorra','Armenia','Austria','Azerbaijan','Belarus','Belgium','Bosnia and Herzegovina','Bulgaria','Croatia','Cyprus','Czechia','Czech Republic','Denmark','Estonia','Finland','France','Georgia','Germany','Greece','Hungary','Iceland','Ireland','Italy','Kosovo','Latvia','Liechtenstein','Lithuania','Luxembourg','Malta','Moldova','Monaco','Montenegro','Netherlands','North Macedonia','Macedonia','Norway','Poland','Portugal','Romania','Russia','San Marino','Serbia','Slovakia','Slovenia','Spain','Sweden','Switzerland','Turkey','Türkiye','Ukraine','United Kingdom','Great Britain','Vatican City','Vatican'
];

const ISO = {
  Albania:'AL', Andorra:'AD', Armenia:'AM', Austria:'AT', Azerbaijan:'AZ', Belarus:'BY', Belgium:'BE',
  'Bosnia and Herzegovina':'BA', Bulgaria:'BG', Croatia:'HR', Cyprus:'CY', Czechia:'CZ', 'Czech Republic':'CZ', Denmark:'DK', Estonia:'EE', Finland:'FI', France:'FR', Georgia:'GE', Germany:'DE', Greece:'GR', Hungary:'HU', Iceland:'IS', Ireland:'IE', Italy:'IT', Kosovo:'XK', Latvia:'LV', Liechtenstein:'LI', Lithuania:'LT', Luxembourg:'LU', Malta:'MT', Moldova:'MD', Monaco:'MC', Montenegro:'ME', Netherlands:'NL', 'North Macedonia':'MK', Macedonia:'MK', Norway:'NO', Poland:'PL', Portugal:'PT', Romania:'RO', Russia:'RU', 'San Marino':'SM', Serbia:'RS', Slovakia:'SK', Slovenia:'SI', Spain:'ES', Sweden:'SE', Switzerland:'CH', Turkey:'TR', Türkiye:'TR', Ukraine:'UA', 'United Kingdom':'GB', 'Great Britain':'GB', 'Vatican City':'VA', Vatican:'VA'
};

function decodeEntities(text) {
  return String(text || '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&euro;|&#8364;/g, '€')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/<br\s*\/?>/gi, ' ');
}

function cleanHtml(html) {
  return decodeEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ');
}

function numberFromToken(token) {
  const value = Number(String(token).replace(/[^0-9,.-]/g, '').replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}

function parseRows(html) {
  const cleaned = cleanHtml(html);
  const rowMatches = cleaned.match(/<tr[\s\S]*?<\/tr>/gi) || [];
  const out = [];

  for (const rowHtml of rowMatches) {
    const text = rowHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!text || /Gasoline|Diesel|LPG|Price/i.test(text) && !COUNTRIES.some((c) => text.includes(c))) continue;

    const country = COUNTRIES.find((name) => new RegExp(`(^|\\s)${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(\\s|$)`, 'i').test(text));
    if (!country) continue;

    let money = [];
    const eurAfter = [...text.matchAll(/€\s*([0-9]+(?:[,.][0-9]{1,3})?)/g)].map((m) => m[1]);
    const eurBefore = [...text.matchAll(/([0-9]+(?:[,.][0-9]{1,3})?)\s*€/g)].map((m) => m[1]);
    money = [...eurAfter, ...eurBefore].map(numberFromToken).filter((n) => Number.isFinite(n) && n > 0 && n < 5);

    if (money.length < 2) {
      const tokens = [...text.matchAll(/(?<![+\-])\b[0-9]+[,.][0-9]{2,3}\b/g)]
        .map((m) => numberFromToken(m[0]))
        .filter((n) => Number.isFinite(n) && n > 0 && n < 5);
      money = tokens;
    }

    // Fuelo Europe rows usually contain price + change columns for each fuel.
    // The actual prices are the first, fifth and ninth numeric tokens when change columns are present.
    let gasoline95 = money[0];
    let diesel = money.length >= 9 ? money[4] : money[1];
    let lpg = money.length >= 9 ? money[8] : money[2];

    if (Number.isFinite(gasoline95) && Number.isFinite(diesel)) {
      out.push({ name: country, iso: ISO[country] || '', prices: { gasoline95, diesel, lpg: Number.isFinite(lpg) ? lpg : null } });
    }
  }

  const deduped = new Map();
  out.forEach((item) => {
    const iso = item.iso || item.name;
    if (!deduped.has(iso)) deduped.set(iso, item);
  });
  return [...deduped.values()];
}

function parseLoose(html) {
  const text = cleanHtml(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  const out = [];
  for (const country of COUNTRIES) {
    const idx = text.search(new RegExp(`\\b${country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'));
    if (idx < 0) continue;
    const slice = text.slice(idx, idx + 260);
    const values = [...slice.matchAll(/€\s*([0-9]+(?:[,.][0-9]{1,3})?)|([0-9]+(?:[,.][0-9]{1,3})?)\s*€/g)]
      .map((m) => numberFromToken(m[1] || m[2]))
      .filter((n) => Number.isFinite(n) && n > 0 && n < 5);
    if (values.length >= 2) {
      out.push({ name: country, iso: ISO[country] || '', prices: { gasoline95: values[0], diesel: values[1], lpg: values[2] ?? null } });
    }
  }
  const deduped = new Map();
  out.forEach((item) => { if (!deduped.has(item.iso || item.name)) deduped.set(item.iso || item.name, item); });
  return [...deduped.values()];
}

async function fetchText(url) {
  const upstream = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache'
    }
  });
  if (!upstream.ok) throw new Error(`${url} returned ${upstream.status}`);
  return upstream.text();
}

function todayOffset(days = 0) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=86400');
  const candidates = [
    'https://fuelo.eu/?convertto=eur',
    'https://fuelo.eu/',
    `https://gr.fuelo.net/world/prices/${todayOffset(0)}?lang=en`,
    `https://gr.fuelo.net/world/prices/${todayOffset(-1)}?lang=en`,
    `https://gr.fuelo.net/world/prices/${todayOffset(-2)}?lang=en`
  ];

  const errors = [];
  for (const url of candidates) {
    try {
      const html = await fetchText(url);
      let items = parseRows(html);
      if (items.length < 15) items = parseLoose(html);
      if (items.length >= 15) {
        response.status(200).json({
          status: 'live',
          sourceUrl: url,
          updatedAt: new Date().toISOString(),
          count: items.length,
          items
        });
        return;
      }
      errors.push(`${url}: parsed ${items.length}`);
    } catch (error) {
      errors.push(error.message);
    }
  }

  response.status(200).json({
    status: 'fallback',
    sourceUrl: 'https://fuelo.eu/',
    updatedAt: new Date().toISOString(),
    count: FALLBACK.length,
    errors,
    items: FALLBACK
  });
}
