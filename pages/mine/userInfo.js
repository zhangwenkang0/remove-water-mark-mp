const app = getApp()
const util = require('../../utils/util.js');
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'


Page({
  data: {
    avatarUrl: defaultAvatarUrl,
    theme: wx.getSystemInfoSync().theme,
    nickName: ''
  },
  onLoad() {
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })
  },
  onChooseAvatar(e) {
    console.log("头像："+ e.detail.avatarUrl)
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl
    })
    var userInfo = wx.getStorageSync('userInfo')
    userInfo.avatarUrl = avatarUrl
    wx.setStorageSync('userInfo', userInfo)
  },
  submit(e) {
   var that = this;
   console.log(e.detail.value.nickname)
   app.apiRequest({
    url: util.endpoint.updateUser,
    method: 'POST',
    data: {
      "nickName": e.detail.value.nickname,
      "avatar": that.data.avatarUrl
    },
    success: res => {
      var userInfo = wx.getStorageSync('userInfo')
      console.log(userInfo)
      userInfo.nickName = e.detail.value.nickname
      wx.setStorageSync('userInfo', userInfo)
      wx.navigateBack();
    },
    fail: res =>{
      wx.showToast({
        title: '服务异常，请稍后再试',
        icon: 'none'
      })
    }
  })
  }
})
