var mymap;

var marks = []; //lista marker

var triples = []; //per ogni video tripla {id, olc, descrizione}

var markerClick;
var markerStat;
var rectangleStat;
var circleStat;
var popup;
var customPopup;
var markersLayer;
var controlSearch;
var customPopup2;
var wmiBtn;
var wmiMoreBtn;
var markerArray = [];

function videoData(vidId, olc, desc) {
	this.id = vidId;
	this.olc = olc;
	this.desc = desc;
}

String.prototype.replaceAt=function(index, replacement) {
	return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

function stripZeros(olc, num) {
	if (num == 4)
		return olc
			.substr(0, 9)
			.replaceAt(4, "0000");
	else
		return olc
			.substr(0, 9)
			.replaceAt(6, "00");
}


function onMapClick(e) {
	var coords = parseLatLng(e.latlng.toString());
	var olc10 = OpenLocationCode.encode(coords[0], coords[1], 10);
	var olc4 = olc10;
	olc4 = stripZeros(olc4, 4);
        var olc6 = olc10;
	olc6 = stripZeros(olc10, 2);
	console.log("olc10", olc10);
	console.log("olc6", olc6);
	console.log("olc4", olc4);
	var olc = olc4 + ':' + olc6 + ':' + olc10;
	customPopup = 'Olc: ' + olc;

	if (Cookies.get("email") != "false")
		customPopup = customPopup + '<button onclick="openNav(2)">Aggiungi un video relativo a questa posizione</button>';

	var area = OpenLocationCode.decode(olc10);
	var bounds = [[area.latitudeLo, area.longitudeLo], [area.latitudeHi, area.longitudeHi]];
	markerClick
		.setLatLng(e.latlng)
		.bindPopup(customPopup)
		.addTo(mymap);
	rectangleStat
		.setBounds(bounds)
		.addTo(mymap);
	Cookies.set("olc", olc);
	Cookies.set("olcPrecise", olc10);
	/*if (Cookies.get("initialized") == "false") {
		//makeRequest1(initWMI,coords);
		retrieveVideos(initWMI, coords,olc4.slice(0, -1));
		Cookies.set("initialized", "true");
		mymap.setView(coords);
	}*/

}




function onLocationFound(e) {
	var coords = parseLatLng(e.latlng.toString());
	var olc10 = OpenLocationCode.encode(coords[0], coords[1], 10);
	var olc4 = olc10;
	olc4 = stripZeros(olc4, 4);
        var olc6 = olc10;
	olc6 = stripZeros(olc10, 2);
	var olc = olc4 + ':' + olc6 + ':' + olc10;
	var customPopup3 = 'Olc: ' + olc;
	if (Cookies.get("email") != "false")
		customPopup3 = customPopup3 + '<button onclick="openNav(2)">Aggiungi un Video relativo a questo luogo</button>';

	//Cookies.set("location", e.latlng);
	var radius = e.accuracy;

	markerStat
			.setLatLng(e.latlng)
			.addTo(mymap)
			.bindPopup("You are within " + radius + " meters from this point. "+ customPopup3, {autoPan : false}).openPopup();
	circleStat
			.setLatLng(e.latlng)
			.setRadius(radius)
			.addTo(mymap);

	Cookies.set("olc", olc);
	Cookies.set("olcPrecise", olc10);
	Cookies.set("coords", coords);
	if (Cookies.get("initialized") == "false") {
		//makeRequest1(initWMI,coords);
		Cookies.set("initialized", "true");
		//retrieveVideos(initWMI, coords,olc4.slice(0, -1));
		retrieveVideos(olc4.slice(0, -1));
		mymap.setView(coords);
	}
}


//populate map with markers from sample data

function printMarkers(data) {
	for (i in data["data"]) {
		var title = data["data"][i]["name"],	//value searched
		    loc = data["data"][i]["location"]; //position found
		var codeArea = OpenLocationCode.decode(loc);
		var marker = new L.Marker(new L.latLng(codeArea.latitudeCenter, codeArea.longitudeCenter), {title: title} );//se property searched
		marker.bindPopup( title + customPopup2);
		markersLayer.addLayer(marker);
	}
}

function printMarkers2(data) {
	var count = 0;
	for (i in data) {
		var title = data[i]["snippet"]["title"];	//value searched
		var vidId = data[i]["id"]["videoId"]; //video id
		var desc = data[i]["snippet"]["description"];
		var loc = parseLocPrecise(desc); //position found
		if (loc.includes("+")) {
			triples.push(new videoData(vidId, loc, desc));
			if (!marks.includes(loc)) {
				marks.push(loc);
				count++;
				var codeArea = OpenLocationCode.decode(loc);
				markerArray.push(new L.Marker(
					new L.latLng(codeArea.latitudeCenter, codeArea.longitudeCenter),
					{title: title})
				);
				if (Cookies.get("email") != "false")
					customPopup = '<button onclick="openNav(2, ' + i + ')">Aggiungi un Video relativo a questo luogo</button>';
				markerArray[count-1].bindPopup("<h4>" + title + "</h4>" + customPopup);
				markersLayer.addLayer(markerArray[count-1]);
			}
		}
		else
			console.log("invalid olc");
	}
}

function parseLocPrecise(desc) {
	console.log(desc);
	return desc.slice(desc.indexOf(":", desc.indexOf(":")+1)+1, desc.indexOf(":", desc.indexOf(":", desc.indexOf(":")+1)+1));
}


function parseLatLng(ll){
	var virgola = ll.indexOf(',');
	var chiusa = ll.indexOf(')');
	var latl = ["a", "b"];
	latl[0] = ll.substring(7, virgola);
	latl[1] = ll.substring(virgola+2, chiusa);

	return latl;
}


function locateMe() {
	if (navigator.geolocation) {
		mymap.locate({setView: false, watch:true, enableHighAccuracy: true, maximumAge:20000, maxZoom: 16});
	}
}


function initMap() {

	// Inject YouTube API script
	var tag = document.createElement('script');
	tag.src = "//www.youtube.com/player_api";
	var firstScriptTag = document.getElementsByTagName('script')[0];
	firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


	handleClientLoad();

	Cookies.set("initialized", "false");


	/*function retrieveVideos() {
		console.log("requests.js wasn't loade in time");
	}*/


	mymap = L.map("mapid", {
			attributionControl: false,
			center: [44.49, 11.34],
			zoom: 13
	});

	L.control.attribution({position: 'topright'}).addTo(mymap);

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(mymap);

	boundsGlobal = [[54.559322, -5.767822], [56.1210604, -3.021240]];
	markerClick = L.marker();
	markerStat = L.marker();
	rectangleStat = L.rectangle(boundsGlobal);
	circleStat = L.circle();
	popup = L.popup();




	var recordBtn = L.easyButton(
		'<img src="static/images/camera.jpg" style="width:25px">',
		function() {
			openNav(1);
		},
		'Register a video to upload',
		{
			id: 'initiate-record',
			position: 'topleft',
		}
	).addTo(mymap);


	var gLogBtn = L.easyButton(
		'<img src="static/images/bigG.png" style="width:25px">',
		function() {
			handleAuthClick();
		},
		'Sign in with Google to access editor functionalities',
		{
			id: 'sign-in-or-out-button',
			position: 'topleft',
		}
	).addTo(mymap);


	var wmiRevoke = L.easyButton(
		'<img src="static/images/revoke.png" style="width:25px">',
		function() {
			revokeAccess();
		},
		'Revoke Google access to this site',
		{
			id: 'revoke-access-button',
			position: 'topleft',
		}
	).addTo(mymap);


	var wmiLocate = L.easyButton(
		'<i class="material-icons">gps_fixed</i>',
		function() {
			locateMe();
		},
		{
			id: 'wmiLocate',
			position: 'topleft'
		}
	).addTo(mymap);


	var wmiPrevBtn = L.easyButton(
		'<p>PREV</p>',
		function() {
			finalArrayIndex--;
			if (finalArrayIndex == finalArrayLenght - 2)
				wmiNextBtn.enable();
				//$('#wmiNextBtn').attr('disabled', 'disabled');
			else if (finalArrayIndex == 0)
				wmiPrevBtn.disable();
				//$('#wmiPrevBtn').attr('disabled', '');
			if (numVideos[finalArrayIndex] > 1)
				wmiMoreBtn.enable();
			else
				wmiMoreBtn.disable();
			setEmbedVideo();
		},
		'Select previous place',
		{
			id: 'wmiPrevBtn',
			position: 'bottomleft',
		}
	).addTo(mymap);

	var wmiNextBtn = L.easyButton(
		'<p>NEXT</p>',
		function() {
			finalArrayIndex++;
			console.log(finalArrayLenght);
			if (finalArrayIndex == finalArrayLenght-1) {
				//$('#wmiNextBtn').attr('disabled', '');
				wmiNextBtn.disable();
				console.log("disabilito next");
			}
			else if (finalArrayIndex == 1)
				wmiPrevBtn.enable();
				//$('#wmiPrevBtn').attr('disabled', 'disabled');
			if (numVideos[finalArrayIndex] > 1)
				wmiMoreBtn.enable();
			else
				wmiMoreBtn.disable();
			setEmbedVideo();
		},
		'Select next place',
		{
			id: 'wmiNextBtn',
			position: 'bottomleft',
		}
	).addTo(mymap);

	wmiBtn = L.easyButton(
		'<p>WHERE M I</p>',
		function() {
			initWMI(Cookies.get("coords"));
			wmiNextBtn.enable();
			console.log(numVideos[finalArrayIndex]);
			if (numVideos[finalArrayIndex] > 1)
				wmiMoreBtn.enable();
			wmiStopBtn.enable();
			/*$("#wmiNextBtn").attr('disabled','');
			$("#wmiMoreBtn").attr('disabled','');
			$("#wmiStopBtn").attr('disabled','');
			*/
			setEmbedVideo();
		},
		'WHERE M I',
		{
			id: 'wmiBtn',
			position: 'bottomleft',
		}
	).addTo(mymap);



	var wmiContinueBtn = L.easyButton(
		'<p>CONTINUE</p>',
		function() {
			wmiContinueBtn.disable();
			wmiStopBtn.enable();
			//$("#wmiContinueBtn").attr('disabled','disabled');
			//$("#wmiStopBtn").attr('disabled','');
			//$('#myEmbedded').startVideo();
			myPlayer.playVideo();
		},
		'Continue reproduction of clip',
		{
			id: 'wmiContinueBtn',
			position: 'bottomright',
		}
	).addTo(mymap);

	wmiMoreBtn = L.easyButton(
		'<p>MORE</p>',
		function() {
			videoIndexArr[finalArrayIndex] = (videoIndexArr[finalArrayIndex] + 1) % numVideos[finalArrayIndex];
			setEmbedVideo();
		},
		'Start next clip for this location',
		{
			id: 'wmiMoreBtn',
			position: 'bottomright',
		}
	).addTo(mymap);

	var wmiStopBtn = L.easyButton(
		'<p>STOP</p>',
		function() {
			wmiContinueBtn.enable();
			wmiStopBtn.disable();
			//$("#wmiContinueBtn").attr('disabled','');
			//$("#wmiStopBtn").attr('disabled','disabled');
			myPlayer.pauseVideo(); //.contentWindow.postMessage('{"event":"command","func":"stopVideo","args":""}', '*');
		},
		'Stop reproduction of clip',
		{
			id: 'wmiStopBtn',
			position: 'bottomright',
		}
	).addTo(mymap);

	wmiBtn.disable();
	wmiNextBtn.disable();
	wmiPrevBtn.disable();
	wmiContinueBtn.disable();
	wmiMoreBtn.disable();
	wmiStopBtn.disable();

	mymap.on('click', onMapClick);

	mymap.on('locationfound', onLocationFound);
	/*
	function onLocationError(e) {
		alert(e.message);
	}

	mymap.on('locationerror', onLocationError);
	*/
	markersLayer = new L.LayerGroup();	//layer contain searched elements

	mymap.addLayer(markersLayer);

	controlSearch = new L.Control.Search({
		position:'topright',
		layer: markersLayer,
		initial: false,
		zoom: 12,
		marker: false
	});

	mymap.addControl( controlSearch );
	/*if (Cookies.get("email") != "false")
		customPopup2 = '<div data-role="popup" id="popupMenu" data-theme="b"><ul data-role="listview" data-inset="true" style="min-width:210px;"><li><a href="#">Raggiungi riferimento più vicino</a></li><li><input input type="file" id="file" class="button" accept="video"><button id="button">Upload</button></li></ul></div>';
	else
		customPopup2 = '<div data-role="popup" id="popupMenu" data-theme="b"><ul data-role="listview" data-inset="true" style="min-width:210px;"><li><a href="#">Raggiungi riferimento più vicino</a></li></ul></div>';
	*/
}
