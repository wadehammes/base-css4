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
panini      = require('panini'),
browserSync = require('browser-sync').create();

/*==================================
=            Base Paths            =
==================================*/
var themeBase = './src/assets';
var themePages = './src/pages/**/*.html';
var themeDest = './dist';

// Style Path
var stylePathSrc     = themeBase + '/css/base.css';
var stylePathWatch   = themeBase + '/css/**/*.css';
var stylePathDest    = themeDest + '/css/';

// Script Path
var scriptsPathSrc   = [themeBase + '/js/_lib/**/*.js', themeBase + '/js/_src/**/*.js', themeBase + '/js/application-new.js'];
var scriptsPathWatch = themeBase + '/js/**/*.js';
var scriptsPathDest  = themeDest + '/js/';

// Sprites Path
var svgPathWatch     = themeBase + '/svg/*.svg';
var svgDest          = themeDest + '/svg';

// Image Path
var imgPathWatch     = themeBase + '/img/*';
var imgDest          = themeDest + '/img';

// PHP Paths
var htmlPath          = themeDest + '/**/*.html';

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
    require("cssnano")({
      discardComments: {
        removeAll: true
      },
      filterPlugins: false,
      discardEmpty: false,
      autoprefixer: false
    }),
    require("postcss-reporter")()
  ];
  return gulp.src(stylePathSrc)
    .pipe(plumber())
    .pipe( sourcemaps.init() )
    .pipe(postcss(processors))
    .pipe( sourcemaps.write('.') )
    .pipe(gulp.dest(stylePathDest))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Stylesheets task completed' }));
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
  .pipe(notify({ message: 'Scripts task completed' }));
});

// Build html files
gulp.task('html', function() {
  gulp.src(themePages)
    .pipe(panini({
      root: './src/pages/',
      layouts: './src/layouts/',
      partials: './src/partials/',
      helpers: './src/helpers/',
      data: './src/data/'
    }))
    .pipe(gulp.dest(themeDest))
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'HTML task completed' }));
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
gulp.task('serve', ['stylesheets', 'scripts', 'html'], function() {
    browserSync.init({
      server: themeDest
    });

    gulp.watch(stylePathWatch, ['stylesheets']);
    gulp.watch(scriptsPathWatch, ['scripts']);
    gulp.watch(['./src/{layouts,partials,helpers,data,pages}/**/*'], ['html']);
    gulp.watch(htmlPath).on('change', browserSync.reload);
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
gulp.task('default', ['stylesheets', 'scripts', 'html', 'watch-images', 'serve']);
gulp.task('build', ['stylesheets', 'scripts', 'html']);
gulp.task('images', ['img-opt']);
gulp.task('svg', ['svg-opt']);
