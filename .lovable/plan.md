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

## Speaking script (about 7 minutes)

**Slide 1 – Title**
"Hi, I'm [name]. This is PerspectiveShift AI, the app I built during [challenge name]. I'll explain how I put it together, then show it working."

**Slide 2 – The problem**
"When we face a decision, it's easy to take the first answer we get. I wanted a tool that helps people look at a problem through other people's eyes before they decide."

**Slide 3 – What the app does**
"You describe a situation and pick two to four viewpoints. The app then takes you through five steps: Perspectives, Compare, Challenge, Build and Reflect. The final plan is still written by you."

**Slide 4 – How it's built**
"The interface uses React, TypeScript and Tailwind. The server side uses TanStack Start server functions, and the app is hosted on Lovable, so anyone can open it from a link."

**Slide 5 – AI model and request flow**
"The app uses Gemini 3.1 Flash Lite through the Lovable AI Gateway. When you submit, the browser first hides common personal details. The server then checks the input and asks the model for a fixed JSON format, so every card comes back with the same sections. The API key never reaches the browser."

**Slide 6 – Privacy and safety**
"Before sending, the app replaces emails, phone numbers, labelled IDs, visa types and some university names with placeholders. A short reminder also asks people to use made-up details. The instructions tell the model to treat whatever the user types as content, not as commands. Nothing is stored in a database."

**Slide 7 – Testing**
"I wrote automated tests for the input rules, the masking and the AI instructions, and they all pass. I also went through fifteen acceptance tests on the live app. In the browser's network tab, responses came back in under five seconds."

**Slide 8 – What I learned**
"The biggest lesson was moving from reading about AI to actually building with it. Daily checkpoints helped me plan, and seeing what others were building gave me new ideas. Now let me show you the app."

**Demo – the main flow**
"I'll start with a problem. I'm adding a fake email so you can see it gets replaced in the preview below. I'll pick Student and Employer, and add my own perspective, Store Cashier.
Each card shows priorities, concerns, opportunities and a suggested action, and I can mark whether it was helpful. Compare shows where the viewpoints agree and differ. Challenge asks three questions to test my assumptions.
In Build, I tick the insights I want, add a thought of my own, and draft a solution. I can still edit it. Reflect brings everything together, and I can copy or download it."

**Demo – trying to break it**
"Now let's see how it handles mistakes. A very short problem is rejected. One perspective isn't enough. If I type random letters, an insult, or a name that's already listed, like Student, it's turned down.
I'll go offline in DevTools and generate. A clear message appears with a Retry button, and my text is still there. I'll also try telling it to ignore its instructions. It carries on with the analysis as normal. Last, New problem clears everything for a fresh start."

**Closing**
"That's PerspectiveShift AI. The live link and GitHub repository are in the description. Thank you for watching, and I'd be glad to hear any feedback."
