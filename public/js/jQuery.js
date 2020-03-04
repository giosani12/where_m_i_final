

var finalArrayIndex = 0;
var finalArray;
var finalArrayLenght = 0;
var videoIndexArr;
var numVideos;
let strStart = "https://www.youtube.com/embed/";
let strEnd = "?rel=0&controls=0&showinfo=0&enablejsapi=1";
var locations;

function initWMI(curPos) {
	//var locations = new Array(triples.length);
	//console.log(locations);
	console.log(triples);
	locations = [];
	for (j in marks) {
		//var loc = triples[j]["olc"]; //position found
		var codeArea = OpenLocationCode.decode(marks[j]);
		locations.push([Math.pow(Math.abs(curPos[0] - codeArea.latitudeCenter), 2) + Math.pow(Math.abs(curPos[1] - codeArea.longitudeCenter), 2), j]);
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
	$('#video').attr('src', strStart + finalArray[finalArrayIndex][1][videoIndexArr[finalArrayIndex]]["id"] + strEnd);
	console.log(strStart + finalArray[finalArrayIndex][1][videoIndexArr[finalArrayIndex]]["id"] + strEnd);
	myPlayer.playVideo();
	//set View to marker of finalArray[finalArrayIndex]["name"]
}


//////////////// I F R A M E       P L A Y E R //////////////////////////////////

// https://developers.google.com/youtube/iframe_api_reference

// global variable for the player
var myPlayer;

// this function gets called when API is ready to use
function onYouTubePlayerAPIReady() {
  // create the global player from the specific iframe (#video)
  myPlayer = new YT.Player('video', {
    events: {
      // call this function when player is ready to use
      //'onReady': onPlayerReady
    }
  });
}

