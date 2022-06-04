// pages/boss_favorite/boss_favorite.js
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openID: '',
    boss_favor: [],
    resumes: [],
    //[0]姓名[1]性别[2]年龄[3]教育水平[4]毕业院校[5]专业[6]特长[7]工作经历[8]资格证书
    array:['无','小学','初中','高中','专科','本科','研究生','博士研究生'],


  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({openID:wx.getStorageSync('openID')})
    var that = this
    let res1 = await db.collection('worker').where({ _openid: that.data.openID}).get()
    that.setData({boss_favor: res1.data[0].boss_favor})
    console.log("1", that.data.boss_favor)

    let res2 = await db.collection('zxjianli').where({
      _id : _.in(that.data.boss_favor)
    }).get()
    console.log("2", res2.data)
    let len = res2.data.length
    let resumes = []
    for(let i = 0; i < len; i++) {
      resumes.push(res2.data[i])
    }
    that.setData({resumes:resumes})
    console.log("3", that.data.resumes)
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