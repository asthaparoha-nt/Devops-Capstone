output "launch_template_id" {
  description = "Worker launch template ID"
  value       = aws_launch_template.worker.id
}

output "autoscaling_group_name" {
  description = "Worker Auto Scaling Group"
  value       = aws_autoscaling_group.worker.name
}
output "autoscaling_group_id" {
  value = aws_autoscaling_group.worker.id
}