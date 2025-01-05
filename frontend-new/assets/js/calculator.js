document.addEventListener('DOMContentLoaded', function() {
    // 设置默认日期
    const today = new Date();
    document.getElementById('startDate').value = today.toISOString().split('T')[0];
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    document.getElementById('endDate').value = nextMonth.toISOString().split('T')[0];

    // 表单提交处理
    document.getElementById('calculatorForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        try {
            const result = await calculate();
            displayResult(result);
            document.getElementById('resultCard').style.display = 'block';
        } catch (error) {
            alert('计算失败：' + error.message);
        }
    });

    // 获取并显示汇率
    async function updateExchangeRates() {
        try {
            const rates = await getExchangeRates();
            document.getElementById('usdRate').textContent = rates.USD.toFixed(4);
            document.getElementById('eurRate').textContent = rates.EUR.toFixed(4);
            document.getElementById('updateTime').textContent = `更新时间: ${rates.update_time}`;
        } catch (error) {
            console.error('获取汇率失败:', error);
        }
    }

    // 页面加载时获取汇率
    updateExchangeRates();
});

function displayResult(result) {
    const currencySymbols = {
        'CNY': '¥',
        'USD': '$',
        'EUR': '€'
    };

    const currency = document.getElementById('currency').value;
    const resultHtml = `
        <div class="result-item">
            <div class="result-label">计算说明</div>
            <div class="result-value">${result.explanation}</div>
        </div>
        <div class="result-item">
            <div class="result-label">剩余天数</div>
            <div class="result-value">${result.daysRemaining} 天</div>
        </div>
        <div class="result-item">
            <div class="result-label">剩余价值金额</div>
            <div class="result-value">
                ${currencySymbols[currency]}${result.remainingValue}
                ${currency !== 'CNY' ? `<br>(¥${result.remainingValueCNY})` : ''}
            </div>
        </div>
        <div class="result-item">
            <div class="result-label">溢价率</div>
            <div class="result-value ${result.markup > 20 ? 'markup-high' : 'markup-normal'}">
                ${result.markup}%
            </div>
        </div>
    `;
    
    document.getElementById('result').innerHTML = resultHtml;
}

// 透明度控制
document.getElementById('opacityControl').addEventListener('input', function(e) {
    const opacity = e.target.value / 100;
    document.querySelector('.card').style.backgroundColor = `rgba(255, 255, 255, ${opacity})`;
}); 