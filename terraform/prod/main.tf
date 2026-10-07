locals {
  environment = "production"
  project     = "Travelbook"

  tags = {
    Environment = local.environment
    Project     = local.project
    ManagedBy   = "Terraform"
  }
}