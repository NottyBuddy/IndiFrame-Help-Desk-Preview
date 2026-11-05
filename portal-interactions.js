/* IndiFrame page loader and motion layer. Keeps business/API logic unchanged. */
(() => {
 if(window.__ifInteractionsReady)return;window.__ifInteractionsReady=true;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let overlay,requestCount=0,initialDone=false,minimumDone=false,hideTimer;
 const makeLoader=()=>{
  if(overlay)return overlay;
  overlay=document.createElement('div');overlay.id='ifPageLoader';overlay.className='if-page-loader';overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');
  overlay.innerHTML='<div class="if-loader-card"><div class="if-loader-symbol"><span></span><span></span><span></span><span></span></div><div class="if-loader-brand">INDIFRAME</div><div class="if-loader-title">Preparing your workspace</div><div class="if-loader-sub">Precision in every detail</div><div class="if-loader-track"><i></i></div></div>';
  document.body.appendChild(overlay);return overlay;
 };
 const show=()=>{makeLoader();overlay.classList.remove('if-loader-done');document.body.classList.add('if-loading')};
 const hide=()=>{if(requestCount>0||!initialDone||!minimumDone)return;document.body.classList.remove('if-loading');overlay?.classList.add('if-loader-done')};
 const start=()=>{show();setTimeout(()=>{minimumDone=true;hide()},reduced?100:650)};
 const completeInitial=()=>{initialDone=true;hide()};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 if(document.readyState==='complete')completeInitial();else window.addEventListener('load',completeInitial,{once:true});
 setTimeout(()=>{initialDone=true;minimumDone=true;if(requestCount===0)hide()},6000);
 // Keep one overlay in DOM so later fetches can show it again. Concurrent requests are counted.
 if(window.fetch&&!window.__ifFetchWrapped){
  const nativeFetch=window.fetch.bind(window);window.__ifFetchWrapped=true;
  window.fetch=function(...args){
   requestCount++;show();
   return nativeFetch(...args).finally(()=>{requestCount=Math.max(0,requestCount-1);if(requestCount===0){if(initialDone)minimumDone=true;clearTimeout(hideTimer);hideTimer=setTimeout(hide,180)}});
  };
 }
 const bindCards=()=>document.querySelectorAll('.card,.section.card,.break-card,.stat-card,.admin-module-card,.cp-card,.project-card,.sa-card,.admin-detail-bar,.metric-card').forEach(el=>{
  if(el.dataset.ifMotionBound)return;el.dataset.ifMotionBound='1';
  el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--if-pointer-x',(e.clientX-r.left)+'px');el.style.setProperty('--if-pointer-y',(e.clientY-r.top)+'px')},{passive:true});
 });
 const reveal=()=>{if(reduced||!('IntersectionObserver'in window))return;const els=document.querySelectorAll('.card,.section.card,.break-card,.stat-card,.cp-card,.project-card,.sa-card');const io=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('if-visible');io.unobserve(x.target)}}),{threshold:.04});els.forEach((el,i)=>{el.classList.add('if-reveal');el.style.transitionDelay=(i%4*35)+'ms';io.observe(el)})};
 const init=()=>{makeLoader();bindCards();reveal();if(document.body.classList.contains('admin-mode'))document.body.classList.add('if-admin');if(location.pathname.endsWith('superadmin.html'))document.body.classList.add('if-superadmin')};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
 const mo=new MutationObserver(()=>{bindCards();if(document.body.classList.contains('admin-mode'))document.body.classList.add('if-admin')});
 mo.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});setTimeout(()=>mo.disconnect(),30000);
})();

/* Indinext house scene: rotate weather seasons and daylight/night ambience */
(() => {
 const scene=document.querySelector('.if-login-visual');if(!scene||scene.dataset.indinextCycle)return;
 scene.dataset.indinextCycle='1';
 const seasons=['clear','summer','rain','winter'];let season=0,night=false;
 const label=scene.querySelector('.if-weather-label');
 const paint=()=>{const state=night?'night':seasons[season];scene.dataset.season=state;if(label)label.textContent=(night?'NIGHT · ': 'DAY · ')+({clear:'MILD WEATHER',summer:'SUMMER · BRIGHT SUN',rain:'MONSOON · RAIN',winter:'WINTER · SNOWFALL'}[seasons[season]]||'MOONLIT SKY')};
 paint();
 setInterval(()=>{if(!night){season=(season+1)%seasons.length}else{night=false;season=(season+1)%seasons.length}paint()},12000);
 setInterval(()=>{night=!night;paint()},26000);
})();
