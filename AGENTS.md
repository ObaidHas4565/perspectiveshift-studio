<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Custom-label checks use static word-list JSON imports and a local insult filter through shared validation; never import the package's filesystem-based entry point or add AI calls for label checks.
- Custom-perspective warnings have separate page state from generation errors, so adding an invalid label cannot offer a generation retry.
- Input rules (lengths, role counts) live in src/lib/perspectives.ts and are enforced both in the UI and the server function, so they can never drift apart.
- AI calls run only in src/lib/perspectives.functions.ts via the Lovable AI Gateway SDK with a strict JSON schema, keeping the key server-side.
- Mask problem text in the browser with src/lib/privacy.ts before every generation or retry; keep originals in page state only, so detected identifiers never enter the application request.
- Final-plan copying and plain-text downloads run only in the browser through PlanActions, so exporting adds no server requests or AI calls.
- Both AI operations treat problem text, custom labels, insights and notes as untrusted data in their system instructions; this reduces prompt-override risk without claiming immunity.
