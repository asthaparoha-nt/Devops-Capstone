output "master_instance_profile_name" {
  value = aws_iam_instance_profile.master.name
}

output "worker_instance_profile_name" {
  value = aws_iam_instance_profile.worker.name
}

output "master_role_name" {
  value = aws_iam_role.master.name
}

output "worker_role_name" {
  value = aws_iam_role.worker.name
}