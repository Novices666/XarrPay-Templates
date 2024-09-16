# XarrPay-Templates
## 快速开始
XarrPay-Templates是`XarrPay-商户版`的模板库

## 模板结构：
```
- assets
    - css           // 样式文件
    - img           // 图片文件
    - js            // js文件
    - 其他静态文件   // 如字体文件等
- index.html        //首页html
- 其他页面html文件   //如about.html等
```

## 页内常用配置项
```html
网站名称
${"web_title" | get_option}
网站描述
${"web_description" | get_option}
网站关键字
${"web_keywords" | get_option}
网站底部（备案号）
${"web_copyright" | get_option}
网站favicon图标
${"web_favicon" | get_option}
网站logo
${"web_logo" | get_option}
网站联系QQ
${"web_service_qq" | get_option}
网站联系邮箱
${"web_service_email" | get_option}
```

