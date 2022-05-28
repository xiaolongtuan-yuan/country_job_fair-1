// pages/worker_resume/worker_resume.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isboss: false,
    worker_resume: [],
    jobs: {},
    openID:app.globalData.openID,
    jobs_had: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({isboss:wx.getStorageSync('isboss')})
    this.setData({openID:wx.getStorageSync('openID')})
    // this.setData({openID:app.globalData.openID})
    var that = this  
    let res1 = await db.collection('worker').where({_openid: that.data.openID}).get()
    if(res1.data.length >0){
      let worker_sended = res1.data[0].worker_sended
      if(!that.data.isboss){
        that.setData({worker_resume: worker_sended})
      }
    }
    console.log("1", that.data.worker_resume)


    let res2 = await db.collection('jobs').get()
    console.log("2", res2.data)
    let result = that.getjobs(that.data.worker_resume, res2.data)
    that.setData({jobs:result})
    console.log("3", that.data.jobs)

    let result_boss = that.getjobs_had(res2.data)
    that.setData({jobs_had: result_boss})
    console.log("4", that.data.jobs_had)
  },

  getjobs: function(jobsId, jobsList) {
    var len = jobsId.length;
    var size = jobsList.length;
    let jobs = [];
    for(let i = 0; i < len; i++) {
      for(let j = 0; j < size; j++) {
        if(jobsId[i] == jobsList[j]._id) {
          jobs.push(jobsList[j])
        }
      }
    }
    return jobs;
  },
  getjobs_had: function(jobsList) {
    let len = jobsList.length;
    let jobs_had = [];
    for(let i = 0; i < len; i++) {
      if(jobsList[i]._openid == this.data.openID) {
        jobs_had.push(jobsList[i]);
      }
    }
    return jobs_had;
  },
  boss_goToResume: function(e) {
    let id=e.currentTarget.dataset.id;
    console.log('ID',e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../boss_Resume_detail/boss_Resume_detail?id='+id
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