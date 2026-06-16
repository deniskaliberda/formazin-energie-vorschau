/* Formazin Energie-Funnel — statische Vorschau. Schreibt direkt nach Supabase (anon, RLS-geschützt). */
(function () {
  "use strict";
  var SUPA_URL = "https://qubvhbfuleogeytgvadc.supabase.co";
  var SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1YnZoYmZ1bGVvZ2V5dGd2YWRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MTExMzgsImV4cCI6MjA5NzE4NzEzOH0.cygyhmnrpV-xBj2fLxT_oaZAbK-NLIgDh8YNnFa7N7c";

  var I = {
    arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.1 5.5a2 2 0 0 0 1.8 0l3.6-1.8A1 1 0 0 1 21 4.6v12.8a1 1 0 0 1-.6.9l-4.5 2.3a2 2 0 0 1-1.8 0l-4.2-2.1a2 2 0 0 0-1.8 0l-3.6 1.8A1 1 0 0 1 3 19.4V6.6a1 1 0 0 1 .6-.9l4.5-2.3a2 2 0 0 1 1.8 0z"/><path d="M15 5.8v15"/><path d="M9 3.2v15"/></svg>',
    file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v5h5"/><path d="M8 13h8M8 17h6"/></svg>',
    clip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/></svg>',
    hat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/></svg>',
    flame: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3q1 4 4 6.5t3 5.5a7 7 0 1 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/></svg>',
    help: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>'
  };

  var ANLIEGEN = [
    { k: "sanierungsfahrplan_isfp", t: "Sanierungsfahrplan & Förderung", h: "iSFP — geförderte Energieberatung", i: I.map },
    { k: "energieausweis", t: "Energieausweis", h: "Bedarf oder Verbrauch", i: I.file },
    { k: "gegnachweis", t: "GEG-Nachweis", h: "für den Bauantrag", i: I.clip },
    { k: "kfw_baubegleitung", t: "KfW-Baubegleitung", h: "gelisteter Energie-Effizienz-Experte", i: I.hat },
    { k: "heizung_planen", t: "Heizung tauschen / planen", h: "Förderung & Antrag", i: I.flame },
    { k: "unsicher", t: "Bin mir noch nicht sicher", h: "Wir ordnen es gemeinsam ein", i: I.help }
  ];
  var GEBAEUDE = [
    { k: "efh", t: "Einfamilienhaus" }, { k: "zfh", t: "Zweifamilienhaus" }, { k: "mfh", t: "Mehrfamilienhaus" },
    { k: "gewerbe_nwg", t: "Gewerbe / Nichtwohngebäude" }, { k: "denkmal", t: "Denkmal / Bestand" }
  ];
  var BAUJAHR = ["vor 1977", "1977 – 1994", "1995 – 2009", "ab 2010", "Neubau geplant"];
  var ZEIT = [
    { k: "konkret_geplant", t: "Konkret geplant", h: "Es soll bald losgehen" },
    { k: "in_planung", t: "In Planung", h: "In den nächsten Monaten" },
    { k: "nur_information", t: "Erstmal Information", h: "Ich sammle Möglichkeiten" }
  ];
  var KONTEXT = {
    energieausweis: { q: "Welche Art Energieausweis?", o: [{ k: "bedarf", t: "Bedarfsausweis" }, { k: "verbrauch", t: "Verbrauchsausweis" }, { k: "weiss_nicht", t: "Weiß ich nicht" }] },
    gegnachweis: { q: "Worum geht es beim Bauvorhaben?", o: [{ k: "neubau", t: "Neubau" }, { k: "sanierung", t: "Größere Sanierung" }, { k: "anbau", t: "Anbau / Erweiterung" }] },
    sanierungsfahrplan_isfp: { q: "Was haben Sie ungefähr vor?", o: [{ k: "huelle", t: "Dämmung / Fenster" }, { k: "heizung", t: "Heizungstausch (Förderung)" }, { k: "komplett", t: "Komplettsanierung" }, { k: "offen", t: "Noch offen" }] },
    kfw_baubegleitung: { q: "Welches Vorhaben begleiten wir?", o: [{ k: "eh_neubau", t: "Effizienzhaus-Neubau" }, { k: "eh_sanierung", t: "Sanierung zum Effizienzhaus" }, { k: "einzel", t: "Einzelmaßnahmen (BEG)" }] },
    foerderung_heizung: { q: "Welche Heizung ist geplant?", o: [{ k: "wp", t: "Wärmepumpe" }, { k: "fw", t: "Anschluss Fernwärme" }, { k: "andere", t: "Andere / unklar" }, { k: "offen", t: "Noch offen" }] }
  };
  var STEPS = ["anliegen", "gebaeude", "kontext", "zeitrahmen", "kontakt"];

  var el, screen = "anliegen", hist = [], A = {}, sid = uuid(), busy = false, err = "";

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "s-" + Date.now() + "-" + Math.floor(Math.random() * 1e6);
  }
  function servicegebiet(plz) {
    if (!/^\d{5}$/.test(plz)) return undefined;
    var n = parseInt(plz.slice(0, 2), 10);
    return (n >= 10 && n <= 16) || plz.indexOf("03") === 0;
  }
  function track(step) {
    try {
      fetch(SUPA_URL + "/rest/v1/funnel_events", {
        method: "POST", keepalive: true,
        headers: { apikey: SUPA_KEY, Authorization: "Bearer " + SUPA_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({ session_id: sid, step: step, intent: A.intent || null, page_path: location.pathname })
      });
    } catch (e) {}
  }
  function go(s) { hist.push(screen); screen = s; err = ""; render(); track(s); }
  function back() { if (hist.length) { screen = hist.pop(); err = ""; render(); } }
  function reset() { A = {}; hist = []; screen = "anliegen"; err = ""; render(); }
  function stepIdx() { var i = STEPS.indexOf(screen); return i >= 0 ? i + 1 : 1; }

  function topBar(showBack) {
    var s = stepIdx(), pct = (s / STEPS.length) * 100;
    return '<div class="f-top"><div class="f-toprow">' +
      (showBack ? '<button class="f-back" data-act="back">' + I.arrowL + ' Zurück</button>' : '<span></span>') +
      '<span class="f-step">Schritt ' + s + ' / ' + STEPS.length + '</span></div>' +
      '<div class="f-bar"><i style="width:' + pct + '%"></i></div></div>';
  }
  function choice(item, sel, act) {
    return '<button class="choice' + (sel ? ' sel' : '') + '" data-act="' + act + '" data-k="' + item.k + '">' +
      (item.i ? '<span class="ci">' + item.i + '</span>' : '') +
      '<span class="ct"><b>' + item.t + '</b>' + (item.h ? '<small>' + item.h + '</small>' : '') + '</span>' +
      '<span class="ca">' + I.arrowR + '</span></button>';
  }

  function render() {
    var h = "";
    if (screen === "anliegen") {
      h = topBar(false) + '<h2 class="f-title">Worum geht es bei Ihnen?</h2><p class="f-sub">Wählen Sie Ihr Anliegen — wir führen Sie in wenigen Schritten durch.</p><div class="f-grid">' +
        ANLIEGEN.map(function (c) { return choice(c, false, "anliegen"); }).join("") + "</div>";
    } else if (screen === "prequal") {
      h = '<button class="f-back" data-act="back">' + I.arrowL + ' Zurück</button>' +
        '<h2 class="f-title" style="margin-top:18px">Kurz vorweg — ehrlich gesagt</h2>' +
        '<p class="f-sub" style="margin-top:14px;line-height:1.6">Die Heizungsanlage selbst plant und baut Ihr <b>Heizungs-Fachbetrieb</b>. Wir sind Ihr Partner für die <b style="color:var(--primary)">Förderung</b> dazu: Wir holen für Ihren Heizungstausch das Maximum an Fördermitteln heraus und übernehmen Anträge und Nachweise.</p>' +
        '<div class="f-grid" style="margin-top:26px"><button class="btn f-full" data-act="prequal-yes">Ja, zur Förderung beraten ' + I.arrowR + '</button>' +
        '<button class="choice" data-act="prequal-no" style="justify-content:center"><span class="ct" style="text-align:center"><b>Nein, mir geht es nur um die Anlage selbst</b></span></button></div>';
    } else if (screen === "exit") {
      h = '<div class="center"><div class="ok-icon">' + I.help + '</div>' +
        '<h2 class="f-title">Dann ist Ihr Fachbetrieb die richtige Adresse</h2>' +
        '<p class="f-sub" style="margin-top:14px">Für die reine Heizungsplanung und den Einbau wenden Sie sich am besten direkt an einen Heizungs-Fachbetrieb. Sobald es um <b>Förderung</b>, einen <b>Energieausweis</b> oder einen <b>Sanierungsfahrplan</b> geht, sind wir gern für Sie da.</p>' +
        '<div style="margin-top:26px"><button class="btn" data-act="reset">Zurück zum Anfang</button></div></div>';
    } else if (screen === "gebaeude") {
      h = topBar(true) + '<h2 class="f-title">Um welches Gebäude geht es?</h2><div class="f-grid two">' +
        GEBAEUDE.map(function (c) { return choice(c, A.gebaeudetyp === c.k, "geb"); }).join("") + "</div>" +
        '<p style="margin:22px 0 8px;font-weight:600;font-size:.9rem">Baujahr</p><div style="display:flex;flex-wrap:wrap;gap:8px">' +
        BAUJAHR.map(function (b) { return '<button class="pill' + (A.baujahr_spanne === b ? ' sel' : '') + '" data-act="bj" data-k="' + b + '">' + b + "</button>"; }).join("") + "</div>" +
        '<div class="f-grid two" style="margin-top:18px"><input class="field" data-f="plz" inputmode="numeric" maxlength="5" placeholder="PLZ" value="' + (A.plz || "") + '"><input class="field" data-f="ort" placeholder="Ort" value="' + (A.ort || "") + '"></div>' +
        (A.im_servicegebiet === false ? '<p class="f-sub" style="margin-top:10px;font-size:.9rem">Hinweis: Wir arbeiten vor allem in Berlin &amp; Brandenburg. Schreiben Sie uns trotzdem — wir prüfen, ob wir Ihr Vorhaben übernehmen können.</p>' : "") +
        '<div class="f-actions"><button class="btn f-full' + (A.gebaeudetyp ? "" : " disabled") + '" data-act="geb-next">Weiter ' + I.arrowR + "</button></div>";
    } else if (screen === "kontext") {
      var kx = KONTEXT[A.intent];
      h = topBar(true) + '<h2 class="f-title">' + (kx ? kx.q : "Erzählen Sie uns mehr") + '</h2><div class="f-grid two">' +
        (kx ? kx.o.map(function (c) { return choice(c, A.massnahme === c.t, "ctx"); }).join("") : choice({ k: "weiter", t: "Weiter" }, false, "ctx-skip")) + "</div>";
    } else if (screen === "zeitrahmen") {
      h = topBar(true) + '<h2 class="f-title">Wie konkret ist Ihr Vorhaben?</h2><div class="f-grid">' +
        ZEIT.map(function (c) { return choice(c, A.zeitrahmen === c.k, "zeit"); }).join("") + "</div>";
    } else if (screen === "kontakt") {
      h = topBar(true) + '<h2 class="f-title">Wohin dürfen wir uns melden?</h2><p class="f-sub">Wir melden uns innerhalb von 1–2 Werktagen mit einer konkreten Einschätzung.</p><div class="f-grid">' +
        '<input class="field" data-f="name" placeholder="Name" value="' + (A.name || "") + '">' +
        '<input class="field" data-f="email" type="email" placeholder="E-Mail" value="' + (A.email || "") + '">' +
        '<input class="field" data-f="telefon" placeholder="Telefon (optional)" value="' + (A.telefon || "") + '">' +
        '<textarea class="field" data-f="nachricht" rows="3" placeholder="Ihre Nachricht (optional)">' + (A.nachricht || "") + '</textarea>' +
        '<label class="consent"><input type="checkbox" data-f="consent"' + (A.consent ? " checked" : "") + '><span>Ich bin einverstanden, dass meine Angaben zur Bearbeitung der Anfrage gespeichert und verwendet werden.</span></label></div>' +
        '<div class="f-actions"><button class="btn f-full' + (kontaktOk() ? "" : " disabled") + '" data-act="to-summary">Anfrage prüfen ' + I.arrowR + "</button></div>";
    } else if (screen === "summary") {
      var rows = [["Anliegen", labelOf(ANLIEGEN, A.intent)], ["Gebäude", labelOf(GEBAEUDE, A.gebaeudetyp)], ["Baujahr", A.baujahr_spanne], ["Ort", [A.plz, A.ort].filter(Boolean).join(" ")], ["Details", A.massnahme], ["Zeitrahmen", labelOf(ZEIT, A.zeitrahmen)], ["Name", A.name], ["E-Mail", A.email], ["Telefon", A.telefon]];
      h = '<button class="f-back" data-act="back">' + I.arrowL + ' Zurück</button><h2 class="f-title" style="margin-top:18px">Passt das so?</h2>' +
        '<div class="summary-list">' + rows.filter(function (r) { return r[1]; }).map(function (r) { return '<div class="r"><span class="k">' + r[0] + '</span><span class="v">' + esc(r[1]) + "</span></div>"; }).join("") + "</div>" +
        (err ? '<div class="err">' + esc(err) + "</div>" : "") +
        '<div class="f-actions"><button class="btn f-full' + (busy ? " disabled" : "") + '" data-act="submit">' + (busy ? "Wird gesendet…" : "Anfrage absenden " + I.check) + "</button></div>";
    } else if (screen === "success") {
      h = '<div class="center"><div class="ok-icon">' + I.check + '</div><h2 class="f-title">Vielen Dank' + (A.name ? ", " + esc(A.name.split(" ")[0]) : "") + '!</h2>' +
        '<p class="f-sub" style="margin-top:14px">Ihre Anfrage liegt bei uns. Wir melden uns innerhalb von <b>1–2 Werktagen</b> mit einer konkreten Einschätzung — telefonisch oder per E-Mail.</p>' +
        '<div style="margin-top:24px"><a class="btn" href="index.html">Zurück zur Übersicht</a></div></div>';
    }
    el.innerHTML = h;
  }

  function labelOf(arr, k) { for (var i = 0; i < arr.length; i++) if (arr[i].k === k) return arr[i].t; return k || ""; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function kontaktOk() { return !!(A.name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(A.email || "") && A.consent); }

  function submit() {
    if (busy) return; busy = true; err = ""; render();
    fetch(SUPA_URL + "/rest/v1/leads", {
      method: "POST",
      headers: { apikey: SUPA_KEY, Authorization: "Bearer " + SUPA_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({
        intent: A.intent, gebaeudetyp: A.gebaeudetyp || null, baujahr_spanne: A.baujahr_spanne || null,
        plz: A.plz || null, ort: A.ort || null, im_servicegebiet: (A.im_servicegebiet == null ? null : A.im_servicegebiet),
        massnahme: A.massnahme || null, zeitrahmen: A.zeitrahmen || null,
        name: A.name, email: A.email, telefon: A.telefon || null, nachricht: A.nachricht || null,
        consent: true, consent_at: new Date().toISOString(), source: "feith-vorschau", page_path: location.pathname, session_id: sid
      })
    }).then(function (r) {
      busy = false;
      if (r.ok) { track("submit"); screen = "success"; render(); }
      else { err = "Ein Fehler ist aufgetreten (Status " + r.status + "). Bitte versuchen Sie es erneut."; render(); }
    }).catch(function () { busy = false; err = "Verbindungsfehler. Bitte versuchen Sie es erneut."; render(); });
  }

  function onClick(e) {
    var b = e.target.closest("[data-act]"); if (!b) return;
    var act = b.getAttribute("data-act"), k = b.getAttribute("data-k");
    if (act === "back") return back();
    if (act === "reset") return reset();
    if (act === "anliegen") { if (k === "heizung_planen") { go("prequal"); } else { A.intent = k; go("gebaeude"); } return; }
    if (act === "prequal-yes") { A.intent = "foerderung_heizung"; go("gebaeude"); return; }
    if (act === "prequal-no") return go("exit");
    if (act === "geb") { A.gebaeudetyp = k; render(); return; }
    if (act === "bj") { A.baujahr_spanne = k; render(); return; }
    if (act === "geb-next") { if (A.gebaeudetyp) go("kontext"); return; }
    if (act === "ctx") { A.massnahme = labelOf(KONTEXT[A.intent].o, k); go("zeitrahmen"); return; }
    if (act === "ctx-skip") return go("zeitrahmen");
    if (act === "zeit") { A.zeitrahmen = k; go("kontakt"); return; }
    if (act === "to-summary") { if (kontaktOk()) go("summary"); return; }
    if (act === "submit") return submit();
  }
  function onInput(e) {
    var f = e.target.getAttribute && e.target.getAttribute("data-f"); if (!f) return;
    if (f === "consent") { A.consent = e.target.checked; toggleBtn(); return; }
    A[f] = e.target.value;
    if (f === "plz") { A.plz = e.target.value.replace(/\D/g, "").slice(0, 5); A.im_servicegebiet = A.plz.length === 5 ? servicegebiet(A.plz) : undefined; if (e.target.value !== A.plz || A.im_servicegebiet === false) render(); }
    if (screen === "kontakt") toggleBtn();
  }
  function toggleBtn() {
    var btn = el.querySelector('[data-act="to-summary"], [data-act="geb-next"]'); if (!btn) return;
    if (screen === "kontakt") btn.classList.toggle("disabled", !kontaktOk());
  }

  document.addEventListener("DOMContentLoaded", function () {
    el = document.getElementById("funnel"); if (!el) return;
    el.addEventListener("click", onClick);
    el.addEventListener("input", onInput);
    el.addEventListener("change", onInput);
    track("start");
    render();
  });
})();
