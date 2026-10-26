/**
 * Live runtime resource capture for zzyl909.com Vue SPA.
 * Saves to ../../live-capture/ (isolated from start-demo).
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('playwright');

const BASE = 'https://zzyl909.com';
const ENTRY = `${BASE}/index.html`;
const OUT_ROOT = path.resolve(__dirname, '../../live-capture');

const ROUTES = [
  '/home',
  '/activity',
  '/user',
  '/login',
  '/registry',
  '/taskCenter',
  '/vip',
  '/shareFriends',
  '/inviteFriends',
  '/recharge',
  '/reflect',
  '/orderRecord',
  '/rechargeRecord',
  '/safeCenter',
  '/vipDetail',
  '/softwareDownload',
  '/partner',
];

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|ico|avif)(\?|$)/i;
const FONT_EXT = /\.(woff2?|ttf|otf|eot)(\?|$)/i;

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function safeFilename(urlStr) {
  try {
    const u = new URL(urlStr);
    let name = path.basename(u.pathname);
    if (!name || name === '/') {
      const h = crypto.createHash('md5').update(urlStr).digest('hex').slice(0, 12);
      name = `resource_${h}`;
    }
    if (u.search) {
      const q = crypto.createHash('md5').update(u.search).digest('hex').slice(0, 6);
      const ext = path.extname(name);
      const base = ext ? name.slice(0, -ext.length) : name;
      name = ext ? `${base}_${q}${ext}` : `${base}_${q}`;
    }
    return name.replace(/[<>:"|?*]/g, '_');
  } catch {
    return `invalid_${crypto.createHash('md5').update(urlStr).digest('hex').slice(0, 12)}`;
  }
}

function classifyUrl(urlStr, contentType) {
  const ct = (contentType || '').toLowerCase();
  const lower = urlStr.toLowerCase();
  if (lower.includes('manifest') && (ct.includes('json') || lower.endsWith('.webmanifest')))
    return 'metadata';
  if (ct.includes('html') || lower.endsWith('.html')) return 'html';
  if (ct.includes('javascript') || lower.endsWith('.js')) return 'js';
  if (ct.includes('css') || lower.endsWith('.css')) return 'css';
  if (ct.includes('json') || ct.includes('application/json')) return 'api';
  if (ct.includes('font') || FONT_EXT.test(lower)) return 'fonts';
  if (ct.includes('image') || IMAGE_EXT.test(lower)) return 'images';
  if (ct.includes('wasm')) return 'js';
  return 'metadata';
}

function subDirFor(kind, urlStr) {
  if (kind === 'js' && /chunk-/.test(urlStr)) return path.join('js', 'chunks');
  if (kind === 'css' && /chunk-/.test(urlStr)) return path.join('css', 'chunks');
  return kind;
}

function extractImageUrlsFromJson(obj, out, prefix = '') {
  if (obj == null) return;
  if (typeof obj === 'string') {
    if (/^https?:\/\//i.test(obj) && IMAGE_EXT.test(obj)) {
      out.push({ field: prefix, url: obj });
    } else if (/^\/[^?\s]+\.(png|jpe?g|webp|gif|svg)/i.test(obj)) {
      out.push({ field: prefix, url: obj });
    }
    return;
  }
  if (Array.isArray(obj)) {
    obj.forEach((v, i) => extractImageUrlsFromJson(v, out, `${prefix}[${i}]`));
    return;
  }
  if (typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (/img|image|icon|logo|banner|cover|pic|url|avatar|thumb|background|bg/i.test(k)) {
        if (typeof v === 'string' && (IMAGE_EXT.test(v) || /^https?:\/\//i.test(v) || v.startsWith('/')))
          out.push({ field: key, url: v });
      }
      extractImageUrlsFromJson(v, out, key);
    }
  }
}

async function saveResponse(entry, body) {
  const kind = classifyUrl(entry.url, entry.contentType);
  const dir = path.join(OUT_ROOT, subDirFor(kind, entry.url));
  ensureDir(dir);
  const fname = safeFilename(entry.url);
  const full = path.join(dir, fname);
  if (fs.existsSync(full) && fs.statSync(full).size > 0) {
    entry.savedPath = full;
    entry.skippedDuplicate = true;
    return;
  }
  fs.writeFileSync(full, body);
  entry.savedPath = full;
  entry.bytes = body.length;
}

async function main() {
  const dirs = ['html', 'js', 'js/chunks', 'css', 'css/chunks', 'images', 'fonts', 'api', 'metadata'];
  dirs.forEach((d) => ensureDir(path.join(OUT_ROOT, d)));

  const manifest = {
    capturedAt: new Date().toISOString(),
    entry: ENTRY,
    resources: [],
    routesVisited: [],
    failed: [],
    apiImageFields: [],
    chunkLoadsByRoute: {},
  };

  const seenUrls = new Set();

  const browser = await chromium.launch({
    headless: true,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 390, height: 844 },
    locale: 'zh-CN',
  });

  await context.addInitScript(() => {
    const noop = () => {};
    try {
      const desc = Object.getOwnPropertyDescriptor(globalThis, 'debugger');
      if (!desc || desc.configurable) {
        Object.defineProperty(globalThis, 'debugger', {
          get: () => noop,
          set: () => {},
          configurable: true,
        });
      }
    } catch (_) {}
    const orig = Function.prototype.constructor;
    function PatchedFunction(...args) {
      const body = args[args.length - 1];
      if (typeof body === 'string' && body.includes('debugger')) return noop;
      return orig.apply(this, args);
    }
    PatchedFunction.prototype = orig.prototype;
    try {
      Function.prototype.constructor = PatchedFunction;
    } catch (_) {}
  });

  const page = await context.newPage();

  page.on('response', async (response) => {
    const url = response.url();
    if (!url.startsWith('http')) return;
    if (seenUrls.has(url)) return;
    const status = response.status();
    const headers = response.headers();
    const contentType = headers['content-type'] || '';
    const entry = {
      url,
      status,
      contentType,
      route: manifest._currentRoute || '',
    };

    if (status >= 400) {
      manifest.failed.push({ url, status, route: entry.route });
      seenUrls.add(url);
      return;
    }

    try {
      const body = await response.body();
      if (!body || body.length === 0) {
        seenUrls.add(url);
        return;
      }
      await saveResponse(entry, body);
      manifest.resources.push(entry);

      if (classifyUrl(url, contentType) === 'api' || contentType.includes('json')) {
        try {
          const text = body.toString('utf8');
          const json = JSON.parse(text);
          const imgs = [];
          extractImageUrlsFromJson(json, imgs);
          if (imgs.length) {
            manifest.apiImageFields.push({
              endpoint: url,
              route: entry.route,
              images: imgs.slice(0, 80),
            });
          }
          const apiName = safeFilename(url);
          fs.writeFileSync(path.join(OUT_ROOT, 'api', apiName + '.json'), text);
        } catch (_) {}
      }

      if (/chunk-[0-9a-f]{8}/i.test(url)) {
        const m = url.match(/chunk-[0-9a-f]{8}/i);
        if (m && entry.route) {
          const r = entry.route;
          if (!manifest.chunkLoadsByRoute[r]) manifest.chunkLoadsByRoute[r] = { js: [], css: [] };
          if (url.endsWith('.js') || contentType.includes('javascript'))
            manifest.chunkLoadsByRoute[r].js.push(m[0]);
          if (url.endsWith('.css') || contentType.includes('css'))
            manifest.chunkLoadsByRoute[r].css.push(m[0]);
        }
      }

      seenUrls.add(url);
    } catch (e) {
      manifest.failed.push({ url, error: String(e.message || e), route: entry.route });
      seenUrls.add(url);
    }
  });

  async function visitHashRoute(routePath) {
    manifest._currentRoute = routePath;
    const url = `${ENTRY}#${routePath}`;
    manifest.routesVisited.push({ path: routePath, url, at: new Date().toISOString() });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(async () => {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    });
    await page.waitForTimeout(2500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2)).catch(() => {});
    await page.waitForTimeout(1500);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)).catch(() => {});
    await page.waitForTimeout(1500);
  }

  console.log('Loading home...');
  await visitHashRoute('/home');

  for (const route of ROUTES) {
    if (route === '/home') continue;
    console.log('Route:', route);
    await visitHashRoute(route);
  }

  console.log('Clicking bottom tab labels if present...');
  manifest._currentRoute = '/home+clicks';
  await visitHashRoute('/home');
  const tabTexts = ['活动', '客服', '下载', '我的', '首页'];
  for (const t of tabTexts) {
    try {
      const loc = page.getByText(t, { exact: false }).first();
      if (await loc.isVisible({ timeout: 2000 })) {
        await loc.click({ timeout: 3000 });
        await page.waitForTimeout(3000);
      }
    } catch (_) {}
  }

  try {
    const recharge = page.getByText('充值', { exact: false }).first();
    if (await recharge.isVisible({ timeout: 2000 })) {
      await recharge.click({ timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(2000);
    }
  } catch (_) {}

  try {
    const cats = ['热门', '电子', '真人', '最近'];
    for (const c of cats) {
      const el = page.getByText(c, { exact: false }).first();
      if (await el.isVisible({ timeout: 1500 })) {
        await el.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(2000);
      }
    }
  } catch (_) {}

  let bootstrap = {};
  try {
    bootstrap = await page.evaluate(() => {
      const scripts = [...document.querySelectorAll('script[src]')].map((s) => s.src);
      const links = [...document.querySelectorAll('link[rel="stylesheet"], link[href]')].map((l) => l.href);
      const app = document.querySelector('#app');
      return {
        title: document.title,
        scripts,
        stylesheets: links,
        hasApp: !!app,
        vueDetected:
          !!(window.__VUE_DEVTOOLS_GLOBAL_HOOK__ || document.querySelector('[data-v-app]') || app?.innerHTML?.length > 50),
        hash: location.hash,
      };
    });
  } catch (e) {
    bootstrap = { error: String(e) };
  }

  manifest.bootstrap = bootstrap;
  delete manifest._currentRoute;

  fs.writeFileSync(path.join(OUT_ROOT, 'metadata', 'capture-manifest.json'), JSON.stringify(manifest, null, 2));

  await browser.close();
  console.log('Done. Resources:', manifest.resources.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
