# Observable Framework + PDF Export Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org)
[![Observable Framework](https://img.shields.io/badge/Observable-Framework-orange)](https://observablehq.com/framework/)

A production-ready template for creating interactive data reports and documentation using [Observable Framework](https://observablehq.com/framework/) with custom PDF export capabilities.

## Features at a Glance

- **📝 Markdown-based Authoring** - Write content in markdown with embedded JavaScript for interactivity
- **📊 Data Visualizations** - Built-in support for D3, Observable Plot, and other visualization libraries
- **🚀 Static Site Generation** - Build fast, static websites ready for deployment anywhere
- **📄 PDF Export** - Custom PDF generation system with print-optimized styling
- **🔄 Live Preview** - Development server with hot module replacement
- **📚 Footnote Support** - Academic-style citations via markdown-it-footnote plugin
- **🎨 Customizable** - Full control over styling, layout, and configuration

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Creating Content](#creating-content)
- [PDF Export](#pdf-export)
- [Deployment](#deployment)
  - [GitHub Pages](#github-pages)
  - [Cloudflare Pages](#cloudflare-pages)
  - [Other Platforms](#other-platforms)
- [Customization](#customization)
- [Available Scripts](#available-scripts)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Prerequisites

- **Node.js** 18 or later ([Download](https://nodejs.org))
- **npm** (comes with Node.js)
- **Git** (for version control)

## Quick Start

### Installation

```bash
# Clone this template
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME

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

Visit http://localhost:3000 to preview your site. The server will automatically reload when you make changes to your source files.

### Building for Production

```bash
# Build static site only
npm run build

# Build site and export PDFs
npm run pdf:build
```

The built site will be in the `dist/` directory, ready for deployment to any static hosting service.

## Project Structure

```
.
├── src/                          # Source files for your site
│   ├── index.md                  # Homepage
│   ├── inception-report.md       # Example page 1
│   ├── interim-report.md         # Example page 2
│   ├── data/                     # Data files and generated PDFs
│   └── .observablehq/            # Observable Framework cache (auto-generated)
├── pdf-export/                   # PDF export system
│   ├── config/
│   │   ├── config.json           # PDF export configuration
│   │   └── styles.css            # PDF-specific styling
│   ├── src/                      # PDF conversion scripts
│   └── output/                   # Generated PDFs (auto-generated)
├── .github/
│   └── workflows/
│       └── deploy-gh-pages.yml   # GitHub Pages deployment workflow
├── dist/                         # Built site (auto-generated)
├── observablehq.config.js        # Observable Framework configuration
├── package.json                  # Project dependencies and scripts
├── CONTRIBUTING.md               # Contribution guidelines
├── CLAUDE.md                     # Technical documentation (optional)
└── README.md                     # This file
```

## Creating Content

### Adding New Pages

1. Create a new `.md` file in the `src/` directory:

```markdown
---
toc: true
title: My New Page
---

# My New Page

Your content here...
```

2. Add the page to `observablehq.config.js` sidebar (optional):

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

Observable Framework supports embedded JavaScript code blocks with live execution:

```markdown
\`\`\`js
import * as Plot from "npm:@observablehq/plot";

const data = [
  {x: 1, y: 2},
  {x: 2, y: 4},
  {x: 3, y: 8}
];

const chart = Plot.plot({
  marks: [
    Plot.line(data, {x: "x", y: "y"})
  ]
});

display(chart);
\`\`\`
```

### Working with Data

Create data loaders in `src/data/` to fetch and process data at build time:

**Example: `src/data/mydata.json.js`**
```javascript
// Runs at build time (Node.js environment)
const data = await fetch("https://api.example.com/data").then(r => r.json());
process.stdout.write(JSON.stringify(data));
```

**Access in pages:**
```markdown
\`\`\`js
const data = FileAttachment("data/mydata.json").json();
display(data);
\`\`\`
```

See [Observable Framework data loaders documentation](https://observablehq.com/framework/loaders) for more details.

### Adding Footnotes

Use standard markdown footnote syntax:

```markdown
This statement needs a citation[^1].

Multiple citations are supported[^1][^2].

[^1]: Smith, J. (2024). "Example Source", *Journal Name*, https://example.com
[^2]: Additional source information
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
      "format": "A4",
      "landscape": false
    }
  }
}
```

### Custom PDF Styling

Edit `pdf-export/config/styles.css` to customize PDF appearance:

```css
@media print {
  h1 {
    color: navy;
    page-break-before: always;
  }

  .no-print {
    display: none;
  }
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

PDFs are generated in `pdf-export/output/` and automatically copied to `src/data/` and `dist/_file/data/` for web access.

## Deployment

The built `dist/` folder is a static site that can be deployed to any hosting platform.

### GitHub Pages

#### Automatic Deployment (Recommended)

This template includes a GitHub Actions workflow for automatic deployment:

1. **Enable GitHub Pages** in your repository settings:
   - Go to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

3. **Monitor deployment**:
   - Go to the **Actions** tab in your repository
   - Watch the "Deploy to GitHub Pages" workflow
   - Once complete, your site will be live at `https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/`

The workflow automatically:
- Installs dependencies
- Builds the site
- Exports PDFs
- Deploys to GitHub Pages

#### Manual Deployment

If you prefer manual control:

```bash
# Build the site
npm run pdf:build

# Deploy to GitHub Pages
npm run deploy
```

Note: Manual deployment requires authentication with Observable.

### Cloudflare Pages

Deploy to Cloudflare Pages for fast global delivery:

1. **Create a Cloudflare Pages project**:
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to **Pages** → **Create a project**
   - Connect your GitHub repository

2. **Configure build settings**:
   - **Build command**: `npm install && npm run pdf:install && npm run pdf:build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty)

3. **Set environment variables** (if needed):
   - **NODE_VERSION**: `20`

4. **Deploy**:
   - Click **Save and Deploy**
   - Cloudflare will build and deploy your site
   - Your site will be live at `https://YOUR-PROJECT.pages.dev`

#### Cloudflare Pages Automatic Deployments

Cloudflare Pages automatically redeploys when you push to your main branch. Each push creates a production deployment with automatic cache invalidation.

### Other Platforms

The `dist/` folder can be deployed to any static hosting service:

**Netlify**
- Drag and drop the `dist/` folder to Netlify
- Or connect your Git repository with build command: `npm run pdf:build` and publish directory: `dist`

**Vercel**
- Import your Git repository
- Build command: `npm run pdf:build`
- Output directory: `dist`

**AWS S3 + CloudFront**
```bash
# Build the site
npm run pdf:build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete
```

**Any web server**
- Simply copy the `dist/` folder to your web server's public directory

## Customization

### Site Configuration

Edit `observablehq.config.js` to customize:

```javascript
export default {
  title: "Your Site Title",           // Site-wide title
  pages: [...],                        // Page organization in sidebar
  footer: "Your footer content",       // Footer HTML
  theme: "light",                      // Theme: "light", "dark", "slate", etc.
  // ... more options
};
```

See [Observable Framework configuration docs](https://observablehq.com/framework/config) for all options.

### Styling

**Global styles:**
1. Create `src/custom.css`
2. Import in your pages:
   ```html
   <link rel="stylesheet" href="./custom.css">
   ```

**Inline styles:**
```markdown
<style>
  .my-custom-class {
    color: navy;
  }
</style>
```

### PDF Export Customization

- **Page-specific PDF settings**: Edit `pdf-export/config/config.json`
- **Print styles**: Edit `pdf-export/config/styles.css`
- **QR codes**: Configure or disable in `pdf-export/config/config.json` under `qrCode`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with live preview |
| `npm run build` | Build static site to `dist/` directory |
| `npm run clean` | Clear Observable Framework cache |
| `npm run pdf:install` | Install PDF export dependencies |
| `npm run pdf:export` | Export configured pages to PDF |
| `npm run pdf:build` | Build site and export PDFs (one command) |
| `npm run pdf:watch` | Watch for changes and auto-export PDFs |
| `npm run deploy` | Deploy to Observable hosting (requires auth) |

## Acknowledgements

This template builds upon several excellent open-source projects:

- **[Observable Framework](https://observablehq.com/framework/)** - The core static site generator framework by Observable, Inc.
- **[Puppeteer](https://pptr.dev/)** - Headless Chrome automation for PDF generation by Google Chrome team
- **[D3.js](https://d3js.org/)** - Data visualization library by Mike Bostock
- **[markdown-it-footnote](https://github.com/markdown-it/markdown-it-footnote)** - Footnote plugin for markdown-it
- **[jsdom](https://github.com/jsdom/jsdom)** - JavaScript implementation of web standards for HTML preprocessing
- **[QRCode](https://github.com/soldair/node-qrcode)** - QR code generation library

Special thanks to the Observable team for creating such a powerful and elegant framework for data-driven documents.

## Learn More

- [Observable Framework Documentation](https://observablehq.com/framework/)
- [Observable Plot](https://observablehq.com/plot/) - Visualization library
- [D3.js Documentation](https://d3js.org/) - Data visualization library
- [Markdown Guide](https://www.markdownguide.org/)
- [CLAUDE.md](./CLAUDE.md) - Technical implementation details

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT License - see [LICENSE](./LICENSE) file for details.

This template is provided as-is for your use. Customize and deploy as needed for your projects.

## Support

- **Template Issues**: Open an issue in this repository
- **Observable Framework**: See [official documentation](https://observablehq.com/framework/) and [GitHub repository](https://github.com/observablehq/framework)
- **PDF Export**: Check [CLAUDE.md](./CLAUDE.md) for technical details

---

**Ready to get started?** Follow the [Quick Start](#quick-start) guide above, or dive into the [example pages](src/) to see what's possible.
