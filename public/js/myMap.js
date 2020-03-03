var mymap;

var marks = []; //lista marker

var triples = []; //per ogni video tripla {id, olc, descrizione}

var markerClick;
var markerStat;
var rectangleStat;
var circleStat;
var popup;
var markersLayer;
var controlSearch;
var customPopup2;

function videoData(vidId, olc, desc) {
	this.id = vidId;
	this.olc = olc;
	this.desc = desc;
}


function onMapClick(e) {
	var coords = parseLatLng(e.latlng.toString());
	var olc4 = OpenLocationCode.encode(coords[0], coords[1], 4);
	var olc6 = OpenLocationCode.encode(coords[0], coords[1], 6);
	var olc11 = OpenLocationCode.encode(coords[0], coords[1], 11);
	var olc = olc4 + ':' + olc6 + ':' + olc11;
	var customPopup = 'Posizione:' + coords[0] + ', ' + coords[1] + ' olc: ' + olc;

	if (Cookies.get("email") != "false")
		customPopup = customPopup + '<button onclick="openNav(2)">Aggiungi un video relativo a questa posizione</button>';

	var area = OpenLocationCode.decode(olc11);
	var bounds = [[area.latitudeLo, area.longitudeLo], [area.latitudeHi, area.longitudeHi]];
	markerClick
		.setLatLng(e.latlng)
		.bindPopup(customPopup)
		.addTo(mymap);
	rectangleStat
		.setBounds(bounds)
		.addTo(mymap);
	//Cookies.set("olc", olc);
	//Cookies.set("olcPrecise", olc11);
	/*if (Cookies.get("initialized") == "false") {
		//makeRequest1(initWMI,coords);
		retrieveVideos(initWMI, coords,olc4.slice(0, -1));
		Cookies.set("initialized", "true");
		mymap.setView(coords);
	}*/

}




function onLocationFound(e) {
	var coords = parseLatLng(e.latlng.toString());
	var olc4 = OpenLocationCode.encode(coords[0], coords[1], 4);
        var olc6 = OpenLocationCode.encode(coords[0], coords[1], 6);
        var olc11 = OpenLocationCode.encode(coords[0], coords[1], 11);
	var olc = olc4 + ':' + olc6 + ':' + olc11;
	var customPopup = 'Posizione:' + coords[0] + ', ' + coords[1] + ' olc: ' + olc;
	if (Cookies.get("email") != "false")
		customPopup = customPopup + '<button onclick="openNav(2)">Aggiungi un Video relativo a questo luogo</button>';

	//Cookies.set("location", e.latlng);
	var radius = e.accuracy;

	markerStat
			.setLatLng(e.latlng)
			.addTo(mymap)
			.bindPopup("You are within " + radius + " meters from this point. "+ customPopup, {autoPan : false}).openPopup();
	circleStat
			.setLatLng(e.latlng)
			.setRadius(radius)
			.addTo(mymap);

	Cookies.set("olc", olc);
	Cookies.set("olcPrecise", olc11);
	if (Cookies.get("initialized") == "false") {
		//makeRequest1(initWMI,coords);
		Cookies.set("initialized", "true");
		retrieveVideos(initWMI, coords,olc4.slice(0, -1));
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
	for (i in data) {
		var title = data[i]["snippet"]["title"];	//value searched
		var vidId = data[i]["id"]["videoId"]; //video id
		var desc = data[i]["snippet"]["description"];
		var loc = parseLocPrecise(desc); //position found
		if (loc.includes("+")) {
			triples.push(new videoData(vidId, loc, desc));
			if (!marks.includes(loc)) {
				marks.push(loc);
				var codeArea = OpenLocationCode.decode(loc);
				var marker = new L.Marker(new L.latLng(codeArea.latitudeCenter, codeArea.longitudeCenter), {title: title} );//se property searched
				marker.bindPopup( title + customPopup2);
				markersLayer.addLayer(marker);
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
		'<img src="static/images/camera.jpg" style="width:16px">',
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
		'<img src="static/images/bigG.png" style="width:16px">',
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
		'<img src="static/images/revoke.png" style="width:16px">',
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
		'<strong>PREV</strong>',
		function() {
			finalArrayIndex--;
			if (finalArrayIndex == finalArray.lenght - 2)
				$('#wmiNextBtn').attr('disabled', 'disabled');
			else if (finalArrayIndex == 0)
				$('#wmiPrevBtn').attr('disabled', '');
			setEmbedVideo();
		},
		'Select previous place',
		{
			id: 'wmiPrevBtn',
			position: 'bottomleft',
		}
	).addTo(mymap);

	var wmiNextBtn = L.easyButton(
		'<strong>NEXT</strong>',
		function() {
			finalArrayIndex++;
			console.log(finalArrayIndex,finalArrayLenght);
			if (finalArrayIndex == finalArray.lenght-1) {
				$('#wmiNextBtn').attr('disabled', '');
				console.log("disabilito next");
			}
			else if (finalArrayIndex == 1)
				$('#wmiPrevBtn').attr('disabled', 'disabled');
			setEmbedVideo();
		},
		'Select next place',
		{
			id: 'wmiNextBtn',
			position: 'bottomleft',
		}
	).addTo(mymap);

	var wmiBtn = L.easyButton(
		'<strong>WHERE M I</strong>',
		function() {
			$("#wmiNextBtn").attr('disabled','');
			$("#wmiMoreBtn").attr('disabled','');
			$("#wmiStopBtn").attr('disabled','');
			setEmbedVideo();
		},
		'WHERE M I',
		{
			id: 'wmiBtn',
			position: 'bottomleft',
		}
	).addTo(mymap);



	var wmiContinueBtn = L.easyButton(
		'<strong>CONTINUE</strong>',
		function() {
			$("#wmiContinueBtn").attr('disabled','disabled');
			$("#wmiStopBtn").attr('disabled','');
			$('#myEmbedded').startVideo();
		},
		'Continue reproduction of clip',
		{
			id: 'wmiContinueBtn',
			position: 'bottomright',
		}
	).addTo(mymap);

	var wmiMoreBtn = L.easyButton(
		'<strong>MORE</strong>',
		function() {
			videoIndexArr = (videoIndexArr + 1) % finalArray[finalArrayIndex][1].lenght;
			setEmbedVideo();
		},
		'Start next clip for this location',
		{
			id: 'wmiMoreBtn',
			position: 'bottomright',
		}
	).addTo(mymap);

	var wmiStopBtn = L.easyButton(
		'<strong>STOP</strong>',
		function() {
			$("#wmiContinueBtn").attr('disabled','');
			$("#wmiStopBtn").attr('disabled','disabled');
			$('#myEmbedded').stopVideo();
		},
		'Stop reproduction of clip',
		{
			id: 'wmiStopBtn',
			position: 'bottomright',
		}
	).addTo(mymap);

	$("#wmiBtn").attr('disabled','disabled');
	$("#wmiNextBtn").attr('disabled','disabled');
	$("#wmiPrevBtn").attr('disabled','disabled');
	$("#wmiContinueBtn").attr('disabled','disabled');
	$("#wmiMoreBtn").attr('disabled','disabled');
	$("#wmiStopBtn").attr('disabled','disabled');

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
	if (Cookies.get("email") != "false")
		customPopup2 = '<div data-role="popup" id="popupMenu" data-theme="b"><ul data-role="listview" data-inset="true" style="min-width:210px;"><li><a href="#">Raggiungi riferimento più vicino</a></li><li><input input type="file" id="file" class="button" accept="video"><button id="button">Upload</button></li></ul></div>';
	else
		customPopup2 = '<div data-role="popup" id="popupMenu" data-theme="b"><ul data-role="listview" data-inset="true" style="min-width:210px;"><li><a href="#">Raggiungi riferimento più vicino</a></li></ul></div>';
}
