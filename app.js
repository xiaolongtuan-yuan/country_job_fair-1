// app.js
App({
    onLaunch() {
        wx.cloud.init({
          env:'cloud1-5gynw2ctad593524'//开发环境ID
        })
      },
    globalData:{//全局变量
      user:'',//用户基本信息(users表):昵称和头像链接
      openID:'',
      worker:'',//员工的基本信息(worker表)：意向地址，意向工资，datas(投递、交流、收藏的数量)
    }
})
