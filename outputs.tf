output "oidc_provider_arn" {
  description = "ARN of the GitHub OIDC provider registered in this AWS account"
  value       = local.oidc_provider_arn
}

output "github_actions_role_arn" {
  description = "ARN to paste into your GitHub Actions workflow's role-to-assume field"
  value       = aws_iam_role.github_actions.arn
}
