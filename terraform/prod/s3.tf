module "aws_s3" {
  source  = "terraform-aws-modules/s3-bucket/aws"
  version = "~> 5.0"

  bucket_prefix = "travelbook-media-"

  control_object_ownership = true
  object_ownership         = "BucketOwnerEnforced"

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true

  attach_policy                         = true
  policy                                = data.aws_iam_policy_document.cloudfront_oac_policy.json
  attach_deny_insecure_transport_policy = true

  cors_rule = [
    {
      allowed_headers = ["*"]
      allowed_methods = ["GET", "PUT", "POST", "DELETE"]
      allowed_origins = ["https://travelbook.suphawit.dev", "https://travelbook.localhost"]
      max_age_seconds = 3000
    }
  ]
}

module "s3_app_iam_policy" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-policy"
  version = "~> 6.0"

  name        = "travelbook-s3-backend-policy"
  path        = "/"
  description = "Allows Golang backend API to manage S3 media files"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3MediaBucketAccess"
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:DeleteObject"
        ]
        Resource = [
          module.aws_s3.s3_bucket_arn,
          "${module.aws_s3.s3_bucket_arn}/*"
        ]
      },
      {
        Sid    = "S3BucketListAccess"
        Effect = "Allow"
        Action = ["s3:ListBucket"]
        Resource = module.aws_s3.s3_bucket_arn
      }
    ]
  })
}

module "s3_app_iam_user" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-user"
  version = "~> 6.0"

  name                          = "travelbook-backend-s3-user"
  create_access_key         = true
  create_login_profile = false

  policies = {
    s3_access = module.s3_app_iam_policy.arn
  }
}


data "aws_iam_policy_document" "cloudfront_oac_policy" {
  statement {
    sid    = "AllowCloudFrontServicePrincipalReadOnly"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions   = ["s3:GetObject"]
    resources = ["${module.aws_s3.s3_bucket_arn}/*"]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [module.aws_cdn.cloudfront_distribution_arn]
    }
  }
}