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
var browser_sync = require('browser-sync');
var rimraf       = require('rimraf');
var zip          = require('gulp-zip');
var uglify       = require('gulp-uglify');
var rollup       = require('gulp-rollup');
var nodeResolve  = require('rollup-plugin-node-resolve');
var commonjs     = require('rollup-plugin-commonjs');
var babel        = require('rollup-plugin-babel');

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
  gulp.src(dir.src.js + '/**/*.js')
    .pipe(rollup({
      allowRealFiles: true,
      entry: dir.src.js + '/app.js',
      format: 'iife',
      external: ['jquery'],
      globals: {
        jquery: "jQuery"
      },
      plugins: [
        nodeResolve({ jsnext: true }),
        commonjs(),
        babel({
          presets: ['es2015-rollup'],
          babelrc: false
        })
      ]
    }))
    .pipe(gulp.dest(dir.dist.js))
    .on('end', function() {
      gulp.src([dir.dist.js + '/app.js'])
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(dir.dist.js));
    });
});

/**
 * Build CSS
 */
gulp.task('css', function() {
  return gulp.src(
      [
        dir.src.css + '/basis.styl',
        dir.src.css + '/plugin/basis-ie9/basis-ie9.styl'
      ],
      {base: dir.src.css}
    )
    .pipe(stylus({
      'resolve url nocheck': true
    }))
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      })
    ]))
    .pipe(gulp.dest(dir.dist.css))
    .pipe(postcss([cssnano()]))
    .pipe(rename({ suffix: '.min' }))
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
 * Creates the zip file
 */
gulp.task('zip', ['build'], function(){
  return gulp.src(
      [
        '**',
        '.gitignore',
        '.editorconfig',
        '!./.travis.yml',
        '!./node_modules',
        '!./node_modules/**',
        '!./bin',
        '!./bin/**',
        '!integrity.zip'
      ]
      , {base: '.'}
    )
    .pipe(zip('integrity.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task('build', ['css', 'js', 'copy-images']);

gulp.task('default', ['build', 'browsersync', 'watch']);
