// pages/detail/detail.js
const db = wx.cloud.database()
const DB = wx.cloud.database().collection("users")
const app = getApp()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // }],
    jobs: {

    },
    isAdd: false,
    re_isAdd: false,
    openID: app.globalData.openID,
    recorderID:'',
    favor_id:"",
    resume_id:"",
    posts:app.globalData.post,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({
      posts:app.globalData.post
    })
    var that = this
    let res1 = await db.collection('jobs').where({
      _id: _.eq(options.id)
    }).get()
    that.setData({
      jobs: res1.data[0],
      recorderID:res1.data[0].recorder
    })
    console.log("1",that.data.jobs)
    this.setData({openID:wx.getStorageSync('openID')})
    console.log("2",this.data.openID)
    let res2 = await db.collection('wfavorite').where({
      openid:that.data.openID,
      favor_jobsId: options.id
    }).get()
    console.log("3",res2.data)
    if (res2.data.length != 0) {
      that.setData({isAdd:true})
      console.log("11", res2.data[0]._id)
      that.setData({favor_id:res2.data[0]._id})
    }
    console.log("11",that.data.favor_id)
    
    let res3 = await db.collection('wresume').where({
      openid:that.data.openID,
      resume_sendedId: options.id
    }).get()
    if (res3.data.length != 0) {
      that.setData({re_isAdd:true})
      console.log("22", res3.data[0]._id)
      that.setData({resume_id:res3.data[0]._id})
    }
    console.log("22",that.data.resume_id)
  },
  //添加到收藏夹
  addFavorites: function(options) {
    if (app.globalData.openID.length === 0) {
      wx.showToast({
        title: '您未登录~',
        image: '/images/icons/error.png'
      })
    }else{
      this.setData({ isAdd: true });
      var that = this
      db.collection('wfavorite')
      .add({
        data: {
          openid: that.data.openID,
          favor_jobsId: that.data.jobs._id
        }
      })
      .then(res => {
        app.globalData.worker.datas[1]++
        db.collection('worker')
        .where({
          _openid:app.globalData.openID
        })
        .update({
          data:{
            datas:app.globalData.worker.datas
          }
        })
        .then(res2=>{
          console.log('收藏成功')
        })
      })
      .catch(res =>{
        console.log('添加失败', res)
      })
    }
},
playClick() {
  console.log("开始播放",this.data.recorderID)
  var audio = wx.createInnerAudioContext();
  audio.src = this.data.recorderID;
  audio.autoplay = true;
},
  //取消收藏
  cancelFavorites: function(options) {
    this.setData({ isAdd: false });
    var that = this
    db.collection('wfavorite')
      .doc(that.data.favor_id)
      .remove()
      .then(res => {
        app.globalData.worker.datas[1]--
        db.collection('worker')
        .where({
          _openid:app.globalData.openID
        })
        .update({
          data:{
            datas:app.globalData.worker.datas
          }
        })
        .then(res2=>{
          console.log('取消收藏成功')
        })
      })
      .catch(res =>{
        console.log('删除失败', res)
      })
  },
  
  sendResume: function(options) {
    this.setData({ re_isAdd: true });
      var that = this
      db.collection('wresume')
      .add({
        data: {
          openid: that.data.openID,
          resume_sendedId: that.data.jobs._id
        }
      })
      .then(res => {
        app.globalData.worker.datas[0]++
        db.collection('worker')
        .where({
          _openid:app.globalData.openID
        })
        .update({
          data:{
            datas:app.globalData.worker.datas
          }
        })
        .then(res2=>{
          console.log('投递成功')
        })
      })
      .catch(res =>{
        console.log('添加失败', res)
      })

  },

  deleteSendResume: function(options) {
    this.setData({ re_isAdd: false });
    var that = this
    db.collection('wresume')
      .doc(that.data.resume_id)
      .remove()
      .then(res => {
        app.globalData.worker.datas[0]--
        db.collection('worker')
        .where({
          _openid:app.globalData.openID
        })
        .update({
          data:{
            datas:app.globalData.worker.datas
          }
        })
        .then(res2=>{
          console.log('取消投递成功')
        })
      })
      .catch(res =>{
        console.log('删除失败', res)
    })
  },
  
  back(){
    wx.navigateBack()
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

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
   * 
   * 导航到招聘对应的聊天
   */
  newchat:function(e){
    if (app.globalData.openID.length === 0) {
      wx.showToast({
        title: '您未登录~',
        image: '/images/icons/error.png'
      })
    }else{
      var target = this.data.jobs._openid
      console.log("b inse",target, this.data.jobs._openid)
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
            var chat = res.data[0].Friends.find((e)=>{return e.id == app.globalData.openID})
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
  }
})