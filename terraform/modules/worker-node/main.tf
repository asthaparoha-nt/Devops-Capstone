data "aws_ami" "amazon_linux_2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-2023.*-x86_64"]
  }

  filter {
    name   = "architecture"
    values = ["x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  filter {
    name   = "root-device-type"
    values = ["ebs"]
  }
}

resource "aws_launch_template" "worker" {
  name = "${var.project_name}-k3s-worker"

  image_id      = data.aws_ami.amazon_linux_2023.id
  instance_type = var.instance_type
 
  vpc_security_group_ids = [
    var.security_group_id
  ]

  iam_instance_profile {
    name = var.instance_profile_name
  }

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required"
  }

  user_data = base64encode(
    templatefile(
      "${path.module}/worker-user-data.tftpl",
      {
        project_name = var.project_name
        aws_region   = var.aws_region
      }
    )
  )

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "${var.project_name}-k3s-worker"
      Role = "k3s-worker"
    }
  }
}

resource "aws_autoscaling_group" "worker" {
  name = "${var.project_name}-k3s-worker-asg"

  min_size         = var.min_size
  max_size         = var.max_size
  desired_capacity = var.min_size
  
  vpc_zone_identifier = var.subnet_ids

  launch_template {
    id      = aws_launch_template.worker.id
    version = aws_launch_template.worker.latest_version
  }

  instance_refresh {
    strategy = "Rolling"

    preferences {
      min_healthy_percentage = 0
      instance_warmup        = 120
    }
  }

  health_check_type         = "EC2"
  health_check_grace_period = 300

  tag {
    key                 = "Name"
    value               = "${var.project_name}-k3s-worker"
    propagate_at_launch = true
  }

  tag {
    key                 = "Role"
    value               = "k3s-worker"
    propagate_at_launch = true
  }
}