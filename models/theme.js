import {Http} from "../utils/http";

class Theme {
    static locationA = 't-1';
    static locationE = 't-2';
    static locationF = 't-3';
    static locationH = 't-4';

    themes = []

    // 扩展性
    async getThemes() {
        const names = `${Theme.locationA},${Theme.locationE},${Theme.locationF},${Theme.locationH}`
        // 为数组themes赋值
        this.themes = await Http.request({
            url: 'theme/by/names',
            data: {
                names
            }
        })
    }
    /*
    * 何时需要加await
    * 如果await语句后还有需要执行的代码，且需要await语句返回的结果，那么需要添加await
    *
    * 何时需要加async
    * async可以将一个方法返回的结果强制保存成promise类型的数据，
    * 如果方法不需要返回promise类型，或者本来就是promise则可加可不加
    * */

    getHomeLocationA() {
        return this.themes.find(t => t.name === Theme.locationA)
    }

    getHomeLocationE() {
        return this.themes.find(t => t.name === Theme.locationE)
    }

    getHomeLocationF(){
        return this.themes.find(t => t.name === Theme.locationF)
    }

    getHomeLocationH(){
        return this.themes.find(t => t.name === Theme.locationH)
    }

    static getHomeLocationESpu() {
        return Theme.getSpuByName(Theme.locationE)
    }

    static getSpuByName(name) {
        return Http.request({
            url: `theme/name/${name}/with_spu`
        })
    }
}

export {
    Theme
}