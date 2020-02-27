var postData
function createMd(callback) {
	postData = $('#myForm').serializeJSON(); //data from input
	console.log(postData);
	callback(postData);
}

function cMcallback(postData) {
	Cookies.set("locname", postData["locname"]);
        postData["loccoords"] = Cookies.get("olc");
        postData["loccoordsPrecise"] = Cookies.get("olcPrecise");

        var md = Cookies.get("olc")+':'+postData["purpose"]+':'+postData["language"]+':';


        var i=0;
	var cont = JSON.stringify(postData["content"]);
	cont = cont.replace('[','')
		.replace(/"/g,'')
		.replace(/,/g,'')
		.replace(']','');
	md = md + cont.slice(0, -1);
	postData["content"] = cont.slice(0, -1);
	console.log(md);

        if(postData["audience"] != "gen")
                md = md + ':' + postData["audience"];

	if(postData["detail"] != "0")
                md = md + ':P' + postData["detail"];

        Cookies.set("Videometadata", md);
	//Cookies.set("postData", postData);

}


async function StampValue() {
	var url = "https://site181950.tw.cs.unibo.it/api/videos";
	var method = "POST";
	postData["user"] = Cookies.get("email");
	postData["videoid"] = Cookies.get("videoID");

	// You REALLY want shouldBeAsync = true.
	// Otherwise, it'll block ALL execution waiting for server response.
	var shouldBeAsync = true;

	var request = new XMLHttpRequest();

	request.onload = function () {
	   var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
	   var data = request.responseText; // Returned data, e.g., an HTML document.
	}

	request.open(method, url, shouldBeAsync);

	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	// Or... request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	console.log(JSON.stringify(postData));
	// Actually sends the request to the server.
	request.send(JSON.stringify(postData));
}



