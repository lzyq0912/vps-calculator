FROM python:3.9-slim

WORKDIR /app


COPY requirements.txt .
# 设置环境变量来禁用pip的代理
ENV no_proxy="*"
ENV PIP_NO_PROXY="*"

RUN pip config set global.trusted-host pypi.tuna.tsinghua.edu.cn && \
    pip install -i https://pypi.tuna.tsinghua.edu.cn/simple \
    --no-cache-dir \
    --trusted-host pypi.tuna.tsinghua.edu.cn \
    -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"] 
