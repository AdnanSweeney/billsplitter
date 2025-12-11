# BillSplitter - Deployment Guide

This document provides instructions for deploying the BillSplitter app to surge.sh, a static web publishing platform.

## Deployment Overview

The BillSplitter app is deployed to **surge.sh**, a simple, single-command web publishing platform for static content. This eliminates the need for complex server infrastructure while ensuring the app is always accessible.

## Live Application

**Public URL:** https://billsplitter.surge.sh

## Prerequisites

Before deploying, ensure you have:

1. **Node.js 18+** and **npm** installed
2. **surge CLI** installed as a dev dependency (already included in this project)
3. An internet connection for the deployment process

## Deployment Setup

### 1. Initial Setup (First Time Only)

If this is your first time deploying to surge.sh, you may need to set up a surge.sh account. The surge CLI will prompt you interactively:

```bash
npm run deploy
```

During the first deployment, surge will ask you to:
- Create a surge.sh account (email and password)
- Verify your email address

Once set up, you can deploy using the same command without further prompts.

### 2. Production Build Configuration

The project uses **Vite** as the build tool with the following configuration:

- **Build command:** `npm run build`
- **Output directory:** `dist/`
- **TypeScript compilation:** All TypeScript files are type-checked before building
- **Bundled dependencies:** React 19, styled-components, and all required libraries

## Deployment Methods

### Method 1: Using npm script (Recommended)

```bash
npm run deploy
```

This command:
1. Runs `npm run build` to create a production bundle
2. Deploys the `dist/` directory to surge.sh with the domain `billsplitter.surge.sh`

### Method 2: Using the deploy script

```bash
./deploy.sh
```

This is equivalent to Method 1 and provides additional console output.

### Method 3: Manual deployment (Advanced)

For more control, you can run each step separately:

```bash
# Step 1: Build the production bundle
npm run build

# Step 2: Deploy to surge with custom domain
npx surge dist --domain billsplitter.surge.sh

# Step 3: Follow the prompts to deploy
```

## Environment Configuration

The app requires no special environment variables for surge.sh deployment. All configuration is handled through:

- **package.json** - Deploy script configuration
- **vite.config.ts** - Build configuration
- **index.html** - Entry HTML file with correct asset paths

## Verification

After deployment, verify the live site:

1. **Access the application:**
   ```
   https://billsplitter.surge.sh
   ```

2. **Test functionality:**
   - Add bills with different tax rates
   - Split bills among multiple people
   - Verify calculations are correct

3. **Check browser console:**
   - No errors should appear in the browser console
   - All assets should load without 404 errors

## Redeploying

To redeploy with new changes:

1. **Commit your changes locally** (if using git):
   ```bash
   git add .
   git commit -m "Update feature"
   ```

2. **Run the deploy command:**
   ```bash
   npm run deploy
   ```

3. **Verify the changes are live:**
   - Hard refresh the browser (Ctrl+Shift+R or Cmd+Shift+R)
   - Check that the new changes are visible

## Troubleshooting

### Issue: Build fails with TypeScript errors

**Solution:** Run type checking locally first:
```bash
npm run lint
```

Fix any issues, then try deploying again.

### Issue: Surge command not found

**Solution:** Ensure surge is installed as a dev dependency:
```bash
npm install --save-dev surge
```

### Issue: Deployment hangs or times out

**Solution:** 
1. Check your internet connection
2. Manually cancel with Ctrl+C
3. Try deploying again

### Issue: Domain already in use

**Solution:** 
If `billsplitter.surge.sh` is taken, you can deploy to a different domain:
```bash
npx surge dist --domain your-custom-domain.surge.sh
```

Then update the `deploy` script in `package.json` with the new domain.

### Issue: Changes not appearing after deployment

**Solution:**
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check that you didn't have the site cached

## Maintenance

### Regular Updates

To keep the app updated:

1. **Make changes locally** in your feature branch
2. **Test locally:**
   ```bash
   npm run dev
   ```
3. **Build to verify** no errors:
   ```bash
   npm run build
   ```
4. **Deploy to production:**
   ```bash
   npm run deploy
   ```

### Monitoring

The app is served as a static site, so there are no server logs to monitor. However, you can:

- Check browser console for any client-side errors
- Use browser DevTools to check network requests
- Monitor surge.sh dashboard at https://surge.sh/ for usage statistics

## Architecture Notes

- **Static Hosting:** The app is hosted as static files only
- **No Backend:** All processing happens in the browser
- **No Database:** Data is stored in browser localStorage or passed as query parameters
- **Fully Responsive:** Works on all modern browsers

## Security

- **HTTPS:** All surge.sh domains include free HTTPS/SSL
- **Static Content:** No dynamic content generation or server processing
- **No User Data Stored:** App stores data locally in the browser only

## Support

For surge.sh-specific issues, visit:
- Surge.sh Documentation: https://surge.sh/help
- Surge.sh Issues: https://github.com/sintaxi/surge/issues

For BillSplitter app issues, check:
- Project Repository: https://github.com/AdnanSweeney/billsplitter
- Project Issues: https://github.com/AdnanSweeney/billsplitter/issues

## Summary

| Item | Details |
|------|---------|
| **Domain** | https://billsplitter.surge.sh |
| **Build Command** | `npm run build` |
| **Deploy Command** | `npm run deploy` |
| **Output Directory** | `dist/` |
| **Platform** | surge.sh (Static Hosting) |
| **HTTPS** | ✅ Yes (Free, always enabled) |
| **Environment Variables** | None required |
