output "k3s_security_group_id" {
  description = "K3s security group ID"
  value       = aws_security_group.k3s.id
}