# Dev vs Byte - GitHub Pages Deployment

This repository contains the Dev vs Byte game, configured for deployment on GitHub Pages.

## Quick Start Guide

### Deploy Using GitHub Actions (Recommended)

1. **Create a GitHub repository**
   - Go to GitHub and create a new repository
   - Set it to public

2. **Push your code**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/dev-vs-byte.git
   git push -u origin main
   ```

3. **Set up GitHub Pages**
   - Go to repository Settings > Pages
   - Select "GitHub Actions" as the source
   - The site will automatically deploy

### Testing Your Deployment

1. Wait for the GitHub Actions workflow to complete
2. Your site will be available at:
   `https://YOUR_USERNAME.github.io/dev-vs-byte/`

## Detailed Documentation

For more comprehensive instructions, see:

- [GITHUB_PAGES_GUIDE.md](./GITHUB_PAGES_GUIDE.md) - Detailed deployment instructions
- [DEV_VS_BYTE_GITHUB_PAGES_CHECKLIST.md](./DEV_VS_BYTE_GITHUB_PAGES_CHECKLIST.md) - Pre-deployment checklist

## Troubleshooting

If you encounter deployment issues:

1. Check the GitHub Actions logs for error messages
2. Make sure all internal links use the `getBasePath()` function for correct paths
3. Verify that all syntax errors have been fixed
4. If using images, ensure they are properly referenced with the correct base path

## Common Issues and Solutions

### 404 Errors

If you see 404 errors after deployment:
- Check that `next.config.mjs` has the correct `basePath` setting
- Make sure all internal links are using the `getBasePath()` function
- Verify that the `.nojekyll` file exists in the `public` directory

### Blank Page

If you see a blank page after deployment:
- Open browser dev tools and check for console errors
- Make sure all JavaScript files are loading correctly
- Verify that the React app is mounting properly

## Questions or Issues?

If you encounter any problems with the deployment, please check the detailed documentation or open an issue in this repository.
