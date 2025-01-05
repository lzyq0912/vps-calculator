FROM nginx:alpine

# 复制前端文件到 Nginx 目录
COPY . /usr/share/nginx/html/

# 配置 Nginx 反向代理
COPY nginx.conf /etc/nginx/conf.d/default.conf 