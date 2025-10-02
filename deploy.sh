#!/bin/bash

# AI Freelance Manager - Google Cloud Deployment Script
# This script builds and deploys the application to Google Cloud Platform

set -e

echo "🚀 Starting AI Freelance Manager deployment to Google Cloud..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ gcloud CLI is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Please authenticate with gcloud first:"
    echo "   gcloud auth login"
    exit 1
fi

# Set project ID (you'll need to update this)
PROJECT_ID="ai-freelance-manager"
REGION="europe-west"
INSTANCE_NAME="ai-freelance-manager-db"

echo "📋 Configuration:"
echo "   Project ID: $PROJECT_ID"
echo "   Region: $REGION"
echo "   Database Instance: $INSTANCE_NAME"

# Update project ID in app.yaml
sed -i.bak "s/PROJECT_ID/$PROJECT_ID/g" app.yaml
sed -i.bak "s/REGION/$REGION/g" app.yaml
sed -i.bak "s/INSTANCE_NAME/$INSTANCE_NAME/g" app.yaml

echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

echo "📦 Deploying to Google App Engine..."
gcloud app deploy app.yaml --project=$PROJECT_ID

echo "✅ Deployment completed!"
echo "🌐 Your app should be available at: https://$PROJECT_ID.appspot.com"

# Restore original app.yaml
mv app.yaml.bak app.yaml

echo "📝 Next steps (if not already done):"
echo "   1. Set up Cloud SQL database:"
echo "      gcloud sql instances create $INSTANCE_NAME --database-version=POSTGRES_14 --tier=db-f1-micro --region=$REGION"
echo "   2. Create database:"
echo "      gcloud sql databases create ai_freelance_manager --instance=$INSTANCE_NAME"
echo "   3. Update DATABASE_URL in app.yaml with your actual connection string"
