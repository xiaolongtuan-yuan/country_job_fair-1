// pages/worker_resume/worker_resume.js
const db = wx.cloud.database()
const DB = wx.cloud.database().collection("users")
const app = getApp()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isboss: false,
    worker_resume: [],
    jobs: {},
    openID:app.globalData.openID,
    jobs_had: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.setData({isboss:wx.getStorageSync('isboss')})
    this.setData({openID:wx.getStorageSync('openID')})
    // this.setData({openID:app.globalData.openID})
    var that = this  
    let res1 = await db.collection('wresume').where({openid: that.data.openID}).get()
    console.log("1", res1.data)
    let worker_sended = [];
    for (let i = 0; i < res1.data.length; i++) {
      worker_sended.push(res1.data[i].resume_sendedId)
    }
    console.log("11",worker_sended)
    if(!that.data.isboss){
      that.setData({worker_resume: worker_sended})
      console.log("1", that.data.worker_resume)
    }
    

    let res2 = await db.collection('jobs').where({
      _id : _.in(that.data.worker_resume)
    }).get()
    console.log("2", res2.data)
    that.setData({jobs:res2.data})
    console.log("3", that.data.jobs)

    let res3 = await db.collection('jobs').where({
      _openid : _.eq(that.data.openID)
    }).get()
    that.setData({jobs_had: res3.data})
    console.log("4", that.data.jobs_had)
  },
  
  boss_goToResume: function(e) {
    let id=e.currentTarget.dataset.id;
    console.log('ID',e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '../boss_Resume_detail/boss_Resume_detail?id='+id
    })
  },
  back(){
    wx.navigateBack()
  },
  goToDetail: function(e) {
    let id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id
    })
  },
  
  delete_job(e){
    let id=e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除招聘信息！',
      content: '删除后将失去所有信息',
      success (res) {
        if (res.confirm) {
          db.collection('jobs')
          .doc(id)
          .remove()
          .then(res => {
            wx.showToast({
              title:'删除成功',
              icon:'success',
              duration:2000
            })
          })
          .catch(res=>{
            wx.showToast({
              title:'删除失败，请联系客服',
              icon:'error',
              duration:2000
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    db.collection('')
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

  /**
   * 
   * 导航到招聘对应的聊天
   */
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
            var chat = res.data[0].Friends.find((e)=>{return e.id == app.globalData.openID})
            if(chat.length === 0){
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
            })
          }else{
            var chat = res.data[0].Friends.find((e)=>{return e.id == target})
            if(chat.length === 0){
              DB.doc(res.data[0]._id).update({
                data:{
                  Friends:res.data[0].Friends.concat({
                    id:target,
                    lastread:0
                  })
                }
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