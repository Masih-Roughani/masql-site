import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { content } from './content.mjs';

const release = JSON.parse(await readFile(new URL('../release.json', import.meta.url)));
const root = new URL('../', import.meta.url);
const { repository: repo, site, version, filename, sha256 } = release;
const download = `${repo}/releases/download/v${version}/${filename}`;
const notes = `${repo}/releases/tag/v${version}`;
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const bidi = (text) => escape(text).replace(/(PostgreSQL|GitHub Pages|GitHub Releases|GitHub|SmartScreen|SHA-256|ARM64|PGlite|MasQL|SQL|SELECT)/g, '<bdi>$1</bdi>');
const paths = {
  download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V4H4v12h4"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  chevron: '<path d="m7 10 5 5 5-5"/>',
  windows: '<path d="M3 5 11 4v7H3zm10-1 8-1v8h-8zM3 13h8v7l-8-1zm10 0h8v8l-8-1z"/>'
};
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;

function page(lang, kind = 'home') {
  const t = content[lang], prefix = lang === 'en' ? '../' : './';
  const home = lang === 'en' ? `${site}en/` : site;
  const privacy = kind === 'privacy';
  const canonical = `${home}${privacy ? 'privacy.html' : ''}`;
  const asset = (path) => `${prefix}assets/${path}`;
  const flow = (label) => {
    const [start, bend, approach] = lang === 'fa' ? [240, 258, 480] : [760, 742, 520];
    const d = `M${start} 1 V22 Q${start} 42 ${bend} 42 H${approach} Q500 42 500 62 V118`;
    return `<div class="flow-connector" data-flow aria-hidden="true"><svg viewBox="0 0 1000 128" preserveAspectRatio="none" fill="none"><path class="flow-track" d="${d}"/><path class="flow-line" pathLength="1" d="${d}"/><path class="flow-tip" d="m493 111 7 7 7-7"/></svg><span class="flow-label">${label}</span></div>`;
  };
  const languageLinks = `<div class="languages" aria-label="${t.language}"><a href="${lang === 'en' ? '../' : './'}${privacy ? 'privacy.html' : ''}" lang="fa" hreflang="fa" ${lang === 'fa' ? 'aria-current="page"' : ''}>فارسی</a><a href="${lang === 'en' ? './' : 'en/'}${privacy ? 'privacy.html' : ''}" lang="en" hreflang="en" ${lang === 'en' ? 'aria-current="page"' : ''}>EN</a></div>`;
  const primary = (text = t.download) => `<a class="button button-primary download-link" href="${download}">${icon('download')}<span>${text}</span></a>`;
  const screen = (name, alt, hero = false) => {
    const dimensions = name === 'query-lab' ? 'width="1418" height="844"' : ['persian-interface', 'visual-schema-editor', 'table-constraints'].includes(name) ? 'width="2160" height="1350"' : 'width="2143" height="1342"';
    return `<a class="screenshot-link" href="${asset(`screenshots/${name}.webp`)}" data-screenshot data-kind="product" aria-label="${t.enlarge}"><img src="${asset(`screenshots/${name}.webp`)}" ${dimensions} alt="${escape(alt)}" ${hero ? 'fetchpriority="high"' : 'loading="lazy" decoding="async"'}><span class="expand-hint">${icon('expand')}<span>${t.enlarge}</span></span></a>`;
  };
  const brand = `<a class="brand" href="${lang === 'en' ? './' : prefix}" aria-label="MasQL"><img src="${asset('mark.webp')}" width="40" height="40" alt=""><span dir="ltr">MasQL</span></a>`;
  const footer = `<footer class="footer"><div class="container"><div class="footer-main">${brand}<p>${bidi(t.footerLine)}</p><div class="footer-links"><a href="${repo}/issues">${t.support}</a><a href="${repo}/releases">${t.releases}</a><a href="privacy.html">${t.privacy}</a></div></div><div class="footer-bottom"><p>${t.author}</p><span dir="ltr">© 2026 MasQL</span></div></div></footer>`;
  const body = privacy ? `<main id="main" class="legal container"><a class="text-link" href="./">${t.back}</a><h1>${t.privacyTitle}</h1>${t.privacySections.map(([title, text]) => `<section><h2>${title}</h2><p>${bidi(text)}</p></section>`).join('')}<a class="text-link" href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement">${t.githubPrivacy}</a></main>` : `
  <main id="main">
    <div class="brand-scene" data-brand-scene>
      <div class="brand-pin">
        <svg class="brand-guide" viewBox="0 0 1000 600" preserveAspectRatio="none" fill="none" aria-hidden="true"><path class="brand-guide-track" d="M0 160 H160 Q180 160 180 180 V240 Q180 260 200 260 H320 M680 340 H800 Q820 340 820 360 V440 Q820 460 840 460 H1000"/><path class="brand-guide-line" pathLength="1" d="M0 160 H160 Q180 160 180 180 V240 Q180 260 200 260 H320 M680 340 H800 Q820 340 820 360 V440 Q820 460 840 460 H1000"/></svg>
        <img class="brand-emblem" src="${asset('mark-large.webp')}" alt="" width="850" height="843" fetchpriority="high">
        <div class="brand-scene-copy"><p class="brand-scene-name" dir="ltr">MasQL</p><p>${t.introCaption}</p></div>
        <a class="intro-skip" href="#overview"><span>${t.introSkip}</span>${icon('chevron')}</a>
        <div class="intro-scroll" aria-hidden="true"><span>${t.introScroll}</span><span class="scroll-stem"></span></div>
      </div>
    </div>
    <section class="hero" id="overview" aria-labelledby="hero-title"><div class="container">
      <div class="intro-grid" data-reveal><h1 id="hero-title">${t.hero}</h1><div class="intro-description"><p class="lead">${bidi(t.intro)}</p><div class="actions">${primary()}<a class="text-link" href="#tour"><span>${bidi(t.explore)}</span></a></div></div></div>
      <ul class="platform-facts"><li>${icon('windows')}${t.platform}</li><li>${t.offline}</li><li>${t.free}</li></ul>
      ${flow(t.flowSchema)}
    </div></section>
    <div class="container"><figure class="hero-screen" data-zoom>${screen('live-schema', t.heroAlt, true)}<figcaption><span>${bidi(t.heroCaption)}</span><span dir="ltr">MasQL ${version}</span></figcaption></figure></div>
    <section class="tour section" id="tour" aria-labelledby="tour-title"><div class="container">
      <div class="section-head" data-reveal><h2 id="tour-title">${t.tourTitle}</h2><p class="lead">${bidi(t.tourIntro)}</p></div>
      ${flow(t.flowQuery)}
      <div class="workspace-tabs" data-tabs>
        <div class="tab-list" aria-label="${t.nav[0]}">${t.tabs.map(([name, label], i) => `<button class="tab-button" id="tab-${name}" data-tab="${name}" type="button" ${i === 0 ? 'data-active' : ''}>${label}</button>`).join('')}</div>
        ${t.tabs.map(([name, label, title, desc, alt], i) => `<div class="tab-panel" id="panel-${name}" data-panel="${name}"><div class="panel-caption"><h3>${title}</h3><p>${bidi(desc)}</p></div>${screen(name, alt)}</div>`).join('')}
      </div>
    </div></section>
    <section class="learning section" id="learn" aria-labelledby="learn-title"><div class="container">
      <div class="section-head" data-reveal><h2 id="learn-title">${bidi(t.learnTitle)}</h2><p class="lead">${t.learnIntro}</p></div>
      <div class="course-list">${t.courses.map(([n, label, desc]) => `<div class="course" data-reveal><span class="course-number">${n}</span><h3>${label}</h3><p>${bidi(desc)}</p></div>`).join('')}</div>
      ${flow(t.flowLearn)}
      <figure class="learning-screen" data-zoom>${screen('learning-lab', t.learnAlt)}<figcaption>${t.grading}</figcaption></figure>
    </div></section>
    <section class="local section" aria-labelledby="local-title"><div class="container">
      <div class="local-copy" data-reveal><h2 id="local-title">${bidi(t.localTitle)}</h2><p class="lead">${t.localIntro}</p><ul class="local-notes">${t.localNotes.map((text) => `<li>${icon('check')}<span>${bidi(text)}</span></li>`).join('')}</ul></div>
      <figure class="local-screen" data-zoom>${screen('persian-interface', t.localAlt)}</figure>
    </div></section>
    <section class="download section" id="download" aria-labelledby="download-title"><div class="container">
      <div class="section-head" data-reveal><h2 id="download-title">${bidi(t.downloadTitle)}</h2><p class="lead">${bidi(t.downloadIntro)}</p></div>
      ${flow(t.flowDownload)}
      <div class="download-layout"><div class="release-details"><div class="release-heading"><img src="${asset('app-icon.webp')}" alt="" width="88" height="88" loading="lazy"><div><h3 dir="ltr">MasQL ${version}</h3><p>${t.architecture}</p></div></div>
        <dl class="release-specs"><div><dt>${t.release}</dt><dd dir="ltr">${version}</dd></div><div><dt>${t.size}</dt><dd>${t.sizeValue}</dd></div></dl>
        ${primary()}<div class="release-links"><a href="${notes}">${t.releaseNotes}</a><a href="${download}.sha256">${t.checksumFile}</a></div>
      </div><div class="install-details"><h3>${t.installTitle}</h3><ol>${t.steps.map((step) => `<li>${bidi(step)}</li>`).join('')}</ol><p class="install-note">${bidi(t.unsigned)}</p></div></div>
      <details class="checksum"><summary><span>${bidi(t.checksum)}</span>${icon('chevron')}</summary><div class="checksum-body"><code dir="ltr" id="checksum-value">${sha256}</code><button type="button" class="button button-quiet copy-button" data-copy data-success="${t.copied}" data-failure="${t.copyFail}">${icon('copy')}<span>${t.copy}</span></button><span class="copy-status" role="status" aria-live="polite"></span></div></details>
    </div></section>
    <section class="faq section" aria-labelledby="faq-title"><div class="container"><h2 id="faq-title">${t.faqTitle}</h2><div class="faq-list">${t.faqs.map(([q, a]) => `<details><summary><span>${bidi(q)}</span>${icon('chevron')}</summary><p>${bidi(a)}</p></details>`).join('')}</div></div></section>
  </main>
  <dialog id="screenshot-dialog" aria-label="${t.enlarge}"><div class="dialog-toolbar"><span>${t.dialogHint}</span><button class="button button-quiet" type="button" data-dialog-close aria-label="${t.dialogClose}">${icon('close')}</button></div><img src="${asset('screenshots/live-schema.webp')}" alt="" id="dialog-image" width="2143" height="1342" loading="lazy"></dialog>`;
  return `<!doctype html>
<html lang="${lang}" dir="${t.dir}">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${privacy ? `${t.privacy} | MasQL` : t.title}</title><meta name="description" content="${t.description}">
  <link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="fa" href="${site}${privacy ? 'privacy.html' : ''}"><link rel="alternate" hreflang="en" href="${site}en/${privacy ? 'privacy.html' : ''}"><link rel="alternate" hreflang="x-default" href="${site}${privacy ? 'privacy.html' : ''}">
  <meta property="og:type" content="website"><meta property="og:site_name" content="MasQL"><meta property="og:title" content="${t.title}"><meta property="og:description" content="${t.description}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site}assets/social.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="${lang === 'fa' ? 'fa_IR' : 'en_US'}"><meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#f8fbff"><link rel="icon" href="${asset('favicon.ico')}" sizes="any"><link rel="apple-touch-icon" href="${asset('apple-touch-icon.png')}">
  <link rel="preload" href="${asset(lang === 'fa' ? 'fonts/vazirmatn-arabic.woff2' : 'fonts/familjen-latin.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${prefix}site.css"><script src="${prefix}site.js" type="module"></script>
</head>
<body>
  <a class="skip-link" href="#main">${t.skip}</a>
  <header class="header"><div class="container nav-shell">${brand}<nav id="main-nav" aria-label="${t.nav[0]}">${t.nav.map((label, i) => `<a href="${kind === 'home' ? '' : './'}#${['tour', 'learn', 'download'][i]}"><span>${bidi(label)}</span></a>`).join('')}</nav><div class="nav-controls">${languageLinks}<button type="button" class="menu-toggle" aria-controls="main-nav" aria-expanded="false" aria-label="${t.menu}" data-open-label="${t.menu}" data-close-label="${t.closeMenu}">${icon('menu')}</button></div></div></header>
  ${body}${footer}
</body></html>`.replace(/[ \t]+$/gm, '');
}

await mkdir(new URL('en/', root), { recursive: true });
for (const lang of ['fa', 'en']) {
  const prefix = lang === 'en' ? 'en/' : '';
  await writeFile(new URL(`${prefix}index.html`, root), page(lang));
  await writeFile(new URL(`${prefix}privacy.html`, root), page(lang, 'privacy'));
}
await writeFile(new URL('robots.txt', root), `User-agent: *\nAllow: /\nSitemap: ${site}sitemap.xml\n`);
await writeFile(new URL('sitemap.xml', root), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['', 'en/', 'privacy.html', 'en/privacy.html'].map(path => `<url><loc>${site}${path}</loc></url>`).join('')}</urlset>\n`);
await writeFile(new URL('404.html', root), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta name="description" content="This MasQL page could not be found."><title>Page not found — MasQL</title><link rel="stylesheet" href="${site}site.css"></head><body><main class="legal container"><h1>Page not found.</h1><p>This address may have changed.</p><a class="button button-primary" href="${site}">بازگشت به MasQL / Back to MasQL</a></main></body></html>`);
console.log('Built Persian and English home/privacy pages, sitemap, robots.txt, and 404 page.');
