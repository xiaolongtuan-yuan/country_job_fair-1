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
    worker_favor: [],
    worker_sended: [],
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that = this
    let res1 = await db.collection('jobs').where({
      _id: _.eq(options.id)
    }).get()
    that.setData({jobs: res1.data[0]})
    console.log("1",that.data.jobs)
    this.setData({openID:wx.getStorageSync('openID')})
    console.log("2",this.data.openID)
    let res2 = await db.collection('worker').where({_openid:that.data.openID}).get()
    console.log("3",res2.data)
    if(res2.data.length >0){
      var favor = res2.data[0].worker_favor
      let resume = res2.data[0].worker_sended
      console.log("4", resume)
      if(favor.indexOf(that.data.jobs._id) != -1) {
        that.setData({isAdd:true})
      }
      that.setData({
        worker_favor: favor,
      })

      if(resume.indexOf(that.data.jobs._id) != -1) {
        that.setData({re_isAdd:true})
      }
      that.setData({
        worker_sended: resume,
      })
    }


  },
  // 索引
  indexof: function(arr, val)  {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        return i;
      }
    }
  },
  //添加到收藏夹
  addFavorites: function(options) {
    if (app.globalData.openID.length === 0) {
      wx.showToast({
        title: '您未登录~',
        image: '/images/icons/error.png'
      })
    }else{
      console.log("4",this.data.worker_favor)
      if (this.data.worker_sended.indexOf(this.data.jobs._id) == -1) {
        this.data.worker_favor.push(this.data.jobs._id);
      }
      console.log("5",this.data.worker_favor)
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
    console.log("6",this.data.worker_favor);
    let index = this.indexof(this.data.worker_favor,this.data.jobs._id);
    this.data.worker_favor.splice(index, 1);
    console.log("7",this.data.worker_favor);
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
    console.log("8",this.data.worker_sended);
    let index = this.indexof(this.data.worker_sended, this.data.jobs._id);
    this.data.worker_sended.splice(index,1);
    console.log("9",this.data.worker_sended);
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