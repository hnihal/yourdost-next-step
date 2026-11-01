/*
  Next-Step Navigator engine (runs fully in the browser, no network).

  In this prototype the "understanding" layer is simulated with transparent, weighted
  phrase matching so the demo is predictable and works offline. In production, step 2
  (analyze) would be an LLM call that returns the same structured fields. The crisis
  check (step 1) and the catalog-only recommendation rules (step 3) stay deterministic
  on purpose, so the AI can never skip a safety check or invent a service.
*/
(function (root) {
  const DATA = root.YD_DATA || (typeof require !== "undefined" ? require("./data.js") : null);

  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .replace(/[‘’]/g, "'")
      .replace(/\s+/g, " ")
      .trim();
  }

  function hasPhrase(text, phrase) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("(^|[^a-z0-9])" + escaped + "([^a-z0-9]|$)").test(text);
  }

  function findPhrases(text, phrases) {
    return phrases.filter((p) => hasPhrase(text, p));
  }

  // Step 1: safety first. Always runs before anything else.
  function checkCrisis(rawText) {
    const text = normalize(rawText);
    const matches = findPhrases(text, DATA.crisisPhrases);
    return { crisis: matches.length > 0, matches };
  }

  // Step 2: understand the message (concern, intensity signals, readiness signals).
  function analyze(rawText, chipIds) {
    const text = normalize(rawText);
    const safety = checkCrisis(text);
    const scores = {};
    const matched = {};

    Object.keys(DATA.concerns).forEach((key) => {
      scores[key] = 0;
      matched[key] = [];
      DATA.concerns[key].keywords.forEach(([phrase, weight]) => {
        if (hasPhrase(text, phrase)) {
          scores[key] += weight;
          matched[key].push(phrase);
        }
      });
    });

    (chipIds || []).forEach((id) => {
      const chip = DATA.chips.find((c) => c.id === id);
      if (chip) {
        scores[chip.concern] += 3;
        matched[chip.concern].push('chip: "' + chip.label + '"');
      }
    });

    let concern = "general";
    let best = 0;
    Object.keys(scores).forEach((key) => {
      if (key !== "general" && scores[key] > best) {
        best = scores[key];
        concern = key;
      }
    });
    if (best === 0 && scores.general > 0) concern = "general";

    const highIntensity = findPhrases(text, DATA.highIntensityPhrases);
    const hesitant = findPhrases(text, DATA.hesitantPhrases);
    const talkReady = findPhrases(text, DATA.talkReadyPhrases);

    return {
      text,
      crisis: safety.crisis,
      crisisMatches: safety.matches,
      concern,
      concernLabel: DATA.concerns[concern].label,
      scores,
      matchedWords: matched[concern],
      highIntensity,
      hesitant,
      talkReady,
      textReadiness: hesitant.length ? "hesitant" : talkReady.length ? "talk" : null
    };
  }

  // Step 3: pick ONE next step from the catalog (stepped care + readiness sizing).
  // answers.impact: "little" | "quite" | "barely"
  // answers.preference: "self" | "structured" | "talk" | "unsure"
  function recommend(analysis, answers) {
    const c = DATA.concerns[analysis.concern];
    const impactLevel = { little: 1, quite: 2, barely: 3 }[answers.impact] || 1;
    const intensity = analysis.highIntensity.length ? 3 : impactLevel;

    let readiness = answers.preference || "unsure";
    if (readiness === "unsure") {
      if (analysis.textReadiness === "hesitant") readiness = "hesitant";
      else if (analysis.textReadiness === "talk") readiness = "talk";
    }

    const reasons = [];
    if (analysis.matchedWords.length) {
      reasons.push("You mentioned " + listWords(analysis.matchedWords) + ", which points to " + c.label + ".");
    } else {
      reasons.push("You didn't name anything specific, and that's completely okay.");
    }
    if (analysis.highIntensity.length) {
      reasons.push("You said " + listWords(analysis.highIntensity) + ", so this is affecting you a lot right now.");
    } else {
      reasons.push(["", "You said it affects you a little.", "You said it affects you quite a bit.", "You said you can barely cope."][impactLevel]);
    }

    let rule, primaryId, altIds, urgent = false, storyFirst = false;

    if (intensity === 3) {
      rule = "High impact: a person first";
      primaryId = "session";
      altIds = ["expert_chat", c.assessment];
      urgent = true;
      reasons.push("When things feel this heavy, talking to a counselor soon helps more than doing it alone.");
    } else if (readiness === "talk") {
      rule = "Ready to talk: counselor matched to the concern";
      primaryId = "session";
      altIds = ["expert_chat", c.program];
      reasons.push("You'd like to talk to someone, so here's a counselor who focuses on " + c.label + ".");
    } else if (readiness === "structured") {
      rule = "Wants structure: guided program";
      primaryId = c.program;
      altIds = [c.assessment, "session"];
      reasons.push("You prefer something structured, so a short guided program fits best.");
    } else if (readiness === "self") {
      rule = "Prefers self-paced: start small on your own";
      primaryId = c.selfHelp;
      altIds = [c.program, "expert_chat"];
      storyFirst = true;
      reasons.push("You'd like to start on your own, so here's a small step you can do today.");
    } else if (analysis.concern === "general") {
      rule = "Unclear concern: a short check to make sense of it";
      primaryId = c.assessment;
      altIds = [c.selfHelp, "expert_chat"];
      storyFirst = true;
      reasons.push("A 3-minute check can help put words to what you're feeling.");
    } else if (intensity === 2) {
      rule = "Unsure but affected: a low-commitment human step";
      primaryId = "expert_chat";
      altIds = [c.assessment, c.selfHelp];
      storyFirst = true;
      reasons.push("You're not sure counseling is for you. A session in chat format lets you talk by text, with no camera or voice, which is an easy way to find out.");
    } else {
      rule = "Unsure and mild: smallest helpful step";
      primaryId = c.selfHelp;
      altIds = [c.assessment, "expert_chat"];
      storyFirst = true;
      reasons.push("Starting small is a good way in. You can always take a bigger step later.");
    }

    const articles = c.articles.map((id) => Object.assign({ id }, DATA.articles[id]));
    if (storyFirst) articles.sort((a, b) => (a.kind === "Warrior story" ? -1 : 1) - (b.kind === "Warrior story" ? -1 : 1));

    return {
      concern: analysis.concern,
      concernLabel: c.label,
      intensity,
      readiness,
      rule,
      urgent,
      primary: buildService(primaryId, c),
      alternatives: altIds.map((id) => buildService(id, c)),
      articles,
      reasons
    };
  }

  function buildService(id, concern) {
    const s = Object.assign({ id }, DATA.services[id]);
    if (id === "session") {
      const counselor = DATA.counselors[concern.counselor];
      s.counselor = counselor;
      s.title = "45-min session with " + counselor.name;
      s.desc = counselor.focus + " · " + counselor.langs + ". Private session by video, audio or chat.";
      s.effort = "45 min · Next available: " + counselor.slot;
      s.slot = counselor.slot;
    }
    return s;
  }

  function listWords(words) {
    const clean = words.map((w) => (w.startsWith("chip:") ? w.replace("chip: ", "") : '"' + w + '"'));
    if (clean.length <= 1) return clean.join("");
    return clean.slice(0, -1).join(", ") + " and " + clean[clean.length - 1];
  }

  // Convenience: run a full test case end to end.
  function run(input) {
    const analysis = analyze(input.text, input.chips);
    if (analysis.crisis) return { crisis: true, analysis };
    return { crisis: false, analysis, result: recommend(analysis, input.answers || {}) };
  }

  const ENGINE = { normalize, checkCrisis, analyze, recommend, run };
  root.YD_ENGINE = ENGINE;
  if (typeof module !== "undefined" && module.exports) module.exports = ENGINE;
})(typeof window !== "undefined" ? window : globalThis);
