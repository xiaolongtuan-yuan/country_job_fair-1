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
    },
    
    show : function(that,param,opacity){
      var animation = wx.createAnimation({
        //持续时间800ms
        duration: 800,
        timingFunction: 'ease',
      });
      //var animation = this.animation
      animation.opacity(opacity).step()
      //将param转换为key
      var json = '{"' + param + '":""}'
      json = JSON.parse(json);
      json[param] = animation.export()
      //设置动画
      that.setData(json)
    },
  
    //滑动渐入渐出
    slideupshow:function(that,param,px,opacity){
      var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease',
      });
      animation.translateY(px).opacity(opacity).step()
      //将param转换为key
      var json = '{"' + param + '":""}'
      json = JSON.parse(json);
      json[param] = animation.export()
      //设置动画
      that.setData(json)
    },
  
    //向右滑动渐入渐出
    sliderightshow: function (that, param, px, opacity) {
      var animation = wx.createAnimation({
        duration: 800,
        timingFunction: 'ease',
      });
      animation.translateX(px).opacity(opacity).step()
      //将param转换为key
      var json = '{"' + param + '":""}'
      json = JSON.parse(json);
      json[param] = animation.export()
      //设置动画
      that.setData(json)
    }
})
