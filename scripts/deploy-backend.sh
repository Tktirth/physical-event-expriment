#!/bin/bash

# OmniFlow Backend Deployment Script
# Targets: Google Cloud Run

PROJECT_ID="ultra-reflector-418204"
REGION="us-central1"

echo "🚀 Starting OmniFlow Backend Deployment to GCP Project: $PROJECT_ID"

# 1. Telemetry Ingestion
echo "📦 Deploying Telemetry Ingestion Service..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/telemetry-ingestion ./services/telemetry-ingestion --project $PROJECT_ID
gcloud run deploy telemetry-ingestion \
  --image gcr.io/$PROJECT_ID/telemetry-ingestion \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID

# 2. Routing Engine
echo "📦 Deploying Routing Engine..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/routing-engine ./services/routing-engine --project $PROJECT_ID
gcloud run deploy routing-engine \
  --image gcr.io/$PROJECT_ID/routing-engine \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID

# 3. Queue Intelligence
echo "📦 Deploying Queue Intelligence..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/queue-intelligence ./services/queue-intelligence --project $PROJECT_ID
gcloud run deploy queue-intelligence \
  --image gcr.io/$PROJECT_ID/queue-intelligence \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID

echo "✅ All backend services deployed successfully!"
gcloud run services list --project $PROJECT_ID
