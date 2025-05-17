// 全部可以修改的dom元素
const domElements = {
    orderId: document.getElementById("orderId"), //通过注入
    subject: document.getElementById("subject"),
    tradeAmount: document.getElementById("tradeAmount"),
    payTypeText: document.getElementById("payTypeText"),
    payTypeLogo: document.getElementById("payTypeLogo"),
    serviceQq: document.getElementById("serviceQq"),
    createTime: document.getElementById("createTime"),
    expireTime: document.getElementById("expireTime"),
    status: document.getElementById("status"),
    payTip: document.getElementById("payTip"),
    audio: document.getElementById("audio"),
    qrcodeData: document.getElementById("qrcodeData"),
    countdown: document.getElementById("countdown"),
    modal: document.getElementById("modal"),
};
const OrderId = domElements.orderId.textContent;
console.log(OrderId);
var orderInfo = null;
var orderQRCode = null;
var orderAudio = null;
// 通过接口获取数据
async function getOrderData() {
    try {
        orderInfo = await Api.getOrderInfo(OrderId);
        console.log(orderInfo);
        if (orderInfo.status == 1) {
            orderQRCode = await Api.getOrderQRCode(OrderId);
            console.log(orderQRCode);
            orderAudio = await Api.getOrderAudio(OrderId);
            console.log(orderAudio);
        }
    } catch (e) {
        console.error(e);
    }
}
// 加载数据到页面
function loadOrderData() {
    domElements.subject.textContent = orderInfo.subject;
    domElements.tradeAmount.textContent = (orderInfo.trade_amount/100).toFixed(2);
    domElements.payTypeText.textContent = orderInfo.pay_type_text;
    domElements.payTypeLogo.src = orderInfo.pay_type_logo;
    domElements.serviceQq.textContent = orderInfo.service_qq;
    domElements.createTime.textContent = orderInfo.create_time;
    domElements.payTip.innerHTML = orderInfo.pay_tip;
    if (orderAudio.audio_enable == 1) {
        domElements.audio.src = "https://tts.xarr.uk?t="+encodeURI( orderAudio.audio_content);
    }
    loadOrderQRCode(orderQRCode);
    initOrderStatus(orderInfo.status);
}
// 加载支付二维码
function loadOrderQRCode(orderQRCode) {
    switch (orderQRCode.type) {
        case "qrcode":
            domElements.qrcodeData.src = orderQRCode.qrcode_data;
            break;
        case "jump":
            window.location.href = orderQRCode.uri;
            break;
    }
}
function initOrderStatus(status) {
    switch (status) {
        case 1: // 待支付
            domElements.status.textContent = "等待支付";
            break;
        case 2: // 已支付
            domElements.status.textContent = "支付完成";
            break;
        case 3: // 订单关闭
            domElements.status.textContent = "订单关闭";
            break;
        case 4: // 订单超时
            domElements.status.textContent = "订单超时";
            break;
        default: // 其他状态
            domElements.status.textContent = "订单异常";
            break;
    }
}
// 加载订单状态
function loadOrderStatus(orderStatus) {
    switch (orderStatus.status) {
        case 1: // 待支付
            domElements.status.textContent = "等待支付";
            break;
        case 2: // 已支付
            domElements.status.textContent = "支付完成";
            console.log("3秒后跳转");
            setTimeout(function () {
                window.location.href = orderStatus.return_uri;
            }, orderStatus.pay_payed_wait_time * 1000);
            return;
            break;
        case 3: // 订单关闭
            domElements.status.textContent = "订单关闭";
            break;
        case 4: // 订单超时
            domElements.status.textContent = "订单超时";
            break;
        default: // 其他状态
            domElements.status.textContent = "订单异常";
            break;
    }
}
// 检查订单状态
async function startCheckOrderStatus() {
    var orderStatus = null;
    var timer = setInterval(async function () {
        try {
            orderStatus = await Api.getOrderStatus(OrderId);
            // console.log(orderStatus);
            loadOrderStatus(orderStatus);
        } catch (e) {
            console.error(e);
        }
    }, 1000);
}
// 支付倒计时
function startCountdown() {
    var expireTime = orderInfo.expire_time;
    var timer = setInterval(function () {
        var now = Math.floor(Date.now() / 1000);
        var remaining = expireTime - now;

        if (remaining <= 0) {
            domElements.countdown.textContent = "订单已过期";
            clearInterval(timer);
            return;
        }

        var minutes = Math.floor(remaining / 60);
        var seconds = remaining % 60;
        domElements.countdown.textContent =
            "剩余支付时间: " +
            minutes +
            "分" +
            (seconds < 10 ? "0" : "") +
            seconds +
            "秒";
    }, 1000);
}
