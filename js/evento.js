/* ============ Casa Mandica — event page ============ */
(function () {
  "use strict";
  var events = window.CASA_EVENTS || [];
  var params = new URLSearchParams(location.search);
  var slug = params.get("tipo");
  var ev =
    events.filter(function (e) {
      return e.slug === slug;
    })[0] || events[0];

  document.title = ev.name + " — Casa Mandica";

  function set(id, txt) {
    var el = document.getElementById(id);
    if (el) el.textContent = txt;
  }
  set("evTitle", ev.name);
  set("evTag", ev.tagline);
  set("evCtaTitle", "Realize o seu evento aqui");

  /* Mosaico para qualquer quantidade de fotos. A grade tem 4 colunas e as
     fotos são divididas em blocos; cada bloco preenche um retângulo inteiro
     (sem buracos) e os blocos de 6 alternam entre dois desenhos para a galeria
     não ficar repetitiva. Sobras de 1 ou 2 fotos não ficam sozinhas: o último
     bloco de 6 é redividido (6+1 → 4+3, 6+2 → 4+4). Cada item é [colunas, linhas]. */
  var BLOCKS = {
    6: [
      // grande à esquerda, faixa em cima, duas verticais, dois quadrados
      [[2, 2], [2, 1], [1, 2], [1, 2], [1, 1], [1, 1]],
      // duas verticais, grande à direita, dois quadrados e uma faixa
      [[1, 2], [1, 2], [2, 2], [1, 1], [1, 1], [2, 1]],
    ],
    5: [[2, 2], [2, 2], [2, 1], [1, 1], [1, 1]],
    4: [[2, 2], [2, 1], [1, 1], [1, 1]],
    3: [[2, 2], [2, 1], [2, 1]],
    2: [[2, 2], [2, 2]],
    1: [[4, 2]],
  };
  function mosaicSpans(n) {
    var sizes = [];
    var rest = n;
    while (rest > 0) {
      if (rest === 7) sizes.push(4, 3), (rest = 0);
      else if (rest === 8) sizes.push(4, 4), (rest = 0);
      else {
        var s = Math.min(6, rest);
        sizes.push(s);
        rest -= s;
      }
    }
    var out = [];
    var six = 0;
    sizes.forEach(function (s) {
      var pattern = s === 6 ? BLOCKS[6][six++ % 2] : BLOCKS[s];
      out = out.concat(pattern);
    });
    return out;
  }

  /* gallery */
  var grid = document.getElementById("galleryGrid");
  if (grid && ev.shots && ev.shots.length) {
    var spans = mosaicSpans(ev.shots.length);
    /* crédito da foto: o da própria foto, senão o padrão do evento */
    var shots = ev.shots.map(function (s) {
      var credit = s.credit != null ? s.credit : ev.credit || "";
      var url = s.credit != null ? s.creditUrl || "" : ev.creditUrl || "";
      return {
        src: s.src,
        cap: s.cap,
        credit: credit,
        creditUrl: credit ? url : "",
      };
    });
    shots.forEach(function (shot, i) {
      var d = document.createElement("div");
      d.className = "g";
      d.style.gridColumn = "span " + spans[i][0];
      d.style.gridRow = "span " + spans[i][1];
      var img = document.createElement("img");
      img.src = shot.src;
      img.alt = shot.cap || "";
      img.loading = "lazy";
      d.appendChild(img);
      var zoom = document.createElement("span");
      zoom.className = "zoom";
      zoom.setAttribute("aria-hidden", "true");
      zoom.innerHTML = "&#10530;";
      d.appendChild(zoom);
      if (shot.credit) {
        var cr = document.createElement("span");
        cr.className = "g-credit";
        cr.textContent = "Foto: " + shot.credit;
        d.appendChild(cr);
      }
      d.addEventListener("click", function () {
        if (window.CasaLightbox) window.CasaLightbox.open(shots, i);
      });
      grid.appendChild(d);
    });
  }

  /* other event types */
  var others = document.getElementById("othersGrid");
  if (others) {
    events.forEach(function (e) {
      if (e.slug === ev.slug) return;
      var a = document.createElement("a");
      a.href = "evento.html?tipo=" + e.slug;
      a.textContent = e.name;
      others.appendChild(a);
    });
  }

  window.scrollTo(0, 0);
})();
