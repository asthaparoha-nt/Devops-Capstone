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

resource "aws_instance" "master" {
  ami           = data.aws_ami.amazon_linux_2023.id
  instance_type = var.instance_type

  subnet_id = var.subnet_id

  vpc_security_group_ids = [
    var.security_group_id
  ]

  associate_public_ip_address = false

  user_data_replace_on_change = true

  iam_instance_profile = var.instance_profile_name

 user_data = replace(
    templatefile(
      "${path.module}/master-user-data.tftpl",
      {
        project_name = var.project_name
        aws_region   = var.aws_region
      }
    ),
    "\r\n",
    "\n"
  )
  tags = {
    Name = "${var.project_name}-k3s-master"
    Role = "k3s-master"
  }
}