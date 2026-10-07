resource "ec_deployment" "travelbook_search" {
  name                   = "travelbook-elasticsearch"
  region                 = "gcp-asia-southeast1"
  version                = "9.5.3"
  deployment_template_id = "gcp-storage-optimized"

  elasticsearch = {
    autoscale = true

    cold = {
      autoscaling = {}
    }

    frozen = {
      autoscaling = {}
    }

    hot = {
      size = "2g"

      autoscaling = {
        max_size          = "4g"
        max_size_resource = "memory"
      }
    }

    ml = {
      autoscaling = {}
    }

    warm = {
      autoscaling = {}
    }
  }

  lifecycle {
    ignore_changes = [
      elasticsearch.hot.size
    ]
  }

  kibana = {
    size = "2g"
    zone_count = 1
  }
}

resource "elasticstack_elasticsearch_security_api_key" "app_key" {
  name = "travelbook_app_api_key"
  
  role_descriptors = jsonencode({
    travelbook_writer = {
      cluster = ["monitor", "manage_ilm"]
      indices = [{
        names      = ["search_properties"]
        privileges = ["read", "write", "create_index", "view_index_metadata"]
      }]
    }
  })
}