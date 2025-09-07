/**
 * API请求整合模块
 * 封装支付模板相关API请求
 */

class Api {
  /**
   * 基础请求方法
   * @param {string} url - API地址
   * @param {object} data - 请求数据
   * @returns {Promise} - 返回Promise对象
   */
  static async request(url, data = {}) {
    try {
      // 添加时间戳防止缓存
      const timestamp = Math.floor(new Date().getTime()/1000);
      const requestUrl = `${url}?_t=${timestamp}`;
      
      const response = await fetch(requestUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `请求失败: ${response.status}`);
      }
      const res = await response.json();
      console.log('API请求成功:', res);
      if (res.code !== 200){
        throw new Error(`errorr: ${res.message}`);
      }else{
        console.log('响应数据:', res.data);
        return res.data;
      }
      
    } catch (error) {
      throw new Error(`error: ${error.message}`);
    }
  }

  /**
   * 获取订单信息
   * @param {string} orderId - 订单ID
   * @returns {Promise} - 返回订单信息
   */
  static async getOrderInfo(orderId) {
    return this.request('/api/order/info', { order_id: orderId });
  }

  /**
   * 获取订单状态
   * @param {string} orderId - 订单ID
   * @returns {Promise} - 返回订单状态
   */
  static async getOrderStatus(orderId) {
    return this.request('/api/order/status', { order_id: orderId });
  }

  /**
   * 获取订单二维码信息
   * @param {string} orderId - 订单ID
   * @returns {Promise} - 返回二维码信息
   */
  static async getOrderQRCode(orderId) {
    return this.request('/api/order/qrcode', { order_id: orderId });
  }

  /**
   * 获取订单语音播报信息
   * @param {string} orderId - 订单ID
   * @returns {Promise} - 返回语音信息
   */
  static async getOrderAudio(orderId) {
    return this.request('/api/order/audio', { order_id: orderId });
  }
}

// 导出API实例
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Api;  // CommonJS/Node.js环境
} else {
    window.Api = Api;  // 浏览器全局环境
}
