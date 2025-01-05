#!/bin/bash

# 设置颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# 检查是否为root用户
if [ "$(id -u)" != "0" ]; then
    echo -e "${RED}错误: 必须使用root权限运行此脚本${NC}"
    echo "请使用 'su -' 或 'sudo -i' 切换到root用户后重试"
    exit 1
fi

echo -e "${GREEN}开始部署VPS剩余价值计算器...${NC}"

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "正在安装Docker..."
    if ! curl -fsSL https://get.docker.com | sh; then
        echo -e "${RED}Docker安装失败，请检查网络连接后重试${NC}"
        exit 1
    fi
    systemctl start docker
    systemctl enable docker
fi

# 验证Docker服务是否正常运行
if ! systemctl is-active --quiet docker; then
    echo -e "${RED}Docker服务未正常运行，请检查系统日志${NC}"
    exit 1
fi

# 创建配置目录
mkdir -p ~/vps-calculator && cd ~/vps-calculator || {
    echo -e "${RED}创建目录失败${NC}"
    exit 1
}

# 获取用户输入的API密钥
while true; do
    read -p "请输入您的汇率转换API密钥 (从 https://www.exchangerate-api.com 获取): " EXCHANGE_API_KEY
    if [ -n "$EXCHANGE_API_KEY" ]; then
        break
    else
        echo -e "${RED}API密钥不能为空，请重新输入${NC}"
    fi
done

# 拉取镜像
echo "正在拉取Docker镜像..."
if ! docker pull cyclonejoker520/vps-calculator:latest; then
    echo -e "${RED}拉取Docker镜像失败，请检查网络连接${NC}"
    exit 1
fi

# 停止并删除已存在的容器
if docker ps -a | grep -q vps-calculator; then
    echo "检测到已存在的容器，正在停止并删除..."
    docker stop vps-calculator >/dev/null 2>&1
    docker rm vps-calculator >/dev/null 2>&1
fi

# 启动容器
echo "正在启动服务..."
if ! docker run -d \
    --name vps-calculator \
    -p 20000:20000 \
    -e EXCHANGE_API_KEY="${EXCHANGE_API_KEY}" \
    --restart always \
    cyclonejoker520/vps-calculator:latest; then
    echo -e "${RED}启动容器失败${NC}"
    exit 1
fi

# 检查容器是否成功运行
sleep 5
if ! docker ps | grep -q vps-calculator; then
    echo -e "${RED}容器启动失败，请检查日志：${NC}"
    docker logs vps-calculator
    exit 1
fi

# 获取服务器IPV4地址
SERVER_IP=$(curl -s -4 ifconfig.me || curl -s -4 icanhazip.com || curl -s -4 ipinfo.io/ip)
if [ -z "$SERVER_IP" ]; then
    echo -e "${RED}无法获取服务器IP地址${NC}"
    exit 1
fi

echo -e "${GREEN}部署完成！${NC}"
echo "访问地址: http://${SERVER_IP}:20000"
echo -e "${GREEN}如果无法访问，请检查防火墙是否已开放20000端口${NC}" 