resource "tls_private_key" "kafzium_ec2_key" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Register the public key with AWS
resource "aws_key_pair" "kafzium_generated_key" {
  key_name   = "kafzium-ec2-key"
  public_key = tls_private_key.kafzium_ec2_key.public_key_openssh
}

# Save the private key locally as a .pem file
resource "local_file" "private_key_pem" {
  content         = tls_private_key.kafzium_ec2_key.private_key_pem
  filename        = "${path.module}/kafzium-ec2-key.pem"
  file_permission = "0400"
}

data "aws_ami" "debian13_arm64" {
  most_recent = true

  filter {
    name   = "name"
    values = ["debian-13-arm64-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["136693071363"]
}

module "ec2_security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 6.0"

  name        = "travelbook-kafzium-sg"
  description = "Security group for Debian 13 t4g.medium Kafzium host"
  vpc_id      = module.aws_vpc.vpc_id

  ingress_rules = {
    ssh = {
      description = "SSH access"
      from_port   = 22
      to_port     = 22
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
    }
    kafka = {
      description = "Kafka Broker"
      from_port   = 9092
      to_port     = 9092
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
    }
    kafbat = {
      description = "Kafbat Kafka UI"
      from_port   = 8080
      to_port     = 8080
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
    }
    debezium = {
      description = "Debezium Connect REST API"
      from_port   = 8083
      to_port     = 8083
      ip_protocol = "tcp"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }

  egress_rules = {
    all_outbound = {
      description = "Allow all outbound traffic"
      ip_protocol = "-1"
      cidr_ipv4   = "0.0.0.0/0"
    }
  }
}

module "kafzium_host" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "~> 6.0"

  name = "travelbook-kafzium"

  instance_type               = "t4g.medium"
  key_name = aws_key_pair.kafzium_generated_key.key_name
  ami                         = data.aws_ami.debian13_arm64.id
  # ami                         = "ami-0fde18f77ff54ebd9"
  associate_public_ip_address = true

  subnet_id              = module.aws_vpc.public_subnets[0]
  vpc_security_group_ids = [module.ec2_security_group.id]

  # Root disk (Increase from default 8 GiB to 30 GiB gp3 for Docker images/swap)
  root_block_device = {
    encrypted = true
    type      = "gp3"
    size      = 30
  }

  # User Data Setup: Configure 4 GB Swap & Install Docker
  user_data = <<-EOF
              #!/bin/bash
              set -ex

              # 1. Create 4 GB Swap File (Mandatory safety buffer for 4 GB RAM)
              fallocate -l 4G /swapfile
              chmod 600 /swapfile
              mkswap /swapfile
              swapon /swapfile
              echo '/swapfile swap swap defaults 0 0' >> /etc/fstab

              # 2. Install Docker & Docker Compose on Debian 13
              apt-get update
              apt-get install -y ca-certificates curl gnupg
              
              install -m 0755 -d /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              chmod a+r /etc/apt/keyrings/docker.gpg

              echo \
                "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
                $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
                tee /etc/apt/sources.list.d/docker.list > /dev/null

              apt-get update
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

              # 3. Enable Docker and grant permissions to 'admin'
              systemctl enable --now docker
              usermod -aG docker admin
              chmod 666 /var/run/docker.sock
              EOF

  tags = local.tags
}

resource "cloudflare_dns_record" "travelbook_kafzium" {
  zone_id = var.cloudflare_zone_id
  name    = "kafzium"
  content = module.kafzium_host.public_ip
  type    = "A"
  proxied = false
  ttl     = 1
}
