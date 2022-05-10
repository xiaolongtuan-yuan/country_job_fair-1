// index.js
Page({
  data: {
    //滑动幻灯片素材
    swiperImg: [
      {src: 'https://img-qn-4.51miz.com/preview/muban/00/00/78/71/M-787115-34711ABE.jpg!/quality/90/unsharp/true/compress/true/fh/400'},
      {src: 'https://img-qn-3.51miz.com/preview/element/00/01/20/65/E-1206525-53D99744.jpg!/quality/90/unsharp/true/compress/true/format/jpg/fh/320'},
      {src: 'https://img-qn-0.51miz.com/preview/muban/00/00/67/86/M-678623-5C6790F7.jpg!/quality/90/unsharp/true/compress/true/fh/400'}
    ],
    //临时招聘信息
    // jobsList:[{
    //   id: '264698',
    //   title: '北京邮电大学家里蹲食堂服务员',
    //   poster: 'https://p0.ssl.qhimgs1.com/sdr/400__/t01905178e193e4a73e.jpg',
    //   salary: '-1k',
    //   address: '北京邮电大学家里蹲分校',
    //   pnum: '0-999人'
    // }]
    jobsList: [{

    }]
  },
   /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.database().collection('jobs').get()
      .then(res => {
        this.setData({
          jobsList: res.data
        })
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
  }
})
