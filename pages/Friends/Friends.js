// pages/Friends/Friends.js
const app = getApp()
const DB = wx.cloud.database().collection("messagelist")
const DBU = wx.cloud.database().collection("users")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Friends:[],
    briefMsg:[],
    FriendsUserInfo:[],
    date:[],
    unread:[],
    id:"",
    firstload:true
  },

  /**
   * 信息发布时间比较
   */
  compare_msg:function (x, y) {
    if(x.timestamp < y.timestamp){
      return -1
    }else if(x.timestamp > y.timestamp){
      return 1
    }else {
      return 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    //登录判断
    if (app.globalData.openID.length === 0) {
      wx.showToast({
        title: '您未登录~',
        image: '/images/icons/error.png'
      })
      setTimeout(function() {
        // 返回
        wx.switchTab({
          url: '/pages/index/index',
          success: function(res) {},
          fail: function(res) {},
          complete: function(res) {},
        })
      }, 1000);
    }else if(this.data.firstload){
      let timeStamp = Date.parse(new Date())
      this.setData({
        firstload:false,
        Friends:app.globalData.Friends
      })
      
      const _ = wx.cloud.database().command
      for(let i in this.data.Friends){
        this.setData({
          unread:this.data.unread.concat({
            num:0
          })
        })
        console.log(this.data.Friends[i], app.globalData.openid,timeStamp, this.data.unread[i].num)
        DB.orderBy('timestamp','desc').limit(1).where(_.or([
          {
            timestamp:_.lte(timeStamp),
            from:app.globalData.openID,
            to:this.data.Friends[i].id
          },
          {
            timestamp:_.lte(timeStamp),
            from:this.data.Friends[i].id,
            to:app.globalData.openID
          }
        ])).get({
          success:res=>{
            console.log("here")
            if(res.data.length != 0){
              console.log("bm", res.data[0].content)
              this.setData({
                briefMsg:this.data.briefMsg.concat(res.data[0])
              })
            }else{
              this.setData({
                briefMsg:this.data.briefMsg.concat({
                  timestamp:0,
                  content:""
                })
              })
            }

            console.log(this.data.briefMsg)
            console.log(this.data.briefMsg[i].timestamp)
            var date = new Date(this.data.briefMsg[i].timestamp)
            var Y = date.getFullYear()
            var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
            var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  
            var hour = date.getHours()
            var minute = date.getMinutes()
            var second = date.getSeconds()

            console.log(Y,M,D,hour,minute,second)
            console.log("date")
            var now_date = {
              Year:Y,
              Month:M,
              Day:D,
              Hour:hour,
              Minute:minute,
              Second:second,
              ischat:true
            }
            if(this.data.briefMsg[i].timestamp === 0){
              now_date.ischat = false
            }
            console.log("date")
            this.setData({
              date: this.data.date.concat(now_date)
            })
          }
        })
        DBU.where({
          _openid:this.data.Friends[i].id
        }).get({
          success:res=>{
            this.setData({
              FriendsUserInfo:this.data.FriendsUserInfo.concat({
                nickName:res.data[0].name,
                avatar:res.data[0].touxiang
              })
            })
            console.log("f d",this.data.FriendsUserInfo)
          }
        })
      }
    }
    this.autoLoadMessage()
    clearInterval(this.data.id)
    this.setData({
      id:setInterval(this.autoLoadMessage, 5000)
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log("friend hide")
    console.log(this.data.id)
    clearInterval(this.data.id)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log("friend unload")
    clearInterval(this.data.id)
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
   * 按时查看有没有新消息 
   */
  autoLoadMessage:function(e){
    const _ = wx.cloud.database().command
    var timeStamp = Date.parse(new Date())
    console.log("friend auto")
    for(let i in this.data.Friends){
      console.log("tiaojain",this.data.Friends[i].id,app.globalData.openID, this.data.Friends[i].lastread)
      DB.where(
        {
          from:this.data.Friends[i].id,
          to:app.globalData.openID,
          timestamp:_.gte(this.data.Friends[i].lastread)
        }
      ).count({
        success:res=>{
          console.log("se unreadnum", res)
          let unreadnum = res.total
          DB.orderBy('timestamp','desc').limit(1).where(_.or([
            {
              from:this.data.Friends[i].id,
              to:app.globalData.openID,
              timestamp:_.lte(timeStamp)
            },
            {
              from:app.globalData.openID,
              to:this.data.Friends[i].id,
              timestamp:_.lte(timeStamp)
            }
          ])).get({
            success:res2=>{
              if(res2.data.length != 0){
                this.setData({
                  ['unread['+i+'].num']:unreadnum,
                  ['briefMsg['+i+']']:res2.data[0]
                })
                var date = new Date(this.data.briefMsg[i].timestamp)
                var Y = date.getFullYear()
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
                var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
          
                var hour = date.getHours()
                var minute = date.getMinutes()
                var second = date.getSeconds()
                var now_date = {
                  Year:Y,
                  Month:M,
                  Day:D,
                  Hour:hour,
                  Minute:minute,
                  Second:second,
                  ischat:true
                }
                this.setData({
                  ['date['+i+']']:now_date
                })
              }
            }
          })
        },
        fail:res=>{
          console.log("wrong", res)
        },
      })
    }
  },

  /**
   *导航到聊天详情
   */
  navigateToMessageDetail:function (e) {
    var id = e.currentTarget.dataset.id
    console.log("friend id",id)
    wx.navigateTo({
      url: "../messageDetail/messageDetail?target=" + id
    })
  }
})