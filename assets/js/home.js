// Sucy — home minorista
(function () {
  "use strict";

  /* ---------- Hero: el video del dron avanza con el scroll ---------- */
  var hero = document.querySelector(".hero-scroll");
  var video = document.getElementById("dron");
  var steps = document.querySelectorAll(".hero-steps li");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasVideo = false;

  if (video) {
    video.addEventListener("loadedmetadata", function () {
      hasVideo = true;
      document.querySelector(".hero-frame .poster").style.display = "none";
      if (reduce) { video.loop = true; video.play().catch(function () {}); }
    });
    video.addEventListener("error", function () { video.style.display = "none"; }, true);
  }

  function progress() {
    var r = hero.getBoundingClientRect();
    var total = hero.offsetHeight - window.innerHeight;
    return Math.min(1, Math.max(0, -r.top / (total || 1)));
  }
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var p = progress();
      var idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
      steps.forEach(function (li, i) { li.classList.toggle("on", i === idx); });
      if (hasVideo && !reduce && video.duration) {
        video.currentTime = p * (video.duration - 0.05);
      }
    });
  }
  if (hero) { window.addEventListener("scroll", onScroll, { passive: true }); onScroll(); }

  /* ---------- Tour 360 (maqueta de paradas) ---------- */
  var SALAS = [
    { nombre: "Ingreso", texto: "Donde llega la verdura recién cosechada del campo." },
    { nombre: "Lavado", texto: "Las tres etapas del triple lavado." },
    { nombre: "Corte", texto: "Corte y mezcla de cada ensalada." },
    { nombre: "Envasado", texto: "Envasado y etiquetado con trazabilidad." },
    { nombre: "Cámara de frío", texto: "Donde espera hasta subir al camión." }
  ];
  var paradas = document.querySelector("#tour .paradas");
  if (paradas) {
    SALAS.forEach(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.textContent = String(i + 1).padStart(2, "0") + " · " + s.nombre;
      b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
      b.addEventListener("click", function () { elegirSala(i); });
      paradas.appendChild(b);
    });
  }
  function elegirSala(i) {
    document.querySelectorAll("[data-sala-nombre]").forEach(function (el) { el.textContent = SALAS[i].nombre; });
    document.querySelector("[data-sala-texto]").textContent = SALAS[i].texto;
    paradas.querySelectorAll("button").forEach(function (b, j) { b.setAttribute("aria-pressed", j === i ? "true" : "false"); });
  }
  if (paradas) elegirSala(0);

  /* ---------- Ensaladas: carrusel + ficha ---------- */
  var ENSALADAS = [
    { nombre: "Primavera", linea: "Gourmet", color: "var(--salvia)", img: "primavera.jpg", ings: ["Zanahoria", "Arvejas", "Lechuga", "Tomate cherry", "Queso", "Jamón"] },
    { nombre: "Duquesa", linea: "Gourmet", color: "var(--durazno)", img: "duquesa.jpg", ings: ["Rúcula", "Jamón crudo", "Queso", "Tomate cherry"] },
    { nombre: "París", linea: "Gourmet", color: "var(--lima)", img: "paris.jpg", ings: ["Lechuga", "Repollo", "Zanahoria", "Tomate cherry", "Morrón"] },
    { nombre: "Sol de Verano", linea: "Gourmet", color: "var(--menta)", img: "solverano.jpg", ings: ["Lechuga", "Arvejas", "Tomate", "Zanahoria"] },
    { nombre: "Aceitunas", linea: "Gourmet", color: "var(--durazno)", img: "aceitunas.jpg", ings: ["Acelga", "Zanahoria", "Remolacha", "Aceitunas", "Arvejas", "Morrón"] },
    { nombre: "Mixta Omega", linea: "Prácticas", color: "var(--salvia)", img: "omega.jpg", ings: ["Acelga", "Remolacha", "Repollo blanco", "Repollo colorado"] }
  ];
  var carrusel = document.getElementById("carrusel");
  var ficha = document.getElementById("ficha");
  if (carrusel) {
    ENSALADAS.forEach(function (e, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "ens";
      b.style.background = e.color;
      b.setAttribute("aria-label", "Ver la ensalada " + e.nombre);
      b.innerHTML =
        '<span class="foto"><img src="/assets/img/' + e.img + '" alt="" loading="lazy"></span>' +
        '<span class="label" style="font-size:12px">' + e.linea + "</span>" +
        '<span class="nombre">' + e.nombre + "</span>" +
        '<span class="ver">Ver qué tiene<span class="mas"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span></span>';
      b.addEventListener("click", function () { abrirFicha(i); });
      carrusel.appendChild(b);
    });
  }
  function abrirFicha(i) {
    var e = ENSALADAS[i];
    document.getElementById("ficha-img").src = "/assets/img/" + e.img;
    document.getElementById("ficha-img").alt = "Ensalada " + e.nombre;
    document.getElementById("ficha-linea").textContent = e.linea;
    document.getElementById("ficha-nombre").textContent = e.nombre;
    var ings = document.getElementById("ficha-ings");
    ings.innerHTML = "";
    e.ings.forEach(function (t) { var s = document.createElement("span"); s.textContent = t; ings.appendChild(s); });
    if (ficha.showModal) ficha.showModal(); else ficha.setAttribute("open", "");
  }
  if (ficha) {
    ficha.querySelectorAll("[data-cerrar]").forEach(function (el) { el.addEventListener("click", function () { ficha.close(); }); });
    ficha.addEventListener("click", function (ev) { if (ev.target === ficha) ficha.close(); });
  }

  /* ---------- Mapa: búsqueda de prueba ---------- */
  // TODO: reemplazar por la base real de puntos de venta y geolocalización.
  var COMERCIOS = [
    { nombre: "Comercio de ejemplo 1", dir: "Barrio General Paz", km: "0,6 km" },
    { nombre: "Comercio de ejemplo 2", dir: "Barrio Alberdi", km: "1,1 km" },
    { nombre: "Supermercado de ejemplo", dir: "Nueva Córdoba", km: "1,8 km" }
  ];
  var form = document.getElementById("buscar");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var lista = document.getElementById("res-lista");
      lista.innerHTML = "";
      COMERCIOS.forEach(function (c) {
        var li = document.createElement("li");
        li.innerHTML = "<span><b></b><span></span></span><span class=\"km\"></span>";
        li.querySelector("b").textContent = c.nombre;
        li.querySelector("span span").textContent = c.dir;
        li.querySelector(".km").textContent = c.km;
        lista.appendChild(li);
      });
      document.getElementById("res").hidden = false;
    });
  }
})();
