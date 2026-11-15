# Explainer Video Plan (under 8 minutes)

No app changes are needed. This plan covers the Canva slides and the recording.

## Time split
- Slides: about 3 to 3.5 minutes (8 slides, around 25 seconds each)
- Live demo: about 4 minutes
- Closing: about 30 seconds

## Canva slides (8)
1. **Title.** PerspectiveShift AI, your name, the challenge name, and the live link.
2. **The problem.** People often accept one quick answer instead of looking at a situation from several viewpoints.
3. **What the app does.** The five steps: Perspectives, Compare, Challenge, Build, Reflect.
4. **How it is built.** React 19 with TypeScript and Tailwind for the interface, TanStack Start server functions for the backend, and Lovable hosting.
5. **AI model and request flow.** Gemini 3.1 Flash Lite through the Lovable AI Gateway. The request flow goes from problem text, to browser masking, to server checks, to a strict JSON structure, to the model, and finally to the cards. The key stays on the server.
6. **Privacy and safety.** Browser masking (emails, phones, labelled IDs, visa terms, institutions), the privacy reminder, prompt-injection instructions, and nothing saved in a database.
7. **Testing.** Automated tests passing, the acceptance sheet with 15 cases, and responses under 5 seconds in DevTools.
8. **What I learned and links.** A short reflection, plus the GitHub and live app links.

## Live demo, "makes and breaks" (about 4 minutes)
**Makes (around 2.5 minutes)**
- Load the example, or type a problem.
- Choose presets and add a custom perspective.
- Show the masking preview with a fake email.
- Generate, then walk through the cards, Compare, Challenge, Build (count, thoughts, Draft) and Reflect (copy and download).

**Breaks (around 1.5 minutes)**
- A problem under 20 characters gets rejected.
- Only one perspective selected gets rejected.
- Custom labels like "fgd", "freak" or "student" are rejected, with no Retry button.
- Going offline in DevTools shows the connection error and Retry, and the text is kept.
- A prompt-injection attempt in the problem text: the app still follows its task.
- New problem clears everything.

## Recording tips
- Record with Loom or Zoom with your screen and voice. Present the Canva slides first, then switch to the live link.
- Do a timed rehearsal and aim for 7 to 7.5 minutes.
- Upload to Google Drive and set sharing to "Anyone with the link can view".
