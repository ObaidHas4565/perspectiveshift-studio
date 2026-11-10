# PerspectiveShift AI

PerspectiveShift AI is a prototype that helps people consider a problem from different viewpoints before forming their own solution. It is intended to support critical thinking, rather than provide a single answer to follow.

A user describes a situation, selects the people whose perspectives they would like to explore, and reviews the AI's suggestions. They can compare those viewpoints, question their assumptions, and write a response in their own words.

## Access

- [Open the development preview](https://id-preview--cc497cd7-4c52-4bb7-84e2-0a76898bbad7.lovable.app). Access may depend on the project's preview settings.
- A published application link has not yet been added to this README.
- The project can also be opened in VS Code and run locally using the instructions below.

## How it works

1. **Describe the problem.** Enter between 20 and 1,000 characters, excluding leading and trailing spaces.
2. **Choose perspectives.** Select two to four of the six available roles: Student, Employer, University / Educator, Industry Professional, Customer / End User, and AI / Technology Specialist.
3. **Review the perspectives.** Each role receives a card covering priorities, concerns, opportunities, and a suggested action. Thumbs-up and thumbs-down buttons let the user mark whether a card was helpful.
4. **Compare and question.** The app presents similarities, differences, and three questions intended to challenge the user's assumptions.
5. **Build a solution.** The user selects useful insights, optionally adds them to a draft, and writes their own solution.
6. **Reflect.** A summary brings together the original problem, perspectives explored, card ratings, selected insights, and final solution.

The five views—Perspectives, Compare, Challenge, Build, and Reflect—can be revisited without making another AI request. The example button fills in a sample problem and four perspectives; it does not generate results until the user submits it.

## AI model and request flow

The current model is **Google Gemini 3.1 Flash Lite** (`google/gemini-3.1-flash-lite`), called through the Lovable AI Gateway SDK. The app does not call Google's API directly.

```text
Problem and selected roles
    → Server-side input checks
    → Prompt and required JSON structure
    → Gemini 3.1 Flash Lite through Lovable AI Gateway
    → Perspective cards, comparisons, and challenge questions
    → User's selected insights, draft, and reflection
```

The prompt asks for distinct viewpoints, brief responses, and practical actions. It instructs the model not to invent facts or statistics, and not to decide the solution for the user. A strict JSON schema defines the fields needed by the interface.

The API key stays on the server. Each successful submission generates the perspectives, comparison, and questions together. Ratings, insight selection, drafting, and the reflection summary are handled in the browser.

This is a guided AI-assisted workflow, not an autonomous multi-agent system. The roles are viewpoints produced in one model request, not separate agents. There is no web search, document retrieval, model training, or external action-taking.

## Running locally

The application uses React 19, TypeScript, TanStack Start, Vite, and Tailwind CSS. Bun is suitable for installing dependencies and running the project; Node.js with npm is another option.

After opening a local copy of the repository in VS Code, run:

```sh
bun install
bun run dev
```

Or, with npm:

```sh
npm install
npm run dev
```

Open the local address printed in the terminal. In the Lovable development environment, the app uses port 8080.

**AI access is a separate requirement.** The interface can run locally, but generating perspectives requires valid Lovable AI Gateway access and available credits. Outside the managed environment, the server needs `LOVABLE_API_KEY` supplied securely as an environment variable. An exported copy does not include that secret. A Google API key is not a replacement for it in the current implementation.

Never commit API keys or include them in variables prefixed with `VITE_`, which are intended for browser code.

### Project commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Start the development server. |
| `bun run test` | Run the automated tests. |
| `bun run test:watch` | Run tests while working on changes. |
| `bun run build` | Create a production build. |
| `bun run build:dev` | Build using development mode. |
| `bun run preview` | Preview the built application locally. |
| `bun run lint` | Check the source against the project's lint rules. |
| `bun run format` | Format project files with Prettier. |

The same script names can be used with `npm run`.

## Files and their purposes

### Application files

| File | Purpose |
| --- | --- |
| `src/routes/index.tsx` | The main interface and five-step workflow, including inputs, role selection, retry, feedback, insights, draft, and reflection. Also defines the page title and description. |
| `src/routes/__root.tsx` | Shared page structure, fonts, stylesheet, query provider, and missing-page and error displays. |
| `src/routes/README.md` | Notes on the project's file-based routing conventions. |
| `src/lib/perspectives.ts` | Role names and focus areas, shared input limits, input validation, and result types. |
| `src/lib/perspectives.functions.ts` | Server-side validation, prompt, JSON schema, Gemini request, response handling, and AI error messages. |
| `src/router.tsx` | Creates the router and a separate query client for each server request. |
| `src/routeTree.gen.ts` | Generated route list; maintained by the routing tools rather than edited manually. |
| `src/start.ts` | Request middleware, including server error handling and protection against cross-site server-function requests. |
| `src/server.ts` | Server entry wrapper that displays an error page when a serious rendering failure occurs. |
| `src/styles.css` | Global styles, theme colours, typography, and shared visual tokens. |
| `src/ai-gateway.types.ts` | Loads the generated model type declarations for TypeScript. |
| `src/generated/ai-gateway/models.d.ts` | Generated model declarations for JavaScript module imports. |
| `src/generated/ai-gateway/models.d.cts` | Corresponding generated declarations for CommonJS imports. |
| `src/hooks/use-mobile.tsx` | Shared hook for checking the mobile breakpoint. |
| `src/lib/utils.ts` | Utility for combining CSS class names. |
| `src/lib/error-capture.ts` | Captures and formats errors so server diagnostics retain useful details. |
| `src/lib/error-page.ts` | Produces the fallback HTML error page. |
| `src/lib/lovable-error-reporting.ts` | Reports application errors to Lovable's error-reporting service. |

### Interface library

`src/components/ui/` contains reusable interface files supplied with the project template. The main page currently imports `button.tsx` and `textarea.tsx`; the remaining files are available for other interface needs and are not all used by this prototype.

| Files | Purpose |
| --- | --- |
| `button.tsx`, `toggle.tsx`, `toggle-group.tsx` | Buttons and selectable toggle controls. |
| `input.tsx`, `textarea.tsx`, `input-otp.tsx`, `label.tsx`, `form.tsx` | Text entry, code entry, labels, and form helpers. |
| `checkbox.tsx`, `radio-group.tsx`, `select.tsx`, `switch.tsx`, `slider.tsx` | Selection controls and adjustable values. |
| `tabs.tsx`, `navigation-menu.tsx`, `menubar.tsx`, `breadcrumb.tsx`, `pagination.tsx`, `sidebar.tsx` | Navigation and switching between views. |
| `dialog.tsx`, `alert-dialog.tsx`, `drawer.tsx`, `sheet.tsx` | Dialogs, confirmations, and panels. |
| `dropdown-menu.tsx`, `context-menu.tsx`, `command.tsx` | Action menus and searchable command lists. |
| `popover.tsx`, `hover-card.tsx`, `tooltip.tsx` | Small contextual displays. |
| `accordion.tsx`, `collapsible.tsx` | Expandable content. |
| `card.tsx`, `table.tsx`, `chart.tsx`, `calendar.tsx`, `carousel.tsx` | Structured content, tables, charts, dates, and image or content slides. |
| `alert.tsx`, `badge.tsx`, `progress.tsx`, `skeleton.tsx`, `sonner.tsx` | Status messages, labels, loading indicators, and notifications. |
| `avatar.tsx`, `aspect-ratio.tsx`, `resizable.tsx`, `scroll-area.tsx`, `separator.tsx` | Profile images, proportions, resizing, scrolling, and visual separation. |

### Tests

| File | Purpose |
| --- | --- |
| `src/test/perspectives.test.ts` | Tests the problem-length and perspective-count rules. |
| `src/test/perspectives.functions.test.ts` | Checks the Gemini model selection and response mapping using a mocked model call, without spending AI credits. |
| `src/test/app-routing.test.tsx` | Checks that the home address matches an application page. |
| `src/test/setup.ts` | Shared browser test setup. |
| `vitest.config.ts` | Test environment, file matching, and import aliases. |

### Configuration and supporting files

| File | Purpose |
| --- | --- |
| `README.md` | Project overview, operation, setup, file reference, and limitations. |
| `AGENTS.md` | Repository guidance and project development rules. |
| `roadmap.md` | Short checklist for the current requested changes and verification. |
| `package.json` | Dependencies and development commands. |
| `bun.lock` / `package-lock.json`, when present | Record dependency versions for the package manager used. |
| `bunfig.toml` | Bun installation settings, including the package release-age check. |
| `vite.config.ts` | Development and production configuration, including the custom server entry. |
| `tsconfig.json` | TypeScript compiler and source settings. |
| `eslint.config.js` | Code-checking rules. |
| `.prettierrc`, `.prettierignore` | Formatting settings and files excluded from formatting. |
| `components.json` | Configuration for the reusable interface library and its import aliases. |
| `.gitignore` | Excludes dependencies, generated output, logs, and some local settings from version control. It does not exclude every possible secret file. |
| `public/favicon.ico` | Browser tab icon. |
| `public/robots.txt` | Instructions for search-engine crawlers. |
| `.lovable/project.json` | Lovable project configuration. |
| `.lovable/north-star/north-star.md` | Project purpose and its proposed measure of progress. |

Folders such as `node_modules`, `dist`, and `.output` are installed dependencies or generated output, rather than application source. Git metadata records repository history and is not part of the application.

## Privacy and data handling

- **Browser-side masking.** Before every generation request, including retries, the browser replaces detected details with labels such as `[EMAIL]` and `[INSTITUTION]`. This uses local pattern matching, with no additional AI calls, subscriptions, or per-use masking charges. AI generation still uses Gateway credits.
- **Coverage is limited.** The filter covers email addresses, some common phone formats, labelled passport/student/national IDs, listed visa terms (F-1, J-1, H-1B, Tier 2/4, Golden Visa, and student visa), and some capitalised full university, college, or institute names. It can miss other formats, abbreviations, names, addresses, and sensitive details. It may also mask text unnecessarily. It does not reliably detect personal issues, health details, or identifying combinations of facts.
- **Review before sending.** When masking changes the problem, the form shows the text that will be sent. Users can edit the original description to remove anything else. Masking reduces exposure; it does not guarantee anonymity or confidentiality.
- **AI requests still leave the browser.** The masked problem and selected roles are sent to the server and AI service. The original problem is not included in that application request, but any sensitive details the filter misses remain in the sent text. Hosting and AI-service logging and retention are separate from the app's own storage.
- **Nothing is saved by the application.** The original problem, results, ratings, selected insights, and draft stay in page memory. The original problem remains visible in the form and reflection summary on that device; refreshing or closing the page clears the session. There is no application database or saved session.
- **Feedback is temporary.** Card ratings appear in the reflection summary, but are not collected centrally or used to train the model.

## Limitations

- **Results are suggestions.** The model can be wrong or oversimplify a group's perspective. The prompt discourages invented facts, but it cannot guarantee accuracy. Important claims still need checking.
- **Gemini is not unlimited or inherently free here.** Requests use Lovable AI Gateway credits and require available workspace allowance or balance. This implementation does not use Google AI Studio's free tier or a daily-reset token quota. Selecting a lighter model does not restore exhausted credits.
- **Response time varies.** Generation requires an internet connection and depends on service availability and request length. No fixed latency or uptime guarantee has been established for this prototype.
- **Retry is limited.** The interface retains one automatic retry after a thrown connection error and a manual Retry button for valid submissions that fail. It does not switch to a fallback model. A lost response can leave a request's outcome uncertain, so retrying can result in another billed request.
- **The workflow has fixed limits.** It accepts text only, with six predefined roles and two to four selections. It does not accept uploaded documents, custom roles, or follow-up conversations.
- **A production deployment needs further review.** The app has no user accounts or application-level per-user spending limits. Automated tests cover specific behaviours, not every possible model answer, security risk, or hosting condition.


## Working with GitHub and VS Code

A GitHub repository stores the source code; it does not, by itself, run this server-backed application. A hosted deployment provides the application link, while the local development server is for testing changes on a computer.

If GitHub sync with Lovable is connected, changes on the connected branch can travel between GitHub and Lovable. A separately maintained, disconnected repository does not receive those updates automatically. Repository visibility and connection permissions should be checked in the relevant account settings.

No project licence has been added to this repository. Dependency licences do not establish a licence for the project's own code.
