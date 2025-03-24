# GitHub Pages Deployment Checklist for Dev vs Byte

Use this checklist to ensure your project is ready for GitHub Pages deployment:

## Required Configuration Files

- [x] **GitHub Actions Workflow File**
  - File: `.github/workflows/deploy.yml`
  - Purpose: Automates the build and deployment process

- [x] **Next.js Config**
  - File: `next.config.mjs`
  - Configuration:
    - `output: 'export'` - Enables static HTML export
    - `basePath: process.env.NODE_ENV === 'production' ? '/dev-vs-byte' : ''` - Sets the correct base path

- [x] **.nojekyll File**
  - File: `public/.nojekyll`
  - Purpose: Tells GitHub not to process your site with Jekyll

## Project Code Checks

- [ ] **Proper Path References**
  - Ensure all internal links use the `getBasePath()` function:
    ```tsx
    import { getBasePath } from "@/lib/utils";

    <a href={`${getBasePath()}/some-path`}>Link</a>
    ```

- [ ] **Static Images**
  - All images should use proper paths or be from allowed domains
  - Local images in `public` folder should be referenced correctly with base path

- [ ] **Fix Syntax Errors**
  - No missing parentheses, brackets, or other syntax errors
  - Properly handling Telegram WebApp integration

## GitHub Repository Setup

- [ ] **Create Repository**
  - Name the repository (e.g., "dev-vs-byte")
  - Set to public visibility

- [ ] **Push Code**
  - Initialize git if needed (`git init`)
  - Add all files (`git add .`)
  - Commit changes (`git commit -m "Initial commit"`)
  - Add remote (`git remote add origin https://github.com/YOUR_USERNAME/dev-vs-byte.git`)
  - Push to repository (`git push -u origin main`)

- [ ] **Configure GitHub Pages**
  - Repository Settings > Pages
  - Source: GitHub Actions (preferred) or Deploy from branch (gh-pages)

## Testing

- [ ] **Local Build Test**
  - Run `bun run build` to ensure it builds successfully
  - Check the `out` directory for generated files

- [ ] **Deployed Site Testing**
  - Check all navigation links work correctly
  - Verify all assets (images, styles) load properly
  - Test game functionality works as expected
  - Check responsive design on different device sizes

## Troubleshooting Guide

If you encounter issues, follow the detailed troubleshooting steps in the
[GITHUB_PAGES_GUIDE.md](./GITHUB_PAGES_GUIDE.md) document.

---

**Reminder:** Always test your build locally before pushing to GitHub. Run `bun run build`
and fix any errors before attempting deployment.
