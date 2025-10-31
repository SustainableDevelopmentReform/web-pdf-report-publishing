// Observable Framework Configuration
// See https://observablehq.com/framework/config for full documentation

import MarkdownItFootnote from "markdown-it-footnote";

export default {
  // The app's title - used in the sidebar and webpage titles
  // Replace with your own site title
  title: "Your Site Title",

  // Configure markdown-it plugins
  // The footnote plugin enables academic-style citations [^1]
  markdownIt: (md) => md.use(MarkdownItFootnote),

  // Pages and sections in the sidebar
  // Customize this to organize your content
  // Pages not listed here are still accessible via their URLs
  pages: [
    {
      name: "Examples",
      pages: [
        {name: "Example 1", path: "/inception-report"},
        {name: "Example 2", path: "/interim-report"}
      ]
    }
  ],

  // Content to add to the <head> of every page
  // Useful for favicons, meta tags, custom fonts, etc.
  head: `<link rel="icon" href="observable.png" type="image/png" sizes="32x32">`,

  // The path to the source root
  root: "src",

  // Footer displayed on every page
  // Customize or remove as needed
  footer: `Built with Observable Framework`,

  // Additional configuration options:
  // Uncomment and customize as needed

  // theme: "default",           // Options: "default", "light", "dark", "slate", "air", "cotton", "wide"
  // sidebar: true,              // Show/hide the sidebar
  // toc: true,                  // Show/hide table of contents by default
  // pager: true,                // Show/hide previous & next links in footer
  // search: true,               // Enable/disable search functionality
  // linkify: true,              // Auto-convert URLs in markdown to links
  // typographer: false,         // Smart quotes and typographic improvements
  // preserveExtension: false,   // Keep .html in URLs
  // preserveIndex: false,       // Keep /index in URLs
};
