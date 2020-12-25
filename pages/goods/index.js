let App = getApp()

const db = wx.cloud.database({
  env: 'prod-6gyilzj48c550b50'
})

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav_select: false, // 快捷导航

    indicatorDots: true, // 是否显示面板指示点
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长

    currentIndex: 1, // 轮播图指针
    floorstatus: false, // 返回顶部
    showView: false, // 显示商品规格

    detail: {}, // 商品详情
  },

  // 记录规格的数组
  goods_spec_arr: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _this = this;
    // 商品id
    _this.data.id = options.id;
    // 获取商品信息
    _this.getGoodsDetail();
  },

  /**
   * 获取商品信息, 云开发
   */
  getGoodsDetail() {
    let _this = this;

    db.collection('goods').doc(_this.data.id).get().then(result => {
      // 初始化商品详情数据
      // 待研究
      let data = _this.initGoodsDetailData(result.data);
      _this.setData({
        detail: data
      });
    })
  },

  /**
   * 初始化商品详情数据
   */
  initGoodsDetailData(data) {
    let _this = this;
    // 富文本转码
    if (data.content.length > 0) {
      data.content = App.towxml(data.content, 'html');
    }
    // 商品价格/划线价/库存
    // data.goods_sku_id = data.detail.spec[0].spec_sku_id;
    // data.goods_price = data.detail.spec[0].goods_price;
    // data.line_price = data.detail.spec[0].line_price;
    // data.stock_num = data.detail.spec[0].stock_num;
    // 初始化商品多规格
    // if (data.detail.spec_type == 20) {
    //   data.specData = _this.initManySpecData(data.specData);
    // }
    return data;
  },

  /**
   * 初始化商品多规格
   */
  initManySpecData(data) {
    for (let i in data.spec_attr) {
      for (let j in data.spec_attr[i].spec_items) {
        if (j < 1) {
          data.spec_attr[i].spec_items[0].checked = true;
          this.goods_spec_arr[i] = data.spec_attr[i].spec_items[0].item_id;
        }
      }
    }
    return data;
  },

  /**
   * 点击切换不同规格
   */
  modelTap(e) {
    let attrIdx = e.currentTarget.dataset.attrIdx,
      itemIdx = e.currentTarget.dataset.itemIdx,
      specData = this.data.specData;
    for (let i in specData.spec_attr) {
      for (let j in specData.spec_attr[i].spec_items) {
        if (attrIdx == i) {
          specData.spec_attr[i].spec_items[j].checked = false;
          if (itemIdx == j) {
            specData.spec_attr[i].spec_items[itemIdx].checked = true;
            this.goods_spec_arr[i] = specData.spec_attr[i].spec_items[itemIdx].item_id;
          }
        }
      }
    }
    this.setData({
      specData
    });
    // 更新商品规格信息
    this.updateSpecGoods();
  },

  /**
   * 更新商品规格信息
   */
  updateSpecGoods() {
    let spec_sku_id = this.goods_spec_arr.join('_');

    // 查找skuItem
    let spec_list = this.data.specData.spec_list,
      skuItem = spec_list.find((val) => {
        return val.spec_sku_id == spec_sku_id;
      });

    // 记录goods_sku_id
    // 更新商品价格、划线价、库存
    if (typeof skuItem === 'object') {
      this.setData({
        goods_sku_id: skuItem.spec_sku_id,
        goods_price: skuItem.form.goods_price,
        line_price: skuItem.form.line_price,
        stock_num: skuItem.form.stock_num,
      });
    }
  },

  /**
   * 设置轮播图当前指针 数字
   */
  setCurrent(e) {
    this.setData({
      currentIndex: e.detail.current + 1
    });
  },

  /**
   * 控制商品规格/数量的显示隐藏
   */
  onChangeShowState() {
    this.setData({
      showView: !this.data.showView
    });
  },

  /**
   * 返回顶部
   */
  goTop(t) {
    this.setData({
      scrollTop: 0
    });
  },

  /**
   * 显示/隐藏 返回顶部按钮
   */
  scroll(e) {
    this.setData({
      floorstatus: e.detail.scrollTop > 200
    })
  },

  /**
   * 增加商品数量
   */
  up() {
    this.setData({
      goods_num: ++this.data.goods_num
    })
  },

  /**
   * 减少商品数量
   */
  down() {
    if (this.data.goods_num > 1) {
      this.setData({
        goods_num: --this.data.goods_num
      });
    }
  },

  /**
   * 分享当前页面
   */
  onShareAppMessage: function () {
    // 构建页面参数
    let _this = this;
    return {
      title: _this.data.detail.goods_name,
      path: "/pages/goods/index?goods_id=" + _this.data.goods_id
    };
  },

})