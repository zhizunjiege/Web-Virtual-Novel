(function () {
	const PAGE_DATAS = 8;
	const MAX_PAGES = 20;
	const PAGE_Q = 21;

	const NOW_SAVING = 1;
	const NOW_LOADING = 2;
	const NOW_DELETING = 3;

	var data_obj = null;
	var Operation = {
		now: {
			operation: NOW_SAVING,
			mode: "save",
			page: 1
		},
		prev: {
			operation: NOW_LOADING,
			mode: "load",
			page: 1
		},
		origin: ""
	};

	var db = null;

	function pages(num) {
		var target = document.getElementById("dataList").children;
		var i = 0;
		var j = 0;

		var store = System.getObjectStore(db, System.STORE_NAME_SAVE, "readonly");
		var request = null;
		var requests = [];

		for (i = 0; i < PAGE_DATAS; i++) {
			request = store.get((num - 1) * PAGE_DATAS + 1 + i);
			request.onsuccess = function (event) {
				if (this.result) {
					display(this.result);
				} else {
					if (target[j].querySelector(".saveDate").innerText) {
						target[j].querySelector(".saveDate").innerText = "";
						target[j].querySelector("img").src = System.SYSICO_PATH + "nodata" + System.SYSICO_EX;
						target[j].querySelector(".name").innerText = "";
						target[j].querySelector(".gameDate").innerText = "";
						target[j].querySelector(".scenario").innerText = "";
						target[j].querySelector("input").value = "クりックでコメントを入力できます";
					}
				}
				j++;
			};
			request.onerror = function (event) {
				console.log("pages failed!\nCode=" + this.error);
			};
			requests.push(request);
		}
		Operation.now.page = num;
	};

	function dataSave(save_data) {
		var store = System.getObjectStore(db, System.STORE_NAME_SAVE, "readwrite");
		var req = store.put(save_data);
		req.onsuccess = function () {
			console.log("data saving successed!");
		};
		req.onerror = function (event) {
			console.log("data saving failed!\nCode=" + this.error);
		};
	};

	function dataSearch() {};

	function display(save_data) {
		var data_num = save_data.saveDataNum % 8 == 0 ? 8 : save_data.saveDataNum % 8;
		var id = "data_" + String(data_num);
		var current_data = document.getElementById(id);

		current_data.querySelector(".saveDate").innerText = save_data.saveDate;
		current_data.querySelector("img").src = System.BG_PATH + save_data.bg.name + System.BG_EX;
		current_data.querySelector(".name").innerText = save_data.name;
		//current_data.querySelector(".gameDate").innerText = save_data.gameDate;
		current_data.querySelector(".scenario").innerText = save_data.scenario;
		current_data.querySelector("input").value = save_data.comment;
	};

	function addEventListeners() {

		window.addEventListener("message", function (event) {
			var mes_obj = event.data;
			if (Operation.now.page == 1) {
				pages(1);
			}
			Operation.now.mode = mes_obj.mode;
			switch (Operation.now.mode) {
			case "save":
				Operation.now.operation = NOW_SAVING;
				data_obj = JSON.parse(JSON.stringify(mes_obj.data_obj));
				break;
			case "load":
				if (mes_obj.data_obj) {
					data_obj = JSON.parse(JSON.stringify(mes_obj.data_obj));
				}
				Operation.now.operation = NOW_LOADING;
				break;
			}
			document.getElementById("title").firstElementChild.innerText = mes_obj.mode;
			Operation.origin = mes_obj.origin;
		}, false);

		document.getElementById("dataList").addEventListener("click", function (event) {
			var target = event.target;
			var ori_target = target;
			var now_data_num = 0;
			var store = null;
			var req = null;

			if (event.currentTarget.contains(target) && target != event.currentTarget) {
				while (target.parentNode != event.currentTarget) {
					target = target.parentNode;
				}
				now_data_num = (Operation.now.page - 1) * PAGE_DATAS + parseInt(target.id.substring(target.id.indexOf("_") + 1));
				if (System.matchesSelector(ori_target, "input")) {
					store = System.getObjectStore(db, System.STORE_NAME_SAVE, "readonly");
					req = store.get(now_data_num);
					req.onsuccess = function (event) {
						if (this.result) {
							data_obj = this.result;
							ori_target.addEventListener("blur", function (event) {
								data_obj.comment = target.querySelector("input").value;
								dataSave(data_obj);
							}, false);
						}
					};
					req.onerror = function (event) {
						console.log("data loading failed!\nCode=" + this.error);
					};
				} else {
					switch (Operation.now.operation) {
					case NOW_SAVING:
						data_obj.saveDataNum = now_data_num;
						data_obj.saveDate = (new Date()).toString();
						data_obj.comment = target.querySelector("input").value;
						dataSave(data_obj);
						display(data_obj);
						break;
					case NOW_LOADING:
						if (target.querySelector(".saveDate").innerText) {
							store = System.getObjectStore(db, System.STORE_NAME_SAVE, "readonly");
							req = store.get(now_data_num);
							req.onsuccess = function (event) {
								top.postMessage(System.mesObject("game.html", "data.html", "load", this.result), "*");
								console.log("data loading successed!");
							};
							req.onerror = function (event) {
								console.log("data loading failed!\nCode=" + this.error);
							};
						}
						break;
					case NOW_DELETING:
						if (target.querySelector(".saveDate").innerText) {
							store = System.getObjectStore(db, System.STORE_NAME_SAVE, "readwrite");
							req = store.delete(now_data_num);
							req.onsuccess = function (event) {
								target.querySelector(".saveDate").innerText = "";
								target.querySelector("img").src = System.SYSICO_PATH + "nodata" + System.SYSICO_EX;
								target.querySelector(".name").innerText = "";
								target.querySelector(".gameDate").innerText = "";
								target.querySelector(".scenario").innerText = "";
								target.querySelector("input").value = "クりックでコメントを入力できます";
								console.log("data deleting successed!");
							};
							req.onerror = function (event) {
								console.log("data deleting failed!\nCode=" + this.error);
							};
						}
						break;
					}
				}
			}

		}, false);

		document.getElementById("functions").addEventListener("click", function (event) {
			var mes_obj = {};
			switch (event.target.id) {
			case "pageUp":
				if (Operation.now.page > 1) {
					pages(Operation.now.page - 1);
				}
				break;
			case "pageDown":
				if (Operation.now.page < MAX_PAGES) {
					pages(Operation.now.page + 1);
				}
				break;
			case "back":
				if (Operation.origin) {
					mes_obj.mode = "back";
					top.postMessage(System.mesObject(Operation.origin, "data.html", "back", null), "*");
				}
				break;
			case "backTitle":
				if (data_obj) {
					data_obj.saveDataNum = 0;
					data_obj.saveDate = (new Date()).toString();
					data_obj.comment = "";
					dataSave(data_obj);
				}
				top.postMessage(System.mesObject("title.html", "data.html", "backTitle", null), "*");
				break;
			case "gameQuit":
				if (data_obj) {
					data_obj.saveDataNum = 0;
					data_obj.saveDate = (new Date()).toString();
					data_obj.comment = "";
					dataSave(data_obj);
				}
				top.postMessage(System.mesObject("", "data.html", "gameQuit", null), "*");
				break;
			case "dataDelete":
				if (Operation.now.operation == NOW_DELETING) {
					Operation.now.operation = Operation.prev.operation;
					Operation.now.mode = Operation.prev.mode;
					document.getElementById("title").firstElementChild.innerText = Operation.now.mode;
					event.target.innerText = "Delete";
				} else {
					Operation.prev.operation = Operation.now.operation;
					Operation.prev.mode = Operation.now.mode;
					Operation.now.operation = NOW_DELETING;
					Operation.now.mode = "DELETE";
					document.getElementById("title").firstElementChild.innerText = Operation.now.mode;
					event.target.innerText = "Cancel";
				}
				break;
			case "search":
				break;
			}
		}, false);

		document.getElementById("pages").addEventListener("click", function (event) {
			if (event.target.value) {
				switch (event.target.value) {
				case "up":
					if (Operation.now.page > 1) {
						pages(Operation.now.page - 1);
					}
					break;
				case "down":
					if (Operation.now.page < MAX_PAGES) {
						pages(Operation.now.page + 1);
					}
					break;
				case "q":
					pages(PAGE_Q);
					break;
				default:
					pages(parseInt(event.target.value));
				}
			}
		}, false);
	};

	System.openDb().then(function (value) {
		db = value;
		addEventListeners();
	}).catch(function (error) {
		console.log(error);
	});
})();
