# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD.

## deploy.yml

Automatically deploys the BillSplitter app to surge.sh when code is pushed to the `main` branch.

### Required Setup

Before the workflow can run successfully, you must add your Surge token as a GitHub secret:

1. **Get your Surge token:**
   ```bash
   npx surge login
   npx surge token
   ```

2. **Add to GitHub:**
   - Go to repository Settings → Secrets and variables → Actions
   - Create new secret: `SURGE_TOKEN`
   - Paste your token as the value

### What the Workflow Does

1. Checks out the code
2. Sets up Node.js 18
3. Installs dependencies
4. Builds the production bundle
5. Deploys to https://billsplitter.surge.sh

### Monitoring

- View workflow runs in the Actions tab
- Check the status badge in the README
- See deployment status next to commits

For more details, see [DEPLOYMENT.md](../../DEPLOYMENT.md)
