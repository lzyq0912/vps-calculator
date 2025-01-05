#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}开始部署VPS剩余价值计算器...${NC}"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "正在安装Docker..."
    curl -fsSL https://get.docker.com | sh
    sudo systemctl start docker
    sudo systemctl enable docker
fi

# 创建配置目录
mkdir -p ~/vps-calculator && cd ~/vps-calculator

# 获取用户输入的API密钥
read -p "请输入您的汇率转换API密钥 (从 https://www.exchangerate-api.com 获取): " EXCHANGE_API_KEY

# 创建docker-compose.yml
cat > docker-compose.yml << EOL
version: '3'

services:
  app:
    image: cyclonejoker520/vps-calculator:latest
    ports:
      - "20000:20000"
    environment:
      - EXCHANGE_API_KEY=${EXCHANGE_API_KEY}
    restart: always
EOL

# 启动服务
echo "正在启动服务..."
docker-compose up -d

echo -e "${GREEN}部署完成！${NC}"
echo "访问地址: http://$(curl -s ifconfig.me):20000" 