const util = require('/utils/util.js');
App({
  onLaunch: function () {
    this.getUserInfo();
  },

  /**
   * 登陆并获取用户信息、token
   * @param {*} callback 
   */
  getUserInfo: function (callback = null) {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            wx.setStorageSync('userInfo', res.userInfo)
            // this.globalData.userInfo = res.userInfo
            // this.globalData.hasUserInfo = true
            if (!this.checkIsLogin()) {
              this.getToken(code, res.encryptedData, res.iv);
            }

            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            callback && callback(res);
          }
        })

      }
    });
  },

  globalData: {
    userInfo: null,
    hasUserInfo: false,
    defaultDailyFreeParseNum: 10,
  },

  //全局统一调用接口的方法
  apiRequest: function (options) {
    wx.request({
      url: util.endpoint.apiDomain + options.url,
      method: options.method ? options.method : 'GET',
      header: {
        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
        'Accept': 'application/json',
      },
      dataType: 'json',
      data: options.data,
      success: res => {
        switch (res.statusCode) {
          case 200:
            options.success(res);
            break;
          case 401:
            this.toLogin();
            break;
          case 422:
            break;
          case 404:
            wx.showToast({
              title: '请求地址不存在',
              icon: 'none'
            })
            break;
          default:
            wx.showToast({
              title: '出错了～请稍后再试',
              icon: 'none'
            })
        }
      },
      fail: res => {
        if (options.fail) {
          options.fail(res);
        }
      },
      complete: res => {
        if (options.complete) {
          options.complete(res);
        }
      }
    });
  },

  /**
   * 验证登录
   */
  checkIsLogin(autoLogin = false) {
    if (wx.getStorageSync('token') != '') {
      return true;
    }
    if (autoLogin) {
      this.toLogin();
    } else {
      return false;
    }
  },

  /**
   * 跳转登陆页
   */
  toLogin() {
    // this.globalData.hasUserInfo = false;
    // this.globalData.userInfo = null;
    wx.removeStorageSync('token');
    wx.showToast({
      title: '请先登陆!',
      icon: 'none',
      success: res => {
        wx.switchTab({
          url: '/pages/mine/mine'
        })
      }
    })
  },

  /**
   * 获取token
   */
  getToken(code, encryptedData, iv, callback = null) {
    var that = this;
    //调后端接口获取token
    this.apiRequest({
      url: '/auth/login',
      method: 'POST',
      data: {
        'code': code,
        'data': encryptedData,
        'iv': iv
      },
      success: res => {
        wx.setStorageSync('token', res.data.token);
        callback && callback();
      }
    });
  },

});