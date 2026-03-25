output "app_service_url" {
  description = "The default URL of the App Service."
  value       = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "resource_group_id" {
  description = "The ID of the Resource Group."
  value       = azurerm_resource_group.main.id
}
