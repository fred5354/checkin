# Google Cloud Platform Deployment Guide

## Prerequisites

1. Google Cloud Platform account
2. Google Cloud SDK installed and configured
3. MongoDB Atlas account
4. Domain name (optional)

## Step 1: MongoDB Atlas Setup

1. Create MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create new cluster (free tier is fine for starting)
3. Set up database user and password
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string
6. Create database 'volunteers'

## Step 2: Backend Deployment (Cloud Run)

1. Install Google Cloud SDK:
```bash
# Follow instructions at https://cloud.google.com/sdk/docs/install
```

2. Initialize GCP project:
```bash
gcloud init
gcloud config set project your-project-id
```

3. Create Dockerfile in backend directory:
```dockerfile
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]
```

4. Build and deploy to Cloud Run:
```bash
# Build the container
gcloud builds submit --tag gcr.io/your-project-id/volunteers-backend

# Deploy to Cloud Run
gcloud run deploy volunteers-backend \
  --image gcr.io/your-project-id/volunteers-backend \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=your_mongodb_atlas_uri,NODE_ENV=production"
```

## Step 3: Frontend Deployment (Firebase Hosting)

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize Firebase:
```bash
firebase login
firebase init hosting
```

3. Create firebase.json:
```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

4. Build and deploy frontend:
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## Step 4: Domain and SSL (Optional)

1. Cloud DNS setup:
- Create a new zone in Cloud DNS
- Add A record pointing to Firebase Hosting
- Add CNAME record for API subdomain pointing to Cloud Run

2. SSL Certificates:
- SSL is automatically handled by Cloud Run and Firebase Hosting
- Configure custom domains in Firebase Console and Cloud Run

## Step 5: Environment Variables

1. Update frontend production environment:
```
REACT_APP_PROD_API_URL=https://your-cloud-run-url
```

2. Update Cloud Run environment:
```bash
gcloud run services update volunteers-backend \
  --set-env-vars="MONGODB_URI=your_mongodb_atlas_uri,NODE_ENV=production"
```

## Step 6: Monitoring and Maintenance

1. Set up Cloud Monitoring:
- Enable Cloud Monitoring API
- Create dashboards for:
  - Cloud Run metrics
  - Application errors
  - Request latency

2. Enable logging:
- Cloud Run logs automatically sent to Cloud Logging
- Firebase Hosting logs available in Firebase Console
- Set up log-based metrics

3. Regular maintenance:
- Monitor error rates in Cloud Logging
- Check resource utilization
- Review security updates
- Backup database regularly

## Troubleshooting

1. CORS issues:
- Verify CORS configuration in backend
- Check API URL in frontend
- Ensure Cloud Run service is public

2. Connection issues:
- Check MongoDB Atlas IP whitelist
- Verify service account permissions
- Test API endpoints

3. Deployment issues:
- Check Cloud Run logs
- Verify environment variables
- Check IAM permissions

## Cost Optimization

1. Free tier usage:
- MongoDB Atlas free tier
- Cloud Run free tier (2 million requests/month)
- Firebase Hosting free tier

2. Scaling considerations:
- Cloud Run automatic scaling
- Firebase CDN caching
- MongoDB Atlas scaling

## CI/CD Setup (Optional)

1. Set up Cloud Build:
```yaml
# cloudbuild.yaml
steps:
  # Build and test backend
  - name: 'node:16'
    dir: 'backend'
    entrypoint: npm
    args: ['install']
  - name: 'node:16'
    dir: 'backend'
    entrypoint: npm
    args: ['test']
  
  # Deploy backend to Cloud Run
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/volunteers-backend', './backend']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/volunteers-backend']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'volunteers-backend'
      - '--image'
      - 'gcr.io/$PROJECT_ID/volunteers-backend'
      - '--platform'
      - 'managed'
      - '--region'
      - 'us-central1'
      
  # Build and deploy frontend
  - name: 'node:16'
    dir: 'frontend'
    entrypoint: npm
    args: ['install']
  - name: 'node:16'
    dir: 'frontend'
    entrypoint: npm
    args: ['run', 'build']
  - name: 'gcr.io/$PROJECT_ID/firebase'
    args: ['deploy', '--only', 'hosting']
``` 