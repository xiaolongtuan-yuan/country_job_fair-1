// pages/zxjianli/zxjianli.js
const db = wx.cloud.database()
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

  /**
   * 页面的初始数据
   */
  data: {
    openID:'',
    info:[,'f',,1,,,,,],//[0]姓名[1]性别[2]年龄[3]教育水平[4]毕业院校[5]专业[6]特长[7]工作经历[8]资格证书
    photoID:'',
    array:['无','小学','初中','高中','专科','本科','研究生','博士研究生'],
    index:1,
    sex:true,
    jianli:'',
    exist:false,
    _id:'',
    recorderID:'',
    recorder_begin:1,
    recorder_play:1,
    openRecordingdis: "block",//录音图片的不同
    shutRecordingdis: "none",//录音图片的不同
    recordingTimeqwe:0,//录音计时
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.app = getApp()
    this.setData({
      openID:this.app.globalData.openID
    })
    db.collection('zxjianli')
    .where({
      _openid:this.data.openID
    })
    .get()
    .then(res=>{
      console.log('已存在简历数',res.data)
      if(res.data.length>0){
        this.tempFilePath = res.data[0].recorder
        this.setData({
          jianli: res.data[0],
          info: res.data[0].info,
          photoID: res.data[0].photo,
          recorderID:res.data[0].recorder,
          index:res.data[0].info[3],
          exist:true,
          _id:res.data[0]._id
        })
        if(res.data[0].info[1]=='m'){
          this.setData({
            sex:false
          })
        }
        else{
          this.setData({
            sex:true
          })
        }
      }
    })
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
    this.recorderManager = wx.getRecorderManager()
    var that = this
    this.recorderManager.start(options)
    this.recorderManager.onStart(() => {
      console.log('。。。开始录音。。。')
      this.setData({
        recordingTimeqwe:0,
        recorder_begin:2
      })
      this.recordingTimer()
     });
     //错误回调
     this.recorderManager.onError((res) => {
      console.log(res);
     })
  },
  end(){
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
      this.recorder_upload(res.tempFilePath)
    })
  },
  //播放录音
  playClick() {
    console.log("开始播放",this.tempFilePath)
    var audio = wx.createInnerAudioContext();
    audio.src = this.tempFilePath;
    audio.autoplay = true;
  },
  recorder_upload(filePath){
    var path = "recorder/"+this.data.info[0]+".mp3"
    var that = this
    wx.cloud.uploadFile({
      cloudPath: path,
      filePath: filePath,
      success:res2=>{
        that.setData({
          recorderID:res2.fileID
        })
        that.tempFilePath = res2.fileID
        console.log('录音上传成功！',that.data.recorderID)
      },
      fail:console.log("上传失败")
    })
  },
  back(){
    wx.navigateBack()
  },
  sexChange(e){
    console.log(e)
    var info = this.data.info
    info[1] = e.detail.value
    this.setData({
      info:info
    })
  },
  input_name(e){
    //console.log(e)
    var info = this.data.info
    info[0] = e.detail.value
    this.setData({
      info:info
    })
  },
  input_age(e){
    //console.log(Number(e.detail.value))
    var info = this.data.info
    info[2] = Number(e.detail.value)
    this.setData({
      info:info
    })
  },
  bindPickerChange(e){
    
    var info = this.data.info
    info[3] = e.detail.value//存入index
    this.setData({
      info:info,
      index:e.detail.value
    })
    console.log(this.data.info)
  },
  // input_wxid(e){
  //   //console.log(e)
  //   var info = this.data.info
  //   info[4] = e.detail.value
  //   this.setData({
  //     info:info
  //   })
  // },
  // input_tel(e){
  //   //console.log(e)
  //   var info = this.data.info
  //   info[5] = Number(e.detail.value)
  //   this.setData({
  //     info:info
  //   })
  // },
  input_school(e){
    //console.log(e)
    var info = this.data.info
    info[4] = e.detail.value
    this.setData({
      info:info
    })
  },
  input_major(e){
    //console.log(e)
    var info = this.data.info
    info[5] = e.detail.value
    this.setData({
      info:info
    })
  },
  input_talent(e){
    var info = this.data.info
    info[6] = e.detail.value
    this.setData({
      info:info
    })
  },
  input_workexp(e){
    //console.log(e)
    var info = this.data.info
    info[7] = e.detail.value
    this.setData({
      info:info
    })
  },
  input_credential(e){
    //console.log(e)
    var info = this.data.info
    info[8] = e.detail.value
    this.setData({
      info:info
    })
  },
  photo_upload(){
    var path = this.data.info[0] + '.png'
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res =>{
        var tempFilePaths = res.tempFilePaths;
        wx.cloud.uploadFile({
          cloudPath: path,
          filePath: tempFilePaths[0],
          success:res2=>{
            //console.log(res2)
            that.setData({
              photoID:res2.fileID
            })
          },
          fail:console.error
        })
      }
    })
  },
  upload(){//上传数据库
    var i = 0
    for(i;i<9;i++){
      if(!this.data.info[i]){
        console.log("信息",this.data.info)
        wx.showToast({
          title: '信息不能为空',
          icon: 'error'
        })
        return
      }
    }
    wx.showLoading({
      title: '上传中...',
    })
    console.log("要上传的资源",this.data.info,
    this.data.photoID,
    this.data.index,
    this.app.globalData.worker.yx_salary,
    this.data.recorderID)
    if(this.data.exist){
      db.collection('zxjianli')
      .doc(this.data._id)
      .update({
        data:{
          info:this.data.info,
          photo:this.data.photoID,
          education:this.data.index,
          yx_salary:this.app.globalData.worker.yx_salary,
          recorder:this.data.recorderID
        }
      })
      .then(
        wx.hideLoading(),
        wx.navigateBack()
      )
    }
    else{
      console.log("要上传的资源",this.data.info,
      this.data.photoID,
      this.data.index,
      this.app.globalData.worker.yx_salary,
      this.data.recorderID)
      db.collection('zxjianli')
      .add({
        data:{
          info:this.data.info,
          photo:this.data.photoID,
          education:this.data.index,
          yx_salary:this.app.globalData.worker.yx_salary,
          recorder:this.data.recorderID
        }
      })
      .then(
          wx.hideLoading(),
          wx.navigateBack()
      )
    }
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
    // this.app.slideupshow(this, 'slide_up1', -200, 1)

    // setTimeout(function () {
    //   this.app.slideupshow(this, 'slide_up2', -200, 1)
    // }.bind(this), 200)
    // setTimeout(function () {
    //   this.app.slideupshow(this, 'slide_up3', -200, 1)
    // }.bind(this), 200)
    // setTimeout(function () {
    //   this.app.slideupshow(this, 'slide_up4', -200, 1)
    // }.bind(this), 200)
    // setTimeout(function () {
    //   this.app.slideupshow(this, 'slide_up5', -200, 1)
    // }.bind(this), 200)
    // setTimeout(function () {
    //   this.app.slideupshow(this, 'slide_up6', -200, 1)
    // }.bind(this), 200)
    // setTimeout(function () {
    //   this.app.slideupshow(this, 'slide_up7', -200, 1)
    // }.bind(this), 200)
    // setTimeout(function () {
    //   this.app.slideupshow(this, 'slide_up8', -200, 1)
    // }.bind(this), 200)
    // setTimeout(function () {
    //   this.app.slideupshow(this, 'slide_up9', -200, 1)
    // }.bind(this), 200)
    // setTimeout(function () {
    //   this.app.slideupshow(this, 'slide_up10', -200, 1)
    // }.bind(this), 200)
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