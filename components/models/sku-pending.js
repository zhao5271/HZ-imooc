
// 这个类主要用来存储用户选择完规格值之后的一系列操作
// 记录和移除用户每次选择或反选的规格值
class SkuPending {
  // pending是存放已选中的cell对象的数组
  pending = []

  constructor () {

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

