terraform {
  required_version = ">= 1.3"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Optional but recommended: remote state so the role/provider
  # aren't only tracked in a local tfstate file.
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "github-oidc/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region

  # IMPORTANT: Do NOT hardcode access_key/secret_key here.
  # Export them as environment variables in your shell instead, e.g.:
  #   export AWS_ACCESS_KEY_ID="your-access-key"
  #   export AWS_SECRET_ACCESS_KEY="your-secret-key"
  #   export AWS_DEFAULT_REGION="us-east-1"
  # The provider will pick these up automatically.
  # This keeps secrets out of your .tf files and git history.
  access_key = "AKIA6KKAYJAF5FF5B5JE"
  secret_key="tS4VtsrXGlakCd4qV+Eo0hmHXfjgQ1zEEbD6x84Q"

}
