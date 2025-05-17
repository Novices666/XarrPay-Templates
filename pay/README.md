# 通用参数

# 接口

## 订单信息

`/api/order/info?_t=1747047281583`
方式
`post`
请求参数

```json
{"order_id":"20250512185439693245"}
```

返回

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "subject": "赞助一笔",
        "out_order_id": "20250512185439144",
        "order_id": "20250512185439693245",
        "status": 1,
        "amount": 1,
        "trade_amount": 1,
        "expire_time": 1747050879,
        "pay_type": "alipay",
        "pay_type_text": "支付宝",
        "create_time": "2025-05-12 18:54:39",
        "pay_type_logo": "/static/images/pay/alipay.png",
        "content": "",
        "service_qq": "",
        "audio_enable": 1,
        "audio_content": "请支付0.01",
        "pay_tip": "",
        "pay_payed_wait_time": 3,
        "pay_account_tip": {
            "tip": "",
            "tip_cover": 0
        }
    },
    "redirect": ""
}
```

## 订单二维码

`/api/order/qrcode?_t=1747047281583`
方式
`post`

请求参数

```json
{"order_id":"20250512185439693245"}
```

返回

```json
{
    "code": 200,
    "message": "获取成功",
    "data": {
        "type": "qrcode",
        "qrcode_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsAQMAAABDsxw2AAAABlBMVEX///8AAABVwtN+AAACIElEQVR42uyaQc7dIAyEjViwzBFylBwtORpHyRFYskBMNYbkb16bdlWp+m0vnp7Il43FjI2JeHh4ePxXEaFxQCLqgnPDATSRRZe7QazydyPWZCkrcPTQUl1OrpvEFiBvhzBbS1nzPvN26huO/Q2T2BKKyA70WB2TAGKrqs42NgQoaJKAczuouledOvbp5KHFOgQ4jOvF8L89dkePLRXNVg9AfSv63x9LhRsJzBvKwo0kYXiTyN4de8NYxfirAlTjCl1Vyb9iD1PVUYBM0VLUm7pmk1o0iKkvTzdOuGwoVU2bY3/AiuoPaNoIUICjJaAADWLjWRb0CDqS7BiL4N9uEEMZ3hN4mNAIX3tKHHvDaNpbvp2cbhUADOPqBjFoPWPvPFJ41fq5aA/TcU9W2QFTdbEmnPQpg5hqKG/Doln2j50baU7FHHvDvtLLnSejnt1No02srMxbHxgP7NORPgRoB2PeaENDgDxcxZq0kj2abceeGHskQEDV6ekjaFJXXbWILSo73KOwvYcmqayjf7SHjVoPbiT2zllbZ20G8/M+y7H8m4EZgrbNM72pyrNptIPdM1U9VcxRGLV4rvm536xg19T9euPgKV3z9mHRjn2WNr3l0Vm0zjy4377eMIvptZc+U1NXm3q7HTOB9euTA/WmKivyT1N3x37B5pcJoY2TmewyWgI8R9ZmsOnk900On0XmjVXOIObh4eHxj+NHAAAA//+7enpywn5MbAAAAABJRU5ErkJggg==",
        "qrcode": "https://qr.alipay.com/fkx15742tdtmcruhbwsv45b",
        "scheme": "alipays://platformapi/startapp?saId=10000007&clientVersion=3.7.0.0718&qrcode=https%3A%2F%2Fqr.alipay.com%2Ffkx15742tdtmcruhbwsv45b%3F_s%3Dweb-other",
        "uri": "",
        "content": "",
        "actual_amount": "",
        "actual_account": "",
        "actual_account_type": ""
    },
    "redirect": ""
}
```

`/api/order/status?_t=1747047282709`
方式
`post`
请求参数

```json
{"order_id":"20250512185439693245"}
```

返回

未付款

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "status": 1,
        "expire_time": 1747049906,
        "is_auto_open": 0,
        "pay_payed_wait_time": 3
    },
    "redirect": ""
}
```

已付款

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "status": 2,
        "expire_time": 1747049906,
        "return_uri": "/pay/status?amount=1&out_trade_no=20250512183825865&pay_type=alipay&pid=10000&sign=08767669e810cfd20996d701ae0dfba4&status=2&trade_amount=1&trade_no=20250512183826000000",
        "is_auto_open": 0,
        "pay_payed_wait_time": 3
    },
    "redirect": ""
}
```

订单关闭

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "status": 3,
        "expire_time": 1747051466,
        "is_auto_open": 0,
        "pay_payed_wait_time": 3
    },
    "redirect": ""
}
```

已超时

```json
{
    "code": 200,
    "message": "success",
    "data": {
        "status": 4,
        "expire_time": 1747048049,
        "is_auto_open": 0,
        "pay_payed_wait_time": 3
    },
    "redirect": ""
}
```

其他，通过data.status判断，提示订单信息获取失败
