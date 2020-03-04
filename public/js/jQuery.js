
var finalArrayIndex = 0;
var finalArray;
var finalArrayLenght = 0;
var videoIndexArr;
var numVideos;
let strStart = "https://www.youtube.com/embed/";
let strEnd = "?rel=0&controls=0&showinfo=0&enablejsapi=1";
var locations;

//////////////// I F R A M E       P L A Y E R //////////////////////////////////

// https://developers.google.com/youtube/iframe_api_reference

// Inject YouTube API script
var tag = document.createElement('script');
tag.src = "//www.youtube.com/iframe_api"; //player_api
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// global variable for the player
var myPlayer;

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
  // create the global player from the specific iframe (#video)
  myPlayer = new YT.Player('video', {
	playerVars: {'controls' : 0, 'rel' : 0, 'showinfo' : 0, 'frameborder' : 0, 'allowscriptaccess' : 'always', 'enablejsapi' : 1},
	events: {

    }
  });
}

function loadVideoId(id){
	myPlayer.loadVideoById(id);
}

function stop(){
	myPlayer.pauseVideo();
}

function play(){
	myPlayer.playVideo();
}

function filter(filterString) {
	for (i in finalArray) {
		for (k in finalArray[i][2]) {
			if (finalArray[i][2][k]["desc"].contains(filterString["Flang"])
				&& finalArray[i][2][k]["desc"].contains(filterString["Faud"])
				&& finalArray[i][2][k]["desc"].contains(filterString["Fpurp"]))
				finalArray[i][2][k]["valid"] = true;
			else
				finalArray[i][2][k]["valid"] = false;
		}
	}
}

//TODO 
$('#filterBtn').on("click", function() {filter($('#myFilter').serializeJSON())});

function initWMI(curPos) {
	//var locations = new Array(triples.length);
	//console.log(locations);
	console.log(triples);
	console.log(curPos);
	locations = [];
	for (j in marks) {
		//var loc = triples[j]["olc"]; //position found
		try {
			var codeArea = OpenLocationCode.decode(marks[j]);
			locations.push([Math.pow(Math.abs(curPos[0] - codeArea.latitudeCenter), 2) + Math.pow(Math.abs(curPos[1] - codeArea.longitudeCenter), 2), j]);
		} catch (err) {
                	console.log(err);
	        }
	}
	locations.sort(sortFunction)
	console.log(marks);
	finalArray = new Array(marks.length);
	videoIndexArr = new Array(marks.lenght);
	numVideos = new Array(marks.lenght)
	//console.log(videosData["data"][0]);
	for (l in locations) {
		finalArray[l] = [];
		/*finalArray[l][0] = marks[l];
		finalArray[l][1] = triples.filter(function filterFunction(triple) {
				return triple["olc"] == marks[l];
		});*/
		var scnd = [];
		scnd = triples.filter(function filter(triple) {
			return triple["olc"] == marks[locations[l][1]];
		});
		numVideos[l]=0;
		for (i in scnd)
			numVideos[l]++;
		//numVideos[l] = scnd.lenght;
		finalArray[l].push(marks[locations[l][1]], scnd);
		videoIndexArr[l] = 0;
		finalArrayLenght++;
	}
	console.log(finalArray);
	wmiBtn.enable();
}


function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

function setEmbedVideo() {
	//$('#video').attr('src', strStart + 
	console.log(finalArrayIndex, finalArray[finalArrayIndex][1]);
	try {
		var bounds = OpenLocationCode.decode(markers.find(function myFind(marker) {
			return marker[2] == finalArray[finalArrayIndex][0];
		})[2]);
	} catch (err) {
		console.log(err);
	}
	mymap.setView(
		[bounds.latitudeCenter,bounds.longitudeCenter],
		20
	);
	loadVideoId(finalArray[finalArrayIndex][1][videoIndexArr[finalArrayIndex]]["id"] );
	console.log(finalArray[finalArrayIndex][1][videoIndexArr[finalArrayIndex]]["id"]);
	stop();
	play();
	//set View to marker of finalArray[finalArrayIndex]["name"]
}


