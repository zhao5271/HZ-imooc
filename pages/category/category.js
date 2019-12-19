import { getWindowHeightRpx } from '../../utils/system'
import { Categories } from '../../models/categories'
import { SpuListType } from '../../core/enum'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultRootId:2, // 默认选中的一级分类的id
    categories: Object, // 存储 实例化后的 categories 对象
    roots: Array, // 一级分类
    currentSubs: Array, // 二级分类
    currentBannerImg: String // 二级分类所对应的 banner图
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.initCategoryData()
    this.setDynamicSegmentHeight()
  },
  // 初始化所有的分类数据
  async initCategoryData () {
    const categories = new Categories()
    this.data.categories = categories
    await categories.getAll()
    const roots = categories.getRoots()
    const defaultRoot = this.getDefaultRoot(roots)
    const currentSubs = categories.getSubs(defaultRoot.id)
    this.setData({
      roots,
      currentSubs,
      currentBannerImg: defaultRoot.img
    })
  },
  // 选项卡点击改变时触发的事件
  onSegChange (event) {
    const rootId = event.detail.activeKey
    const currentSubs = this.data.categories.getSubs(rootId)
    const currentRoot = this.data.categories.getRoot(rootId)
    this.setData({
      currentSubs,
      currentBannerImg: currentRoot.img
    })
  },

  // 获取默认的分类数据
  getDefaultRoot (roots) {
    let defaultRoot = roots.find( r => r.id === this.data.defaultRootId)
    if (!defaultRoot) {
      defaultRoot = roots[0]
    }
    return defaultRoot
  },

  // 动态设置segment选项卡的高度
  async setDynamicSegmentHeight () {
    const h = await getWindowHeightRpx() - 60 - 20 - 2
    this.setData({
      segHeight: h
    })
  },
  // 跳转到 搜索页面
  onGotoSearch (event) {
    wx.navigateTo({
      url: `/pages/search/search`
    })
  },
  // 跳转到 spuList页面
  onJumpToSpuList (event) {
    const cid = event.detail.cid
    wx.navigateTo({
      url: `/pages/spu-list/spu-list?cid=${cid}&type=${SpuListType.SUB_CATEGORY}`
    })
  }
})
