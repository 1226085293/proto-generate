'use strict';
/* ***************库*************** */
const fs = require('fire-fs');
const child_process = require('child_process');
/* -------------------------------delimiter------------------------------- */
const package_name = "proto-generate";

module.exports = {
	data: {},

	// load () {},
	// unload () {},

	error(...info) {
		Editor.error(`${package_name}: `, ...info);
	},

	warn(...info) {
		Editor.warn(`${package_name}: `, ...info);
	},

	log(...info) {
		Editor.log(`${package_name}: `, ...info);
	},

	update_proto(path_) {
		while (path_.indexOf("/") != -1) {
			path_ = path_.replace("/", "\\")
		}
		fs.readFile(`${Editor.Project.path}/settings/${package_name}_config.json`, 'utf-8', (err, data) => {
			if (err) {
				this.warn("proto自动更新失败", err);
				return;
			}
			let local = JSON.parse(data);
			let temp1 = path_.indexOf(".") + 1;
			// ------------------安全检查
			// 验证存储路径
			if (!local.storage_path) {
				this.error("未配置存储路径, 请检查后重试!");
				return;
			}
			if (!fs.existsSync(local.storage_path)) {
				this.error("存储路径不存在, 请检查后重试!");
				return;
			}
			// 验证输出路径
			if (!local.output_path) {
				this.error("未配置输出路径, 请检查后重试!");
				return;
			}
			if (!fs.existsSync(local.output_path)) {
				this.error("存储路径不存在, 请检查后重试!");
				return;
			}
			// 文件名
			if (!local.output_name) {
				local.output_name = "msg";
			}
			// 验证文件名/路径
			if (temp1 == -1 || local.storage_path.indexOf(path_.substring(0, path_.lastIndexOf("\\"))) == -1) {
				// this.error("验证文件名/路径失败!");
				return;
			}
			// 验证文件后缀名
			if (path_.substring(temp1, path_.length) != "proto") {
				// this.error("验证文件后缀名失败!");
				return;
			}
			// ------------------获取路径
			temp1 = Editor.Project.path;
			while (temp1.indexOf("\\") != -1) {
				temp1 = temp1.replace(/\\/, "/")
			}
			temp1 += "/node_modules/protobufjs/bin";
			if (!fs.existsSync(temp1)) {
				this.error("未找到protobuf模块!");
				return;
			}
			// ------------------生成js
			child_process.exec(`node pbjs -t static-module -w commonjs -o ${local.output_path}/${local.output_name}.js ${local.storage_path}/*.proto`, {
				cwd: temp1,
			}, (err, stdout, stderr) => {
				if (err) {
					this.error(err, stdout, stderr);
					return;
				}
				// ------------------修改导入
				if (local.replace_text1 && local.replace_text2) {
					fs.readFile(`${local.output_path}/${local.output_name}.js`, 'utf-8', (err, data) => {
						if (err) {
							this.error("修改导入失败(读取)", err);
							return;
						}
						data = data.replace(local.replace_text1, local.replace_text2);
						fs.writeFile(`${local.output_path}/${local.output_name}.js`, data, (err, data) => {
							if (err) {
								this.error("修改导入失败(写入)", err);
								return;
							}
							// ------------------刷新资源
							let temp_path = `${local.output_path.substring(local.output_path.indexOf("assets"), local.output_path.length)}/`;
							while (temp_path.indexOf("\\") != -1) {
								temp_path = temp_path.replace(/\\/, "/")
							}
							Editor.assetdb.refresh(`db://${temp_path}/${local.output_name}.js`, function(err, results) {
								if (err) {
									this.error("刷新资源失败", err, results);
									return;
								}
							});
							// ------------------生成d.ts
							child_process.exec(`node pbts -o ${local.output_path}/${local.output_name}.d.ts ${local.output_path}/${local.output_name}.js`, {
								cwd: temp1,
							}, (err, stdout, stderr) => {
								if (err) {
									this.error(err, stdout, stderr);
									return;
								}
								Editor.assetdb.refresh(`db://${temp_path}/${local.output_name}.d.ts`, function(err, results) {
									if (err) {
										this.error("刷新资源失败", err, results);
										return;
									}
								});
								this.log(path_, "更新成功");
							});
						});
					})
				} else {
					// ------------------刷新资源
					let temp_path = `${local.output_path.substring(local.output_path.indexOf("assets"), local.output_path.length)}/`;
					while (temp_path.indexOf("\\") != -1) {
						temp_path = temp_path.replace(/\\/, "/")
					}
					Editor.assetdb.refresh(`db://${temp_path}/${local.output_name}.js`, function(err, results) {
						if (err) {
							this.error("刷新资源失败", err, results);
							return;
						}
					});
					// ------------------生成d.ts
					child_process.exec(`node pbts -o ${local.output_path}/${local.output_name}.d.ts ${local.output_path}/${local.output_name}.js`, {
						cwd: temp1,
					}, (err, stdout, stderr) => {
						if (err) {
							this.error(err, stdout, stderr);
							return;
						}
						Editor.assetdb.refresh(`db://${temp_path}/${local.output_name}.d.ts`, function(err, results) {
							if (err) {
								this.error("刷新资源失败", err, results);
								return;
							}
						});
						this.log(path_, "更新成功");
					});
				}
			});
		});
	},
	// register your ipc messages here
	messages: {
		/**打开面板 */
		'open'() {
			Editor.Panel.open('proto-generate');
		},
		/**文件创建 */
		"asset-db:assets-created"(event1, event2) {
			let path = event2[0].url;
			this.update_proto(path.substring(path.indexOf("assets"), path.length));
		},
		/**文件移动 */
		"asset-db:assets-moved"(event1, event2) {
			let path = event2[0].url;
			this.update_proto(path.substring(path.indexOf("assets"), path.length));
			path = event2[0].srcPath;
			this.update_proto(path.substring(path.indexOf("assets"), path.length));
		},
		/**文件改变 */
		"asset-db:asset-changed"(event1, event2) {
			let path = Editor.assetdb.uuidToUrl(event2.uuid);
			this.update_proto(path.substring(path.indexOf("assets"), path.length));
		},
		/**文件删除 */
		"asset-db:assets-deleted"(event1, event2) {
			let path = event2[0].url;
			this.update_proto(path.substring(path.indexOf("assets"), path.length));
		},
	},
};