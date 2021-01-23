"use strict";
//@ts-ignore
const config = require("./config");
//@ts-ignore
const log_base = require("../../_module/log_base");
/**打印 */
//@ts-ignore
class log extends log_base {
    constructor() {
        super(...arguments);
        this.name_s = config.name_s;
    }
}
module.exports = log;
