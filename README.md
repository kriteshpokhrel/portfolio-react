# Kritesh Pokhrel — Portfolio & Blog

My personal portfolio and blog, built with React and Vite. It showcases who I am, what I've worked on, and hosts my writing series **AI, As I See It**. The blog is powered by Markdown files, so publishing a new post is just a matter of adding a `.md` file.

**Live site:** [kriteshp.com.np](https://kriteshp.com.np)

## Features

- **Homepage** — introduction, about, education, experience, projects, and a contact form.
- **Blog** — a Markdown-driven blog with individual post pages, cover images, and rich formatting (footnotes, code highlighting, and more).
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

## Project Structure

```
public/               Static assets (covers, icons, _redirects)
src/
  App.jsx             Routes (home, blog list, blog post)
  main.jsx            App entry
  components/
    homepage/         Homepage sections (About, Experience, Projects, ...)
    blogs/            BlogList, BlogCard, BlogPostPage
  blogs/              Blog posts as Markdown files
  utilities/          Markdown import & rendering helpers
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended) and npm

### Install & run

```bash
npm install
npm run dev
```

The dev server runs at [http://localhost:5173](http://localhost:5173).

### Available scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the local development server   |
| `npm run build`   | Build for production into `dist/`    |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint                           |

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

The site is deployed on **Netlify**. Because it's a single-page app, `public/_redirects` contains:

```
/*    /index.html   200
```

This makes Netlify serve `index.html` for deep links (e.g. `/blogs/some-post`) so client-side routing works on direct visits and refreshes.

To deploy: push to the connected repository (Netlify builds with `npm run build` and publishes `dist/`), or run a manual deploy with the Netlify CLI.