output "iam_role_name" {
  description = "Nombre del IAM Role"
  value       = aws_iam_role.app_role.name
}

output "cloudwatch_log_group" {
  description = "Log group"
  value       = aws_cloudwatch_log_group.app_logs.name
}