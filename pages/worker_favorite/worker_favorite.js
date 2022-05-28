// pages/worker_favorite/worker_favorite.js
const db = wx.cloud.database()
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
    let res1 = await db.collection('worker').where({_openid: that.data.openID}).get()
    that.setData({worker_favor: res1.data[0].worker_favor})
    console.log("1", that.data.worker_favor)
    
    let res2 = await db.collection('jobs').get()
    console.log("2", res2.data)
    var jobs = []
    let len = res2.data.length
    let len_1 = that.data.worker_favor.length
    for(let i = 0; i < len; i++) {
      for(let j = 0; j < len_1; j++) {
        if(res2.data[i]._id == that.data.worker_favor[j]) {
          jobs.push(res2.data[i])
        }
      }
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