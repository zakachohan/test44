// build flow that copies MyNiceProgram.exe to another
// directory (with forced folder creation and overwrite)
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
});

gulp.task('watch', ['browserSync'], function() {
    // Other watchers
})