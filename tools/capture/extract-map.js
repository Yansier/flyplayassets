const fs = require('fs');
const p = 'D:/BuildYourdream/mission/20261019telegramgame/zzyl909.com/static-Decompress/static/js/app.bdb00f7e.js';
const s = fs.readFileSync(p, 'utf8');

const re = /path:"(\/[^"]*)"/g;
let m;
const rows = [];
while ((m = re.exec(s))) {
  const start = Math.max(0, m.index - 200);
  const end = Math.min(s.length, m.index + 1800);
  const win = s.slice(start, end);
  const chunks = [...win.matchAll(/chunk-[0-9a-f]{8}/g)].map((x) => x[0]);
  const uniq = [...new Set(chunks)];
  const nameM = win.match(/name:"([^"]+)"/);
  rows.push({
    path: m[1],
    index: m.index,
    name: nameM ? nameM[1] : '',
    chunks: uniq,
    snippet: win.slice(0, 400).replace(/\s+/g, ' ')
  });
}
console.log(JSON.stringify(rows, null, 2));
