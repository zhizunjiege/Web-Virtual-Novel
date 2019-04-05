(function () {
	var main = document.getElementById("main");
	var stage=document.getElementById("stage");
	
	main.addEventListener("click", function (event) {
		if (main.contains(event.target)) {
			var url = "./" + event.target.id + "/html/main.html";
			window.open(url, "_self");
		}
	}, false);
	
})();
