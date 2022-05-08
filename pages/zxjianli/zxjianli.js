// pages/zxjianli/zxjianli.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID:'',
    info:[],//[0]姓名[1]性别[2]年龄[3]教育水平[4]微信号[5]电话[6]工作经历[7]资格证书
  photoID:'',
    array:['无','小学','初中','高中','专科','本科','研究生','博士研究生'],
    index:1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.app = getApp()
    this.setData({
      openID:wx.getStorageSync('openID')
    })
  },
  sexChange(e){
    //console.log(e)
    var info = this.data.info
    info[1] = e.detail.value
    this.setData({
      info:info
    })
  },
  input_name(e){
    //console.log(e)
    var info = this.data.info
    info[0] = e.detail.value
    this.setData({
      info:info
    })
  },
  input_age(e){
    //console.log(Number(e.detail.value))
    var info = this.data.info
    info[2] = Number(e.detail.value)
    this.setData({
      info:info
    })
  },
  bindPickerChange(e){
    
    var info = this.data.info
    info[3] = this.data.array[e.detail.value]//存入index
    this.setData({
      info:info,
      index:e.detail.value
    })
    console.log(this.data.info)
  },
  input_wxid(e){
    //console.log(e)
    var info = this.data.info
    info[4] = e.detail.value
    this.setData({
      info:info
    })
  },
  input_tel(e){
    //console.log(e)
    var info = this.data.info
    info[5] = Number(e.detail.value)
    this.setData({
      info:info
    })
  },
  input_workexp(e){
    //console.log(e)
    var info = this.data.info
    info[6] = e.detail.value
    this.setData({
      info:info
    })
  },
  input_credential(e){
    //console.log(e)
    var info = this.data.info
    info[7] = e.detail.value
    this.setData({
      info:info
    })
  },
  photo_upload(){
    var path = this.data.info[0] + '.png'
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res =>{
        var tempFilePaths = res.tempFilePaths;
        wx.cloud.uploadFile({
          cloudPath: path,
          filePath: tempFilePaths[0],
          success:res2=>{
            //console.log(res2)
            this.setData({
              photoID:res2.fileID
            })
          },
          fail:console.error
        })
      }
    })
  },
  upload(){//上传数据库
    wx.showLoading({
      title: '上传中...',
    })
    db.collection('zxjianli')
    .add({
      data:{
        info:this.data.info,
        photo:this.data.photoID
      }
    })
    .then(
        wx.hideLoading(),
        wx.navigateBack()
    )
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
    this.app.slideupshow(this, 'slide_up1', -200, 1)

    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up3', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up4', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up5', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up6', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up7', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up8', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up9', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up10', -200, 1)
    }.bind(this), 200)
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