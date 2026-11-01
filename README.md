# YourDOST Next Step: AI-powered navigator (prototype)

Helps an employee go from a vague feeling ("work has been a lot, probably nothing") to **one right-sized next step**: a self-help exercise, an assessment, a guided program, or a 45-minute counseling session (video, audio or chat). Anyone in crisis goes straight to a human.

## How to open it

1. Unzip the folder.
2. Double-click `index.html`. It opens in any modern browser (Chrome, Edge, Firefox, Safari).

No installation, no internet, no accounts. Everything runs locally in the browser.

To get a shareable live link, drag the unzipped folder onto https://app.netlify.com/drop (or push it to GitHub Pages).

## How to try it

- Click **Test cases** (top right), pick a case and click **Load this case**. A yellow hint shows which follow-up answers to click and what you should see.
- Or open `test-runner.html` to run all 12 cases automatically (should show 12 / 12 passed).
- Full list with inputs and expected outputs: `TEST_CASES.md`.

## The journey

1. **Welcome**: privacy note, free text and/or tap chips.
2. **Safety check**: crisis language skips everything and shows immediate human help (Tele-MANAS 14416, emergency 112) plus the earliest YourDOST session.
3. **Two follow-ups**: how much it affects daily life, and what kind of first step feels right.
4. **Recommendation**: one primary step with "why this", two alternatives, related blog reads (Warrior stories first for hesitant users), and a "How was this decided?" panel.
5. **Take the step**: booking or enrolment confirmation (simulated). Sessions are 45 minutes; the user picks video, audio or chat, and availability is shown as "Next available".
6. **One week later**: a simulated check-in that adapts (helped / didn't get to it / feeling worse).

## How the "AI" works in this prototype

| Layer | Prototype | Production |
|---|---|---|
| Safety check | Phrase list, always runs first | Same rules **plus** a classifier; never left to the LLM alone |
| Understanding (concern, intensity, readiness) | Weighted phrase matching (`engine.js` → `analyze`) | LLM call returning the same structured fields |
| Recommendation | Stepped-care + readiness rules over a fixed catalog (`recommend`) | Same rules; the LLM can only pick catalog IDs, so it can't invent services |
| Explanation | Template "why" bullets | LLM-written explanation, grounded in the chosen rule |

Understanding is simulated so the demo is predictable, works offline and needs no API key in the browser.

## Files

| File | What it is |
|---|---|
| `index.html` | The app |
| `styles.css` | Styling |
| `app.js` | Screens and conversation flow |
| `engine.js` | Safety check, understanding and recommendation logic |
| `data.js` | Fictional catalog: services, counselors, articles, keywords |
| `tests.js` | The 12 test cases (used by the app and the test runner) |
| `test-runner.html` | Runs all test cases automatically |
| `TEST_CASES.md` | Human-readable test cases |

All counselors, services, time slots and articles are fictional sample data. To use real blog posts, replace the entries in `data.js` → `articles`.
