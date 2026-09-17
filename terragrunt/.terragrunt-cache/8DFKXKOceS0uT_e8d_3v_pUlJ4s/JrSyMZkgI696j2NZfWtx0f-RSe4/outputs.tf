output "backend_ecr_repository_name" {
  value = module.ecr.backend_ecr_repository_name
}

output "backend_ecr_repository_url" {
  value = module.ecr.backend_ecr_repository_url
}

output "frontend_ecr_repository_name" {
  value = module.ecr.frontend_ecr_repository_name
}

output "frontend_ecr_repository_url" {
  value = module.ecr.frontend_ecr_repository_url
}
output "vpc_id" {
  description = "Project VPC ID"
  value       = module.vpc.vpc_id
}

output "public_subnet_ids" {
  description = "Project public subnet IDs"
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "Project private subnet IDs"
  value       = module.vpc.private_subnet_ids
}
output "alb_dns_name" {
  value = module.alb.alb_dns_name
}

output "alb_arn" {
  value = module.alb.alb_arn
}