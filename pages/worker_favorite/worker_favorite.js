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
  onLoad(options) {
    this.setData({openID:wx.getStorageSync('openID')})
    var that = this
    db.collection('worker')
      .where({
        _openid: that.data.openID
      })
      .get({
        success(res) {
          that.setData({worker_favor: res.data[0].worker_favor})
        }
      })

    db.collection('jobs').get()
      .then(res => {
        var jobs = []
        let len = res.data.length
        let len_1 = that.data.worker_favor.length
        for(let i = 0; i < len; i++) {
          for(let j = 0; j < len_1; j++) {
            if(res.data[i]._id == that.data.worker_favor[j]) {
              jobs.push(res.data[i])
            }
          }
        }
        that.setData({jobs:jobs})

      })
      .catch(err => {
        console.log('请求失败',err)
      })
      
  },

  goToDetail: function(e) {
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id
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

  }
})