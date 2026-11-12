const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
const smooth = (value) => { const t = clamp(value); return t * t * (3 - 2 * t); };

export function introFrame(progress, maxScale = 3.3) {
  const p = clamp(progress, 0, 2);
  const limit = Math.max(1, Number.isFinite(maxScale) ? maxScale : 1);
  return {
    scale: 0.65 + (limit - 0.65) * smooth(p / 0.8),
    opacity: 1 - smooth((p - 1) / 0.65),
    guide: smooth(p / 0.9),
  };
}

export function enterProgress(top, viewportHeight) {
  if (!Number.isFinite(top) || !Number.isFinite(viewportHeight) || viewportHeight <= 0) return 0;
  return smooth((viewportHeight * 0.96 - top) / (viewportHeight * 0.42));
}

export function initScrollMotion() {
  const scene = document.querySelector('[data-brand-scene]');
  if (!scene || !('IntersectionObserver' in window)) return;
  const root = document.documentElement;
  const header = document.querySelector('.header');
  const pin = scene.querySelector('.brand-pin');
  const mark = scene.querySelector('.brand-emblem');
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const revealNodes = [...document.querySelectorAll('[data-reveal]')];
  const zooms = [...document.querySelectorAll('[data-zoom]')].map(node => ({ node, visual: node.querySelector('.screenshot-link') }));
  const flows = [...document.querySelectorAll('[data-flow]')];
  let scheduled = 0;
  let enabled = false;
  let headerHeight = 0;
  let observer;
  let resizeObserver;

  function paint() {
    scheduled = 0;
    if (!enabled) return;
    const viewport = innerHeight;
    // Read all geometry before writing transforms, so a scroll frame cannot force repeated layouts.
    const sceneTop = scene.getBoundingClientRect().top;
    const runway = Math.max(1, scene.offsetHeight - pin.offsetHeight);
    const p = (headerHeight - sceneTop) / runway;
    const base = mark.offsetWidth;
    const limit = Math.min(3.3, (innerWidth - 48) / base, pin.offsetHeight * 0.5 / base);
    const frame = introFrame(p, limit);
    const zoomFrames = zooms.map(({ node, visual }) => ({ visual, progress: enterProgress(node.getBoundingClientRect().top, viewport) }));
    const flowFrames = flows.map(node => ({ node, progress: enterProgress(node.getBoundingClientRect().top, viewport) }));
    scene.style.setProperty('--logo-scale', frame.scale.toFixed(4));
    scene.style.setProperty('--scene-opacity', frame.opacity.toFixed(4));
    scene.style.setProperty('--brand-line', frame.guide.toFixed(4));
    for (const { visual, progress } of zoomFrames) {
      if (!visual) continue;
      visual.style.setProperty('--image-scale', (0.94 + 0.06 * progress).toFixed(4));
      visual.style.setProperty('--image-rise', `${(18 * (1 - progress)).toFixed(2)}px`);
    }
    for (const { node, progress } of flowFrames) {
      node.style.setProperty('--flow-progress', progress.toFixed(4));
      node.style.setProperty('--tip-opacity', clamp((progress - 0.82) / 0.18).toFixed(4));
    }
  }

  function schedule() {
    if (enabled && !scheduled) scheduled = requestAnimationFrame(paint);
  }

  function measure() {
    if (!enabled) return;
    const height = Math.round(header.getBoundingClientRect().height);
    if (height !== headerHeight) {
      headerHeight = height;
      root.style.setProperty('--nav-height', `${height}px`);
    }
    schedule();
  }

  function sync() {
    enabled = !preference.matches;
    observer?.disconnect();
    resizeObserver?.disconnect();
    cancelAnimationFrame(scheduled); scheduled = 0;
    root.classList.toggle('motion-enabled', enabled);
    if (!enabled) {
      // Progressive fallback: no empty intro runway, hidden text, or transformed controls.
      revealNodes.forEach(node => node.classList.remove('is-visible'));
      return;
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -24px 0px', threshold: 0.05 });
    revealNodes.forEach(node => observer.observe(node));
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(header);
      resizeObserver.observe(document.querySelector('main'));
    }
    measure();
    paint();
  }

  // Scrolling remains entirely native: no wheel/touch interception or forced scroll positions.
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure, { passive: true });
  addEventListener('pageshow', schedule);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });
  preference.addEventListener('change', sync);
  document.fonts?.ready.then(measure);
  sync();
}
