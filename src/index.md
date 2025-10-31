---
toc: true
title: Observable Framework + PDF Export Template
---

# Observable Framework + PDF Export Template

Welcome! This is a minimal starter template demonstrating Observable Framework with PDF export capabilities.

**Replace this content with your own** - these example pages show what's possible and can be deleted once you're familiar with the system.

---

## What This Template Provides

Create beautiful, interactive data reports and documentation:

- **Write in Markdown** with embedded JavaScript
- **Live preview** during development
- **Static site** generation for fast deployment
- **PDF export** with one command

---

## Quick Example

Here's a simple interactive visualization to demonstrate Observable Framework's capabilities:

```js
import * as d3 from "npm:d3";

// Sample data
const data = [
  {category: "A", value: 30},
  {category: "B", value: 80},
  {category: "C", value: 45},
  {category: "D", value: 60},
  {category: "E", value: 20}
];

// Create a simple bar chart
const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

const x = d3.scaleBand()
  .domain(data.map(d => d.category))
  .range([marginLeft, width - marginRight])
  .padding(0.1);

const y = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.value)])
  .nice()
  .range([height - marginBottom, marginTop]);

const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto;");

svg.append("g")
  .attr("fill", "steelblue")
  .selectAll("rect")
  .data(data)
  .join("rect")
    .attr("x", d => x(d.category))
    .attr("y", d => y(d.value))
    .attr("height", d => y(0) - y(d.value))
    .attr("width", x.bandwidth());

svg.append("g")
  .attr("transform", `translate(0,${height - marginBottom})`)
  .call(d3.axisBottom(x));

svg.append("g")
  .attr("transform", `translate(${marginLeft},0)`)
  .call(d3.axisLeft(y));

display(svg.node());
```

This chart is **interactive in the browser** and **renders correctly in PDF exports**.

---

## Getting Started

1. **Explore** the example pages in the sidebar
2. **Modify** the content in `src/*.md` files
3. **Run** `npm run dev` to preview changes
4. **Build** with `npm run pdf:build` to generate PDFs
5. **Deploy** to GitHub Pages, Cloudflare, or any static host

---

## Example Pages

This template includes three example pages:

- **Home** (this page) - Overview with basic visualization • [Download PDF](./_file/data/index.pdf)
- **Example 1** - [View online](./inception-report) • [Download PDF](./_file/data/inception-report.pdf)
- **Example 2** - [View online](./interim-report) • [Download PDF](./_file/data/interim-report.pdf)

---

## Next Steps

1. **Customize** `observablehq.config.js` with your site title and settings
2. **Replace** these example pages with your own content
3. **Configure** PDF export settings in `pdf-export/config/config.json`
4. **Add** your data visualizations and analysis

See the [README](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME#readme) for complete documentation.

---

<small>Built with [Observable Framework](https://observablehq.com/framework/) • This content can be replaced with your own</small>
