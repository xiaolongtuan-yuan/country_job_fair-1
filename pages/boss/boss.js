// pages/boss/boss.js
const height = wx.getSystemInfoSync().windowHeight//系统高度
const width = wx.getSystemInfoSync().windowWidth//系统宽度
const rpx = width / 750 //rpx转px系数

Page({

  data: {
    infoList:[],//自动添加的输入框列表
    region: ['四川省', '广元市', '旺苍县'],
    multiArray: [['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k'], ['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k', '20k']],
    multiIndex: [0, 0],//工资索引
    job_name:'',//工作名字
    intro:'',//岗位介绍
    address:'',//详细地址
    orthers:[],//‘其他’信息
    Index:0,//用来处理自行添加的输入框的输入问题
    company:'',//公司名称
    animationData:[],//自行添加行动画
    // canvasW: width * 0.8, //画布宽度
    canvasType: false,//是否出现海报bool
    ctx:'',//画布上下文
    src:'',//海报背景图片
    id:''
  },


  onLoad: function (options) {
    this.app = getApp()
  },
  add_input(){
    console.log("添加输入行")
    var a=this.data.infoList
    a.push('请输入信息')
    this.setData({
      infoList:a
    })
    this.set_animations()
  },
  set_animations(){
    var index = this.data.infoList.length
    var animation = wx.createAnimation({
      //持续时间800ms
      delay:200,
      duration: 800,
      timingFunction: 'ease',
    })
    //var animation = this.animation
    this.animationData = animation
    this.animationData.opacity(1).step()
    var ani = this.data.animationData
    ani[this.data.infoList.length-1] = this.animationData.export()
    this.setData({
      animationData:ani
    })
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变,携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
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
  input_job_name(e){
    this.setData({
      job_name:e.detail.value
    })
  },
  input_intro(e){
    this.setData({
      intro:e.detail.value
    })
  },
  input_address(e){
    this.setData({
      address:e.detail.value
    })
  },
  input_orders(e){
    this.setData({
      Index:e.target.dataset.index-1
    })
    console.log(this.data.Index)
    var array = this.data.orthers
    array[this.data.Index]=e.detail.value
    this.setData({
      orthers:array
    })
  },
  input_company(e){
    this.setData({
      company:e.detail.value
    })
  },
  upload(){
    wx.showLoading({
      title: '上传招聘中...',
    })
    wx.cloud.database().collection('jobs')
    .add({
      data:{
        salary:this.data.multiIndex,
        region:this.data.region,
        job_name:this.data.job_name,
        company:this.data.company,
        introduction:this.data.intro,
        address:this.data.address,
        orthers:this.data.orthers
      }
    })
    .then(res=>{
      console.log('招聘发布成功',res)
      wx.hideLoading()
      this.setData({
        id:res._id
      })
      this.drawCanvas2D()
    })
  },

  cancelPoster() {
    this.setData({
      canvasType: false
    })
  },//退出海报

  drawCanvas2D() {
    this.setData({
      canvasType:true
    })

    const query = wx.createSelectorQuery();
    query
    .select('#myCanvas')
    .fields({ node: true, size: true })
    .exec(async (res) => {
      // console.log(33, res);
      const canvas = res[0].node;
      this.canvas = canvas;
      let ctx = canvas.getContext('2d');

      // 设置整个画布dpr
      const height = 1000 * rpx;
      const dpr = wx.getSystemInfoSync().pixelRatio;
      canvas.width = res[0].width * dpr;
      canvas.height = res[0].height * dpr;
      ctx.scale(dpr, dpr);
      // console.log(1111, canvas.width, canvas.height, dpr);

      // 设置整个画布背景色和宽高
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      await this.photo()
      var src = this.data.src

      await this.getQrCode()

      await this.drawImageByLoad(canvas, ctx, src, 0, 0, 550/rpx);
      
      ctx.fillStyle = '#fff';
      this.setFontSizeByFont(ctx, 50 * rpx);
      ctx.fillText('工作招聘', 100, 70 * rpx);

      this.setFontSizeByFont(ctx, 30 * rpx);
      ctx.fillText(`岗位：${this.data.job_name}`, 30, 75);
      ctx.fillText(`工作单位：${this.data.company}`, 30, 100);
      ctx.fillText(`地区：${this.data.region[0]}-${this.data.region[1]}-${this.data.region[2]}`, 30, 125);
      ctx.fillText(`工作单位：${this.data.address}`, 30, 150);
      ctx.fillText(`工资：${this.data.multiArray[0][this.data.multiIndex[0]]}-${this.data.multiArray[1][this.data.multiIndex[1]]}`, 30, 175);
 
      var i = 0;
      for(i=0;i<this.data.orthers.length;i++){
        ctx.fillText(`${this.data.orthers[i]}`, 30, 200+i*30);
      }

      await this.drawImageByLoad(canvas, ctx, `${wx.env.USER_DATA_PATH}/test.jpg`, 100/rpx, 400/rpx,100/rpx)
      this.setFontSizeByFont(ctx, 25 * rpx);
      ctx.fillText('扫描二维码进入小程序查看详情', 60, 520);
      this.myCanvas = canvas
    })

  },
  photo(){
    return new Promise((resolve, reject)=>{
      wx.cloud.database().collection('haibao')//将图片放在数据库中实现海报的更新和替换
      .get()
      .then(res=>{
        
        var x = Math.floor(Math.random() * res.data.length);
        this.setData({
          src:res.data[x].images
        })
        console.log("图片地址",this.data.src)
        resolve()
      })
    })
  },
  drawImageByLoad(canvas, ctx, url, x, y, h) {
    return new Promise((resolve, reject) => {
      // 背景图
      let img = canvas.createImage();
      img.src = url;
      img.onload = () => {
        var htw = img.width/img.height
        ctx.drawImage(img, x * rpx, y * rpx, h * htw * rpx, h * rpx); // url x y w h
        resolve();
      };
    });
  },//长全部充满canvas，保持图片比例不压缩，宽度从最左边截取
  getQrCode(){//生成二维码保存到本地
    return new Promise((resolve, reject) => {
      var id = this.data.id
      wx.cloud.callFunction({
        name:'QrCode',
        data:{
          url:'../detail/detail?id='+id
        },
        success(res){
          console.log(res);
          const filePath = `${wx.env.USER_DATA_PATH}/test.jpg`;
          wx.getFileSystemManager().writeFile({
            filePath,
            data:res.result.buffer,
            encoding:'binary',
            success:() => {
              resolve()
            }
          })
        },
        fail(res){
          console.log(res);
          reject();
        }
      })
    })
  },
  setFontSizeByFont(ctx, fontszie) {//设置字体大小
    ctx.font = `normal ${fontszie}px Arial, Verdana, Tahoma, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif`;
  },
  
  saveImage(){//保存海报图片
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      canvas:this.myCanvas,
      success: (res) => {
        console.log("保存图片")
        // const tempFilePath = res.tempFilePath
        console.log(res.tempFilePath)
        // 判断是否授权保存到相册
        this.checkAuthSetting(res.tempFilePath)
      },
      fail: () => {}
    })
  },
  checkAuthSetting(tempFilePath){//检查用户授权保存图片之相册
    wx.getSetting({
      success:(res)=>{
      	//是否已授权
        if (res.authSetting['scope.writePhotosAlbum']) {
          //已授权直接保存
          wx.saveImageToPhotosAlbum({  //保存图片到相册
            filePath: tempFilePath,
            success: function (res) {
              wx.showToast({
                icon:'none',
                title: "保存图片成功"
              })
              wx.navigateBack()
            },
            fail:(err) => {
             console.log(err);
            }
          })
        }
      	//未授权请求授权
        else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: ()=>{
               //授权后保存
              wx.saveImageToPhotosAlbum({  //保存图片到相册
                filePath: tempFilePath,
                success: function (res) {
                  wx.showToast({
                    icon:'none',
                    title: "保存图片成功"
                  })
                  wx.navigateBack()
                },
                fail:(err) => {
                 console.log(err);
                }
              })
            },
            fail: ()=>{
              wx.showToast({
                title: '您没有授权，无法保存到相册',
                icon: 'none'
              })
            }
          })
        } 
        //用户拒绝授权后，无法再直接调起请求授权，需要用户自己去设置
        else {
          wx.openSetting({
            success: (res)=>{
              if (res.authSetting['scope.writePhotosAlbum']) {
                //用户设置后保存
                this.saveImageToPhotosAlbum({  //保存图片到相册
                  filePath: tempFilePath,
                  success: function (res) {
                    wx.showToast({
                      icon:'none',
                      title: "保存图片成功"
                    })
                    wx.navigateBack()
                  },
                  fail:(err) => {
                   console.log(err);
                  }
                })
              } else {
                wx.showToast({
                  title: '您没有授权，无法保存到相册',
                  icon: 'none'
                })
              }
            }
          })
        }
      }
    })
  },

  
  onReady: function () {

  },

  onShow: function () {
    this.app.slideupshow(this, 'slide_up1', -200, 1)

    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up2', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up3', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up4', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up5', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up6', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up7', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up8', -200, 1)
    }.bind(this), 200)
    setTimeout(function () {
      this.app.slideupshow(this, 'slide_up9', -200, 1)
    }.bind(this), 200)
  },

  onHide: function () {

  },

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