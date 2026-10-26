const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const BASE = 'https://zzyl909.com/';
const OUT = path.resolve(__dirname, '../../live-capture/images');
const SRC_DIRS = [
  path.resolve(__dirname, '../../live-capture/js'),
  path.resolve(__dirname, '../../live-capture/css'),
];

function walk(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(js|css)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    lib
      .get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchUrl(res.headers.location));
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }));
      })
      .on('error', reject);
  });
}

async function main() {
  const files = SRC_DIRS.flatMap((d) => walk(d));
  const re = /static\/img\/[^"'\\)\s]+/g;
  const found = new Set();
  for (const f of files) {
    const s = fs.readFileSync(f, 'utf8');
    let m;
    while ((m = re.exec(s))) found.add(m[0]);
  }
  const extras = ['imageConfig/zzyl888logo.png', 'imageConfig/zzyl888favicon.ico'];
  extras.forEach((e) => found.add(e));

  fs.mkdirSync(OUT, { recursive: true });
  const log = { ok: [], fail: [] };
  for (const rel of [...found].sort()) {
    const url = new URL(rel, BASE).href;
    const fname = path.basename(rel.split('?')[0]);
    const dest = path.join(OUT, fname);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      log.ok.push({ url, dest, skipped: true });
      continue;
    }
    try {
      const { status, body } = await fetchUrl(url);
      if (status === 200 && body.length) {
        fs.writeFileSync(dest, body);
        log.ok.push({ url, dest, bytes: body.length });
      } else log.fail.push({ url, status });
    } catch (e) {
      log.fail.push({ url, error: String(e.message || e) });
    }
  }
  fs.writeFileSync(path.resolve(__dirname, '../../live-capture/metadata/missing-fetch-log.json'), JSON.stringify(log, null, 2));
  console.log('refs', found.size, 'ok', log.ok.length, 'fail', log.fail.length);
}

main();
