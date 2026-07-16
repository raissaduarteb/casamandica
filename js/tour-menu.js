/* Controla a faixa de nomes dos espaços que o 3DVista desenha no rodapé do tour.
 *
 * A faixa é uma linha só, de largura fixa (~911px com os nomes atuais). Numa
 * tela mais estreita ela corta o texto no meio, então aqui ela é escondida
 * quando não cabe. O tour.html mostra o botão "Escolha o espaço" no lugar; a
 * home só esconde, porque lá o tour é uma prévia com CTA de tela cheia.
 *
 * Por que mexer no DOM e não no player: `set('visible', false)` não governa
 * esses containers do skin, e os elementos só têm id numérico gerado em runtime
 * (sem classe ou atributo estável). Daí achar a barra pelo conteúdo, marcá-la
 * com um atributo e escondê-la por CSS — o `!important` é essencial, porque o
 * player reescreve o `style` inline a cada layout.
 *
 * Se mudar os nomes do menu no script.js, remeça MIN_WIDTH.
 */
window.TourMenu = (function () {
  var MIN_WIDTH = 930; /* 911 da faixa + folga */

  function findBar(doc) {
    var labels = doc.querySelectorAll("span");
    var lbl = null;
    for (var i = 0; i < labels.length; i++) {
      if (labels[i].textContent.trim() === "BANHEIROS") lbl = labels[i];
    }
    for (var n = lbl; n && n !== doc.body; n = n.parentElement) {
      if (n.getBoundingClientRect().height >= 100) return n;
    }
    return null;
  }

  /* Retorna true se a faixa ficou visível. */
  function apply(iframe) {
    var doc;
    try {
      doc = iframe.contentDocument;
    } catch (e) {
      return true;
    }
    if (!doc || !doc.body) return true;

    if (!doc.getElementById("tourMenuCss")) {
      var st = doc.createElement("style");
      st.id = "tourMenuCss";
      st.textContent = "[data-tour-hide]{display:none!important}";
      doc.head.appendChild(st);
    }

    /* uma vez escondida a barra tem altura 0, então findBar não a acha de novo */
    var bar = doc.querySelector("[data-tour-hide]") || findBar(doc);
    if (!bar) return true;

    var fits = iframe.getBoundingClientRect().width >= MIN_WIDTH;
    if (fits) bar.removeAttribute("data-tour-hide");
    else bar.setAttribute("data-tour-hide", "");
    return fits;
  }

  /* Roda quando o tour avisa que carregou e a cada resize/rotação. */
  function watch(iframe, onChange) {
    function run() {
      var fits = apply(iframe);
      if (onChange) onChange(fits);
    }
    window.addEventListener("message", function (e) {
      if (e.data === "tourLoaded") run();
    });
    window.addEventListener("resize", run);
    window.addEventListener("orientationchange", run);
    return run;
  }

  return { MIN_WIDTH: MIN_WIDTH, apply: apply, watch: watch };
})();
