/* IndiFrame Help Desk — interaction layer inspired by the supplied G-Core motion reference.
   No video playback, no data/API/auth changes. */
(() => {
  if (window.__ifInteractionsReady) return;
  window.__ifInteractionsReady = true;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cardSelector = '.card,.section.card,.break-card,.stat-card,.admin-module-card,.cp-card,.project-card,.sa-card,.admin-detail-bar,.metric-card';
  const bindCards = () => {
    document.querySelectorAll(cardSelector).forEach(card => {
      if (card.dataset.ifMotionBound) return;
      card.dataset.ifMotionBound = '1';
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--if-pointer-x', (e.clientX-r.left)+'px');
        card.style.setProperty('--if-pointer-y', (e.clientY-r.top)+'px');
      }, {passive:true});
    });
  };
  const reveal = () => {
    if (reduce || !('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll('.card,.section.card,.break-card,.stat-card,.admin-module-card,.cp-card,.project-card,.sa-card');
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if(entry.isIntersecting){entry.target.classList.add('if-visible');io.unobserve(entry.target)}
    }),{threshold:.08,rootMargin:'0px 0px -24px 0px'});
    targets.forEach((el,i) => { if(!el.classList.contains('if-reveal')){el.classList.add('if-reveal');el.style.transitionDelay=(Math.min(i%5,4)*45)+'ms'} io.observe(el); });
  };
  const init = () => { bindCards(); reveal(); };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
  const observer = new MutationObserver(() => { bindCards(); reveal(); });
  observer.observe(document.body,{childList:true,subtree:true});
  setTimeout(() => observer.disconnect(),12000);
})();
