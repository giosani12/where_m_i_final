Cookies.set("initialized", "false");
/*
var placesData;
var xmlhttp = new XMLHttpRequest();
var url = "https://site181950.tw.cs.unibo.it/api/places";
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		console.log("places retrived suddenly");
	}
};
xmlhttp.open("GET", url, true);
xmlhttp.onload = function () {
	placesData = JSON.parse(this.responseText);
	printMarkers(placesData);
}
xmlhttp.send();
*/


var mymap = L.map("mapid", {
		attributionControl: false,
		center: [44.49, 11.34],
		zoom: 13
});

L.control.attribution({position: 'topright'}).addTo(mymap);

function videoData(vidId, olc, desc) {
	this.id = vidId;
	this.olc = olc;
	this.desc = desc;
}

var marks = []; //lista marker

var triples = []; //per ogni video tripla {id, olc, descrizione}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(mymap);

var boundsGlobal = [[54.559322, -5.767822], [56.1210604, -3.021240]];
var markerClick = L.marker();
var markerStat = L.marker();
var rectangleStat = L.rectangle(boundsGlobal);
var circleStat = L.circle();
var popup = L.popup();
/*
var signInOutBtn = L.easyButton({
	id: 'sign-in-or-out-button'}).addTo(mymap);
var revokeAccessBtn = L.easyButton({
	id: 'revoke-access-button'}).addTo(mymap);
*/
var recordVideoBtn;


var wmiPrevBtn = L.easyButton(
	'<strong>PREV</strong>',
	function() {
		alert('you just clicked the html entity;');
	},
	'PREV',
	{
		id: 'wmiPrevBtn',
		position: 'bottomleft',
	}
).addTo(mymap);

var wmiNextBtn = L.easyButton(
	'<strong>NEXT</strong>',
	function() {
		alert('you just clicked the html entity;');
	},
	'NEXT',
	{
		id: 'wmiNextBtn',
		position: 'bottomleft',
	}
).addTo(mymap);

var wmiBtn = L.easyButton(
	'<strong>WHERE M I</strong>',
	function() {
		alert('you just clicked the html entity;');
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
		alert('you just clicked the html entity;');
	},
	'CONTINUE',
	{
		id: 'wmiContinueBtn',
		position: 'bottomright',
	}
).addTo(mymap);

var wmiMoreBtn = L.easyButton(
	'<strong>MORE</strong>',
	function() {
		alert('you just clicked the html entity;');
	},
	'MORE',
	{
		id: 'wmiMoreBtn',
		position: 'bottomright',
	}
).addTo(mymap);

var wmiStopBtn = L.easyButton(
	'<strong>STOP</strong>',
	function() {
		alert('you just clicked the html entity;');
	},
	'STOP',
	{
		id: 'wmiStopBtn',
		position: 'bottomright',
	}
).addTo(mymap);




function onMapClick(e) {
	var coords = parseLatLng(e.latlng.toString());
	var olc4 = OpenLocationCode.encode(coords[0], coords[1], 4);
	var olc6 = OpenLocationCode.encode(coords[0], coords[1], 6);
	var olc11 = OpenLocationCode.encode(coords[0], coords[1], 11);
	var olc = olc4 + ':' + olc6 + ':' + olc11;
	var customPopup;
	console.log("olc4", olc4.slice(0, -1));
	//retrieveVideos(olc4.slice(0, -1));
	if (Cookies.get("email") != "false")
		customPopup = 'Posizione:' + coords[0] + ', ' + coords[1] + ' olc: ' + olc + '<button onclick="openNav(2)">Aggiungi un video relativo a questa posizione</button>';
	else
		customPopup = 'Posizione:' + coords[0] + ', ' + coords[1] + ' olc: ' + olc;
	var area = OpenLocationCode.decode(olc11);
	var bounds = [[area.latitudeLo, area.longitudeLo], [area.latitudeHi, area.longitudeHi]];
	markerClick
		.setLatLng(e.latlng)
		.bindPopup(customPopup)
		.addTo(mymap);
	rectangleStat
		.setBounds(bounds)
		.addTo(mymap);
	Cookies.set("olc", olc);
	Cookies.set("olcPrecise", olc11);
	if (Cookies.get("initialized") == "false") {
		//makeRequest1(initWMI,coords);
		retrieveVideos(initWMI, coords,olc4.slice(0, -1));
		Cookies.set("initialized", "true");
		mymap.setView(coords);
	}
}

mymap.on('click', onMapClick);


if (navigator.geolocation) {
    mymap.locate({setView: false, watch:true, enableHighAccuracy: true, maximumAge:20000, maxZoom: 16});
}




function onLocationFound(e) {
	var coords = parseLatLng(e.latlng.toString());
	var olc4 = OpenLocationCode.encode(coords[0], coords[1], 4);
        var olc6 = OpenLocationCode.encode(coords[0], coords[1], 6);
        var olc11 = OpenLocationCode.encode(coords[0], coords[1], 11);
	var olc = olc4 + ':' + olc10 + ':' + olc11;

	if (Cookies.get("email") != "false")
		var customPopup = 'Posizione:' + coords[0] + ', ' + coords[1] + ' olc: ' + olc + '<button onclick="openNav(2)">Aggiungi un Video relativo a questo luogo</button>';
	else
		var customPopup = 'Posizione:' + coords[0] + ', ' + coords[1] + ' olc: ' + olc;

	Cookies.set("location", e.latlng);
	var radius = e.accuracy;

	markerStat
			.setLatLng(e.latlng)
			.addTo(mymap)
			.bindPopup("You are within " + radius + " meters from this point. "+ customPopup, {autoPan : false}).openPopup();
	circleStat
			.setLatLng(e.latlng)
			.setRadius(radius)
			.addTo(mymap);
	if (Cookies.get("initialized") == "false") {
		makeRequest1(initWMI,coords);
		Cookies.set("initialized", "true");
		mymap.setView(coords);
	}
}

mymap.on('locationfound', onLocationFound);
/*
function onLocationError(e) {
	alert(e.message);
}

mymap.on('locationerror', onLocationError);
*/
var markersLayer = new L.LayerGroup();	//layer contain searched elements

mymap.addLayer(markersLayer);

var controlSearch = new L.Control.Search({
	position:'topright',
	layer: markersLayer,
	initial: false,
	zoom: 12,
	marker: false
});

mymap.addControl( controlSearch );
var customPopup2;
if (Cookies.get("email") != "false")
	customPopup2 = '<div data-role="popup" id="popupMenu" data-theme="b"><ul data-role="listview" data-inset="true" style="min-width:210px;"><li><a href="#">Raggiungi riferimento più vicino</a></li><li><input input type="file" id="file" class="button" accept="video"><button id="button">Upload</button></li></ul></div>';
else
	customPopup2 = '<div data-role="popup" id="popupMenu" data-theme="b"><ul data-role="listview" data-inset="true" style="min-width:210px;"><li><a href="#">Raggiungi riferimento più vicino</a></li></ul></div>';

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




/*
$('.btns').getContainer().addEventListener('mouseover', function () {
        mymap.dragging.disable();
    });

    // Re-enable dragging when user's cursor leaves the element
    $('.btns').getContainer().addEventListener('mouseout', function () {
        mymap.dragging.enable();
    });
*/

