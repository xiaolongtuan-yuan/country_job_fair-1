// pages/worker_favorite/worker_favorite.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    worker_favor: [],
    openID: '',
    jobs: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({openID:wx.getStorageSync('openID')})
    var that = this
    console.log("0", that.data.openID)
    let res1 = await db.collection('wfavorite').where({openid: that.data.openID}).get()
    let favor = [];
    for (let i = 0; i < res1.data.length; i++) {
      favor.push(res1.data[i].favor_jobsId);
    }
    this.unique(favor) // 以防万一
    that.setData({worker_favor: favor})
    console.log("1", that.data.worker_favor)
    
    let res2 = await db.collection('jobs').where({
      _id : _.in(that.data.worker_favor)
    }).get()
    console.log("2", res2.data)
    var jobs = []
    let len = res2.data.length
    for(let i = 0; i < len; i++) {
      jobs.push(res2.data[i])
    }
    that.setData({jobs:this.unique(jobs)})
    console.log("3", that.data.jobs)
  },
  // 数组去重函数
  unique: function(arr) {
    return Array.from(new Set(arr))
  },

  goToDetail: function(e) {
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id
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

  }
})