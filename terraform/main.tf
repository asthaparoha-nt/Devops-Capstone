module "ecr" {
  source = "./modules/ecr"

  project_name = var.project_name
  environment  = var.environment
}
module "vpc" {
  source = "./modules/vpc"

  project_name         = var.project_name
  vpc_cidr             = var.vpc_cidr
  availability_zones   = var.availability_zones
  public_subnet_cidrs  = var.public_subnet_cidrs
  private_subnet_cidrs = var.private_subnet_cidrs
}
# IAM

module "iam" {
  source = "./modules/iam"

  project_name = var.project_name
  aws_region   = var.aws_region
}

# K3s SECURITY GROUP

module "k3s_security_group" {
  source = "./modules/security-group"

  project_name = var.project_name
  vpc_id       = module.vpc.vpc_id
  vpc_cidr     = var.vpc_cidr
}
# K3s MASTER

module "master_node" {
  source = "./modules/master-node"

  project_name = var.project_name
  aws_region   = var.aws_region

  subnet_id = module.vpc.private_subnet_ids[0]

  security_group_id = module.k3s_security_group.k3s_security_group_id

  instance_profile_name = module.iam.master_instance_profile_name

  instance_type = "t3.small"
}
# K3s WORKERS

module "worker_node" {
  source = "./modules/worker-node"

  project_name = var.project_name
  aws_region   = var.aws_region

  subnet_ids = module.vpc.private_subnet_ids

  security_group_id = module.k3s_security_group.k3s_security_group_id

  instance_profile_name = module.iam.worker_instance_profile_name

  instance_type = "t3.small"

  min_size = 1
  max_size = 3

  depends_on = [module.master_node]
}
module "alb" {
  source = "./modules/alb"

  project_name = var.project_name

  vpc_id = module.vpc.vpc_id

  public_subnet_ids = module.vpc.public_subnet_ids

  worker_security_group_id = module.k3s_security_group.k3s_security_group_id

  worker_asg_name = module.worker_node.autoscaling_group_name
}