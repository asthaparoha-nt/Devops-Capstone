output "instance_id" {
  description = "K3s master instance ID"
  value       = aws_instance.master.id
}

output "private_ip" {
  description = "K3s master private IP"
  value       = aws_instance.master.private_ip
}