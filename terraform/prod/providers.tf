terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.0"
    }
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    # hcp = {
    #   source  = "hashicorp/hcp"
    #   version = "~> 0.0"
    # }
    vault = {
      source  = "hashicorp/vault"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
    ec = {
      source  = "elastic/ec"
      version = "~> 0.0"
    }
    elasticstack = {
      source  = "elastic/elasticstack"
      version = "~> 0.0"
    }
    rediscloud = {
      source  = "RedisLabs/rediscloud"
      version = "~> 2.0"
    }
  }
}

provider "google" {
  region = var.gcp_region
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = local.tags
  }
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = local.tags
  }
}

# provider "hcp" {}

provider "cloudflare" {}

provider "ec" {}

provider "elasticstack" {
  elasticsearch {
    endpoints = [ec_deployment.travelbook_search.elasticsearch.https_endpoint]
    username  = ec_deployment.travelbook_search.elasticsearch_username
    password  = ec_deployment.travelbook_search.elasticsearch_password
  }
}

provider "rediscloud" {}
