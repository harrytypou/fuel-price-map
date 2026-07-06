# Fuelio — Europe fuel prices

Minimal Vercel-ready static site with serverless API routes.

## What changed in this version

- Dark minimal design kept, but the hero and table are cleaner.
- Header now uses the Fuelio logo from `assets/fuelio-logo.png`.
- The map now has a separate land underlay behind the country paths. This reduces the visible black gaps between neighbouring countries and makes the map look more like one continuous landmass.
- Countries are brighter and no longer blend into the background.
- Browser/SVG focus rectangles on countries are disabled.
- Hover/click map animations are still enabled.

## Deploy to Vercel

Upload the contents of this folder to a GitHub repo, then import the repo into Vercel.

Recommended Vercel settings:

```text
Framework Preset: Other
Build Command: leave empty
Output Directory: leave empty
```

Test after deployment:

```text
/
/api/fuelo
/api/rates
```

## Logo

The site references:

```text
/assets/fuelio-logo.png
```

The included file is a clean temporary Fuelio wordmark at 1007×287 px. Replace that file with your final logo using the same filename to keep the site working without code changes.


## Latest changes

- Added the supplied `/favicon.ico` for browser tabs and Vercel root serving.
- Added professional staggered load animations, map reveal animations, row animations, and refresh loading state.
- Changed Luxembourg to a small-country marker/dot on the map.
