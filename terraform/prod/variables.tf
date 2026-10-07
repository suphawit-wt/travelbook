variable "gcp_project_id" {
  type        = string
  description = "GCP Project ID"
}

variable "gcp_billing_account" {
  type        = string
  description = "GCP Billing Account ID"
}

variable "gcp_region" {
  type        = string
  default     = "asia-southeast1" # Singapore
  description = "GCP Region"
}

variable "gcp_zone" {
  type        = string
  default     = "asia-southeast1-a" # Single Zone
  description = "GCP Zone"
}

variable "aws_region" {
  type        = string
  default     = "ap-southeast-1" # Singapore
  description = "AWS Primary Region"
}

variable "cloudflare_account_id" {
  type        = string
  description = "Cloudflare account ID for suphawit.dev"
}

variable "cloudflare_zone_id" {
  type        = string
  description = "Cloudflare Zone ID for suphawit.dev"
}

variable "cdn_domain_name" {
  type        = string
  default     = "cdn.travelbook.suphawit.dev"
  description = "Custom CDN Domain Name"
}

variable "db_username" {
  type        = string
  default     = "travelbook_admin"
  description = "RDS Database Master Username"
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "RDS Database Master Password"
}

variable "redis_password" {
  type        = string
  sensitive   = true
  description = "Redis Password"
}