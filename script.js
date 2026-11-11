(function () {
  var S = window.SITE;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Email links ---- */
  var mailto = "mailto:" + S.email + "?subject=" + encodeURIComponent(S.emailSubject) + "&body=" + encodeURIComponent(S.emailBody);
  document.querySelectorAll("[data-mailto]").forEach(function (a) { a.href = mailto; });

  /* ---- Socials ---- */
  /* Each link: label + arrow box. On hover the arrow slides out top-right and a twin slides in from bottom-left. */
  var ARROW = '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M3.5 10.5 10.5 3.5M4.5 3.5h6v6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function addLink(list, label, href, external) {
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.className = "link"; a.href = href;
    if (external) { a.target = "_blank"; a.rel = "noopener"; }
    a.innerHTML = '<span class="link__label"></span><span class="link__icon" aria-hidden="true"><span class="link__track">' + ARROW + ARROW + '</span></span>';
    a.firstChild.textContent = label;
    li.appendChild(a);
    list.appendChild(li);
  }
  var ul = document.getElementById("social");
  S.socials.forEach(function (s) { addLink(ul, s.label, s.url, true); });
  addLink(ul, "Email me", mailto, false);   // opens an email to S.email

  /* ---- Cursor dot (Aerra-style) ----
     Replaces the normal pointer (hidden via the has-dot class) and follows the mouse.
     The normal pointer is only hidden once the mouse has moved, so it never vanishes without a replacement. */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var dot = document.createElement("div");
    dot.className = "cursor-dot"; dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);
    var tx = -100, ty = -100, dx = -100, dy = -100, raf = 0;
    function follow() {
      var k = reduce ? 1 : 0.5;                        // light smoothing: it IS the pointer now, so it must keep up
      dx += (tx - dx) * k; dy += (ty - dy) * k;
      // Position uses the "translate" property (not "transform") so the press-shrink ("scale")
      // happens around the dot's own centre instead of pulling it toward the screen corner.
      dot.style.translate = dx + "px " + dy + "px";
      raf = (Math.abs(tx - dx) > 0.1 || Math.abs(ty - dy) > 0.1) ? requestAnimationFrame(follow) : 0;
    }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX; ty = e.clientY;
      if (!dot.classList.contains("on")) { dx = tx; dy = ty; dot.classList.add("on"); document.documentElement.classList.add("has-dot"); }
      if (!raf) raf = requestAnimationFrame(follow);
    }, { passive: true });
    function moveTo(e) { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(follow); }
    function release() { dot.classList.remove("down"); }
    document.addEventListener("pointerdown", function (e) { if (e.pointerType === "mouse") { moveTo(e); dot.classList.add("down"); } });
    ["pointerup", "pointercancel", "dragend"].forEach(function (n) { document.addEventListener(n, release); });
    // Leaving the window (e.g. an email link opens your mail app): hide the dot cleanly
    window.addEventListener("blur", function () { release(); dot.classList.remove("on"); });
    document.documentElement.addEventListener("mouseleave", function () { release(); dot.classList.remove("on"); });
    // Stop links and photos being dragged around, which freezes the dot mid-drag
    document.addEventListener("dragstart", function (e) { if (e.target.closest && e.target.closest("a, img, .tile-w")) e.preventDefault(); });
  }

  /* ---- About ---- */
  document.getElementById("about-intro").textContent = S.aboutIntro || "";
  var dl = document.getElementById("about-details");
  (S.aboutDetails || []).forEach(function (d) {
    var dt = document.createElement("dt"), dd = document.createElement("dd");
    dt.textContent = d.label + ":";
    if (d.link === "email") { var a = document.createElement("a"); a.href = mailto; a.textContent = d.value; dd.appendChild(a); }
    else dd.textContent = d.value;
    dl.appendChild(dt); dl.appendChild(dd);
  });

  /* ---- Services list ---- */
  var svc = document.getElementById("svc-list");
  (S.services || []).forEach(function (s, i) {
    var li = document.createElement("li");
    li.className = "svc__row";
    li.innerHTML = '<span class="svc__num" aria-hidden="true"></span><span class="svc__text"><span class="svc__title"></span><span class="svc__detail"></span></span><span class="svc__type"></span>';
    li.children[0].textContent = (i < 9 ? "0" : "") + (i + 1);
    li.querySelector(".svc__title").textContent = s.title;
    li.querySelector(".svc__detail").textContent = s.detail || "";
    li.querySelector(".svc__type").textContent = s.type || "";
    svc.appendChild(li);
  });
  document.getElementById("svc-note").textContent = S.servicesNote || "";
  if (S.servicesLink) addLink(document.getElementById("svc-cta"), S.servicesLink, mailto, false);

  /* ---- Portrait ---- */
  if (S.portrait) document.getElementById("avatar").style.backgroundImage = "url('" + S.portrait + "')";

  /* ---- Mobile menu ---- */
  var nav = document.getElementById("nav"), toggle = document.getElementById("nav-toggle");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  document.getElementById("nav-links").addEventListener("click", function () { setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* ---- Photo wheel ---- */
  /* A full circle of photos that slowly turns (spin speed is in styles.css, .wheel__spin).
     Size, spacing and position are the reference's exact measurements; tiles tilt with the curve.
     Desktop has 28 spots, phones 16. With fewer photos than spots, some photos repeat, and each
     repeat sits on the opposite side of the circle so both copies are never on screen together. */
  var hero = document.getElementById("hero"), wheel = document.getElementById("wheel"),
      spin = document.getElementById("spin");
  var photos = S.photos.length ? S.photos : [{ src: "" }];
  var built = 0;

  function makeTile(p) {
    var d = document.createElement("div");
    d.className = "tile" + (p.src ? "" : " tile--ph");
    if (p.src) {
      var img = new Image();
      img.src = p.src; img.alt = p.alt || ""; img.draggable = false; img.decoding = "async";
      d.appendChild(img);
    } else {
      d.textContent = "Your photo";
    }
    return d;
  }

  /* Decide which photo goes in each of the N spots: originals spread evenly, gaps filled with
     the photo sitting closest to the opposite side of the circle. Returns [{p, repeat}]. */
  function plan(N) {
    var n = Math.min(N, photos.length), slots = new Array(N), i, d, j, k, half = Math.floor(N / 2);
    for (i = 0; i < n; i++) slots[Math.floor(i * N / n)] = { p: i, repeat: false };
    for (i = 0; i < N; i++) {
      if (slots[i]) continue;
      for (d = 0; d < N; d++) {
        j = (i + half + d) % N; k = (i + half - d + N) % N;
        if (slots[j] && !slots[j].repeat) { slots[i] = { p: slots[j].p, repeat: true }; break; }
        if (slots[k] && !slots[k].repeat) { slots[i] = { p: slots[k].p, repeat: true }; break; }
      }
    }
    return slots;
  }

  function layout() {
    // Reference: desktop = 28 tiles of 99px on a 658px-radius circle centred 935px down;
    // phone = 16 tiles of 87px on a 340px-radius circle centred 542px down.
    var desk = hero.clientWidth >= 810;
    var R = desk ? 658 : 340, N = desk ? 28 : 16, size = desk ? 99 : 87, cy = desk ? 935 : 542;

    if (N !== built) {                                   // rebuild only when the spot count changes
      spin.innerHTML = "";
      plan(N).forEach(function (s) {
        var t = makeTile(photos[s.p]);
        if (s.repeat || !photos[s.p].src) t.setAttribute("aria-hidden", "true"); // screen readers hear each photo once
        spin.appendChild(t);
      });
      built = N;
    }
    wheel.style.top = cy + "px";

    // Phones: the whole circle is on screen, so centre the portrait + text block inside it
    // (desktop keeps the reference's fixed positions)
    var body = hero.querySelector(".hero__body");
    if (!desk) {
      hero.style.paddingTop = "0px";
      hero.style.paddingTop = Math.max(150, Math.round(cy - body.offsetHeight / 2)) + "px";
      // make the hero tall enough to show the whole circle, including a tile's corner as it turns past the bottom
      hero.style.minHeight = Math.ceil(cy + R + size * Math.SQRT1_2 + 24) + "px";
    } else { hero.style.paddingTop = ""; hero.style.minHeight = ""; }

    Array.prototype.forEach.call(spin.children, function (t, i) {
      t.style.width = t.style.height = size + "px";
      t.style.margin = (-size / 2) + "px 0 0 " + (-size / 2) + "px";
      t.style.transform = "rotate(" + (360 / N) * i + "deg) translateY(" + (-R) + "px)";
    });
  }
  layout();
  var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(layout, 80); });
  if (document.fonts) document.fonts.ready.then(layout);   // re-align once the font has loaded
  requestAnimationFrame(function () { wheel.classList.add("in"); });

  /* ---- Menu links scroll smoothly to their section ----
     Own animation (not the browser's built-in smooth scroll, which some browsers skip or cut short). */
  var scrollAnim = 0, scrollSafety = 0;
  function stopScroll() { cancelAnimationFrame(scrollAnim); clearTimeout(scrollSafety); }
  function scrollToY(y) {
    var start = window.scrollY, dist = y - start, t0 = performance.now();
    var dur = Math.min(900, Math.max(350, Math.abs(dist) * 0.5));
    stopScroll();
    if (reduce || Math.abs(dist) < 2) { window.scrollTo(0, y); return; }
    function frame() {
      var p = Math.min(1, (performance.now() - t0) / dur);
      var e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;   // ease in-out
      window.scrollTo(0, start + dist * e);
      if (p < 1) scrollAnim = requestAnimationFrame(frame);
    }
    scrollAnim = requestAnimationFrame(frame);
    // Safety net: if the browser pauses drawing mid-scroll, still land on the section
    scrollSafety = setTimeout(function () { stopScroll(); window.scrollTo(0, y); }, dur + 150);
  }
  // Stop the animation if the visitor scrolls themselves
  ["wheel", "touchstart", "keydown"].forEach(function (n) {
    window.addEventListener(n, stopScroll, { passive: true });
  });
  document.querySelectorAll('a[href^="#"]:not([data-mailto])').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1), target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      scrollToY(id === "top" ? 0 : target.getBoundingClientRect().top + window.scrollY);
      history.replaceState(null, "", id === "top" ? location.pathname : "#" + id);
    });
  });

  /* ---- Work cards ---- */
  var grid = document.getElementById("work-grid");
  function media(item, opts) {
    if (item.video) {
      var v = document.createElement("video");
      v.src = item.video; v.playsInline = true; v.setAttribute("playsinline", "");
      if (item.poster) v.poster = item.poster;   // still frame shown instantly while the video loads
      v.preload = "metadata";
      if (opts.loop) { v.muted = true; v.loop = true; v.setAttribute("aria-hidden", "true"); }
      else { v.controls = true; v.autoplay = true; v.loop = true; v.setAttribute("aria-label", item.alt || ""); }
      return v;
    }
    var img = new Image();
    img.src = item.src; img.alt = item.alt || ""; img.decoding = "async";
    if (opts.lazy) img.loading = "lazy";
    return img;
  }
  /* Every photo and video gets its own tile, arranged category by category (in the order of the
     groups in config.js). Each category starts with its own heading row: number, name and count. */
  var FLAT = [], TILES = [], groups = S.work || [];
  groups.forEach(function (w) { w.items.forEach(function (it) { FLAT.push({ item: it, group: w.title }); }); });

  // quick links under the WORK heading that jump to each category
  var jump = document.getElementById("work-jump");
  function slug(t) { return "cat-" + t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""); }
  groups.forEach(function (w, gi) {
    // heading row inside the wall
    var h = document.createElement("div");
    h.className = "wcat"; h.id = slug(w.title);
    h.innerHTML = '<span class="wcat__num"></span><h3 class="wcat__title"></h3><span class="wcat__count"></span>';
    h.children[0].textContent = (gi < 9 ? "0" : "") + (gi + 1);
    h.children[1].textContent = w.title;
    var nv = w.items.filter(function (x) { return x.video; }).length, np = w.items.length - nv;
    h.children[2].textContent = [np ? np + (np === 1 ? " photo" : " photos") : "", nv ? nv + (nv === 1 ? " video" : " videos") : ""].filter(Boolean).join(" · ");
    w._head = h;
    // quick link
    if (jump) {
      var a = document.createElement("a");
      a.href = "#" + h.id; a.className = "work__jump-link";
      a.innerHTML = '<span class="work__jump-num"></span><span></span>';
      a.firstChild.textContent = h.children[0].textContent;
      a.lastChild.textContent = w.title;
      (function (head) {
        a.addEventListener("click", function (e) {
          e.preventDefault();
          scrollToY(head.getBoundingClientRect().top + window.scrollY - 24);   // land just above the category heading
        });
      })(h);
      jump.appendChild(a);
    }
  });
  FLAT.forEach(function (f, fi) {
    var grp = groups.filter(function (g) { return g.title === f.group; })[0];
    if (grp && grp._head && !grp._head.parentNode) grid.appendChild(grp._head);   // heading before its first tile
    var it = f.item;
    var b = document.createElement("button");
    b.type = "button"; b.className = "tile-w"; b.dataset.group = f.group;
    b.setAttribute("aria-label", (it.alt || f.group) + (it.video ? " (video)" : "") + ", view full screen");
    b.innerHTML = '<span class="tile-w__media"></span><span class="tile-w__shade" aria-hidden="true"></span>' +
      '<span class="tile-w__info" aria-hidden="true"><span class="tile-w__title"></span><span class="tile-w__kind"></span></span>';
    // tiles use the light 600x800 copies in images/tiles/ (made from images/originals/)
    var tileItem = it.video ? it : { src: it.src.replace("images/originals/", "images/tiles/"), alt: it.alt };
    b.firstChild.appendChild(media(tileItem, { loop: true, lazy: true }));
    b.querySelector(".tile-w__title").textContent = f.group;
    b.querySelector(".tile-w__kind").textContent = it.video ? "Video" : "Photo";
    b.addEventListener("click", function () { openLb(fi, b); });
    grid.appendChild(b); TILES.push(b);
  });

  // Card videos play only while on screen (saves battery and data)
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (reduce) return;
        e.target._onScreen = e.isIntersecting;
        if (e.isIntersecting && !document.body.classList.contains("lb-open")) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
        else e.target.pause();
      });
    }, { threshold: 0.25 });
    grid.querySelectorAll("video").forEach(function (v) { io.observe(v); });
  }

  /* ---- Work-section nav (Aerra-style) ----
     Replaces the normal nav while the Work wall fills the middle of the screen. */
  var wn = document.getElementById("wn"), wnHead = document.getElementById("wn-head"),
      wnMenuBtn = document.getElementById("wn-menu-btn"), wnCat = document.getElementById("wn-cat"),
      wnCatBtn = document.getElementById("wn-cat-btn"), wnCatLabel = document.getElementById("wn-cat-label"),
      workSec = document.getElementById("work");
  if (S.portrait) document.getElementById("wn-me-img").style.backgroundImage = "url('" + S.portrait + "')";

  // socials pill: Instagram (if set) + email
  var ICONS = {
    IG: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor"/></svg>',
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m4 7 8 6 8-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'
  };
  var soc = document.getElementById("wn-soc");
  S.socials.forEach(function (s) {
    var a = document.createElement("a"); a.href = s.url; a.target = "_blank"; a.rel = "noopener";
    a.setAttribute("aria-label", s.label === "IG" ? "Instagram" : s.label);
    a.innerHTML = ICONS[s.label] || ICONS.IG; soc.appendChild(a);
  });
  var em = document.createElement("a"); em.href = mailto; em.setAttribute("aria-label", "Email " + S.email);
  em.innerHTML = ICONS.mail; soc.appendChild(em);

  // category picker: "All" + each group in config.js; filters the wall
  var catList = document.getElementById("wn-cat-list");
  ["All"].concat(groups.map(function (g) { return g.title; })).forEach(function (name) {
    var li = document.createElement("li"), b = document.createElement("button");
    b.type = "button"; b.textContent = name; b.setAttribute("aria-pressed", name === "All" ? "true" : "false");
    b.addEventListener("click", function () {
      TILES.forEach(function (t) { t.hidden = name !== "All" && t.dataset.group !== name; });
      groups.forEach(function (g) { g._head.hidden = name !== "All" && g.title !== name; });
      catList.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); });
      wnCatLabel.textContent = name === "All" ? "Selected Work" : name;
      setCat(false);
      scrollToY(grid.getBoundingClientRect().top + window.scrollY - 120);   // bring the filtered wall into view
    });
    li.appendChild(b); catList.appendChild(li);
  });

  function setMenuOpen(open) {
    wnHead.classList.toggle("open", open);
    wnMenuBtn.setAttribute("aria-expanded", open);
    wnMenuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  function setCat(open) {
    wnCat.classList.toggle("open", open);
    wnCatBtn.setAttribute("aria-expanded", open);
  }
  wnMenuBtn.addEventListener("click", function () { setMenuOpen(!wnHead.classList.contains("open")); setCat(false); });
  wnCatBtn.addEventListener("click", function () { setCat(!wnCat.classList.contains("open")); setMenuOpen(false); });
  wnHead.querySelectorAll(".wn-menu a").forEach(function (a) { a.addEventListener("click", function () { setMenuOpen(false); }); });
  document.addEventListener("click", function (e) {
    if (!wnHead.contains(e.target)) setMenuOpen(false);
    if (!wnCat.contains(e.target)) setCat(false);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setMenuOpen(false); setCat(false); } });

  // Measure where the dark top pill sits relative to the glass bar, so the bar can morph into exactly that
  // shape: how much to trim off each side (clip) and how far to slide down. Re-measured on resize.
  var navEl = document.getElementById("nav");
  function measureMorph() {
    if (wnHead.classList.contains("open")) return;
    var nL = navEl.offsetLeft, nT = navEl.offsetTop, nW = navEl.offsetWidth, nH = navEl.offsetHeight;
    var pL = wnHead.offsetLeft, pT = wnHead.offsetTop, pW = wnHead.offsetWidth, pH = wnHead.offsetHeight;
    var dy = (pT + pH / 2) - (nT + nH / 2);
    var s = navEl.style;
    s.setProperty("--m-l", (pL - nL) + "px");
    s.setProperty("--m-r", ((nL + nW) - (pL + pW)) + "px");
    s.setProperty("--m-t", ((nH - pH) / 2) + "px");
    s.setProperty("--m-b", ((nH - pH) / 2) + "px");
    s.setProperty("--m-y", dy + "px");
  }
  measureMorph();
  window.addEventListener("resize", measureMorph);

  // swap navs: Aerra-style only while the Work section fills the whole screen
  // (its top has reached the top of the screen and its bottom is still below the bottom edge)
  var inWork = false, ticking = false;
  if (!S.workNav) document.body.classList.add("nav-hide-mode");
  function checkWork() {
    ticking = false;
    var r = workSec.getBoundingClientRect();
    var now = r.top <= 1 && r.bottom >= window.innerHeight - 1;
    if (now === inWork) return;
    inWork = now;
    // Dark nav switched off in config.js: just tuck the main nav away while browsing the photos
    if (!S.workNav) { document.body.classList.toggle("nav-away", now); if (now) setMenu(false); return; }
    document.body.classList.toggle("in-work", now);
    if (now) { wn.removeAttribute("inert"); setMenu(false); }
    else { wn.setAttribute("inert", ""); setMenuOpen(false); setCat(false); }
  }
  window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(checkWork); } }, { passive: true });
  window.addEventListener("resize", checkWork);
  checkWork();

  /* ---- Full-screen viewer ---- */
  var lb = document.getElementById("lb"), stage = document.getElementById("lb-stage"),
      lbTitle = document.getElementById("lb-title"), lbCount = document.getElementById("lb-count"),
      prevBtn = document.getElementById("lb-prev"), nextBtn = document.getElementById("lb-next"),
      closeBtn = document.getElementById("lb-close");
  var cur = 0, opener = null;

  // The viewer steps through every tile in the same order as the wall
  function show() {
    var f = FLAT[cur];
    var shown = TILES.filter(function (t) { return !t.hidden; });
    stage.innerHTML = "";
    stage.appendChild(media(f.item, {}));
    lbTitle.textContent = f.group;
    lbCount.textContent = (shown.indexOf(TILES[cur]) + 1) + " / " + shown.length;
    prevBtn.hidden = nextBtn.hidden = shown.length < 2;
    var nx = FLAT[(cur + 1) % FLAT.length].item;   // warm up the next photo
    if (nx.src) { var pre = new Image(); pre.src = nx.src; }
  }
  function step(d) {
    // skip tiles hidden by the category filter
    for (var n = 0; n < FLAT.length; n++) {
      cur = (cur + d + FLAT.length) % FLAT.length;
      if (!TILES[cur].hidden) break;
    }
    show();
  }
  function openLb(i, from) {
    cur = i; opener = from;
    lb.hidden = false; document.body.classList.add("lb-open");
    grid.querySelectorAll("video").forEach(function (v) { v.pause(); });   // nothing plays behind the viewer
    show(); closeBtn.focus();
  }
  function closeLb() {
    lb.hidden = true; stage.innerHTML = ""; document.body.classList.remove("lb-open");
    grid.querySelectorAll("video").forEach(function (v) {
      if (v._onScreen && !reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    });
    if (opener) opener.focus();
  }
  closeBtn.addEventListener("click", closeLb);
  prevBtn.addEventListener("click", function () { step(-1); });
  nextBtn.addEventListener("click", function () { step(1); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "Tab") {                      // keep keyboard focus inside the viewer
      var f = [closeBtn, prevBtn, nextBtn].concat([].slice.call(stage.querySelectorAll("video")))
        .filter(function (el) { return !el.hidden; });
      var at = f.indexOf(document.activeElement);
      e.preventDefault();
      f[(at + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  // Swipe left/right on phones
  var sx = null, sy = null;
  stage.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  stage.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1);
    sx = null;
  });
  // Clicking the empty space around the photo closes the viewer
  stage.addEventListener("click", function (e) { if (e.target === stage) closeLb(); });
})();
