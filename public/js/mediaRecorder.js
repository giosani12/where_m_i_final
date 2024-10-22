var video = document.querySelector('video');

function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(camera) {
        callback(camera);
    }).catch(function(error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    });
}

function stopRecordingCallback() {
    video.src = video.srcObject = null;
    video.muted = false;
    video.volume = 1;
    video.src = URL.createObjectURL(recorder.getBlob());
    recorder.camera.stop();
}

var recorder; // globally accessible

document.getElementById('btn-start-recording').onclick = function() {
    this.disabled = true;
    captureCamera(function(camera) {
        video.muted = true;
        video.volume = 0;
        video.srcObject = camera;

        recorder = RecordRTC(camera, {
            type: 'video'
        });

        recorder.startRecording();

        // release camera on stopRecording
        recorder.camera = camera;

        document.getElementById('btn-stop-recording').disabled = false;
    });
};

document.getElementById('btn-stop-recording').onclick = function() {
    document.getElementById('btn-download').disabled = false;
    document.getElementById('btn-discard').disabled = false;
    this.disabled = true;
    recorder.stopRecording(stopRecordingCallback);
};

document.getElementById('btn-discard').onclick = function() {
    recorder.destroy();
    recorder = null;
    this.disabled = true;
    document.getElementById('btn-download').disabled = true;
    document.getElementById('btn-start-recording').disabled = false;
};


document.getElementById('btn-download').onclick = function() {
    recorder.save("prova.webm");
    document.getElementById('btn-start-recording').disabled = false;
};

function openNav(num, isMarked) {
	if (num == 1)
		document.getElementById("myNav"+num).style.width = "100%";
	else {
		if (Cookies.get("email")) {
			document.getElementById("myNav"+num).style.width = "100%";
			//send xhr to /api/places and put res.data in autocomplete
		}
		else
			alert("Per caricare un video devi essere loggato");
	}
	if(isMarked)
	{
		console.log(markers[isMarked]);
		$('#locname').attr('placeholder', markers[isMarked][1]);
		//$('#locname').css('display', 'none');
		var olc = markers[isMarked][2];
		var olc4 = stripZeros(olc, 4);
		var olc6 = stripZeros(olc, 2);
		Cookies.set("olcPrecise", olc);
		Cookies.set("olc", olc4 + ":" + olc6 + ":" + olc );
	}
}
/* Open when someone clicks on the span element 
function openNav() {
  document.getElementById("myNav").style.width = "100%";
  console.log("openNav()");
}

function openNav2() {
  document.getElementById("myNav2").style.width = "100%";
  console.log("openNav2()");
}

/* Close when someone clicks on the "x" symbol inside the overlay */


function closeNav(num) {
	if(num<5)
		document.getElementById("myNav"+num).style.width = "0%";
	else
		document.getElementById("myNav"+num).style.height = "0%";
}


