chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		//http://ptforum.photoolsweb.com/ubbthreads.php?ubb=download&Number=1024&filename=1024-2006_1011_093752.jpg

		var s = document.createElement('script');

		// TODO: add "script.js" to web_accessible_resources in manifest.json
		s.src = chrome.extension.getURL('src/inject/exif.js');
		s.onload = function() {
			this.parentNode.removeChild(this);
		};
		(document.head||document.documentElement).appendChild(s);


		function dms2dec(d, m, s){
			dec = Math.abs(d) + (m / 60.0) + (s / 3600.0);
			dec = (d > 0) ? dec : (0-d);
			return dec;
		}


		var images = document.getElementsByTagName('img');
		for(var i=0; i < images.length; i++) {
			EXIF.getData(images[i], function() {
				var exifData = EXIF.getAllTags(this);

				if(typeof exifData.GPSLatitude != 'undefined' && typeof exifData.GPSLongitude != 'undefined'){
					lat = dms2dec(exifData.GPSLatitude[0], exifData.GPSLatitude[1], exifData.GPSLatitude[2]);
					lng = dms2dec(exifData.GPSLongitude[0], exifData.GPSLongitude[1], exifData.GPSLongitude[2]);
					if(exifData.GPSLatitudeRef == 'S') lat = 0 - lat;
					if(exifData.GPSLongitudeRef == 'W') lng = 0 - lng;
					console.log(this.src+" "+lat+", "+lng);
					console.log('https://www.google.com/maps/preview/@'+lat+','+lng+',15z');
					this.style.border = "1px solid green";
				}
				else {
					console.log(this.src + ' has no GPS data')
					this.style.border = "1px solid red";


				}



			});
		}





	}
	}, 10);
});
