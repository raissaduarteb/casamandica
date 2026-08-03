/* ============ Casa Mandica — Landing 2026 ============ */
(function () {
  "use strict";
  var P = "photos/";

  var SPACES = {
    casa: {
      title: "Casa de Operações",
      shots: [
        { src: P + "casa-fachada.jpg", cap: "Fachada colonial e varanda" },
        {
          src: P + "casa-varanda-colunas.jpg",
          cap: "Colunas e jardim de espadas-de-são-jorge",
        },
        {
          src: P + "casa-varanda-clara.jpg",
          cap: "Varanda e caminho arborizado",
        },
        {
          src: P + "casa-varanda-jardim.jpg",
          cap: "Vista da varanda para o quintal",
        },
      ],
    },
    ceu: {
      title: "Espaço Céu",
      shots: [
        { src: P + "ceu-arcos-casa.jpg", cap: "Arcos de pedra e gramado" },
        { src: P + "ceu-arcos-palmeira.jpg", cap: "Arcos entre as palmeiras" },
        {
          src: P + "ceu-luzes-gramado.jpg",
          cap: "Varais de luz sobre o gramado",
        },
        {
          src: P + "ceu-lampiao.jpg",
          cap: "Lampião de ferro na parede de pedra",
        },
      ],
    },
    quintal: {
      title: "Quintal Mandica",
      shots: [
        {
          src: P + "quintal-casinha-escorregador.jpg",
          cap: "Casa na árvore e escorregadores",
        },
        {
          src: P + "quintal-brinquedos.jpg",
          cap: "Brinquedos sob as mangueiras",
        },
        {
          src: P + "quintal-escorregadores.jpg",
          cap: "Escorregadores coloridos",
        },
        { src: P + "quintal-tunel-azul.jpg", cap: "Túnel de obstáculos" },
        {
          src: P + "quintal-escorregador-verde.jpg",
          cap: "Escorregador e redes",
        },
        { src: P + "quintal-rede.jpg", cap: "Cama de rede entre as árvores" },
      ],
    },
  };

  function ce(t, c, h) {
    var e = document.createElement(t);
    if (c) e.className = c;
    if (h != null) e.innerHTML = h;
    return e;
  }
  function imgEl(src, alt) {
    var i = new Image();
    i.src = src;
    i.alt = alt || "";
    i.loading = "lazy";
    return i;
  }

  var y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  /* ---------- nav ---------- */
  var nav = null,
    hero = null;
  function getHeroStateClass() {
    if (!hero) return null;
    return hero.id === "topo" ? "at-top" : "at-hero";
  }
  function onScroll() {
    if (!nav) return;
    var sc = window.scrollY > 24;
    nav.classList.toggle("scrolled", sc);
    if (hero) {
      var b = hero.offsetTop + hero.offsetHeight - 90;
      var stateClass = getHeroStateClass();
      /* o estado depende só da rolagem: abrir o menu no topo não pode tirar o
         at-top, senão a logo perde o filtro que a deixa branca sobre o hero */
      var atTop = !sc && window.scrollY < b;
      if (stateClass) {
        nav.classList.toggle(stateClass, atTop);
        ["at-top", "at-hero"].forEach(function (cls) {
          if (cls !== stateClass) nav.classList.remove(cls);
        });
      }
    } else {
      nav.classList.remove("at-top", "at-hero");
    }
  }
  function initNav() {
    nav = document.getElementById("nav");
    hero =
      document.getElementById("topo") || document.querySelector(".ev-hero");
    if (!nav) return;

    var tgl = document.getElementById("navToggle"),
      lnk = document.getElementById("navLinks");
    function closeMenu() {
      if (!lnk || !nav) return;
      lnk.classList.remove("open");
      nav.classList.remove("menu-open");
      document.querySelectorAll(".nav-dd.dd-open").forEach(function (d) {
        d.classList.remove("dd-open");
      });
      onScroll();
    }
    if (tgl && lnk) {
      tgl.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = lnk.classList.toggle("open");
        nav.classList.toggle("menu-open", open);
        if (!open) closeMenu();
      });
      lnk.addEventListener("click", function (e) {
        if (e.target.tagName === "A") {
          closeMenu();
        }
      });
      document.addEventListener("click", function (e) {
        if (lnk.classList.contains("open") && nav && !nav.contains(e.target)) {
          closeMenu();
        }
      });
    }
  }
  function attachHeaderControls() {
    var ddTrigger = document.querySelector(".nav-dd-trigger");
    if (ddTrigger) {
      ddTrigger.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var dd = this.closest(".nav-dd");
        if (dd) {
          var isOpen = dd.classList.toggle("dd-open");
          document
            .querySelectorAll(".nav-dd.dd-open")
            .forEach(function (other) {
              if (other !== dd) other.classList.remove("dd-open");
            });
        }
      });

      document.addEventListener("click", function (e) {
        var dd = e.target.closest && e.target.closest(".nav-dd");
        if (!dd && ddTrigger) {
          document.querySelectorAll(".nav-dd.dd-open").forEach(function (d) {
            d.classList.remove("dd-open");
          });
        }
      });
    }

    var ddMenu = document.getElementById("navEvents");
    if (ddMenu && window.CASA_EVENTS) {
      ddMenu.innerHTML = "";
      window.CASA_EVENTS.forEach(function (ev) {
        var a = document.createElement("a");
        a.href = "evento.html?tipo=" + ev.slug;
        a.textContent = ev.name;
        ddMenu.appendChild(a);
      });
    }
  }

  var headerPlaceholder = document.getElementById("header");
  if (headerPlaceholder) {
    fetch("header.html")
      .then(function (response) {
        return response.text();
      })
      .then(function (data) {
        headerPlaceholder.innerHTML = data;
        initNav();
        attachHeaderControls();
        onScroll();
      })
      .catch(function (error) {
        console.warn("Falha ao carregar header:", error);
        initNav();
      });
  } else {
    initNav();
    attachHeaderControls();
  }

  /* ---------- space media ---------- */
  document.querySelectorAll(".espaco-media[data-space]").forEach(function (m) {
    var key = m.getAttribute("data-space"),
      g = SPACES[key];
    if (!g) return;
    var stack = ce("div", "em-stack");
    var main = ce("div", "em-main archtop");
    var pm = ce("div", "ph-img");
    pm.setAttribute("data-space", key);
    pm.setAttribute("data-i", "0");
    pm.appendChild(imgEl(g.shots[0].src, g.title));
    pm.appendChild(badge(g.shots.length));
    main.appendChild(pm);
    stack.appendChild(main);
    for (var t = 1; t <= 2; t++) {
      var th = ce("div", "em-thumb"),
        p = ce("div", "ph-img");
      p.setAttribute("data-space", key);
      p.setAttribute("data-i", String(t));
      p.appendChild(imgEl(g.shots[t].src, g.title));
      if (t === 2 && g.shots.length > 3) {
        p.appendChild(ce("div", "more", "+" + (g.shots.length - 3)));
      }
      th.appendChild(p);
      stack.appendChild(th);
    }
    m.appendChild(stack);
  });
  function badge(n) {
    return ce(
      "div",
      "gallery-badge",
      '<svg class="ic" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg> Ver galeria · ' +
        n,
    );
  }

  /* ---------- event cards ---------- */
  var grid = document.getElementById("eventGrid");
  if (grid && window.CASA_EVENTS) {
    window.CASA_EVENTS.forEach(function (ev) {
      var a = document.createElement("a");
      a.className = "event-card reveal";
      a.href = "evento.html?tipo=" + ev.slug;
      a.appendChild(imgEl(ev.cover, ev.name));
      a.appendChild(ce("div", "ev-grad"));
      a.appendChild(
        ce(
          "div",
          "ev-label",
          '<div class="ev-name">' +
            ev.name +
            '</div><div class="ev-go">Ver galeria <span class="ar"></span></div>',
        ),
      );
      grid.appendChild(a);
    });
  }

  /* ---------- depoimentos carousel ---------- */
  var depoSlider = document.querySelector(".depo-grid");
  if (depoSlider) {
    var depoCards = [].slice.call(depoSlider.querySelectorAll(".depo-card"));
    var depoViewport = depoSlider.closest(".depo-viewport");
    var depoPrev = document.querySelector(".depo-prev");
    var depoNext = document.querySelector(".depo-next");
    var depoIndex = 0;
    function getNearestDepoIndex() {
      var left = depoSlider.scrollLeft;
      var center = left + depoSlider.clientWidth / 2;
      var closest = 0;
      var minDiff = Infinity;
      depoCards.forEach(function (card, i) {
        var cardCenter = card.offsetLeft + card.offsetWidth / 2;
        var diff = Math.abs(cardCenter - center);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      });
      return closest;
    }
    function getCardsPerPage() {
      return window.innerWidth >= 960 ? 3 : 1;
    }
    function getPageStartIndex(index) {
      var perPage = getCardsPerPage();
      return Math.floor(index / perPage) * perPage;
    }
    function getPrevPageIndex() {
      var perPage = getCardsPerPage();
      return Math.max(0, getPageStartIndex(getNearestDepoIndex()) - perPage);
    }
    function getNextPageIndex() {
      var perPage = getCardsPerPage();
      return Math.min(
        getPageStartIndex(getNearestDepoIndex()) + perPage,
        Math.max(0, depoCards.length - perPage),
      );
    }
    /* setas e degradês andam juntos: cada lado só fica ativo enquanto sobrar
       depoimento para aquele lado */
    function updateDepoEdgeClass() {
      var maxScroll = depoSlider.scrollWidth - depoSlider.clientWidth;
      var atStart = depoSlider.scrollLeft <= 2;
      var atEnd = maxScroll <= 2 || depoSlider.scrollLeft >= maxScroll - 2;
      if (depoViewport) {
        depoViewport.classList.toggle("can-prev", !atStart);
        depoViewport.classList.toggle("can-next", !atEnd);
      }
      if (depoPrev) depoPrev.disabled = atStart;
      if (depoNext) depoNext.disabled = atEnd;
    }
    function depoScrollTo(index) {
      if (index < 0) index = 0;
      var perPage = getCardsPerPage();
      var lastPageStart = Math.max(0, depoCards.length - perPage);
      if (index > lastPageStart) index = lastPageStart;
      depoIndex = index;
      depoSlider.scrollTo({
        left: depoCards[depoIndex].offsetLeft,
        behavior: "smooth",
      });
      updateDepoEdgeClass();
    }
    if (depoPrev) {
      depoPrev.addEventListener("click", function () {
        depoScrollTo(getPrevPageIndex());
      });
    }
    if (depoNext) {
      depoNext.addEventListener("click", function () {
        depoScrollTo(getNextPageIndex());
      });
    }
    depoSlider.addEventListener("scroll", function () {
      window.requestAnimationFrame(function () {
        depoIndex = getNearestDepoIndex();
        updateDepoEdgeClass();
      });
    });
    window.addEventListener("resize", function () {
      updateDepoEdgeClass();
    });
    window.addEventListener("load", updateDepoEdgeClass);
    depoScrollTo(0);
  }

  /* ---------- lightbox (spaces) ---------- */
  var lb = document.getElementById("lightbox"),
    lbImg = document.getElementById("lbImg"),
    lbTitle = document.getElementById("lbTitle"),
    lbCount = document.getElementById("lbCount");
  var ST = { list: [], i: 0 };
  function lbRender() {
    var s = ST.list[ST.i];
    if (!s) return;
    lbImg.src = s.src;
    lbImg.alt = s.cap || "";
    if (lbTitle) lbTitle.textContent = s.cap || "";
    if (lbCount) lbCount.textContent = ST.i + 1 + " / " + ST.list.length;
  }
  function lbOpen(list, i) {
    ST.list = list;
    ST.i = i || 0;
    lbRender();
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function lbClose() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function lbStep(d) {
    ST.i = (ST.i + d + ST.list.length) % ST.list.length;
    lbRender();
  }
  window.CasaLightbox = { open: lbOpen };
  document.addEventListener("click", function (e) {
    var sp =
      e.target.closest &&
      e.target.closest(
        ".espaco-media [data-space][data-i], .feat[data-space][data-i]",
      );
    if (sp) {
      var g = SPACES[sp.getAttribute("data-space")];
      if (g) lbOpen(g.shots, parseInt(sp.getAttribute("data-i"), 10) || 0);
    }
  });
  if (lb) {
    document.getElementById("lbClose").addEventListener("click", lbClose);
    document.getElementById("lbPrev").addEventListener("click", function () {
      lbStep(-1);
    });
    document.getElementById("lbNext").addEventListener("click", function () {
      lbStep(1);
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lb-stage")) lbClose();
    });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") lbClose();
      else if (e.key === "ArrowLeft") lbStep(-1);
      else if (e.key === "ArrowRight") lbStep(1);
    });
  }

  /* ---------- reveal ---------- */
  var rev = [].slice.call(document.querySelectorAll(".reveal"));
  document.querySelectorAll("[data-stagger]").forEach(function (p) {
    var n = 0;
    [].forEach.call(p.children, function (c) {
      if (c.classList && c.classList.contains("reveal")) {
        c.style.transitionDelay = n * 0.09 + "s";
        n++;
      }
    });
  });
  function check() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = rev.length - 1; i >= 0; i--) {
      var r = rev[i].getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        rev[i].classList.add("in");
        rev.splice(i, 1);
      }
    }
  }

  /* ---------- hero parallax ---------- */
  var para = [].slice.call(document.querySelectorAll("[data-parallax]"));
  function applyPara() {
    var sy = window.scrollY;
    para.forEach(function (el) {
      var sp = parseFloat(el.getAttribute("data-parallax")) || 0;
      el.style.transform = "translate3d(0," + sy * sp + "px,0)";
    });
  }

  /* ---------- share tour ---------- */
  var share = document.getElementById("shareTour");
  if (share) {
    var tourUrl = new URL("tour.html", location.href).href;
    share.addEventListener("click", async function () {
      var data = {
        title: "Tour Virtual — Casa Mandica",
        text: "Conheça a Casa Mandica em 360°",
        url: tourUrl,
      };
      if (navigator.share) {
        try {
          await navigator.share(data);
        } catch (e) {}
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(tourUrl);
          var o = share.querySelector(".lbl") || share;
          var prev = o.textContent;
          o.textContent = "Link copiado ✓";
          setTimeout(function () {
            o.textContent = prev;
          }, 2200);
        } catch (e) {
          window.prompt("Copie o link do tour:", tourUrl);
        }
      } else window.prompt("Copie o link do tour:", tourUrl);
    });
  }

  window.addEventListener(
    "scroll",
    function () {
      onScroll();
      check();
      applyPara();
    },
    { passive: true },
  );
  window.addEventListener("resize", check);
  window.addEventListener("load", function () {
    check();
    applyPara();
  });
  onScroll();
  check();
  applyPara();
  setTimeout(check, 120);
  setTimeout(check, 500);
})();
