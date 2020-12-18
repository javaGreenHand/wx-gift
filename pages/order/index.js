let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataType: 'all',
    list: [{
      pay_status : {value : 10, text: ''},
      order_status : {value : 10, text: ''},
      delivery_status : {value : 10, text: ''},
      receipt_status : {value : 10, text: ''},
      order_no : '20201217',
      create_time : '2020-12-17',
      order_id : '1',
      goods : [{
        image : {file_path : 'https://7465-test-s4i9y-1304539946.tcb.qcloud.la/u%3D2350451953%2C1009677349%26fm%3D26%26gp%3D0.jpg?sign=94dfd6c42ea834ac2237eb6123b5d6fc&t=1608194219'}
      },{
        image : {file_path : 'https://7465-test-s4i9y-1304539946.tcb.qcloud.la/u%3D2350451953%2C1009677349%26fm%3D26%26gp%3D0.jpg?sign=94dfd6c42ea834ac2237eb6123b5d6fc&t=1608194219'}
      },{
        image : {file_path : 'https://7465-test-s4i9y-1304539946.tcb.qcloud.la/u%3D2350451953%2C1009677349%26fm%3D26%26gp%3D0.jpg?sign=94dfd6c42ea834ac2237eb6123b5d6fc&t=1608194219'}
      }],
      pay_price : '9000'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.dataType = options.type || 'all';
    this.setData({ dataType: this.data.dataType });
  },

  /**
   * 生命周期函数--监听页面显示， 云开发
   */
  onShow: function () {
    // 获取订单列表
    // this.getOrderList(this.data.dataType);
  },

  /**
   * 获取订单列表
   */
  getOrderList: function (dataType) {
    let _this = this;
    App._get('user.order/lists', { dataType }, function (result) {
      _this.setData(result.data);
      result.data.list.length && wx.pageScrollTo({
        scrollTop: 0
      });
    });
  },

  /**
   * 切换标签
   */
  bindHeaderTap: function (e) {
    this.setData({ dataType: e.target.dataset.type });
    // 获取订单列表
    this.getOrderList(e.target.dataset.type);
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('user.order/cancel', { order_id }, function (result) {
            _this.getOrderList(_this.data.dataType);
          });
        }
      }
    });
  },

  /**
   * 确认收货
   */
  receipt: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('user.order/receipt', { order_id }, function (result) {
            _this.getOrderList(_this.data.dataType);
          });
        }
      }
    });
  },

  /**
   * 发起付款
   */
  payOrder: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    App._post_form('user.order/pay', { order_id }, function (result) {
      if (result.code === -10) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: 'prepay_id=' + result.data.prepay_id,
        signType: 'MD5',
        paySign: result.data.paySign,
        success: function (res) {
          // 跳转到已付款订单
          wx.navigateTo({
            url: '../order/detail?order_id=' + order_id
          });
        },
        fail: function () {
          App.showError('订单未支付');
        },
      });
    });
  },

  /**
   * 跳转订单详情页
   */
  detail: function (e) {
    let order_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../order/detail?order_id=' + order_id
    });
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  }


});