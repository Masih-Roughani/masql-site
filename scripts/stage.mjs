import { mkdir, cp } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const target = new URL('output/site/', root);
await mkdir(target, { recursive: true });
// Explicit allowlist: never upload tooling, local QA files, or installer binaries to Pages.
for (const path of ['index.html', 'en', 'privacy.html', '404.html', 'site.css', 'scroll.css', 'site.js', 'motion.js', 'base.css', 'tokens.css', 'assets', 'release.json', 'robots.txt', 'sitemap.xml', '.nojekyll']) {
  await cp(new URL(path, root), new URL(path, target), { recursive: true });
}
console.log('Staged static website in output/site.');
