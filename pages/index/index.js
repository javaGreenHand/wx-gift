let App = getApp();
const db = wx.cloud.database({
  env: 'prod-6gyilzj48c550b50'
})

Page({
  data: {
    // banner轮播组件属性
    indicatorDots: true, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长
    imgHeights: {}, // 图片的高度
    imgCurrent: {}, // 当前banne所在滑块指针

    // 页面元素
    item: {
      data: [],
      style : {
        btnShape : "",
        btnColor : ""
      }
    },

    navi : [],

    scrollHeight: null,
    option: {},
    list: [],
    noList: false,
    no_more: false,
    page: 1,

    scrollTop: 0,
  },

  onLoad: function() {
    // 设置页面标题
    App.setTitle();
    // 获取banner图
    this.getIndexData();
    // 设置商品列表高度
    this.setListHeight();
    // 获取商品列表
    this.getGoodsList(true);
  },

  /**
   * 获取首页数据
   */
  getIndexData: function() {
    let _this = this;
    db.collection('banner').get().then(res => {
      for (var index in res.data){
        var banner = res.data[index];
        if(banner.type == 1){
          _this.setData({
            'item.data': banner.image
          });
        }else if(banner.type == 2){
          _this.setData({
            'navi': banner.image
          });
        }
      }
    })
  },

  bindChange: function(e) {
    let itemKey = e.target.dataset.itemKey,
      imgCurrent = this.data.imgCurrent;
    // imgCurrent[itemKey] = e.detail.current;
    imgCurrent[itemKey] = e.detail.currentItemId;
    this.setData({
      imgCurrent
    });
  },

  goTop: function(t) {
    this.setData({
      scrollTop: 0
    });
  },

  /**
   * 下拉到底加载数据, 云开发
   */
  bindDownLoad: function (t) {
    t.detail.scrollTop > 300 ? this.setData({
      floorstatus: !0
    }) : this.setData({
      floorstatus: !1
    });

    if (this.data.page >= this.data.list.last_page) {
      this.setData({
        no_more: true
      });
      return false;
    }
    this.getGoodsList(false, ++this.data.page);
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

  onShareAppMessage: function() {
    return {
      title: "小程序首页",
      desc: "",
      path: "/pages/index/index"
    };
  }
});