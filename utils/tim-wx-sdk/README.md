本文主要介绍如何快速地将腾讯云 IM SDK 集成到您的小程序项目中，只要按照如下步骤进行配置，就可以完成 SDK 的集成工作。

## 准备工作
在集成 Web SDK 前，请确保您已完成以下步骤，请参见 [快速入门](https://cloud.tencent.com/document/product/269/68376)。
- 创建了腾讯云即时通信 IM 应用，并获取到 SDKAppID。
- 获取密钥信息。

## 集成 SDK
您可以通过以下方式集成 SDK：

### NPM 集成
在您的项目中使用 npm 安装相应的 IM SDK 依赖。

#### 小程序项目：
```javascript
// IM 小程序 SDK
npm install tim-wx-sdk --save
// 发送图片、文件等消息需要的上传插件
npm install tim-upload-plugin --save
```
在项目脚本里引入模块，并初始化。

```javascript
import TIM from 'tim-wx-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';

let options = {
  SDKAppID: 0 // 接入时需要将 0 替换为您的云通信应用的 SDKAppID，类型为 Number
};
// 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
let tim = TIM.create(options); // SDK 实例通常用 tim 表示

// 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
// tim.setLogLevel(1); // release级别，SDK 输出关键信息，生产环境时建议使用

// 注册腾讯云即时通信 IM 上传插件
tim.registerPlugin({'tim-upload-plugin': TIMUploadPlugin});

// 接下来可以通过 tim 进行事件绑定和构建 IM 应用
```

更详细的初始化流程请看 [SDK 初始化例子](https://web.sdk.qcloud.com/im/doc/zh-cn/TIM.html)

#### 相关资源
- [SDK 更新日志](https://cloud.tencent.com/document/product/269/38492)
- [SDK 接口文档](https://web.sdk.qcloud.com/im/doc/zh-cn/SDK.html)
- [常见问题](https://web.sdk.qcloud.com/im/doc/zh-cn/tutorial-01-faq.html)
- [WebSocket 升级指引](https://web.sdk.qcloud.com/im/doc/zh-cn/tutorial-02-upgradeguideline.html)
- [IM 小程序 Demo](https://github.com/tencentyun/TIMSDK/tree/master/WXMini)