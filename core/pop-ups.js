/* -------------------------------内部方法------------------------------- */
/**弹窗属性 */
let prompt_box = {
    type: '',
    buttons: ['OK'],
    title: '',
    message: '',
    defaultId: 0,
    noLink: true
};

/* -------------------------------外部方法------------------------------- */
module.exports = {
    //"none" | "info" | "error" | "question" | "warning"
    show(type_e_, content_s_) {
        prompt_box.type = prompt_box.title = type_e_;
        prompt_box.message = content_s_;
        Editor.Dialog.messageBox(prompt_box);
    },
}