/* IndiFrame Help Desk interaction + page transition layer. Visual-only; no API contract changes. */
(() => {
  if (window.__ifInteractionsReady) return;
  window.__ifInteractionsReady = true;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cardSelector = '.card,.section.card,.break-card,.stat-card,.admin-module-card,.cp-card,.project-card,.sa-card,.admin-detail-bar,.metric-card';
  const bindCards = () => document.querySelectorAll(cardSelector).forEach(card => {
    if(card.dataset.ifMotionBound)return;card.dataset.ifMotionBound='1';
    card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--if-pointer-x',(e.clientX-r.left)+'px');card.style.setProperty('--if-pointer-y',(e.clientY-r.top)+'px')},{passive:true});
  });
  const reveal = () => {
    if(reduce||!('IntersectionObserver'in window))return;
    const targets=document.querySelectorAll('.card,.section.card,.break-card,.stat-card,.admin-module-card,.cp-card,.project-card,.sa-card');
    const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('if-visible');io.unobserve(entry.target)}}),{threshold:.06,rootMargin:'0px 0px -18px 0px'});
    targets.forEach((el,i)=>{if(!el.classList.contains('if-reveal')){el.classList.add('if-reveal');el.style.transitionDelay=(Math.min(i%4,3)*35)+'ms'}io.observe(el)});
  };
  const setupLoader=()=>{
    if(document.getElementById('ifPageLoader'))return;
    const overlay=document.createElement('div');overlay.id='ifPageLoader';overlay.className='if-page-loader';overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');
    overlay.innerHTML='<div class="if-loader-card"><div class="if-loader-symbol"><span></span><span></span><span></span><span></span></div><div class="if-loader-brand">INDIFRAME</div><div class="if-loader-title">Preparing your workspace</div><div class="if-loader-sub">Precision in every detail</div><div class="if-loader-track"><i></i></div></div>';
    document.body.appendChild(overlay);document.body.classList.add('if-loading');
    let finished=false,requests=0,hideTimer;
    const hide=()=>{if(finished)return;finished=true;document.body.classList.remove('if-loading');overlay.classList.add('if-loader-done');setTimeout(()=>overlay.remove(),550)};
    const initial=()=>{clearTimeout(hideTimer);hideTimer=setTimeout(hide,reduce?100:720)};
    if(document.readyState==='complete')initial();else window.addEventListener('load',initial,{once:true});
    setTimeout(hide,4500);
    if(window.fetch&&!window.__ifFetchWrapped){
      const original=window.fetch.bind(window);window.__ifFetchWrapped=true;
      window.fetch=(...args)=>{
        requests++;overlay.classList.remove('if-loader-done');overlay.style.display='grid';document.body.classList.add('if-loading');
        return original(...args).finally(()=>{requests=Math.max(0,requests-1);if(requests===0){clearTimeout(hideTimer);hideTimer=setTimeout(()=>{if(finished){document.body.classList.remove('if-loading');overlay.classList.add('if-loader-done');setTimeout(()=>{if(overlay.isConnected)overlay.style.display='none'},500)}else hide()},220)}});
      };
    }
  };
  const init=()=>{bindCards();reveal();setupLoader();if(document.body.classList.contains('admin-mode'))document.body.classList.add('if-admin');else if(location.pathname.endsWith('dashboard.html'))document.body.classList.add('if-agent');if(location.pathname.endsWith('superadmin.html'))document.body.classList.add('if-superadmin')};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
  const observer=new MutationObserver(()=>{bindCards();reveal();if(document.body.classList.contains('admin-mode')){document.body.classList.remove('if-agent');document.body.classList.add('if-admin')}});
  const startObserver=()=>observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startObserver,{once:true});else startObserver();
  setTimeout(()=>observer.disconnect(),20000);
})();
