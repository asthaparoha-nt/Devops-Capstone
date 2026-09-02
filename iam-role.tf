locals {
  # Builds the list of allowed "sub" claims for the trust policy.
  branch_subs = [
    for b in var.github_branches :
    "repo:${var.github_org}/${var.github_repo}:ref:refs/heads/${b}"
  ]

  pr_subs = var.allow_pull_requests ? [
    "repo:${var.github_org}/${var.github_repo}:pull_request"
  ] : []

 allowed_subs = ["repo:${var.github_org}@*/${var.github_repo}@*:*"]
}

data "aws_iam_policy_document" "github_actions_trust" {
  statement {
    sid     = "GitHubActionsOIDCTrust"
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = local.allowed_subs
    }
  }
}

resource "aws_iam_role" "github_actions" {
  name                 = var.role_name
  assume_role_policy   = data.aws_iam_policy_document.github_actions_trust.json
  max_session_duration = 3600

  tags = {
    ManagedBy = "terraform"
    Purpose   = "github-actions-ci-cd"
    Repo      = "${var.github_org}/${var.github_repo}"
  }
}

# --- Permissions the role gets once assumed ---
# Start narrow and add what your pipeline actually needs.
# Below is a reasonable starting point for a typical DevOps capstone
# (build/push images, deploy to ECS/EKS, manage S3/Terraform state).
# Replace/extend with least-privilege statements for your real workload.

data "aws_iam_policy_document" "github_actions_permissions" {
  statement {
    sid    = "ECRPushPull"
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:CreateRepository",
      "ecr:DescribeRepositories",
    ]
    resources = ["*"]
  }

  statement {
    sid    = "S3StateAndArtifacts"
    effect = "Allow"
    actions = [
      "s3:GetObject",
      "s3:PutObject",
      "s3:ListBucket",
    ]
    resources = ["*"] # scope to specific bucket ARNs in production
  }

  statement {
    sid    = "TerraformDynamoDBLock"
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:DeleteItem",
    ]
    resources = ["*"] # scope to your lock table ARN in production
  }

  statement {
    sid    = "EKSDeploy"
    effect = "Allow"
    actions = [
      "eks:DescribeCluster",
      "eks:ListClusters",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "github_actions_permissions" {
  name   = "${var.role_name}-permissions"
  policy = data.aws_iam_policy_document.github_actions_permissions.json
}

resource "aws_iam_role_policy_attachment" "github_actions_permissions" {
  role       = aws_iam_role.github_actions.name
  policy_arn = aws_iam_policy.github_actions_permissions.arn
}
