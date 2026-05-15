variable "aws_region" {
  description = "AWS region where the EC2 instance will be created."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Name used for AWS resource tags and security group naming."
  type        = string
  default     = "react-express-starter"
}

variable "environment" {
  description = "Environment tag value."
  type        = string
  default     = "dev"
}

variable "instance_type" {
  description = "EC2 instance type."
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Existing AWS EC2 key pair name for SSH access."
  type        = string
}

variable "ssh_cidr" {
  description = "CIDR block allowed to SSH into the instance. Prefer your public IP with /32."
  type        = string
}

variable "app_cidr" {
  description = "CIDR block allowed to reach the backend API directly."
  type        = string
  default     = "0.0.0.0/0"
}

