<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="initial-scale=1.0, user-scalable=no">
	<meta charset="UTF-8">
	<title>Travel guide</title>

	<link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css" />
	<link rel="stylesheet" href="css/style.css" />

	<script src="http://code.jquery.com/jquery-1.11.1.min.js"></script>
	<script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script>

	<style type="text/css">
		h1.heading{padding:0px;margin: 0px 0px 10px 0px;text-align:center;font: 18px Georgia, "Times New Roman", Times, serif;}

		/* width and height of google map */
		#google_map {position:absolute; width: 100%; height: 100%;margin-top:0px;margin-left:auto;margin-right:auto;}

		/* Marker Edit form */
		.marker-edit label{display:block;margin-bottom: 5px;}
		.marker-edit label span {width: 100px;float: left;}
		.marker-edit label input, .marker-edit label select{height: 24px;}
		.marker-edit label textarea{height: 60px;}
		.marker-edit label input, .marker-edit label select, .marker-edit label textarea {width: 60%;margin:0px;padding-left: 5px;border: 1px solid #DDD;border-radius: 3px;}

		/* Marker Info Window */
		h1.marker-heading{color: #585858;margin: 0px;padding: 0px;font: 18px "Trebuchet MS", Arial;border-bottom: 1px dotted #D8D8D8;}
		div.marker-info-win {max-width: 300px;/*margin-right: -20px;*/}
		div.marker-info-win p{padding: 0px;margin: 10px 0px 10px 0;}
		div.marker-inner-win{padding: 5px;}
		button.save-marker, button.remove-marker{border: none;background: rgba(0, 0, 0, 0);color: #00F;padding: 0px;text-decoration: underline;margin-right: 10px;cursor: pointer;
		}
	</style>
	
</head>
<body>
	<div data-role="panel" id="menu" data-display="push" data-theme="b">
		<ul data-role="listview">
			<li><a href="#home">Home</a></li>
			<li><a href="#explore">Explore</a></li>
			<li><a href="#">My Locations</a></li>
			<li><a href="#">Gallery</a></li>
			<li><a href="#">Videos</a></li>
			<li><a href="#">Contact</a></li>
		</ul>
	</div>

	<div data-role="page" id="home">	
		<div data-role="header">
			<a href="#menu" data-icon="bars" data-iconpos="notext">Menu</a>
			<h1>Travel guide</h1>
		</div>
		<div data-role="main" class="ui-content">
			<p>Pocetna strana</p>
			<p>Trenutna lokacija: </p>
			<div id="my-map-canvas"></div>
		</div>
	</div><!-- Home page -->
	<div data-role="page" id="explore">
		<div data-role="header">
			<a href="#menu" data-icon="bars" data-iconpos="notext">Menu</a>
			<a href="#" data-rel="back" data-icon="back" data-iconpos="notext">Back</a>
			<h1>Add/Remove markers</h1>
		</div>
		<div data-role="main" class="ui-content map-container">
			<div id="google_map"></div>
		</div>
	</div>
	<script type="text/javascript" src="http://maps.google.com/maps/api/js?sensor=false"></script>
	<script src="js/script.js"></script>
	<script src="js/mylocation.js"></script>
	<script src="js/explore.js"></script>
	<script src="js/addremovemarkers.js"></script>
</body>
</html>