/* ***************库*************** */
//@ts-ignore
const fs = require('fire-fs');
//@ts-ignore
const electron = require('electron');
/* ***************自定义*************** */
//@ts-ignore
const name_s = "proto-generate";
//@ts-ignore
const storage = require(`${Editor.Project.path}/packages/${name_s}/js/${name_s}/core/storage`);
//@ts-ignore
const log = require(`${Editor.Project.path}/packages/${name_s}/js/${name_s}/core/log`);
//@ts-ignore
const pop_ups = require(`${Editor.Project.path}/packages/${name_s}/js/_module/pop_ups`);

// panel/index.js, this filename needs to match the one registered in package.json
module panel {
	const log_o: log = log.instance();
	const storage_o: storage = storage.instance();
	const pop_ups_o: pop_ups = pop_ups.instance();
	// css style for panel
	export const style = fs.readFileSync(Editor.url(`packages://${name_s}/panel/index.css`));
	// html template for panel
	export const template = fs.readFileSync(Editor.url(`packages://${name_s}/panel/index.html`));
	export const $ = {};

	let self: any;
	export function ready(this: any) {
		// @ts-ignore
		return self = new (<any>globalThis).Vue(<vue.template>{
			el: this.shadowRoot,
			init() {},
			created() {},
			data: {
				local_o: storage_o.cache_a,
				edit: false,
				replace: false,
			},
			methods: {
				/**选择存储路径 */
				selete_storage() {
					let default_path_s = `${Editor.Project.path}\\assets`;
					let path_ss = Editor.Dialog.openFile({
						title: "选择UI绑定脚本输出路径",
						defaultPath: default_path_s,
						properties: ['openDirectory'],
					});
					if (path_ss == -1) {
						return;
					}
					if (path_ss[0].indexOf(default_path_s) == -1) {
						pop_ups_o.show({
							"type": pop_ups.type.warning,
							"message": "只能监听assets下的目录!",
						});
						return;
					}
					storage_o.cache_a.storage_path_s = path_ss[0];
					storage_o.write_all();
				},
				/**打开存储路径 */
				open_storage() {
					if (fs.existsSync(storage_o.cache_a.storage_path_s)) {
						electron.shell.showItemInFolder(storage_o.cache_a.storage_path_s);
						electron.shell.beep();
					} else {
						Editor.error("路径不存在!");
					}
				},
				/**选择输出路径 */
				selete_output() {
					let path_ss = Editor.Dialog.openFile({
						title: "选择UI绑定脚本输出路径",
						defaultPath: `${Editor.Project.path}\\assets`,
						properties: ['openDirectory'],
					});
					if (path_ss == -1) {
						return;
					}
					storage_o.cache_a.output_path_s = path_ss[0];
					storage_o.write_all();
				},
				/**打开输出路径 */
				open_output() {
					if (fs.existsSync(storage_o.cache_a.output_path_s)) {
						electron.shell.showItemInFolder(storage_o.cache_a.output_path_s);
						electron.shell.beep();
					} else {
						Editor.error("路径不存在!");
					}
				},
				/**编辑文件名 */
				modify_name() {
					self.edit = true;
				},
				/**取消编辑文件名 */
				cancel_name() {
					self.edit = false;
					storage_o.update();
				},
				/**保存文件名 */
				save_name() {
					self.edit = false;
					storage_o.write_all();
				},
				/**替换内容 */
				modify_replace() {
					self.replace = true;
				},
				/**取消替换内容 */
				cancel_replace() {
					self.replace = false;
					storage_o.update();
				},
				/**保存替换 */
				save_replace() {
					self.replace = false;
					storage_o.write_all();
				},
				/**保存数据 */
				save_data() {
					storage_o.write_all();
				},
			}
		});
	}
	// register your ipc messages here
	export const messages = {
	};
}

Editor.Panel.extend(panel);