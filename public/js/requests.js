var videosData;
var placesData;

var resultsToRetrieve = 0;

function makeRequest1(callback, cbArg) {
	var xmlhttp1 = new XMLHttpRequest();
	var url = "https://site181950.tw.cs.unibo.it/api/videos";
	xmlhttp1.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
	                console.log("videos retrived suddenly");
	        }
	};
	xmlhttp1.open("GET", url, true);
	xmlhttp1.onload = function () {
        	videosData = JSON.parse(this.responseText);
		makeRequest2(callback, cbArg);
	}
	xmlhttp1.send();
}

function makeRequest2(callback, cbArg) {
	var xmlhttp2 = new XMLHttpRequest();
	var url = "https://site181950.tw.cs.unibo.it/api/places";
	xmlhttp2.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
	                console.log("places retrived suddenly");
	        }
	};
	xmlhttp2.open("GET", url, true);
	xmlhttp2.onload = function () {
	        placesData = JSON.parse(this.responseText);
		callback(cbArg);
	        printMarkers(placesData);
	}
	xmlhttp2.send();
}

// query videos from yt

/*function printMarkers2() {
	console.log("printmarkers2 wasn't loaded correctly");
}*/

function retrieveVideos(/*callback, cbArg, */center, nw, ne, sw, se, nc, sc) {
	retrieveVideo(center);
	retrieveVideo(nw + " -" + center);
	retrieveVideo(ne + " -" + center);
	retrieveVideo(sw + " -" + center);
	retrieveVideo(se + " -" + center);
	retrieveVideo(nc + " -" + center);
	retrieveVideo(sc + " -" + center);
	wmiBtn.enable();
}


function retrieveVideo(/*callback, cbArg, */query, nextpage) {
	if (nextpage) {
		gapi.client.youtube.search.list({
			"part": "snippet",
			"maxResults": 50,
			"pageToken": nextpage,
			"q": query,
			"type": "video",
			"videoEmbeddable": "true"
		})
			.then(function(response) {
				//handle response
				printMarkers2(response["result"]["items"]);
				console.log("Response", response);
				if ((resultsToRetrieve -= response["result"]["pageInfo"]["resultsPerPage"]) > 0)
					retrieveVideo(/*callback, cbArg, */query, response["result"]["nextPageToken"]);
				else
					resultsToRetrieve = 0;
				//else
				//	wmiBtn.enable();
				//	callback(cbArg);
			},
			function(err) { console.error("Execute error", err); });
	}
	else {
		gapi.client.youtube.search.list({
			"part": "snippet",
			"maxResults": 50,
			"q": query,
			"type": "video",
			"videoEmbeddable": "true"
		})
			.then(function(response) {
				console.log("totRes", response["result"]["pageInfo"]["totalResults"]);
				resultsToRetrieve = response["result"]["pageInfo"]["totalResults"];
				console.log("Response", response);
				printMarkers2(response["result"]["items"]);
				if ((resultsToRetrieve -= response["result"]["pageInfo"]["resultsPerPage"]) > 0)
					retrieveVideo(/*callback, cbArg, */query, response["result"]["nextPageToken"]);
				else
					resultsToRetrieve = 0;
				//else
				//	wmiBtn.enable();
				//	callback(cbArg);
			},
			function(err) { console.error("Execute error", err); });
	}
}

