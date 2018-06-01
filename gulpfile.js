var gulp = require('gulp');
var ts = require('gulp-typescript');
// use this later: https://www.npmjs.com/package/gulp-typescript

gulp.task('default', ['typescript', 'move'] ,function() {
  // place code for your default task here
});

var tsProject = ts.createProject('tsconfig.json');
gulp.task('typescript', function() {
  let tsResult = tsProject.src().pipe(tsProject());
  return tsResult.js.pipe(gulp.dest('dist'));
});

gulp.task('move', function() {
  let stream = gulp.src([
    './src/client/public/**/*.*',
    '!src/client/public/js/**/*.ts'
  ], {base: './src'}).pipe(gulp.dest('dist'));

  return stream;
});