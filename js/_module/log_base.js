"use strict";
///<reference path="./instance_base.ts"/>
// @ts-ignore
const instance_base = require("./instance_base");
/**打印 */
// @ts-ignore
class log_base extends instance_base {
    /* -------------------------------segmentation------------------------------- */
    l(...args_as_) {
        Editor.log(`${this.name_s}：`, ...args_as_);
    }
    w(...args_as_) {
        Editor.warn(`${this.name_s}：`, ...args_as_);
    }
    e(...args_as_) {
        Editor.error(`${this.name_s}：`, ...args_as_);
    }
}
module.exports = log_base;
