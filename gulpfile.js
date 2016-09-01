/*=====================================
=            Gulp Packages            =
=====================================*/
require('es6-promise').polyfill();

var gulp    = require('gulp'),
fs          = require('fs'),
concat      = require('gulp-concat'),
uglify      = require('gulp-uglify'),
svgmin      = require('gulp-svgmin'),
imagemin    = require('gulp-imagemin'),
notify      = require("gulp-notify"),
utility     = require('gulp-util'),
watch       = require('gulp-watch'),
streamqueue = require('streamqueue'),
plumber     = require('gulp-plumber'),
shell       = require('gulp-shell'),
sourcemaps  = require('gulp-sourcemaps'),
postcss     = require('gulp-postcss'),
browserSync = require('browser-sync').create();

// Read our Settings Configuration
var settings = JSON.parse(fs.readFileSync('./settings.json'));

/*==================================
=            Base Paths            =
==================================*/
var themeBase        = './www';

// Style Path
var stylePathSrc     = themeBase + 'css/base.css';
var stylePathWatch   = themeBase + 'css/**/*.css';
var stylePathDest    = themeBase + '/css/';

// Script Path
var scriptsPathSrc   = [themeBase + 'js/_lib/**/*.js', themeBase + 'js/_src/**/*.js', themeBase + 'js/application-new.js'];
var scriptsPathWatch = themeBase + 'js/**/*.js';
var scriptsPathDest  = themeBase + '/js/';

// Sprites Path
var svgPathWatch     = themeBase + 'svg/*.svg';
var svgDest          = themeBase + '/svg';

// Image Path
var imgPathWatch     = themeBase + 'img/*';
var imgDest          = themeBase + '/img';

// PHP Paths
var phpPath          = themeBase + '/**/*.php';

/*=============================
=            Tasks            =
=============================*/
// Copy bower files into our assets
gulp.task('copy', function() {
  gulp.src([
    /* add bower src files here if you include a bower.json */
  ])
  .pipe(gulp.dest(devBase + '/js/_lib/'));
});

// Compile, prefix, minify and move our SCSS files
gulp.task('stylesheets', function () {
  var processors = [
    require("postcss-import")(),
    require("postcss-url")(),
    require("postcss-cssnext")(),
    require("cssnano")(),
    require("postcss-browser-reporter")(),
    require("postcss-reporter")()
  ];
  return gulp.src(stylePathSrc)
    .pipe(plumber())
    .pipe( sourcemaps.init() )
    .pipe(postcss(processors))
    .pipe( sourcemaps.write('.') )
    .pipe(gulp.dest(stylePathDest))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Styles task complete' }));
});

// Compile (in order), concatenate, minify, rename and move our JS files
gulp.task('scripts', function() {
  return streamqueue({ objectMode: true },
    gulp.src(themeBase + 'js/_lib/**/*.js'),
    gulp.src(themeBase + 'js/_src/**/*.js'),
    gulp.src(themeBase + 'js/app.js')
  )
  .pipe(plumber())
  .pipe(concat('app.js', {newLine: ';'}))
  .pipe(uglify())
  .pipe(gulp.dest(scriptsPathDest))
  .pipe(browserSync.stream())
  .pipe(notify({ message: 'Scripts task complete' }));
});

/*========================================
=            Standalone Tasks            =
========================================*/
// Optimize images
gulp.task('img-opt', function () {
  return gulp.src(imgPathWatch)
  .pipe(imagemin({
    progressive: true
    }))
  .pipe(gulp.dest(imgDest))
  .pipe(notify({ message: 'Images task complete' }));
});

// Optimize our SVGS
gulp.task('svg-opt', function () {
  return gulp.src(svgPathWatch)
  .pipe(svgmin({
    plugins: [
    {removeEmptyAttrs: false},
    {removeEmptyNS: false},
    {cleanupIDs: false},
    {unknownAttrs: false},
    {unknownContent: false},
    {defaultAttrs: false},
    {removeTitle: true},
    {removeDesc: true},
    {removeDoctype: true}
    ],
    }))
  .pipe(gulp.dest(svgDest))
  .pipe(notify({ message: 'SVG task complete' }));
});

// Browser Sync
gulp.task('serve', ['stylesheets', 'scripts'], function() {
    browserSync.init({
      server: themeBase
    });

    gulp.watch(stylePathWatch, ['stylesheets']);
    gulp.watch(scriptsPathWatch, ['scripts']);
    gulp.watch(phpPath).on('change', browserSync.reload);
});

/*===================================
=            Watch Tasks            =
===================================*/
gulp.task('watch-images', function() {
  gulp.watch(svgPathWatch, ['svg-opt']);
  gulp.watch(imgPathWatch, ['img-opt']);
});

/*==========================================
=            Run the Gulp Tasks            =
==========================================*/
gulp.task('default', ['stylesheets', 'scripts', 'watch-images', 'serve']);
gulp.task('build', ['stylesheets', 'scripts']);
gulp.task('images', ['img-opt']);
gulp.task('svg', ['svg-opt']);
