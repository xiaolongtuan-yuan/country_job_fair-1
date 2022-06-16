// pages/boss/boss.js
const height = wx.getSystemInfoSync().windowHeight//系统高度
const width = wx.getSystemInfoSync().windowWidth//系统宽度
const rpx = width / 750 //rpx转px系数
const app = getApp()
const options = {
  duration: 600000, //指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
  sampleRate: 16000, //采样率
  numberOfChannels: 1, //录音通道数
  encodeBitRate: 96000, //编码码率
  format: 'mp3', //音频格式，有效值 aac/mp3
  frameSize: 50, //指定帧大小，单位 KB
}
Page({

  data: {
    infoList:[],//自动添加的输入框列表
    region: ['四川省', '广元市', '旺苍县'],
    multiArray: [['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k'], ['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k', '20k']],
    multiIndex: [0, 0],//工资索引
    job_name:'',//工作名字
    posts:app.globalData.post,//工作类型
    job_post:[0,0],
    intro:'',//岗位介绍
    introduction:'',//详细介绍
    address:'',//详细地址
    require:[],//任职要求
    others:[],//‘其他’信息
    Index:0,//用来处理自行添加的输入框的输入问题
    company:'',//公司名称
    animationData:[],//自行添加行动画
    // canvasW: width * 0.8, //画布宽度
    canvasType: false,//是否出现海报bool
    ctx:'',//画布上下文
    src:'',//海报背景图片
    id:'',
    ismask:false,
    loading:false,  // true是出现加在动画
    recorderID:'',
    recorder_begin:1,
    recorder_play:1,
    openRecordingdis: "block",//录音图片的不同
    shutRecordingdis: "none",//录音图片的不同
    recordingTimeqwe:0,//录音计时
  },


  onLoad: function (options) {
  
  },
  recordingTimer:function(){
    var that = this;
    //将计时器赋值给setInter
    this.setInter = setInterval(
     function () {
      var time = that.data.recordingTimeqwe + 1;
      that.setData({
       recordingTimeqwe: time
      })
     }
     , 1000); 
   },
   begin(){
    var that = this
    wx.getSetting({
      success:(res)=>{
      	//是否已授权
        
        if (res.authSetting['scope.record']) {
          //已授权直接保存
          console.log("已授权麦克风")
          that.recorderManager = wx.getRecorderManager()
          that.recorderManager.start(options)
          that.recorderManager.onStart(() => {
            console.log('。。。开始录音。。。')
            that.setData({
              recordingTimeqwe:0,
              recorder_begin:2
            })
            that.recordingTimer()
          });
          //错误回调
          that.recorderManager.onError((res) => {
            console.log(res);
          })
        
        }
        else if (res.authSetting['scope.record'] === undefined) {
          console.log("正在授权")
          wx.authorize({
            scope: 'scope.record',
            success: ()=>{
              //授权麦克风成功
              console.log("授权成功！")
              return
            }
          })
        }
      }
    })
  },
  end(){//这里没有上传云存储
    this.recorderManager.stop();
    this.recorderManager.onStop((res) => {
      console.log('。。停止录音。。', res.tempFilePath)
      this.tempFilePath = res.tempFilePath;
      //结束录音计时 
      clearInterval(this.setInter)
      console.log("录音时长",this.data.recordingTimeqwe)
      this.setData({
        recorder_begin:1
      })
    })
  },
  //播放录音
  playClick() {
    console.log("开始播放",this.tempFilePath)
    var audio = wx.createInnerAudioContext();
    audio.src = this.tempFilePath;
    audio.autoplay = true;
  },
  async recorder_upload(filePath){
    var timestamp = (new Date()).valueOf();//新建日期对象并变成时间戳
    var path = "recorder/"+timestamp+".mp3"
    var that = this
    await wx.cloud.uploadFile({
      cloudPath: path,
      filePath: filePath,     
    })
    .then(res2=>{
      that.setData({
        recorderID:res2.fileID
      })
      console.log('录音上传成功！',that.data.recorderID)
    })
  },

  add_input(){
    console.log("添加输入行")
    var a=this.data.infoList
    a.push('请输入信息')
    this.setData
    ({
      infoList:a
    })
    this.set_animations()
  },
  // minus_input(e){
  //   var a = this.data.infoList
  //   a.splice(e.target.dataset.index-1,1)
  //   var b = this.data.require
  //   b.splice(e.target.dataset.index,1)
  //   this.setData({
  //     infoList:a,
  //     require:b
  //   })
  // },
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
    console.log('简介',e.detail.value)
    this.setData({
      intro:e.detail.value
    })
  },
  input_address(e){
    console.log('地址',e.detail.value)
    this.setData({
      address:e.detail.value
    })
  },
  input_introduction(e){
    this.setData({
      introduction:e.detail.value
    })
  },
  input_require(e){
    var array = this.data.require
    array[e.target.dataset.index]=e.detail.value
    this.setData({
      require:array
    })
  },
  input_others(e){
    var array = this.data.others
    array[0]=e.detail.value
    this.setData({
      others:array
    })
    // console.log(this.data.others)
  },
  input_company(e){
    this.setData({
      company:e.detail.value
    })
  },
  async upload(){
    await this.recorder_upload(this.tempFilePath)
    console.log('目前输入',
    this.data.multiIndex,
    this.data.region,
    this.data.job_name,
    this.data.company,
    this.data.intro,
    this.data.introduction,
    this.data.address,
    this.data.require,
    this.data.others,
    this.data.job_post,
    this.data.recorderID)
    if(!this.data.job_name){
      wx.showToast({
        icon:"error",
        title:"未输入岗位名！"
      })
      return
    }
    if(!this.data.intro){
      wx.showToast({
        icon:"error",
        title:"未输入简介！"
      })
      return
    }
    if(!this.data.address){
      wx.showToast({
        icon:"error",
        title:"未输入详细地址！"
      })
      return
    }
    if(!this.data.company){
      wx.showToast({
        icon:"error",
        title:"未输入工作单位！"
      })
      return
    }
    if(this.data.address.length>29){
      wx.showToast({
        icon:"error",
        title:"地址最多29字！"
      })
      return
    }
    if(this.data.intro.length>29){
      wx.showToast({
        icon:"error",
        title:"简介最多29字！"
      })
      return
    }
    else{
      this.setData({
        ismask:true,
        loading:true
      })
      wx.cloud.database().collection('jobs')
      .add({
        data:{
          salary:this.data.multiIndex,
          region:this.data.region,
          job_name:this.data.job_name,
          company:this.data.company,
          b_intro:this.data.intro,
          introduction:this.data.introduction,
          address:this.data.address,
          require:this.data.require,
          others:this.data.others,
          job_post:this.data.job_post,
          recorder:this.data.recorderID
        }
      })
      .then(res=>{
        console.log('招聘发布成功',res)
        this.setData({
          id:res._id
        })
        this.drawCanvas2D()
      })
    }
  },
  back(){
    wx.navigateBack()
  },
  yxpost(){
    wx.navigateTo({
      url: '../hangye/hangye?mode=2'
    })
  },

  cancelPoster() {
    this.setData({
      canvasType: false
    })
  },//退出海报

  drawCanvas2D() {
    console.log('开始绘制海报')
    this.setData({
      loading:false
    })
    var text_interval = 30
    var text_num = 0
    var text_begin = 200
    var line_interval = 25
    var line_num = 0
    var ecli_begin = 188
    var ecli_interval = 30
    this.setData({
      canvasType:true
    })

    const query = wx.createSelectorQuery();
    query
    .select('#myCanvas')
    .fields({ node: true, size: true })
    .exec(async (res) => {
      console.log("捕获画布成功");
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
      
      await this.drawImageByLoad(canvas, ctx, '../../images/Ellipse 1.png', 190, 100, 420/rpx); 
      await this.drawImageByLoad(canvas, ctx, '../../images/2.png', 150, 90, 55/rpx);
      await this.drawImageByLoad(canvas, ctx, '../../images/1.png', 210, 30, 45/rpx);

      ctx.fillStyle = '#000';
      ctx.font = `bolder 25px inter`;

      ctx.fillText(`${this.data.job_name}`, 30, 160);

      ctx.font = `normal 15px inter`;
      await this.drawImageByLoad(canvas, ctx, '../../images/Ellipse 2.png', 5, (ecli_begin+(text_num)*ecli_interval)/rpx, 13/rpx); 
      ctx.fillText(`工作单位：${this.data.company}`, 25, text_begin+(text_num++)*text_interval);
      await this.drawImageByLoad(canvas, ctx, '../../images/Ellipse 2.png', 5, (ecli_begin+(text_num)*ecli_interval)/rpx, 13/rpx); 
      ctx.fillText(`工作区域：${this.data.region[0]}-${this.data.region[1]}-${this.data.region[2]}`, 25, text_begin+(text_num++)*text_interval);
      
      await this.drawImageByLoad(canvas, ctx, '../../images/Ellipse 2.png', 5, (ecli_begin+(text_num)*ecli_interval)/rpx, 13/rpx); 
      var str = this.data.address
      if(str.length <= 12){
        ctx.fillText(`工作地点：${str}`, 25, text_begin+(text_num++)*text_interval);
      }
      else{
        ctx.fillText(`工作地点：${str.slice(0,11)}`, 25, text_begin+(text_num)*text_interval);
        str = str.slice(12);
        line_num++;
        while(str.length > 17){
          ctx.fillText(`${str.slice(0,16)}`, 25, text_begin+(text_num)*text_interval+line_interval*(line_num++));
          str = str.slice(17);
        }
        ctx.fillText(`${str}`, 25, text_begin+(text_num)*text_interval+line_interval*(line_num++));
      }

      await this.drawImageByLoad(canvas, ctx, '../../images/Ellipse 2.png', 5, (ecli_begin+(text_num)*ecli_interval+line_interval*line_num)/rpx, 13/rpx);
      ctx.fillText(`工资：${this.data.multiArray[0][this.data.multiIndex[0]]}-${this.data.multiArray[1][this.data.multiIndex[1]]}`, 25, text_begin+(text_num++)*text_interval+line_interval*line_num);
      
      await this.drawImageByLoad(canvas, ctx, '../../images/Ellipse 2.png', 5, (ecli_begin+(text_num)*ecli_interval+line_interval*line_num)/rpx, 13/rpx); 
      var str = this.data.intro
      if(str.length <= 12){
        ctx.fillText(`工作简介：${str}`, 25, text_begin+(text_num++)*text_interval+line_interval*line_num);
      }
      else{
        ctx.fillText(`工作简介：${str.slice(0,11)}`, 25, text_begin+(text_num)*text_interval+line_interval*(line_num));
        str = str.slice(12);
        line_num++;
        while(str.length > 17){
          ctx.fillText(`${str.slice(0,16)}`, 25, text_begin+(text_num)*text_interval+line_interval*(line_num++));
          str = str.slice(17);
        }
        ctx.fillText(`${str}`, 25, text_begin+(text_num)*text_interval+line_interval*(line_num++));
      }



      ctx.fillText('扫描下方二维码了解详情', 130, 420);
      await this.getQrCode()
      await this.drawImageByLoad(canvas, ctx, `${wx.env.USER_DATA_PATH}/test.jpg`, 200/rpx, 430/rpx,100/rpx)
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
    console.log("保存海报")
    wx.getSetting({
      success:(res)=>{
      	//是否已授权
        
        if (res.authSetting['scope.writePhotosAlbum']) {
          //已授权直接保存
          console.log("已授权")
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
          console.log("正在授权")
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
     this.setData({
       job_post:app.globalData.job_post
     })
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