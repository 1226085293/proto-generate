///<reference path="../../editor/editor-assetDB.d.ts"/>
///<reference path="../../editor/editor-main.d.ts"/>
///<reference path="../../editor/editor-renderer.d.ts"/>
///<reference path="../../editor/editor-scene.d.ts"/>
///<reference path="../../editor/editor-share.d.ts"/>
///<reference path="../../editor/engine.d.ts"/>
///<reference path="../../editor/fs.d.ts"/>
///<reference path="../../creator.d.ts"/>
///<reference path="../_module/log_base.ts"/>
///<reference path="../_module/pop_ups.ts"/>
///<reference path="./core/config.ts"/>
///<reference path="./core/storage.ts"/>
///<reference path="./core/log.ts"/>
/* ***************库*************** */
//@ts-ignore
const fs = require('fire-fs');
//@ts-ignore
const child_process = require('child_process');
//@ts-ignore
const uglify_js = require('uglify-js');
//@ts-ignore
const config = require("./core/config");
//@ts-ignore
const storage = require("./core/storage");
//@ts-ignore
const log = require("./core/log");
/* -------------------------------segmentation------------------------------- */
module main {
	const log_o: log = log.instance();
	const storage_o: storage = storage.instance();

	/**忙碌状态 */
	let busy_b = false;
	/**任务列表 */
	let task_list_as: any[] = [];
	export let data = {
		local_o: storage_o.cache_a,
	};
	// load () {},
	// unload () {},
	/**设置忙碌状态 */
	function set_busy(v_b_: boolean): void {
		busy_b = v_b_;
		if (!busy_b && task_list_as.length) {
			update_proto(task_list_as.shift());
		}
	}
	/**剔除函数 */
	function del_func(v_s_: string, func_s_: string): string {
		try {
			if (!v_s_ || !func_s_) {
				return v_s_;
			}
			let del_head_index_n = v_s_.indexOf(`${func_s_} = function`);
			if (del_head_index_n == -1) {
				return v_s_;
			}
			/**当前花括号头数量 */
			let head_n = 1;
			let head_index_n: number;
			let tail_index_n: number;
			let del_tail_index_n = v_s_.indexOf("{", del_head_index_n);
			while (head_n) {
				head_index_n = v_s_.indexOf("{", del_tail_index_n + 1);
				tail_index_n = v_s_.indexOf("}", del_tail_index_n + 1);
				// ------------------错误
				if (head_index_n == -1 && tail_index_n == -1) {
					break;
				}
				// ------------------更新 head_n
				if (head_index_n != -1 && (tail_index_n == -1 || head_index_n < tail_index_n)) {
					++head_n;
					del_tail_index_n = head_index_n;
				} else if (tail_index_n != -1 && (head_index_n == -1 || head_index_n > tail_index_n)) {
					--head_n;
					del_tail_index_n = tail_index_n;
				}
			}
			del_head_index_n = v_s_.lastIndexOf("\n", del_head_index_n);
			v_s_ = v_s_.slice(0, del_head_index_n) + v_s_.slice(del_tail_index_n + 1);
			return del_func(v_s_, func_s_);
		} catch (err_a) {
			log_o.e(err_a);
		}
	};
	/**更新生成proto */
	function update_proto(path_s: string): void {
		if (busy_b) {
			task_list_as.push(path_s);
			return;
		}
		set_busy(true);
		// ------------------文件验证
		if (path_s.indexOf("proto") == -1) {
			set_busy(false);;
			return;
		}
		path_s = path_s.replace(/\\/g, "/");
		let temp1_n = path_s.indexOf(".") + 1;
		// ------------------验证文件名/路径
		if (temp1_n == -1 || storage_o.cache_a.storage_path_s.replace(/\\/g, "/").indexOf(path_s.substring(0, path_s.lastIndexOf("/"))) == -1) {
			// log_o.e("验证文件名/路径失败!");
			set_busy(false);;
			return;
		}
		// ------------------验证文件后缀名
		if (path_s.substring(temp1_n, path_s.length) != "proto") {
			// log_o.e("验证文件后缀名失败!");
			set_busy(false);;
			return;
		}
		// ------------------验证存储路径
		if (!storage_o.cache_a.storage_path_s) {
			log_o.e("未配置存储路径, 请检查后重试!");
			set_busy(false);;
			return;
		}
		if (!fs.existsSync(storage_o.cache_a.storage_path_s)) {
			log_o.e("存储路径不存在, 请检查后重试!");
			set_busy(false);;
			return;
		}
		// ------------------验证输出路径
		if (!storage_o.cache_a.output_path_s) {
			log_o.e("未配置输出路径, 请检查后重试!");
			set_busy(false);;
			return;
		}
		if (!fs.existsSync(storage_o.cache_a.output_path_s)) {
			log_o.e("输出路径不存在, 请检查后重试!");
			set_busy(false);;
			return;
		}
		storage_o.update();
		// ------------------文件名
		if (!storage_o.cache_a.output_name_s) {
			storage_o.cache_a.output_name_s = "msg";
		}
		// ------------------获取路径
		let temp1_s = Editor.Project.path.replace(/\\/g, "/");
		temp1_s += "/node_modules/protobufjs/bin";
		if (!fs.existsSync(temp1_s)) {
			log_o.e("未找到protobuf模块!");
			set_busy(false);;
			return;
		}
		// ------------------生成js
		child_process.exec(`node pbjs -t static-module -w commonjs -o ${storage_o.cache_a.output_path_s}/${storage_o.cache_a.output_name_s}.js ${storage_o.cache_a.storage_path_s}/*.proto`, {
			cwd: temp1_s,
			maxBuffer: 5000 * 1024,
		}, (err_a: any, stdout_a: any, stderr_a: any) => {
			if (err_a) {
				log_o.e(`${err_a}`, stdout_a, stderr_a);
				set_busy(false);;
				return;
			}
			// ------------------修改导入
			if (storage_o.cache_a.replace_text1_s && storage_o.cache_a.replace_text2_s) {
				fs.readFile(`${storage_o.cache_a.output_path_s}/${storage_o.cache_a.output_name_s}.js`, 'utf-8', (err_a: any, data_s: any) => {
					if (err_a) {
						log_o.e("修改导入失败(读取)", err_a);
						set_busy(false);;
						return;
					}
					// 替换内容
					data_s = data_s.replace(storage_o.cache_a.replace_text1_s, storage_o.cache_a.replace_text2_s);
					// 避免编辑器运行导致卡顿
					let head_index_n = data_s.indexOf("\n", data_s.indexOf("import"));
					data_s = data_s.substring(0, head_index_n) + "if (!CC_EDITOR) {\r\n" + data_s.substring(head_index_n) + "\r\n}";
					// ------------------裁剪代码
					if (storage_o.cache_a.encode_delimited_b) {
						data_s = del_func(data_s, "encodeDelimited");
					}
					if (storage_o.cache_a.verify_b) {
						data_s = del_func(data_s, "verify");
					}
					if (storage_o.cache_a.from_object_b) {
						data_s = del_func(data_s, "fromObject");
					}
					if (storage_o.cache_a.to_object_b) {
						data_s = del_func(data_s, "toObject");
					}
					if (storage_o.cache_a.to_json_b) {
						data_s = del_func(data_s, "toJSON");
					}
					fs.writeFile(`${storage_o.cache_a.output_path_s}/${storage_o.cache_a.output_name_s}.js`, data_s, (err, data) => {
						if (err) {
							log_o.e("修改导入失败(写入)", err);
							set_busy(false);;
							return;
						}
						// ------------------压缩代码
						if (storage_o.cache_a.reduce_code_b) {
							child_process.exec(
								`node uglifyjs ${storage_o.cache_a.output_path_s}/${storage_o.cache_a.output_name_s}.js -m -o ${storage_o.cache_a.output_path_s}/${storage_o.cache_a.output_name_s}.js`,
								{
									cwd: Editor.Project.path.replace(/\\/g, "/") + `/packages/${config.name_s}/node_modules/uglify-js/bin`,
									maxBuffer: 5000 * 1024,
								}
							);
						}
						// ------------------刷新资源
						let temp_path = `${storage_o.cache_a.output_path_s.substring(storage_o.cache_a.output_path_s.indexOf("assets"), storage_o.cache_a.output_path_s.length)}/`;
						temp_path = temp_path.replace(/\\/g, "/")
						Editor.assetdb.refresh(`db://${temp_path}/${storage_o.cache_a.output_name_s}.js`, (err_a: any)=> {
							if (err_a) {
								log_o.e("刷新资源失败", err_a);
								set_busy(false);;
								return;
							}
						});
						// ------------------生成d.ts
						child_process.exec(`node pbts -o ${storage_o.cache_a.output_path_s}/${storage_o.cache_a.output_name_s}.d.ts ${storage_o.cache_a.output_path_s}/${storage_o.cache_a.output_name_s}.js`, {
							cwd: temp1_s,
							maxBuffer: 5000 * 1024,
						}, (err_a: any, stdout_a: any, stderr_a: any) => {
							if (err_a) {
								log_o.e(err_a, stdout_a, stderr_a);
								set_busy(false);;
								return;
							}
							Editor.assetdb.refresh(`db://${temp_path}/${storage_o.cache_a.output_name_s}.d.ts`, (err_a: any)=> {
								if (err_a) {
									log_o.e("刷新资源失败", err_a);
									set_busy(false);;
									return;
								}
							});
							log_o.l(path_s, "更新成功");
						});
					});
				})
			} else {
				// ------------------刷新资源
				let temp_path = `${storage_o.cache_a.output_path_s.substring(storage_o.cache_a.output_path_s.indexOf("assets"), storage_o.cache_a.output_path_s.length)}/`;
				temp_path = temp_path.replace(/\\/g, "/")
				Editor.assetdb.refresh(`db://${temp_path}/${storage_o.cache_a.output_name_s}.js`, function(err_a: any) {
					if (err_a) {
						log_o.e("刷新资源失败", err_a);
						set_busy(false);;
						return;
					}
				});
				// ------------------生成d.ts
				child_process.exec(`node pbts -o ${storage_o.cache_a.output_path_s}/${storage_o.cache_a.output_name_s}.d.ts ${storage_o.cache_a.output_path_s}/${storage_o.cache_a.output_name_s}.js`, {
					cwd: temp1_s,
				}, (err_a: any, stdout_a: any, stderr_a: any) => {
					if (err_a) {
						log_o.e(err_a, stdout_a, stderr_a);
						set_busy(false);;
						return;
					}
					Editor.assetdb.refresh(`db://${temp_path}/${storage_o.cache_a.output_name_s}.d.ts`, (err_a: any)=> {
						if (err_a) {
							log_o.e("刷新资源失败", err_a);
							set_busy(false);;
							return;
						}
					});
					log_o.l(path_s, "更新成功");
				});
			}
		});
		set_busy(false);;
	}
	// register your ipc messages here
	export const messages = {
		/**打开面板 */
		open() {
			Editor.Panel.open('proto-generate');
		},
		/**文件创建 */
		"asset-db:assets-created"(event1: any, event2_a: any) {
			let path = event2_a[0].url;
			update_proto(path.substring(path.indexOf("assets"), path.length));
		},
		/**文件移动 */
		"asset-db:assets-moved"(event1: any, event2_a: any) {
			let path = event2_a[0].url;
			update_proto(path.substring(path.indexOf("assets"), path.length));
			path = event2_a[0].srcPath;
			update_proto(path.substring(path.indexOf("assets"), path.length));
		},
		/**文件改变 */
		"asset-db:asset-changed"(event1: any, event2_a: any) {
			let path = Editor.assetdb.uuidToUrl(event2_a.uuid);
			update_proto(path.substring(path.indexOf("assets"), path.length));
		},
		/**文件删除 */
		"asset-db:assets-deleted"(event1: any, event2_a: any) {
			let path = event2_a[0].url;
			update_proto(path.substring(path.indexOf("assets"), path.length));
		},
	};
};

module.exports = main;