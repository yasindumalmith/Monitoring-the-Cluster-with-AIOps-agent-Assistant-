#!/usr/bin/env bash
set -e

REGION="us-east-1"
CLUSTER_NAME="aiops-cluster"

echo "===================================================="
echo "🚀 Creating AWS EKS Cluster: ${CLUSTER_NAME}"
echo "===================================================="

# 1. Create Cluster via eksctl
eksctl create cluster -f eks/cluster.yml

# 2. Update local kubeconfig
echo "📋 Updating kubeconfig context..."
aws eks update-kubeconfig --name ${CLUSTER_NAME} --region ${REGION}

# 3. Apply Kubernetes Namespace & Secrets
echo "🛡️ Creating namespace and applying secrets..."
kubectl apply -f k8s/namespace.yml
kubectl apply -f k8s/secret.yml

# 4. Apply Database PVCs and Services
echo "💾 Deploying PostgreSQL databases with PVCs..."
kubectl apply -f k8s/postgres.yml
kubectl apply -f k8s/user-postgres.yml

# 5. Apply RBAC Permissions
echo "⚙️ Applying RBAC policies..."
kubectl apply -f k8s/serviceaccount.yml
kubectl apply -f k8s/clusterrole.yml
kubectl apply -f k8s/clusterrolebinding.yml

# 6. Apply Microservices
echo "🤖 Deploying AI microservices, backend, and frontend..."
kubectl apply -f k8s/embedder-service.yml
kubectl apply -f k8s/embedder-deployment.yml
kubectl apply -f k8s/service.yml
kubectl apply -f k8s/api-deployment.yml
kubectl apply -f k8s/backend-service.yml
kubectl apply -f k8s/backend-deployment.yml
kubectl apply -f k8s/frontend-service.yml
kubectl apply -f k8s/frontend-deployment.yml

# 7. Apply Ingress Controller Routing
echo "🌐 Applying Ingress routing..."
kubectl apply -f k8s/ingress.yml

echo "===================================================="
echo "✅ EKS Deployment Complete!"
echo "Check pods with: kubectl get pods -n ai-ops"
echo "Check ingress with: kubectl get ingress -n ai-ops"
echo "===================================================="
