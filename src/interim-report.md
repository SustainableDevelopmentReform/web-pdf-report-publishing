---
toc: true
title: Example Page 2
---

# Example Page 2

This page demonstrates how multiple pages work together in Observable Framework. **Replace with your own content.**

## Multi-Page Documentation

Observable Framework makes it easy to create multi-page sites:

- Each `.md` file in `src/` becomes a page
- Pages are organized via `observablehq.config.js`
- Navigation is automatically generated
- All pages can be exported to PDF individually

## Data Integration

You can load and visualize data from various sources:

**Static files:**
- CSV, JSON, or other data files in `src/data/`
- Direct file references via `FileAttachment()`

**Data loaders:**
- Scripts that run at build time
- Fetch from APIs, databases, or other sources
- Process and transform data before output

**Example:**
```markdown
\`\`\`js
const data = FileAttachment("data/myfile.csv").csv();
display(data);
\`\`\`
```

## Collaboration & Deployment

Benefits of the framework approach:

- **Version control** - Track changes with Git
- **Collaboration** - Multiple people can work on different pages
- **Static hosting** - Deploy anywhere (GitHub Pages, Cloudflare, etc.)
- **PDF sharing** - Export for offline distribution

## Customization

You can customize many aspects:

- **Styling** - Add custom CSS for your brand
- **Layout** - Control sidebar, TOC, and page structure
- **PDF output** - Configure page size, margins, and styling
- **Interactive elements** - Add JavaScript visualizations

## Getting Started

To create your own content:

1. Delete or replace these example pages
2. Create new `.md` files in `src/`
3. Update the sidebar in `observablehq.config.js`
4. Run `npm run dev` to preview
5. Build with `npm run pdf:build` when ready

---

**Ready to begin?** Check out the [README](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME#readme) for detailed instructions, or explore [CLAUDE.md](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/blob/main/CLAUDE.md) for technical details.
