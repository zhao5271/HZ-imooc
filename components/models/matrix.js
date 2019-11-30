class Matrix {

    m

    constructor(matrix) {
        this.m = matrix
    }

    get rowsNum() {
        return this.m.length
    }

    get colsNum() {
        return this.m[0].length
    }

    // 矩阵转置
    transpose(){
        const desArr = []
        for(let j= 0;j<this.colsNum;j++){
            // 这样desArr就是一个二维数组,j表示列号，i表示行号
            desArr[j] = []
            for (let i = 0; i < this.rowsNum; i++) {
                desArr[j][i] = this.m[i][j]
            }
        }
        return desArr
    }
}

export {
    Matrix
}