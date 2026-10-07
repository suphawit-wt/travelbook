output "vpc_id" {
  description = "ID of the created VPC"
  value       = module.aws_vpc.vpc_id
}

output "s3_access_key_id" {
  description = "AWS Access Key ID for the Golang backend"
  value       = module.s3_app_iam_user.access_key_id
}

output "s3_secret_access_key" {
  description = "AWS Secret Access Key for the Golang backend"
  value       = module.s3_app_iam_user.access_key_secret
  sensitive   = true
}

output "s3_bucket_name" {
  description = "Generated S3 Bucket Name"
  value       = module.aws_s3.s3_bucket_id
}

output "s3_bucket_region" {
  description = "AWS Region where the bucket resides"
  value       = module.aws_s3.s3_bucket_region
}

output "s3_endpoint" {
  description = "S3 Endpoint URL"
  value       = "https://s3.${module.aws_s3.s3_bucket_region}.amazonaws.com"
}

output "rds_endpoint" {
  description = "PostgreSQL database connection endpoint"
  value       = module.aws_rds.db_instance_endpoint
}

output "keyspaces_endpoint" {
  description = "Amazon Keyspaces Cassandra Endpoint"
  value       = "cassandra.${var.aws_region}.amazonaws.com"
}

output "keyspaces_username" {
  description = "Generated Cassandra Service Username"
  value       = aws_iam_service_specific_credential.keyspaces_credentials.service_user_name
}

output "keyspaces_password" {
  description = "Generated Cassandra Service Password"
  value       = aws_iam_service_specific_credential.keyspaces_credentials.service_password
  sensitive   = true
}

output "redis_endpoint" {
  description = "Public Endpoint URL for Redis connection"
  value       = rediscloud_essentials_database.travelbook_db.public_endpoint
}

output "elasticsearch_endpoint" {
  description = "Elasticsearch HTTPS endpoint URL"
  value       = ec_deployment.travelbook_search.elasticsearch.https_endpoint
}

output "elasticsearch_api_key" {
  description = "Encoded API Key for Go client (cfg.APIKey)"
  value       = elasticstack_elasticsearch_security_api_key.app_key.encoded
  sensitive   = true
}

output "vault_public_endpoint_url" {
  value       = hcp_vault_cluster.travelbook_vault.vault_public_endpoint_url
  description = "The public URL to access the Vault UI and API"
}

output "vault_admin_token" {
  value       = hcp_vault_cluster_admin_token.travelbook_vault_token.token
  sensitive   = true
  description = "Initial admin token to authenticate with Vault"
}

output "ingress_static_ip" {
  value = google_compute_address.istio_ingress_ip.address
}