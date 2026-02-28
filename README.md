# SilicogenAI

**Live site:** [silicogenai.netlify.app](https://silicogenai.netlify.app)

Landing page for AI-assisted hardware engineering coding agent — helping teams design, verify, and ship silicon faster.

## Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** + **shadcn/ui**
- **Framer Motion** for animations
- **react-markdown** + **remark-gfm** + **react-syntax-highlighter** for the blog
- Deployed on **Netlify** (auto-deploy on push to `main`)

## Development

```sh
npm install
npm run dev
```

## Blog

Posts live in `src/Blog/` as Markdown files. Name them `YYYY-MM-DD_Post_Title.md` — the date and URL slug are parsed from the filename automatically.

**Frontmatter:**
```yaml
---
title: "Your Post Title"
description: "Short description shown on the blog index card."
author: "SilicogenAI Team"
tags: ["RISC-V", "RTL", "Hardware"]
---
```

**Publishing:** push to `main` → Netlify builds → live at `/blog/your-post-title`.

**YouTube embeds:** paste a bare YouTube URL on its own line in the markdown — it renders as an embedded player automatically. The first YouTube link in a post is also used as the card thumbnail on the blog index.

**Custom thumbnail:** add `image: "https://..."` to frontmatter to override the auto-thumbnail.

## Deployment

Netlify auto-deploys from the `main` branch. SPA routing is handled via `netlify.toml`.

```sh
npm run build   # production build → dist/
```
