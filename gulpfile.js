'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('sass', function() {
    return gulp.src('./_css/src/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(gulp.dest('./_css/css'));
});

gulp.task('sass:watch', function() {
    gulp.watch('./_css/src/*.scss', ['sass']);
});