variable "project_name" {
  description = "Project name"
  type        = string
}

variable "aws_region" {
  description = "AWS region"
  type        = string
}

variable "subnet_ids" {
  description = "Private subnets for worker nodes"
  type        = list(string)
}

variable "security_group_id" {
  description = "K3s security group"
  type        = string
}

variable "instance_profile_name" {
  description = "Worker IAM instance profile"
  type        = string
}

variable "instance_type" {
  description = "Worker instance type"
  type        = string
  default     = "t3.micro"
}

variable "min_size" {
  description = "Minimum number of workers"
  type        = number
  default     = 1
}

variable "max_size" {
  description = "Maximum number of workers"
  type        = number
  default     = 3
}