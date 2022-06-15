// index.js
const db = wx.cloud.database()
const _ = db.command
const app = getApp()
Page({
  data: {
    //滑动幻灯片素材
    jobsList: [],
    yx_job_len:0,//记录符合意向的岗位长度
    yx_resume_len:0,
    jianli: [],
    resumeList: [], // 最终的简历列表
    isboss:false,
    //[0]姓名[1]性别[2]年龄[3]教育水平[4]毕业院校[5]专业[6]特长[7]工作经历[8]资格证书
    array:['无','小学','初中','高中','专科','本科','研究生','博士研究生'],
    mode:true, //true是展示招聘信息,false时展示简历
    loading:true,
    loading2:true,
    multiArray:[['无','小学','初中','高中','专科','本科','研究生','博士研究生'],app.globalData.post_classify],
    multiIndex:[0,0]
  },
   /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // this.setData({isboss:wx.getStorageSync('isboss')})
    this.app = getApp()
    var multiArray = this.data.multiArray
    multiArray[1] = app.globalData.post_classify
    this.setData({
      multiArray:multiArray
    })

    
    this.yx_address = this.app.globalData.worker.yx_address
    this.job_post = this.app.globalData.worker.yx_post
    var temp_jobList_len = 0
    var temp_resumeList_len = 0
    this.end1 = false
    this.end2 = false
    this.end3 = false
    this.end4 = false
    this.end5 = false
    this.end6 = false
    this.end7 = false
    this.end8 = false
    this.job_list_id = []
    this.resume_list_id = []
    
    // wx.cloud.database().collection('jobs')
    //   .where({
    //     region:this.app.globalData.worker.yx_address
    //   })
    //   .get()
    //   .then(res => {
    //     var len = res.data.length
    //     var half = Math.round(len/2)
    //     this.setData({
    //       jobsList: res.data.slice(0,half),
    //       jobsList2: res.data.slice(half,len)
    //     })
    //     console.log(res.data)
    //   })
    //   .catch(err => {
    //     console.log('请求失败',err)
    //   })

    this.getjob()
    this.getresume()
  },

  async getjob(){//采三层用分级
    var list = this.data.jobsList
    console.log("最初job有",list)
    console.log("最初job_list_id",this.job_list_id)
    var i = 0
    var len1 = 0
    
    if(!this.end1){
      let res1 = await wx.cloud.database().collection('jobs')
      .where({
        region:this.app.globalData.worker.yx_address,
        job_post:this.app.globalData.worker_post,
        _id: _.nin(this.job_list_id)
      })
      // .skip(this.len1)
      .get()
      len1 += res1.data.length

      console.log("list1",list)
      for(i=0;i<res1.data.length;i++){
        this.job_list_id.push(res1.data[i]._id)
        list.push(res1.data[i])
      }
    }
    if(len1 < 20 && !this.end2){
      this.end1 = true // 表示同时满足两个意向的工作已经取完
      let res2 = await wx.cloud.database().collection('jobs')
                                        .where({
                                          region:this.app.globalData.worker.yx_address,
                                          _id: _.nin(this.job_list_id)
                                        })
                                        .limit(20 - len1)
                
                                        .get()
      len1 += res2.data.length
      console.log("list2",list)
      for(i=0;i<res2.data.length;i++){
        this.job_list_id.push(res2.data[i]._id)
        list.push(res2.data[i])
      }
    }
    if(len1 < 20 && !this.end3){
      this.end2 = true
      let res3 = await wx.cloud.database().collection('jobs')
                                      .where({
                                        job_post:this.app.globalData.worker_post,
                                        _id: _.nin(this.job_list_id)
                                      })
                                      .limit(20 - len1)
                               
                                      .get()
      len1 += res3.data.length
      console.log("list3",list)
      for(i=0;i<res3.data.length;i++){
        this.job_list_id.push(res3.data[i]._id)
        list.push(res3.data[i])
      }
    }
    if(len1 < 20 && !this.end4){//最后取所有工作
      this.end3 = true
      let res4 = await wx.cloud.database().collection('jobs')
                                    .where({
                                      _id: _.nin(this.job_list_id)
                                    })
                                    .limit(20 - len1)
                            
                                    .get()
      len1 += res4.data.length
      console.log("list4",list)
      for(i=0;i<res4.data.length;i++){
        this.job_list_id.push(res4.data[i]._id)
        list.push(res4.data[i])
      }  
    }
    if(len1 < 20){
      this.end4 = true
    }
    //此时筛选条件足够
    
    this.setData({
      jobsList: list,
      loading:false
    })
    console.log(list)
  },
  shaixuan(){

  },
  bindMultiPickerChange: function (e) {
    //console.log('picker发送选择改变,携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
    console.log("简历筛选",this.data.multiIndex)
    this.require()
  },

  async getresume(){
    var list = this.data.resumeList
    console.log("最初简历有",list)
    console.log("最初resume_list_id",this.resume_list_id) // this.resume_list_id记录在册的简历
    var i = 0
    var len2 = 0
    
    if(!this.end5){
      var openid = []
      let res5 = await wx.cloud.database().collection('worker') //现在yorker中找符合地址和行业的openid
      .where(
        {
          yx_address: this.app.globalData.worker.yx_address,
          _openid: _.and(_.not(_.eq(this.app.globalData.openID)), _.nin(this.resume_list_id)),
          yx_post1:this.data.multiIndex[1]
        })
      .get()
      
      console.log("无语1",res5.data)
      for (let i = 0; i < res5.data.length; i++) {
        openid.push(res5.data[i]._openid)
      }
      // this.setData({jianli:openid})
      // console.log("4用到的简历",this.data.jianli)

      let res3 = await db.collection('zxjianli').where({
        _openid: _.in(openid),
        education:_.gte(this.data.multiIndex[0])
      })
      .get()
    
      let zxjianli = res3.data
      console.log("4简历有", res3.data)
      for(let i = 0; i < zxjianli.length; i++) {
        list.push(zxjianli[i])
        this.resume_list_id.push(zxjianli[i]._openid)
      }
      len2 += res3.data.length

    }
    if(len2<20 && !this.end7){ //先进性行业限制
      this.end5 = true
      var openid = []
      let res6 = await wx.cloud.database().collection('worker') //现在yorker中找符合地址和行业的openid
      .where(
        {
          _openid: _.and(_.not(_.eq(this.app.globalData.openID)), _.nin(this.resume_list_id)),
          yx_post1:this.data.multiIndex[1]
        })
      // .skip(this.len1)
      .get()

      console.log("无语2",res6.data)
      for (let i = 0; i < res6.data.length; i++) {
        openid.push(res6.data[i]._openid)
      }

      let res7 = await db.collection('zxjianli').where({
        _openid: _.in(openid)
      })
      .get()

      let zxjianli = res7.data
      console.log("4简历 行业限制", this.resume_list_id)
      for(let i = 0; i < zxjianli.length; i++) {
        list.push(zxjianli[i])
        this.resume_list_id.push(zxjianli[i]._openid)
      }
      len2 += res7.data.length
      
    }
    if(len2<20 && !this.end8){
      this.end7 = true
      var openid = []
      var test_list = this.resume_list_id
      console.log('test_list',test_list)
      let res6 = await wx.cloud.database().collection('worker') //现在yorker中找符合地址和行业的openid
      .where(
        {
          _openid: _.and(_.not(_.eq(this.app.globalData.openID)), _.nin(this.resume_list_id)),
        })
      // .skip(this.len1)
      .get()

      console.log("无语3",res6.data)
      for (let i = 0; i < res6.data.length; i++) {
        openid.push(res6.data[i]._openid)
      }

      let res7 = await db.collection('zxjianli').where({
        _openid: _.in(openid),
        education:_.gte(this.data.multiIndex[0])
      })
      .get()
  
      let zxjianli = res7.data
      console.log("4简历 学历限制", this.resume_list_id)
      for(let i = 0; i < zxjianli.length; i++) {
        list.push(zxjianli[i])
        this.resume_list_id.push(zxjianli[i]._openid)
      }
      len2 += res7.data.length

    }

    if(len2 < 20 && !this.end6){
      this.end8 = true // 表示同时满足条件简历已经取完
      let res2 = await wx.cloud.database().collection('zxjianli')
                                        .where(
                                          {
                                            _openid: _.and(_.not(_.eq(this.app.globalData.openID)), _.nin(this.resume_list_id)),
                                          })
                                        .limit(20 - len2)

                                        .get()
      len2 += res2.data.length
      console.log("简历res2",res2)
      for(i=0;i<res2.data.length;i++){
        console.log("res2的openid",res2.data[i]._openid)
        this.resume_list_id.push(res2.data[i]._openid)
        list.push(res2.data[i])
      }
      
    }

    if(len2 < 20){
      this.end6 = true
    }
    //此时筛选条件足够
    
    this.setData({
      resumeList: list,
      loading2:false
    })
    console.log(list)

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
    var that = this
    console.log('当前用户地区',this.app.globalData.worker.yx_address)
    console.log('this.yx_address',this.yx_address)
    console.log('地址相等吗',this.yx_address != this.app.globalData.worker.yx_address)
    console.log('this.app.globalData.worker.yx_post',this.app.globalData.worker.yx_post)
    console.log('this.job_post',this.job_post)
    for(var i=0;i<3;i++){
      if(this.yx_address[i] != this.app.globalData.worker.yx_address[i]){
        this.require()
      }
    }
    for(var i=0;i<2;i++){
      if(this.job_post[i] !== this.app.globalData.worker.yx_post[i]){
        this.require()
      }
    }
  },
  require(){
    console.log("意向更改") 
      this.yx_address = this.app.globalData.worker.yx_address
      this.job_post = this.app.globalData.worker.yx_post  

      this.end1 = false
      this.end2 = false
      this.end3 = false
      this.end4 = false
      this.end5 = false
      this.end6 = false
      this.end7 = false
      this.end8 = false
      
      this.job_list_id = []
      this.resume_list_id = []
      this.setData({
        jobsList: [],
        yx_job_len:0,//记录符合意向的岗位长度
        yx_resume_len:0,
        jianli: [],
        resumeList: [], // 最终的简历列表
        isboss:false,
        //[0]姓名[1]性别[2]年龄[3]教育水平[4]毕业院校[5]专业[6]特长[7]工作经历[8]资格证书
        array:['无','小学','初中','高中','专科','本科','研究生','博士研究生'],
        loading:true,
        loading2:true
      })
      console.log("onshow后joblist",this.data.jobsList)
      this.getjob()
      this.getresume()
  },
  onReachBottom: function (){
      this.getjob()
      this.getresume()
  }
})
