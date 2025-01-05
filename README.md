# VPS剩余价值计算器

一个帮助计算VPS剩余价值的在线工具。

## 一键部署

1. 首先获取免费的汇率API密钥：
   - 注册 [ExchangeRate-API](https://www.exchangerate-api.com)
   - 获取免费的 API 密钥

2. 运行一键部署命令：
```bash
rm -f vps_value_calculator_deploy.sh && curl -O https://raw.githubusercontent.com/lzyq0912/vps-calculator/main/vps_value_calculator_deploy.sh && chmod +x vps_value_calculator_deploy.sh && ./vps_value_calculator_deploy.sh
```

3. 根据提示输入你的 API 密钥

4. 访问 `http://你的服务器IP:20000` 即可使用

## 环境要求

- 支持 Docker 的 Linux 系统
- 开放 20000 端口
- 至少 512MB 内存
