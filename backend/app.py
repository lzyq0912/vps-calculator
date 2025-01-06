# app.py
from flask import Flask, jsonify, request
import requests
from flask_cors import CORS
from datetime import datetime, timedelta
import os
from functools import lru_cache

app = Flask(__name__)
CORS(app)

# 汇率缓存，24小时更新一次
@lru_cache(maxsize=1)
def get_exchange_rates_with_timestamp():
    # 使用日期作为缓存key，这样每天只会调用一次API
    timestamp = datetime.now().replace(microsecond=0, second=0, minute=0, hour=0)
    try:
        api_key = os.getenv('EXCHANGE_API_KEY', 'YOUR_API_KEY')
        response = requests.get(
            f'https://v6.exchangerate-api.com/v6/{api_key}/latest/CNY',
            timeout=5
        )
        if response.status_code == 200:
            data = response.json()
            return timestamp, {
                'CNY': 1,
                'USD': data['conversion_rates']['USD'],
                'EUR': data['conversion_rates']['EUR'],
                'update_time': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }
    except Exception as e:
        print(f"汇率API调用失败: {str(e)}")
    
    return timestamp, {
        'CNY': 1,
        'USD': 0.14,
        'EUR': 0.13,
        'update_time': '数据获取失败，使用默认汇率'
    }

def get_exchange_rates():
    timestamp, rates = get_exchange_rates_with_timestamp()
    return rates

@app.route('/rates')
def get_rates():
    rates = get_exchange_rates()
    return jsonify(rates)

@app.route('/calculate', methods=['POST'])
def calculate_value():
    try:
        data = request.json
        if not data:
            return jsonify({'error': '没有接收到数据'}), 400

        required_fields = ['currency', 'paymentType', 'price', 'sellingPrice', 'startDate', 'endDate']
        if not all(field in data for field in required_fields):
            return jsonify({'error': '缺少必要的字段'}), 400

        rates = get_exchange_rates()
        
        # 将输入价格转换为人民币
        price_cny = data['price']
        if data['currency'] != 'CNY':
            price_cny = data['price'] / rates[data['currency']]
        
        selling_price_cny = data['sellingPrice']

        # 计算剩余天数
        start_date = datetime.fromisoformat(data['startDate'].replace('Z', '+00:00'))
        end_date = datetime.fromisoformat(data['endDate'].replace('Z', '+00:00'))
        days_remaining = (end_date - start_date).days

        if days_remaining < 0:
            return jsonify({'error': '结束日期必须晚于开始日期'}), 400

        # 根据付费类型确定总天数
        total_days = {
            'monthly': 30,
            'quarterly': 90,  # 季付
            'semiannually': 180,  # 半年付
            'yearly': 365,
            'threeYears': 1095  # 三年付
        }[data['paymentType']]

        # 计算剩余价值
        value_ratio = min(1.0, days_remaining / total_days)
        remaining_value_cny = price_cny * value_ratio
        
        # 转换回原始货币和出售价格的处理
        remaining_value = remaining_value_cny
        if data['currency'] != 'CNY':
            remaining_value = remaining_value_cny * rates[data['currency']]

        # 将出售价格转换为人民币进行计算
        selling_price_cny = data['sellingPrice']
        if data.get('sellingCurrency', 'CNY') != 'CNY':
            selling_price_cny = data['sellingPrice'] / rates[data['sellingCurrency']]

        # 计算溢价率
        markup = ((selling_price_cny - remaining_value_cny) / remaining_value_cny * 100) if remaining_value_cny > 0 else 0

        result = {
            'daysRemaining': days_remaining,
            'valueRatio': value_ratio * 100,  # 转换为百分比
            'remainingValue': round(remaining_value, 2),
            'remainingValueCNY': round(remaining_value_cny, 2),
            'markup': round(markup, 2),
            'explanation': f"基于{total_days}天的付费周期，剩余{days_remaining}天，剩余价值率为{round(value_ratio * 100, 2)}%"
        }

        return jsonify(result)

    except Exception as e:
        print(f"计算错误: {str(e)}")
        return jsonify({'error': '计算过程中发生错误'}), 500

@app.route('/api/visits')
def get_visit_stats():
    stats = increment_visit_count()
    return jsonify(stats)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)