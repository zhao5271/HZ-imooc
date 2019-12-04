import {SpuCode} from "./spu-code";
import {CellStatus} from "../../core/enum";

class Judger {
    fenceGroup
    pathDict = []

    constructor(fenceGroup) {
        this.fenceGroup = fenceGroup
        this.initPathDict()
    }

    // 拆解spec中规格的code码
    initPathDict() {
        this.fenceGroup.skuList.forEach(s => {
            const spuCode = new SpuCode(s.code)
            this.pathDict = this.pathDict.concat(spuCode.totalSegments)
        });
    }
    // 判断cell的状态
    judge(cell,x,y) {
        this._changeCurrentCellStatus(cell,x,y)
        // 回调函数直接传方法名即可，不需要传参
        this.fenceGroup.eachCell(this._changeOtherCellStatus)
    }

    _changeOtherCellStatus(cell, x, y) {

    }

    // 正反选改变cell状态
    _changeCurrentCellStatus(cell, x, y) {
        if (cell.status === CellStatus.WAITING) {
            // cell.status = CellStatus.SELECTED
            this.fenceGroup.fences[x].cells[y].status = CellStatus.SELECTED
        }
        if (cell.status === CellStatus.SELECTED) {
            // cell.status = CellStatus.WAITING
            this.fenceGroup.fences[x].cells[y].status = CellStatus.WAITING
        }
    }

}

export {
    Judger
}
