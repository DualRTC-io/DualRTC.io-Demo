'use strict';

var gulp = require('gulp')
    , uglify = require('gulp-uglify')
    , gutil = require('gulp-util')
    , rev = require('gulp-rev')
    , revReplace = require('gulp-rev-replace')
    , browserify = require('browserify')
    , source = require('vinyl-source-stream')
    , buffer = require('vinyl-buffer')
    , jade = require('jade')
    , gulpJade = require('gulp-jade')
    , katex = require('katex')
    , nodemon = require('gulp-nodemon');

jade.filters.katex = katex.renderToString;
jade.filters.shoutFilter = function (str) {
    return str + '!!!!';
}

gulp.task('javascript', function () {
    // set up the browserify instance on a task basis
    var b = browserify('main.js', {
        basedir: './public/system',
        paths: ['../vendor'],
        debug: true
    });

    return b.bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .on('error', gutil.log)
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./public/'))
        .pipe(rev.manifest('manifest.json'))
        .pipe(gulp.dest('./'));
});

gulp.task('index', function() {
    var manifest = gulp.src('./manifest.json');

    return gulp.src('./views/index.jade')
        .pipe(revReplace({
            manifest: manifest,
            replaceInExtensions: ['.jade']
        }))
        .pipe(gulp.dest('./views/'));
});

// jade
gulp.task('jade', function () {
    return gulp.src('views/**/*.jade')
        .pipe(gulpJade({
            jade: jade,
            pretty: true
        }))
        .pipe(gulp.dest('views/'))
})

gulp.task('nodemon', ['jade', 'index', 'javascript'], function (cb) {

    var started = false;

    return nodemon({
        script: 'server.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('watch', function () {
    gulp.watch('views/index.jade', ['index']);
    gulp.watch('views/**/*.jade', ['jade']);
});

gulp.task('default', ['nodemon', 'watch']);