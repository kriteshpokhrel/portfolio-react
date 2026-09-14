# Kritesh Pokhrel — Portfolio & Blog

My personal portfolio and blog, built with React and Vite. It showcases who I am, what I've worked on, and hosts my writing series **AI, As I See It**. The blog is powered by Markdown files, so publishing a new post is just a matter of adding a `.md` file.

**Live site:** [kriteshp.com.np](https://kriteshp.com.np)

## Features

- **Homepage** — introduction, about, education, experience, projects, and a contact form.
- **Blog** — a Markdown-driven blog with individual post pages, cover images, and rich formatting (footnotes, code highlighting, and more).
- **Doodle guestbook** — a public drawing wall with touch/stylus support, shapes, stamps, downloads, reporting, and persistent submissions.
- **Client-side routing** — clean URLs like `/blogs` and `/blogs/:slug` via React Router.
- **Responsive design** — works across desktop, tablet, and mobile.

## Tech Stack

- **React 18** + **Vite** — app framework and build tooling
- **React Router v7** — routing
- **Tailwind CSS v4** — styling
- **markdown-it** (with plugins) — Markdown rendering for blog posts
- **react-syntax-highlighter** — code block highlighting
- **emailjs-com** — contact form submissions
- **Netlify** — hosting
- **Netlify Forms & Functions** — durable submission ledger and server-side validation
- **Supabase** — managed Postgres storage for the public guestbook feed

## Project Structure

```
public/               Static assets (covers, icons, _redirects)
netlify/functions/    Guestbook form event and public feed functions
netlify/lib/          Server-only helpers (not deployed as function entry points)
supabase/migrations/  Guestbook tables and transactional database functions
supabase/tests/       Transactional database smoke tests (roll back all fixtures)
tests/netlify/        Function tests, kept outside the deploy entry-point directory
src/
  App.jsx             Routes (home, blog list, blog post, guestbook)
  main.jsx            App entry
  components/
    homepage/         Homepage sections (About, Experience, Projects, ...)
    blogs/            BlogList, BlogCard, BlogPostPage
    guestbook/        Canvas, form, gallery, validation, and rendering
  blogs/              Blog posts as Markdown files
  utilities/          Markdown import & rendering helpers
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22 LTS (22.12+; see `.nvmrc`) and npm

### Install & run

```bash
npm ci
npm run dev
```

The dev server runs at [http://localhost:5173](http://localhost:5173).

### Available scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the local development server   |
| `npm test`        | Run the guestbook test suite         |
| `npm run check:guestbook` | Run tests and the guestbook/Functions TypeScript check |
| `npm run build`   | Build for production into `dist/`    |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |
| `npm run netlify:dev` | Start Vite with Netlify Forms and Functions emulation |
| `npm run deploy` | Build and upload a **draft** to the linked Netlify site (not production) |

## Doodle Guestbook Setup

The guestbook has no dedicated server. Netlify Forms stores every entry and report, a Netlify submission event validates it, and Supabase stores the public feed. The browser never receives a Supabase key.

### 1. Create the database

1. Use the existing `portfolio-guestbook` project, or create a separate project for development.
2. For a **new, empty database**, run [`supabase/migrations/20260914100615_guestbook.sql`](supabase/migrations/20260914100615_guestbook.sql) using your migration workflow or Supabase SQL Editor.
3. The existing `portfolio-guestbook` project already has this migration applied. Do not run it there again.

The migration enables row-level security, removes browser table and RPC access, adds retry-safe entry creation, limits a browser identity to three entries per ten minutes, prevents duplicate reports, and hides an entry after three distinct reports. Database locks serialize concurrent submissions/reports. Feed timestamps retain PostgreSQL microsecond precision, and queries read one lookahead row to paginate full 24-entry pages.

Run [`supabase/tests/guestbook.sql`](supabase/tests/guestbook.sql) as `postgres` in SQL Editor or `psql` to check creation, retries, rate limits, moderation, pagination, permissions, and cascading deletion. It rolls back all fixture data. Run the entire script as one transaction; it is not a load/concurrency test.

### 2. Configure Netlify

Copy the variable names from [`guestbook.env.sample`](guestbook.env.sample) into **Netlify > Site configuration > Environment variables**:

| Variable | Value |
| --- | --- |
| `SUPABASE_URL` | Supabase **Project URL** |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase server-only **secret** (`sb_secret_...`) or legacy **service role** key |
| `GUESTBOOK_IP_SALT` | A private random value of at least 24 characters |

Never prefix these variables with `VITE_`. Prefer the **Functions** scope and the secret flag for sensitive values where supported. Use the **Production** context for production credentials, not untrusted deploy previews. Keep the salt stable, since changing it resets the identity used for deduplication and rate limits. The variable retains its original `GUESTBOOK_IP_SALT` name, but hashes a browser UUID, not the event delivery server's IP.

Enable **Forms > Enable form detection** before deploying. The existing `kriteshpokhrel` site has Forms enabled and all three variables configured for Production. Keep production database credentials out of Deploy Previews, Branch deploys, and Preview Servers; use an isolated database for those environments.

If restricted scopes are unavailable, standard variables with **all scopes** are an option for a trusted production build. Netlify encrypts standard values, but authorized Netlify users and production build processes can read them. These names are not exposed automatically by Vite; never reference them in frontend code or snippet injection. Always verify that environment-variable writes persisted.

The server key is marked secret in Netlify, so its value is write-only and cannot be exported for local development. Obtain a server key from the Supabase project's API Keys settings when configuring a local environment. An anonymous/publishable key or Netlify's masked value is not a substitute. Never put server keys in source control or chat.

Generate a fresh private salt locally if needed:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

After adding the key, deploy the site. Netlify should discover `guestbook-entry` and `guestbook-report` under the site's **Forms** tab. Both forms use a honeypot and remain in Netlify as the durable submission/report record. A successful Forms response only confirms receipt, not publication: spam filtering, validation, rate limits, and asynchronous processing can prevent an entry from appearing.

### 3. Develop locally

Create a local `.env` containing the three server-only values. Copy the full secret key from Supabase, not the masked value returned by Netlify. For contact-form testing, also configure `VITE_PUBLIC_KEY`, `VITE_SERVICE_ID`, and `VITE_TEMPLATE_ID` with your EmailJS settings. Then run:

```bash
npm run netlify:dev
```

The command downloads the Netlify CLI into npx's isolated cache and starts the Vite app with Functions routing. Plain `npm run dev` is enough for canvas work, but it does not provide the API or real Forms processing. Prefer development-only Supabase credentials in your ignored local `.env`; using the production project's credentials means local writes affect real guestbook data. Remove temporary credentials after testing and never reuse production credentials for untrusted previews.

Netlify's live Forms detection and `submission-created` delivery must still be verified on a preview deploy; Vite preview alone cannot prove them.

If Netlify Dev returns 403 for nested `/assets/` files on Windows, use `npm run preview` for the built frontend and `npx --yes netlify-cli@latest build --offline` for function packaging. Those checks do not establish live Forms delivery or authenticated Supabase connectivity.

### Moderation

- Reports are stored by Netlify and mirrored into `guestbook_reports`.
- One browser can report a specific entry only once.
- Three distinct reports set `guestbook_entries.is_hidden` to `true`.
- To manually hide or restore an entry, edit `is_hidden` in Supabase **Table Editor > guestbook_entries**.
- To permanently remove an entry, delete it there. Related reports are deleted automatically.
- There is intentionally no public admin interface or visitor authentication.
- Browser identities are self-issued and resettable. These are best-effort abuse limits, not proof of distinct people or strong IP-based protection.
- Feed caches can delay publication and moderation visibility by up to roughly 150 seconds, in addition to event-processing time.

### Operational checks and recovery

Check Netlify's `submission-created` function logs for `Guestbook submission processed`, `Guestbook submission not published`, or `Guestbook persistence failed`. Logs include the Netlify submission ID and outcome but not the drawing or browser identifier. Invalid input returns 422; database/configuration failures return 503 and must be investigated. Do not assume automatic event redelivery.

Compare the Forms ledger's submission ID to `guestbook_entries.form_submission_id` when investigating missing entries. Keep the ledger until recovery is complete. Any administrative replay must use the same validated payload and submission ID so the database can deduplicate it.

RLS-without-policies advisor notices are intentional for these server-only tables. Only the server role can execute the guestbook RPCs.

### Cost and abuse limits

The implementation targets the Netlify and Supabase free plans, but their quotas can change. Configure usage notifications in both dashboards. Drawings are stored as validated vector-like commands rather than PNG uploads, capped at 96 KB, 160 commands, and 6,000 points. Feed pages are capped at 24 entries and cached briefly. These limits reduce storage and function usage, but cannot guarantee that a provider will always remain free.

## Adding a Blog Post

1. Create a new Markdown file in `src/blogs/`, e.g. `my-new-post.md`.
2. Add frontmatter at the top:

   ```markdown
   ---
   title: "My New Post"
   date: "2026-08-07"
   excerpt: "A short summary shown on the blog card."
   coverImage: "/covers/my-new-post.svg"
   ---

   Your content here...
   ```

3. Drop the cover image in `public/covers/`.

The post is picked up automatically and available at `/blogs/my-new-post`.

## Deployment

The site is deployed on **Netlify**. Routing lives in `public/_redirects`, with the API rule **before** the SPA fallback:

```
/api/guestbook    /.netlify/functions/guestbook   200
/*    /index.html   200
```

Netlify processes `_redirects` before `netlify.toml`. Do not add an API rule only in TOML underneath this file's catch-all. Direct visits to `/guestbook` and blog URLs still serve `index.html`; API responses come from the function and set their own cache headers. Errors are not cached.

Netlify runs `npm run check:guestbook && npm run build` and publishes `dist/`. Only `guestbook` and `submission-created` should be packaged as functions. The focused TypeScript check includes the guestbook and Functions; the legacy whole-app `tsc` check currently has unrelated Contact/blog typing errors and is not the deployment gate.

For a local packaging check without uploading anything:

```bash
npx --yes netlify-cli@latest build --offline
```

For a manual draft, first link the CLI to the existing `kriteshpokhrel` site, then run `npm run deploy`. Do not create a second site. Drafts do not have the production-only guestbook credentials; configure an isolated test database and preview-scoped variables if you want a functional preview. The old GitHub Pages deploy command was removed because it cannot host these Functions.

Before publishing, verify the two forms are detected, `/api/guestbook` returns JSON (including a non-empty feed), a real submission reaches Supabase, duplicate reports count once, and three distinct test identities hide an entry. Netlify event functions are platform-signed; posting directly to their URL is not a valid end-to-end test.

To roll back, republish the previous Netlify deploy. Leave the additive guestbook tables and Forms ledger intact; rolling back the site does not undo database changes or remove user submissions.