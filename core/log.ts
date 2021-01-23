//@ts-ignore
const config = require("./config");
//@ts-ignore
const log_base = require("../../_module/log_base");

/**打印 */
//@ts-ignore
class log extends log_base {
    protected name_s: string = config.name_s;
}

module.exports = log;