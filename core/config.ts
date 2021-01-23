//@ts-ignore
module config {
    /*---------enum_private */
    /*---------enum_public */
    /*---------interface_private */
    /*---------interface_public */
    export interface bind_info {
        /**组件名 */
        component_s: string;
        /**属性键 */
        key_s: string;
        /**生成位置标记 */
        generate_mark_s: string;
        /**生成回调头标识（标记位置下一行生成） */
        callback_head_s: string;
    }
    export interface generate_info extends bind_info {
        /**函数名 */
        func_name_s: string;
    }
    /*---------var | const */
    //@ts-ignore
    export const name_s = "proto-generate";
    //@ts-ignore
    export const bind_info_as: bind_info[] = [];
    bind_info_as.push({
        "component_s": "cc.Button",
        "key_s": "clickEvents",
        "callback_head_s": "btn",
        "generate_mark_s": "按钮事件",
    });
    bind_info_as.push({
        "component_s": "cc.ScrollView",
        "key_s": "scrollEvents",
        "callback_head_s": "scroll",
        "generate_mark_s": "滑动事件",
    });
    bind_info_as.push({
        "component_s": "cc.Slider",
        "key_s": "slideEvents",
        "callback_head_s": "slider",
        "generate_mark_s": "滑动条事件",
    });
    bind_info_as.push({
        "component_s": "cc.PageView",
        "key_s": "pageEvents",
        "callback_head_s": "page",
        "generate_mark_s": "页面事件",
    });
    bind_info_as.push({
        "component_s": "cc.Toggle",
        "key_s": "checkEvents",
        "callback_head_s": "tog",
        "generate_mark_s": "选择事件",
    });
    bind_info_as.push({
        "component_s": "cc.ToggleContainer",
        "key_s": "checkEvents",
        "callback_head_s": "tog",
        "generate_mark_s": "选择事件",
    });
    bind_info_as.push({
        "component_s": "cc.EditBox",
        "key_s": "editingDidBegan",
        "callback_head_s": "edit_began",
        "generate_mark_s": "输入框事件",
    });
    bind_info_as.push({
        "component_s": "cc.EditBox",
        "key_s": "textChanged",
        "callback_head_s": "edit_change",
        "generate_mark_s": "输入框事件",
    });
    bind_info_as.push({
        "component_s": "cc.EditBox",
        "key_s": "editingDidEnded",
        "callback_head_s": "edit_end",
        "generate_mark_s": "输入框事件",
    });
    bind_info_as.push({
        "component_s": "cc.EditBox",
        "key_s": "editingReturn",
        "callback_head_s": "edit_return",
        "generate_mark_s": "输入框事件",
    });
    bind_info_as.push({
        "component_s": "cc.VideoPlayer",
        "key_s": "videoPlayerEvent",
        "callback_head_s": "video",
        "generate_mark_s": "视频事件",
    });
    bind_info_as.push({
        "component_s": "cc.WebView",
        "key_s": "webviewEvents",
        "callback_head_s": "web",
        "generate_mark_s": "WebView事件",
    });
    /*---------class_private */
    /*---------class_public */
}

module.exports = config;