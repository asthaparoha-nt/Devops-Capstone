# AWS accounts can only have ONE OIDC provider per unique URL.
# If you already have one for token.actions.githubusercontent.com
# (e.g. from another Terraform stack), set create_oidc_provider = false
# and use a data source instead (see commented block below).

resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 1 : 0

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]

  # GitHub's OIDC token signing certificate thumbprints.
  # AWS now verifies the full cert chain itself, but this field is
  # still required by the resource; these are GitHub's current values.
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd",
  ]

  tags = {
    ManagedBy = "terraform"
    Purpose   = "github-actions-oidc"
  }
}

# If create_oidc_provider = false, uncomment this instead and remove
# references to aws_iam_openid_connect_provider.github[0] below:
#
# data "aws_iam_openid_connect_provider" "github" {
#   url = "https://token.actions.githubusercontent.com"
# }

data "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 0 : 1
  url   = "https://token.actions.githubusercontent.com"
}
locals {
  oidc_provider_arn = var.create_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : data.aws_iam_openid_connect_provider.github[0].arn
}