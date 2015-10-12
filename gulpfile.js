var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var cp          = require('child_process');
var del 		= require('del');
var less		= require('gulp-less');
var sourcemaps	= require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var uglify		= require('gulp-uglify');
var concat 		= require('gulp-concat');
var size		= require('gulp-size');
var minifyCss 	= require('gulp-minify-css');
var flatten		= require('gulp-flatten');
var rev         = require('gulp-rev');
var htmlhint	= require('gulp-htmlhint');
var w3cjs 		= require('gulp-w3cjs');
var jshint 		= require('gulp-jshint');
var bootlint  	= require('gulp-bootlint');
var runSequence = require('run-sequence');
var imagemin 	= require('gulp-imagemin');

//Paths to dependencies
var paths = {
	js: [ 
		//Note: order matters - the files will be concated in order of appearance
		'./bower_components/jquery/dist/jquery.js',
		'./bower_components/bootstrap/dist/js/bootstrap.js',
		'./bower_components/smooth-scroll/dist/js/smooth-scroll.js',
		'./js/**/*.js'
	],
	less: [
	    //The main less folder (./less) is included by default
		'./bower_components/bootstrap/less/',
        './bower_components/fontawesome/less/',
        './node_modules/colors.css/less/'
    ],
    fonts: [
		'./bower_components/bootstrap/fonts/*',
		'./bower_components/fontawesome/fonts/*'
	],
	images: './images/*'
};

/*
	Compress images - TODO: Watch image folder, inject and only compress changed files.
*/
gulp.task('image-min', function () {
    return gulp.src(paths.images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
        }))
        .pipe(gulp.dest('./public/assets'));
});

/*
	Compile js and less
*/

gulp.task('js',['clean-js'],function() {
	return gulp.src(paths.js,{base:'./'})
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write())
	    .pipe(gulp.dest('./public/js'))
	    .pipe(gulp.dest('./_site/public/js'))
	    .pipe(browserSync.reload({stream:true}));
});

gulp.task('js-production',['clean-js'],function() {
	return gulp.src(paths.js,{base:'./'})
		.pipe(concat({path:'bundle.js',cwd:''}))
		.pipe(rev())
		.pipe(size({title:'js-size before minification'}))
		.pipe(uglify())
		.pipe(size({title:'js-size after minification'})) 
	   	.pipe(gulp.dest('./public/js'))
	   	.pipe(rev.manifest('js-manifest.json'))
	   	.pipe(gulp.dest('./_data'));
});

gulp.task('fonts',['clean-fonts'],function () {
	return gulp.src(paths.fonts,{base:'./'})
		.pipe(flatten())
		.pipe(gulp.dest('./public/fonts'));
});

gulp.task('less',['clean-css','fonts'],function() {
    return gulp.src('./less/main.less')
	    .on('error',function(err) {
	    	browserSync.notify('<span style="color: grey">Error:</span> Less compilation failed');
	    	console.log('Less compilation failed:');
	    	console.log(err);
	    })
        .pipe(sourcemaps.init())
        .pipe(less({paths:paths.less}))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./_site/public/css'))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('less-production',['clean-css'],function() {
    return gulp.src('./less/main.less')
        .pipe(less({paths:paths.less}))
        .pipe(autoprefixer())
        .pipe(size({title:'css-size before minification'}))
        .pipe(minifyCss())
        .pipe(size({title:'css-size after minification'}))
        .pipe(rev())
        .pipe(gulp.dest('./public/css'))
        .pipe(rev.manifest('css-manifest.json'))
        .pipe(gulp.dest('./_data'));
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
*/

gulp.task('jekyll-build-production',['js-production','less-production','fonts','image-min'], function (done) {
    return cp.spawn('bundle',['exec','jekyll','build'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-initial-build',['js','less','fonts','image-min'], function (done) {
    return cp.spawn('bundle',['exec','jekyll','build','--config','_config.yml,_config-dev.yml'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-build', function (done) {
    browserSync.notify('<span style="color: grey">Running:</span> jekyll build');
    return cp.spawn('bundle',['exec','jekyll','build','--config','_config.yml,_config-dev.yml'], {stdio: 'inherit'})
        .on('close', done);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

/*
	Linter tasks
*/

gulp.task('lint',['html-lint','html-validate','js-lint','bootlint']);

gulp.task('html-lint',function() {
	return gulp.src('./_site/**/*.html')
    			.pipe(htmlhint())
    			.pipe(htmlhint.reporter());
});
 
gulp.task('html-validate', function () {
	var through2 = require('through2');
    
    return gulp.src('./_site/**/*.html')
        .pipe(w3cjs())
        .pipe(through2.obj(function(file, enc, cb){
            cb(null, file);
            if (!file.w3cjs.success){
                throw new Error('HTML validation error(s) found');
            }
        }));
});

gulp.task('js-lint',function() {
	return gulp.src('./js/**/*.js')
		.pipe(jshint())
	  	.pipe(jshint.reporter('jshint-stylish'))
	  	.pipe(jshint.reporter('fail'));
});

gulp.task('bootlint', function() {
    return gulp.src('./_site/**/*.html')
        .pipe(bootlint());
});

/*
	Start dev server with Browser sync
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
    gulp.watch(['*.html','_includes/*.html' ,'_layouts/*.html', '_posts/*','*.md'], ['jekyll-rebuild']);
});

/*
	Main gulp entry points
*/

//Launch browser sync with minified assets - no watching
gulp.task('production',function(cb) {
	runSequence('browser-sync-production','lint',cb);
});

//Run before pushing repo to gh-pages
gulp.task('publish',function(cb) {
	runSequence('jekyll-build-production','lint',cb);
});

//Launch browsersync and watch
gulp.task('default', function(cb) {
	runSequence(['browser-sync', 'watch'],cb);
});