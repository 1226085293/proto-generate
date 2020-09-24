/* ***************库*************** */
const fs = require('fire-fs');
const electron = require('electron');
/* ***************自定义*************** */
const package_name = "proto-generate";
const pop_ups = Editor.require('packages://' + package_name + "/core/pop-ups.js");

// panel/index.js, this filename needs to match the one registered in package.json
Editor.Panel.extend({
	// css style for panel
	style: fs.readFileSync(Editor.url('packages://' + package_name + '/panel/index.css', 'utf8')),
	// html template for panel
	template: fs.readFileSync(Editor.url('packages://' + package_name + '/panel/index.html', 'utf8')),

	// element and variable binding
	$: {},

	// method executed when template and styles are successfully loaded and initialized
	ready() {
		new window.Vue({
			el: this.shadowRoot,

			init() {},

			created() {
				// 更新配置文件
				this.read_config();
			},

			data: {
				/**配置文件路径 */
				config_path: `${Editor.Project.path}/settings/${package_name}_config.json`,
				local: {
					/**proto文件存储路径 */
					storage_path: null,
					/**输出文件输出路径 */
					output_path: null,
					/**输出文件名 */
					output_name: null,
					/**要替换的内容 */
					replace_text1: null,
					/**替换后的内容 */
					replace_text2: null,
				},
				edit: false,
				replace: false,
			},

			methods: {
				/**写入配置 */
				wirte_config(key, path_) {
					this.local[key] = path_;
					fs.writeFileSync(this.config_path, JSON.stringify(this.local));
				},

				/**读取配置 */
				read_config() {
					fs.readFile(this.config_path, 'utf-8', (err, data) => {
						if (!err) {
							this.local = JSON.parse(data.toString());
						}
					});
				},

				/**选择存储路径 */
				selete_storage() {
					let default_path = `${Editor.Project.path}/\\assets`;
					let res = Editor.Dialog.openFile({
						title: "选择UI绑定脚本输出路径",
						defaultPath: default_path,
						properties: ['openDirectory'],
					});
					if (res[0].indexOf(default_path) == -1) {
						pop_ups.show("warning", "只能监听assets下的目录!");
						return;
					}
					if (res !== -1) {
						this.wirte_config("storage_path", res[0]);
					}
				},

				/**打开存储路径 */
				open_storage() {
					if (fs.existsSync(this.local.storage_path)) {
						electron.shell.showItemInFolder(this.local.storage_path);
						electron.shell.beep();
					} else {
						Editor.error("路径不存在!");
					}
				},

				/**选择输出路径 */
				selete_output() {
					let res = Editor.Dialog.openFile({
						title: "选择UI绑定脚本输出路径",
						defaultPath: `${Editor.Project.path}/\\assets`,
						properties: ['openDirectory'],
					});
					if (res !== -1) {
						this.wirte_config("output_path", res[0]);
					}
				},

				/**打开输出路径 */
				open_output() {
					if (fs.existsSync(this.local.output_path)) {
						electron.shell.showItemInFolder(this.local.output_path);
						electron.shell.beep();
					} else {
						Editor.error("路径不存在!");
					}
				},

				/**编辑文件名 */
				modify_name() {
					this.edit = true;
				},

				/**取消编辑文件名 */
				cancel_name() {
					this.edit = false;
					this.read_config();
				},

				/**保存文件名 */
				save_name() {
					this.edit = false;
					this.wirte_config();
				},

				/**替换内容 */
				modify_replace() {
					this.replace = true;
				},

				/**取消替换内容 */
				cancel_replace() {
					this.replace = false;
					this.read_config();
				},

				/**保存替换 */
				save_replace() {
					this.replace = false;
					this.wirte_config();
				},
			}
		});
	},
	// register your ipc messages here
	messages: {}
});