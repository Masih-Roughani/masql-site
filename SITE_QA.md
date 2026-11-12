# Website publication checks

Verified on 2026-11-12.

- Persian RTL and English LTR have separate, statically generated home and privacy pages, canonical URLs, and language alternates.
- Static verification checks translation structure, 109 local asset/link references, unique IDs, anchors, release links, checksum metadata, screenshots, and font licenses.
- Browser checks passed for both languages at 320, 375, 414, 768, 1024, 1280, 1440, and 1920 pixels wide without horizontal page overflow.
- Exercised language switching with section preservation, mobile navigation, keyboard tabs, image dialogs with Escape and focus restoration, checksum copy feedback, FAQ expansion, and privacy navigation.
- Both languages retain navigation, screenshots, and download links with JavaScript disabled. No renderer page errors occurred in the exercised flows.
- Automated axe checks found no violations under WCAG 2 A/AA and 2.1 AA tags on the tested home-page states. This is not an exhaustive accessibility certification.
- Hallmark static/render checks: zero open Floor failures or Reflex findings. Two recorded spacing exceptions preserve the continuous introduction-to-product composition.
- Independent visual review prompted three improvements: a real query result with 12 sample rows, a shorter mobile English headline, and headings naming PostgreSQL and Windows.
- The Query Lab screenshot was captured from MasQL 1.2.8 using an isolated local profile and sample records. No user database was used.
- GitHub Actions builds and verifies the site before deploying an explicit static-file allowlist to GitHub Pages over HTTPS.
- Public release and checksum endpoints were accessed without authentication. The complete public EXE was downloaded anonymously and its SHA-256 matched the original release:

```text
469ef6f4372dfda2883fb3f6bcd392b39789a731f2f1c964ca1a97c1d84961a0
```

The Windows executable is the existing 1.2.8 release, not a new desktop build. Its installer remains unsigned. The desktop development repository remains private.

## Scroll interaction update, 2026-11-12

- A native sticky scene keeps the logo centered while scrolling grows it. The animation reverses when scrolling upward and fades only after the pinned phase, avoiding a blank opening screen.
- Four rounded diagram connectors draw with scroll progress; screenshots gently scale into place and text reveals once as it enters the viewport.
- Browser checks cover both languages at phone and desktop sizes: centered logo, pinning, native mouse-wheel input, reversible growth, keyboard skip link, connector stroke progress, screenshot zoom, and no horizontal overflow at 320–1920 pixels.
- Runtime switching to reduced motion hides the introduction and restores static content. With JavaScript disabled, the original page remains visible without an empty scroll runway.
- Four Node tests cover growth, exit timing, clamping on narrow screens, and completion of content-entry animations before the reading area. These run in the deployment workflow.
- The existing language, navigation, gallery, dialog/focus, copy feedback, FAQ, privacy, and WCAG A/AA browser checks pass with the new interaction code, with no observed page errors.
- The earlier Hallmark checks above describe the original static launch. The revised introduction intentionally uses the first screen for the requested logo scene; current validation is the scroll behavior and browser coverage recorded here.
