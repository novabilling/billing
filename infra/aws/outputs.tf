output "alb_dns_name" {
  description = "ALB DNS name — point your domain's CNAME here"
  value       = aws_lb.main.dns_name
}

output "ecr_api_url" {
  value = aws_ecr_repository.api.repository_url
}

output "ecr_dashboard_url" {
  value = aws_ecr_repository.dashboard.repository_url
}

output "ecr_landing_url" {
  value = aws_ecr_repository.landing.repository_url
}

output "ecr_docs_url" {
  value = aws_ecr_repository.docs.repository_url
}

output "central_db_endpoint" {
  value = aws_db_instance.central.endpoint
}

output "tenant_db_endpoint" {
  value = aws_db_instance.tenant.endpoint
}

output "redis_endpoint" {
  value = "${aws_elasticache_cluster.redis.cache_nodes[0].address}:6379"
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}
