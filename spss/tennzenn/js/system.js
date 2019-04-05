(function(){
	var System={};
	
	System.DB_NAME = "spss_tennzenn";
	System.DB_VERSION = 1;
	System.STORE_NAME_SAVE = "saveData";
	System.STORE_NAME_GAME= "gameData";
	
	System.HTML_PATH="../html/";
	System.JS_PATH="../js/";
	System.CSS_PATH="../css/";
	
	System.BG_PATH = "../pictures/bg/";
	System.BG_EX = ".jpg";
	System.BGM_PATH = "../bgm/";
	System.BGM_EX = ".mp3";
	System.SYSICO_PATH="../sysico/";
	System.SYSICO_EX=".png";
	System.CHARACTER_PATH="../pictures/character/";
	System.CHARACTER_EX=".png";
	
	System.openDb=function() {
		return new Promise(function (resolve, reject) {
			var indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
			var request = indexedDB.open(System.DB_NAME, System.DB_VERSION);
			request.onerror = function (event) {
				console.log("Opening database " + System.DB_NAME + " with version " + System.DB_VERSION + " failed!");
			};
			request.onsuccess = function (event) {
				resolve(this.result);
			};
			request.onupgradeneeded = function (event) {
				console.log("Database " + System.DB_NAME + " with version " + System.DB_VERSION + " has initialized!");
			};
		});
	};
	
	System.getObjectStore=function(db,store_name, mode) {
		var tx = db.transaction(store_name, mode);
		return tx.objectStore(store_name);
	};
	
	System.mesObject=function(target,origin,mode,data_obj){
		var mes_obj={};
		mes_obj.target=target||"";
		mes_obj.origin=origin||"";
		mes_obj.mode=mode||"";
		mes_obj.data_obj=data_obj||null;
		return mes_obj;
	};
	System.matchesSelector=function(element,selector){
		if(element.matchesSelector){
			return element.matchesSelector(selector);
		}else if(element.msMatchesSelector){
			return element.msMatchesSelector(selector);
		}else if(element.mozMatchesSelector){
			return element.mozMatchesSelector(selector);
		}else if(element.webkitMatchesSelector){
			return element.webkitMatchesSelector(selector);
		}else{
			throw new Error("Not sopported!")
		}
	};

	window.System=System;
})();
