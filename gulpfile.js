/*=====================================
=            Gulp Packages            =
=====================================*/
require('es6-promise').polyfill();

var gulp    = require('gulp'),
fs          = require('fs'),
babel       = require('gulp-babel'),
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
svgstore    = require('gulp-svgstore'),
browserSync = require('browser-sync').create();

var config = {
  production: !!utility.env.production
}

/*==================================
=            Base Paths            =
==================================*/
var themeBase = './src/assets';
var themePages = './src/pages/**/*.html';
var themeDest = './dist';

// Style Path
var stylePathSrc     = themeBase + '/css/base.css';
var stylePathWatch   = themeBase + '/css/**/*.css';
var stylePathDest    = themeDest + '/css';

// Script Path
var scriptsPathSrc   = [themeBase + '/js/_lib/**/*.js', themeBase + '/js/app.js'];
var scriptsPathWatch = themeBase + '/js/**/*.js';
var scriptsPathDest  = themeDest + '/js';

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
    require('postcss-utilities')(),
    require('postcss-preset-env')(),
    require("css-mqpacker")(),
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
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(stylePathDest))
    .pipe(config.production ? utility.noop() : browserSync.stream({match: '**/*.css'}))
    .pipe(config.production ? utility.noop() : notify({ message: 'Styles task complete' }));
});

// Compile (in order), concatenate, minify, rename and move our JS files
gulp.task('scripts', function() {
  return streamqueue({ objectMode: true },
    gulp.src(themeBase + '/js/_lib/**/*.js'),
    gulp.src(themeBase + '/js/app.js')
  )
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(concat('app.js', {newLine: ';'}))
  .pipe(uglify())
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(scriptsPathDest))
  .pipe(config.production ? utility.noop() : browserSync.stream())
  .pipe(config.production ? utility.noop() : notify({ message: 'Scripts task complete' }));
});

// Build html files
gulp.task('html', ['html-refresh'], function() {
  gulp.src(themePages)
    .pipe(panini({
      root: './src/pages/',
      layouts: './src/layouts/',
      partials: './src/partials/',
      helpers: './src/helpers/',
      data: './src/data/'
    }))
    .pipe(gulp.dest(themeDest))
    .pipe(config.production ? utility.noop() : browserSync.stream())
    .pipe(config.production ? utility.noop() : notify({ message: 'HTML task complete' }));
});

gulp.task('html-refresh', function() {
  panini.refresh()
});

// Create SVG sprite
gulp.task('svgs', function() {
  return gulp.src(svgPathWatch)
    .pipe(plumber())
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
    .pipe(svgstore({inlineSvg: true}))
    .pipe(gulp.dest(themeDest))
    .on('end', function() {
      fs.renameSync(themeDest + '/svg.svg', themeDest + '/sprite.svg')
    })
    .pipe(config.production ? utility.noop() : notify({ message: 'SVG task complete' }));
})

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

// Browser Sync
gulp.task('serve', ['stylesheets', 'scripts', 'html'], function() {
    browserSync.init({
      server: themeDest
    });

    gulp.watch(stylePathWatch, ['stylesheets']);
    gulp.watch(scriptsPathWatch, ['scripts']);
    gulp.watch(['./src/{layouts,partials,helpers,data,pages}/**/*'], ['html-refresh', 'html']);
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
gulp.task('default', ['stylesheets', 'scripts', 'html', 'svgs', 'watch-images', 'serve']);
gulp.task('build', ['stylesheets', 'scripts', 'html']);
gulp.task('images', ['img-opt']);
