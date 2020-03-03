

var finalArrayIndex = 0;
var finalArray;
var videoIndexArr;
var numVideos;
let strStart = "https://www.youtube.com/embed/";
let strEnd = "?rel=0&controls=0&showinfo=0&autoplay=1";




function initWMI(curPos) {
	//var locations = new Array(triples.length);
	//console.log(locations);
	console.log(triples);
	marks.sort(sortFunction);
	console.log(marks);
	finalArray = new Array(marks.length);
	videoIndexArr = new Array(marks.lenght);
	numVideos = new Array(marks.lenght)
	//console.log(videosData["data"][0]);
	for (l in marks) {
		finalArray[l] = [];
		/*finalArray[l][0] = marks[l];
		finalArray[l][1] = triples.filter(function filterFunction(triple) {
				return triple["olc"] == marks[l];
		});*/
		var scnd = [];
		scnd = triples.filter(function filter(triple) {
			return triple["olc"] == marks[l];
		});
		numVideos[l]=0;
		for (i in scnd)
			numVideos[l]++;
		//numVideos[l] = scnd.lenght;
		finalArray[l].push(marks[l], scnd);
		videoIndexArr[l] = 0;
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
	$('#myEmbedded').attr('src', strStart + finalArray[finalArrayIndex][1][videoIndexArr[finalArrayIndex]]["id"] + strEnd);
	console.log(strStart + finalArray[finalArrayIndex][1][videoIndexArr[finalArrayIndex]]["id"] + strEnd);
	//set View to marker of finalArray[finalArrayIndex]["name"]
}

