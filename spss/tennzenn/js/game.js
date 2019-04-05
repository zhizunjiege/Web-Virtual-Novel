(function () {
	const SEPARATOR = "「";

	var mainStage = document.getElementById("mainStage");
	var name = document.getElementById("name");
	var subtitle = name.nextElementSibling;
	var sysOpt = document.getElementById("sysOpt");
	var character=document.getElementById("character");
	var bgm = document.getElementById("bgm");
	var db = null;

	var Game = {
		all_num: 0,
		scenario_num: 0,
		game_skipping: false,
		skip_id: null,
		data_obj: null
	};

	function gameDisplay() {
		var i = Game.data_obj.scenario[Game.scenario_num].indexOf(SEPARATOR);
		if (i != -1) {
			name.innerText = Game.data_obj.scenario[Game.scenario_num].substring(0, i);
		} else {
			name.innerText = "";
		}
		subtitle.innerText = Game.data_obj.scenario[Game.scenario_num++].substring(i);
	};

	function gameLoad() {
		console.log("ddd");
		if (Game.data_obj.bg) {
			mainStage.style.backgroundImage = "url(" + System.BG_PATH + Game.data_obj.bg.name + System.BG_EX + ")";
		}
		if (Game.data_obj.bgm) {
			bgm.volume = 0.3;
			bgm.loop = "loop";
			bgm.src = System.BGM_PATH + Game.data_obj.bgm.name + System.BGM_EX;
			bgm.play();
		}
		if (Game.data_obj.character) {
			character.style.width=Game.data_obj.character.w;
			character.style.height=Game.data_obj.character.h;
			character.src = System.CHARACTER_PATH + Game.data_obj.character.name + System.CHARACTER_EX;
			character.style.left=Game.data_obj.character.x;
			character.style.top=Game.data_obj.character.y;
		}
		gameDisplay();
	};

	function gameSkip() {
		Game.game_skipping = true;
		Game.skip_id = setInterval(gameNext, 800);
		console.log("game skipping!");
	};

	function gameStop() {
		if (Game.game_skipping) {
			clearInterval(Game.skip_id);
			Game.game_skipping = false;
			Game.skip_id = null;
		}
	};

	function gameNext() {
		var s = null;
		var r = null;
		if (Game.scenario_num < Game.data_obj.scenario.length) {
			gameDisplay();
		} else {
			if (Game.data_obj.gameDataNum < Game.all_num) {
				s = System.getObjectStore(db,System.STORE_NAME_GAME, "readonly"),
				r = s.get(Game.data_obj.gameDataNum + 1);
				r.onsuccess = function (event) {
					Game.scenario_num = 0;
					Game.data_obj =JSON.parse(JSON.stringify(this.result));
					gameLoad();
				};
				r.onerror = function (event) {
					console.log("data loading failed!\nCode=" + event.error);
				};
			} else {
				console.log("game ended!");
				bgm.src = System.BGM_PATH + "end" + System.BGM_EX;
				bgm.play();
			}
		}
	};

	function addEventListeners() {
console.log("aaa");
		window.addEventListener("message", function (event) {
			console.log("sss");
			var mes_obj = event.data;
			var store = null;
			var req = null;
			if (mes_obj.origin) {
				switch (mes_obj.mode) {
				case "load":
					store = System.getObjectStore(db,System.STORE_NAME_GAME, "readonly");
					req = store.get(mes_obj.data_obj.gameDataNum);
					req.onsuccess = function (event) {
						Game.data_obj = JSON.parse(JSON.stringify(this.result));
						Game.scenario_num = mes_obj.data_obj.scenarioNum;
						Game.data_obj.bg = mes_obj.data_obj.bg;
						Game.data_obj.bgm = mes_obj.data_obj.bgm;
						Game.data_obj.character = mes_obj.data_obj.character;
						Game.data_obj.face = mes_obj.data_obj.face;
						gameLoad();
					};
					req.onerror = function (event) {
						console.log("data loading failed!\nCode=" + event.error);
					};
					break;
				case "conti":
					store = System.getObjectStore(db,System.STORE_NAME_SAVE, "readonly");
					req = store.get(0);
					req.onsuccess = function (event) {
						var result = this.result ?this.result : null;
						var s = System.getObjectStore(db,System.STORE_NAME_GAME, "readonly");
						var r = s.get(result?result.gameDataNum : 1);
						r.onsuccess = function (event) {
							Game.data_obj =JSON.parse(JSON.stringify(this.result));
							if (result) {
								Game.scenario_num = result.scenarioNum;
								Game.data_obj.bg = result.bg;
								Game.data_obj.bgm = result.bgm;
								Game.data_obj.character = result.character;
								Game.data_obj.face = result.face;
							}
							gameLoad();
						};
						r.onerror = function (event) {
							console.log("data loading failed!\nCode=" + event.error);
						};
					};
					req.onerror = function (event) {
						console.log("data loading failed!\nCode=" + event.error);
					};
					break;
				case "back":
					break;
				default:
				console.log("fff");
					store = System.getObjectStore(db,System.STORE_NAME_GAME, "readonly");
					req = store.get(1);
					req.onsuccess = function (event) {
						Game.data_obj =JSON.parse(JSON.stringify(this.result));
						gameLoad();
					};
					req.onerror = function (event) {
						console.log("data loading failed!\nCode=" + event.error);
					};
				}
			}

		}, false);

		mainStage.addEventListener("click", function (event) {
			var data_obj = {};
			var mode="";
			switch (event.target.id) {
			case "save":
			case "load":
				data_obj =JSON.parse(JSON.stringify(Game.data_obj));
				data_obj.scenarioNum = Game.scenario_num;
				data_obj.name = document.getElementById("name").innerText;
				data_obj.scenario = document.getElementById("subtitle").innerText;
				top.postMessage(System.mesObject("data.html","game.html",event.target.id,data_obj), "*");
				break;
			case "skip":
				if (Game.game_skipping) {
					gameStop();
				} else {
					gameSkip();
				}
				break;
			default:
				gameStop();
				gameNext();
				break;
			}
		}, false);

		sysOpt.addEventListener("mouseover", function () {
			for (var i = 0, len = sysOpt.children.length; i < len; i++) {
				sysOpt.children[i].style.animation = "buttonIn 0.5s ease-out " + (0.1 + 0.1 * i) + "s forwards";
			}
		}, false);

		sysOpt.addEventListener("mouseout", function () {
			for (var len = sysOpt.children.length, i = 0; i < len; i++) {
				sysOpt.children[i].style.animation = "buttonOut 0.5s ease-out " + (0.1 + 0.1 * (len - i)) + "s forwards";
			}
		}, false);

	};

	System.openDb().then(function (value) {
		db=value;
		addEventListeners();
		return new Promise(function (resolve, reject) {
			var s = System.getObjectStore(db, System.STORE_NAME_GAME, "readonly");
			var r=s.count();
			r.onsuccess = function (event) {
				resolve(this.result);
			};
			r.onerror = function (event) {
				console.log("Counting all_num failed!\nCode=" + event.error);
			};
		});
	}).then(function (value) {
		Game.all_num = value;		
	}).catch(function (error) {
		console.log(error);
	});

})();
