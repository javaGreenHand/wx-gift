let App = getApp();
const db = wx.cloud.database({
  env: 'prod-6gyilzj48c550b50'
})
Page({
  data: {
    scrollHeight: null,

    option: {},
    list: [],

    noList: false,
    no_more: false,
    page: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let _this = this;

    // 设置商品列表高度
    _this.setListHeight();
    // 记录option
    _this.setData({
      option
    }, function () {
      // 获取商品列表
      _this.getGoodsList(true);
    });

  },

  /**
   * 获取商品列表, 云开发
   */
  getGoodsList: function (is_super, page) {
    let _this = this;
    let limit = 10;
    if (undefined == page) {
      page = 0;
    }else{
      page = page - 1;
    }

    db.collection('goods').count().then(res => {
      db.collection('goods').skip(page * limit).limit(limit).get().then(result => {
        let resultList = result,
          dataList = _this.data.list;
          resultList.last_page = res.total / limit;
        if (is_super === true || typeof dataList === 'undefined') {
          // typeof dataList.data === 'undefined'
          _this.setData({
            list: resultList,
            noList: false
          });
        } else {
          _this.setData({
            'list.data': dataList.data.concat(resultList.data)
          });
        }
      })
    })
  },

  /**
   * 设置商品列表高度
   */
  setListHeight: function () {
    let _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          scrollHeight: res.windowHeight,
        });
      }
    });
  },

  /**
   * 跳转筛选
   */
  toSynthesize: function (t) {
    wx.navigateTo({
      url: "../category/screen?objectId="
    });
  },

  /**
   * 下拉到底加载数据, 云开发
   */
  bindDownLoad: function () {
    // 已经是最后一页
    if (this.data.page >= this.data.list.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    }
    this.getGoodsList(false, ++this.data.page);
  },

});