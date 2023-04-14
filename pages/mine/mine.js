const util = require('../../utils/util.js');
var app = getApp();

Component({
  data: {
    dailyFreeParseNum: '--',
    totalParseNum: '--',
    userInfo: null,
    hasUserInfo: false,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onLoad: function () {},
    onShow: function () {
      if (!app.checkIsLogin()) {
        console.info("未登录")
      }else{
        console.info("已登录")
        console.info("用户信息是否存在:"+wx.getStorageSync('userInfo'))
        var userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
          this.updateUserInfo(userInfo)
        }
        // 获取每日剩余免费解析次数
        this.getDailyFreeParseNum();
        // 获取当前用户总解析次数
        this.getTotalParseNum();
      }
    },

    updateUserInfo(userInfo){
      app.apiRequest({
        url: util.endpoint.getUser,
        success: res => {
          console.info("用户信息")
          console.info(wx.getStorageSync('userInfo'))
          userInfo.nickName = res.data.name
          wx.setStorageSync('userInfo', userInfo)
          this.setData({
            userInfo: wx.getStorageSync('userInfo'),
            hasUserInfo: true,
          })
        }
      })
    },
    /**
     * 授权登录
     */
    getUserInfo(e) {
      if (e.detail.errMsg !== 'getUserInfo:ok') {
        wx.showToast({
          title: '未授权，登录失败',
          icon: 'none'
        })
        return false;
      }
      wx.showLoading({
        title: "正在登录",
        mask: true
      });
      // 执行登录
      app.getUserInfo(res => {
        this.setData({
          userInfo: wx.getStorageSync('userInfo'),
          hasUserInfo: true,
        })
        this.updateUserInfo(wx.getStorageSync('userInfo'))
        wx.hideLoading();
        var that = this;
        setTimeout(function () {
          // 获取每日剩余免费解析次数
          that.getDailyFreeParseNum();
          // 获取当前用户总解析次数
          that.getTotalParseNum();
        }, 1000)
      })
    },

    /**
     * 获取当日免费次数
     * 使用本地存储，不走服务端
     */
    getDailyFreeParseNum() {
        app.apiRequest({
          url: util.endpoint.getFreeNum,
          success: res => {
            wx.setStorageSync('dailyFreeParseNum', res.data);
            this.setData({
              dailyFreeParseNum: res.data
            })
          }
        })
    },

    /**
     * 获取总解析次数
     */
    getTotalParseNum() {
      app.apiRequest({
        url: util.endpoint.getTotalParseNum,
        success: res => {
          this.setData({
            totalParseNum: res.data.total_num
          })
        }
      })
    },

    //打赏
    showQrcode() {
      wx.previewImage({
        urls: ['https://upload-images.jianshu.io/upload_images/13046507-cdd002dccc41015a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'],
        current: 'https://upload-images.jianshu.io/upload_images/13046507-cdd002dccc41015a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240' // 当前显示图片的http链接
      })
    },
    toUserInfo(){
      if(this.data.hasUserInfo){
        wx.navigateTo({
          url: '/pages/mine/userInfo',
        })
      }
    },
    //分享小程序
    onShareAppMessage: function () {
      return {
        title: '推荐一款超好用的视频去水印工具，免费解析不限次，大家都在用',
        path: '/pages/index/index',
        imageUrl: util.shareImage
      }
    },
  }
})