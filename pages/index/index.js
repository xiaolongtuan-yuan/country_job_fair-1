// index.js
const db = wx.cloud.database()
const _ = db.command
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
    loading:true
  },
   /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // this.setData({isboss:wx.getStorageSync('isboss')})
    this.app = getApp()
    
    this.yx_address = this.app.globalData.worker.yx_address
    this.job_post = this.app.globalData.worker.yx_post
    var temp_jobList_len = 0
    var temp_resumeList_len = 0
    this.len1 = 0
    this.len2 = 0
    this.len3 = 0
    this.len4 = 0
    this.len5 = 0
    this.len6 = 0
    this.end1 = false
    this.end2 = false
    this.end3 = false
    this.end4 = false
    this.end5 = false
    this.end6 = false
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
    
    if(!this.end1){
      let res1 = await wx.cloud.database().collection('jobs')
      .where({
        region:this.app.globalData.worker.yx_address,
        job_post:this.app.globalData.worker_post,
        _id: _.nin(this.job_list_id)
      })
      // .skip(this.len1)
      .get()
      this.len1 += res1.data.length

      console.log("list1",list)
      for(i=0;i<res1.data.length;i++){
        this.job_list_id.push(res1.data[i]._id)
        list.push(res1.data[i])
      }
    }
    if(list.length < 20 && !this.end2){
      this.end1 = true // 表示同时满足两个意向的工作已经取完
      let res2 = await wx.cloud.database().collection('jobs')
                                        .where({
                                          region:this.app.globalData.worker.yx_address,
                                          _id: _.nin(this.job_list_id)
                                        })
                                        .limit(20 - list.length)
                
                                        .get()
      this.len2 += res2.data.length
      console.log("list2",list)
      for(i=0;i<res2.data.length;i++){
        this.job_list_id.push(res2.data[i]._id)
        list.push(res2.data[i])
      }
    }
    if(list.length < 20 && !this.end3){
      this.end2 = true
      let res3 = await wx.cloud.database().collection('jobs')
                                      .where({
                                        job_post:this.app.globalData.worker_post,
                                        _id: _.nin(this.job_list_id)
                                      })
                                      .limit(20 - list.length)
                               
                                      .get()
      this.len3 += res3.data.length
      console.log("list3",list)
      for(i=0;i<res3.data.length;i++){
        this.job_list_id.push(res3.data[i]._id)
        list.push(res3.data[i])
      }
    }
    if(list.length < 20 && !this.end4){//最后取所有工作
      this.end3 = true
      let res4 = await wx.cloud.database().collection('jobs')
                                    .where({
                                      _id: _.nin(this.job_list_id)
                                    })
                                    .limit(20 - list.length)
                            
                                    .get()
      this.len4 += res4.data.length
      console.log("list4",list)
      for(i=0;i<res4.data.length;i++){
        this.job_list_id.push(res4.data[i]._id)
        list.push(res4.data[i])
      }  
    }
    if(list.length < 20){
      this.end4 = true
    }
    //此时筛选条件足够
    
    this.setData({
      jobsList: list,
      loading:false
    })
    console.log(list)
  },

  getresume(){
    
    var list = this.data.resumeList
   
    
    console.log("开始寻找简历")
    if(!this.end5){
      db.collection('worker').where(_.and([
        {
          yx_address: this.app.globalData.worker.yx_address,
          _openid: _.not(_.eq(this.app.globalData.openID)),
        },
        {
          _openid: _.nin(this.resume_list_id)
        }
      ])).get()
      .then(res2 => {
        if(res2.data.length < 20){
          this.end5 = true
        }
        for (let i = 0; i < res2.data.length; i++) {
          this.resume_list_id.push(res2.data[i]._openid)
        }
        this.setData({jianli:this.resume_list_id})
        console.log("4用到的简历",this.data.jianli)

        db.collection('zxjianli').where({
          _openid: _.in(this.data.jianli)
        }).get()
        .then(res3 => {
          let zxjianli = res3.data
          console.log("4", zxjianli)
          for(let i = 0; i < zxjianli.length; i++) {
            list.push(zxjianli[i])
          }
          this.setData({resumeList: list})
        })
      })
    }
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
      this.len1 = 0
      this.len2 = 0
      this.len3 = 0
      this.len4 = 0
      this.len5 = 0
      this.len6 = 0
      this.end1 = false
      this.end2 = false
      this.end3 = false
      this.end4 = false
      this.end5 = false
      this.end6 = false
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
        mode:true, //true是展示招聘信息,false时展示简历
        loading:true
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
