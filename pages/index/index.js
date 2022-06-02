// index.js
Page({
  data: {
    //滑动幻灯片素材
    swiperImg: [
      {src: 'http://zd-wechat-1256005849.cos.ap-guangzhou.myqcloud.com/shop/51ecd120-eb1f-47b6-adc6-03c8505afedcB2.png'},
      {src: 'https://img.zcool.cn/community/0128cf56efbc5732f875a944e947a6.jpg?x-oss-process=image/auto-orient,1'},
      {src: 'https://img-qn-0.51miz.com/preview/muban/00/00/67/86/M-678623-5C6790F7.jpg!/quality/90/unsharp/true/compress/true/fh/400'}
    ],
    jobsList: [{

    }],
    jobsList2:[{

    }],
    mode:true //true是展示招聘信息,false时展示简历
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.app = getApp()
    console.log('当前用户地区',this.app.globalData.worker.yx_address)
    wx.cloud.database().collection('jobs')
      .where({
        region:this.app.globalData.worker.yx_address
      })
      .get()
      .then(res => {
        var len = res.data.length
        var half = Math.round(len/2)
        this.setData({
          jobsList: res.data.slice(0,half),
          jobsList2: res.data.slice(half,len)
        })
        console.log(res.data)
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
  changemode(e){
    console.log("改变模式",e.currentTarget.dataset.mode)
    var mode = e.currentTarget.dataset.mode
    if(mode=='boss'){
      this.setData({
        mode:true
      })
      this.app.sliderightshow(this, 'slide_up1', 0)
    }
    else{
      this.setData({
        mode:false
      })
      this.app.sliderightshow(this, 'slide_up1', -750)
    }
  },
  onShow:function(){
    console.log('当前用户地区',this.app.globalData.worker.yx_address)
    wx.cloud.database().collection('jobs')
      .where({
        region:this.app.globalData.worker.yx_address
      })
      .get()
      .then(res => {
        var len = res.data.length
        var half = Math.round(len/2)
        this.setData({
          jobsList: res.data.slice(0,half),
          jobsList2: res.data.slice(half,len)
        })
        console.log(res.data)
      })
      .catch(err => {
        console.log('请求失败',err)
      })
  }
})
