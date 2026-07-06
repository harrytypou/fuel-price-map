// Minimal no-dependency local server + Fuelo proxy.
// Run: node server.js
// Open: http://localhost:8080

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml"
};

async function handleFueloProxy(req, res) {
  const upstreamUrl = "https://fuelo.eu/?convertto=eur";
  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome Safari",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9"
      }
    });
    const text = await upstream.text();
    res.writeHead(upstream.ok ? 200 : upstream.status, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=900"
    });
    res.end(text);
  } catch (error) {
    res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: "Fuelo proxy failed", detail: error.message }));
  }
}

function serveStatic(req, res) {
  const cleanUrl = decodeURIComponent(req.url.split("?")[0]);
  const requested = cleanUrl === "/" ? "/index.html" : cleanUrl;
  const filePath = path.normalize(path.join(ROOT, requested));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      return res.end("Not found");
    }
    res.writeHead(200, { "Content-Type": mime[path.extname(filePath)] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/fuelo")) return handleFueloProxy(req, res);
  return serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`EuroFuel Atlas running at http://localhost:${PORT}`);
});
