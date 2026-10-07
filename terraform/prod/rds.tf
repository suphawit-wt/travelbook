module "rds_security_group" {
  source  = "terraform-aws-modules/security-group/aws"
  version = "~> 6.0"

  name        = "travelbook-rds-sg"
  description = "Security group for Travelbook PostgreSQL RDS"
  vpc_id      = module.aws_vpc.vpc_id

  ingress_rules = {
    postgresql = {
      description = "PostgreSQL access"
      from_port   = 5432
      to_port     = 5432
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

module "aws_rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.0"

  identifier = "travelbook-postgres-db"

  engine                = "postgres"
  engine_version        = "18.6"
  family                = "postgres18"
  instance_class        = "db.t3.micro"
  allocated_storage     = 20
  max_allocated_storage = 20
  storage_type           = "gp2"

  db_name  = "tb_auth_db"
  username = var.db_username
  password = var.db_password
  port     = 5432
  manage_master_user_password = false

  db_subnet_group_name   = module.aws_vpc.database_subnet_group_name
  vpc_security_group_ids = [module.rds_security_group.id]

  multi_az            = false
  publicly_accessible = true
  skip_final_snapshot = true

  parameters = [
    {
      name         = "rds.logical_replication"
      value        = "1"
      apply_method = "pending-reboot"
    },
    {
      name  = "wal_sender_timeout"
      value = "60000" # 60,000 ms
    },
    {
      name  = "idle_in_transaction_session_timeout"
      value = "60000" # 60,000 ms
    },
    {
      name  = "max_replication_slots"
      value = "5"
      apply_method = "pending-reboot"
    },
    {
      name  = "max_wal_senders"
      value = "5"
      apply_method = "pending-reboot"
    },
    {
      name  = "max_slot_wal_keep_size"
      value = "2048" # 2GB in MB
      apply_method = "pending-reboot"
    },
    {
      name  = "logical_decoding_work_mem"
      value = "32768" # KB (32 MB)
      apply_method = "pending-reboot"
    },
    {
      name  = "max_worker_processes"
      value = "4"
      apply_method = "pending-reboot"
    },
    {
      name         = "shared_preload_libraries"
      value        = "pg_stat_statements,pg_cron"
      apply_method = "pending-reboot"
    },
    {
      name  = "cron.database_name"
      value = "tb_auth_db"
      apply_method = "pending-reboot"
    }
  ]
}