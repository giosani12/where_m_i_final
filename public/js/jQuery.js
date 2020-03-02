//$('.wmiBtns').attr('disabled', true);
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
var videoIndexArr;
//var finalArrayLenght = 0;
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
	//console.log(videosData["data"][0]);
	for (l in marks) {
		finalArray[l] = [];
		/*finalArray[l][0] = marks[l];
		finalArray[l][1] = triples.filter(function filterFunction(triple) {
				return triple["olc"] == marks[l];
		});*/
		finalArray[l].push(marks[l], triples.filter(function filter(triple) {
				return triple["olc"] == marks[l];
		}));
		videoIndexArr[l] = 0;
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
/*
function filterFunction(elem, tocheck) {
	return elem === tocheck;
}
*/
/*
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
*/

function setEmbedVideo() {
	$('#myEmbedded').attr('src', strStart + finalArray[finalArrayIndex][1][videoIndexArr[finalArrayIndex]]["id"] + strEnd);
	console.log(strStart + finalArray[finalArrayIndex][1][videoIndexArr[finalArrayIndex]]["id"] + strEnd);
	//set View to marker of finalArray[finalArrayIndex]["name"]
}

