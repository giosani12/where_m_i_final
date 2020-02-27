$('.wmiBtns').attr('disabled', true);
/*
$(document).ready(function(){
  
  $('#stars li').on('mouseover', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently mouse on
   
    // Now highlight all the stars that's not after the current hovered star
    $(this).parent().children('li.star').each(function(e){
      if (e < onStar) {
        $(this).addClass('hover');
      }
      else {
        $(this).removeClass('hover');
      }
    }); 
    
  }).on('mouseout', function(){
    $(this).parent().children('li.star').each(function(e){
      $(this).removeClass('hover');
    });
  }); 
  
  
 
  $('#stars li').on('click', function(){
    var onStar = parseInt($(this).data('value'), 10); // The star currently selected
    var stars = $(this).parent().children('li.star');
    
    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }
    
    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass('selected');
    }
  });
 
  
});*/
var finalArrayIndex = 0;
var finalArray;
var finalArrayLenght = 0;
let strStart = "https://www.youtube.com/embed/";
let strEnd = "?rel=0&controls=0&showinfo=0&autoplay=1";
/*
var videosData;
var xmlhttp = new XMLHttpRequest();
var url = "https://site181950.tw.cs.unibo.it/api/videos";
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		console.log("videos retrived suddenly");
	}
};
xmlhttp.open("GET", url, true);
xmlhttp.onload = function () {
	videosData = JSON.parse(this.responseText);
}
xmlhttp.send();
*/




function initWMI(curPos) {
	var locations = new Array(placesData["data"].length);
	console.log(locations);
	console.log(placesData["data"]);
	for (i in locations)
		locations[i] = [];
	for (j in placesData["data"]) {
		var loc = placesData["data"][j]["location"]; //position found
		var codeArea = OpenLocationCode.decode(loc);
		locations.push([Math.pow(Math.abs(curPos[0] - codeArea.latitudeCenter), 2) + Math.pow(Math.abs(curPos[1] - codeArea.longitudeCenter), 2), j]);
	}
	console.log(locations);
	locations.sort(sortFunction);
	console.log(locations);
	finalArray = new Array(locations.length/2);
	console.log(videosData["data"][0]);
	for (l in locations) {
		finalArray[l] = videosData["data"].find( function(item) { return item["locname"] == placesData["data"][locations[l][1]]["name"] } );
		finalArrayLenght++;
	}
	console.log(finalArray);
	$('#wmiBtn').attr('disabled', false);
}


function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}


$('#wmiBtn').on('click', function () {
	$('#wmiNext').attr('disabled', false);
	$('#wmiStop').attr('disabled', false);
	$('#wmiMore').attr('disabled', false);
	setEmbedVideo();
});

$('#wmiNext').on('click', function () {
	finalArrayIndex++;
	console.log(finalArrayIndex,finalArrayLenght);
	if (finalArrayIndex == finalArrayLenght-1) {
		$('#wmiNext').attr('disabled', true);
		console.log("disabilito next");
	}
	else if (finalArrayIndex == 1)
		$('#wmiPrev').attr('disabled', false);
	setEmbedVideo();
});

$('#wmiPrev').on('click', function () {
	finalArrayIndex--;
	if( finalArrayIndex == finalArrayLenght-2)
		$('#wmiNext').attr('disabled', false);
	else if (finalArrayIndex == 0)
		$('#wmiPrev').attr('disabled', true);
	setEmbedVideo();
});

$('#wmiStop').on('click', function () {
	$('#wmiContinue').attr('disabled', false);
	$('#wmiStop').attr('disabled', true);
	$('#myEmbedded').stopVideo();
});

$('#wmiMore').on('click', function () {
});

$('#wmiContinue').on('click', function () {
	$('#wmiContinue').attr('disabled', true);
	$('#wmiStop').attr('disabled', false);
	$('#myEmbedded').startVideo();
});


function setEmbedVideo() {
	$('#myEmbedded').attr('src', strStart + finalArray[finalArrayIndex]["videoid"] + strEnd);
	console.log(strStart + finalArray[finalArrayIndex]["videoid"] + strEnd);
	//set View to marker of finalArray[finalArrayIndex]["name"]
}

