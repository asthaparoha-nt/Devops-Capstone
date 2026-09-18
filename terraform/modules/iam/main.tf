data "aws_caller_identity" "current" {}

# MASTER IAM ROLE

resource "aws_iam_role" "master" {
  name = "${var.project_name}-k3s-master-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ec2.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-k3s-master-role"
    Role = "k3s-master"
  }
}


resource "aws_iam_role_policy_attachment" "master_ssm" {
  role       = aws_iam_role.master.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}


# Master writes K3s information to Parameter Store
resource "aws_iam_role_policy" "master_parameter_store" {
  name = "${var.project_name}-master-parameter-store"
  role = aws_iam_role.master.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "ssm:PutParameter",
          "ssm:DeleteParameter"
        ]

        Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${var.project_name}/k3s/*"
      }
    ]
  })
}
# Master pulls authentication information for private ECR
resource "aws_iam_role_policy" "master_ecr_pull" {
  name = "${var.project_name}-master-ecr-pull"
  role = aws_iam_role.master.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Sid    = "ECRAuthorization"
        Effect = "Allow"

        Action = [
          "ecr:GetAuthorizationToken"
        ]

        Resource = "*"
      },

      {
        Sid    = "ECRPull"
        Effect = "Allow"

        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:BatchGetImage",
          "ecr:GetDownloadUrlForLayer",
          "ecr:DescribeImages"
        ]

        Resource = [
          "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/assessment-portal-backend",
          "arn:aws:ecr:${var.aws_region}:${data.aws_caller_identity.current.account_id}:repository/assessment-portal-frontend"
        ]
      }
    ]
  })
}

resource "aws_iam_instance_profile" "master" {
  name = "${var.project_name}-k3s-master-profile"
  role = aws_iam_role.master.name
}


# WORKER IAM ROLE

resource "aws_iam_role" "worker" {
  name = "${var.project_name}-k3s-worker-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Principal = {
          Service = "ec2.amazonaws.com"
        }

        Action = "sts:AssumeRole"
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-k3s-worker-role"
    Role = "k3s-worker"
  }
}


resource "aws_iam_role_policy_attachment" "worker_ssm" {
  role       = aws_iam_role.worker.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}


# Worker reads master IP and token
resource "aws_iam_role_policy" "worker_parameter_store" {
  name = "${var.project_name}-worker-parameter-store"
  role = aws_iam_role.worker.id

  policy = jsonencode({
    Version = "2012-10-17"

    Statement = [
      {
        Effect = "Allow"

        Action = [
          "ssm:GetParameter"
        ]

        Resource = "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/${var.project_name}/k3s/*"
      }
    ]
  })
}


resource "aws_iam_instance_profile" "worker" {
  name = "${var.project_name}-k3s-worker-profile"
  role = aws_iam_role.worker.name
}