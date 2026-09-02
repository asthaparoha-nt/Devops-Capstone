variable "aws_region" {
  description = "AWS region to deploy resources in"
  type        = string
  default     = "us-east-1"
}

variable "github_org" {
  description = "GitHub organization or username that owns the repo"
  type        = string
  default     = "asthaparoha-nt"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "Devops-Capstone"
}

variable "github_branches" {
  description = "Branches allowed to assume the role via push/deploy workflows"
  type        = list(string)
  default     = ["*"]
}

variable "allow_pull_requests" {
  description = "Whether to also allow the role to be assumed from pull_request workflow runs (useful for plan-only jobs, not for apply)"
  type        = bool
  default     = true
}

variable "role_name" {
  description = "Name of the IAM role GitHub Actions will assume"
  type        = string
  default     = "github-actions-devops-capstone"
}

variable "create_oidc_provider" {
  description = "Set to false if an OIDC provider for token.actions.githubusercontent.com already exists in this AWS account (there can only be one per account)"
  type        = bool
  default     = true
}
