data "rediscloud_essentials_plan" "free_plan" {
  size                   = 30
  size_measurement_unit = "MB"
  cloud_provider         = "GCP"
  region                 = "asia-southeast1"
}

# 3. Create the Free Subscription (No payment_method_id required)
resource "rediscloud_essentials_subscription" "travelbook_sub" {
  name    = "travelbook"
  plan_id = data.rediscloud_essentials_plan.free_plan.id
}

# 5. Provision the Database with Redis 8.6
resource "rediscloud_essentials_database" "travelbook_db" {
  subscription_id  = rediscloud_essentials_subscription.travelbook_sub.id
  name             = "travelbook"
  protocol         = "stack"
  redis_version    = "8.6"
  password         = var.redis_password
  data_persistence = "none" # Free tier constraint
  replication      = false  # Free tier constraint
}
