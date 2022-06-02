const app = getApp() //获取APP.js便于设置操作全局变量
  
import TIM from './tim-wx-sdk/tim-wx';
import { genTestUserSig } from './GenerateTestUserSig'
const DB = wx.cloud.database().collection("messagelist")

var tim = '';

function init_TIM() {//初始化im实时聊天
  console.log('tim init')
  if(app.globalData.isInit){
    //这里设置了一个全局变量isLogin来标记是否已登录,避免重复创建im实例
    return false
  }
  let options = {
    SDKAppID: 1400680058// 接入时需要将0替换为您的即时通信 IM 应用的 SDKAppID
  };
  
  let that = this
  // 创建 SDK 实例，`TIM.create()`方法对于同一个 `SDKAppID` 只会返回同一份实例
  tim = TIM.create(options);// SDK 实例通常用 tim 表示
  // 设置 SDK 日志输出级别，详细分级请参见 setLogLevel 接口的说明
  tim.setLogLevel(0); // 普通级别，日志量较多，接入时建议使用
  // tim.setLogLevel(1); // release 级别，SDK 输出关键信息，生产环境时建议使用
  // 注册 COS SDK 插件   此处暂时隐藏有需求要传图片,文件等的请放开进行配置,记住头部引入
  // tim.registerPlugin({'cos-wx-sdk': COS})

  // 监听事件，例如：
  tim.on(TIM.EVENT.SDK_READY, function(event) {
    // 收到离线消息和会话列表同步完毕通知，接入侧可以调用 sendMessage 等需要鉴权的接口
    // event.name - TIM.EVENT.SDK_READY
    // 修改个人标配资料
    console.log("sdk ready")
    //let promise = tim.updateMyProfile({
   //   nick: app.globalData.user.nickName,
     // avatar: app.globalData.user.avatarUrl,
     // gender: TIM.TYPES.GENDER_MALE,
      //allowType: TIM.TYPES.ALLOW_TYPE_ALLOW_ANY
    //});
  });

  tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(event) {
    console.log('收到消息');
    for(let i in event.data){
      if(app.globalData.MessageDetail.hasOwnProperty(event.data[i].from)){
        app.globalData.MessageDetail[event.data[i].from].push(event.data[i])
        ++app.globalData.unread[event.data[i].from].num
        // app.globalData.unread[event.data[i].from].empty = false
      }else{
        app.globalData.MessageDetail[event.data[i].from] = []
        app.globalData.unread[event.data[i].from].num = 0
        app.globalData.MessageDetail[event.data[i].from].push(event.data[i])
        ++app.globalData.unread[event.data[i].from].num
        // app.globalData.unread[event.data[i].from].empty = false
      }
    }
    // 收到推送的单聊、群聊、群提示、群系统通知的新消息，可通过遍历 event.data 获取消息列表数据并渲染到页面
    // event.name - TIM.EVENT.MESSAGE_RECEIVED
    // event.data - 存储 Message 对象的数组 - [Message]
  });

  tim.on(TIM.EVENT.MESSAGE_REVOKED, function(event) {
    // 收到消息被撤回的通知
    // event.name - TIM.EVENT.MESSAGE_REVOKED
    // event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isRevoked 属性值为 true
  });

  tim.on(TIM.EVENT.MESSAGE_READ_BY_PEER, function(event) {
    // SDK 收到对端已读消息的通知，即已读回执。使用前需要将 SDK 版本升级至 v2.7.0 或以上。仅支持单聊会话。
    // event.name - TIM.EVENT.MESSAGE_READ_BY_PEER
    // event.data - event.data - 存储 Message 对象的数组 - [Message] - 每个 Message 对象的 isPeerRead 属性值为 true
  });

  tim.on(TIM.EVENT.CONVERSATION_LIST_UPDATED, function(event) {
    // 收到会话列表更新通知，可通过遍历 event.data 获取会话列表数据并渲染到页面
    // event.name - TIM.EVENT.CONVERSATION_LIST_UPDATED
    // event.data - 存储 Conversation 对象的数组 - [Conversation]
  });

  tim.on(TIM.EVENT.GROUP_LIST_UPDATED, function(event) {
    // 收到群组列表更新通知，可通过遍历 event.data 获取群组列表数据并渲染到页面
    // event.name - TIM.EVENT.GROUP_LIST_UPDATED
    // event.data - 存储 Group 对象的数组 - [Group]
  });

  tim.on(TIM.EVENT.PROFILE_UPDATED, function(event) {
    // 收到自己或好友的资料变更通知
    // event.name - TIM.EVENT.PROFILE_UPDATED
    // event.data - 存储 Profile 对象的数组 - [Profile]
  });

  tim.on(TIM.EVENT.BLACKLIST_UPDATED, function(event) {
    // 收到黑名单列表更新通知
    // event.name - TIM.EVENT.BLACKLIST_UPDATED
    // event.data - 存储 userID 的数组 - [userID]
  });

  tim.on(TIM.EVENT.ERROR, function(event) {
    // 收到 SDK 发生错误通知，可以获取错误码和错误信息
    // event.name - TIM.EVENT.ERROR
    // event.data.code - 错误码
    // event.data.message - 错误信息
  });

  tim.on(TIM.EVENT.SDK_NOT_READY, function(event) {
    // 收到 SDK 进入 not ready 状态通知，此时 SDK 无法正常工作
    // event.name - TIM.EVENT.SDK_NOT_READY
  });

  tim.on(TIM.EVENT.KICKED_OUT, function(event) {
    // 收到被踢下线通知
    // event.name - TIM.EVENT.KICKED_OUT
    // event.data.type - 被踢下线的原因，例如:
    //    - TIM.TYPES.KICKED_OUT_MULT_ACCOUNT 多实例登录被踢
    //    - TIM.TYPES.KICKED_OUT_MULT_DEVICE 多终端登录被踢
    //    - TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED 签名过期被踢 （v2.4.0起支持）。 
  });

  tim.on(TIM.EVENT.NET_STATE_CHANGE, function(event) { 
    //  网络状态发生改变（v2.5.0 起支持）。 
    // event.name - TIM.EVENT.NET_STATE_CHANGE 
    // event.data.state 当前网络状态，枚举值及说明如下： 
    //     \- TIM.TYPES.NET_STATE_CONNECTED - 已接入网络 
    //     \- TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中” 
    //    \- TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息  
  });
  /*
  let tmp_tim = TIM.create(options)
  let promise1 = tmp_tim.login({userID: 'oF9n75GH6_sVt1B3y7kbKpXgtuhM', userSig: genTestUserSig('oF9n75GH6_sVt1B3y7kbKpXgtuhM').userSig});
  promise1.then(function(imResponse) {
    console.log('登录成功')
    console.log(imResponse.data); // 登录成功
    tmp_tim.logout()
    if (imResponse.data.repeatLogin === true) {
      // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
      console.log('当前重复登录')
      console.log(imResponse.data.errorInfo);
    }
  }).catch(function(imError) {
    console.warn('login error:', imError); // 登录失败的相关信息
  });
*/
  app.globalData.isInit = true;  //完成im实例创建后设置标志为true
}

function login_TIM(userID) {//登录im实时聊天 
  
  let promise = tim.login({userID: userID, userSig: genTestUserSig(userID).userSig});
  //console.log('登录im?')
  promise.then(function(imResponse) {
    console.log('登录成功')
   // console.log(imResponse.data); // 登录成功
    
    if (imResponse.data.repeatLogin === true) {
      // 标识账号已登录，本次登录操作为重复登录。v2.5.1 起支持
      console.log('当前重复登录')
      //console.log(imResponse.data.errorInfo);
    }
  }).catch(function(imError) {
    console.warn('login error:', imError); // 登录失败的相关信息
  });
}

function sendMessage_TIM( sendTo , msg ) {
  if (!/[^\s]+/.test(msg)) {
    console.log("不要发送空信息")
    return;
  }
  // 发送消息
  console.log('im sd', sendTo, msg)
  let message = tim.createTextMessage({
    to: sendTo,
    conversationType: TIM.TYPES.CONV_C2C,
    payload: {
      text: msg
    },
  });

  console.log('msg', message)
  app.globalData.MessageDetail[sendTo].push(message)
  let promise = tim.sendMessage(message);
  promise.then(function(imResponse) {
    // 发送成功
    DB.add({
      data:{
        message:message
      }
    })
    console.log('发送成功')
    console.log(imResponse);
  }).catch(function(imError) {
    // 发送失败
    console.log('发送失败')
    console.warn('sendMessage error:', imError);
  });
  console.log('send ', app.globalData.MessageDetail[sendTo])
}

function logout_TIM() {
  let promise = tim.logout();
  promise.then(function(imResponse) {
    console.log(imResponse.data); // 登出成功
  }).catch(function(imError) {
    console.warn('logout error:', imError);
  });
}

//导出初始化,登录,消息发送接口供外部使用
module.exports = {
  init_TIM,
  login_TIM,
  logout_TIM,
  sendMessage_TIM
}
