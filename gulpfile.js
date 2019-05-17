/**
 * Created by Oshevchuk on 12.02.2018.
 */
'use strict';
var gulp = require('gulp');
var watch = require('gulp-watch');
var preFixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var sourceNaps = require('gulp-sourcemaps');
// var rigger = require('gulp-rigger');
// var plumber = require('gulp-plumber');
var fileInclude = require('gulp-file-include');
var cssMin = require('gulp-minify-css');
var browserSync = require('browser-sync');
var rimraf=require('rimraf');
var reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        style: 'src/style/*.scss'
    },
    watch: {
        html: "src/**/*.html",
        js: 'src/js/**/*.js',
        style: 'src/style/*.scss'
    },
    clean: './build'
};

gulp.task("webserver", function () {
    browserSync({
        server: {
            baseDir: "./build"
        },
        host: "localhost",
        port: 3000,
        tunnel: true
    });
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        // .pipe(plumber())
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:build', function () {
    gulp.src(path.src.js)
        // .pipe(plumber())
        
        // .pipe(sourceNaps.init())
        .pipe(uglify())
        // .pipe(sourceNaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});

gulp.task('style:build', function () {
    gulp.src(path.src.style)
    // .pipe(sourceNaps.init())
        .pipe(sass())
        .pipe(preFixer())
        .pipe(cssMin())
        // .pipe(sourceNaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});

gulp.task('build', ['html:build', 'js:build', 'style:build']);

gulp.task('watch', function () {
    watch([path.watch.js], function () {
        gulp.start('js:build');
    });
    watch([path.watch.html], function () {
        gulp.start('html:build');
    });
    watch([path.watch.style], function () {
        gulp.start('style:build');
    });
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('default', ['build', 'webserver', 'watch']);