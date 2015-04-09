var fs = require('fs');

module.exports = function (grunt) {
	grunt.registerTask('build-manifest', function () {

		function replaceAll(string, find, replace) {
			return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
		}

		var files = fs.readdirSync("wwwroot/audio");
		var manifest = [];

		for (var i = 0; i < files.length; i++)
		{
			var file = files[i];
			var path = "audio/" + file;
			var id = file.toLowerCase().replace(/ /g, '_').replace(".mp3", "_sound");
			manifest.push({
				src: path,
				id: id,
				data: 99
			});
		}

		var s = JSON.stringify(manifest, null, 4);

		fs.writeFileSync("wwwroot/data/audio manifest.json", s);

		//console.log("building manifestt..", manifest);
	});
};