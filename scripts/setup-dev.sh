#!/usr/bin/env bash
set -euo pipefail

# Infrastructure & Component Versions
CLUSTER_NAME="travelbook-cluster"
GATEWAY_API_VERSION="v1.5.1"
ISTIO_VERSION="1.29.2"
PROMETHEUS_CHART_VERSION="29.2.1"
KIALI_CHART_VERSION="2.25.0"

echo "🚀 Step 1: Provisioning k3d Cluster..."
if k3d cluster list | grep -q "${CLUSTER_NAME}"; then
    echo "Cluster ${CLUSTER_NAME} already exists. Skipping creation."
else
    k3d cluster create --config ./k3d-config.yaml
fi

echo "📦 Step 2: Installing Kubernetes Gateway API CRDs..."
kubectl apply -f "https://github.com/kubernetes-sigs/gateway-api/releases/download/${GATEWAY_API_VERSION}/standard-install.yaml"

echo "🕸️ Step 3: Installing Istio Ambient Mesh..."
helm repo add istio https://istio-release.storage.googleapis.com/charts
helm repo update

# Install base CRDs
helm upgrade --install istio-base istio/base \
  --version "${ISTIO_VERSION}" \
  -n istio-system --create-namespace --wait

# Install Istiod with ambient profile
helm upgrade --install istiod istio/istiod \
  --version "${ISTIO_VERSION}" \
  --set profile=ambient \
  -n istio-system --wait

# Install CNI for Ambient node interception
helm upgrade --install istio-cni istio/cni \
  --version "${ISTIO_VERSION}" \
  --namespace istio-system \
  --set profile=ambient \
  --set cni.cniBinDir=/var/lib/rancher/k3s/data/cni \
  --set cni.cniConfDir=/var/lib/rancher/k3s/agent/etc/cni/net.d \
  --wait

# Install Ztunnel (node daemon for ambient mTLS)
helm upgrade --install ztunnel istio/ztunnel \
  --version "${ISTIO_VERSION}" \
  -n istio-system --wait

kubectl label namespace istio-system gateway-access=true --overwrite

echo "📊 Step 4: Installing Kiali & Prometheus Observability..."
helm repo add kiali https://kiali.org/helm-charts
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

helm upgrade --install prometheus prometheus-community/prometheus \
  --version "${PROMETHEUS_CHART_VERSION}" \
  --set server.persistentVolume.enabled=false \
  -n istio-system --wait

helm upgrade --install kiali-server kiali/kiali-server \
  --version "${KIALI_CHART_VERSION}" \
  --set auth.strategy="token" \
  --set cr.create=true \
  --set cr.namespace=istio-system \
  --set external_services.prometheus.url="http://prometheus-server.istio-system.svc.cluster.local:80" \
  --set server.web_fqdn="kiali.travelbook.localhost" \
  --set server.web_port=443 \
  --set server.web_schema="https" \
  --set server.web_root="/" \
  -n istio-system --wait

kubectl create serviceaccount kiali-viewer -n istio-system

kubectl create clusterrolebinding kiali-viewer-binding \
  --clusterrole=kiali-viewer \
  --serviceaccount=istio-system:kiali-viewer

kubectl create namespace travelbook

kubectl label namespace travelbook \
  istio.io/dataplane-mode=ambient \
  gateway-access="true" \
  --overwrite

helm upgrade --install travelbook-app deploy/helm/travelbook-app -f deploy/helm/travelbook-app/values.yaml -f deploy/helm/travelbook-app/values-dev.yaml

echo "✅ Environment deployment complete!"