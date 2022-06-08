// pages/boss_Resume_detail/boss_Resume_detail.js
const db = wx.cloud.database()
const _ = db.command
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //[0]姓名[1]性别[2]年龄[3]教育水平[4]毕业院校[5]专业[6]特长[7]工作经历[8]资格证书
    array:['无','小学','初中','高中','专科','本科','研究生','博士研究生'],
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
    let res1 = await db.collection('wresume').where({
      resume_sendedId: that.data.jobsId
    }).get()
    console.log("1", res1.data)
    let resume = [];
    for (let i = 0; i < res1.data.length; i++) {
      let res2 = await db.collection('zxjianli').where({
        _openid: res1.data[i].openid
      }).get()
      resume.push(res2.data[0]);
    }
    that.setData({resume_received: resume});
    console.log("2", this.data.resume_received)
    

  },
  getResume: function(workerList) {
    var len = workerList.length;
    var result = [];
    for(let i = 0; i < len; i++) {
      if (workerList[i].worker_sended.indexOf(this.data.jobsId) != -1) {
            result.push(workerList[i]._openid);
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