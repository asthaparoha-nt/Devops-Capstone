variable "project_name" {
  description = "Project name"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "subnet_id" {
  description = "Private subnet for master"
  type        = string
}

variable "security_group_id" {
  description = "K3s security group"
  type        = string
}

variable "instance_profile_name" {
  description = "Master IAM instance profile"
  type        = string
}

variable "instance_type" {
  description = "Master instance type"
  type        = string
  default     = "t3.micro"
}