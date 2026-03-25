variable "app_name" {
  description = "The name of the App Service application"
  type        = string
}

variable "resource_group_name" {
  description = "The name of the Azure Resource Group"
  type        = string
}

variable "location" {
  description = "The Azure region where resources will be created"
  type        = string
  default     = "eastus"
}

variable "node_version" {
  description = "The Node.js version for the App Service runtime"
  type        = string
  default     = "20-lts"
}
