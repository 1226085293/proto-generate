"use strict";
///<reference path="./instance_base.ts"/>
// @ts-ignore
const instance_base = require("./instance_base");
//@ts-ignore
class pop_ups extends instance_base {
    show(option_o_) {
        Editor.Dialog.messageBox(option_o_);
    }
}
//@ts-ignore
(function (pop_ups) {
    /**弹窗类型 */
    let type;
    (function (type) {
        type["none"] = "none";
        type["info"] = "info";
        type["warning"] = "warning";
        type["error"] = "error";
        type["question"] = "question";
    })(type = pop_ups.type || (pop_ups.type = {}));
    /**弹窗配置 */
    class option {
        constructor(v_o_) {
            this.type = type.none;
            this.buttons = ['OK'];
            this.title = this.type;
            this.defaultId = 0;
            this.noLink = true;
            Object.assign(this, v_o_);
        }
    }
    pop_ups.option = option;
})(pop_ups || (pop_ups = {}));
module.exports = pop_ups;
