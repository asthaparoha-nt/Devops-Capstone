# AWS OIDC + GitHub Actions for asthaparoha-nt/Devops-Capstone

## What this does
- Registers GitHub's OIDC provider (`token.actions.githubusercontent.com`) in your AWS account.
- Creates an IAM role that only your repo (`asthaparoha-nt/Devops-Capstone`), on the `main`
  branch (and optionally pull requests), can assume — no static AWS keys in GitHub secrets.
- Attaches a starter permissions policy (ECR, S3, DynamoDB lock table, EKS describe) you should
  tighten to your actual pipeline needs.

## 1. Apply the Terraform
```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"

terraform init
terraform plan
terraform apply
```
Use your existing access key/secret only for this one-time bootstrap — never commit them and
never put them in `.tf` files. After this apply, GitHub Actions will use OIDC instead.

> If your AWS account **already has** an OIDC provider for
> `token.actions.githubusercontent.com` (only one is allowed per account), set
> `create_oidc_provider = false` in a `terraform.tfvars` and uncomment the
> `data "aws_iam_openid_connect_provider"` block in `oidc-provider.tf`.

## 2. Grab the output
```bash
terraform output github_actions_role_arn
```

## 3. Add the workflow
Copy `.github-workflow-example/deploy.yml` into `.github/workflows/deploy.yml` in your repo,
and replace `<YOUR_ACCOUNT_ID>` with the role ARN's account ID from step 2.

## 4. Push and verify
Push to `main` (or open a PR) and confirm the `aws sts get-caller-identity` step in the
workflow logs shows the assumed role — no AWS secrets needed in the repo at all.

## Tightening security further
- Restrict `github_branches` to only branches that should deploy.
- Set `allow_pull_requests = false` if PR workflows shouldn't have AWS access at all (or give
  PR runs a separate, more restricted role for `plan`-only steps).
- Replace the `resources = ["*"]` entries in `iam-role.tf` with specific ARNs (your S3 bucket,
  DynamoDB table, ECR repo) once you know them.
