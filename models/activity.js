import {Http} from "../utils/http";

class Activity {
    // activity/name/a-2
    static locationD = 'a-2'
    static async getHomeLocationD() {
        return await Http.request({
            url:`activity/name/${this.locationD}`
        })
    }
}

export {
    Activity
}