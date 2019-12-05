import { SkuCode } from './sku-code'
import { CellStatus } from '../../core/enum'
import { SkuPending } from './sku-pending'
import { Cell } from './cell'
import { Joiner } from '../../utils/joiner'

class Judger {
  fenceGroup
  pathDict = []
  skuPending

  constructor (fenceGroup) {
    this.fenceGroup = fenceGroup
    this._initSkuPending()
    this._initPathDict()
  }

  // 初始实例化skuPending对象
  _initSkuPending () {
    this.skuPending = new SkuPending()
  }

  // 拆解spec中规格的code码
  _initPathDict () {
    this.fenceGroup.skuList.forEach(s => {
      const spuCode = new SkuCode(s.code)
      this.pathDict = this.pathDict.concat(spuCode.totalSegments)
    })
  }

  // 判断cell的状态
  judge (cell, x, y) {
    this._changeCurrentCellStatus(cell, x, y)
    this.fenceGroup.eachCell((cell, x, y) => {
      const path = this._findPotentialPath(cell, x, y)
      // 如果path为空，该cell以被选中不需要再判断它的status
      if (!path) {
        return
      }
      const isIn = this._isInDict(path)
      if (isIn) {
        this.fenceGroup.fences[x].cells[y].status = CellStatus.WAITING
      } else {
        this.fenceGroup.fences[x].cells[y].status = CellStatus.FORBIDDEN
      }
    })
  }

  // 判断该路径是否是合格的潜在路径,true则将状态改成waiting，false则为forbidden
  _isInDict (path) {
    return this.pathDict.includes(path)
  }

  /*改变除选中之外其他cell的状态
  _changeOtherCellStatus (cell, x, y) {
    const path = this._findPotentialPath(cell, x, y)
    console.log(path)
  }*/

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

  // 改变当前选中的cell状态,并且调用skuPending类中的方法，对潜在路径进行调整
  _changeCurrentCellStatus (cell, x, y) {
    if (cell.status === CellStatus.WAITING) {
      this.fenceGroup.fences[x].cells[y].status = CellStatus.SELECTED
      this.skuPending.insertCell(cell, x)
    }
    if (cell.status === CellStatus.SELECTED) {
      this.fenceGroup.fences[x].cells[y].status = CellStatus.WAITING
      this.skuPending.removeCell(x)
    }
  }

}

export {
  Judger
}
