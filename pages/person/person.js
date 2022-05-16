// pages/person/person.js
const db = wx.cloud.database()
const app = getApp()
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
    posts:app.globalData.post,
    post:[0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var openid = wx.getStorageSync('openID')
    if(openid!=''){//缓存中有数据
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
            datas:this.data.worker.datas
            }
          })
          .then( x=>{
            console.log('worker添加成功',x)
          })
        }
        else{
          app.globalData.Friends = res3.data[0].Friends
          console.log("init")
          console.log( res3.data[0], app.globalData.Friends)
          var that = this
          db.collection('worker')
          .where({
            _openid:this.data.openID
          })
          .get({
            success(res){
              if(res.data.length >0){
                that.setData({
                  worker:res.data[0],
                  region:res.data[0].yx_address,
                  multiIndex:res.data[0].yx_salary
                })
                app.globalData.worker = res.data[0]
                console.log("获取成功！",res.data)
              }
              else{
                console.log('添加worker')
                var worker = {
                  yx_address:['四川省','广元市','旺苍县'],//默认
                  yx_salary:[0,5],
                  datas:[0,0,0],
                  yx_post:[0,0]
                }
                db.collection('worker')
                .add({
                  data:{
                    yx_address:['四川省','广元市','旺苍县'],//默认
                    yx_salary:[0,5],
                    datas:[0,0,0],
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
                  datas:this.data.worker.datas
                  }
                })
                .then( x=>{
                  console.log('worker添加成功',x)
                })
              }      
              else{//user有数据，检查worker
                app.globalData.Friends = res3.data[0].Friends
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
                      datas:this.data.worker.datas
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
    wx.showToast({
      title:"退出成功"
    })
    this.onLoad()
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
      url: '../hangye/hangye'
    })
  },
  set_post(){//意向岗位添加到数据库和全局变量中
    var post = wx.getStorageSync('post')
    
    this.setData({
      post:post
    })

    app.globalData.worker.yx_post = post
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.set_post()
    console.log("OnShow")
    app.slideupshow(this, 'slide_up1', -200, 1)

    setTimeout(function () {
      app.slideupshow(this, 'slide_up2', -200, 1)
      setTimeout(function () {
        app.slideupshow(this, 'slide_up3', -200, 1)
        setTimeout(function () {
          app.slideupshow(this, 'slide_up4', -200, 1)
          setTimeout(function () {
            app.slideupshow(this, 'slide_up5', -200, 1)
          }.bind(this), 200)
        }.bind(this), 100)
      }.bind(this), 60)
    }.bind(this), 20)
    
    
    
    
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