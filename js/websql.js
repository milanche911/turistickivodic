$(document).ready(function() {

var tvodic = {};
tvodic.webdb = {};

tvodic.webdb.db = null;

tvodic.webdb.open = function() {
	var dbSize = 5*1024*1024;
	tvodic.webdb.db = openDatabase('turistickivodic', '1.0', 'mosis', dbSize);
}

tvodic.webdb.createTable = function() {
	var db = tvodic.webdb.db;

	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS markers (id integer primary key asc, name varchar NOT NULL, address varchar NOT NULL, lat float NOT NULL,lng float NOT NULL,  type varchar NOT NULL)');
	});
}


tvodic.webdb.open();
tvodic.webdb.createTable();


var map;

map_initialize(); // initialize google map

//############### Google Map Initialize ##############
function map_initialize()
{
	var mapCenter;

	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
	       mapCenter = new google.maps.LatLng(position.coords.latitude,
	                                       position.coords.longitude);

			var googleMapOptions = 
			{ 
				center: mapCenter, // map center
				zoom: 10, //zoom level, 0 = earth view to higher value
				maxZoom: 18,
				minZoom: 16,
				zoomControlOptions: {
				style: google.maps.ZoomControlStyle.SMALL //zoom control size
			},
				scaleControl: true, // enable scale control
				mapTypeId: google.maps.MapTypeId.ROADMAP // google map type
			};
		
		   	map = new google.maps.Map(document.getElementById("my-locations-map"), googleMapOptions);	

		   	var infowindow = new google.maps.InfoWindow({
		        map: map,
		        position: mapCenter,
		        content: 'My location'
		      });		
			
			//Load Markers from WebSQL DB
			var db = tvodic.webdb.db;

			db.transaction(function (tx) {
				tx.executeSql("SELECT * FROM markers", [], function(tx, results){
					var len = results.rows.length;
					for (i = 0; i < len; i++) {
						var obj = results.rows.item(i);
						var point = new google.maps.LatLng(obj.lat, obj.lng);
						create_marker(point, obj.name, obj.address, false, false, false, "http://localhost/turistickivodic/icons/pin_blue.png");
					}
				});
			});

			
			
			//Double Click to Drop a New Marker
			google.maps.event.addListener(map, 'rightclick', function(event) {
				//Edit form to be displayed with new marker
				var EditForm = '<p><div class="marker-edit">'+
				'<form action="ajax-save.php" method="POST" name="SaveMarker" id="SaveMarker">'+
				'<label for="pName"><span>Place Name :</span><input type="text" name="pName" class="save-name" placeholder="Enter Title" maxlength="40" /></label>'+
				'<label for="pDesc"><span>Description :</span><textarea name="pDesc" class="save-desc" placeholder="Enter Address" maxlength="150"></textarea></label>'+
				'<label for="pType"><span>Type :</span> <select name="pType" class="save-type"><option value="restaurant">Rastaurant</option><option value="bar">Bar</option>'+
				'<option value="house">House</option></select></label>'+
				'</form>'+
				'</div></p><button name="save-marker" class="save-marker">Save Marker Details</button>';

				//Drop a new Marker with our Edit Form
				create_marker(event.latLng, 'New Marker', EditForm, true, true, true, "http://localhost/turistickivodic/icons/pin_green.png");
			});

		  }, function(){
		  	alert("ERROR at geolocation!");
		  });
	} else {
		alert("Browser doesn't support geolocation!");
	}
									
}

//############### Create Marker Function ##############
function create_marker(MapPos, MapTitle, MapDesc,  InfoOpenDefault, DragAble, Removable, iconPath)
{	  	  		  
	
	//new marker
	var marker = new google.maps.Marker({
		position: MapPos,
		map: map,
		draggable:DragAble,
		animation: google.maps.Animation.DROP,
		title:"Hello World!",
		icon: iconPath
	});
	
	//Content structure of info Window for the Markers
	var contentString = $('<div class="marker-info-win">'+
	'<div class="marker-inner-win"><span class="info-content">'+
	'<h1 class="marker-heading">'+MapTitle+'</h1><p>'+
	MapDesc+ 
	'</p></span><button name="remove-marker" class="remove-marker" title="Remove Marker">Remove Marker</button>'+
	'</div></div>');	

	
	//Create an infoWindow
	var infowindow = new google.maps.InfoWindow();
	//set the content of infoWindow
	infowindow.setContent(contentString[0]);

	//Find remove button in infoWindow
	var removeBtn 	= contentString.find('button.remove-marker')[0];
	var saveBtn 	= contentString.find('button.save-marker')[0];

	//add click listner to remove marker button
	google.maps.event.addDomListener(removeBtn, "click", function(event) {
		remove_marker(marker);
	});
	
	if(typeof saveBtn !== 'undefined') //continue only when save button is present
	{
		//add click listner to save marker button
		google.maps.event.addDomListener(saveBtn, "click", function(event) {
			var mReplace = contentString.find('span.info-content'); //html to be replaced after success
			var mName = contentString.find('input.save-name')[0].value; //name input field value
			var mDesc  = contentString.find('textarea.save-desc')[0].value; //description input field value
			var mType = contentString.find('select.save-type')[0].value; //type of marker
			
			if(mName =='' || mDesc =='')
			{
				alert("Please enter Name and Description!");
			}else{
				save_marker(marker, mName, mDesc, mType, mReplace); //call save marker function
			}
		});
	}
	
	//add click listner to save marker button		 
	google.maps.event.addListener(marker, 'click', function() {
			infowindow.open(map,marker); // click on marker opens info window 
    });
	  
	if(InfoOpenDefault) //whether info window should be open by default
	{
	  infowindow.open(map,marker);
	}
}

//############### Remove Marker Function ##############
function remove_marker(Marker)
{
	var db = tvodic.webdb.db;
	/* determine whether marker is draggable 
	new markers are draggable and saved markers are fixed */
	if(Marker.getDraggable()) 
	{
		Marker.setMap(null); //just remove new marker
	}
	else
	{
		//Remove saved marker from WebSQL DB and map 
		var mLatLang = Marker.getPosition().toUrlValue(); //get marker position
		var latLng = mLatLang.split(",");

		db.transaction(function(tx) {
			tx.executeSql("DELETE FROM markers WHERE lat=? AND lng=?",[latLng[0], latLng[1]]);
		});

		Marker.setMap(null);
	}

}

//############### Save Marker to webSQL Function ##############
function save_marker(Marker, mName, mAddress, mType, replaceWin)
{
	var db = tvodic.webdb.db;
	
	var mLatLang = Marker.getPosition().toUrlValue();
	var latLng = mLatLang.split(",");
	
	replaceWin.html('<h1 class="marker-heading">' + mName + '</h1><p>' + mAddress + '</p>');
	Marker.setDraggable(false);
	Marker.setIcon('http://localhost/turistickivodic/icons/pin_blue.png');

	 db.transaction(function (tx) {
	 	tx.executeSql("INSERT INTO markers(name, address, lat, lng, type) VALUES (?,?,?,?,?)", [mName, mAddress, latLng[0], latLng[1], mType]);
	 }); 
}


});