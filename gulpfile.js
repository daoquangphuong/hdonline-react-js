var gulp = require('gulp');
var del = require('del');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var uglifycss = require('gulp-uglifycss');
var gulpif = require('gulp-if');
var watchify = require('watchify');
var browserify = require('browserify');

const SOURCE_PATH = 'flux';
const EXTENSION_PATH = 'extension';
const DIST_PATH = EXTENSION_PATH + '/data';

const _STEP_0 = 'STEP 0: CLEAN';
const _STEP_1 = 'STEP 1: JS';
const _STEP_2 = 'STEP 2: HTML';
const _STEP_3 = 'STEP 3: CSS';
const _STEP_4 = 'STEP 4: JPM';

const _IS_DEV = process.argv[process.argv.length - 1] == 'dev';

if (_IS_DEV) {
    console.log('-----THIS IS DEV ENVIRONMENT-----');
}

'use strict';

gulp.task(_STEP_0, function () {
    del.sync([DIST_PATH + '/**/*']);
});
// COMPILE JAVASCRIPT
var JS_DONE = false;
var domain = {};
var bundler = watchify(
    browserify()
        .add(SOURCE_PATH + '/js/global.js', {debug: true})
        .add(SOURCE_PATH + '/js/app.js', {debug: true})
        .transform("babelify", {presets: ["es2015", "react"], global: true, ignore: /\/node_modules\//})
);
gulp.task(_STEP_1, [], function () {
    var now = new Date();

    function rebundle() {
        if (domain[_STEP_1]) {
            domain[_STEP_1].dispose();
        }
        domain[_STEP_1] = require('domain').create();
        domain[_STEP_1].run(function () {
            bundler.bundle()
                .on('error', function (err) {
                    console.error(err);
                    this.emit('end');
                })
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
                    JS_DONE = true;
                    var _now = new Date();
                    console.log('>>> JS ok !' + '(' + (_now.getTime() - now.getTime()) + ' ms)');
                });
        });

    }

    bundler.on('update', function () {
        rebundle();
    });

    return rebundle();
});
// COMPILE HTML
var HTML_DONE = false;
gulp.task(_STEP_2, [], function () {
    var now = new Date();
    gulp.src(SOURCE_PATH + '/*.html')
        .pipe(gulp.dest(DIST_PATH))
        .on('end', function () {
            HTML_DONE = true;
            var _now = new Date();
            console.log('>>> Html ok !' + '(' + (_now.getTime() - now.getTime()) + ' ms)');
        });
});
// COMPILE CSS
var CSS_DONE = false;
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
            CSS_DONE = true;
            var _now = new Date();
            console.log('>>> Css ok !' + '(' + (_now.getTime() - now.getTime()) + ' ms)');
        });
});
// COMPiLE XPI
var jpmProcess = false;
gulp.task(_STEP_4, [], function () {
    if (jpmProcess) {
        jpmProcess.kill();
    }
    jpmProcess = require('child_process').fork('./jpm.js');
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
    var loop = function () {
        setTimeout(function () {
            if (JS_DONE && CSS_DONE && HTML_DONE) {
                gulp.start(_STEP_4);
                var watch = gulp.watch([
                    EXTENSION_PATH + '/data/**/*.*',
                    EXTENSION_PATH + '/lib/**/*.*',
                    EXTENSION_PATH + '/index.js',
                    EXTENSION_PATH + '/package.json'
                ], [_STEP_4]);
                watch.on('change', function () {
                    console.log('>>> DETECT CHANGE EXTENSION<<<')
                });
                watch.on('error', function (err) {
                    console.error(err);
                });
                return;
            }
            loop();
        }, 100)
    };
    loop();
}).call(null);

gulp.task('default', [_STEP_0, _STEP_1, _STEP_2, _STEP_3]);

