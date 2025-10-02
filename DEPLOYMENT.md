# Google Cloud Deployment Guide

## Prerequisites

1. **Install Google Cloud CLI**
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

2. **Authenticate with Google Cloud**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

3. **Create a Google Cloud Project**
   ```bash
   gcloud projects create your-project-id
   gcloud config set project your-project-id
   ```

## Database Setup

### 1. Create Cloud SQL Instance
```bash
gcloud sql instances create ai-freelance-manager-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=your-secure-password
```

### 2. Create Database
```bash
gcloud sql databases create ai_freelance_manager \
  --instance=ai-freelance-manager-db
```

### 3. Create Database User
```bash
gcloud sql users create app-user \
  --instance=ai-freelance-manager-db \
  --password=your-app-password
```

## Configuration Updates

### 1. Update app.yaml
Replace the following placeholders in `app.yaml`:
- `PROJECT_ID`: Your Google Cloud project ID
- `REGION`: Your preferred region (e.g., us-central1)
- `INSTANCE_NAME`: Your Cloud SQL instance name
- Update `DATABASE_URL` with your actual connection string
- Update `ALLOWED_ORIGINS` with your frontend domain

### 2. Update Frontend Environment
Create `frontend/.env.production`:
```env
VITE_API_BASE=https://your-project-id.appspot.com
```

## Deployment Options

### Option 1: Automated Deployment (Recommended)
```bash
# Make sure to update PROJECT_ID in deploy.sh first
./deploy.sh
```

### Option 2: Manual Deployment

#### Backend (App Engine)
```bash
# Build frontend
cd frontend
npm install
npm run build
cd ..

# Deploy backend
gcloud app deploy app.yaml
```

#### Frontend (App Engine - Same Deployment)
The frontend is now deployed together with the backend on App Engine.
The static files are served directly from the `frontend/dist` directory.
Just run the backend deployment and the frontend will be included automatically.

## Environment Variables

Set these in your `app.yaml` or Google Cloud Console:

```yaml
env_variables:
  DATABASE_URL: "postgresql://app-user:password@/ai_freelance_manager?host=/cloudsql/PROJECT_ID:REGION:INSTANCE_NAME"
  ALLOWED_ORIGINS: "https://your-frontend-domain.com"
```

## Monitoring and Logs

### View Application Logs
```bash
gcloud app logs tail -s default
```

### Monitor Performance
- Visit [Google Cloud Console](https://console.cloud.google.com)
- Navigate to App Engine > Instances
- Check Cloud SQL > Instances for database metrics

## Security Considerations

1. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict IP access if needed

2. **CORS Configuration**
   - Update `ALLOWED_ORIGINS` with your actual domains
   - Remove wildcard (*) in production

3. **Environment Variables**
   - Never commit sensitive data to version control
   - Use Google Secret Manager for sensitive data

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check Cloud SQL instance is running
   - Verify connection string format
   - Ensure App Engine has Cloud SQL access

2. **CORS Errors**
   - Verify `ALLOWED_ORIGINS` includes your frontend domain
   - Check frontend API base URL

3. **Build Failures**
   - Ensure all dependencies are in `requirements.txt`
   - Check Python version compatibility

### Useful Commands

```bash
# Check deployment status
gcloud app versions list

# View specific version logs
gcloud app logs tail -s default -v VERSION_ID

# Rollback to previous version
gcloud app versions migrate PREVIOUS_VERSION_ID

# Delete old versions
gcloud app versions delete OLD_VERSION_ID
```

## Cost Optimization

1. **App Engine**
   - Use automatic scaling
   - Set appropriate min/max instances
   - Monitor usage in Cloud Console

2. **Cloud SQL**
   - Start with db-f1-micro tier
   - Monitor usage and scale up as needed
   - Consider stopping instances during development

3. **Storage**
   - Frontend assets are served from App Engine
   - Monitor bandwidth usage in Cloud Console

## Next Steps

After successful deployment:

1. Set up custom domain (optional)
2. Configure SSL certificates
3. Set up monitoring and alerting
4. Implement CI/CD pipeline
5. Add backup strategies for database
