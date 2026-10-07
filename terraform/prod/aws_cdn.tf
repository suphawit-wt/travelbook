module "acm" {
  source  = "terraform-aws-modules/acm/aws"
  version = "~> 6.0"

  providers = {
    aws = aws.us_east_1
  }

  domain_name         = var.cdn_domain_name
  validation_method   = "DNS"
  wait_for_validation = false

  create_route53_records = false
}

module "aws_cdn" {
  source  = "terraform-aws-modules/cloudfront/aws"
  version = "~> 6.0"


  comment             = "CloudFront distribution for Travelbook media"
  enabled             = true
  is_ipv6_enabled     = true
  price_class         = "PriceClass_200"
  retain_on_delete    = false
  wait_for_deployment = false

  aliases = [var.cdn_domain_name]

  origin_access_control = {
    s3_oac = {
      description      = "CloudFront access to S3"
      origin_type      = "s3"
      signing_behavior = "always"
      signing_protocol = "sigv4"
    }
  }

  origin = {
    s3_media_origin = {
      domain_name           = module.aws_s3.s3_bucket_bucket_regional_domain_name
      origin_access_control_key = "s3_oac"
    }
  }

  default_cache_behavior = {
    target_origin_id       = "s3_media_origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    
    cache_policy_name      = "Managed-CachingOptimized"
  }

  viewer_certificate = {
    acm_certificate_arn      = module.acm.acm_certificate_arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
}
