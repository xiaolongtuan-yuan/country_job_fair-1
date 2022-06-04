// index.js
const db = wx.cloud.database()
const _ = db.command
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
    jianli: [],
    resumeList: [], // 最终的简历列表
    isboss:false,
    //[0]姓名[1]性别[2]年龄[3]教育水平[4]毕业院校[5]专业[6]特长[7]工作经历[8]资格证书
    array:['无','小学','初中','高中','专科','本科','研究生','博士研究生'],
    mode:true //true是展示招聘信息,false时展示简历
  },
   /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({isboss:wx.getStorageSync('isboss')})
    this.app = getApp()
    console.log('当前用户地区',this.app.globalData.worker.yx_address)
    let res1 = await wx.cloud.database().collection('jobs').where({region:this.app.globalData.worker.yx_address}).get()
    var len = res1.data.length
    var half = Math.round(len/2)
    this.setData({
      jobsList: res1.data.slice(0,half),
      jobsList2: res1.data.slice(half,len)
    })
    console.log(res1.data)

    // 简历筛选
    var that = this
    let res2 = await db.collection('worker').where({
      yx_address: that.app.globalData.worker.yx_address,
      _openid: _.not(_.eq(that.app.globalData.openID))
    }).get()
    console.log("1", res2.data)
    for (let i = 0; i < res2.data.length; i++) {
      that.data.jianli.push(res2.data[i]._openid)
    }
    console.log("3", that.data.jianli)
    that.setData({jianli:that.data.jianli})

    let res3 = await db.collection('zxjianli').where({
      _openid: _.in(that.data.jianli)
    }).get()
    let zxjianli = res3.data
    console.log("4", zxjianli)
    for(let i = 0; i < zxjianli.length; i++) {
        that.data.resumeList.push(zxjianli[i])
    }
    that.setData({resumeList: that.data.resumeList})
    console.log("5", that.data.resumeList)
      
  },
  goToDetail: function(e) {
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id
    })
  },
  goToResume: function(e) {
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../boss_Resume_detail_In/boss_Resume_detail_In?id='+id
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
