// build flow that copies MyNiceProgram.exe to another
// directory (with forced folder creation and overwrite)
var gulp = require('gulp');
var exefile = 'some/bin/path/MyNiceProgram.exe';
gulp.task('build', function() {
    gulp.src(exefile).pipe(gulp.dest('../../Binaries/'));
});
gulp.task('default', ['build'], function() {
    gulp.watch(exefile, ['build']);
});