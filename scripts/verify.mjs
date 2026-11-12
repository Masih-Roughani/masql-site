import assert from 'node:assert/strict';
import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { content } from './content.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const release = JSON.parse(await readFile(resolve(root, 'release.json')));
assert.match(release.sha256, /^[a-f0-9]{64}$/);
assert.match(release.version, /^\d+\.\d+\.\d+$/);
assert.equal(release.filename, `MasQL-Setup-${release.version}-x64.exe`);
assert.deepEqual(Object.keys(content.en).sort(), Object.keys(content.fa).sort());
assert.equal(content.en.tabs.length, content.fa.tabs.length);
let references = 0;

for (const name of ['index.html', 'en/index.html', 'privacy.html', 'en/privacy.html']) {
  const path = resolve(root, name), html = await readFile(path, 'utf8');
  const lang = name.startsWith('en/') ? 'en' : 'fa';
  assert.ok(html.includes(`<html lang="${lang}" dir="${content[lang].dir}">`));
  assert.ok(!html.includes('https://github.com/Masih-Roughani/MasQL/'), 'No private application repo links');
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${name}: unique IDs`);
  for (const match of html.matchAll(/(?:href|src)="([^"#]*)(#[^"]*)?"/g)) {
    let [, target, hash] = match;
    if (/^(https?:|mailto:|data:)/.test(target)) continue;
    const absolute = resolve(dirname(path), decodeURIComponent(target || '.'));
    const file = !target || target === './' ? (target ? resolve(absolute, 'index.html') : path) : target.endsWith('/') ? resolve(absolute, 'index.html') : absolute;
    await access(file).catch(() => assert.fail(`${name}: missing ${target}`));
    if (hash) {
      const linked = await readFile(file, 'utf8');
      assert.ok(linked.includes(`id="${hash.slice(1)}"`), `${name}: missing anchor ${target}${hash}`);
    }
    references++;
  }
  if (name.endsWith('index.html')) {
    assert.equal((html.match(/class="tab-panel"/g) || []).length, 5);
    assert.equal((html.match(/class="[^"]*\bdownload-link\b[^"]*"/g) || []).length, 2);
    assert.ok(html.includes(`${release.repository}/releases/download/v${release.version}/${release.filename}`));
    assert.ok(html.includes(release.sha256));
  }
}
for (const cssName of ['site.css', 'scroll.css', 'base.css', 'tokens.css']) {
  const css = await readFile(resolve(root, cssName), 'utf8');
  for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) {
    await access(resolve(root, match[1])); references++;
  }
}
const images = await readdir(resolve(root, 'assets/screenshots'));
assert.equal(images.filter(n => n.endsWith('.webp')).length, 9);
for (const name of ['Vazirmatn-OFL.txt', 'Familjen-OFL.txt']) await access(resolve(root, 'assets/fonts', name));
console.log(`Verified 4 localized pages, ${references} local references, 9 screenshots, font licenses, language parity, release links, and checksum.`);
