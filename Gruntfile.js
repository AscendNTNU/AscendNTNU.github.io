
module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-include-source');
	
	grunt.initConfig({
		//Currently dev only - should serve zipped and minified
		copy:{
			'bootstrap-js':{
				expand:true,
				flatten: true,
				filter:'isFile',
				src:'bower_components/bootstrap/dist/js/bootstrap.js',
				dest:'js/'
			},
			'bootstrap-css':{
				expand:true,
				flatten: true,
				filter:'isFile',
				src:'bower_components/bootstrap/dist/css/bootstrap.css',
				dest:'css/'
			},
			'bootstrap-css-map':{
				expand:true,
				flatten: true,
				filter:'isFile',
				src:'bower_components/bootstrap/dist/css/bootstrap.css.map',
				dest:'css/'
			},			
			'jQuery-js':{
				expand:true,
				flatten: true,
				filter:'isFile',
				src:'bower_components/jquery/dist/jquery.js',
				dest:'js/'
			}
		}
	});
};