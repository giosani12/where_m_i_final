var postData
function createMd(callback) {
	postData = $('#myForm').serializeJSON(); //data from input
	console.log(postData);
	callback(postData);
}
function cMcallback(postData) {
	Cookies.set("locname", postData["locname"]);
        postData["loccoords"] = getCookie("olc");
        postData["loccoordsPrecise"] = getCookie("olcPrecise");

        var md = getCookie("olc")+':'+postData["purpose"]+':'+postData["language"]+':';


        var i=0;
	var cont = JSON.stringify(postData["content"]);
	cont = cont.replace('[','')
		.replace(/"/g,'')
		.replace(/,/g,'')
		.replace(']','');
	md = md + cont.substring(0, cont.lenght - 1);
	console.log(cont.substring(0, cont.lenght - 1));
	console.log(md);

        if(postData["audience"] != "gen")
                md = md + ':' + postData["audience"];

	if(postData["detail"] != "0")
                md = md + ':P' + postData["detail"];

        Cookies.set("metadata", md);
	//Cookies.set("postData", postData);

}


async function StampValue() {
	var url = "https://site181950.tw.cs.unibo.it/api/videos";
	var method = "POST";
	postData["user"] = getCookie("email");
	postData["url"] = "https://www.youtube.com/watch?v=" + getCookie("videoURL");

	// You REALLY want shouldBeAsync = true.
	// Otherwise, it'll block ALL execution waiting for server response.
	var shouldBeAsync = true;

	var request = new XMLHttpRequest();

	// Before we send anything, we first have to say what we will do when the
	// server responds. This seems backwards (say how we'll respond before we send
	// the request? huh?), but that's how Javascript works.
	// This function attached to the XMLHttpRequest "onload" property specifies how
	// the HTTP response will be handled. 
	request.onload = function () {

	   // Because of javascript's fabulous closure concept, the XMLHttpRequest "request"
	   // object declared above is available in this function even though this function
	   // executes long after the request is sent and long after this function is
	   // instantiated. This fact is CRUCIAL to the workings of XHR in ordinary
	   // applications.

	   // You can get all kinds of information about the HTTP response.
	   var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
	   var data = request.responseText; // Returned data, e.g., an HTML document.
	}

	request.open(method, url, shouldBeAsync);

	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	// Or... request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	console.log(JSON.stringify(postData));
	console.log(JSON.parse(postData));
	console.log(postData);
	// Actually sends the request to the server.
	request.send(JSON.stringify(postData));
}

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2)
		return parts.pop().split(";").shift();
}


