// pages/boss_Resume_detail_In/boss_Resume_detail_In.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    worker_OpId: '',
    worker_detail: [],
    isAdd: false,
    boss_favor: [],
    openID: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({openID:wx.getStorageSync('openID')})
    let id = options.id
    console.log(id)
    this.setData({worker_OpId:id})
    var that = this
    db.collection('zxjianli')
      .where({
        _openid: that.data.worker_OpId
      })
      .get({
        success(res) {
          that.setData({worker_detail: res.data})
        }
      })
    db.collection('worker')
      .where({
        _openid: that.data.openID
      })
      .get({
        success(res) {
          console.log('res.data',res.data)
          var len = res.data[0].boss_favor.length
          for(let i = 0; i < len; i++) {
            if(res.data[0].boss_favor[i] == that.data.worker_OpId){
              that.setData({isAdd: true})
            }
          }

        },
        fail(err){
          console.log("请求失败",err)
        },
      })

  },
  //添加到收藏夹
  addFavorites: function(options) {
    this.data.boss_favor.push(this.data.worker_OpId);
    this.setData({boss_favor:this.data.boss_favor}); 
    this.setData({ isAdd: true });
    var that = this
    db.collection('worker')
      .where({
        _openid:this.data.openID
      })
      .update({
        data: {
          boss_favor: that.data.boss_favor
        }
      })
      .then(res => {
        console.log('修改成功', res)
      })
      .catch(res =>{
        console.log('修改失败', res)
      })
},
  //取消收藏
  cancelFavorites: function(options) {
    this.data.boss_favor.pop();
    // console.log(this.data.worker_favor)
    this.setData({ isAdd: false });
    var that = this
    db.collection('worker')
      .where({
        _openid:this.data.openID
      })
      .update({
        data: {
          boss_favor: that.data.boss_favor
        }
      })
      .then(res => {
        console.log('修改成功', res)
      })
      .catch(res =>{
        console.log('修改失败', res)
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