// 背景图片API列表
const bgApis = [
    'https://api.yimian.xyz/img?type=moe',  // 国内外都能访问
    'https://pic.re/images',                 // 国际CDN
    'https://api.waifu.pics/sfw/waifu',      // 国际CDN
    'https://api.waifu.im/random/?selected_tags=waifu',  // 国际CDN
    'https://api.lolicon.app/setu/v2?size=original&r18=0' // 国内外都可访问
];

let currentBgIndex = 0;
let nextImageUrl = null;  // 存储预加载的下一张图片URL

// 获取图片URL（处理直接返回图片和返回JSON的情况）
async function getImageUrl(apiUrl) {
    try {
        const response = await fetch(apiUrl);
        const contentType = response.headers.get('content-type');
        
        if (contentType.includes('image/')) {
            return apiUrl;
        } else if (contentType.includes('application/json')) {
            const data = await response.json();
            // 根据不同API的返回格式处理
            if (data.imgurl) return data.imgurl;
            if (data.url) return data.url;
            if (data.images?.[0]?.url) return data.images[0].url;
            if (data.data?.[0]?.urls?.original) return data.data[0].urls.original;
            if (data.data?.[0]?.url) return data.data[0].url;
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

// 预加载下一张图片
async function preloadNextImage() {
    try {
        const nextIndex = (currentBgIndex + 1) % bgApis.length;
        const imageUrl = await getImageUrl(bgApis[nextIndex]);
        await preloadImage(imageUrl);
        nextImageUrl = imageUrl;
        console.log('下一张图片预加载完成');
    } catch (error) {
        console.error('预加载下一张图片失败:', error);
        nextImageUrl = null;
    }
}

// 更换背景图片
async function changeBackground() {
    try {
        let imageUrl;
        
        // 使用预加载的图片或重新加载
        if (nextImageUrl) {
            imageUrl = nextImageUrl;
            nextImageUrl = null;
            // 立即开始预加载下一张
            preloadNextImage();
        } else {
            imageUrl = await getImageUrl(bgApis[currentBgIndex]);
            await preloadImage(imageUrl);
        }
        
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
        nextImageUrl = null;  // 清除可能失败的预加载图片
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
    
    // 开始预加载下一张图片
    preloadNextImage();
    
    // 每30秒自动切换一次背景
    setInterval(changeBackground, 30000);
}); 