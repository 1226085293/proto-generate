"use strict";
// @ts-ignore
const fs = require('fire-fs');
//@ts-ignore
const config = require("./config");
// @ts-ignore
const instance_base = require("../../_module/instance_base");
// @ts-ignore
const storage_path_s = `${Editor.Project.path}/settings/${config.name_s}_config.json`;
var _storage;
(function (_storage) {
    /*---------enum_private */
    /*---------enum_public */
    /*---------interface_private */
    /*---------interface_public */
    /*---------var | const */
    /*---------class_private */
    /*---------class_public */
    /**存储数据 */
    // @ts-ignore
    class data {
        constructor() {
            /**存储路径 */
            this.storage_path_s = "";
            /**输出路径 */
            this.output_path_s = "";
            /**输出名 */
            this.output_name_s = "";
            /**替换文本1 */
            this.replace_text1_s = "protobufjs/minimal";
            /**替换文本2 */
            this.replace_text2_s = "protobufjs/dist/protobuf.min";
            // ------------------缩减项
            this.encode_delimited_b = false;
            this.verify_b = false;
            this.from_object_b = false;
            this.to_object_b = false;
            this.to_json_b = false;
            /**压缩代码 */
            this.reduce_code_b = true;
        }
    }
    _storage.data = data;
})(_storage || (_storage = {}));
//@ts-ignore
class storage extends instance_base {
    constructor() {
        super();
        this.update();
    }
    /* -------------------------------segmentation------------------------------- */
    /**全部写入 */
    write_all() {
        fs.writeFile(storage_path_s, JSON.stringify(this.cache_a));
    }
    /**更新 */
    update() {
        try {
            if (!this.cache_a) {
                this.cache_a = {};
            }
            this.cache_a = JSON.parse(fs.readFileSync(storage_path_s, "utf-8"));
        }
        catch (e) {
            this.cache_a = new _storage.data;
        }
    }
}
module.exports = storage;
