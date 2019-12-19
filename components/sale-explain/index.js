// components/sale-explain/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    texts: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    _texts: Array
  },

  observers: {
    // 不直接将texts 放入setData 是为了避免陷入死循环，导致内存泄漏
    'texts': function (texts) {
      console.log(texts)
      this.setData({
        _texts: texts
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
