/*
var data = [
		{"loc":[44.493682,11.343084], "title":"Piazza Maggiore"},
		{"loc":[44.500292,11.34533],  "title":"Piazza Otto Agosto"},
		{"loc":[44.511565,11.347049], "title":"Piazza dell'Unità"},
		{"loc":[44.492395,11.311526], "title":"Piazza della Pace"},
		{"loc":[44.491774,11.345335], "title":"Piazza Minghetti"},
		{"loc":[44.491151,11.34394],  "title":"Piazza Cavour"},
		{"loc":[44.522863,11.341208], "title":"Campo Rom"},	
		{"loc":[44.536086,11.371284], "title":"Carcere Dozza"},
		{"loc":[41.329190,13.192145], "title":"Darkgray"},
		{"loc":[41.379290,13.122545], "title":"dodgerblue"},
		{"loc":[41.409190,13.362145], "title":"gray"},
		{"loc":[41.794008,12.583884], "title":"green"},	
		{"loc":[41.805008,12.982884], "title":"greenyellow"},
		{"loc":[41.536175,13.273590], "title":"red"},
		{"loc":[41.516175,13.373590], "title":"rosybrown"},
		{"loc":[41.506175,13.273590], "title":"royalblue"},
		{"loc":[41.836175,13.673590], "title":"salmon"},
		{"loc":[41.796175,13.570590], "title":"seagreen"},
		{"loc":[41.436175,13.573590], "title":"seashell"},
		{"loc":[41.336175,13.973590], "title":"silver"},
		{"loc":[41.236175,13.273590], "title":"skyblue"},
		{"loc":[41.546175,13.473590], "title":"yellow"},
		{"loc":[41.239190,13.032145], "title":"white"}
	];
*/

var xmlhttp = new XMLHttpRequest();
var url = "http://localhost:8000/api/places";
xmlhttp.onreadystatechange = async function() {
    if (this.readyState == 4 && this.status == 200) {
        var data = JSON.parse(this.responseText);
	await printMarkers(data);
    }
};
xmlhttp.open("GET", url, true);
xmlhttp.send();

	

var mymap = L.map("mapid", {
		center: [51.505, -0.09],
		zoom: 13
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'}).addTo(mymap);

var boundsGlobal = [[54.559322, -5.767822], [56.1210604, -3.021240]];
var markerClick = L.marker();
var markerStat = L.marker();
var rectangleStat = L.rectangle(boundsGlobal);
var circleStat = L.circle();
var popup = L.popup();

function onMapClick(e) {
	var coords = parseLatLng(e.latlng.toString());
	var olc8 = OpenLocationCode.encode(coords[0], coords[1], 8);
	var olc10 = OpenLocationCode.encode(coords[0], coords[1], 10);
	var olc11 = OpenLocationCode.encode(coords[0], coords[1], 11);
	var olc = olc8 + '-' + olc10 + '-' + olc11;

	if (Cookies.get("email"))
		var customPopup = 'Posizione:' + coords[0] + ', ' + coords[1] + ' olc: ' + olc + '<button onclick="openNav2(/*coordinate*/)">Crea un Video da qua</button>';
	else
		var customPopup = 'Posizione:' + coords[0] + ', ' + coords[1] + ' olc: ' + olc;
	var area = OpenLocationCode.decode(olc8);
	var bounds = [[area.latitudeLo, area.longitudeLo], [area.latitudeHi, area.longitudeHi]];
	markerClick
		.setLatLng(e.latlng)
		.bindPopup(customPopup)
		.addTo(mymap);
	rectangleStat
		.setBounds(bounds)
		.addTo(mymap);
	Cookies.set("olc", olc);	
}

mymap.on('click', onMapClick);

mymap.locate({setView: true, watch:true, enableHighAccuracy: true, maximumAge:20000, maxZoom: 16});


function onLocationFound(e) {
	if (Cookies.get("email"))
		var customPopup = '<div data-role="popup" id="popupMenu" data-theme="b"><ul data-role="listview" data-inset="true" style="min-width:210px;"><li>Posizione:'  + parseLatLng(e.latlng.toString())[0] +  parseLatLng(e.latlng.toString())[1] +'</li><li><a href="#">Raggiungi riferimento più vicino</a></li><li><input input type="file" id="file" class="button" accept="video/*"><button id="button">Upload</button></li></ul></div>';
	else
		var customPopup = '<div data-role="popup" id="popupMenu" data-theme="b"><ul data-role="listview" data-inset="true" style="min-width:210px;"><li>Posizione:'  + parseLatLng(e.latlng.toString())[0] +  parseLatLng(e.latlng.toString())[1]  +'</li><li><a href="#">Raggiungi riferimento più vicino</a></li></ul></div>';
	Cookies.set("location", e.latlng); 
	var radius = e.accuracy;

	markerStat
			.setLatLng(e.latlng)
			.addTo(mymap)
			.bindPopup("You are within " + radius + " meters from this point. "+ customPopup).openPopup();
	circleStat
			.setLatLang(e.latlng)
			.setRadius(radius)
			.addTo(mymap);
	
}

mymap.on('locationfound', onLocationFound);

function onLocationError(e) {
	alert(e.message);
}

mymap.on('locationerror', onLocationError);

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

if (Cookies.get("email"))
	var customPopup2 = '<div data-role="popup" id="popupMenu" data-theme="b"><ul data-role="listview" data-inset="true" style="min-width:210px;"><li><a href="#">Raggiungi riferimento più vicino</a></li><li><input input type="file" id="file" class="button" accept="video/*"><button id="button">Upload</button></li></ul></div>';
else
		var customPopup2 = '<div data-role="popup" id="popupMenu" data-theme="b"><ul data-role="listview" data-inset="true" style="min-width:210px;"><li><a href="#">Raggiungi riferimento più vicino</a></li></ul></div>';
	
	
//populate map with markers from sample data
async function printMarkers(data) {
	console.log(data);
	for (i in data) {
		var title = data[i]["name"],	//value searched
			loc = data[i]["location"]; //position found
		var codeArea = OpenLocationCode.decode(loc);
		var marker = new L.Marker(new L.latLng([codeArea.latitudeCenter, codeArea.longitudeCenter]), {title: title} );//se property searched
		marker.bindPopup( title + customPopup2);
		markersLayer.addLayer(marker);
	}
}



function parseLatLng(ll){
	var virgola = ll.indexOf(',');
	var chiusa = ll.indexOf(')');
	var latl = ["a", "b"];
	latl[0] = ll.substring(7, virgola);
	latl[1] = ll.substring(virgola+2, chiusa);

	return latl;
}