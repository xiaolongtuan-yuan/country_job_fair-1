// pages/boss/boss.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    infoList:['其他'],
    region: ['四川省', '广元市', '旺苍县'],
    multiArray: [['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k'], ['1k', '2k', '3k', '4k', '5k', '6k', '7k', '8k', '9k', '10k', '11k', '12k', '13k', '14k', '15k', '16k', '17k', '18k', '19k', '20k']],
    multiIndex: [0, 0],
    job_name:'',
    orthers:[],
    Index:0,
    company:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(this.data.infoList)
  },
  add_input(){
    console.log("添加输入行")
    var a=this.data.infoList
    a.push('请输入信息')
    this.setData({
      infoList:a
    })
    this.onLoad()
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
  input_orders(e){
    this.setData({
      Index:e.target.dataset.index
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
    wx.cloud.database().collection('jobs')
    .add({
      data:{
        salary:this.data.multiIndex,
        address:this.data.region,
        job_name:this.data.job_name,
        company:this.data.company,
        orthers:this.data.orthers
      }
    })
    .then(res=>{
      console.log('招聘发布成功',res)
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