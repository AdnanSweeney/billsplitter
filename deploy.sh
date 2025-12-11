#!/bin/bash
# Deployment script for surge.sh
# Usage: ./deploy.sh or npm run deploy

set -e

echo "Building production bundle..."
npm run build

echo "Deploying to surge.sh..."
npx surge dist --domain billsplitter.surge.sh

echo "Deployment complete!"
echo "App is now available at: https://billsplitter.surge.sh"
