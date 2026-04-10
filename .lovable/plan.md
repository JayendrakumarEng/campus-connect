

## Problem

The `.github/workflows/static.yml` file was accidentally emptied (contains only a blank line). This means GitHub Actions never builds or deploys the app, so GitHub Pages shows a 404 to anyone visiting the site.

## Fix

**Restore the GitHub Actions workflow** in `.github/workflows/static.yml` with a proper build-and-deploy pipeline:

1. **Checkout** the code
2. **Setup Node 20** and install dependencies (`npm ci`)
3. **Build the app** (`npm run build`) with the required Supabase environment variables
4. **Copy `index.html` to `404.html`** in the `dist` folder — this is the SPA fallback so that refreshing any page (e.g. `/feed`, `/auth`) doesn't 404
5. **Deploy the `dist` folder** to GitHub Pages

The environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`) will be set in the workflow so the build can connect to the backend.

**Also delete** the stale `static-.yml` file which is an old, non-functional copy that deploys raw source files instead of built output.

## After Deployment

Once this is pushed, GitHub Actions will automatically run, build the app, and deploy it. Your friends should then see the working app instead of a 404.

## Technical Details

- The `vite.config.ts` already handles setting the correct `base` path for GitHub Pages using `GITHUB_REPOSITORY`
- The `BrowserRouter` in `App.tsx` already uses `import.meta.env.BASE_URL` as basename
- The `404.html` copy ensures SPA client-side routing works on GitHub Pages

