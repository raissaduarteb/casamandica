/* ============ Casa Mandica — interactions ============ */
(function(){
  'use strict';

  document.documentElement.classList.add('js');

  /* ---- year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- nav: scrolled + at-hero state ---- */
  var nav = document.getElementById('nav');
  var hero = document.getElementById('topo') || document.querySelector('.ev-hero');
  function onScroll(){
    if (!nav) return;
    var sc = window.scrollY > 30;
    nav.classList.toggle('scrolled', sc);
    if (hero){
      var heroBottom = hero.offsetTop + hero.offsetHeight - 80;
      nav.classList.toggle('at-hero', !sc && window.scrollY < heroBottom);
    }
  }

  /* ---- mobile menu ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  function closeMenu(){
    links.classList.remove('open');
  }
  if (toggle && links){
    toggle.addEventListener('click', function(e){
      e.stopPropagation();
      links.classList.toggle('open');
    });
    links.addEventListener('click', function(e){
      if (e.target.tagName === 'A') closeMenu();
    });
    document.addEventListener('click', function(e){
      if (links.classList.contains('open') && nav && !nav.contains(e.target)) closeMenu();
    });
  }

  /* ---- stagger: delay reveal children inside [data-stagger] ---- */
  [].forEach.call(document.querySelectorAll('[data-stagger]'), function(p){
    var n = 0;
    [].forEach.call(p.children, function(c){
      if (c.classList && c.classList.contains('reveal')){ c.style.transitionDelay = (n * 0.1) + 's'; n++; }
    });
  });

  /* ---- reveal on scroll (manual check — robust across preview iframes) ---- */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal'));
  function addReveal(el, delay){
    if (delay) el.style.transitionDelay = delay + 's';
    revealEls.push(el);
  }
  function checkReveal(){
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = revealEls.length - 1; i >= 0; i--){
      var el = revealEls[i];
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0){
        el.classList.add('in');
        revealEls.splice(i, 1);
      }
    }
  }

  /* ---- event grid (with staggered entrance) ---- */
  var grid = document.getElementById('eventGrid');
  if (grid && window.CASA_EVENTS){
    window.CASA_EVENTS.forEach(function(ev, i){
      var a = document.createElement('a');
      a.className = 'event-card reveal reveal-scale';
      a.href = 'evento.html?tipo=' + ev.slug;
      a.innerHTML =
        '<div class="ev-media ph" data-label="foto — ' + ev.short.toLowerCase() + '"></div>' +
        '<div class="ev-grad"></div>' +
        '<div class="ev-label">' +
          '<div class="ev-name">' + ev.name + '</div>' +
          '<div class="ev-go">Ver galeria &rarr;</div>' +
        '</div>';
      grid.appendChild(a);
      addReveal(a, (i % 4) * 0.07);
    });
  }

  /* ---- space galleries + lightbox ---- */
  var GAL = {
    casa:    { title:'Casa de Operações', shots:['varanda colonial','suíte exclusiva','lounge aconchegante','cozinha industrial','fachada da casa'] },
    ceu:     { title:'Espaço Céu',        shots:['arcos de entrada','palco sob caramanchões','área arborizada','mesas montadas','cerimônia ao entardecer'] },
    quintal: { title:'Quintal Mandica',   shots:['gramado amplo','brinquedos incríveis','área das crianças','vista geral','diversão garantida'] }
  };
  [].forEach.call(document.querySelectorAll('.espaco-media[data-gallery]'), function(m){
    var key = m.getAttribute('data-gallery');
    var g = GAL[key]; if (!g) return;
    var shots = g.shots;

    var main = document.createElement('button');
    main.type = 'button';
    main.className = 'espaco-main';
    main.setAttribute('data-gallery', key);
    main.setAttribute('data-index', '0');
    main.setAttribute('aria-label', 'Abrir galeria — ' + g.title);
    main.innerHTML =
      '<span class="ph-inner ph" data-label="foto — ' + g.title.toLowerCase() + ' · ' + shots[0] + '"></span>' +
      '<span class="zoom" aria-hidden="true">&#10530;</span>';
    m.appendChild(main);

    var tw = document.createElement('div');
    tw.className = 'espaco-thumbs';
    for (var t = 1; t <= 3; t++){
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'espaco-thumb ph no-cap';
      b.setAttribute('data-gallery', key);
      b.setAttribute('data-index', String(t));
      b.setAttribute('aria-label', g.title + ' — ver galeria');
      if (t === 3 && shots.length > 4){
        b.innerHTML = '<span class="more-badge">+' + (shots.length - 4) + '</span>';
      }
      tw.appendChild(b);
    }
    m.appendChild(tw);
  });

  var lb = document.getElementById('lightbox');
  if (lb){
    var lbFrame = document.getElementById('lbFrame');
    var lbTitle = document.getElementById('lbTitle');
    var lbCount = document.getElementById('lbCount');
    var st = { shots:[], title:'', i:0 };

    function lbRender(){
      var s = st.shots[st.i];
      lbFrame.setAttribute('data-label', 'foto — ' + st.title.toLowerCase() + ' · ' + s);
      lbTitle.textContent = s.charAt(0).toUpperCase() + s.slice(1);
      lbCount.textContent = (st.i + 1) + ' / ' + st.shots.length;
    }
    function lbOpen(key, index){
      var g = GAL[key]; if (!g) return;
      st.shots = g.shots; st.title = g.title; st.i = index || 0;
      lbRender();
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function lbClose(){
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    function lbStep(d){ st.i = (st.i + d + st.shots.length) % st.shots.length; lbRender(); }

    document.addEventListener('click', function(e){
      var trg = e.target.closest && e.target.closest('.espaco-media [data-gallery][data-index]');
      if (trg){ lbOpen(trg.getAttribute('data-gallery'), parseInt(trg.getAttribute('data-index'), 10) || 0); }
    });
    document.getElementById('lbClose').addEventListener('click', lbClose);
    document.getElementById('lbPrev').addEventListener('click', function(){ lbStep(-1); });
    document.getElementById('lbNext').addEventListener('click', function(){ lbStep(1); });
    lb.addEventListener('click', function(e){ if (e.target === lb || e.target.classList.contains('lb-stage')) lbClose(); });
    document.addEventListener('keydown', function(e){
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowLeft') lbStep(-1);
      else if (e.key === 'ArrowRight') lbStep(1);
    });
  }

  /* ---- parallax ---- */
  var paraEls = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var heroBg = document.querySelector('.hero-bg');
  var ticking = false;
  function applyPara(){
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = 0; i < paraEls.length; i++){
      var el = paraEls[i];
      var f = parseFloat(el.getAttribute('data-parallax')) || 0;
      var r = el.getBoundingClientRect();
      var center = (r.top + r.height / 2) - vh / 2;
      var ty = -center * f;
      el.style.transform = 'translate3d(0,' + ty.toFixed(1) + 'px,0)';
    }
    if (heroBg){
      var sy = window.scrollY || window.pageYOffset || 0;
      var cap = Math.min(sy, 760);
      var sc = 1.12 + cap * 0.00022;          /* gentle zoom-in */
      var hty = cap * 0.10;                    /* slow downward drift */
      heroBg.style.transform = 'translate3d(0,' + hty.toFixed(1) + 'px,0) scale(' + sc.toFixed(4) + ')';
    }
    ticking = false;
  }
  function reqPara(){ if (!ticking){ ticking = true; requestAnimationFrame(applyPara); } }

  /* ---- master scroll handler ---- */
  function onAnyScroll(){ onScroll(); checkReveal(); reqPara(); }
  window.addEventListener('scroll', onAnyScroll, {passive:true});
  window.addEventListener('resize', function(){ checkReveal(); reqPara(); });
  window.addEventListener('load', function(){ checkReveal(); applyPara(); });
  onScroll(); checkReveal(); applyPara();
  setTimeout(function(){ checkReveal(); applyPara(); }, 80);
  setTimeout(checkReveal, 450);

  /* ---- share tour ---- */
  var share = document.getElementById('shareTour');
  if (share){
    var tourUrl = new URL('tour.html', location.href).href;
    share.addEventListener('click', async function(){
      var data = { title:'Tour Virtual — Casa Mandica', text:'Conheça a Casa Mandica em 360°', url:tourUrl };
      if (navigator.share){
        try { await navigator.share(data); } catch(e){}
      } else if (navigator.clipboard){
        try {
          await navigator.clipboard.writeText(tourUrl);
          var t = share.textContent; share.textContent = 'Link copiado ✓';
          setTimeout(function(){ share.textContent = t; }, 2200);
        } catch(e){ window.prompt('Copie o link do tour:', tourUrl); }
      } else {
        window.prompt('Copie o link do tour:', tourUrl);
      }
    });
  }
})();
