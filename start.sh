#!/bin/sh

# 显示环境信息
echo "Python version:"
python --version
echo "Pip packages:"
pip list

# 启动 Flask 后端
echo "Starting Flask backend..."
cd /app
python app.py &

# 等待后端启动
echo "Waiting for backend to start..."
sleep 5

# 检查后端是否正在运行
if ! pgrep -f "python app.py" > /dev/null; then
    echo "Backend failed to start. Log contents:"
    cat /var/log/flask.log
    exit 1
fi

echo "Starting Nginx..."
nginx -g 'daemon off;' 