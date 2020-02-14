async function StampValue() {
	var url = "http://localhost:8000/api/videos";
	var method = "POST";
	var postData = await $('#myForm').serializeJSON(); //dati del video in json
	postData["user"] = getCookie("email");
	postData["url"] = "https://www.youtube.com/watch?v=" + getCookie("videoURL");
	postData["locname"] = "Pizza Minore";
	postData["loccoords"] = getCookie("olc");
	
	var md = getCookie("olc")+':'+postData["purpose"]+':'+postData["language"]+':';
	
	var i;
	let arr = postData["content"];
	for (i=0; i<arr.lenght(); i++ )
	{
		if(i != arr.lenght()-1)
			md += arr[i]+'-';
		else
			md += arr[i];
	}

	if(postData["audience"] != "gen")
	{
		md = md + ':' + postData["audience"];
	}

        if(postData["detail"] != "0")
        {
                md = md + ':P' + postData["detail"];
        }
	
	Cookies.set("metadata", md);
	console.log(JSON.stringify(postData));
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

	// Actually sends the request to the server.
	request.send(JSON.stringify(postData));

	function getCookie(name) {
	  var value = "; " + document.cookie;
	  var parts = value.split("; " + name + "=");
	  if (parts.length == 2) return parts.pop().split(";").shift();
	}
}
