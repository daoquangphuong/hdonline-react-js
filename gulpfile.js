var gulp = require('gulp');
var del = require('del');
var browserify = require('gulp-browatchify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var uglifycss = require('gulp-uglifycss');
var gulpif = require('gulp-if');
var reactify = require('reactify');

const SOURCE_PATH = './flux';
const DIST_PATH = './extension/data';

const _STEP_0 = 'STEP 0: CLEAN';
const _STEP_1 = 'STEP 1: JS';
const _STEP_2 = 'STEP 2: HTML';
const _STEP_3 = 'STEP 3: CSS';
const _STEP_4 = 'STEP 4: FONTS';
const _STEP_5 = 'STEP 5: IMAGES';

const _IS_DEV = process.argv[process.argv.length - 1] == 'dev';

if (_IS_DEV) {
    console.log('-----THIS IS DEV ENVIRONMENT-----');
}

'use strict';

gulp.task(_STEP_0, function () {
    del.sync([DIST_PATH + '/**/*']);
});

gulp.task(_STEP_1, [], function () {
    var now = new Date();
    gulp.src(SOURCE_PATH + '/js/app.js')
        .pipe(browserify({transforms: [reactify], standalone: ''})
            .on('error', function (err) {
                console.log(err);
            }))
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulpif(!_IS_DEV, uglify()
                .on('error', function (err) {
                    console.log(err);
                })
        ))
        .pipe(gulp.dest(DIST_PATH + '/js'))
        .on('error', function (err) {
            console.log(err);
        })
        .on('end', function () {
            var _now = new Date();
            console.log('>>> JS ok !' + '(' + (_now.getTime() - now.getTime()) + ' ms)');
        });
});

gulp.task(_STEP_2, [], function () {
    var now = new Date();
    gulp.src(SOURCE_PATH + '/*.html')
        .pipe(gulp.dest(DIST_PATH))
        .on('end', function () {
            var _now = new Date();
            console.log('>>> Html ok !' + '(' + (_now.getTime() - now.getTime()) + ' ms)');
        });
});

gulp.task(_STEP_3, [], function () {
    var now = new Date();
    gulp.src(
        [
            SOURCE_PATH + '/css' + '/first.css',
            SOURCE_PATH + '/css' + '/bootstrap.css',
            SOURCE_PATH + '/css' + '/theme.css',
            SOURCE_PATH + '/css' + '/**/*.css',
            SOURCE_PATH + '/css' + '/last.css'
        ])
        .pipe(concat('style.css'))
        .pipe(gulpif(!_IS_DEV, uglifycss()))
        .pipe(gulp.dest(DIST_PATH + '/css'))
        .on('end', function () {
            var _now = new Date();
            console.log('>>> Css ok !' + '(' + (_now.getTime() - now.getTime()) + ' ms)');
        });
});

gulp.task(_STEP_4, [], function () {
    //var now = new Date();
    //gulp.src(SOURCE_PATH + '/fonts' + '/**/*')
    //    .pipe(gulp.dest(DIST_PATH + '/fonts'))
    //    .on('end', function () {
    //        var _now = new Date();
    //        console.log('>>> Fonts ok !' + '(' + (_now.getTime() - now.getTime()) + ' ms)');
    //    });
});

gulp.task(_STEP_5, [], function () {
    //var now = new Date();
    //gulp.src(SOURCE_PATH + '/images' + '/**/*')
    //    .pipe(gulp.dest(DIST_PATH + '/images'))
    //    .on('end', function () {
    //        var _now = new Date();
    //        console.log('>>> Image ok !' + '(' + (_now.getTime() - now.getTime()) + ' ms)');
    //    });
});

(function () {
    var watch = gulp.watch(SOURCE_PATH + '/**/*.js', [_STEP_1]);
    watch.on('change', function () {
        console.log('>>> DETECT CHANGE JS<<<')
    });
    watch.on('error', function (err) {
        console.error(err);
    });
}).call(null);

(function () {
    var watch = gulp.watch(SOURCE_PATH + '/**/*.html', [_STEP_2]);
    watch.on('change', function () {
        console.log('>>> DETECT CHANGE HTML<<<')
    });
    watch.on('error', function (err) {
        console.error(err);
    });
}).call(null);

(function () {
    var watch = gulp.watch(SOURCE_PATH + '/**/*.css', [_STEP_3]);
    watch.on('change', function () {
        console.log('>>> DETECT CHANGE CSS<<<')
    });
    watch.on('error', function (err) {
        console.error(err);
    });
}).call(null);

(function () {
    var watch = gulp.watch(SOURCE_PATH + '/fonts/*.*', [_STEP_4]);
    watch.on('change', function () {
        console.log('>>> DETECT CHANGE FONT<<<')
    });
    watch.on('error', function (err) {
        console.error(err);
    });
}).call(null);

(function () {
    var watch = gulp.watch(SOURCE_PATH + '/images/*.*', [_STEP_5]);
    watch.on('change', function () {
        console.log('>>> DETECT CHANGE IMAGES<<<')
    });
    watch.on('error', function (err) {
        console.error(err);
    });
}).call(null);

gulp.task('default', [_STEP_0, _STEP_1, _STEP_2, _STEP_3, _STEP_4, _STEP_5]);

