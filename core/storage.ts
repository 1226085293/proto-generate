// @ts-ignore
const fs = require('fire-fs');
//@ts-ignore
const config = require("./config");
// @ts-ignore
const instance_base = require("../../_module/instance_base");
// @ts-ignore
const storage_path_s = `${Editor.Project.path}/settings/${config.name_s}_config.json`;


module _storage {
    /*---------enum_private */
    /*---------enum_public */
    /*---------interface_private */
    /*---------interface_public */
    /*---------var | const */
    /*---------class_private */
    /*---------class_public */
    /**存储数据 */
    // @ts-ignore
    export class data {
        /**存储路径 */
        storage_path_s = "";
        /**输出路径 */
        output_path_s = "";
        /**输出名 */
        output_name_s = "";
        /**替换文本1 */
        replace_text1_s = "protobufjs/minimal";
        /**替换文本2 */
        replace_text2_s = "protobufjs/dist/protobuf.min";
        // ------------------缩减项
        encode_delimited_b = false;
        verify_b = false;
        from_object_b = false;
        to_object_b = false;
        to_json_b = false;
        /**压缩代码 */
        reduce_code_b = true;
    }
}
//@ts-ignore
class storage extends instance_base {
    constructor() {
        super();
        this.update();
    }
    /* ***************public*************** */
    public cache_a: _storage.data;
    /* -------------------------------segmentation------------------------------- */
    /**全部写入 */
    public write_all(): void {
        fs.writeFile(storage_path_s, JSON.stringify(this.cache_a));
    }
    /**更新 */
    public update(): void {
        try {
            if (!this.cache_a) {
                this.cache_a = <any>{};
            }
            this.cache_a = JSON.parse(fs.readFileSync(storage_path_s, "utf-8"));
        } catch (e) {
            this.cache_a = new _storage.data;
        }
    }
}

module.exports = storage;