resource "hcp_hvn" "main" {
  hvn_id         = "travelbook-net"
  cloud_provider = "aws"
  region         = var.aws_region
  cidr_block     = "172.25.16.0/20"
}

resource "hcp_vault_cluster" "travelbook_vault" {
  cluster_id      = "travelbook-vault"
  hvn_id          = hcp_hvn.main.hvn_id
  tier            = "dev"
  public_endpoint = true 
}

resource "hcp_vault_cluster_admin_token" "travelbook_vault_token" {
  cluster_id = hcp_vault_cluster.travelbook_vault.cluster_id
}

provider "vault" {
  address = hcp_vault_cluster.travelbook_vault.vault_public_endpoint_url
  token   = hcp_vault_cluster_admin_token.travelbook_vault_token.token
  namespace = "admin"
}

resource "vault_auth_backend" "kubernetes" {
  type = "kubernetes"
}

resource "vault_kubernetes_auth_backend_config" "gke" {
  backend            = vault_auth_backend.kubernetes.path
  kubernetes_host    = "https://${module.gke.endpoint}"
  kubernetes_ca_cert = base64decode(module.gke.ca_certificate)

  issuer                 = "https://container.googleapis.com/v1/projects/${var.gcp_project_id}/locations/${var.gcp_zone}/clusters/${module.gke.name}"
  disable_iss_validation = true
}

resource "vault_policy" "backend_policy" {
  name = "backend-policy"

  policy = <<EOT
path "jwt/data/*" {
  capabilities = ["read"]
}
EOT
}

resource "vault_kubernetes_auth_backend_role" "backend_role" {
  backend                          = vault_auth_backend.kubernetes.path
  role_name                        = "travelbook-backend-role"
  bound_service_account_names      = ["travelbook-api-sa"]
  bound_service_account_namespaces = ["travelbook"]
  token_policies                   = [vault_policy.backend_policy.name]
  token_ttl                        = 3600
}