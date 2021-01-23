"use strict";
/**继承单例 */
//@ts-ignore
class instance_base {
    /* -------------------------------segmentation------------------------------- */
    /**单例方法 */
    static instance(...args_as_) {
        if (!this._instance_o) {
            this._instance_o = new this(...args_as_);
        }
        return this._instance_o;
    }
}
module.exports = instance_base;
