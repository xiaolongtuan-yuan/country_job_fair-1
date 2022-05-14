// pages/messageDetail/messageDetail.js
const app = getApp()
const DB = wx.cloud.database().collection("messagelist")
const DBU = wx.cloud.database().collection("users")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    MessageDetail:{
      data:[]
    },
    myself:{
      openid:"",
      userInfo:{}
    },
    targetUser:{
      openid:"",
      userInfo:{
        nickName:"",
        avatarUrl:""
      }
    },
    replyContent:"",
    lastSendTimeStamp:0,
    lastLoadedBeforeTimeStamp:0,
    lastLoadedNextTimeStamp:0,
    intervalId:0,
    topValue:100,
    messageNum:0,
    firstLoaded:false
  },

  /**
   * 信息发布时间比较
   */
  compare_msg:function (x, y) {
    if(x.timestamp < y.timestamp){
      return -1
    }else if(x.timestamp > y.timestamp){
      return 1
    }else {
      return 0
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("chat id", options.target)
    DBU.where({
      _openid:options.target
    }).get({
      success:res=>{
        console.log("onload", res.data)
        this.setData({
          targetUser:{
            openid:options.target,
            userInfo:{
              nickName:res.data[0].name,
              avatarUrl:res.data[0].touxiang
            }
          }
        })
        let timeStamp = Date.parse(new Date());
        this.setData({
          myself:{
            openid:app.globalData.openID,
            userInfo:app.globalData.user
          },
          lastLoadedBeforeTimeStamp:timeStamp,
          lastLoadedNextTimeStamp:timeStamp
        })
        this.loadMessageBefore()
        clearInterval(this.data.intervalId)
        this.setData({
          intervalId:setInterval(this.loadMessageNext, 5000),
          topValue: this.data.MessageDetail.data.length * 100   
        })
      }
    })
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    clearInterval(this.data.intervalId)
    this.setData({
      intervalId:setInterval(this.loadMessageNext, 5000)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log("msg de hide")
    for(let j in app.globalData.Friends){
      if(this.data.MessageDetail.data.length === 0){
        break;
      }
      console.log(app.globalData.Friends[j].id, this.data.targetUser.openid)
      if(app.globalData.Friends[j].id == this.data.targetUser.openid){
        let last = this.data.MessageDetail.data.length;
        app.globalData.Friends[j].lastread = this.data.MessageDetail.data[last - 1].timestamp + 1
        console.log("f det",app.globalData.Friends[j])
        DBU.where({
          _openid:app.globalData.openID
        }).update({
          data:{
            Friends:app.globalData.Friends
          }
        })
      }
    }
    clearInterval(this.data.intervalId)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log("msg de hide")
    for(let j in app.globalData.Friends){
      if(this.data.MessageDetail.data.length === 0){
        break;
      }
      console.log(app.globalData.Friends[j].id, this.data.targetUser.openid)
      if(app.globalData.Friends[j].id == this.data.targetUser.openid){
        let last = this.data.MessageDetail.data.length;
        app.globalData.Friends[j].lastread = this.data.MessageDetail.data[last - 1].timestamp + 1
        console.log("f det",app.globalData.Friends[j])
        DBU.where({
          _openid:app.globalData.openID
        }).update({
          data:{
            Friends:app.globalData.Friends
          }
        })
      }
    }
    clearInterval(this.data.intervalId)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  /**
   * 回复框输入更新
   */
  replyInputChange: function (e) {
    this.setData({
      replyContent: e.detail.value
    })
    console.log("yes", this.data.replyContent);
  },

  /**
   * 发送消息
   */
  submitRely: function (e) {
    console.log("send msg");
    let timeStamp = Date.parse(new Date())
    timeStamp = timeStamp
    if(timeStamp - this.data.lastSendTimeStamp <= 3000){
      return;
    }
    this.data.lastSendTimeStamp = timeStamp;
    // 消息为空
    if (!/[^\s]+/.test(this.data.replyContent)) {
      this.setData({
        replyContent: ""
      });

      return;
    }
    let from_t = app.globalData.openID
    let to_t = this.data.targetUser.openid
    console.log("where",from_t, this.data.targetUser.openid)
    DB.add({
      data:{
        from: from_t,
        to: to_t,
        timestamp:timeStamp,
        content:this.data.replyContent,
        self:true
      }
    })
    this.setData({
      MessageDetail:{
        data:this.data.MessageDetail.data.concat([{
          _id:"",
          _openid:"",
          from: from_t,
          to: to_t,
          timestamp:timeStamp,
          content:this.data.replyContent,
          self:true
        }])
      },
      replyContent:""
    })
    this.setData({
      topValue: 100 * this.data.MessageDetail.data.length,
      messageNum:this.data.MessageDetail.data.length
    })
    
  },

  /**
   * 获取消息
   */
  loadMessageBefore: function (e) {
    let beforeTimeStamp = this.data.lastLoadedBeforeTimeStamp;
    console.log(beforeTimeStamp)
    const _ = wx.cloud.database().command
    DB.where(_.or([
      {
        timestamp:_.lte(beforeTimeStamp),
        from:this.data.myself.openid,
        to:this.data.targetUser.openid
      },
      {
        timestamp:_.lte(beforeTimeStamp),
        from:this.data.targetUser.openid,
        to:this.data.myself.openid
      }
    ])).get({
      success: res=>{
        res.data.sort(this.compare_msg)
        console.log("before suc", res.data.length)
        if(res.data.length != 0){
          for(let i in res.data){
            console.log("here last",res.data[i].from)
            if(res.data[i].from === this.data.myself.openid){
              res.data[i].self = true
            }else{
              res.data[i].self = false
            }
            console.log("self", res.data[i].self)
            if(res.data[i].timestamp < this.data.lastLoadedBeforeTimeStamp){
              this.setData({
                lastLoadedBeforeTimeStamp: res.data[i].timestamp - 1
              })
            }
          }
        }
        this.setData({
          MessageDetail:{
            data:res.data.concat(this.data.MessageDetail.data),
          },
        })
        this.setData({
          messageNum:this.data.MessageDetail.data.length
        })
        if(!this.data.firstLoaded){
          this.setData({
            topValue:this.data.MessageDetail.data.length * 100,
            firstLoaded:true
          })
        }
      },
      fail:res=>{
        console.log("fail")
      }
    })
  },

  loadMessageNext:function (e) {
    let nextTimeStamp = this.data.lastLoadedNextTimeStamp 
    const _ = wx.cloud.database().command
    DB.where({
      timestamp:_.gte(nextTimeStamp),
      from:this.data.targetUser.openid,
      to:this.data.myself.openid
    }).get({
      success: res=>{
        res.data.sort(this.compare_msg)
        for(let i in res.data){
          res.data[i].self = false
          console.log("here",res.data[i].content)
          if(this.data.lastLoadedNextTimeStamp < res.data[i].timestamp){
            this.setData({
              lastLoadedNextTimeStamp: nextTimeStamp + 1
            })
          }
        }
        this.setData({
          MessageDetail:{
            data:this.data.MessageDetail.data.concat(res.data),
          }
        })
        console.log(this.data.messageNum, this.data.MessageDetail.data.length)
        if(this.data.messageNum != this.data.MessageDetail.data.length){
          this.setData({
            topValue: 100 * this.data.MessageDetail.data.length,
            messageNum:this.data.MessageDetail.data.length
          })
        }
      }
    })  
  }
})