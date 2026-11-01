/*
  Synthetic catalog for the YourDOST Next-Step Navigator prototype.
  All services, counselors, time slots and articles are FICTIONAL sample data.
  To use real content, replace the entries below; the engine only relies on the ids.
*/
(function (root) {
  const DATA = {
    concerns: {
      work_stress: {
        label: "work stress",
        keywords: [
          ["work", 2], ["office", 2], ["manager", 3], ["boss", 3], ["deadline", 3], ["deadlines", 3],
          ["workload", 3], ["burnout", 3], ["burnt out", 3], ["burned out", 3], ["overtime", 2],
          ["appraisal", 2], ["reviews", 1], ["meeting", 1], ["meetings", 1], ["project", 1], ["job", 1], ["team", 1]
        ],
        counselor: "c1", selfHelp: "sh_stress", program: "prog_stress", assessment: "assess_stress",
        articles: ["a_stress_1", "a_stress_2"]
      },
      sleep: {
        label: "sleep",
        keywords: [
          ["sleep", 2], ["can't sleep", 3], ["cannot sleep", 3], ["insomnia", 3], ["awake", 2],
          ["3am", 2], ["2am", 2], ["night", 1], ["nights", 1], ["tired", 1], ["exhausted", 1], ["restless", 1]
        ],
        counselor: "c3", selfHelp: "sh_sleep", program: "prog_sleep", assessment: "assess_sleep",
        articles: ["a_sleep_1", "a_sleep_2"]
      },
      anxiety: {
        label: "anxiety",
        keywords: [
          ["anxious", 3], ["anxiety", 3], ["panic", 3], ["worried", 2], ["worry", 2], ["nervous", 2],
          ["overthinking", 2], ["overthink", 2], ["racing heart", 3], ["on edge", 2], ["dread", 2], ["scared", 1]
        ],
        counselor: "c3", selfHelp: "sh_anxiety", program: "prog_anxiety", assessment: "assess_anxiety",
        articles: ["a_anx_1", "a_anx_2"]
      },
      low_mood: {
        label: "low mood",
        keywords: [
          ["empty", 3], ["sad", 2], ["low", 2], ["hopeless", 3], ["numb", 3], ["crying", 2],
          ["get out of bed", 3], ["nothing matters", 3], ["depressed", 3], ["lonely", 2],
          ["unmotivated", 2], ["no energy", 2]
        ],
        counselor: "c4", selfHelp: "sh_mood", program: "prog_mood", assessment: "assess_mood",
        articles: ["a_mood_1", "a_mood_2"]
      },
      relationships: {
        label: "relationships",
        keywords: [
          ["partner", 3], ["wife", 3], ["husband", 3], ["girlfriend", 3], ["boyfriend", 3],
          ["marriage", 3], ["fighting", 2], ["fight", 2], ["breakup", 3], ["break up", 3],
          ["family", 1], ["parents", 1], ["in-laws", 2], ["home", 1], ["argue", 2], ["arguing", 2]
        ],
        counselor: "c2", selfHelp: "sh_relationship", program: "prog_relationship", assessment: "assess_relationship",
        articles: ["a_rel_1", "a_rel_2"]
      },
      career: {
        label: "career direction",
        keywords: [
          ["career", 3], ["careers", 3], ["switch", 2], ["stuck", 2], ["promotion", 2], ["growth", 1],
          ["future", 1], ["confused", 1], ["job change", 3], ["quit", 2], ["purpose", 1]
        ],
        counselor: "c5", selfHelp: "sh_career", program: "prog_career", assessment: "assess_career",
        articles: ["a_career_1", "a_career_2"]
      },
      general: {
        label: "how you're feeling",
        keywords: [],
        counselor: "c1", selfHelp: "sh_general", program: "prog_general", assessment: "assess_general",
        articles: ["a_gen_1", "a_gen_2"]
      }
    },

    // Mood chips on the welcome screen -> concern they add weight to
    chips: [
      { id: "chip_work", label: "Stress at work", concern: "work_stress" },
      { id: "chip_sleep", label: "Can't sleep", concern: "sleep" },
      { id: "chip_anx", label: "Anxious or worried", concern: "anxiety" },
      { id: "chip_low", label: "Feeling low", concern: "low_mood" },
      { id: "chip_rel", label: "Relationship trouble", concern: "relationships" },
      { id: "chip_career", label: "Career confusion", concern: "career" },
      { id: "chip_unsure", label: "Not sure / just feel off", concern: "general" }
    ],

    // Phrases that always route to human crisis support (checked BEFORE anything else)
    crisisPhrases: [
      "kill myself", "end my life", "end it all", "suicide", "suicidal", "want to die",
      "don't want to live", "dont want to live", "better off without me", "no reason to live",
      "don't see the point anymore", "hurt myself", "harm myself", "self harm", "self-harm",
      "cut myself", "not wake up", "take my own life"
    ],

    // Phrases that raise intensity to "high" regardless of the follow-up answer
    highIntensityPhrases: [
      "can't cope", "cannot cope", "can't handle", "barely", "falling apart", "breaking down",
      "can't function", "can't stop crying", "every single day", "at my limit"
    ],

    // Hesitancy / readiness signals (stages-of-change lens)
    hesitantPhrases: [
      "probably nothing", "not sure if", "not sure whether", "overreacting", "not that serious",
      "is this normal", "don't know if", "just tired", "maybe it's nothing", "not a big deal"
    ],
    talkReadyPhrases: [
      "talk to someone", "speak to someone", "need help", "counselor", "counsellor",
      "therapist", "therapy", "professional", "talk to a"
    ],

    counselors: {
      c1: { name: "Dr. Ananya Rao", focus: "Stress & burnout", langs: "English, Hindi, Kannada", slot: "Today, 7:30 PM" },
      c2: { name: "Rahul Menon", focus: "Relationships & family", langs: "English, Malayalam", slot: "Tomorrow, 6:00 PM" },
      c3: { name: "Priya Iyer", focus: "Anxiety & sleep", langs: "English, Tamil", slot: "Today, 8:00 PM" },
      c4: { name: "Meera Joshi", focus: "Low mood & grief", langs: "English, Hindi, Marathi", slot: "Today, 6:30 PM" },
      c5: { name: "Farhan Shaikh", focus: "Career coaching", langs: "English, Hindi, Urdu", slot: "Tomorrow, 11:00 AM" }
    },

    services: {
      // Earliest session with ANY available expert, defaulting to chat format (text only, no camera or voice).
      expert_chat: { type: "Counseling session", title: "Earliest session with any available expert", desc: "A 45-minute session with whichever expert is free first. Chat format is preselected, so you can talk by text with no camera or voice.", effort: "45 min · Next available: Today, 9:15 PM", cta: "Book this session", format: "chat", slot: "Today, 9:15 PM" },
      // Session with the counselor matched to the concern (name, focus and slot filled in by the engine).
      session: { type: "Counseling session", title: "Session with a counselor", desc: "A private 45-minute session with a licensed counselor.", effort: "45 min", cta: "Book this session", format: "video" },

      assess_stress: { type: "Assessment", title: "Work stress check", desc: "8 quick questions that show how much work is weighing on you.", effort: "3 min", cta: "Take the check" },
      assess_sleep: { type: "Assessment", title: "Sleep check", desc: "Understand your sleep pattern and what may be disturbing it.", effort: "3 min", cta: "Take the check" },
      assess_anxiety: { type: "Assessment", title: "Anxiety check", desc: "A short check on how often worry is getting in the way.", effort: "3 min", cta: "Take the check" },
      assess_mood: { type: "Assessment", title: "Mood check", desc: "A short check on your mood over the last two weeks.", effort: "3 min", cta: "Take the check" },
      assess_relationship: { type: "Assessment", title: "Relationship health check", desc: "Reflect on communication, conflict and support at home.", effort: "4 min", cta: "Take the check" },
      assess_career: { type: "Assessment", title: "Career clarity check", desc: "See where you're stuck: skills, values or direction.", effort: "5 min", cta: "Take the check" },
      assess_general: { type: "Assessment", title: "Wellbeing check", desc: "Not sure what's going on? 8 questions to make sense of it.", effort: "3 min", cta: "Take the check" },

      prog_stress: { type: "Program", title: "Beat Workplace Stress (21 days)", desc: "10 minutes a day: boundaries, energy and switching off after work.", effort: "10 min/day", cta: "Start Day 1" },
      prog_sleep: { type: "Program", title: "Sleep Better (14 days)", desc: "A guided routine to quiet a busy mind and reset your sleep.", effort: "10 min/night", cta: "Start Day 1" },
      prog_anxiety: { type: "Program", title: "Calm Mind (21 days)", desc: "Practical tools for worry, overthinking and panic.", effort: "10 min/day", cta: "Start Day 1" },
      prog_mood: { type: "Program", title: "Lift Your Mood (28 days)", desc: "Small daily actions that rebuild energy and motivation.", effort: "10 min/day", cta: "Start Day 1" },
      prog_relationship: { type: "Program", title: "Stronger Together (14 days)", desc: "Communication and conflict skills you can try at home.", effort: "10 min/day", cta: "Start Day 1" },
      prog_career: { type: "Program", title: "Career Clarity (3 coaching sessions)", desc: "Work with a career coach to map strengths, values and options.", effort: "3 × 45 min", cta: "Start the program" },
      prog_general: { type: "Program", title: "Everyday Resilience (14 days)", desc: "Build simple habits that help on harder days.", effort: "10 min/day", cta: "Start Day 1" },

      sh_stress: { type: "Self-help", title: "5-minute stress reset", desc: "A short guided exercise to decompress between meetings or after work.", effort: "5 min", cta: "Try it now" },
      sh_sleep: { type: "Self-help", title: "Wind-down routine", desc: "An audio-guided routine for the 20 minutes before bed.", effort: "10 min", cta: "Try it tonight" },
      sh_anxiety: { type: "Self-help", title: "Box breathing for anxious moments", desc: "A 4-minute technique you can use right before a meeting.", effort: "4 min", cta: "Try it now" },
      sh_mood: { type: "Self-help", title: "Small wins journal", desc: "Note one small thing each day. It adds up faster than you think.", effort: "3 min/day", cta: "Start journaling" },
      sh_relationship: { type: "Self-help", title: "Calm conversation guide", desc: "A step-by-step guide for the next difficult conversation.", effort: "8 min read", cta: "Open the guide" },
      sh_career: { type: "Self-help", title: "Strengths & values worksheet", desc: "A short worksheet to find what matters to you at work.", effort: "15 min", cta: "Open worksheet" },
      sh_general: { type: "Self-help", title: "Daily 1-minute check-in", desc: "Name your mood once a day and spot patterns over time.", effort: "1 min/day", cta: "Start check-ins" }
    },

    // Blog-style articles (fictional). "story" = first-person "Warrior" style stories.
    articles: {
      a_stress_1: { kind: "Explainer", title: "Is it stress or burnout? 5 signs to notice", mins: 4, summary: "How everyday pressure differs from burnout, and when it's worth getting support." },
      a_stress_2: { kind: "Warrior story", title: "Arjun's story: \"I thought being tired all the time was normal\"", mins: 5, summary: "A software lead on how one conversation with a counselor changed how he handled work." },
      a_sleep_1: { kind: "Explainer", title: "Why your mind gets loud at 2 a.m.", mins: 4, summary: "What happens when stress follows you to bed, and small changes that help." },
      a_sleep_2: { kind: "Warrior story", title: "Sana's story: sleeping again after review season", mins: 5, summary: "How a two-week routine helped her stop lying awake before big deadlines." },
      a_anx_1: { kind: "Explainer", title: "Panic before meetings: what's happening in your body", mins: 4, summary: "The body's alarm system explained, and three ways to calm it in the moment." },
      a_anx_2: { kind: "Warrior story", title: "Kiran's story: from dreading Mondays to speaking up", mins: 6, summary: "Overthinking every client call, and what finally made it manageable." },
      a_mood_1: { kind: "Explainer", title: "Feeling empty isn't laziness", mins: 4, summary: "Why low mood drains energy, and why reaching out early makes a difference." },
      a_mood_2: { kind: "Warrior story", title: "Neha's story: \"Therapy isn't only for the weak\"", mins: 6, summary: "What she was afraid of before her first session, and what it was actually like." },
      a_rel_1: { kind: "Explainer", title: "Fighting more than usual? Start here", mins: 5, summary: "Common patterns behind repeated arguments, and how to break the loop." },
      a_rel_2: { kind: "Warrior story", title: "Vikram's story: we tried counseling, nervously", mins: 6, summary: "A couple on how they decided counseling was 'for people like us' too." },
      a_career_1: { kind: "Explainer", title: "Feeling stuck vs. needing a change", mins: 4, summary: "Questions that help separate a rough patch from a real need to switch." },
      a_career_2: { kind: "Warrior story", title: "Deepa's story: finding clarity with a coach", mins: 5, summary: "Three coaching sessions that turned a vague restlessness into a plan." },
      a_gen_1: { kind: "Explainer", title: "Not sure what you're feeling? That's okay", mins: 3, summary: "Why 'I just feel off' is a valid place to start, and how to make sense of it." },
      a_gen_2: { kind: "Warrior story", title: "Rohan's story: the day I just said \"I feel off\"", mins: 5, summary: "How a vague feeling turned into a clear next step." }
    }
  };

  root.YD_DATA = DATA;
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
})(typeof window !== "undefined" ? window : globalThis);
