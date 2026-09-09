# Meridian

Internal research-team workspace built with Next.js 15, React 19, TypeScript, and Supabase.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and the server-only `SUPABASE_SERVICE_ROLE_KEY`.
3. Apply the Supabase migrations:

   ```bash
   supabase link --project-ref nghkmilxrdfnylaykkow
   supabase db push
   ```

   Or verify the configured database with:

   ```bash
   node --env-file=.env.local scripts/verify-migration.mjs
   ```

4. Run `npm run dev` and open `http://localhost:3000`.

## Current workspace

- Home: live task records, team activity, project counts, and attention notes.
- Projects: create projects and open project task boards.
- Project tasks: create tasks, move them from `todo` to `running` to `done`, and record a completion summary.
- Papers: share paper title, topic, DOI, and an optional download link with the team.
- Team: active workspace members.
- Attention: shared notes for issues that need team attention.
- Project and task deletion with authenticated RLS enforcement.

## Authentication

Users enter a username and password. The server maps the username to
`<username>@internal.meridian.local` before calling Supabase Auth. Never expose
`SUPABASE_SERVICE_ROLE_KEY` to client-side code.

## Deploying to Vercel

Vercel is recommended because it runs Next.js server components, middleware, and
route handlers without a separate Node server. Supabase continues to host the
database and authentication.

1. Push this repository to GitHub or another Git provider.
2. Import the repository in Vercel and keep the detected Next.js settings.
3. Add these Production environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy. `MERIDIAN_DATABASE_URL` is only needed locally for migration scripts;
   apply migrations from a trusted local machine or CI before deploying.
5. In Supabase Auth settings, set the Vercel deployment URL as the Site URL if
   email links or OAuth callbacks are added later.

Vercel Preview deployments are useful for testing changes, but share the Production
URL with team members for normal use. Netlify is a workable alternative, while a
traditional VPS adds unnecessary server maintenance for this application.