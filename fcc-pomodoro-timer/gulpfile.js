//yoinked from https://scotch.io/tutorials/automate-your-tasks-easily-with-gulp-js
// grab our packages
var gulp   = require('gulp'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps');


//var sassOptions = {
//  errLogToConsole: true,
//    outputStyle: 'expanded'
//};



var paths = {
    scss:['scss/*.scss'],
    js:['js/*.js'],
    html:[],
};

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src(paths.js)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function(){
    return gulp.src(paths.scss)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css/'))

});


gulp.task('browser-sync', function(){
    browserSync.init(['css/*.css','js/*.js'],
        {
            server:{
                baseDir:'./',
            }
        });
});

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', ['build-css','browser-sync'], function() {
    gulp.watch('index.html').on("change", browserSync.reload);
    gulp.watch('assets/images*.svg').on("change", browserSync.reload);
    gulp.watch('js/*.js', ['jshint']);
    gulp.watch('scss/*.scss', ['build-css']);
});