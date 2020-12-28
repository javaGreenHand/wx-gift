let App = getApp();
const db = wx.cloud.database({
  env: 'prod-6gyilzj48c550b50'
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    userInfo: {},
    orderCount: {},
    image: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    db.collection('banner').get().then(res => {
      for (var index in res.data){
        var banner = res.data[index];
        if(banner.type == 3){
          _this.setData({
            'image': banner.image[0]
          });
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let _this = this;
    _this.setData({
      isLogin: App.checkIsLogin()
    });
    if (_this.data.isLogin) {
      // 获取当前用户信息
      _this.getUserDetail();
    }
  },

  /**
   * 获取当前用户信息
   */
  getUserDetail() {
    let _this = this;
    App._get('user.index/detail', {}, result => {
      _this.setData(result.data);
    });
  },

  /**
   * 订单导航跳转
   */
  onTargetOrder(e) {
    let _this = this;
    // if (!_this.onCheckLogin()) {
    //   return false;
    // }
    let urls = {
      all: '/pages/order/index?type=all',
      payment: '/pages/order/index?type=payment',
      delivery: '/pages/order/index?type=delivery',
      received: '/pages/order/index?type=received'
    };
    // 转跳指定的页面
    wx.navigateTo({
      url: urls[e.currentTarget.dataset.type]
    })
  },

  /**
   * 菜单列表导航跳转
   */
  onTargetMenus(e) {
    let _this = this;
    if (!_this.onCheckLogin()) {
      return false;
    }
    wx.navigateTo({
      url: '/' + e.currentTarget.dataset.url
    })
  },

  /**
   * 跳转到登录页
   */
  onLogin() {
    wx.navigateTo({
      url: '../login/login',
    });
  },

  /**
   * 验证是否已登录
   */
  onCheckLogin() {
    let _this = this;
    if (!_this.data.isLogin) {
      App.showError('很抱歉，您还没有登录');
      return false;
    }
    return true;
  },


})