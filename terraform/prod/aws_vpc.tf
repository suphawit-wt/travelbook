module "aws_vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 6.0"

  name = "travelbook-aws-vpc"
  cidr = "10.0.0.0/16"

  azs              = ["${var.aws_region}a", "${var.aws_region}b"]
  public_subnets   = ["10.0.1.0/24", "10.0.2.0/24"]
  database_subnets = ["10.0.20.0/24", "10.0.21.0/24"]

  enable_nat_gateway           = false
  create_database_internet_gateway_route = true
  create_database_subnet_route_table = true
  create_database_subnet_group = true
  enable_dns_hostnames         = true
  enable_dns_support           = true
}
