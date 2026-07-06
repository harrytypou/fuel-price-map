# EuroFuel Atlas

A modern single-page webpage with:

- Dark-mode default UI
- Animated SVG map of Europe
- Hover tooltips and country highlighting
- Petrol 95, diesel and LPG views
- Currency selector, defaulting to EUR
- Flag images loaded from FlagDownload, not emoji flags
- Fuelo.eu price-fetching logic with a local proxy fallback
- Frankfurter exchange-rate API integration

## Run locally

```bash
cd eurofuel_live_map_site
node server.js
```

Then open:

```text
http://localhost:8080
```

The local server is recommended because Fuelo may block direct browser-side scraping with CORS/bot protection. The server exposes:

```text
/api/fuelo?convertto=eur
```

The frontend fetches that route first, then falls back to direct/proxy fetch attempts and finally demo fallback values if live data is blocked.

## Deploying

For Vercel/Netlify/Cloudflare, recreate the `/api/fuelo` route as a serverless function that requests:

```text
https://fuelo.eu/?convertto=eur
```

Then return the HTML to the frontend so the built-in parser can extract country fuel prices.
