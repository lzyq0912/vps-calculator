const API_BASE_URL = CONFIG.API_BASE_URL;

async function getExchangeRates() {
    try {
        const response = await fetch(`${API_BASE_URL}/rates`);
        if (!response.ok) throw new Error('获取汇率失败');
        return await response.json();
    } catch (error) {
        console.error('汇率获取错误:', error);
        throw error;
    }
}

async function calculate() {
    const data = {
        currency: document.getElementById('currency').value,
        sellingCurrency: document.getElementById('sellingCurrency').value,
        paymentType: document.getElementById('paymentType').value,
        price: parseFloat(document.getElementById('price').value),
        sellingPrice: parseFloat(document.getElementById('sellingPrice').value),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/calculate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || '计算失败');
        }

        return await response.json();
    } catch (error) {
        console.error('计算错误:', error);
        throw error;
    }
} 