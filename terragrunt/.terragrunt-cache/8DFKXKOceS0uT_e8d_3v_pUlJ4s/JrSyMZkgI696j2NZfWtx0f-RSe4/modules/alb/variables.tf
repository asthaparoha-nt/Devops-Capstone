variable "project_name" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "worker_security_group_id" {
  type = string
}

variable "worker_asg_name" {
  type = string
}