# Test cases

Open `index.html` → **Test cases** → **Load this case** to prefill the input, or type it yourself. Then click **Continue** and answer the two follow-ups as listed.

- Follow-up 1, "How much is this affecting your day-to-day life?": *A little* / *Quite a bit* / *I can barely cope*
- Follow-up 2, "What would feel right as a first step?": *Try something on my own* / *A short guided program* / *Talk to someone* / *Not sure yet*

| # | Scenario | Input | Follow-up answers | Expected output |
|---|---|---|---|---|
| TC01 | Hesitant, mild work stress | "Work has been a bit much lately. Probably nothing serious, just tired all the time." | A little → Try something on my own | Work stress → **5-minute stress reset** (self-help). Warrior story shown first. |
| TC02 | Stressed and ready to talk | "My manager keeps piling on deadlines and I'm snapping at my family. I think I need to talk to someone." | Quite a bit → Talk to someone | Work stress → **45-min session with Dr. Ananya Rao** (stress & burnout), video/audio/chat. Alternatives: earliest session with any expert, 21-day stress program. |
| TC03 | Can't sleep, wants structure | "I can't sleep before big reviews, lying awake till 3am for the past few weeks." | Quite a bit → A short guided program | Sleep → **Sleep Better (14 days)**. Alternatives: sleep check, session with Priya Iyer. |
| TC04 | Relationship trouble, unsure counseling is for them | "We keep fighting at home, me and my partner. Not sure if this is something counseling is even for." | Quite a bit → Not sure yet | Relationships → **Earliest session with any available expert**, chat format preselected (low-pressure step sized to hesitancy). Couples Warrior story shown first. |
| TC05 | Severe low mood | "I've been feeling empty for over a month. I can barely get out of bed and I can't cope at work." | I can barely cope → Not sure yet | Low mood, high intensity → **Priority 45-min session with Meera Joshi** (next available today). Alternative: earliest session with any expert. |
| TC06 | Crisis (direct) | "Honestly I don't see the point anymore. I want to end my life." | None | **Crisis screen immediately**, no follow-ups: Tele-MANAS 14416 and emergency 112 first, then book the earliest YourDOST session. |
| TC07 | Career confusion | "I feel stuck in my job and confused about whether to switch careers." | A little → A short guided program | Career → **Career Clarity (3 coaching sessions)**. Alternatives: career clarity check, session with Farhan Shaikh. |
| TC08 | Vague feeling | "I don't know, I just feel off lately." | A little → Not sure yet | Unclear concern → **Wellbeing check** (3-minute assessment). |
| TC09 | Crisis (indirect wording) | "Sometimes I think everyone would be better off without me." | None | **Crisis screen immediately**, even without words like "suicide" or "die". |
| TC10 | Anxiety before meetings | "I get panic attacks before every client meeting and keep overthinking everything." | Quite a bit → Try something on my own | Anxiety → **Box breathing for anxious moments**. Alternatives: Calm Mind program, earliest session with an expert. |
| TC11 | Tap only, no typing | (no text) tap **Can't sleep** | A little → Try something on my own | Sleep → **Wind-down routine**. Shows the app works without typing. |
| TC12 | Figure of speech, not a crisis | "This deadline is killing me lol, so much work." | A little → Try something on my own | **No crisis screen.** Work stress → **5-minute stress reset**. |

## What else to check

- **Validation**: click Continue with nothing typed or tapped → inline error.
- **"I'm safe right now. Continue"** on the crisis screen → normal flow continues, with a helpline reminder on the result.
- **Alternatives**: "Choose this instead" on any alternative works the same as the primary step.
- **Session format**: session cards let you pick Video, Audio or Chat; the confirmation reflects your choice.
- **One week later**: after taking a step, try each answer (It helped / I didn't get to it / I'm feeling worse). "Feeling worse" always routes to a person (earliest session, plus Tele-MANAS).
- **How was this decided?**: expand it on any result to see the detected concern, intensity, readiness and rule.
