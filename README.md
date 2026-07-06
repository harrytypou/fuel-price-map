# EuroFuel — Vercel-ready fuel price map

Minimal interactive Europe fuel-price map.

## What changed in this version

- Real SVG country outlines instead of marker blobs.
- No D3, no TopoJSON CDN, no external map library.
- Very minimal dark design: no gradients, no rounded cards, no fake glass UI.
- Vercel serverless routes:
  - `/api/fuelo` fetches EUR prices from Fuelo server-side.
  - `/api/rates` fetches exchange rates server-side.
- Flags try FlagDownload first and fall back to another public PNG flag source only if hotlinking fails.

## Deploy to Vercel

Upload the **contents** of this folder to GitHub, then import the repository in Vercel.

Recommended Vercel settings:

- Framework Preset: `Other`
- Build Command: empty
- Output Directory: empty
- Install Command: empty or default

After deploy, test:

- `/`
- `/api/fuelo`
- `/api/rates`

## Local test

Install the Vercel CLI:

```bash
npm i -g vercel
```

Run:

```bash
vercel dev
```
