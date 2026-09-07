locals{
  aws_region= "us-east-1"
  state_bucket= "assessment-portal-state"
  state_key="assessment-portal/terraform.tfstate"
}
remote_state {
  backend = "s3"

  config = {
    bucket =  local.state_bucket
    key    =  local.state_key
    region =  local.aws_region

    encrypt      = true
    use_lockfile = true
  }
}

terraform {
  source = "./terraform"
}
