---
toc: true
title: Observable Framework + PDF Export Template
---

# Observable Framework + PDF Export Template

Welcome to this template for creating beautiful, interactive data reports that can be exported to PDF.

---

## About This Template

This template combines [Observable Framework](https://observablehq.com/framework/) with a custom PDF export system, allowing you to:

1. **Author content in Markdown** with live JavaScript and data visualizations
2. **Preview interactively** during development
3. **Build static websites** for deployment
4. **Export to PDF** with custom styling and formatting

---

## Example Visualization

Here's a simple example using D3 to demonstrate Observable Framework's capabilities:

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

// Create simple bar chart
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

---

## Getting Started

1. Install dependencies: `npm install`
2. Install PDF export dependencies: `npm run pdf:install`
3. Start development server: `npm run dev`
4. Build for production: `npm run build`
5. Export to PDF: `npm run pdf:build`

See the [README](../README.md) for detailed documentation.

---

## Template Pages

This template includes example pages demonstrating different use cases:

- **Home** (this page) - Overview with interactive visualization • [Download PDF](./_file/data/index.pdf)
- **Report 1** - [View online](./inception-report) • [Download PDF](./_file/data/inception-report.pdf)
- **Report 2** - [View online](./interim-report) • [Download PDF](./_file/data/interim-report.pdf)

Edit these pages in the `src/` directory to create your own content. PDFs are automatically generated using the custom export system.
