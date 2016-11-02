'use strict';

/**
 * Import node modules
 */
var gulp         = require('gulp');
var stylus       = require('gulp-stylus');
var rename       = require('gulp-rename');
var postcss      = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano      = require('cssnano');
var browserify   = require('browserify');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var babelify     = require('babelify');
var browser_sync = require('browser-sync');
var rimraf       = require('rimraf');

var dir = {
  src: {
    css   : 'src/stylus',
    js    : 'src/js',
    images: 'src/images'
  },
  dist: {
    css   : 'assets/css',
    js    : 'assets/js',
    images: 'assets/images'
  }
}

/**
 * Build JavaScript
 */
gulp.task('js', function() {
  return browserify({
    entries: dir.src.js + '/app.js'
  })
  .transform('babelify', {presets: ['es2015']})
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(gulp.dest(dir.dist.js));
} );

/**
 * Build CSS
 */
gulp.task('css', function() {
  return gulp.src(dir.src.css + '/*.styl')
    .pipe(stylus({
      'resolve url nocheck': true
    }))
    .pipe(gulp.dest(dir.dist.css))
    .pipe(postcss([autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    })]))
    .pipe(gulp.dest(dir.dist.css))
    .pipe(postcss([cssnano()]))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(dir.dist.css));
});


/**
 * Build images
 */
gulp.task('copy-images',['remove-images'], function() {
  return gulp.src(dir.src.images + '/**/*')
    .pipe(gulp.dest(dir.dist.images));
});

gulp.task('remove-images', function(cb) {
  rimraf(dir.dist.images, cb);
});

/**
 * Auto Build
 */
gulp.task('watch', function() {
  gulp.watch([dir.src.css + '/**/*.styl'], ['css']);
  gulp.watch([dir.src.js + '/**.js'], ['js']);
});

/**
 * Browsersync
 */
gulp.task('browsersync', function() {
  browser_sync.init( {
    server: {
      baseDir: "./"
    },
    files: [
      './**.html',
      './assets/**'
    ]
  });
});

/**
 * Deploy GitHub Pages
 */
gulp.task('deploy', ['build'], function() {
  return gulp.src(
      [
        './assets/**',
        './index.html',
        './*.md'
      ],
      {base: './'}
    )
    .pipe(gulp.dest('gh-pages'));
});

gulp.task('build', ['css', 'js', 'copy-images']);

gulp.task('default', ['build', 'browsersync', 'watch']);
