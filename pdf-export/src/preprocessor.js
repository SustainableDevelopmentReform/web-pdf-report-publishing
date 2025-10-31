import { readFile } from 'fs/promises';
import { JSDOM } from 'jsdom';

export class HTMLPreprocessor {
  constructor() {
    this.elementsToRemove = [
      '.observablehq-header',
      '.observablehq-footer',
      '.observablehq-sidebar',
      '.observablehq-sidebar-toggle',
      '.observablehq-toc',
      '.observablehq-toc-toggle',
      '.observablehq-search',
      '.observablehq-theme-toggle',
      '.observablehq-pager',
      '#observablehq-sidebar-toggle',
      '#observablehq-toc-toggle'
    ];
  }

  async processHTML(filePath) {
    const html = await readFile(filePath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Remove Observable UI elements
    this.elementsToRemove.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Also remove by ID and other selectors
    const additionalSelectors = [
      '#observablehq-sidebar',
      '#observablehq-toc',
      '#observablehq-center > aside',
      'nav#observablehq-sidebar',
      'aside#observablehq-toc',
      'script'
    ];
    
    additionalSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => el.remove());
    });

    // Update main content area for full width
    const mainContent = document.querySelector('.observablehq-main');
    if (mainContent) {
      mainContent.style.maxWidth = 'none';
      mainContent.style.margin = '0';
      mainContent.style.padding = '0';
    }

    // Inject title page for reports
    if (filePath.includes('inception-report')) {
      this.injectTitlePage(document);
    }

    // Ensure all images and assets use absolute paths
    this.fixAssetPaths(document, filePath);

    // Wait for any lazy-loaded content
    this.ensureContentLoaded(document);

    return dom.serialize();
  }

  fixAssetPaths(document, filePath) {
    // Fix image sources
    document.querySelectorAll('img').forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('data:')) {
        // Convert relative paths to absolute
        img.setAttribute('src', this.resolveAssetPath(src, filePath));
      }
    });

    // Fix link hrefs for stylesheets
    document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http')) {
        link.setAttribute('href', this.resolveAssetPath(href, filePath));
      }
    });
  }

  resolveAssetPath(relativePath, htmlFilePath) {
    // This is a simple implementation - adjust based on your actual file structure
    if (relativePath.startsWith('/')) {
      return `file://${process.cwd()}/dist${relativePath}`;
    }
    return `file://${process.cwd()}/dist/${relativePath}`;
  }

  ensureContentLoaded(document) {
    // Add markers to indicate content is ready for PDF
    document.querySelectorAll('svg').forEach(svg => {
      svg.setAttribute('data-rendered', 'true');
    });

    // Remove any loading indicators
    document.querySelectorAll('.loading, .spinner').forEach(el => el.remove());
  }

  injectTitlePage(document) {
    // Get the first h1 for the title
    const firstH1 = document.querySelector('h1');
    const title = firstH1 ? firstH1.textContent.replace(/^Inception Report:\s*/i, '').trim() : 'Document';
    
    // Get the executive summary
    const execSummaryH2 = Array.from(document.querySelectorAll('h2')).find(h2 => 
      h2.textContent.toLowerCase().includes('executive summary')
    );
    
    let subtitle = '';
    if (execSummaryH2 && execSummaryH2.nextElementSibling) {
      subtitle = execSummaryH2.nextElementSibling.textContent.substring(0, 200) + '...';
    }
    
    // Get current date
    const today = new Date();
    const dateStr = today.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    // Create title page HTML
    const titlePageHTML = `
      <div class="hero">
        <h1>${title}</h1>
        ${subtitle ? `<p class="subtitle">${subtitle}</p>` : ''}
        <p class="date">${dateStr}</p>
      </div>
    `;
    
    // Insert at the beginning of the main content
    const mainContent = document.querySelector('#observablehq-main, .observablehq-main, main');
    if (mainContent && mainContent.firstChild) {
      const titlePageDiv = document.createElement('div');
      titlePageDiv.innerHTML = titlePageHTML;
      mainContent.insertBefore(titlePageDiv.firstChild, mainContent.firstChild);
    }
  }
}