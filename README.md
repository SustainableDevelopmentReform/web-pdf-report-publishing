# Observable Framework + PDF Export Template

A template for creating interactive data reports and documentation using [Observable Framework](https://observablehq.com/framework/) with custom PDF export capabilities.

## Features

- **Interactive Development** - Live preview with hot module replacement
- **Markdown-based Authoring** - Write content in markdown with embedded JavaScript
- **Data Visualizations** - Built-in support for D3, Plot, and other visualization libraries
- **Static Site Generation** - Build fast, static websites for deployment
- **PDF Export** - Custom PDF generation with print-optimized styling
- **Footnote Support** - Academic-style citations via markdown-it-footnote plugin

## Prerequisites

- **Node.js** 18 or later
- **npm** (comes with Node.js)

## Quick Start

### Installation

```bash
# Clone this template
git clone <your-repo-url>
cd <your-repo-name>

# Install dependencies
npm install

# Install PDF export dependencies
npm run pdf:install
```

### Development

```bash
# Start the development server
npm run dev
```

Visit http://localhost:3000 to preview your site. The server will automatically reload when you make changes.

### Building

```bash
# Build static site only
npm run build

# Build site and export PDFs
npm run pdf:build
```

The built site will be in the `dist/` directory. PDFs will be exported to `pdf-export/output/`.

## Project Structure

```
.
├── src/                          # Source files for your site
│   ├── index.md                  # Homepage
│   ├── inception-report.md       # Example page 1
│   ├── interim-report.md         # Example page 2
│   ├── data/                     # Data files and loaders
│   └── .observablehq/            # Observable Framework cache (auto-generated)
├── pdf-export/                   # PDF export system
│   ├── config/
│   │   ├── config.json           # PDF export configuration
│   │   └── styles.css            # PDF-specific styling
│   ├── src/                      # PDF conversion scripts
│   └── output/                   # Generated PDFs
├── dist/                         # Built site (auto-generated)
├── observablehq.config.js        # Observable Framework configuration
├── package.json                  # Project dependencies and scripts
└── README.md                     # This file
```

## Creating Content

### Adding New Pages

1. Create a new `.md` file in the `src/` directory
2. Add frontmatter with title and options:

```markdown
---
toc: true
title: My New Page
---

# My New Page

Your content here...
```

3. Add the page to `observablehq.config.js` sidebar (optional):

```javascript
pages: [
  {
    name: "My Section",
    pages: [
      {name: "My New Page", path: "/my-new-page"}
    ]
  }
]
```

### Adding Visualizations

Observable Framework supports embedded JavaScript code blocks:

```markdown
\`\`\`js
import * as d3 from "npm:d3";

const data = [1, 2, 3, 4, 5];
const chart = // ... your D3 code
display(chart);
\`\`\`
```

### Working with Data

Create data loaders in `src/data/` to fetch and process data:

- `mydata.csv.js` - JavaScript loader that outputs CSV
- `mydata.json.js` - JavaScript loader that outputs JSON
- Static files can be placed directly in `src/data/`

See [Observable Framework data loaders documentation](https://observablehq.com/framework/loaders) for details.

### Adding Footnotes

Use standard markdown footnote syntax:

```markdown
This is a statement with a citation[^1].

[^1]: Source information here with optional URL
```

## PDF Export

### Configuration

PDF export settings are in `pdf-export/config/config.json`:

```json
{
  "defaults": {
    "format": "A4",
    "margin": {
      "top": "20mm",
      "right": "15mm",
      "bottom": "20mm",
      "left": "15mm"
    }
  },
  "documents": {
    "my-page": {
      "format": "A4"
    }
  }
}
```

### Custom PDF Styling

Edit `pdf-export/config/styles.css` to customize PDF appearance:

```css
@media print {
  /* Your custom print styles */
}
```

### Exporting PDFs

```bash
# Export all configured pages to PDF
npm run pdf:export

# Build site and export PDFs in one command
npm run pdf:build

# Watch mode - auto-regenerate PDFs when site rebuilds
npm run pdf:watch
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build static site |
| `npm run clean` | Clear Observable Framework cache |
| `npm run pdf:install` | Install PDF export dependencies |
| `npm run pdf:export` | Export configured pages to PDF |
| `npm run pdf:build` | Build site and export PDFs |
| `npm run pdf:watch` | Watch for changes and auto-export PDFs |
| `npm run deploy` | Deploy to Observable hosting (requires auth) |

## Customization

### Site Configuration

Edit `observablehq.config.js` to customize:

- Site title and metadata
- Page organization in sidebar
- Footer content
- Theme and styling
- Plugins and extensions

### Styling

Observable Framework uses standard CSS. Add custom styles:

1. Create `src/custom.css`
2. Import in your pages: `<link rel="stylesheet" href="./custom.css">`

Or use inline styles in your markdown files.

## Deployment

### Static Hosting

Deploy the `dist/` folder to any static hosting service:

- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages
- Amazon S3
- etc.

### Observable Cloud

```bash
npm run deploy
```

Requires authentication with Observable. See [deployment documentation](https://observablehq.com/framework/deploying).

## Learn More

- [Observable Framework Documentation](https://observablehq.com/framework/)
- [Observable Plot](https://observablehq.com/plot/) - Visualization library
- [D3.js](https://d3js.org/) - Data visualization library
- [Markdown Guide](https://www.markdownguide.org/)

## License

This template is provided as-is for your use. Customize and deploy as needed for your projects.

## Support

For Observable Framework issues, see the [official documentation](https://observablehq.com/framework/) and [GitHub repository](https://github.com/observablehq/framework).
