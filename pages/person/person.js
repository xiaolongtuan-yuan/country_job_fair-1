// pages/person/person.js
const db = wx.cloud.database()
const DB = wx.cloud.database().collection("users")
const app = getApp()
import { init_TIM,login_TIM,sendMessage_TIM,logout_TIM } from '../../utils/m_tim_init';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:app.globalData.user,
    openID:app.globalData.openID,
    isboss:app.globalData.isboss,
    worker:app.globalData.worker,
    region: ['四川省', '广元市', '旺苍县'],//意向工作地点
    multiArray: [['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k'], ['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k', '20k']],
    multiIndex: [0, 0],
    post_classify:app.globalData.post_classify,
    posts:app.globalData.post, //这是用于显示的所有职业列表
    post:[0,0],
    datas:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onLoad: function (options) {
    console.log("调用onload,user=",this.data.user)
    var openid = wx.getStorageSync('openID')
    console.log('person load')
    if(openid!=''){//缓存中有数据
      console.log("调用onload1")
      this.setData({//加载缓存并检查数据库中数据是否被删除
        user:wx.getStorageSync('user'),
        openID:openid,
        isboss:wx.getStorageSync('isboss')
      })
      app.globalData.user = wx.getStorageSync('user')
      app.globalData.openID = wx.getStorageSync('openID')
      app.globalData.isboss = wx.getStorageSync('isboss')
      console.log('打印globalData', app.globalData)
      wx.cloud.database().collection('users')
      .where({
        _openid:this.data.openID
      })
      .get()
      .then(res3=>{
        console.log('现有用户',res3.data.length)
        if(res3.data.length === 0){
          wx.cloud.database().collection('users')
          .add({
            data:{
            touxiang: this.data.user.avatarUrl,
            name: this.data.user.nickName,
            Friends:[],
            isboss: false
            }
          })
          .then( x=>{
            console.log('user添加成功',x)
          })
          wx.cloud.database().collection('worker')
          .add({
            data:{
            yx_address: this.data.region,
            yx_salary: this.data.multiIndex,
            datas:[0,0,0],
            yx_salary:[0,0]
            }
          })
          .then( x=>{
            console.log('worker添加成功',x)
          })
          app.globalData.Friends = res3.data[0].Friends

          console.log("everything init")
          console.log( res3.data[0], app.globalData.Friends)
          for(let i in app.globalData.Friends){
            let fri = app.globalData.Friends[i]
            let unread_t = {
              num:0,
              empty:true
            }
            if(!app.globalData.unread.hasOwnProperty(fri.id)){
              app.globalData.unread[fri.id] = unread_t
            }
            if(!app.globalData.MessageDetail.hasOwnProperty(fri.id)){
              app.globalData.MessageDetail[fri.id] = []
            }
            init_TIM()
            login_TIM(app.globalData.openID)
            //console.log('unread 1', app.globalData.unread)
            //console.log('next', fri, app.globalData.MessageDetail, app.globalData.MessageDetail[fri.id], app.globalData.MessageDetail[fri.id].length)
          }
        }
        else{
          app.globalData.Friends = res3.data[0].Friends
          console.log("everything init")
          console.log( res3.data[0], app.globalData.Friends)
          for(let i in app.globalData.Friends){
            let fri = app.globalData.Friends[i]
            let unread_t = {
              num:0,
              empty:true
            }
            if(!app.globalData.unread.hasOwnProperty(fri.id)){
              app.globalData.unread[fri.id] = unread_t
            }
            if(!app.globalData.MessageDetail.hasOwnProperty(fri.id)){
              app.globalData.MessageDetail[fri.id] = []
            }
            init_TIM()
            login_TIM(app.globalData.openID)
            //console.log('unread 1', app.globalData.unread)
            //console.log('next', fri, app.globalData.MessageDetail, app.globalData.MessageDetail[fri.id], app.globalData.MessageDetail[fri.id].length)
          }
          var that = this
          db.collection('worker')
          .where({
            _openid:this.data.openID
          })
          .get({
            success(res){
              if(res.data.length >0){
                console.log("测试",res.data)
                that.setData({
                  worker:res.data[0],
                  region:res.data[0].yx_address,
                  multiIndex:res.data[0].yx_salary,
                  datas: res.data[0].datas
                })
                app.globalData.worker = res.data[0]
                console.log("获取成功！",res.data)
              }
              else{
                console.log('添加worker')
                var worker = {
                  yx_address:['四川省','广元市','旺苍县'],//默认
                  yx_salary:[0,5],
                  yx_post:[0,0]
                }
                db.collection('worker')
                .add({
                  data:{
                    yx_address:['四川省','广元市','旺苍县'],//默认
                    yx_salary:[0,5],
                    yx_post:[0,0],
                    worker_favor:[0],
                    boss_favor:[0],
                    worker_sended:[0],

                  }
                })
                app.globalData.worker = worker
              }
            },
            fail(err){
              console.log("请求失败",err)
            }
          })
        }
      })
    }
    console.log("全局变量",app.globalData)
  },
  logup(options) {
    console.log("点击登录")
    wx.getUserProfile({
      desc: '登录后方可使用相关功能', 
      success: (res) => {
        console.log("点击登录")
        console.log(res)
        app.globalData.user = res.userInfo
        this.setData({
          user:res.userInfo,
          isboss:false
        })
        wx.cloud.callFunction({
          name:'getData'
        })
        .then(res2=>{
            console.log("请求云函数成功",res2)
            console.log(res2.result.openid)
            // this.setData({
            //   openID:res2.result.openid
            // })
            app.globalData.openID = res2.result.openid
            this.setData({
              openID:res2.result.openid
            })
            wx.setStorageSync('openID',res2.result.openid)
            console.log('缓存openID')

            wx.setStorageSync('user', res.userInfo)
            console.log('缓存user')
            wx.setStorageSync('isboss',false)
            wx.cloud.database().collection('users')
            .where({
              _openid:this.data.openID
            })
            .get()
            .then(res3=>{
              console.log('现有用户',res3.data.length)
              if(res3.data.length == 0){
                wx.cloud.database().collection('users')
                .add({
                  data:{
                    touxiang: res.userInfo.avatarUrl,
                    name: res.userInfo.nickName,
                    Friends:[],
                    isboss: false
                  }
                })
                .then( x=>{
                  console.log('user添加成功',x)
                })
                wx.cloud.database().collection('worker')
                .add({
                  data:{
                  yx_address: this.data.region,
                  yx_salary: this.data.multiIndex,
                  }
                })
                .then( x=>{
                  console.log('worker添加成功',x)
                })
              }      
              else{//user有数据，检查worker
                app.globalData.Friends = res3.data[0].Friends
                for(let i in app.globalData.Friends){
                  let fri = app.globalData.Friends[i]
                  let unread_t = {
                    num:0,
                    empty:true
                  }
                  if(!app.globalData.unread.hasOwnProperty(fri.id)){
                    app.globalData.unread[fri.id] = unread_t
                  }
                  if(!app.globalData.MessageDetail.hasOwnProperty(fri.id)){
                    app.globalData.MessageDetail[fri.id] = []
                  }
                  init_TIM()
                  login_TIM(app.globalData.openID)
                  //console.log('unread 1', app.globalData.unread)
                  //console.log('next', fri, app.globalData.MessageDetail, app.globalData.MessageDetail[fri.id], app.globalData.MessageDetail[fri.id].length)
                }
                console.log("init")
                console.log( res3.data[0], app.globalData.Friends)
                wx.cloud.database().collection('worker')
                .where({
                  _openid:this.data.openID
                })
                .get()
                .then(res4=>{
                  console.log('现有worker',res4.data.length)
                  if(res3.data.length == 0){
                    wx.cloud.database().collection('worker')
                    .add({
                      data:{
                      yx_address: this.data.region,
                      yx_salary: this.data.multiIndex,
                      }
                    })
                    .then( x=>{
                      console.log('worker添加成功',x)
                    })
                  }
                })
              }
            })
          })
      }
    })
  },
  guangguang(){
    wx.switchTab({
      url: '../index/index'
    })
  },
  tuichu(){
    wx.removeStorageSync('user')
    wx.removeStorageSync('isboss')
    wx.removeStorageSync('post')
    wx.removeStorageSync('TIM_1400680058_oF9n75GH6_sVt1B3y7kbKpXgtuhM_profile')
    wx.removeStorageSync('TIM_1400680058_oF9n75GH6_sVt1B3y7kbKpXgtuhM_conversationMap')
    wx.removeStorageSync('TIM_1400680058_oF9n75GH6_sVt1B3y7kbKpXgtuhM_groupMap')
    var that = this
    wx.removeStorage({
      key: 'openID',
      success (res) {
        app.globalData.isInit=false
        app.globalData.user=''
        app.globalData.openID=''
        app.globalData.Friends=[{
                                id:"",
                                lastread:0
                              }]
        app.globalData.MessageDetail=[]
        app.globalData.unread=[]
        app.globalData.isboss=false
        app.globalData.worker={
                                yx_address:['四川省','广元市','旺苍县'],//默认
                                yx_salary:[0,5],
                                datas:[0,0,0],
                                yx_post:[0,0]
                              }
        app.globalData.job_post=[0,0]
        that.setData({
          user:app.globalData.user,
          openID:app.globalData.openID,
          isboss:app.globalData.isboss,
          worker:app.globalData.worker,
          region: ['四川省', '广元市', '旺苍县'],//意向工作地点
          multiArray: [['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k'], ['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k', '20k']],
          multiIndex: [0, 0],
          post_classify:app.globalData.post_classify,
          posts:app.globalData.post,
          post:[0,0],
          datas:[]
        })
        wx.showToast({
          title:"退出成功"
        })
    
        that.onLoad()
      }
    })
    
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变,携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    app.globalData.worker.yx_address = e.detail.value
    this.setData({
      worker:app.globalData.worker
    })
    db.collection('worker')
    .where({
      _openid:this.data.openID
    })
    .update({
      data:{
        yx_address:e.detail.value
      }
    })
    // this.onLoad()
  },
  bindMultiPickerChange: function (e) {
    //console.log('picker发送选择改变,携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    app.globalData.worker.yx_salary = e.detail.value
    this.setData({
      worker:app.globalData.worker
    })
    db.collection('worker')
    .where({
      _openid:this.data.openID
    })
    .update({
      data:{
        yx_salary:e.detail.value
      }
    })
  },
  bindMultiPickerColumnChange: function(e){//第二位数字始终大于第一位
    //console.log('bindMultiPickerColumnChange携带参数',e.detail)
    var data = {
      Index:this.data.multiIndex
    }
    switch(e.detail.column){
      case 0:
        data.Index[1] = e.detail.value + 1
        data.Index[0] = e.detail.value
        this.setData({
          multiIndex : data.Index
        })
        break;
      case 1:
        if (e.detail.value <= data.Index[0]){
          data.Index[0] = e.detail.value -1
          data.Index[1] = e.detail.value
          this.setData({
            multiIndex : data.Index
          })
        }
    } 
  },
  yxpost(){
    wx.navigateTo({
      url: '../hangye/hangye?mode=1'
    })
  },
  set_post(){//意向岗位添加到数据库和全局变量中
    var post = wx.getStorageSync('post')
    
    this.setData({
      post:post
    })

    this.setData({
      worker:app.globalData.worker
    })
    db.collection('worker')
    .where({
      _openid:this.data.openID
    })
    .update({
      data:{
        yx_post:post
      }
    })
  },
  tojianli(){
    // console.log("跳转")
    wx.navigateTo({  
      url: '../zxjianli/zxjianli'
    })
  },
  tofalv(){
    wx.navigateTo({
      url: '../falv/falv'
    })
  },
  isboss(){
    if(!this.data.isboss){
      this.setData({
        isboss:true
      })
      app.globalData.isboss=true
      wx.setStorageSync('isboss',true)
      db.collection('users')
      .where({
        _openid:this.data.openID
      })
      .update({
        data:{
          isboss:true
        }
      })
    }
    else{
      this.setData({
        isboss:false
      })
      app.globalData.isboss=false
      wx.setStorageSync('isboss',false)
      db.collection('users')
      .where({
        _openid:this.data.openID
      })
      .update({
        data:{
          isboss:false
        }
      })
    }
  },
  findworker(){
    console.log("招员工")
    wx.navigateTo({
      url:'../boss/boss'
    })
  },
  goToworker_resume: function(options) {
    wx.navigateTo({
      url: '../worker_resume/worker_resume',
    })
  },
  goToworker_favorite: function(options) {
    wx.navigateTo({
      url: '../worker_favorite/worker_favorite',
    })
  },
  goToboss_favorite: function(options) {
    wx.navigateTo({
      url: '../boss_favorite/boss_favorite',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShow: function () {
    this.set_post()
    this.set_datas()
  },
  set_datas(){
    this.setData({
      datas:app.globalData.worker.datas
    })
  },
  newchat:function(e){
    if (app.globalData.openID.length === 0) {
      wx.showToast({
        title: '您未登录~',
        image: '/images/icons/error.png'
      })
    }else{
      var target = "oF9n75GH6_sVt1B3y7kbKpXgtuhM"
      console.log("b inse",target, "oF9n75GH6_sVt1B3y7kbKpXgtuhM")
      DB.where({
        _openid:target
      }).get({
        success:res=>{
          console.log("friends inse", res.data)
          if(res.data[0].Friends.length === 0){
            console.log("frid ")
            DB.doc(res.data[0]._id).update({
              data:{
                Friends:[{
                  id:app.globalData.openID,
                  lastread:0
                }]
              }
            })
          }else{
            console.log('add fri t')
            var chat = res.data[0].Friends.find((e)=>{return e.id == app.globalData.openID})
            console.log('chat', chat)
            if(chat == undefined){
              DB.doc(res.data[0]._id).update({
                data:{
                  Friends:res.data[0].Friends.concat({
                    id:app.globalData.openID,
                    lastread:0
                  })
                }
              })
            }
          }
        }
      })

      DB.where({
        _openid:app.globalData.openID
      }).get({
        success:res=>{
          if(res.data[0].Friends.length === 0){
            DB.doc(res.data[0]._id).update({
              data:{
                Friends:[{
                  id:target,
                  lastread:0
                }]
              }
            }).then(res=>{
              app.globalData.Friends.push({
                id:target,
                lastread:0
              })
            })
          }else{
            var chat = res.data[0].Friends.find((e)=>{return e.id == target})
            if(chat == undefined){
              DB.doc(res.data[0]._id).update({
                data:{
                  Friends:res.data[0].Friends.concat({
                    id:target,
                    lastread:0
                  })
                }
              }).then(res=>{
                app.globalData.Friends.push({
                  id:target,
                  lastread:0
                })
              })
            }
          }
        }
      })
      
      console.log("inse end", target)
      wx.navigateTo({
        url: "../messageDetail/messageDetail?target=" + target
      })  
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})