# Deploying Dev vs Byte to GitHub Pages

This guide will walk you through deploying your Dev vs Byte game to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your local machine
- Basic knowledge of Git commands

## Option 1: Using GitHub Actions (Recommended)

This project is already configured to use GitHub Actions for automated deployment to GitHub Pages.

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com/) and sign in to your account.
2. Click on the "+" icon in the top-right corner and select "New repository".
3. Name your repository `dev-vs-byte` (or any name you prefer).
4. Set the repository to "Public" (GitHub Pages requires a public repository unless you have a paid GitHub account).
5. Click "Create repository".

### Step 2: Push Your Code to GitHub

Run these commands from the root directory of your project:

```bash
# Initialize git repository (if not already initialized)
git init

# Add all files to git
git add .

# Commit the files
git commit -m "Initial commit"

# Add the remote repository
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/dev-vs-byte.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username.

### Step 3: Configure GitHub Pages

1. Go to your repository on GitHub.
2. Click on "Settings" in the top navigation bar.
3. Scroll down to the "Pages" section in the left sidebar.
4. Under "Build and deployment" > "Source", select "GitHub Actions".
5. GitHub will automatically detect the workflow file in the `.github/workflows/deploy.yml` path.

### Step 4: Trigger the First Deployment

The deployment should start automatically after pushing the code. If it doesn't:

1. Go to the "Actions" tab in your repository.
2. You should see the "Deploy to GitHub Pages" workflow listed.
3. Click on it and then click the "Run workflow" button.

Once completed, your site will be available at:
`https://YOUR_GITHUB_USERNAME.github.io/dev-vs-byte/`

## Option 2: Manual Deployment

If you prefer to deploy manually:

### Step 1: Build the Project

```bash
cd dev-vs-byte
bun run build
```

This will create an `out` directory with static files.

### Step 2: Deploy Using Git Subtree

```bash
# Add the out directory (force add since it's likely gitignored)
git add out/ -f

# Commit the build files
git commit -m "Deploy to GitHub Pages"

# Push the out directory to gh-pages branch
git subtree push --prefix out origin gh-pages
```

### Step 3: Configure GitHub Pages to Use the gh-pages Branch

1. Go to your repository on GitHub.
2. Navigate to Settings > Pages.
3. Under "Source", select "Deploy from a branch".
4. Select the "gh-pages" branch and the "/ (root)" folder.
5. Click "Save".

## Updating Your Site

To update your site after making changes:

### Using GitHub Actions (Option 1)

Simply push your changes to the main branch, and the GitHub Action will automatically rebuild and redeploy your site.

### Manual Deployment (Option 2)

Repeat the build and deployment steps described above in Option 2.

## Troubleshooting

- **404 Errors**: Make sure all your relative links include the base path (`/dev-vs-byte`) in production.
- **Build Failures**: Check the GitHub Actions logs for details on any build errors.
- **Missing Assets**: Ensure all assets are included in the build and correctly referenced.

If you encounter issues, check the GitHub Actions logs or open an issue in the repository.
