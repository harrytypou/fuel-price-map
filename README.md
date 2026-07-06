# EuroFuel Atlas — Vercel-ready repo

A clean minimal dark-mode webpage with an animated Europe fuel-price map, Fuelo.eu server-side fetching, currency conversion, hover tooltips, country table, and real PNG flags loaded from FlagDownload.

This version is built specifically for **GitHub → Vercel** deployment.

## Why this version works better on Vercel

The previous local version used a custom `server.js` and external CDN-loaded map data. That often fails when the project is uploaded as a normal static GitHub repo.

This version uses:

- `index.html`, `styles.css`, `app.js` as static files
- `/api/fuelo.js` as a Vercel serverless function for Fuelo.eu fetching
- `/api/rates.js` as a Vercel serverless function for exchange rates
- a local SVG-style animated map, so no D3, TopoJSON, or world-atlas CDN is needed
- no build step and no framework

## File structure

```text
.
├── api
│   ├── fuelo.js
│   └── rates.js
├── assets
│   └── favicon.svg
├── app.js
├── index.html
├── package.json
├── styles.css
├── vercel.json
└── README.md
```

## Deploy to Vercel through GitHub

1. Create a new GitHub repository.
2. Upload the **contents of this folder**, not the parent ZIP folder.
3. Go to Vercel and import the GitHub repository.
4. Use these Vercel settings:
   - Framework Preset: **Other**
   - Build Command: **leave empty**
   - Output Directory: **leave empty**
   - Install Command: **leave default**
5. Deploy.

After deployment, these should work:

```text
https://your-project.vercel.app/
https://your-project.vercel.app/api/fuelo
https://your-project.vercel.app/api/rates
```

## Local development

Install the Vercel CLI if you do not already have it:

```bash
npm i -g vercel
```

Then run:

```bash
vercel dev
```

Open:

```text
http://localhost:3000
```

Do not test with only `file://index.html`, because `/api/fuelo` and `/api/rates` only exist in Vercel or `vercel dev`.

## Data sources

- Fuel prices: `https://fuelo.eu/?convertto=eur`
- Currency rates: `https://api.frankfurter.dev/v2/rates?base=EUR`
- Flags: `https://flagdownload.com/`

## Important note about Fuelo

Fuelo.eu does not provide a documented public JSON API for this exact table. The `/api/fuelo.js` function fetches Fuelo's public HTML and parses the country price table. If Fuelo changes its markup or blocks the serverless function temporarily, the frontend stays functional and displays built-in fallback values while clearly showing fallback mode.
