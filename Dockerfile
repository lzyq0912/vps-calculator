FROM python:3.9-alpine

# 安装必要的包
RUN apk add --no-cache nginx

# 设置工作目录
WORKDIR /app

# 复制后端代码和依赖
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制后端代码
COPY backend/ .

# 复制前端文件
COPY frontend-new/ /usr/share/nginx/html/

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/http.d/default.conf

# 创建日志目录
RUN mkdir -p /var/log && touch /var/log/flask.log

# 复制启动脚本
COPY start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 20000

CMD ["/start.sh"] 