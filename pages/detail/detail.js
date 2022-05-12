// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // jobsList: [{

    // }],
    jobs: {

    },
    // isAdd: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.database().collection('jobs').get()
      .then(res => {
        // this.setData({
        //   jobsList: res.data
        // })
        let id=options.id
        let result=this.getDetail(id,res.data)
        if(result.code='200'){
          this.setData({jobs:result.jobs})
        }
        // console.log(this.data)
      })
      .catch(err => {
        console.log('请求失败',err)
      })  
    // let id=options.id;
    // let result=this.getDetail(id)
    // //获取到内容
    // if(result.code='200'){
    //   this.setData({infomation:result.jobs})
    // }
    
    // 收藏按钮
    let id = options.id;
    var article = wx.getStorageSync(id);
    //已存在
    if (article!='') {
      this.setData({ isAdd: true })
    }
    //不存在
    else {
      this.setData({ isAdd: false })
    }
  },
  //获取详情信息
  getDetail: function(job_id, jobsList) {
    console.log(jobsList)
    let msg={
      code: '404',
      jobs: {}
    };
    for (var i=0; i<jobsList.length; i++) {
      if (job_id==jobsList[i]._id) {
        msg.code='200';
        msg.jobs=jobsList[i];
        break;
      }
    }
    return msg;
  },

  //添加到收藏夹
  addFavorites: function(options) {
    let article = this.data.jobs;
    wx.setStorageSync(article._id, article);
    this.setData({ isAdd: true });
  },
  //取消收藏
  cancelFavorites: function(options) {
    let article = this.data.jobs;
    wx.removeStorageSync(article._id);
    this.setData({ isAdd: false });
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