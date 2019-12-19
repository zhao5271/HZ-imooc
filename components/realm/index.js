import { FenceGroup } from '../models/fence-group'
import { Judger } from '../models/judger'
import { Spu } from '../../models/spu'
import { Cell } from '../models/cell'
import { Cart } from '../models/cart'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spu: Object,
    orderWay: String
  },
  data: {
    judger: Object,
    previewImg: String,
    title: String,
    price: Number,
    discountPrice: Number,
    stock: Number, // 表示库存容量
    noSpec: Boolean,  // 表示是否有 规格值，若无则只有一个sku值
    skuIntack: Boolean, // 是否有完整的 sku 规格值，有了完整sku才会计算价格等信息
    currentValues: Array, // 渲染选择完毕后的 属性值
    missingKeys: Array, // 渲染 未选择 的 属性名
    outStock: Boolean,  // 判断是否缺货
    currentSkuCount: Cart.SKU_MIN_COUNT, // 购买商品的数量
    noSpecStock: Number // 标明 无规格 spu 商品的 库存
  },

// 判断商品是否为无规格，这样可以免去 矩阵转置的操作
  observers: {
    'spu': function (spu) {
      if (!spu) {
        return
      }
      if (Spu.isNoSpec(spu)) {
        this.processNoSpec(spu)
      } else {
        this.processHasSpec(spu)
      }
      this.triggerSpecEvent()
    }
  },
  methods: {
    // spu产品无规格值
    processNoSpec (spu) {
      /*this.setData({
        noSpec:true
      })*/
      this.data.noSpec = true
      this.data.noSpecStock = spu.sku_list[0].stock
      this.bindSkuData(spu.sku_list[0])
      this.setStockStatus(this.data.noSpecStock)
    },
    // spu产品有规格值
    processHasSpec (spu) {
      const fenceGroup = new FenceGroup(spu)
      fenceGroup.initFences()
      this.data.judger = new Judger(fenceGroup)
      // 判断是否有默认的sku，无则绑定spu数据
      const defaultSku = fenceGroup.getDefaultSku()
      if (defaultSku) {
        this.bindSkuData(defaultSku)
        // 对默认的 sku 也进行判断，防止购买数量超过 库存量
        this.setStockStatus(defaultSku.stock)
      } else {
        this.bindSpuData()
      }
      this.bindTipData()
      this.bindFenceGroupData(fenceGroup)
    },
    // 将realm组件中的数据传递到父组件中
    triggerSpecEvent () {
      const noSpec = Spu.isNoSpec(this.properties.spu)
      // 这里的判断是为了避免，无规格产品下没有 judger 而引发的报错
      if (noSpec) {
        this.triggerEvent('specChange', {
          noSpec
        })
      } else {
        this.triggerEvent('specChange',{
          noSpec,
          skuIntact: this.data.judger.isSkuIntact(),
          currentValues: this.data.judger.getCurrentValues(),
          missingKeys: this.data.judger.getMissingKeys()
        })
      }
    },

    // 绑定初始化数据
    bindFenceGroupData (fenceGroup) {
      this.setData({
        fences: fenceGroup.fences
      })
    },
    // 绑定 spu 和 sku数据
    bindSpuData () {
      const spu = this.properties.spu
      this.setData({
        previewImg: spu.img,
        title: spu.title,
        price: spu.price,
        discountPrice: spu.discount_price,
      })
    },
    bindSkuData (sku) {
      this.setData({
        previewImg: sku.img,
        title: sku.title,
        price: sku.price,
        discountPrice: sku.discount_price,
        stock: sku.stock,
      })
    },
    bindTipData () {
      this.setData({
        skuIntact: this.data.judger.isSkuIntact(),
        currentValues: this.data.judger.getCurrentValues(),
        missingKeys: this.data.judger.getMissingKeys()
      })
    },
    //  判断购买数量是否超过库存数量, 超过则缺货 返回false
    isOutOfStock (stock,currentCount) {
      return stock < currentCount
    },
    setStockStatus (stock) {
      this.setData({
        outStock: this.isOutOfStock(stock, this.data.currentSkuCount)
      })
    },
    // count 组件的加减按钮，点击时触发，获取其 数量
    onSelectCount (event) {
      this.data.currentSkuCount = event.detail.count
      // 先判断是否为完整sku，然后增加数量的时候和 库存量进行比较，更新是否缺货
      // 由于 无规则 产品下面没有 judger对象，所以需要多层判断
      if(this.data.noSpec){
        this.setStockStatus(this.data.noSpecStock)
      } else if(this.data.judger.isSkuIntact()){
        const sku = this.data.judger.getDeterminateSku()
        this.setStockStatus(sku.stock)
      }
    },

    // cell中包含属性值，status；x表示行号，y表示列号
    // 此处的cell对象是经过小程序渲染，和原来的cell引用对象不同
    // 所以需要获取cell的行列号，重新进入Fences下的cell中改变它的status
    // 处理用户点击变更 spu 规格 的方法， 回调函数
    onCellTap (event) {
      const data = event.detail.cell
      const x = event.detail.x
      const y = event.detail.y

      // 将 cell 强制 从 小程序渲染对象 转化 成原生的模型对象
      // 小程序渲染的对象只会保留 属性和数据，不会保留方法，不利类 下面方法的调用
      const cell = new Cell(data.spec)
      cell.status = data.status
      // 每次点击规格，都会触发judger中的judge方法，对规格进行判断
      const judger = this.data.judger
      judger.judge(cell, x, y)

      const skuIntact = judger.isSkuIntact()
      if (skuIntact) {
        const currentSku = judger.getDeterminateSku()
        this.bindSkuData(currentSku)
        this.setStockStatus(currentSku.stock)
      }
      // 改变 商品 请选择和已选择的状态
      this.bindTipData()
      this.bindFenceGroupData(judger.fenceGroup)
      this.triggerSpecEvent()
    }
  }
})

/*
* SKU算法是为了提高前端页面的用户体验
* 核心问题：确定规格的状态—— 选中/可选/禁选
* 本质：确定禁用状态
* 规律：每当用户进行一次规格值的选择，所有的规格值都需要重新去确认状态
*
* 1. 待确定的SKU路径（关键） == 潜在路径
* 2. 已存在的SKU路径
*
* 字典（）中存放所有存在的规格路径
* 单个属性/两个属性/三个属性
* */
