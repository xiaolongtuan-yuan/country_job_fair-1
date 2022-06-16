// pages/messageDetail/messageDetail.js
const app = getApp()
import TIM from '../../utils/tim-wx-sdk/tim-wx';
import { genTestUserSig } from '../../utils/GenerateTestUserSig'
const DB = wx.cloud.database().collection("messagelist")
const DBU = wx.cloud.database().collection("users")
import { init_TIM,login_TIM,sendMessage_TIM,logout_TIM } from '../../utils/m_tim_init';
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
    firstLoaded:false,
    refreshing:false
  },

  /**
   * 信息发布时间比较
   */
  compare_msg:function (x, y) {
    if(x.time < y.time){
      return -1
    }else if(x.time > y.time){
      return 1
    }else {
      return 0
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    init_TIM()
    login_TIM(app.globalData.openID)
      //console.log("chat id", options.target)
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
          let timeStamp = Date.parse(new Date()) / 1000;
          this.setData({
            myself:{
              openid:app.globalData.openID,
              userInfo:app.globalData.user
            },
            lastLoadedBeforeTimeStamp:timeStamp,
            lastLoadedNextTimeStamp:timeStamp
          })
          console.log('msgd init', this.data.myself)
          console.log(app.globalData.MessageDetail[this.data.targetUser.openid])
          if(app.globalData.MessageDetail[this.data.targetUser.openid].length != 0){
            //let len = app.globalData.MessageDetail[this.data.targetUser.openid].length
            this.setData({
              lastLoadedBeforeTimeStamp:app.globalData.MessageDetail[this.data.targetUser.openid][0].time - 1
            })
            this.setData({
              MessageDetail:{
                data:app.globalData.MessageDetail[this.data.targetUser.openid]
              }
            })
          }else{
            this.loadMessageBefore()
          }
          //clearInterval(this.data.intervalId)
          //this.setData({
            //intervalId:setInterval(this.loadMessageNext, 2500),
           // topValue: this.data.MessageDetail.data.length * 100,
          //})
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
      intervalId:setInterval(this.loadMessageNext, 2500)
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
      /*
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
      }*/
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
        app.globalData.Friends[j].lastread = this.data.MessageDetail.data[last - 1].time + 1
        console.log("f det",app.globalData.Friends[j])
        DBU.where({
          _openid:app.globalData.openID
        }).update({
          data:{
            Friends:app.globalData.Friends
          }
        })
        break;
      }
    }
    console.log('clr unread', app.globalData.unread[this.data.targetUser.openid])
    app.globalData.unread[this.data.targetUser.openid] = 0
    //app.globalData.unread[this.data.targetUser.openid].empty = true
    // app.globalData.MessageDetail[this.data.targetUser.openid] = []
    clearInterval(this.data.intervalId)
    wx.navigateBack()
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
    // console.log("yes", this.data.replyContent);
  },

  back(){
    wx.navigateBack()
  },
  /**
   * 发送消息
   */
  submitRely: function (e) {
    sendMessage_TIM(this.data.targetUser.openid, this.data.replyContent)
    this.loadMessageNext()
    this.setData({
      replyContent:""
    })
    /*
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
    */
  },

  /**
   * 获取消息
   */
  onMsgRefresh:function(e){
    this.setData({
      refreshing:true
    })
    let beforeTimeStamp = this.data.lastLoadedBeforeTimeStamp;
    console.log(beforeTimeStamp)
    const _ = wx.cloud.database().command
    DB.orderBy('message.time','desc').where(_.or([
      {
        'message.time':_.lte(beforeTimeStamp),
        'message.from':this.data.myself.openid,
        'message.to':this.data.targetUser.openid
      },
      {
        'message.time':_.lte(beforeTimeStamp),
        'message.from':this.data.targetUser.openid,
        'message.to':this.data.myself.openid
      }
    ])).get({
      success: res=>{
        //res.data.sort(this.compare_msg)
        //res.data = res.data.reverse()
        let new_msg = []
        if(res.data.length != 0){
          for(let i in res.data){

            new_msg.push(res.data[i].message)
            // console.log("here last",res.data[i].message.from)
            if(res.data[i].message.time < this.data.lastLoadedBeforeTimeStamp){
              this.setData({
                lastLoadedBeforeTimeStamp: res.data[i].message.time - 1
              })
              console.log(res.data[i].message.time, this.data.lastLoadedBeforeTimeStamp)
            }
          }
          new_msg.reverse()
        }
        app.globalData.MessageDetail[this.data.targetUser.openid] = new_msg.concat(app.globalData.MessageDetail[this.data.targetUser.openid])
        this.setData({
          MessageDetail:{
            data:new_msg.concat(this.data.MessageDetail.data)
          },
          refreshing:false
        })
      },
      fail:res=>{
        console.log("fail")
      }
    })
  },

  loadMessageBefore: function (e) {
    
    let beforeTimeStamp = this.data.lastLoadedBeforeTimeStamp;
    // console.log(beforeTimeStamp)
    const _ = wx.cloud.database().command
    DB.orderBy('message.time','desc').where(_.or([
      {
        'message.time':_.lte(beforeTimeStamp),
        'message.from':this.data.myself.openid,
        'message.to':this.data.targetUser.openid
      },
      {
        'message.time':_.lte(beforeTimeStamp),
        'message.from':this.data.targetUser.openid,
        'message.to':this.data.myself.openid
      }
    ])).get({
      success: res=>{
        //res.data.sort(this.compare_msg)
        res.data = res.data.reverse()
        let new_msg = []
        if(res.data.length != 0){
          for(let i in res.data){
            new_msg.push(res.data[i].message)
            // console.log("here last",res.data[i].message.from)
            if(res.data[i].message.time < this.data.lastLoadedBeforeTimeStamp){
              this.setData({
                lastLoadedBeforeTimeStamp: res.data[i].message.time - 1
              })
              //console.log(res.data[i].message.time, this.data.lastLoadedBeforeTimeStamp)
            }
          }
        }
        console.log('load msg to app')
        app.globalData.MessageDetail[this.data.targetUser.openid] = new_msg.concat(app.globalData.MessageDetail[this.data.targetUser.openid])
        console.log(app.globalData.MessageDetail[this.data.targetUser.openid])
        this.loadMessageNext()
        /*
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
        }*/
      },
      fail:res=>{
        console.log("fail")
      }
    })
  },

  loadMessageNext:function (e) {
    let length = this.data.messageNum
    this.setData({
      MessageDetail:{
        data:app.globalData.MessageDetail[this.data.targetUser.openid]
      }
    })
    if(length != this.data.MessageDetail.data.length){
      this.setData({
        topValue: 100 * this.data.MessageDetail.data.length,
        messageNum:this.data.MessageDetail.data.length
      })
    }
    /*
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
    })  */
  },
})