/* IndiFrame Help Desk — actual uploaded Preview video background. */
(() => {
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion || document.getElementById('portalVideoBackground')) return;
  const video = document.createElement('video');
  video.id = 'portalVideoBackground';
  video.setAttribute('aria-hidden', 'true');
  video.muted = true; video.defaultMuted = true; video.autoplay = true;
  video.loop = true; video.playsInline = true; video.preload = 'metadata';
  video.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;object-fit:cover;object-position:center;z-index:-1;pointer-events:none;opacity:.48;background:#080b11';
  const source = document.createElement('source');
  source.src = new URL('background.mp4', document.baseURI).href;
  source.type = 'video/mp4';
  video.appendChild(source);
  document.body.prepend(video);
  const start = () => video.play().catch(() => {});
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once:true});
  else start();
})();
