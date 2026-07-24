terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region                      = "us-east-1"
  access_key                  = "test"
  secret_key                  = "test"
  
  endpoints {
    iam        = "http://localhost:4566"
    cloudwatch = "http://localhost:4566"
    logs       = "http://localhost:4566"
  }

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}

resource "aws_iam_role" "app_role" {
  name = "devsecops-lab-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_cloudwatch_log_group" "app_logs" {
  name              = "/devsecops-lab/app"
  retention_in_days = 7

  tags = {
    Environment = "local"
  }
}