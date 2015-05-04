var gulp        = require('gulp'),
	cp          = require('child_process'),
	path        = require('path'),
	browserSync = require('browser-sync'),
	less		= require('gulp-less'),
	sourcemaps	= require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	filter		= require('gulp-filter'),
	uglify		= require('gulp-uglify'),
	rename 		= require('gulp-rename'),
	concat 		= require('gulp-concat'),
	del 		= require('del'),
	flatten		= require('gulp-flatten');

//Add external dependencies to params
var params = {
	bootstrapLessPath: './bower_components/bootstrap/less/',
	jsPaths: [ //Note: order matters - the files will be concated in order of appearance
		'./bower_components/jquery/dist/jquery.js',
		'./bower_components/bootstrap/dist/js/bootstrap.js',
		'./bower_components/instantclick/instantclick.js',
		'./js/**/*.js'
	]
};

//@TODO: Fix sourcemaps. Fails for some reason
//@TODO: Compile only changed files
//@TODO: Minify when production - turned off in general due to long run time
gulp.task('js',['clean-js'],function() {
	return gulp.src(params.jsPaths,{base:'.'})
		//.pipe(flatten())
		//.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		//.pipe(sourcemaps.write('./'))
	    .pipe(gulp.dest('./public/js'));
	    //.pipe(rename({suffix: '.min'}))
	    //.pipe(uglify())
	    //.pipe(gulp.dest('./public/js'));
});

//@TODO: Copy bootstrap glyphs
//@TODO: Minify when production
//@TODO: Compile only changed
//@TODO: onError: browserSync.notify
gulp.task('less',['clean-css'],function() {
    return gulp.src('./less/main.less')
        .pipe(sourcemaps.init())
        .pipe(less({
        	paths:[params.bootstrapLessPath]
        }))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))//Sourcemap in separate file
        .pipe(gulp.dest('./_site/public/css'))
        .pipe(gulp.dest('./public/css'))
        .pipe(filter('**/*.css'))//This prevents browsersync from reloading due to map
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('clean-js',function (cb) {
	del(['./public/js/*'],cb);//Use callback, cb,  to ensure its finished
});

gulp.task('clean-css',function (cb) {
	del(['./public/css/*'],cb);//Use callback, cb,  to ensure its finished
});

//Build jekyll without using bundle @TODO: Change to using bundle
gulp.task('jekyll-build', function (done) {
    browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');
    return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
        .on('close', done);
});

//Rebuild jekyll and reload
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

//Wait for jekyll-build, then launch the Server
gulp.task('browser-sync', ['less','js','jekyll-build'], function() {
    browserSync({server: {baseDir: '_site'}});
});

//Watch and sync with browser
gulp.task('watch', function () {
    gulp.watch('./less/*.less', ['less']);
    gulp.watch('./js/*.js', ['js']);
    gulp.watch(['index.html','_includes/*.html' ,'_layouts/*.html', '_posts/*','*.md'], ['jekyll-rebuild']);
});

//Launch browsersync and watch
gulp.task('default', ['browser-sync', 'watch']);