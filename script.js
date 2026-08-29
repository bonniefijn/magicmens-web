/* ══════════════════════════════════════════════════════════════════════
   MAGIC MENS MUSTI'S
   Alles Anpassbare steckt in den drei Blöcken hier oben.
   ══════════════════════════════════════════════════════════════════════ */

/* ── 1 · MITARBEITER ────────────────────────────────────────────────────
   Kern der Terminbuchung. Jeder Barber trägt hier seine eigene
   WhatsApp-Nummer ein — internationales Format, ohne + und ohne Leerzeichen.
   Beispiel: aus 0177 2058682  wird  "491772058682"

   · Wer keine Nummer hat (wa: ""), taucht in der Buchung nicht auf.
   · Bleibt nur eine Person übrig, überspringt die Buchung diesen Schritt.
   · Weitere Mitarbeiter: Block einfach kopieren.
   ──────────────────────────────────────────────────────────────────── */
const TEAM = [
  {
    id:   "musti",
    name: "Musti",                // Mustafa Okçu — „Musti" ist der Ladenname
    role: "Inhaber · Barber",
    wa:   "491772058682",
    img:  "img/musti-sm.jpg"
  },
  {
    id:   "barber2",
    name: "Kollege",              // [ANPASSEN] Name
    role: "Barber",
    wa:   "",                     // [ANPASSEN] WhatsApp-Nummer, z. B. "4915112345678"
    img:  ""
  }
];

/* ── 2 · LEISTUNGEN ─────────────────────────────────────────────────────
   Preise als Vorschlag auf Charlottenburger Premium-Niveau gesetzt.
   [ANPASSEN] mit dem Inhaber abgleichen — Zahlen nur hier ändern,
   Preisliste, Buchung und Google-Snippet ziehen alles aus dieser Liste.
   ──────────────────────────────────────────────────────────────────── */
const SERVICES = [
  { id:"schnitt",  name:"Haarschnitt",              desc:"Waschen, Schnitt, Finish",              min:40, price:28 },
  { id:"kombi",    name:"Haarschnitt & Bart",       desc:"Der komplette Durchgang",               min:60, price:45 },
  { id:"bart",     name:"Bart trimmen & Kontur",    desc:"Maschine, Messer, Pflegeöl",            min:25, price:20 },
  { id:"rasur",    name:"Klassische Rasur",         desc:"Heiße Tücher, Messer, Balsam",          min:30, price:25 },
  { id:"kind",     name:"Kinderhaarschnitt",        desc:"bis 12 Jahre",                          min:30, price:20 },
  { id:"styling",  name:"Waschen & Styling",        desc:"Pomade, Wax, Föhn",                     min:20, price:14 },
  { id:"brauen",   name:"Augenbrauen mit Faden",    desc:"Form & Korrektur",                      min:15, price:10 },
  { id:"kopf",     name:"Kopfrasur",                desc:"Glatt, mit heißem Tuch",                min:30, price:25 },
  { id:"farbe",    name:"Farbe & Grauabdeckung",    desc:"Haar oder Bart",                        min:45, price:30 }
];

/* ── 3 · SALON ──────────────────────────────────────────────────────── */
const SHOP = {
  name:  "Magic Mens Musti's",
  phone: "+491772058682",
  addr:  "Suarezstraße 3, 14057 Berlin",
  site:  "magicmensmustis.de",          // [ANPASSEN] endgültige Domain
  insta: "https://www.instagram.com/magic_mens_salon/",

  /* 0 = Sonntag … 6 = Samstag · null = geschlossen
     Quelle: Fresha-Eintrag zum Salon. ACHTUNG — Fresha schreibt dort selbst,
     der Betrieb sei nicht mit Fresha verbunden, die Daten stammen aus
     öffentlichen Quellen. Donnerstag und Samstag enden früher als der Rest;
     das ist ungewöhnlich und gehört mit Musti abgeglichen.  [PRÜFEN] */
  hours: [ null,                    // So  geschlossen
           ["09:30","19:30"],       // Mo
           ["09:30","19:30"],       // Di
           ["09:30","19:30"],       // Mi
           ["09:00","17:00"],       // Do  [PRÜFEN]
           ["09:30","19:30"],       // Fr
           ["09:30","17:00"] ]      // Sa  [PRÜFEN]
};

const DAYS = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];

/* ════════════════════════════════════════════════════════════════════ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const eur = n => `${n} €`;

/* ── Jahr ───────────────────────────────────────────────────────────── */
$$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

/* ── Öffnungsstatus ─────────────────────────────────────────────────── */
function openState(now = new Date()){
  const span = SHOP.hours[now.getDay()];
  if (!span) return { open:false, text:"Heute geschlossen" };
  const mins = now.getHours() * 60 + now.getMinutes();
  const toM  = s => +s.slice(0,2) * 60 + +s.slice(3);
  const [o,c] = span.map(toM);
  if (mins < o)  return { open:false, text:`Öffnet heute um ${span[0]}` };
  if (mins >= c) return { open:false, text:"Für heute geschlossen" };
  return { open:true, text:`Jetzt geöffnet · bis ${span[1]}` };
}
(function paintStatus(){
  const s = openState();
  $$("[data-status-text]").forEach(el => el.textContent = s.text);
  $$("[data-status-dot]").forEach(el => el.classList.add(s.open ? "is-open" : "is-closed"));
})();

/* ── Öffnungszeiten-Tabelle ─────────────────────────────────────────── */
(function paintHours(){
  const tb = $("#hours tbody");
  if (!tb) return;
  const today = new Date().getDay();
  const order = [1,2,3,4,5,6,0];
  tb.innerHTML = order.map(d => {
    const h = SHOP.hours[d];
    return `<tr${d === today ? ' class="is-today"' : ""}>
      <th scope="row">${DAYS[d]}</th>
      <td>${h ? `${h[0]} – ${h[1]}` : "geschlossen"}</td></tr>`;
  }).join("");
})();

/* ── Preisliste ─────────────────────────────────────────────────────── */
(function paintPrices(){
  const ol = $("#priceList");
  if (!ol) return;
  ol.innerHTML = SERVICES.map((s, i) => `
    <li>
      <button data-book data-service="${s.id}">
        <span class="price__n">${String(i + 1).padStart(2,"0")}</span>
        <span class="price__t">${s.name}</span>
        <span class="price__p">${eur(s.price)}</span>
        <span class="price__d">${s.desc} · ${s.min} Min.</span>
        <span class="price__go">Buchen →</span>
      </button>
    </li>`).join("");
})();

/* ── Header / Mobile Nav ────────────────────────────────────────────── */
const hdr = $("#hdr"), burger = $("#burger"), mnav = $("#mnav");
addEventListener("scroll", () => hdr.classList.toggle("is-stuck", scrollY > 40), { passive:true });

burger.addEventListener("click", () => {
  const open = burger.getAttribute("aria-expanded") === "true";
  burger.setAttribute("aria-expanded", String(!open));
  burger.setAttribute("aria-label", open ? "Menü öffnen" : "Menü schließen");
  mnav.hidden = open;
  document.body.style.overflow = open ? "" : "hidden";
});
$$("#mnav a").forEach(a => a.addEventListener("click", () => burger.click()));

/* ── Sticky Booking Bar ─────────────────────────────────────────────────
   Die Leiste übernimmt genau dann, wenn der Hero-CTA aus dem Bild
   gescrollt ist — nie doppelt, nie zu spät. */
(function bookbar(){
  const bar = $(".bookbar"), anchor = $(".hero__cta");
  if (!bar || !anchor) return;
  new IntersectionObserver(([e]) => bar.classList.toggle("is-on", !e.isIntersecting))
    .observe(anchor);
})();

/* ── Reveal beim Eintritt (einmalig) ────────────────────────────────── */
(function reveal(){
  /* Der Hero bleibt bewusst draußen — er muss sofort stehen, nicht einfliegen. */
  const targets = $$(".sec__head, .welcome__img, .welcome__txt, .film, .carousel, .price li, .combo, .quotes blockquote, .cta, .loc__col");
  targets.forEach(el => el.setAttribute("data-reveal",""));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      e.target.style.setProperty("--d", `${Math.min(i,6) * 60}ms`);
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { rootMargin:"0px 0px -8%" });
  targets.forEach(el => io.observe(el));
})();

/* ── Verbindung einschätzen ─────────────────────────────────────────────
   Auf Mobilfunk oder bei aktiviertem Datensparmodus bleiben die Videos
   aus und die Standbilder stehen. 30 MB Video über eine langsame
   Leitung sind kein Erlebnis, sondern eine Wartezeit. */
function magSchwereMedien(){
  const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!c) return true;                                  // Browser sagt nichts → laden
  if (c.saveData) return false;                         // Datensparmodus respektieren
  return !["slow-2g","2g","3g"].includes(c.effectiveType);
}

/* ── Hero-Video ─────────────────────────────────────────────────────────
   Lädt erst nach dem ersten Aufbau der Seite und nur bei guter Leitung.
   Sonst bleibt das Standbild stehen — die Seite ist trotzdem vollständig. */
(function heroVideo(){
  const v = $("[data-herovideo]");
  if (!v) return;
  if (!magSchwereMedien()) return;
  const start = () => { v.preload = "auto"; v.load(); v.play().catch(() => {}); };
  if (document.readyState === "complete") setTimeout(start, 400);
  else addEventListener("load", () => setTimeout(start, 400), { once:true });
})();

/* ── Videos erst laden, wenn sie in Sicht kommen ────────────────────── */
(function lazyVideos(){
  if (!magSchwereMedien()) return;
  const vids = $$("[data-lazyvideo]");
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const v = e.target;
      v.preload = "auto";
      v.play().catch(() => {});
      io.unobserve(v);
    });
  }, { rootMargin:"200px" });
  vids.forEach(v => io.observe(v));
})();

/* ══ TERMINBUCHUNG ÜBER WHATSAPP ══════════════════════════════════════ */
const bk = {
  el:     $("#bk"),
  panes:  $$(".bk__pane"),
  steps:  $$(".bk__steps li"),
  back:   $("#bkBack"),
  next:   $("#bkNext"),
  send:   $("#bkSend"),
  sum:    $("#bkSum"),
  step:   1,
  pick:   { service:null, barber:null }
};

const staff = TEAM.filter(t => t.wa && t.wa.replace(/\D/g,"").length > 6);

/* Optionen rendern */
$("#bkServices").innerHTML = SERVICES.map((s, i) => `
  <label class="opt">
    <input type="radio" name="bkService" value="${s.id}"${i === 0 ? " checked" : ""}>
    <span class="opt__box">
      <span class="opt__t">${s.name}</span>
      <span class="opt__p">${eur(s.price)}</span>
      <span class="opt__d">${s.desc} · ca. ${s.min} Minuten</span>
    </span>
  </label>`).join("");

$("#bkTeam").innerHTML = staff.map((t, i) => `
  <label class="opt opt--team">
    <input type="radio" name="bkBarber" value="${t.id}"${i === 0 ? " checked" : ""}>
    <span class="opt__box">
      <span class="opt__t">${t.name}</span>
      <span class="opt__d">${t.role}</span>
    </span>
  </label>`).join("");

/* Wunschtag: heute als Minimum, morgen als Vorbelegung */
(function initDate(){
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0,10);
  const today = new Date(), tomorrow = new Date(Date.now() + 864e5);
  $("#bkDate").min   = iso(today);
  $("#bkDate").value = iso(tomorrow);
})();

function currentService(){
  const id = $("input[name=bkService]:checked")?.value;
  return SERVICES.find(s => s.id === id) || SERVICES[0];
}
function currentBarber(){
  const id = $("input[name=bkBarber]:checked")?.value;
  return staff.find(t => t.id === id) || staff[0] || null;
}

/* Schritt 2 entfällt, solange nur eine Nummer hinterlegt ist */
const skipBarber = staff.length < 2;
if (skipBarber) bk.steps[1].hidden = true;

function showStep(n){
  bk.step = n;
  bk.panes.forEach(p => p.hidden = +p.dataset.pane !== n);
  bk.steps.forEach(s => {
    const i = +s.dataset.step;
    s.classList.toggle("is-on", i === n);
    s.classList.toggle("is-done", i < n);
  });
  bk.back.hidden = n === 1;
  const last = n === 3;
  bk.next.hidden = last;
  bk.send.hidden = !last;
  paintSum();
}

function paintSum(){
  const s = currentService(), b = currentBarber();
  const bits = [`<b>${s.name}</b> · ${eur(s.price)} · ${s.min} Min.`];
  if (b && !skipBarber) bits.push(`bei <b>${b.name}</b>`);
  bk.sum.innerHTML = bits.join(" · ");
}

function nextStep(){
  if (bk.step === 1) return showStep(skipBarber ? 3 : 2);
  if (bk.step === 2) return showStep(3);
}
function prevStep(){
  if (bk.step === 3) return showStep(skipBarber ? 1 : 2);
  if (bk.step === 2) return showStep(1);
}

/* WhatsApp-Nachricht bauen */
function buildLink(){
  const s = currentService(), b = currentBarber();
  if (!b) return null;

  const name = $("#bkName").value.trim();
  const note = $("#bkNote").value.trim();
  const date = $("#bkDate").value, time = $("#bkTime").value;

  let when = "so bald wie möglich";
  if (date){
    const d = new Date(`${date}T${time || "12:00"}`);
    when = d.toLocaleDateString("de-DE", { weekday:"short", day:"2-digit", month:"2-digit", year:"numeric" });
    if (time) when += ` um ${time} Uhr`;
  }

  const lines = [
    `Hallo ${b.name}, ich möchte gern einen Termin bei ${SHOP.name}.`,
    "",
    `Leistung: ${s.name} (${s.min} Min. · ${s.price} €)`,
    `Wunschtermin: ${when}`,
    `Name: ${name || "—"}`
  ];
  if (note) lines.push(`Anmerkung: ${note}`);
  lines.push("", `Anfrage über ${SHOP.site}`);

  return `https://wa.me/${b.wa.replace(/\D/g,"")}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/* Öffnen — optional mit vorgewählter Leistung */
function openBooking(serviceId){
  if (serviceId){
    const r = $(`input[name=bkService][value="${serviceId}"]`);
    if (r) r.checked = true;
  }
  if (typeof stornoModus === "function") stornoModus(false);
  showStep(1);
  bk.el.showModal();
}

document.addEventListener("click", e => {
  const t = e.target.closest("[data-book]");
  if (!t) return;
  e.preventDefault();
  if (!mnav.hidden) burger.click();
  openBooking(t.dataset.service);
});

bk.next.addEventListener("click", nextStep);
bk.back.addEventListener("click", () => {
  if (sto.aktiv){ stornoModus(false); showStep(1); return; }
  prevStep();
});
bk.el.addEventListener("change", paintSum);

bk.send.addEventListener("click", e => {
  if (!$("#bkName").value.trim()){
    e.preventDefault();
    $("#bkName").focus();
    bk.sum.innerHTML = "<b>Bitte trag noch deinen Namen ein.</b>";
    return;
  }
  const url = buildLink();
  if (!url){
    e.preventDefault();
    bk.sum.innerHTML = "<b>Noch keine WhatsApp-Nummer hinterlegt.</b> Bitte telefonisch buchen.";
    return;
  }
  bk.send.href = url;
  bk.el.close();
});

/* ── Absage ─────────────────────────────────────────────────────────────
   Gleicher Kanal, eigener Text. Der Dialog wechselt in den Absage-Modus:
   die drei Schritte verschwinden, „Weiter" und „Senden" ebenso, statt
   dessen erscheint der Absage-Knopf. */
const sto = {
  pane:  $('[data-pane="storno"]'),
  link:  $("#bkStornoLink"),
  send:  $("#bkStoSend"),
  aktiv: false
};

function stornoModus(an){
  sto.aktiv = an;
  bk.el.classList.toggle("is-storno", an);
  $(".bk__steps").hidden = an;
  bk.panes.forEach(p => { if (p !== sto.pane) p.hidden = an ? true : p.hidden; });
  sto.pane.hidden = !an;
  bk.next.hidden = an;
  bk.send.hidden = an ? true : bk.send.hidden;
  sto.send.hidden = !an;
  bk.back.hidden = !an;
  $("#bkTitle").textContent = an ? "Termin absagen" : "Über WhatsApp buchen";
  sto.link.hidden = an;
  bk.sum.textContent = an ? "Die Absage geht an denselben Barber." : "";
  if (an && !$("#stoDate").value) $("#stoDate").value = $("#bkDate").value;
}

sto.link.addEventListener("click", () => stornoModus(true));

sto.send.addEventListener("click", e => {
  const b = currentBarber();
  if (!b){ e.preventDefault(); bk.sum.innerHTML = "<b>Keine WhatsApp-Nummer hinterlegt.</b> Bitte telefonisch absagen."; return; }
  const name = $("#stoName").value.trim();
  if (!name){ e.preventDefault(); $("#stoName").focus(); bk.sum.innerHTML = "<b>Bitte trag noch deinen Namen ein.</b>"; return; }

  const d = $("#stoDate").value, t = $("#stoTime").value;
  let wann = "meinen Termin";
  if (d){
    const dt = new Date(`${d}T${t || "12:00"}`);
    wann = "meinen Termin am " + dt.toLocaleDateString("de-DE", { weekday:"short", day:"2-digit", month:"2-digit", year:"numeric" });
    if (t) wann += ` um ${t} Uhr`;
  }
  const zeilen = [
    `Hallo ${b.name}, ich muss ${wann} leider absagen.`,
    "",
    `Name: ${name}`,
    "",
    "Tut mir leid für die kurzfristige Änderung.",
    `Absage über ${SHOP.site}`
  ];
  sto.send.href = `https://wa.me/${b.wa.replace(/\D/g,"")}?text=${encodeURIComponent(zeilen.join("\n"))}`;
  bk.el.close();
});

/* Absage von außerhalb des Dialogs öffnen */
document.addEventListener("click", e => {
  if (!e.target.closest("[data-storno]")) return;
  e.preventDefault();
  if (!mnav.hidden) burger.click();
  bk.el.showModal();
  stornoModus(true);
});

/* Kein Barber hinterlegt → Buchung ehrlich abschalten */
if (!staff.length){
  $$("[data-book]").forEach(b => {
    if (b.tagName === "BUTTON" && b.closest(".hero__cta, .cta__row, .bookbar, .mnav__foot")){
      b.textContent = `Anrufen · ${SHOP.phone.replace("+49","0").replace(/(\d{4})(\d+)/,"$1 $2")}`;
      b.removeAttribute("data-book");
      b.addEventListener("click", () => location.href = `tel:${SHOP.phone}`);
    }
  });
}

/* ── Lightbox ───────────────────────────────────────────────────────── */
(function lightbox(){
  const lb = $("#lb"), img = $("#lbImg");
  const shots = $$(".slide img");
  let idx = 0;

  const show = i => {
    idx = (i + shots.length) % shots.length;
    img.src = shots[idx].dataset.full || shots[idx].src;
    img.alt = shots[idx].alt;
  };
  const open = i => { show(i); lb.hidden = false; document.body.style.overflow = "hidden"; $("#lbClose").focus(); };
  const close = () => { lb.hidden = true; document.body.style.overflow = ""; };

  shots.forEach((el, i) => el.addEventListener("click", () => open(i)));
  $("#lbClose").addEventListener("click", close);
  $("#lbPrev").addEventListener("click", () => show(idx - 1));
  $("#lbNext").addEventListener("click", () => show(idx + 1));
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft")  show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
})();

/* ── Karussell ──────────────────────────────────────────────────────────
   Die Pfeile scrollen um genau eine Kachelbreite. Alles Weitere macht
   das native Scroll-Snapping. */
(function carousel(){
  const track = $("#raumTrack");
  if (!track) return;
  $$(".carousel__nav").forEach(btn => btn.addEventListener("click", () => {
    const slide = track.querySelector(".slide");
    if (!slide) return;
    const schritt = slide.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
    track.scrollBy({ left: schritt * Number(btn.dataset.slide), behavior: "smooth" });
  }));
})();

/* ── Weiches Scrollen (Lenis) ───────────────────────────────────────────
   Bewusst zurückhaltend eingestellt: kein langes Nachfedern, kein
   Gummiband. Das Rad soll sich noch wie das eigene Gerät anfühlen,
   nur ohne die harten Sprünge.

   Aus bei prefers-reduced-motion und auf Touch-Geräten — dort hat das
   System sein eigenes, besseres Scrollverhalten, und Eingriffe fühlen
   sich dort fast immer falsch an.

   Zum Abschalten: diesen Block und das Skript im <head> entfernen. */
(function weichesScrollen(){
  if (typeof Lenis === "undefined") return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (matchMedia("(pointer: coarse)").matches) return;

  const lenis = new Lenis({
    duration: 0.9,                 // kurz — 1,2 und mehr wirkt schwammig
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1
  });

  function takt(zeit){ lenis.raf(zeit); requestAnimationFrame(takt); }
  requestAnimationFrame(takt);

  /* Ankersprünge übernimmt jetzt Lenis — mit demselben Versatz für den
     festen Header wie scroll-padding-top im CSS. */
  const versatz = -(79 + 24);
  $$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
    const ziel = document.querySelector(a.getAttribute("href"));
    if (!ziel) return;
    e.preventDefault();
    lenis.scrollTo(ziel, { offset: versatz });
  }));

  /* Während der Buchungsdialog offen ist, darf die Seite dahinter
     nicht mitscrollen. */
  const dlg = $("#bk");
  if (dlg){
    new MutationObserver(() => dlg.open ? lenis.stop() : lenis.start())
      .observe(dlg, { attributes:true, attributeFilter:["open"] });
  }
})();
