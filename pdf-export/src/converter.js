import puppeteer from 'puppeteer';
import { glob } from 'glob';
import { readFile, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { program } from 'commander';
import { HTMLPreprocessor } from './preprocessor.js';
import { StyleManager } from './styler.js';
import { QRGenerator } from './qr-generator.js';
import {
  Logger,
  ensureDirectory,
  getDocumentType,
  generateOutputPath,
  shouldExclude,
  delay,
  formatBytes,
  formatDuration
} from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PDFConverter {
  constructor(options = {}) {
    this.distDir = options.distDir || join(__dirname, '..', '..', 'dist');
    this.outputDir = options.outputDir || join(__dirname, '..', 'output');
    this.configPath = options.configPath || join(__dirname, '..', 'config', 'config.json');
    
    this.preprocessor = new HTMLPreprocessor();
    this.styleManager = new StyleManager();
    this.qrGenerator = new QRGenerator();
    this.logger = new Logger(options.verbose !== false);
    
    this.config = null;
    this.browser = null;
    this.stats = {
      total: 0,
      successful: 0,
      failed: 0,
      startTime: Date.now()
    };
  }

  async init() {
    try {
      // Load configuration
      const configContent = await readFile(this.configPath, 'utf8');
      this.config = JSON.parse(configContent);
      
      // Ensure output directory exists
      await ensureDirectory(this.outputDir);
      
      this.logger.info('PDF Converter initialized');
      this.logger.info(`Input directory: ${this.distDir}`);
      this.logger.info(`Output directory: ${this.outputDir}`);
      
    } catch (error) {
      this.logger.error(`Failed to initialize: ${error.message}`);
      throw error;
    }
  }

  async findHTMLFiles() {
    const pattern = join(this.distDir, '**/*.html');
    const files = await glob(pattern);
    
    // Filter out excluded files
    const filteredFiles = files.filter(file => 
      !shouldExclude(file, this.config.excludeFiles)
    );
    
    this.logger.info(`Found ${filteredFiles.length} HTML files to convert`);
    return filteredFiles;
  }

  getPageConfig(filePath) {
    const documentType = getDocumentType(filePath);
    const specificConfig = this.config.documents[documentType] || {};
    
    return {
      ...this.config.defaults,
      ...specificConfig
    };
  }

  async convertFile(filePath) {
    const startTime = Date.now();
    let page;
    
    try {
      this.logger.info(`Converting: ${filePath}`);
      
      // Create new page
      page = await this.browser.newPage();
      
      // Set viewport for consistent rendering
      await page.setViewport({
        width: 1200,
        height: 800,
        deviceScaleFactor: 2
      });
      
      // Get configuration first
      const documentType = getDocumentType(filePath);
      const pageConfig = this.getPageConfig(filePath);
      
      // Navigate to the file URL to maintain proper context
      const fileUrl = `file://${filePath}`;
      await page.goto(fileUrl, {
        waitUntil: ['networkidle0', 'domcontentloaded'],
        timeout: pageConfig.timeout || 30000
      });
      
      // Complete style override in the browser
      await page.evaluate(() => {
        // Step 1: Remove ALL existing styles
        document.querySelectorAll('link[rel="stylesheet"]').forEach(el => el.remove());
        document.querySelectorAll('style').forEach(el => el.remove());
        
        // Step 2: Remove all inline styles
        document.querySelectorAll('*').forEach(el => {
          el.removeAttribute('style');
        });
        
        // Step 3: Remove Observable UI elements (but preserve heading text)
        const elementsToRemove = [
          '.observablehq-header',
          '.observablehq-footer',
          '#observablehq-footer',
          '.observablehq-sidebar',
          '.observablehq-sidebar-toggle',
          '.observablehq-toc',
          '.observablehq-toc-toggle',
          '.observablehq-search',
          '.observablehq-theme-toggle',
          '.observablehq-pager',
          '#observablehq-sidebar-toggle',
          '#observablehq-toc-toggle',
          '#observablehq-sidebar',
          '#observablehq-toc',
          '#observablehq-center > aside',
          'nav#observablehq-sidebar',
          'aside#observablehq-toc',
          'label[for="observablehq-sidebar-toggle"]',
          'footer'
        ];
        
        elementsToRemove.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => el.remove());
        });
        
        // Special handling for header anchors - preserve text
        document.querySelectorAll('.observablehq-header-anchor').forEach(anchor => {
          const heading = anchor.parentElement;
          if (heading && heading.tagName.match(/^H[1-6]$/)) {
            // Get the text content from the anchor
            const text = anchor.textContent;
            // Replace anchor with just text
            heading.textContent = text;
          }
        });
        
        // Step 4: Clean up Observable-specific classes
        document.querySelectorAll('[class*="observablehq"]').forEach(el => {
          // Keep the element but remove Observable classes
          const classes = Array.from(el.classList);
          classes.forEach(className => {
            if (className.includes('observablehq')) {
              el.classList.remove(className);
            }
          });
        });
        
        // Step 5: Ensure main content is full width
        const mainContent = document.querySelector('main, #observablehq-main');
        if (mainContent) {
          mainContent.id = 'main-content';
          mainContent.className = '';
        }
        
        // Step 6: Force headings to be visible
        document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
          heading.style.display = 'block';
          heading.style.visibility = 'visible';
          heading.style.opacity = '1';
        });
      });
      
      // Inject title page for inception report
      if (filePath.includes('inception-report')) {
        await page.evaluate(() => {
          // Get the first h1 for the title
          const firstH1 = document.querySelector('h1');
          const title = firstH1 ? firstH1.textContent.replace(/^Inception Report:\s*/i, '').trim() : 'Document';
          
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
              <p class="subtitle">A comprehensive analysis of trade agreement modernisation for critical mineral supply chains in the Indo-Pacific region</p>
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
        });
      }
      
      // Inject custom styles after page load
      const styles = await this.styleManager.loadStyles();
      await page.addStyleTag({ content: styles });

      // Generate formatted date string for footer
      const today = new Date();
      const dateStr = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Inject date as CSS custom property for footer
      await page.addStyleTag({
        content: `:root { --render-date: "${dateStr}"; }`
      });

      // Generate and inject QR code if enabled
      if (this.config.qrCode && this.config.qrCode.enabled) {
        try {
          // Get QR code configuration for this document type
          const qrConfig = {
            ...this.config.qrCode,
            ...(this.config.qrCode.documents && this.config.qrCode.documents[documentType] || {})
          };

          // Generate QR code data URL
          const qrDataUrl = await this.qrGenerator.generateForFile(filePath, qrConfig);

          if (qrDataUrl) {
            // Generate the URL for the hyperlink
            const url = this.qrGenerator.generateURL(filePath, qrConfig);

            // Inject QR code into the page
            const injectionScript = this.qrGenerator.generateInjectionScript(
              qrDataUrl,
              url,
              qrConfig.position || {}
            );
            await page.evaluate(injectionScript);
            this.logger.info('QR code injected successfully');
          }
        } catch (error) {
          this.logger.warn(`Failed to inject QR code: ${error.message}`);
        }
      }

      // Apply page-specific styles if needed
      if (pageConfig) {
        const pageStyles = this.styleManager.generatePageStyles(pageConfig);
        if (pageStyles) {
          await page.addStyleTag({ content: pageStyles });
        }
      }
      
      // Debug: Check if styles are applied
      const debugInfo = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        const h2 = document.querySelector('h2');
        const h3 = document.querySelector('h3');
        const footnotes = document.querySelector('.footnotes');
        
        // Check h1 structure
        let h1Info = 'No H1 found';
        if (h1) {
          h1Info = {
            textContent: h1.textContent,
            innerHTML: h1.innerHTML.substring(0, 100),
            childrenCount: h1.children.length,
            hasAnchor: h1.querySelector('a') !== null
          };
        }
        
        return {
          h1Info: h1Info,
          h1Styles: h1 ? {
            display: window.getComputedStyle(h1).display,
            visibility: window.getComputedStyle(h1).visibility,
            fontSize: window.getComputedStyle(h1).fontSize,
            color: window.getComputedStyle(h1).color
          } : null,
          h2First: h2 ? h2.textContent : 'No H2',
          h3First: h3 ? h3.textContent : 'No H3',
          h2Count: document.querySelectorAll('h2').length,
          footnotesCount: document.querySelectorAll('.footnotes').length,
          stylesCount: document.querySelectorAll('style').length,
          linksCount: document.querySelectorAll('link[rel="stylesheet"]').length
        };
      });
      
      this.logger.info(`Debug - H1 Info: ${JSON.stringify(debugInfo.h1Info)}`);
      this.logger.info(`Debug - H1 Styles: ${JSON.stringify(debugInfo.h1Styles)}`);
      this.logger.info(`Debug - H2 First: ${debugInfo.h2First}, H3 First: ${debugInfo.h3First}`);
      this.logger.info(`Debug - H2 Count: ${debugInfo.h2Count}, Footnotes Count: ${debugInfo.footnotesCount}`);
      this.logger.info(`Debug - Style tags: ${debugInfo.stylesCount}, Link tags: ${debugInfo.linksCount}`);
      
      // Wait for Observable Framework to finish rendering
      await page.waitForFunction(() => {
        // Check if Observable loading indicators are gone
        const loadingElements = document.querySelectorAll('observablehq-loading');
        if (loadingElements.length > 0) return false;
        
        // Check if SVGs have been rendered (they should have content)
        const svgs = document.querySelectorAll('svg');
        if (svgs.length === 0) {
          // If no SVGs yet, check if there are Observable cell placeholders
          const cells = document.querySelectorAll('[id^="cell-"]');
          return cells.length === 0 || Array.from(cells).every(cell => cell.children.length > 0);
        }
        
        return Array.from(svgs).every(svg => svg.children.length > 0);
      }, { timeout: 30000 }).catch(() => {
        this.logger.warn(`Observable render timeout for ${filePath}`);
      });
      
      // Log visualization count for debugging
      const svgCount = await page.evaluate(() => document.querySelectorAll('svg').length);
      if (svgCount > 0) {
        this.logger.info(`Found ${svgCount} SVG visualization(s)`);
      }
      
      // Wait for any async content
      if (this.config.waitConditions) {
        const { waitForSVGs, waitForImages, additionalWaitTime } = this.config.waitConditions;
        
        if (waitForSVGs) {
          await page.waitForFunction(() => {
            const svgs = document.querySelectorAll('svg');
            return Array.from(svgs).every(svg => 
              svg.children.length > 0 || svg.hasAttribute('data-rendered')
            );
          }, { timeout: 10000 }).catch(() => {
            this.logger.warn(`SVG wait timeout for ${filePath}`);
          });
        }
        
        if (waitForImages) {
          await page.waitForFunction(() => {
            const images = document.querySelectorAll('img');
            return Array.from(images).every(img => img.complete);
          }, { timeout: 10000 }).catch(() => {
            this.logger.warn(`Image wait timeout for ${filePath}`);
          });
        }
        
        if (additionalWaitTime) {
          await delay(additionalWaitTime);
        }
      }
      
      // Generate output path
      const outputPath = generateOutputPath(filePath, this.distDir, this.outputDir);
      await ensureDirectory(dirname(outputPath));

      // Generate PDF with all config options
      const pdfOptions = {
        path: outputPath,
        ...pageConfig
      };

      // Remove non-PDF options
      delete pdfOptions.timeout;

      await page.pdf(pdfOptions);
      
      // Get file size for reporting
      const stats = await stat(outputPath);
      const duration = Date.now() - startTime;
      
      this.logger.success(`Generated: ${outputPath} (${formatBytes(stats.size)}) in ${formatDuration(duration)}`);
      this.stats.successful++;
      
    } catch (error) {
      this.logger.error(`Failed to convert ${filePath}: ${error.message}`);
      this.stats.failed++;
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async convertAll(options = {}) {
    try {
      await this.init();
      
      // Launch browser
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--font-render-hinting=none'
        ]
      });
      
      // Find all HTML files
      const htmlFiles = await this.findHTMLFiles();
      this.stats.total = htmlFiles.length;
      
      if (htmlFiles.length === 0) {
        this.logger.warn('No HTML files found to convert');
        return;
      }
      
      // Convert files
      if (options.parallel && options.parallel > 1) {
        // Parallel processing
        const chunks = [];
        for (let i = 0; i < htmlFiles.length; i += options.parallel) {
          chunks.push(htmlFiles.slice(i, i + options.parallel));
        }
        
        for (const chunk of chunks) {
          await Promise.all(chunk.map(file => this.convertFile(file)));
        }
      } else {
        // Sequential processing
        for (let i = 0; i < htmlFiles.length; i++) {
          this.logger.progress(i + 1, htmlFiles.length, `Processing files...`);
          await this.convertFile(htmlFiles[i]);
        }
      }
      
      // Report results
      const totalDuration = Date.now() - this.stats.startTime;
      this.logger.info('');
      this.logger.info('Conversion complete:');
      this.logger.success(`✓ ${this.stats.successful} files converted successfully`);
      if (this.stats.failed > 0) {
        this.logger.error(`✗ ${this.stats.failed} files failed`);
      }
      this.logger.info(`Total time: ${formatDuration(totalDuration)}`);
      
    } catch (error) {
      this.logger.error(`Fatal error: ${error.message}`);
      process.exit(1);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }

  async convertSingle(filePath, options = {}) {
    try {
      await this.init();
      
      // Launch browser
      this.browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--font-render-hinting=none'
        ]
      });
      
      this.stats.total = 1;
      await this.convertFile(filePath);
      
    } catch (error) {
      this.logger.error(`Fatal error: ${error.message}`);
      process.exit(1);
    } finally {
      if (this.browser) {
        await this.browser.close();
      }
    }
  }
}

// CLI Interface
if (import.meta.url === `file://${process.argv[1]}`) {
  program
    .name('pdf-export')
    .description('Convert Observable Framework HTML output to PDF')
    .version('1.0.0')
    .option('-i, --input <dir>', 'Input directory (dist folder)', '../dist')
    .option('-o, --output <dir>', 'Output directory for PDFs', './output')
    .option('-c, --config <path>', 'Configuration file path', './config/config.json')
    .option('-f, --file <path>', 'Convert a single file')
    .option('-p, --parallel <number>', 'Number of parallel conversions', parseInt, 1)
    .option('-v, --verbose', 'Verbose output', true)
    .option('-q, --quiet', 'Quiet mode (minimal output)', false)
    .parse();

  const options = program.opts();
  
  const converter = new PDFConverter({
    distDir: join(dirname(fileURLToPath(import.meta.url)), '..', options.input),
    outputDir: join(dirname(fileURLToPath(import.meta.url)), '..', options.output),
    configPath: join(dirname(fileURLToPath(import.meta.url)), '..', options.config),
    verbose: !options.quiet
  });

  if (options.file) {
    converter.convertSingle(options.file, { parallel: options.parallel });
  } else {
    converter.convertAll({ parallel: options.parallel });
  }
}