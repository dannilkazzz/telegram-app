# GitHub Actions Troubleshooting Guide for Next.js Deployment

## Common Issues and Solutions

### Error: "missing ) after argument list"

This error typically occurs due to syntax errors in your GitHub Actions workflow file.

#### Solution:

1. **Check Syntax in Shell Commands**:
   - Make sure all shell commands are properly formatted, especially in the `run:` sections
   - Ensure all string interpolations (`${{ ... }}`) are properly closed
   - Watch for missing quotes around variables with spaces

2. **Fix for the "Detect package manager" Step**:
   ```yaml
   - name: Detect package manager
     id: detect-package-manager
     run: |
       if [ -f "${{ github.workspace }}/yarn.lock" ]; then
         echo "manager=yarn" >> $GITHUB_OUTPUT
         echo "command=install" >> $GITHUB_OUTPUT
         echo "runner=yarn" >> $GITHUB_OUTPUT
         exit 0
       elif [ -f "${{ github.workspace }}/package.json" ]; then
         echo "manager=npm" >> $GITHUB_OUTPUT
         echo "command=ci" >> $GITHUB_OUTPUT
         echo "runner=npx --no-install" >> $GITHUB_OUTPUT
         exit 0
       else
         echo "Unable to determine package manager"
         exit 1
       fi
   ```

3. **Validate YAML Syntax**:
   - Use a YAML validator like [YAML Lint](https://www.yamllint.com/) to check for syntax errors
   - Make sure indentation is consistent (should be 2 spaces per level)

### Error: "Failed to build Next.js project"

If your Next.js build fails during GitHub Actions:

1. **Update Next.js Configuration**:
   Make sure your `next.config.js` is properly configured for static export:
   ```javascript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     basePath: process.env.NODE_ENV === 'production' ? '/your-repo-name' : '',
     images: {
       unoptimized: true,
     },
   };

   module.exports = nextConfig;
   ```

2. **Check for Missing Dependencies**:
   Ensure all required packages are listed in your `package.json`

3. **Node.js Version Mismatch**:
   Make sure you're using a compatible Node.js version in your workflow file

### Error: "404 Errors After Deployment"

If your site is deployed but shows 404 errors:

1. **Verify `.nojekyll` File**:
   Ensure you have an empty `.nojekyll` file in your public directory

2. **Check Base Path Configuration**:
   All internal links should use the correct base path, matching your repository name

3. **Image Loading Issues**:
   Make sure images use the correct paths and the `unoptimized: true` setting is enabled

## Debugging Tips

1. **Review GitHub Actions Logs**:
   - Click on the failing job to see detailed logs
   - Look for specific error messages or warnings

2. **Local Testing**:
   - Try building your project locally with `next build` to catch issues before deployment
   - Run `next export` (for Next.js 13 or earlier) to test static export functionality

3. **Clear Cache**:
   If you're experiencing persistent issues, try:
   - Going to the GitHub Actions tab
   - Clicking on "..." in the top right
   - Selecting "Delete workflow runs" to clear the cache
   - Then run the workflow again

## Need More Help?

- Check the [Next.js documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports) for static exports
- Visit the [GitHub Actions documentation](https://docs.github.com/en/actions)
- Search for specific error messages on [Stack Overflow](https://stackoverflow.com/questions/tagged/github-actions+next.js)
