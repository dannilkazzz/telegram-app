# Deploying Dev vs Byte to GitHub Pages

This comprehensive guide will walk you through the process of deploying your Dev vs Byte game to GitHub Pages, step by step.

## Overview

GitHub Pages allows you to host static websites directly from a GitHub repository. The Dev vs Byte game has already been configured for deployment on GitHub Pages with the necessary settings in:
- `next.config.mjs` - Configured for static export with correct base path
- `.github/workflows/deploy.yml` - GitHub Actions workflow for automatic deployment

## Deployment Options

You have two options for deploying to GitHub Pages:
1. **Automated deployment using GitHub Actions** (recommended)
2. **Manual deployment** by pushing to a gh-pages branch

## Option 1: Automated Deployment with GitHub Actions

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in to your account
2. Click the "+" button in the top-right corner and select "New repository"
3. Name your repository (e.g., "dev-vs-byte")
4. Set the repository to "Public" (required for GitHub Pages with a free account)
5. Click "Create repository"

### Step 2: Push Your Code to GitHub

Run these commands in your terminal from the root directory of your project:

```bash
# Navigate to your project directory if you're not already there
cd path/to/dev-vs-byte

# Initialize a git repository (if not already initialized)
git init

# Add all files to git staging
git add .

# Commit the files
git commit -m "Initial commit"

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/dev-vs-byte.git

# Push to GitHub
git push -u origin main
```

### Step 3: Configure GitHub Pages in Repository Settings

1. Go to your repository on GitHub
2. Click on "Settings" in the top navigation bar
3. In the left sidebar, click on "Pages"
4. Under "Build and deployment" > "Source", select "GitHub Actions"
5. GitHub will automatically detect the workflow file in `.github/workflows/deploy.yml`

### Step 4: Run the GitHub Actions Workflow

1. Go to the "Actions" tab in your repository
2. You should see the "Deploy to GitHub Pages" workflow
3. If it hasn't started automatically, click on "Run workflow" > "Run workflow"
4. Wait for the workflow to complete (this may take a few minutes)

Your site will be deployed to: `https://YOUR_USERNAME.github.io/dev-vs-byte/`

## Option 2: Manual Deployment

If you prefer to deploy manually:

### Step 1: Build the Project

```bash
# Navigate to your project directory
cd path/to/dev-vs-byte

# Install dependencies if you haven't already
bun install

# Build the project for static export
bun run build
```

This will create an `out` directory with the static files.

### Step 2: Deploy Using Git Subtree

```bash
# Force add the out directory (since it's gitignored)
git add out/ -f

# Commit the build files
git commit -m "Deploy to GitHub Pages"

# Push the out directory to the gh-pages branch
git subtree push --prefix out origin gh-pages
```

### Step 3: Configure GitHub Pages to Use the gh-pages Branch

1. Go to your repository on GitHub
2. Navigate to Settings > Pages
3. Under "Source", select "Deploy from a branch"
4. Select the "gh-pages" branch and the "/ (root)" folder
5. Click "Save"

Your site will be available at: `https://YOUR_USERNAME.github.io/dev-vs-byte/`

## Troubleshooting Common Issues

### 404 Errors After Deployment

If you're seeing 404 errors for assets or pages:

1. **Check base path configuration**: Ensure `next.config.mjs` has the correct `basePath` setting:
   ```javascript
   basePath: process.env.NODE_ENV === 'production' ? '/dev-vs-byte' : '',
   ```

2. **Check internal links**: All internal links should use:
   ```tsx
   import { getBasePath } from "@/lib/utils";
   // ...
   <a href={`${getBasePath()}/some-path`}>Link</a>
   ```

3. **Verify static files**: Make sure all static assets like images are properly referenced with the base path.

### Build Failures

1. **Check logs**: Review the GitHub Actions workflow logs for error messages
2. **Fix type errors**: Resolve any TypeScript errors in your codebase
3. **Dependency issues**: Ensure all dependencies are properly installed
4. **Update next.config.mjs**: Make sure the `output: 'export'` option is set

### Blank Page After Deployment

If you see a blank page:
1. Open browser dev tools and check for console errors
2. Ensure all JavaScript files are loading correctly
3. Verify HTML structure is intact in the deployed files

## Updating Your Site

After making changes to your code:

### For Automated Deployment (Option 1)
1. Commit and push your changes to the main branch
2. GitHub Actions will automatically rebuild and redeploy

### For Manual Deployment (Option 2)
1. Rebuild your project with `bun run build`
2. Force add, commit, and push the `out` directory again as described above

## Custom Domain (Optional)

To use a custom domain:

1. Go to your repository's Settings > Pages
2. Under "Custom domain", enter your domain name
3. Add a CNAME record at your domain registrar pointing to `YOUR_USERNAME.github.io`
4. Create a file named `CNAME` in the `public` directory with your domain name

## Viewing Your Deployed Site

After successful deployment, your site will be available at:
`https://YOUR_USERNAME.github.io/dev-vs-byte/`

Test all the functionality to make sure everything works correctly on the live site.
