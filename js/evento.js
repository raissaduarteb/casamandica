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

  /* gallery */
  var grid = document.getElementById("galleryGrid");
  if (grid && ev.shots && ev.shots.length) {
    grid.classList.add("count-" + ev.shots.length);
    ev.shots.forEach(function (shot, i) {
      var d = document.createElement("div");
      d.className = "g";
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
      d.addEventListener("click", function () {
        if (window.CasaLightbox) window.CasaLightbox.open(ev.shots, i);
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
