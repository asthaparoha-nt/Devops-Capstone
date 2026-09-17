resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg"
  description = "Security group for public Application Load Balancer"
  vpc_id      = var.vpc_id

  ingress {
    description = "HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description     = "Allow traffic to worker nodes"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [var.worker_security_group_id]
  }

  tags = {
    Name = "${var.project_name}-alb-sg"
  }
}

//worker node k port no 30080 par sirf alb security group se tcp traffic allowed hai
resource "aws_vpc_security_group_ingress_rule" "worker_from_alb" {
  security_group_id            = var.worker_security_group_id
  referenced_security_group_id = aws_security_group.alb.id

  from_port = 30080
  to_port   = 30080
  ip_protocol = "tcp"

  description = "Allow ALB traffic to NGINX NodePort"
}


resource "aws_lb" "this" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"

  security_groups = [
    aws_security_group.alb.id
  ]

  subnets = var.public_subnet_ids

  tags = {
    Name = "${var.project_name}-alb"
  }
}


resource "aws_lb_target_group" "workers" {
  name        = "${var.project_name}-workers"
  port        = 30080
  protocol    = "HTTP"
  target_type = "instance"
  vpc_id      = var.vpc_id

  health_check {
    enabled             = true
    protocol            = "HTTP"
    port                = "30080"
    path                = "/"
    matcher             = "200-499"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }

  tags = { 
    Name = "${var.project_name}-worker-target-group"
  }
}

//in order to attach alb(target group) to asg
resource "aws_autoscaling_attachment" "workers" {
  autoscaling_group_name = var.worker_asg_name
  lb_target_group_arn    = aws_lb_target_group.workers.arn
}

//in which port will alb listen incoming traffic
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.this.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.workers.arn
  }
}