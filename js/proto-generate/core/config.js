"use strict";
//@ts-ignore
var config;
(function (config) {
    /*---------var | const */
    //@ts-ignore
    config.name_s = "proto-generate";
    //@ts-ignore
    config.bind_info_as = [];
    config.bind_info_as.push({
        "component_s": "cc.Button",
        "key_s": "clickEvents",
        "callback_head_s": "btn",
        "generate_mark_s": "按钮事件",
    });
    config.bind_info_as.push({
        "component_s": "cc.ScrollView",
        "key_s": "scrollEvents",
        "callback_head_s": "scroll",
        "generate_mark_s": "滑动事件",
    });
    config.bind_info_as.push({
        "component_s": "cc.Slider",
        "key_s": "slideEvents",
        "callback_head_s": "slider",
        "generate_mark_s": "滑动条事件",
    });
    config.bind_info_as.push({
        "component_s": "cc.PageView",
        "key_s": "pageEvents",
        "callback_head_s": "page",
        "generate_mark_s": "页面事件",
    });
    config.bind_info_as.push({
        "component_s": "cc.Toggle",
        "key_s": "checkEvents",
        "callback_head_s": "tog",
        "generate_mark_s": "选择事件",
    });
    config.bind_info_as.push({
        "component_s": "cc.ToggleContainer",
        "key_s": "checkEvents",
        "callback_head_s": "tog",
        "generate_mark_s": "选择事件",
    });
    config.bind_info_as.push({
        "component_s": "cc.EditBox",
        "key_s": "editingDidBegan",
        "callback_head_s": "edit_began",
        "generate_mark_s": "输入框事件",
    });
    config.bind_info_as.push({
        "component_s": "cc.EditBox",
        "key_s": "textChanged",
        "callback_head_s": "edit_change",
        "generate_mark_s": "输入框事件",
    });
    config.bind_info_as.push({
        "component_s": "cc.EditBox",
        "key_s": "editingDidEnded",
        "callback_head_s": "edit_end",
        "generate_mark_s": "输入框事件",
    });
    config.bind_info_as.push({
        "component_s": "cc.EditBox",
        "key_s": "editingReturn",
        "callback_head_s": "edit_return",
        "generate_mark_s": "输入框事件",
    });
    config.bind_info_as.push({
        "component_s": "cc.VideoPlayer",
        "key_s": "videoPlayerEvent",
        "callback_head_s": "video",
        "generate_mark_s": "视频事件",
    });
    config.bind_info_as.push({
        "component_s": "cc.WebView",
        "key_s": "webviewEvents",
        "callback_head_s": "web",
        "generate_mark_s": "WebView事件",
    });
    /*---------class_private */
    /*---------class_public */
})(config || (config = {}));
module.exports = config;
