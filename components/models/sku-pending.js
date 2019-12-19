
// 这个类主要用来存储用户选择完规格值之后的一系列操作
// 记录和移除用户每次选择或反选的规格值
import { Cell } from './cell'
import { Joiner } from '../../utils/joiner'

class SkuPending {
  // pending是存放已选中的cell对象的数组
  pending = []
  size // 表示完整的 sku 规格的个数

  constructor (size) {
    this.size = size
  }

  // 默认的sku是sku_list下的一个对象，specs是sku下存放属性的数组
  // 将取到的每一个cell都存入到pending中
  init (sku) {
    this.size = sku.specs.length
    for (let i = 0; i < sku.specs.length; i++) {
      const cell = new Cell(sku.specs[i])
      this.insertCell(cell,i)
    }
  }
  // 查找已经选择的spec
  getCurrentSpecValue () {
    const values = this.pending.map(cell => {
      return cell ? cell.spec.value : null
    })
    return values
  }
  // 查找缺失的 spec 在 pending 中的序号
  getMissingSpecKeys () {
    const keysIndex = []
    for (let i = 0; i < this.size; i++) {
      if (!this.pending[i]) {
        keysIndex.push(i)
      }
    }
    return keysIndex
  }
  // 用户每次重新选择完整的 sku路径后，
  // 重新计算 skuCode，使用连接符，返回一个新的 字符串 code
  getSkuCode () {
    const joiner = new Joiner("#")
    this.pending.forEach(cell => {
      const cellCode = cell.getCellCode()
      joiner.join(cellCode)
    })
    return joiner.getStr()
  }
  // 返回true表示用户选择了一个完整的sku路路径，可以加载名称和价格等数据
  isSkuIntact () {
    // 遍历 pending 数组，如果当中有一个为空，则作废
    for (let i = 0; i < this.size; i++) {
      if (this._isEmptyPart(i)) {
        return false
      }
    }
    return true
  }

  // 判断 pending 下是不是undefined
  _isEmptyPart (index) {
    return this.pending[index] ? false : true
  }

  // 因为潜在路径需要保持一定的顺序，所以不能随意的使用push方法
  // 正选操作，x代表规格值的行号，将获取到的cell对象存储到pending数组中，保持路径顺序
  insertCell (cell, x) {
    this.pending[x] = cell
  }

  // 反选操作,将对应行的cell从pending数组中清除
  removeCell (x) {
    this.pending[x] = null
  }

  findSelectedCellByX (x) {
    return this.pending[x]
  }

  // 判断同一行中的cell是否选中，
  // 传入的cell和存入到pending数组中已选中的cell进行比较，
  isSelected (cell, x) {
    const pendingCell = this.pending[x]
    if (!pendingCell) {
      return false
    }
    return cell.id === pendingCell.id
  }
}

export {
  SkuPending
}

