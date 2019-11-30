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
    judge(cell) {
        Judger._changeCellStatus(cell)
    }
    // 正反选改变cell状态
    static _changeCellStatus(cell) {
        if (cell.status === CellStatus.WAITING) {
            cell.status = CellStatus.SELECTED
        }
        if (cell.status === CellStatus.SELECTED) {
            cell.status = CellStatus.WAITING
        }
    }

}

export {
    Judger
}
