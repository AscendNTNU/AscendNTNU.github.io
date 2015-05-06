var gulp        = require('gulp'),
	browserSync = require('browser-sync').create(),
	cp          = require('child_process'),
	path        = require('path'),
	del 		= require('del'),
	less		= require('gulp-less'),
	sourcemaps	= require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	filter		= require('gulp-filter'),
	uglify		= require('gulp-uglify'),
	rename 		= require('gulp-rename'),
	concat 		= require('gulp-concat'),
	size		= require('gulp-size'),
	minifyCss 	= require('gulp-minify-css'),
	flatten		= require('gulp-flatten'),
	googlecdn = require('gulp-google-cdn');

//@TODO: Check out advantages with incremental builds. 

//@TODO: Replace js with CDN for bootstrap.js, jQuery, same for css font-awesome Note: Bootstrap social is only dependent on bootstrap.
gulp.task('cdn', function () {
    return gulp.src('index.html')
        .pipe(googlecdn(require('./bower.json')))
        .pipe(gulp.dest('public'));
});

//Add external dependencies to params
var params = {
	jsPaths: [ 
		//Note: order matters - the files will be concated in order of appearance
		'./bower_components/jquery/dist/jquery.js',
		'./bower_components/bootstrap/dist/js/bootstrap.js',
		'./bower_components/instantclick/instantclick.js',
		'./js/**/*.js'
	],
	lessPaths: [
	    //Add less folder dependencies here - and use imports in main.less
	    //The main less folder (./less) is included by default
		'./bower_components/bootstrap/less/',
        './bower_components/font-awesome/less/',
        './node_modules/colors.css/less/'
    ],
    fonts: [
		//Add font dependencies here
		'./bower_components/bootstrap/fonts/*',
		'./bower_components/font-awesome/fonts/*'
	]
};

/*
	Compile js and less
*/

gulp.task('js',['clean-js'],function() {
	return gulp.src(params.jsPaths,{base:'./'})
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write())
	    .pipe(gulp.dest('./public/js'))
	    .pipe(gulp.dest('./_site/public/js'))
	    .pipe(browserSync.reload({stream:true}));
});

//@TODO: Add header after minification
gulp.task('js-production',['clean-js'],function() {
	return gulp.src(params.jsPaths,{base:'./'})
		.pipe(concat('bundle.js'))
		.pipe(size({title:'js-size before minification'}))
		.pipe(uglify())
		.pipe(size({title:'js-size after minification'})) 
	   	.pipe(gulp.dest('./public/js'));
});

gulp.task('fonts',['clean-fonts'],function () {
	return gulp.src(params.fonts,{base:'./'})
		.pipe(flatten())
		.pipe(gulp.dest('./public/fonts'));
});

//@TODO: browserSync.notify when error occurs
gulp.task('less',['clean-css','fonts'],function() {
    return gulp.src('./less/main.less')
        .pipe(sourcemaps.init())
        .pipe(less({paths:params.lessPaths}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_site/public/css'))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.reload({stream:true}));
});

//@TODO: Reduce code duplication using lazypipe
//@TODO: Add header after minification
gulp.task('less-production',['clean-css'],function() {
    return gulp.src('./less/main.less')
        .pipe(less({paths:params.lessPaths}))
        .pipe(autoprefixer())
        .pipe(size({title:'css-size before minification'}))
        .pipe(minifyCss())
        .pipe(size({title:'css-size before minification'}))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('clean-js',function (cb) {
	del(['./public/js/*'],cb);//Use callback, cb,  to ensure its finished
});

gulp.task('clean-fonts',function (cb) {
	del(['./public/fonts/*'],cb);//Use callback, cb,  to ensure its finished
});

gulp.task('clean-css',function (cb) {
	del(['./public/css/*'],cb);//Use callback, cb,  to ensure its finished
});

/*
	Jekyll build tasks
	@TODO: Remove duplicate code, eg. using lazypipe
*/

gulp.task('jekyll-build-production',['js-production','less-production','fonts'], function (done) {
    browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');
    return cp.spawn('bundle',['exec','jekyll','build'], {stdio: 'inherit'})
        .on('close', done);
});

//This task is needed to avoid race condition
gulp.task('jekyll-initial-build',['js','less','fonts'], function (done) {
    browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');
    return cp.spawn('bundle',['exec','jekyll','build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-build', function (done) {
    browserSync.notify('<span style="color: grey">Running:</span> $ jekyll build');
    return cp.spawn('bundle',['exec','jekyll','build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/*
	Start dev server with Browser sync and watch
*/

//Wait for initial jekyll-build, then launch the Server
gulp.task('browser-sync', ['jekyll-initial-build'], function() {
    browserSync.init({server: {baseDir: '_site'}});
});

gulp.task('browser-sync-production', ['jekyll-build-production'], function() {
    browserSync.init({server: {baseDir: '_site'}});
});

//Watch and sync with browser
gulp.task('watch', function () {
    gulp.watch('./less/*.less', ['less']);
    gulp.watch('./js/*.js', ['js']);
    gulp.watch(['index.html','_includes/*.html' ,'_layouts/*.html', '_posts/*','*.md'], ['jekyll-rebuild']);
});

/*
	Main gulp entry points
*/

//Launch browser sync with minified assets - no watching
gulp.task('production-test',['browser-sync-production']);

//Compile minified assets - @TODO: Check out git hook using this
gulp.task('publish',['js-production','less-production','fonts']);

//Launch browsersync and watch
gulp.task('default', ['browser-sync', 'watch']);