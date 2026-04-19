#!/bin/bash

# OmniFlow Backend Deployment Script
# Targets: Google Cloud Run

GCLOUD="/Users/tirthkosambia/google-cloud-sdk/bin/gcloud"
export CLOUDSDK_PYTHON="/usr/local/bin/python3.14"
PROJECT_ID="ultra-reflector-418204"
REGION="us-central1"

echo "🚀 Starting OmniFlow Backend Deployment to GCP Project: $PROJECT_ID"

# 1. Telemetry Ingestion
echo "📦 Deploying Telemetry Ingestion Service..."
$GCLOUD builds submit --tag gcr.io/$PROJECT_ID/telemetry-ingestion ./services/telemetry-ingestion --project $PROJECT_ID
INGESTION_URL=$($GCLOUD run deploy telemetry-ingestion \
  --image gcr.io/$PROJECT_ID/telemetry-ingestion \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID \
  --format="value(status.url)")

# 2. Routing Engine
echo "📦 Deploying Routing Engine..."
$GCLOUD builds submit --tag gcr.io/$PROJECT_ID/routing-engine ./services/routing-engine --project $PROJECT_ID
ROUTING_URL=$($GCLOUD run deploy routing-engine \
  --image gcr.io/$PROJECT_ID/routing-engine \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID \
  --format="value(status.url)")

# 3. Queue Intelligence
echo "📦 Deploying Queue Intelligence..."
$GCLOUD builds submit --tag gcr.io/$PROJECT_ID/queue-intelligence ./services/queue-intelligence --project $PROJECT_ID
QUEUE_URL=$($GCLOUD run deploy queue-intelligence \
  --image gcr.io/$PROJECT_ID/queue-intelligence \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID \
  --format="value(status.url)")

# 4. API Gateway
echo "📦 Deploying Consolidated API Gateway..."
$GCLOUD builds submit --tag gcr.io/$PROJECT_ID/api-gateway ./services/api-gateway --project $PROJECT_ID
GATEWAY_URL=$($GCLOUD run deploy api-gateway \
  --image gcr.io/$PROJECT_ID/api-gateway \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --project $PROJECT_ID \
  --set-env-vars "ROUTING_ENGINE_URL=$ROUTING_URL,QUEUE_INTELLIGENCE_URL=$QUEUE_URL,TELEMETRY_INGESTION_URL=$INGESTION_URL" \
  --format="value(status.url)")

echo "✅ All backend services deployed successfully!"
echo "------------------------------------------------"
echo "Telemetry Ingestion: $INGESTION_URL"
echo "Routing Engine:      $ROUTING_URL"
echo "Queue Intelligence:  $QUEUE_URL"
echo "API Gateway (ENTRY POINT): $GATEWAY_URL"
echo "------------------------------------------------"
