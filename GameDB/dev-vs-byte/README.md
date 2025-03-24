# Dev vs Byte Game

A Next.js application that lets users play as either developers or hackers in a cybersecurity-themed game.

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production
bun run build
```

## Deploying to GitHub Pages

This project is configured for easy deployment to GitHub Pages. Here's how to deploy:

### Option 1: Using GitHub Actions (Recommended)

1. Push your code to a GitHub repository
2. Go to your repository on GitHub and click on the "Settings" tab
3. Scroll down to the "Pages" section
4. Under "Build and deployment", select "GitHub Actions" as the source
5. The workflow file in `.github/workflows/deploy.yml` will automatically handle the deployment process

### Option 2: Manual Deployment

1. Build the project for static export:
   ```bash
   bun run build
   ```

2. This will create an `out` directory with the static files

3. Push the contents of the `out` directory to the `gh-pages` branch of your repository:
   ```bash
   git add out/ -f
   git commit -m "Deploy to GitHub Pages"
   git subtree push --prefix out origin gh-pages
   ```

4. Configure GitHub Pages to serve from the `gh-pages` branch

## Project Structure

- `src/app`: Next.js pages and layouts
- `src/components`: React components
- `src/lib`: Utility functions and store
- `src/hooks`: Custom React hooks
- `public`: Static assets

## Features

- Team selection between Developers and Hackers
- Different game mechanics for each team
- Progress tracking and scoring
- Responsive design
