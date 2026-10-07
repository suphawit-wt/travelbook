resource "cloudflare_dns_record" "acm_validation" {
  for_each = {
    for dvo in module.acm.acm_certificate_domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  zone_id = var.cloudflare_zone_id
  name    = each.value.name
  content = each.value.record
  type    = each.value.type
  proxied = false
  ttl     = 60
}

resource "cloudflare_dns_record" "cdn_cname" {
  zone_id = var.cloudflare_zone_id
  name    = "cdn"
  content = module.aws_cdn.cloudfront_distribution_domain_name
  type    = "CNAME"
  proxied = false # Set to true if you want Cloudflare proxy/WAF active
  ttl     = 1     # 1 means 'automatic' in Cloudflare
}