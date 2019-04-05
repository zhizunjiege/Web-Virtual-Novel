(function () {
	var indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
	
	var mainStage = document.getElementById("mainStage");
	var secondStage = mainStage.nextElementSibling;
	
	var mes_obj=null;
	
	window.addEventListener("load", function () {
		indexedDB.databases().then(function (data) {
			var initScript = null;
			var flag = true;
			for (var i = 0; i < data.length; i++) {
				if (data[i].name == System.DB_NAME && data[i].version == System.DB_VERSION) {
					flag = false;
					break;
				}
			}
			if (flag) {
				initScript = document.createElement("script");
				initScript.src = System.JS_PATH+"init.js";
				document.body.appendChild(initScript);
			}
			secondStage.src =  System.HTML_PATH+"data.html";
		});
	}, false);

	window.addEventListener("message", function (event) {
		mes_obj = event.data;
		switch (mes_obj.target) {
		case "game.html":
		case "title.html":
			if (mainStage.src.indexOf(mes_obj.target) == -1) {
				mainStage.src = System.HTML_PATH+mes_obj.target;
			} else {
				mainStage.contentWindow.postMessage(mes_obj, "*");
			}
			secondStage.style.visibility = "hidden";
			break;
		case "data.html":
			if (secondStage.src.indexOf(mes_obj.target) == -1) {
				secondStage.src =System.HTML_PATH+mes_obj.target;
			} else {
				secondStage.contentWindow.postMessage(mes_obj, "*");
			}
			secondStage.style.visibility = "visible";
			break;
		default:
			window.open("../../spss.html","_self");
		}
	}, false);

	mainStage.addEventListener("load", function () {
		if (mes_obj) {
			mainStage.contentWindow.postMessage(mes_obj, "*");
		}
	}, false);

	secondStage.addEventListener("load", function () {
		if (mes_obj) {
			secondStage.contentWindow.postMessage(mes_obj, "*");
		}
	}, false);

})();
