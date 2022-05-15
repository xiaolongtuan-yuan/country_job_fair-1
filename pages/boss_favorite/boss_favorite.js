// pages/boss_favorite/boss_favorite.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID: '',
    boss_favor: [],
    resumes: [],


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
          that.setData({boss_favor: res.data[0].boss_favor})
        }
      })

    db.collection('zxjianli').get()
      .then(res => {
        console.log(res.data)
        var resumes = []
        let len = res.data.length
        let len_1 = that.data.boss_favor.length
        for(let i = 0; i < len; i++) {
          for(let j = 0; j < len_1; j++) {
            if(res.data[i]._openid == that.data.boss_favor[j]) {
              resumes.push(res.data[i])
            }
          }
        }
        that.setData({resumes:resumes})
        console.log(that.data.resumes)

      })
      .catch(err => {
        console.log('请求失败',err)
      })
  },
  goToDetail: function(e) {
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../boss_Resume_detail_In/boss_Resume_detail_In?id='+id
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