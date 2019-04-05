(function () {
	var AudioContext = window.AudioContext || window.webkitAudioContext;

	var sysOpt = document.getElementById("sysOpt");

	window.addEventListener("load", function () {
		var bgm = document.getElementById("bgm");
		bgm.src = System.BGM_PATH+"0"+System.BGM_EX;
		bgm.volume = 0.3;
		bgm.loop = "loop";
		bgm.play();
		/*		var audioCtx=new AudioContext();
		var source=audioCtx.createMediaElementSource(bgm);
		var gainNode=audioCtx.createGain();
		gainNode.gain.value=0.3;
		source.connect(gainNode);
		gainNode.connect(audioCtx.destination);
		 */
	}, false);

	sysOpt.addEventListener("click", function (event) {
		var target="";
		switch (event.target.id) {
		case "start":
		case "conti":
			target = "game.html";		
			break;
		case "load":
			target = "data.html";
			break;
		case "quit":
			target = "";
			break;
		};
		top.postMessage(System.mesObject(target,"title.html",event.target.id,null), "*");
	}, false);

})();
