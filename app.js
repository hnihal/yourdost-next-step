(function () {
  const D = window.YD_DATA;
  const E = window.YD_ENGINE;
  const TESTS = window.YD_TESTS;

  const chat = document.getElementById("chat");
  const composer = document.getElementById("composer");
  const hint = document.getElementById("hint");
  const panel = document.getElementById("tests-panel");
  const btnTests = document.getElementById("btn-tests");

  const IMPACT = [
    ["little", "A little"],
    ["quite", "Quite a bit"],
    ["barely", "I can barely cope"]
  ];
  const PREF = [
    ["self", "Try something on my own"],
    ["structured", "A short guided program"],
    ["talk", "Talk to someone"],
    ["unsure", "Not sure yet"]
  ];

  let state = fresh();

  function fresh() {
    return { text: "", chips: [], analysis: null, answers: {}, result: null, safetyFlag: false };
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function bot(html, extraClass) {
    const div = document.createElement("div");
    div.className = "msg bot" + (extraClass ? " " + extraClass : "");
    div.innerHTML = '<div class="who">Next Step guide</div>' + html;
    chat.appendChild(div);
    div.scrollIntoView({ behavior: "smooth", block: "start" });
    return div;
  }

  function user(text) {
    const div = document.createElement("div");
    div.className = "msg user";
    div.innerHTML = '<div class="who">You</div>' + esc(text);
    chat.appendChild(div);
  }

  function setComposer(html) {
    composer.innerHTML = html;
  }

  /* ---------- 1. Welcome ---------- */
  function start() {
    state = fresh();
    chat.innerHTML = "";
    hint.hidden = true;
    bot(
      "<p>Hi. Not sure what kind of support you need, or whether you need any? That's exactly what this is for.</p>" +
      "<p>Tell me a little about what's been on your mind, in your own words, or tap whatever fits. I'll suggest <strong>one next step</strong> that suits you.</p>" +
      '<div class="privacy"><span aria-hidden="true">🔒</span><span>Anonymous and confidential. Your employer never sees what you write. In this demo, nothing leaves your browser.</span></div>'
    );
    const chipHtml = D.chips
      .map((c) => '<button class="chip" type="button" aria-pressed="false" data-chip="' + c.id + '">' + esc(c.label) + "</button>")
      .join("");
    setComposer(
      '<label class="label" for="feel">What\'s been on your mind?</label>' +
      '<textarea id="feel" placeholder="e.g. Work has been overwhelming and I can\'t switch off at night..."></textarea>' +
      '<div class="chips" role="group" aria-label="Or tap what fits">' + chipHtml + "</div>" +
      '<div class="row"><button class="btn primary" id="go">Continue</button></div>' +
      '<div class="error" id="err" hidden></div>'
    );
    composer.querySelectorAll(".chip").forEach((b) =>
      b.addEventListener("click", () => {
        b.setAttribute("aria-pressed", b.getAttribute("aria-pressed") === "true" ? "false" : "true");
        hideError();
      })
    );
    document.getElementById("feel").addEventListener("input", hideError);
    document.getElementById("go").addEventListener("click", submitFeeling);
  }

  function hideError() {
    const err = document.getElementById("err");
    if (err) err.hidden = true;
  }

  function submitFeeling() {
    const text = document.getElementById("feel").value.trim();
    const chips = Array.from(composer.querySelectorAll('.chip[aria-pressed="true"]')).map((b) => b.dataset.chip);
    if (!text && !chips.length) {
      const err = document.getElementById("err");
      err.textContent = "Write a few words or tap at least one option to continue.";
      err.hidden = false;
      return;
    }
    state.text = text;
    state.chips = chips;
    const chipLabels = chips.map((id) => D.chips.find((c) => c.id === id).label);
    user([text, chipLabels.length ? "[" + chipLabels.join(", ") + "]" : ""].filter(Boolean).join(" "));
    setComposer("");

    // Safety check always runs first, before any other processing.
    state.analysis = E.analyze(text, chips);
    if (state.analysis.crisis) return showCrisis();
    acknowledge();
  }

  /* ---------- 2. Follow-ups ---------- */
  function acknowledge() {
    const a = state.analysis;
    const opener = a.concern === "general"
      ? "<p>Thank you for sharing that. Feeling off without knowing why is more common than you'd think.</p>"
      : "<p>Thank you for sharing that. It sounds like <strong>" + esc(a.concernLabel) + "</strong> may be weighing on you.</p>";
    setTimeout(() => askOptions(opener + "<p>How much is this affecting your day-to-day life (work, sleep, people around you)?</p>", IMPACT, (val, label) => {
      state.answers.impact = val;
      user(label);
      askPreference();
    }), 350);
  }

  function askPreference() {
    setTimeout(() => askOptions("<p>Got it. What would feel right as a first step?</p>", PREF, (val, label) => {
      state.answers.preference = val;
      user(label);
      showResult();
    }), 300);
  }

  function askOptions(html, options, onPick) {
    bot(html);
    setComposer(
      '<div class="options">' +
      options.map(([v, l]) => '<button class="btn" data-v="' + v + '">' + esc(l) + "</button>").join("") +
      "</div>"
    );
    composer.querySelectorAll("[data-v]").forEach((b) =>
      b.addEventListener("click", () => {
        setComposer("");
        onPick(b.dataset.v, b.textContent);
      })
    );
  }

  /* ---------- 3. Recommendation ---------- */
  function showResult() {
    const r = E.recommend(state.analysis, state.answers);
    state.result = r;
    const p = r.primary;

    const safety = state.safetyFlag
      ? '<div class="safety-banner">If things get harder at any point, Tele-MANAS is free and open 24x7 on <a href="tel:14416">14416</a>. Emergency: <a href="tel:112">112</a>.</div>'
      : "";

    const intro = r.urgent
      ? "<p>Thank you for being honest about how hard this is. I'd suggest talking to someone <strong>soon</strong>. Here's the earliest slot with a counselor who focuses on this:</p>"
      : "<p>Here's the one step I'd suggest right now:</p>";

    const primaryCard =
      '<div class="card primary-card' + (r.urgent ? " urgent" : "") + '">' +
      '<span class="type">' + esc(r.urgent ? "Priority · " + p.type : "Recommended · " + p.type) + "</span>" +
      "<h3>" + esc(p.title) + "</h3>" +
      '<p class="desc">' + esc(p.desc) + "</p>" +
      '<div class="effort">' + esc(p.effort) + "</div>" +
      formatPicker(p, "primary") +
      '<button class="btn ' + (r.urgent ? "care" : "primary") + '" data-choose="primary">' + esc(p.cta) + "</button>" +
      '<ul class="why" aria-label="Why this">' + r.reasons.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>" +
      "</div>";

    const alts =
      '<div class="section"><div class="rec-title">Not quite right? Other options</div><div class="alts">' +
      r.alternatives.map((s, i) =>
        '<div class="card"><span class="type">' + esc(s.type) + "</span><h3>" + esc(s.title) + "</h3>" +
        '<p class="desc">' + esc(s.desc) + '</p><div class="effort">' + esc(s.effort) + "</div>" +
        formatPicker(s, "alt" + i) +
        '<button class="btn" data-choose="alt' + i + '">Choose this instead</button></div>'
      ).join("") +
      "</div></div>";

    const arts =
      '<div class="section"><div class="rec-title">Related reads from the blog</div><div class="articles">' +
      r.articles.map((a) =>
        '<div class="article"><span class="kind">' + esc(a.kind) + " · " + a.mins + " min</span>" +
        '<div class="t">' + esc(a.title) + '</div><div class="s">' + esc(a.summary) + "</div></div>"
      ).join("") +
      "</div></div>";

    const a = state.analysis;
    const how =
      '<details class="how"><summary>How was this decided?</summary><table>' +
      row("Safety check", "Passed (no crisis language found)" + (state.safetyFlag ? ". User confirmed they are safe after a flag." : "")) +
      row("Concern detected", r.concernLabel + (a.matchedWords.length ? " (from " + a.matchedWords.join(", ") + ")" : " (nothing specific, so a general starting point)")) +
      row("Intensity", ["", "Low", "Moderate", "High"][r.intensity] + (a.highIntensity.length ? " (text said: " + a.highIntensity.join(", ") + ")" : " (from your answer)")) +
      row("Readiness", { self: "Self-paced", structured: "Wants structure", talk: "Ready to talk", unsure: "Not sure", hesitant: "Hesitant (from your words: " + a.hesitant.join(", ") + ")" }[r.readiness]) +
      row("Rule applied", r.rule) +
      "</table><p class=\"note\">In this prototype, understanding is simulated with transparent phrase matching so it works offline. In production, an LLM would read the message and return these same fields. The safety check and the rule that only catalog services can be recommended stay outside the AI.</p></details>";

    const msg = bot(safety + intro + primaryCard + alts + arts + how +
      '<div class="row section"><span class="note">Was this suggestion helpful?</span><button class="btn ghost" data-fb="yes">Yes</button><button class="btn ghost" data-fb="no">Not really</button></div>',
      "wide");

    wireFormatPickers(msg);
    msg.querySelector('[data-choose="primary"]').addEventListener("click", () => choose(p, pickedFormat(msg, "primary")));
    r.alternatives.forEach((s, i) => msg.querySelector('[data-choose="alt' + i + '"]').addEventListener("click", () => choose(s, pickedFormat(msg, "alt" + i))));
    msg.querySelectorAll("[data-fb]").forEach((b) =>
      b.addEventListener("click", () => {
        const yes = b.dataset.fb === "yes";
        b.parentElement.innerHTML = '<span class="note">' + (yes
          ? "Thanks! Feedback like this helps us improve suggestions."
          : "Thanks for telling us. Try one of the other options above, or tap “Start over” to describe it differently.") + "</span>";
      })
    );
    setComposer('<div class="row"><button class="btn ghost" id="again">Start over</button></div>');
    document.getElementById("again").addEventListener("click", start);
  }

  const FORMATS = [["video", "Video"], ["audio", "Audio"], ["chat", "Chat"]];

  function formatPicker(s, key) {
    if (s.type !== "Counseling session") return "";
    return '<div class="formats" role="radiogroup" aria-label="Session format" data-fmt-group="' + key + '">' +
      '<span class="label">Format:</span>' +
      FORMATS.map(([v, l]) => '<button type="button" class="fmt" role="radio" aria-checked="' + (v === s.format) + '" data-fmt="' + v + '">' + l + "</button>").join("") +
      "</div>";
  }

  function wireFormatPickers(scope) {
    scope.querySelectorAll("[data-fmt-group]").forEach((g) =>
      g.querySelectorAll(".fmt").forEach((b) =>
        b.addEventListener("click", () => {
          g.querySelectorAll(".fmt").forEach((x) => x.setAttribute("aria-checked", "false"));
          b.setAttribute("aria-checked", "true");
        })
      )
    );
  }

  function pickedFormat(scope, key) {
    const b = scope.querySelector('[data-fmt-group="' + key + '"] .fmt[aria-checked="true"]');
    return b ? b.dataset.fmt : null;
  }

  function row(k, v) {
    return "<tr><td>" + esc(k) + "</td><td>" + esc(v) + "</td></tr>";
  }

  /* ---------- 4. Take the step ---------- */
  function choose(s, format) {
    const fmtLabel = format ? (FORMATS.find((f) => f[0] === format) || [, ""])[1] : "";
    user(s.cta + ": " + s.title + (fmtLabel ? " (" + fmtLabel.toLowerCase() + ")" : ""));
    const confirmations = {
      "Counseling session": "<p>Done. Your 45-minute <strong>" + esc(fmtLabel.toLowerCase() || "video") + " session</strong> is booked for <strong>" + esc(s.slot || "the next available slot") + "</strong>" +
        (s.counselor ? " with <strong>" + esc(s.counselor.name) + "</strong>" : " with the first available expert") + ". You'll get a reminder and a private link before it starts.</p>" +
        "<p>You can share as much or as little as you like. Sessions are confidential.</p>",
      Program: "<p>You're in. <strong>Day 1</strong> is unlocked and takes about 10 minutes. We'll send a gentle reminder at a time you choose.</p>",
      "Self-help": "<p>Saved to your space. Whenever you have a few minutes, it's ready. Small steps count.</p>",
      Assessment: "<p>Starting the check... <em>(Demo: questions would appear here.)</em> When you finish, we'll explain the results in plain words and suggest what to do next.</p>"
    };
    setTimeout(() => {
      bot(confirmations[s.type] || "<p>Done.</p>");
      setComposer('<div class="row"><button class="btn primary" id="week">Skip ahead: one week later →</button><button class="btn ghost" id="again2">Start over</button></div>');
      document.getElementById("week").addEventListener("click", () => weekLater(s));
      document.getElementById("again2").addEventListener("click", start);
    }, 300);
  }

  /* ---------- 5. Follow-up one week later ---------- */
  function weekLater(step) {
    setComposer("");
    const div = document.createElement("div");
    div.className = "note";
    div.style.textAlign = "center";
    div.textContent = "— One week later —";
    chat.appendChild(div);
    askOptions("<p>Hi again. Last week you chose <strong>" + esc(step.title) + "</strong>. How did it go?</p>",
      [["helped", "It helped"], ["skipped", "I didn't get to it"], ["worse", "I'm feeling worse"]],
      (val, label) => {
        user(label);
        const r = state.result;
        let html;
        if (val === "helped") {
          const next = r.alternatives.find((s) => s.id !== step.id && s.type !== "Counseling session") || r.alternatives[0];
          html = "<p>That's really good to hear. To build on it, a good next step could be <strong>" + esc(next.title) + "</strong> (" + esc(next.effort) + ").</p>";
        } else if (val === "skipped") {
          const story = r.articles[0];
          html = "<p>That's okay, weeks get busy. Here's something even smaller: a " + story.mins + "-minute read, <strong>" + esc(story.title) + "</strong>. No pressure to do more.</p>";
        } else {
          const e = D.services.expert_chat;
          html = "<p>Thank you for telling me. Let's get you to a person.</p>" +
            '<div class="card urgent"><span class="type">Priority · Counseling session</span><h3>' + esc(e.title) + '</h3><p class="desc">' + esc(e.desc) + '</p><div class="effort">' + esc(e.effort) + "</div></div>" +
            '<p class="note">If you need to talk before then, or feel unsafe at any point: Tele-MANAS <a href="tel:14416">14416</a> (free, 24x7) or emergency <a href="tel:112">112</a>.</p>';
        }
        bot(html);
        setComposer('<div class="row"><button class="btn ghost" id="again3">Start over</button></div>');
        document.getElementById("again3").addEventListener("click", start);
      });
  }

  /* ---------- Crisis path ---------- */
  function showCrisis() {
    bot(
      '<div class="crisis card"><h3>You don\'t have to go through this alone.</h3>' +
      "<p>What you wrote sounds really painful, and I want to make sure you get support from a person right now.</p>" +
      '<div class="helpline">' +
      '<a href="tel:14416"><strong>14416</strong>Tele-MANAS: talk to someone now. Free, 24x7, many languages</a>' +
      '<a href="tel:112"><strong>112</strong>If you are in immediate danger</a>' +
      '<a href="#" id="crisis-chat"><strong>Book earliest session</strong>A YourDOST expert · Next available: ' + esc(D.services.expert_chat.slot) + "</a>" +
      "</div></div>",
      "wide"
    );
    document.getElementById("crisis-chat").addEventListener("click", (e) => {
      e.preventDefault();
      user("Book the earliest session");
      bot("<p>Booked: a 45-minute session with the first available expert at <strong>" + esc(D.services.expert_chat.slot) + "</strong>. You can choose video, audio or chat when it starts.</p>" +
        "<p>Until then, please don't wait alone. Tele-MANAS (<a href=\"tel:14416\">14416</a>) is free and available right now.</p>");
    });
    setComposer('<div class="row"><button class="btn ghost" id="safe">I\'m safe right now. Continue</button><button class="btn ghost" id="again4">Start over</button></div>');
    document.getElementById("safe").addEventListener("click", () => {
      user("I'm safe right now. Continue");
      state.safetyFlag = true;
      setComposer("");
      acknowledge();
    });
    document.getElementById("again4").addEventListener("click", start);
  }

  /* ---------- Test cases panel ---------- */
  function renderTests() {
    const list = document.getElementById("tests-list");
    list.innerHTML = TESTS.map((t, i) => {
      const chipLabels = t.chips.map((id) => D.chips.find((c) => c.id === id).label);
      const input = t.text ? "“" + esc(t.text) + "”" : "(no text)";
      return "<li><div class=\"tname\">" + t.id + " · " + esc(t.name) + "</div>" +
        '<div class="tinput">' + input + (chipLabels.length ? " + tap: " + esc(chipLabels.join(", ")) : "") + "</div>" +
        '<div>Answers: ' + answerText(t) + "</div>" +
        '<div class="texp">Expected: ' + esc(t.expectText) + "</div>" +
        '<button class="btn" data-load="' + i + '">Load this case</button></li>';
    }).join("");
    list.querySelectorAll("[data-load]").forEach((b) => b.addEventListener("click", () => loadTest(TESTS[+b.dataset.load])));
  }

  function answerText(t) {
    if (t.expect.crisis) return "none (crisis screen appears right away)";
    const i = IMPACT.find((x) => x[0] === t.answers.impact)[1];
    const p = PREF.find((x) => x[0] === t.answers.preference)[1];
    return "“" + i + "” → “" + p + "”";
  }

  function loadTest(t) {
    togglePanel(false);
    start();
    document.getElementById("feel").value = t.text;
    t.chips.forEach((id) => {
      const b = composer.querySelector('[data-chip="' + id + '"]');
      if (b) b.setAttribute("aria-pressed", "true");
    });
    hint.innerHTML = "<strong>" + t.id + " loaded.</strong> Click <strong>Continue</strong>, then answer: " + answerText(t) +
      ".<br>Expected: " + esc(t.expectText);
    hint.hidden = false;
  }

  function togglePanel(open) {
    panel.hidden = !open;
    btnTests.setAttribute("aria-expanded", String(open));
  }

  btnTests.addEventListener("click", () => togglePanel(panel.hidden));
  document.getElementById("btn-close-tests").addEventListener("click", () => togglePanel(false));
  document.getElementById("btn-restart").addEventListener("click", () => {
    hint.hidden = true;
    start();
  });

  renderTests();
  start();
})();
