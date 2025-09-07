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
    qrcodeSchemeBtn: document.getElementById("qrcodeSchemeBtn"),
};
const OrderId = domElements.orderId.textContent;
console.log(OrderId);
var orderInfo = null;
var orderQRCode = null;
var orderAudio = null;
var orderStatus = null;
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
            orderStatus = await Api.getOrderStatus(OrderId);
        }
    } catch (e) {
        console.error(e);
    }
}
// 加载数据到页面
function loadOrderData() {
    domElements.subject.textContent = orderInfo.subject;
    domElements.tradeAmount.textContent = (orderInfo.trade_amount / 100).toFixed(
        2
    );
    domElements.payTypeText.textContent = orderInfo.pay_type_text;
    domElements.payTypeLogo.src = orderInfo.pay_type_logo;
    domElements.serviceQq.textContent = orderInfo.service_qq;
    domElements.createTime.textContent = orderInfo.create_time;
    domElements.payTip.innerHTML = orderInfo.pay_tip;
    if (orderAudio.audio_enable == 1) {
        domElements.audio.src =
            "https://tts.xarr.uk?t=" + encodeURI(orderAudio.audio_content);
    }
    loadOrderQRCode(orderQRCode);
    initOrderStatus(orderInfo.status);
}
// 加载支付二维码
function loadOrderQRCode(orderQRCode) {
    switch (orderQRCode.type) {
        case "qrcode":
            domElements.qrcodeData.src = orderQRCode.qrcode_data;
            domElements.qrcodeData.style.width = "80%";
            domElements.qrcodeData.style.height = "80%";
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
            let remainingTime = orderStatus.pay_payed_wait_time;
            console.log(orderStatus.pay_payed_wait_time + "秒后跳转");
            domElements.modal.classList.remove("show");
            domElements.countdown.textContent = "支付成功 \n"+remainingTime+" 秒后跳转";
            const countdownInterval = setInterval(function () {
                remainingTime--;
                console.log(remainingTime + "秒后跳转");
                domElements.countdown.textContent = "支付成功 \n"+remainingTime+" 秒后跳转";
                if (remainingTime <= 0) {
                    clearInterval(countdownInterval); // 清除倒计时定时器
                    window.location.href = orderStatus.return_uri;
                }
            }, 1000);

            setTimeout(function () {
                clearInterval(countdownInterval);
                window.location.href = orderStatus.return_uri;
            }, orderStatus.pay_payed_wait_time * 1000);
            return;
            break;
        case 3: // 订单关闭
        domElements.countdown.textContent = "订单关闭";
            domElements.status.textContent = "订单关闭";
            break;
        case 4: // 订单超时
            domElements.countdown.textContent = "订单超时";
            domElements.status.textContent = "订单超时";
            break;
        default: // 其他状态
            domElements.countdown.textContent = "订单异常";
            domElements.status.textContent = "订单异常";
            break;
    }
}
// 检查订单状态
async function startCheckOrderStatus() {
    var timer = setInterval(async function () {
        try {
            orderStatus = await Api.getOrderStatus(OrderId);
            console.log(orderStatus);
            if (orderStatus.status == 2) {
                clearInterval(timer);
            }
            loadOrderStatus(orderStatus);
        } catch (e) {
            console.error(e);
        }
    }, 1000);
}
// 支付倒计时
function startCountdown() {
    var expireTime = orderInfo.expire_time;
    let alertTriggered = false;//显示状态是否切换
    let finalAlertTriggered = false;
    var timer = setInterval(function () {
        if (orderStatus.status == 1) {
            var now = Math.floor(Date.now() / 1000);
            var remaining = expireTime - now;

            if (remaining <= 0) {
                domElements.countdown.textContent = "订单超时";
                clearInterval(timer);
                return;
            }

            var minutes = Math.floor(remaining / 60);
            var seconds = remaining % 60;
            domElements.countdown.textContent =
                minutes + ":" + (seconds < 10 ? "0" : "") + seconds;


            // 特定模板处理
            if (minutes <= 0 && !alertTriggered) {
                // 修改计时器样式为警告状态
                const timerContainer = document.querySelector('.timer-container');
                timerContainer.style.background = 'linear-gradient(135deg, #f59e0b, #ef4444)';
                alertTriggered = true;
            }

            if (minutes <= 0 && seconds <= 30 && !finalAlertTriggered) {
                // 添加顶部警告条
                const alertMsg = document.createElement("div");
                alertMsg.id = "alertMsg";
                alertMsg.textContent = "支付即将超时！请尽快完成支付！";
                alertMsg.style.position = "fixed";
                alertMsg.style.top = "0";
                alertMsg.style.left = "0";
                alertMsg.style.right = "0";
                alertMsg.style.backgroundColor = "#ef4444";
                alertMsg.style.color = "white";
                alertMsg.style.padding = "14px";
                alertMsg.style.textAlign = "center";
                alertMsg.style.fontSize = "16px";
                alertMsg.style.fontWeight = "600";
                alertMsg.style.zIndex = "1000";
                alertMsg.style.boxShadow = "0 3px 10px rgba(0,0,0,0.2)";
                document.body.appendChild(alertMsg);
                finalAlertTriggered = true;
            }
        } else {
            clearInterval(timer);
        }
    }, 1000);
} 
