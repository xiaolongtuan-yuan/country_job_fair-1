// pages/boss_Resume_detail_In/boss_Resume_detail_In.js
const db = wx.cloud.database()
const DB = wx.cloud.database().collection("users")
const app = getApp()
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
    //[0]姓名[1]性别[2]年龄[3]教育水平[4]毕业院校[5]专业[6]特长[7]工作经历[8]资格证书
    array:['无','小学','初中','高中','专科','本科','研究生','博士研究生']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({openID:wx.getStorageSync('openID')})
    let id = options.id
    console.log("id", id)
    this.setData({worker_OpId:id})
    var that = this
    let res1 = await db.collection('zxjianli').where({_id: that.data.worker_OpId}).get()
    console.log("0", res1.data)
    that.setData({worker_detail: res1.data})
    let res2 = await db.collection('worker').where({_openid: that.data.openID}).get()
    console.log('1',res2.data)
    that.setData({boss_favor: res2.data[0].boss_favor})
    console.log("2", that.data.boss_favor)
    var len = res2.data[0].boss_favor.length
    for(let i = 0; i < len; i++) {
      if(res2.data[0].boss_favor[i] == that.data.worker_OpId){
        that.setData({isAdd: true})
      }
    }

  },
  // 索引
  indexof: function(arr, val)  {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == val) {
        return i;
      }
    }
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
    let index = this.indexof(this.data.boss_favor,this.data.worker_OpId);
    this.data.boss_favor.splice(index, 1);
    console.log("4", this.data.boss_favor)
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
  
  back(){
    wx.navigateBack()
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

  },
  newchat:function(e){
    if (app.globalData.openID.length === 0) {
      wx.showToast({
        title: '您未登录~',
        image: '/images/icons/error.png'
      })
    }else{
      var target = e.currentTarget.dataset.id
      console.log("b inse",target, e.currentTarget.dataset.id)
      DB.where({
        _openid:target
      }).get({
        success:res=>{
          console.log("friends inse", res.data)
          if(res.data[0].Friends.length === 0){
            console.log("frid ")
            DB.doc(res.data[0]._id).update({
              data:{
                Friends:[{
                  id:app.globalData.openID,
                  lastread:0
                }]
              }
            })
          }else{
            console.log('add fri t')
            var chat = res.data[0].Friends.find((e)=>{return e.id == app.globalData.openID})
            console.log('chat', chat)
            if(chat == undefined){
              DB.doc(res.data[0]._id).update({
                data:{
                  Friends:res.data[0].Friends.concat({
                    id:app.globalData.openID,
                    lastread:0
                  })
                }
              })
            }
          }
        }
      })

      DB.where({
        _openid:app.globalData.openID
      }).get({
        success:res=>{
          if(res.data[0].Friends.length === 0){
            DB.doc(res.data[0]._id).update({
              data:{
                Friends:[{
                  id:target,
                  lastread:0
                }]
              }
            }).then(res=>{
              app.globalData.Friends.push({
                id:target,
                lastread:0
              })
            })
          }else{
            var chat = res.data[0].Friends.find((e)=>{return e.id == target})
            if(chat == undefined){
              DB.doc(res.data[0]._id).update({
                data:{
                  Friends:res.data[0].Friends.concat({
                    id:target,
                    lastread:0
                  })
                }
              }).then(res=>{
                app.globalData.Friends.push({
                  id:target,
                  lastread:0
                })
              })
            }
          }
        }
      })
      
      console.log("inse end", target)
      wx.navigateTo({
        url: "../messageDetail/messageDetail?target=" + target
      })  
    }
  }
})