// 背景图片API列表
const bgApis = [
    'https://api.ixiaowai.cn/api/api.php',      // 二次元动漫壁纸
    'https://api.mtyqx.cn/tapi/random.php',     // 随机动漫壁纸
    'https://www.dmoe.cc/random.php',           // 二次元随机壁纸
    'https://api.vvhan.com/api/acgimg',         // 动漫壁纸
    'https://api.yimian.xyz/img?type=moe'       // 二次元图片
];

let currentBgIndex = 0;

// 获取图片URL（处理直接返回图片和返回JSON的情况）
async function getImageUrl(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const contentType = response.headers.get('content-type');
        
        if (contentType.includes('image/')) {
            return apiUrl;
        } else if (contentType.includes('application/json')) {
            const data = await response.json();
            // 根据不同API的JSON结构返回实际图片URL
            if (data.imgurl) return data.imgurl;
            if (data.url) return data.url;
            if (data.pic) return data.pic;
            throw new Error('未找到图片URL');
        }
        return apiUrl;
    } catch (error) {
        console.error('获取图片URL失败:', error);
        throw error;
    }
}

// 预加载图片
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => reject(url);
        img.src = url;
    });
}

// 更换背景图片
async function changeBackground() {
    try {
        // 获取并预加载图片
        const imageUrl = await getImageUrl(bgApis[currentBgIndex]);
        await preloadImage(imageUrl);
        
        const wrapper = document.querySelector('.background-wrapper') || (() => {
            const wrap = document.createElement('div');
            wrap.className = 'background-wrapper';
            document.body.insertBefore(wrap, document.body.firstChild);
            return wrap;
        })();

        // 获取当前背景和创建新背景
        const currentBg = document.querySelector('.background-container');
        const newBg = document.createElement('div');
        newBg.className = 'background-container next';
        newBg.style.opacity = '0';
        newBg.style.backgroundImage = `url('${imageUrl}')`;
        
        // 添加overlay
        const overlay = document.createElement('div');
        overlay.className = 'background-overlay';
        newBg.appendChild(overlay);
        
        // 将新背景添加到包装器
        wrapper.appendChild(newBg);
        
        // 等待一帧以确保CSS已应用
        await new Promise(requestAnimationFrame);
        
        // 淡入新背景
        newBg.style.opacity = '1';
        
        // 等待过渡完成后移除旧背景
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (currentBg) {
            currentBg.remove();
        }
        
        // 更新索引
        currentBgIndex = (currentBgIndex + 1) % bgApis.length;
        
    } catch (error) {
        console.error('背景加载失败，尝试下一个', error);
        currentBgIndex = (currentBgIndex + 1) % bgApis.length;
        changeBackground();
    }
}

// 初始化背景
document.addEventListener('DOMContentLoaded', function() {
    // 创建背景包装器
    const wrapper = document.createElement('div');
    wrapper.className = 'background-wrapper';
    document.body.insertBefore(wrapper, document.body.firstChild);
    
    // 添加控制按钮
    const controls = document.createElement('div');
    controls.className = 'bg-control';
    controls.innerHTML = `
        <button onclick="changeBackground()">切换背景</button>
    `;
    document.body.appendChild(controls);
    
    // 初始加载背景
    changeBackground();
    
    // 每30秒自动切换一次背景
    setInterval(changeBackground, 30000);
}); 