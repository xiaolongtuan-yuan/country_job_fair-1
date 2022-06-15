// pages/hangye/hangye.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    post_classify:app.globalData.post_classify,
    post:app.globalData.post,
    str:0,//当前选中的大分类
    choosed:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('传参',options)
    if(options.mode == '1'){
      this.mode = true  //true表示从person进入，false表示从boss进入
    }
    else{
      this.mode = false
    }
  },
  switch_classify(e){
    this.setData({
      str:e.target.dataset.index
    })
  },
  choosed(e){
    this.setData({
      choosed:e.target.dataset.index
    })
    console.log("选择了",this.data.post[this.data.str][this.data.choosed])
    this.back()
  },
  back(){
    var post=[this.data.str,this.data.choosed]
    console.log('选择结束',post)
    if(this.mode){
      wx.setStorageSync('post',post)
      app.globalData.worker.yx_post = post
    }
    else{
      app.globalData.job_post = post
    }
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

  }
})