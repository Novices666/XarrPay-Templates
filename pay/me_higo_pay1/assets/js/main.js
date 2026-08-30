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
const OrderId = domElements.orderId ? domElements.orderId.textContent.trim() : "";
console.log(OrderId);
var orderInfo = null;
var orderQRCode = null;
var orderAudio = null;
// 通过接口获取数据
async function getOrderData() {
    try {
        if (!OrderId) {
            throw new Error("订单号为空");
        }
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
        throw e;
    }
}
// 加载数据到页面
function loadOrderData() {
    if (!orderInfo) {
        domElements.status.textContent = "订单信息获取失败";
        return;
    }
    domElements.subject.textContent = orderInfo.subject;
    const tradeAmount = Number(orderInfo.trade_amount);
    domElements.tradeAmount.textContent = Number.isFinite(tradeAmount)
        ? (tradeAmount / 100).toFixed(2)
        : (orderInfo.trade_amount_text || "");
    domElements.payTypeText.textContent = orderInfo.pay_type_text || (orderInfo.pay_type_info && orderInfo.pay_type_info.label) || "";
    domElements.payTypeLogo.src = orderInfo.pay_type_logo || (orderInfo.pay_type_info && orderInfo.pay_type_info.logo) || "";
    domElements.serviceQq.textContent = orderInfo.service_qq || "";
    domElements.createTime.textContent = orderInfo.create_time;
    domElements.payTip.textContent = orderInfo.pay_tip || "";
    if (orderAudio && orderAudio.audio_enable == 1) {
        domElements.audio.src = orderAudio.audio_url || ("https://tts.xarr.uk?t=" + encodeURIComponent(orderAudio.audio_content || ""));
    }
    if (orderQRCode) {
        loadOrderQRCode(orderQRCode);
    }
    initOrderStatus(orderInfo.status);
}
// 加载支付二维码
function loadOrderQRCode(orderQRCode) {
    if (!orderQRCode) {
        return;
    }
    if (domElements.qrcodeSchemeBtn) {
        domElements.qrcodeSchemeBtn.style.display = orderQRCode.scheme ? "" : "none";
        domElements.qrcodeSchemeBtn.disabled = !orderQRCode.scheme;
    }
    switch (orderQRCode.type) {
        case "qrcode":
            domElements.qrcodeData.src = orderQRCode.qrcode_data || orderQRCode.qrcode || "";
            break;
        case "jump":
            window.location.href = orderQRCode.uri || orderQRCode.scheme;
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
            const returnUri = orderStatus.return_uri;
            if (!returnUri) {
                return;
            }
            let remainingTime = Math.max(0, Number(orderStatus.pay_payed_wait_time) || 0);
            console.log(orderStatus.pay_payed_wait_time + "秒后跳转");
            domElements.modal.classList.remove('show');
            const existingAlert = document.querySelector('.alert-box');
            if (existingAlert) existingAlert.remove();
            const alertBox = document.createElement('div');
            alertBox.className = 'alert-box';

            const alertMsg = document.createElement('div');
            alertMsg.className = 'alert-message';
            alertMsg.textContent = "订单支付完成";

            const countdown = document.createElement('div');
            countdown.className = 'alert-countdown';
            countdown.textContent = remainingTime + "秒后跳转";
            // 组装提示框
            alertBox.appendChild(alertMsg);
            alertBox.appendChild(countdown);
            // 添加到页面
            document.body.appendChild(alertBox);

            const countdownInterval = setInterval(function () {
                remainingTime--;
                console.log(remainingTime + "秒后跳转");
                countdown.textContent = remainingTime + "秒后跳转"
                if (remainingTime <= 0) {
                    clearInterval(countdownInterval); // 清除倒计时定时器
                    window.location.href = returnUri;
                }
            }, 1000);

            setTimeout(function () {
                clearInterval(countdownInterval);
                window.location.href = returnUri;
            }, remainingTime * 1000);
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
            if ([2, 3, 4, 5].includes(orderStatus.status)) {
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
    if (!orderInfo || !orderInfo.expire_time) {
        return;
    }
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
