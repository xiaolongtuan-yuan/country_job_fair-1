// pages/boss_Resume_detail/boss_Resume_detail.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jobsId: '',
    openID: '',
    resume_received: [],
    resume: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  async onLoad(options) {

    this.setData({jobsId: options.id})
    this.setData({openID: wx.getStorageSync('openID')})
    var that = this
    let res1 = await db.collection('zxjianli').get();
    that.setData({resume: res1.data})

    let res2 = await db.collection('worker').get();
    console.log('这里',res2.data);
    let result = that.getResume(res2.data);
    that.setData({resume_received: result});
    console.log('在这里',result);

  },
  getResume: function(workerList) {
    var len = workerList.length;
    var result = [];
    console.log(this.data.jobsId, this.data.resume);
    for(let i = 0; i < len; i++) {
      let len_1 = workerList[i].worker_sended.length;
      for (let j = 0; j < len_1; j++) {
        if (workerList[i].worker_sended[j] == this.data.jobsId) {
          let len_2 = this.data.resume.length;
          for (let k = 0; k < len_2; k++) {
            if (workerList[i]._openid == this.data.resume[k]._openid) {
              result.push(this.data.resume[k]);
            }
          }
        }
      }
    }
    return result;
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