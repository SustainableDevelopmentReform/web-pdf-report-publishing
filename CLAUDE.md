# Observable Framework + PDF Export - Technical Guide

> **Note:** This file provides detailed technical documentation for developers and AI coding assistants (like [Claude Code](https://claude.com/claude-code)). If you're not using an AI assistant or don't need deep technical details, you can safely delete this file. For getting started, see the [README](./README.md) instead.

This document provides comprehensive technical details about the Observable Framework implementation and PDF export system in this template.

## Observable Framework Architecture

### Project Structure

Observable Framework is a static site generator for data applications. Key concepts:

- **Markdown Pages** - Content files in `src/` become routes (e.g., `src/report.md` → `/report`)
- **Reactive JavaScript** - Code blocks in markdown execute in the browser with reactive updates
- **Data Loaders** - Scripts in `src/data/` that fetch/process data at build time
- **Static Output** - Everything compiles to static HTML/JS/CSS in `dist/`

### Configuration (`observablehq.config.js`)

```javascript
export default {
  title: "Site Title",              // Site-wide title
  pages: [...],                      // Sidebar navigation structure
  markdownIt: (md) => md.use(...),   // Markdown-it plugin customization
  root: "src",                       // Source directory
  footer: "...",                     // Footer HTML
}
```

**Key Configuration Options:**

- `pages`: Array defining sidebar navigation hierarchy
- `markdownIt`: Function to add markdown-it plugins (we use `markdown-it-footnote`)
- `head`: HTML to inject in `<head>` (meta tags, favicons, etc.)
- `footer`: HTML/string for page footer

### Markdown Features

Observable Framework extends standard markdown:

**Code Blocks** - Three types:
```markdown
\`\`\`js
// Reactive JavaScript - executes in browser
const x = 42;
display(x);
\`\`\`

\`\`\`js echo
// Shows both code and output
\`\`\`

\`\`\`js run=false
// Shows code only, doesn't execute
\`\`\`
```

**Data References** - Load data from loaders:
```markdown
\`\`\`js
const data = FileAttachment("data/myfile.csv").csv();
\`\`\`
```

**Frontmatter** - Page configuration:
```markdown
---
title: Page Title
toc: true              # Enable table of contents
sidebar: false         # Hide sidebar on this page
---
```

### Data Loaders

Data loaders run at build time to fetch/process data:

**File naming convention:**
- `src/data/example.csv.js` → outputs CSV at build time
- `src/data/example.json.js` → outputs JSON at build time
- `src/data/example.txt.js` → outputs text at build time

**Example loader** (`src/data/mydata.json.js`):
```javascript
// Runs at build time (Node.js)
import data from "./source.csv";
const processed = data.map(d => ({...d, computed: d.value * 2}));
process.stdout.write(JSON.stringify(processed));
```

**Access in pages:**
```markdown
\`\`\`js
const data = FileAttachment("data/mydata.json").json();
display(data);
\`\`\`
```

### Development Workflow

1. **Start dev server**: `npm run dev`
   - Runs Observable Framework's preview server
   - Hot reload on file changes
   - Available at http://localhost:3000

2. **Build static site**: `npm run build`
   - Executes all data loaders
   - Compiles markdown to HTML
   - Bundles JavaScript modules
   - Outputs to `dist/`

3. **Clean cache**: `npm run clean`
   - Removes `.observablehq/cache/`
   - Useful when data loaders are cached incorrectly

## PDF Export System

Custom PDF export implementation using Puppeteer to convert built HTML to PDF.

### Architecture

The PDF export system consists of several components:

**1. Configuration** (`pdf-export/config/config.json`)
```json
{
  "defaults": {
    "format": "A4",
    "margin": {...},
    "printBackground": true
  },
  "documents": {
    "page-name": {
      "format": "A3",
      "landscape": true
    }
  }
}
```

**2. Print Stylesheet** (`pdf-export/config/styles.css`)
- Applied during PDF generation
- Controls print-specific layout
- Manages page breaks, margins, typography

**3. Converter Script** (`pdf-export/src/converter.js`)
- Main entry point for PDF export
- Reads config and identifies pages to convert
- Orchestrates Puppeteer browser automation

**4. Preprocessor** (`pdf-export/src/preprocessor.js`)
- Modifies HTML before PDF generation
- Adjusts links, images, interactive elements
- Applies print-specific transformations

**5. Styler** (`pdf-export/src/styler.js`)
- Injects print stylesheet
- Manages CSS for PDF rendering

**6. QR Generator** (`pdf-export/src/qr-generator.js`)
- Generates QR codes linking to web version
- Can be customized or disabled

### PDF Export Workflow

1. **Build site**: Observable Framework builds to `dist/`
2. **Launch browser**: Puppeteer starts headless Chrome
3. **For each configured page**:
   - Load HTML from `dist/`
   - Run preprocessor (fix links, images)
   - Inject print stylesheet
   - Generate QR code (optional)
   - Render to PDF with specified options
4. **Save PDFs**: Output to `pdf-export/output/`
5. **Copy to data**: PDFs copied to `src/data/` for web access

### PDF Export Commands

```bash
# Export PDFs from built site
npm run pdf:export

# Build site + export PDFs + copy to dist
npm run pdf:build

# Watch mode: auto-export when dist/ changes
npm run pdf:watch
```

### Customizing PDF Output

**Page-specific configuration**:

Edit `pdf-export/config/config.json`:
```json
{
  "documents": {
    "my-report": {
      "format": "Letter",
      "landscape": false,
      "margin": {
        "top": "25mm",
        "bottom": "25mm"
      }
    }
  }
}
```

**Custom print styling**:

Edit `pdf-export/config/styles.css`:
```css
@media print {
  h1 {
    page-break-before: always;
  }

  .no-print {
    display: none;
  }
}
```

**Disable QR codes**:

Edit `pdf-export/src/converter.js` to skip QR generation.

## Dependencies

### Main Dependencies

- `@observablehq/framework` - Core framework
- `markdown-it-footnote` - Footnote support
- `d3-dsv`, `d3-time-format` - Data utilities

### PDF Export Dependencies

- `puppeteer` - Headless Chrome for PDF generation
- `jsdom` - HTML parsing and manipulation
- `qrcode` - QR code generation
- `chalk` - Terminal colors
- `commander` - CLI argument parsing
- `glob` - File pattern matching

## Common Patterns

### Adding Footnotes

```markdown
This needs a citation[^1].

Multiple citations[^1][^2].

[^1]: First source with URL: https://example.com
[^2]: Second source
```

### Creating Interactive Visualizations

```markdown
\`\`\`js
import * as Plot from "npm:@observablehq/plot";

const chart = Plot.plot({
  marks: [
    Plot.dot(data, {x: "date", y: "value"})
  ]
});

display(chart);
\`\`\`
```

### Loading External Data

```markdown
\`\`\`js
// CSV file
const data = await FileAttachment("data/file.csv").csv({typed: true});

// JSON file
const json = await FileAttachment("data/file.json").json();

// Fetch from URL (happens in browser)
const external = await fetch("https://api.example.com/data").then(r => r.json());
\`\`\`
```

### Conditional PDF Styling

Use `@media print` to style differently for PDF:

```html
<style>
.interactive-only {
  display: block;
}

@media print {
  .interactive-only {
    display: none;
  }
}
</style>
```

## Troubleshooting

### Build Issues

**Cache problems**: Run `npm run clean` to clear Observable cache

**Module errors**: Ensure `"type": "module"` is in `package.json`

**Data loader failures**: Check that loaders write to stdout correctly

### PDF Export Issues

**Missing content**: Ensure `npm run build` completes before PDF export

**Styling issues**: Check `pdf-export/config/styles.css` for print styles

**Timeout errors**: Increase timeout in `pdf-export/config/config.json`

**QR code problems**: Verify base URL configuration in converter

### Development Server Issues

**Port already in use**: Kill process on port 3000 or use different port

**Hot reload not working**: Restart dev server

**Missing dependencies**: Run `npm install` and `npm run pdf:install`

## Further Reading

- [Observable Framework Docs](https://observablehq.com/framework/)
- [Observable Plot](https://observablehq.com/plot/)
- [Puppeteer API](https://pptr.dev/)
- [markdown-it](https://github.com/markdown-it/markdown-it)
