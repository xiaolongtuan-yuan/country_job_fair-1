// pages/person/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'',
    openID:'',
    person_info:'小龙团',
    touxiang:'../../images/touxiang.jpg',
    region: ['广东省', '广州市', '海珠区'],//意向工作地点
    multiArray: [['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k'], ['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k', '20k']],
    multiIndex: [0, 0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      user:wx.getStorageSync('user'),
      openID:wx.getStorageSync('openID')
    })
  },
  logup(options) {
    console.log("点击登录")
    wx.getUserProfile({
      desc: '登录后方可使用相关功能', 
      success: (res) => {
        console.log("点击登录")
        console.log(res)
        this.setData({
          user:res.userInfo
        })
        wx.cloud.callFunction({
          name:'getData',
          success: res2=>{
            console.log("请求云函数成功",res2)
            console.log(res2.result.openid)
            this.setData({
              openID:res2.result.openid
            })
            wx.setStorageSync('openID',res2.result.openid)
        console.log('缓存openID')
          }
        })
        wx.setStorageSync('user', res.userInfo)
        console.log('缓存user')
      }
    })
  },

  bindRegionChange: function (e) {
    console.log('picker发送选择改变,携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    this.onLoad()
  },
  bindMultiPickerChange: function (e) {
    //console.log('picker发送选择改变,携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function(e){//第二位数字始终大于第一位
    //console.log('bindMultiPickerColumnChange携带参数',e.detail)
    var data = {
      Index:this.data.multiIndex
    }
    switch(e.detail.column){
      case 0:
        data.Index[1] = e.detail.value + 1
        data.Index[0] = e.detail.value
        this.setData({
          multiIndex : data.Index
        })
        break;
      case 1:
        if (e.detail.value <= data.Index[0]){
          data.Index[0] = e.detail.value -1
          data.Index[1] = e.detail.value
          this.setData({
            multiIndex : data.Index
          })
        }
    } 
  },
  tojianli(){
    // console.log("跳转")
    wx.navigateTo({  
      url: '../zxjianli/zxjianli'
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})