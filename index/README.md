# 快速开始
目录内首页主题已按新版 `manifest.json` 规范适配，部署时无需手工替换资源路径。
`index`是`XarrPay-商户版`的自定义首页库。目录内模板已包含新版 `manifest.json`。。目录内模板已包含新版 `manifest.json`。
1. 上传到`项目根目录/templates/index/模板目录名`

2. - 商户版后台--系统设置--基础信息
   - 首页类型选择--自定义模板
   - 首页模板--填写  模板目录名
---
模板资源路径已按新版规范处理，无需手工替换。

1. 在宝塔中打开index.html

2. ctrl+h替换
   - 全局替换
# 模板结构：
```
- assets
    - css           // 样式文件
    - img           // 图片文件
    - js            // js文件
    - 其他静态文件   // 如字体文件等
- index.html        //首页html
- 其他页面html文件   //如about.html等
```

# 页内常用配置项
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

