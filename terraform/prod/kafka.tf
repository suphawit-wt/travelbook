resource "confluent_environment" "travelbook_env_prod" {
  display_name = "travelbook-prod"
}

resource "confluent_kafka_cluster" "travelbook_kafka" {
  display_name = "travelbook-kafka"
  availability = "SINGLE_ZONE"
  cloud        = "GCP"
  region       = var.gcp_region

  standard {}

  environment {
    id = confluent_environment.travelbook_env_prod.id
  }
}