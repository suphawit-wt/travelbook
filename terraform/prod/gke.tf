module "project_services" {
  source  = "terraform-google-modules/project-factory/google//modules/project_services"
  version = "~> 18.0"

  project_id = var.gcp_project_id
  disable_services_on_destroy = false
  disable_dependent_services  = false

  activate_apis = [
    "compute.googleapis.com",
    "container.googleapis.com",
    "iam.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com"
  ]
}

module "vpc" {
  source  = "terraform-google-modules/network/google"
  version = "~> 18.0"

  project_id   = var.gcp_project_id
  network_name = "travelbook-prod-vpc"
  routing_mode = "GLOBAL"

  subnets = [
    {
      subnet_name           = "sb-travelbook-gke-asia-se1"
      subnet_ip             = "10.10.0.0/20"
      subnet_region         = var.gcp_region
      subnet_private_access = "true"
      description           = "Private subnet for Travelbook GKE Cluster"
    }
  ]

  secondary_ranges = {
    sb-travelbook-gke-asia-se1 = [
      {
        range_name    = "gke-pods-asia-se1"
        ip_cidr_range = "10.20.0.0/16"
      },
      {
        range_name    = "gke-services-asia-se1"
        ip_cidr_range = "10.30.0.0/20"
      }
    ]
  }
}

resource "google_service_account" "travelbook_api_sa" {
  account_id   = "travelbook-api-sa"
  display_name = "Travelbook API Workload Identity SA"
  project      = var.gcp_project_id
}

module "gke_service_account" {
  source  = "terraform-google-modules/service-accounts/google"
  version = "~> 4.0"

  project_id = var.gcp_project_id
  prefix     = "tb"
  names      = ["gke-node-sa"]
  project_roles = [
    "${var.gcp_project_id}=>roles/logging.logWriter",
    "${var.gcp_project_id}=>roles/monitoring.metricWriter",
    "${var.gcp_project_id}=>roles/monitoring.viewer",
    "${var.gcp_project_id}=>roles/stackdriver.resourceMetadata.writer",
    "${var.gcp_project_id}=>roles/artifactregistry.reader"
  ]
}

module "workload_identity_iam" {
  source  = "terraform-google-modules/iam/google//modules/service_accounts_iam"
  version = "~> 8.0"

  service_accounts = [google_service_account.travelbook_api_sa.email]
  project          = var.gcp_project_id
  mode             = "additive"

  bindings = {
    "roles/iam.workloadIdentityUser" = [
      "serviceAccount:${var.gcp_project_id}.svc.id.goog[travelbook/travelbook-api-sa]"
    ]
  }

  depends_on = [
    module.gke
  ]
}

module "gke" {
  source  = "terraform-google-modules/kubernetes-engine/google"
  version = "~> 44.0"

  project_id = var.gcp_project_id
  name       = "travelbook-microservices"
  region     = var.gcp_region
  identity_namespace = "${var.gcp_project_id}.svc.id.goog"
  deletion_protection = false

  remove_default_node_pool = true

  zones                  = [var.gcp_zone]
  regional               = false
  create_service_account = false
  service_account        = module.gke_service_account.email

  network           = module.vpc.network_name
  subnetwork        = module.vpc.subnets_names[0]
  ip_range_pods     = "gke-pods-asia-se1"
  ip_range_services = "gke-services-asia-se1"

  enable_binary_authorization = false
  http_load_balancing         = true
  network_policy              = true

  node_pools = [
    {
      name               = "travelbook-microservices-pool"
      machine_type       = "e2-standard-4"
      node_locations     = var.gcp_zone
      autoscaling       = false
      min_count          = 0
      max_count          = 1
      spot               = true
      disk_size_gb       = 40
      disk_type          = "pd-standard"
      image_type         = "COS_CONTAINERD"
      auto_repair        = true
      auto_upgrade       = true
      initial_node_count = 1
      node_metadata      = "GKE_METADATA"
    }
  ]

  node_pools_labels = {
    all = local.tags
  }
}

resource "google_compute_address" "istio_ingress_ip" {
  name   = "travelbook-microservices-ingress-ip"
  project = var.gcp_project_id
  region = var.gcp_region
}

resource "cloudflare_dns_record" "travelbook_frontend" {
  zone_id = var.cloudflare_zone_id
  name    = "travelbook"
  content = google_compute_address.istio_ingress_ip.address
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_dns_record" "travelbook_api" {
  zone_id = var.cloudflare_zone_id
  name    = "api"
  content = google_compute_address.istio_ingress_ip.address
  type    = "A"
  proxied = true
  ttl     = 1
}

resource "cloudflare_dns_record" "travelbook_kiali" {
  zone_id = var.cloudflare_zone_id
  name    = "kiali"
  content = google_compute_address.istio_ingress_ip.address
  type    = "A"
  proxied = true
  ttl     = 1
}
