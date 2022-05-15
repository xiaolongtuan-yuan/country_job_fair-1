// pages/detail/detail.js
const db = wx.cloud.database()
const DB = wx.cloud.database().collection("users")
const app = getApp()
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
    worker_favor: [],
    worker_sended: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({openID:app.globalData.openID})
    // console.log(this.data.openID)
    var that = this
    wx.cloud.database().collection('jobs').get()
      .then(res => {
        let id=options.id
        let result=that.getDetail(id,res.data)
        if(result.code='200'){
          that.setData({jobs:result.jobs})
        }
      })
      .catch(err => {
        console.log('请求失败',err)
      })  
    this.setData({openID:wx.getStorageSync('openID')})
    console.log(this.data.openID)
    db.collection('worker')
    .where({
      _openid:that.data.openID
    })
    .get({
      success(res){
        console.log("获取成功！",res.data)
        // console.log(res.data)
        if(res.data.length >0){
          var favor = res.data[0].worker_favor
          console.log(favor)
          let resume = res.data[0].worker_sended
          // console.log('111',favor)
          // console.log(favor)
          let len = favor.length
          let re_len = resume.length
          // console.log(len)
          // console.log(that.data.jobs)
          for(let i = 0; i < len; i++) {
            if(favor[i] == that.data.jobs._id) {
              that.setData({isAdd:true})
            }
          }
          that.setData({
            worker_favor: favor,
          })
          for(let i = 0; i < re_len; i++) {
            if(resume[i] == that.data.jobs._id) {
              that.setData({re_isAdd:true})
            }
          }
          that.setData({
            worker_sended: resume,
          })
          // console.log(111,that.data.worker_favor)
        }
      },
      fail(err){
        console.log("请求失败",err)
      },
    })


  },
  //获取详情信息
  getDetail: function(job_id, jobsList) {
    console.log(jobsList)
    let msg={
      code: '404',
      jobs: {}
    };
    for (var i=0; i<jobsList.length; i++) {
      if (job_id==jobsList[i]._id) {
        msg.code='200';
        msg.jobs=jobsList[i];
        break;
      }
    }
    return msg;
  },

  //添加到收藏夹
  addFavorites: function(options) {
    if (app.globalData.openID.length === 0) {
      wx.showToast({
        title: '您未登录~',
        image: '/images/icons/error.png'
      })
    }else{
      console.log(this.data.worker_favor)
      this.data.worker_favor.push(this.data.jobs._id);
      console.log(this.data.worker_favor)
      // console.log(favor);  
      this.setData({worker_favor:this.data.worker_favor}); 
      this.setData({ isAdd: true });
      var that = this
      db.collection('worker')
      .where({
        _openid:this.data.openID
      })
      .update({
        data: {
          worker_favor: that.data.worker_favor
        }
      })
      .then(res => {
        console.log('修改成功', res)
      })
      .catch(res =>{
        console.log('修改失败', res)
      })
    }
},
  //取消收藏
  cancelFavorites: function(options) {
    this.data.worker_favor.pop();
    // console.log(this.data.worker_favor)
    this.setData({ isAdd: false });
    var that = this
    db.collection('worker')
      .where({
        _openid:this.data.openID
      })
      .update({
        data: {
          worker_favor: that.data.worker_favor
        }
      })
      .then(res => {
        console.log('修改成功', res)
      })
      .catch(res =>{
        console.log('修改失败', res)
      })
  },
  
  sendResume: function(options) {
    this.data.worker_sended.push(this.data.jobs._id);
    this.setData({re_isAdd: true});
    var that = this;
    db.collection('worker')
      .where({
        _openid: that.data.openID
      })
      .update({
        data: {
          worker_sended: that.data.worker_sended
        }
      })
      .then(res =>{
        console.log("修改成功", res)
      })
      .catch(res =>{
        console.log("修改失败", res)
      })

  },

  deleteSendResume: function(options) {
    console.log(this.data.worker_sended);
    this.data.worker_sended.pop();
    console.log(this.data.worker_sended);
    this.setData({re_isAdd: false});
    var that = this;
    db.collection('worker')
      .where({
        _openid: that.data.openID
      })
      .update({
        data: {
          worker_sended: that.data.worker_sended
        }
      })
      .then(res =>{
        console.log("修改成功", res)
      })
      .catch(res =>{
        console.log("修改失败", res)
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
            if(chat.length === 0){
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
            if(chat.length === 0){
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