import { SkuCode } from './sku-code'
import { CellStatus } from '../../core/enum'
import { SkuPending } from './sku-pending'
import { Joiner } from '../../utils/joiner'

class Judger {
  fenceGroup
  skuPending
  pathDict = []

  constructor (fenceGroup) {
    this.fenceGroup = fenceGroup
    // 初始化 路径字典需要在初始化cell规则之前
    this._initPathDict()
    this._initSkuPending()
  }

  isSkuIntact () {
    return this.skuPending.isSkuIntact()
  }
  // 获取选中的 属性的 值
  getCurrentValues () {
    return this.skuPending.getCurrentSpecValue().toString()
  }

  // 通过从 skuPending 返回的 缺失 的index数组，获取 fences的title
  getMissingKeys () {
    const missingKeysIndex = this.skuPending.getMissingSpecKeys()
    return missingKeysIndex.map(i => {
      return this.fenceGroup.fences[i].title
    })
  }

  // 初始实例化skuPending对象
  _initSkuPending () {
    const specsLength = this.fenceGroup.fences.length
    this.skuPending = new SkuPending(specsLength)
    const defaultSku = this.fenceGroup.getDefaultSku()
    if (!defaultSku) {
      return
    }
    // 利用SkuPending类下的init方法将 默认 sku 拆解存储到skuPending中
    this.skuPending.init(defaultSku)
    this._initDefaultCell()
    this.judge(null,null,null,true)
  }

    // sku的默认规格渲染
  _initDefaultCell () {
    // skuPending 中的pending数组 存储的就是 已选中的cell
    this.skuPending.pending.forEach(cell => {
      this.fenceGroup.setCellStatusByID(cell.id,CellStatus.SELECTED)
    })
  }

  // 拆解spec中规格的code码
  _initPathDict () {
    this.fenceGroup.skuList.forEach(s => {
      const spuCode = new SkuCode(s.code)
      this.pathDict = this.pathDict.concat(spuCode.totalSegments)
    })
  }

  // 判断，修改cell的状态,
  //  isInit 表示是否在初始化的时候调用changeCurrentCellStatus方法
  judge (cell, x, y, isInit=false) {
    if (!isInit) {
      this._changeCurrentCellStatus(cell, x, y)
    }
    // 遍历fenceGroup返回的单个cell属性
    this.fenceGroup.eachCell((cell, x, y) => {
      const path = this._findPotentialPath(cell, x, y)
      // 如果path为空，该cell以被选中不需要再判断它的status
      if (!path) {
        return
      }
      // 判断cell路径是否在路径字典中，在为可选状态，不在则禁用状态
      const isIn = this._isInDict(path)
      if (isIn) {
        this.fenceGroup.setCellStatusByXY(x,y,CellStatus.WAITING)
      } else {
        this.fenceGroup.setCellStatusByXY(x,y,CellStatus.FORBIDDEN)
      }
    })
  }
  // 获取确定的 sku,为了避免 sku-pending在获取skuCode时，获取的不是完整的sku路径
  // 与 sku_list中 sku 的 code码 进行比较，相同则完整
  getDeterminateSku () {
    const code = this.skuPending.getSkuCode()
    const sku = this.fenceGroup.getSku(code)
    return sku
  }

  // 判断该路径是否是合格的潜在路径,true则将状态改成waiting，false则为forbidden
  _isInDict (path) {
    return this.pathDict.includes(path)
  }

  // 改变其他cell状态时需要先检测潜在路径，检测潜在路径只需要一行一行的检测即可
  // x表示当前行，y表示当前列
  _findPotentialPath (cell, x, y) {
    const joiner = new Joiner("#")

    for (let i = 0; i < this.fenceGroup.fences.length; i++) {
      // 这里判断cell是否被选中，如果被选中则path返回空
      // 判断同一行中的cell是否有被选中的，
      if (this.skuPending.isSelected(cell, x)) {
        return
      }
      // 此处传入i值，可以达到遍历的效果
      const selected = this.skuPending.findSelectedCellByX(i)

      // 当前行,不需要进行判断，直接添加其潜在路径
      if (x === i) {
        const cellCode = this._getCellCode(cell.spec)
        joiner.join(cellCode)
      }
      // 其他行,需要先判断是否被选中，选中则添加其潜在路径
      //  判断其他行的元素是否被选中，需要我们在skuPending中进行处理，
      //  skuPending中存储了所有已选中的元素，进行对比即可
      else {
        if (selected) {
          const selectedCellCode = this._getCellCode(selected.spec)
          joiner.join(selectedCellCode)
        }
      }
    }
    // 通过遍历所有的路径，来对正选和反选的cell重新拼接code码
    return joiner.getStr()
  }

  // 取出一对属性的名与值对应的id，用-拼接起来，形成一个路径
  _getCellCode (spec) {
    return spec.key_id + '-' + spec.value_id
  }

  // 用户主动点击改变当前选中的cell状态,并且调用skuPending类中的方法，对潜在路径进行调整
  _changeCurrentCellStatus (cell, x, y) {
    if (cell.status === CellStatus.WAITING) {
      this.fenceGroup.setCellStatusByXY(x,y,CellStatus.SELECTED)
      this.skuPending.insertCell(cell, x)
    }
    if (cell.status === CellStatus.SELECTED) {
      this.fenceGroup.setCellStatusByXY(x,y,CellStatus.WAITING)
      this.skuPending.removeCell(x)
    }
  }

}

export {
  Judger
}
