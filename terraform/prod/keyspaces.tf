module "keyspaces_iam_user" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-user"
  version = "~> 6.0"

  name                  = "travelbook-backend-keyspaces-user"
  create_access_key     = false # Keyspaces uses service credentials, not standard access keys
  create_login_profile  = false # Disable AWS Console web login

  # Attach standard AWS policy for Keyspaces
  policies = {
    keyspaces_access = "arn:aws:iam::aws:policy/AmazonKeyspacesFullAccess"
  }

  tags = local.tags
}

# 2. Native AWS Provider Resource for Cassandra Service Credentials
resource "aws_iam_service_specific_credential" "keyspaces_credentials" {
  service_name = "cassandra.amazonaws.com"
  user_name    = module.keyspaces_iam_user.name
}

#1. Keyspace Resource
resource "aws_keyspaces_keyspace" "review_db" {
  name = "review_db"

  replication_specification {
    replication_strategy = "SINGLE_REGION"
  }

  tags = local.tags
}

# 2. Table: review_db.reviews_by_property
resource "aws_keyspaces_table" "reviews_by_property" {
  keyspace_name = aws_keyspaces_keyspace.review_db.name
  table_name    = "reviews_by_property"

  capacity_specification {
    throughput_mode = "PAY_PER_REQUEST"
  }

  schema_definition {
    column {
      name = "property_id"
      type = "uuid"
    }
    column {
      name = "created_at"
      type = "timestamp"
    }
    column {
      name = "review_id"
      type = "uuid"
    }
    column {
      name = "booking_id"
      type = "uuid"
    }
    column {
      name = "user_id"
      type = "uuid"
    }
    column {
      name = "user_display_name"
      type = "text"
    }
    column {
      name = "user_country_code"
      type = "ascii"
    }
    column {
      name = "rating"
      type = "smallint"
    }
    column {
      name = "staff"
      type = "smallint"
    }
    column {
      name = "cleanliness"
      type = "smallint"
    }
    column {
      name = "facilities"
      type = "smallint"
    }
    column {
      name = "comfort"
      type = "smallint"
    }
    column {
      name = "value_score"
      type = "smallint"
    }
    column {
      name = "location"
      type = "smallint"
    }
    column {
      name = "wifi"
      type = "smallint"
    }
    column {
      name = "comment"
      type = "text"
    }
    column {
      name = "updated_at"
      type = "timestamp"
    }

    partition_key {
      name = "property_id"
    }

    clustering_key {
      name     = "created_at"
      order_by = "DESC"
    }

    clustering_key {
      name     = "review_id"
      order_by = "ASC"
    }
  }

  point_in_time_recovery {
    status = "DISABLED"
  }
}

# 3. Table: review_db.reviews_by_user
resource "aws_keyspaces_table" "reviews_by_user" {
  keyspace_name = aws_keyspaces_keyspace.review_db.name
  table_name    = "reviews_by_user"

  capacity_specification {
    throughput_mode = "PAY_PER_REQUEST"
  }

  schema_definition {
    column {
      name = "user_id"
      type = "uuid"
    }
    column {
      name = "created_at"
      type = "timestamp"
    }
    column {
      name = "review_id"
      type = "uuid"
    }
    column {
      name = "user_display_name"
      type = "text"
    }
    column {
      name = "user_country_code"
      type = "ascii"
    }
    column {
      name = "property_id"
      type = "uuid"
    }
    column {
      name = "booking_id"
      type = "uuid"
    }
    column {
      name = "rating"
      type = "smallint"
    }
    column {
      name = "staff"
      type = "smallint"
    }
    column {
      name = "cleanliness"
      type = "smallint"
    }
    column {
      name = "facilities"
      type = "smallint"
    }
    column {
      name = "comfort"
      type = "smallint"
    }
    column {
      name = "value_score"
      type = "smallint"
    }
    column {
      name = "location"
      type = "smallint"
    }
    column {
      name = "wifi"
      type = "smallint"
    }
    column {
      name = "comment"
      type = "text"
    }
    column {
      name = "updated_at"
      type = "timestamp"
    }

    partition_key {
      name = "user_id"
    }

    clustering_key {
      name     = "created_at"
      order_by = "DESC"
    }

    clustering_key {
      name     = "review_id"
      order_by = "ASC"
    }
  }

  point_in_time_recovery {
    status = "DISABLED"
  }
}