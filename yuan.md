# 4/23
完成了头像，昵称（授权获取）
创建一个基础云函数获取openID
意向岗位中的工作地点packer选择和工资范围选择，添加了两个数据表
person(用于用户间获取头像和昵称)
worker（用于记录员工的基本信息）
可能还要加一个在线简历的数据表
# 4/24
添加并完成了在线简历页
![](https://img-blog.csdnimg.cn/9570698cea8a4a4c99a5accf4320c555.png)
![](https://img-blog.csdnimg.cn/552bc847bea44ff198f9c74381cad86b.png)

在线简历表的数据结构全部存储在一个数组中

![](https://img-blog.csdnimg.cn/243033f5a28644f2bac5a3aa68a7073a.png)
![](https://img-blog.csdnimg.cn/314abd2c519d408e8df9d250b554b903.png)

学历信息同样为一个数组，在info数组中只存了index对应关系如注释

已有的三个关系表参考CMS内容模型

注意在app.js新添加了三个全局变量

# 5/7
写好了boss发布招聘逻辑，新建了招聘信息数据表，请在CMS查看
![](https://img-blog.csdnimg.cn/8c3f894d401d4c0cbe11c1ee7af0f262.png)

# 5/8
实现一些动态效果，动画函数在app.js全局可用
![](https://img-blog.csdnimg.cn/e353e9810c254f328b7a3a65207d3d0b.gif)

# 5/12
实现打工人与老板双页面切换，以及创建单独页面用于选择意向岗位
![](https://img-blog.csdnimg.cn/98cda941038645229c2ec7d1bd668204.gif)