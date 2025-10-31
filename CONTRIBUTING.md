# Contributing to Observable Framework + PDF Export Template

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [Style Guidelines](#style-guidelines)
- [Testing](#testing)

## Code of Conduct

This project aims to be welcoming and inclusive. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the issue
- **Expected behavior** vs. actual behavior
- **Environment details** (OS, Node.js version, npm version)
- **Screenshots or code snippets** if applicable
- **Error messages** or logs

### Suggesting Enhancements

Enhancement suggestions are welcome! Please include:

- **Clear use case** - Why would this be useful?
- **Detailed description** of the proposed functionality
- **Examples** of how it would work
- **Alternative approaches** you've considered

### Pull Requests

We welcome pull requests for:

- Bug fixes
- Documentation improvements
- New features (please discuss in an issue first)
- Performance improvements
- Code quality improvements

## Development Setup

### Prerequisites

- Node.js 18 or later
- npm (comes with Node.js)
- Git

### Installation

1. **Fork the repository** on GitHub

2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/ORIGINAL-REPO.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   npm run pdf:install
   ```

5. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

## Development Workflow

### Running Locally

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
```

### Making Changes

1. **Make your changes** in your feature branch

2. **Test your changes**:
   ```bash
   # Build the site
   npm run build

   # Export PDFs
   npm run pdf:build

   # Verify everything works
   ```

3. **Keep your branch updated**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Directory Structure

- `src/` - Observable Framework source files (markdown pages, data loaders)
- `pdf-export/` - PDF export system
  - `config/` - PDF configuration and styles
  - `src/` - PDF conversion scripts
- `.github/workflows/` - GitHub Actions workflows
- `observablehq.config.js` - Framework configuration

## Submitting Changes

### Before Submitting

- [ ] Test your changes thoroughly
- [ ] Ensure the build completes without errors (`npm run pdf:build`)
- [ ] Update documentation if needed
- [ ] Write clear commit messages
- [ ] Keep changes focused (one feature/fix per PR)

### Commit Messages

Use clear, descriptive commit messages:

```
Add feature for custom PDF headers

- Implement header configuration in config.json
- Update styler.js to inject custom headers
- Add documentation in README.md
```

Format:
- **First line**: Brief summary (50 chars or less)
- **Blank line**
- **Body**: Detailed explanation (if needed)

### Creating a Pull Request

1. **Push your changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create PR on GitHub**:
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill out the PR template

3. **PR Description should include**:
   - What changes were made
   - Why they were made
   - How to test them
   - Screenshots (if UI changes)
   - Related issues (use "Fixes #123" or "Closes #123")

### After Submitting

- Be responsive to feedback
- Make requested changes in the same branch
- Push updates (they'll automatically appear in the PR)

## Style Guidelines

### JavaScript

- Use ES6+ syntax
- Prefer `const` and `let` over `var`
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code patterns in the project

Example:
```javascript
// Good
const pageConfigs = await loadConfigurations();
const pdfOptions = getPdfOptions(config);

// Avoid
const c = await load();
var opts = get(c);
```

### Markdown

- Use clear, concise language
- Include code examples where helpful
- Use proper heading hierarchy
- Add blank lines between sections

### Documentation

- Update README.md for user-facing changes
- Update CLAUDE.md for technical implementation details
- Include examples in documentation
- Keep documentation synchronized with code

## Testing

### Manual Testing

Before submitting, test:

1. **Development server**:
   ```bash
   npm run dev
   # Verify pages load correctly
   ```

2. **Build process**:
   ```bash
   npm run build
   # Check dist/ folder
   ```

3. **PDF export**:
   ```bash
   npm run pdf:build
   # Verify PDFs in pdf-export/output/
   ```

4. **Different scenarios**:
   - New pages
   - Custom configurations
   - Different PDF formats
   - Edge cases

### Testing PDF Changes

If you're modifying the PDF export system:

```bash
# Test with example pages
npm run pdf:export

# Verify output in pdf-export/output/
# Check PDFs are correctly formatted
# Ensure styles are applied properly
```

## Areas for Contribution

Some areas where contributions would be particularly welcome:

### Documentation
- Additional examples and tutorials
- Video walkthroughs
- Translations
- FAQ entries

### Features
- Additional PDF export options
- Enhanced styling capabilities
- New example templates
- Integration with other services

### Infrastructure
- Automated testing
- Additional deployment platforms
- Performance improvements
- Error handling improvements

### Bug Fixes
- See [open issues](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/issues) labeled "bug"
- Test edge cases
- Improve error messages

## Questions?

- **General questions**: Open a [discussion](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/discussions)
- **Bug reports**: Open an [issue](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/issues)
- **Feature requests**: Open an [issue](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME/issues) with "enhancement" label

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- Release notes (for significant contributions)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to making this template better for everyone!
