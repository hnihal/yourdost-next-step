/*
  Test cases for the Next-Step Navigator.
  Each case: what to type (and/or which chips to tap), how to answer the two follow-ups,
  and what the app should recommend. Used by the "Test cases" panel in index.html
  and checked automatically by test-runner.html.

  Follow-up 1 (impact):      little = "A little" | quite = "Quite a bit" | barely = "I can barely cope"
  Follow-up 2 (preference):  self = "Try something on my own" | structured = "A short guided program"
                             talk = "Talk to someone" | unsure = "Not sure yet"
*/
(function (root) {
  const TESTS = [
    {
      id: "TC01", name: "Hesitant, mild work stress",
      text: "Work has been a bit much lately. Probably nothing serious, just tired all the time.",
      chips: [], answers: { impact: "little", preference: "self" },
      expect: { crisis: false, concern: "work_stress", primary: "sh_stress" },
      expectText: "Work stress → 5-minute stress reset (self-help). A Warrior story is shown first."
    },
    {
      id: "TC02", name: "Stressed and ready to talk",
      text: "My manager keeps piling on deadlines and I'm snapping at my family. I think I need to talk to someone.",
      chips: [], answers: { impact: "quite", preference: "talk" },
      expect: { crisis: false, concern: "work_stress", primary: "session", counselor: "Dr. Ananya Rao" },
      expectText: "Work stress → 45-min session with Dr. Ananya Rao (stress & burnout). Alternatives: earliest session with any expert, 21-day stress program."
    },
    {
      id: "TC03", name: "Can't sleep, wants structure",
      text: "I can't sleep before big reviews, lying awake till 3am for the past few weeks.",
      chips: [], answers: { impact: "quite", preference: "structured" },
      expect: { crisis: false, concern: "sleep", primary: "prog_sleep" },
      expectText: "Sleep → Sleep Better (14-day program). Alternatives: sleep check, session with Priya Iyer."
    },
    {
      id: "TC04", name: "Relationship trouble, unsure counseling is for them",
      text: "We keep fighting at home, me and my partner. Not sure if this is something counseling is even for.",
      chips: [], answers: { impact: "quite", preference: "unsure" },
      expect: { crisis: false, concern: "relationships", primary: "expert_chat" },
      expectText: "Relationships → earliest 45-min session with any available expert, chat format preselected (low-pressure step sized to hesitancy). Warrior story about trying couples counseling shown first."
    },
    {
      id: "TC05", name: "Severe low mood (high intensity)",
      text: "I've been feeling empty for over a month. I can barely get out of bed and I can't cope at work.",
      chips: [], answers: { impact: "barely", preference: "unsure" },
      expect: { crisis: false, concern: "low_mood", primary: "session", counselor: "Meera Joshi", urgent: true },
      expectText: "Low mood, high intensity → priority 45-min session with Meera Joshi (next available today). Alternative: earliest session with any available expert."
    },
    {
      id: "TC06", name: "Crisis (direct)",
      text: "Honestly I don't see the point anymore. I want to end my life.",
      chips: [], answers: {},
      expect: { crisis: true },
      expectText: "Crisis screen immediately, no follow-up questions: Tele-MANAS 14416 and emergency 112 first, then the earliest YourDOST session."
    },
    {
      id: "TC07", name: "Career confusion, wants structure",
      text: "I feel stuck in my job and confused about whether to switch careers.",
      chips: [], answers: { impact: "little", preference: "structured" },
      expect: { crisis: false, concern: "career", primary: "prog_career" },
      expectText: "Career → Career Clarity (3 coaching sessions). Alternatives: career clarity check, session with Farhan Shaikh."
    },
    {
      id: "TC08", name: "Vague feeling, nothing specific",
      text: "I don't know, I just feel off lately.",
      chips: [], answers: { impact: "little", preference: "unsure" },
      expect: { crisis: false, concern: "general", primary: "assess_general" },
      expectText: "Unclear concern → 3-minute wellbeing check to make sense of it."
    },
    {
      id: "TC09", name: "Crisis (indirect wording)",
      text: "Sometimes I think everyone would be better off without me.",
      chips: [], answers: {},
      expect: { crisis: true },
      expectText: "Crisis screen immediately, even though the words 'suicide' or 'die' are never used."
    },
    {
      id: "TC10", name: "Anxiety before meetings, self-paced",
      text: "I get panic attacks before every client meeting and keep overthinking everything.",
      chips: [], answers: { impact: "quite", preference: "self" },
      expect: { crisis: false, concern: "anxiety", primary: "sh_anxiety" },
      expectText: "Anxiety → box breathing (4 min self-help). Alternatives: Calm Mind program, earliest session with an expert."
    },
    {
      id: "TC11", name: "Tap only, no typing",
      text: "",
      chips: ["chip_sleep"], answers: { impact: "little", preference: "self" },
      expect: { crisis: false, concern: "sleep", primary: "sh_sleep" },
      expectText: "Tap the 'Can't sleep' chip only → wind-down routine (self-help). Shows the app works without typing."
    },
    {
      id: "TC12", name: "Figure of speech is NOT a crisis",
      text: "This deadline is killing me lol, so much work.",
      chips: [], answers: { impact: "little", preference: "self" },
      expect: { crisis: false, concern: "work_stress", primary: "sh_stress" },
      expectText: "No crisis screen (everyday expression). Work stress → 5-minute stress reset."
    }
  ];

  root.YD_TESTS = TESTS;
  if (typeof module !== "undefined" && module.exports) module.exports = TESTS;
})(typeof window !== "undefined" ? window : globalThis);
