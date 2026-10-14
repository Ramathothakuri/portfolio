# Ramakrishna T — Portfolio

A production-ready Next.js portfolio built with TypeScript, React, Three.js, and responsive CSS.

## Local development

Requirements:

- Node.js 22.x or 24.x
- npm

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production build

```bash
npm run lint
npm run build
npm start
```

## Deploy to Vercel

Vercel automatically detects this repository as a Next.js application.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. In Vercel, select **Add New → Project** and import the repository.
3. Keep the root directory as `./` and the framework preset as **Next.js**.
4. Deploy. Vercel will install dependencies and run `next build` automatically.

No custom output directory or build command is required.

### Optional production URL

Vercel supplies `VERCEL_PROJECT_PRODUCTION_URL` automatically. To force a custom canonical URL, add this environment variable in the Vercel project settings:

```text
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

The value must include `https://` and must not end with a slash.
