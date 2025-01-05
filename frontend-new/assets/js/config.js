const CONFIG = {
    API_BASE_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:20000/api'  // 本地开发环境
        : window.location.origin + '/api'    // 生产环境
}; 