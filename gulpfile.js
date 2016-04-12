var gulp        = require('gulp'),
    server      = require('gulp-webserver'),
    tap         = require('gulp-tap'),
    fs          = require('fs'),
    browserify  = require('browserify'),
    buffer      = require('gulp-buffer'),
    gutil       = require('gulp-util'),
    uglify      = require('gulp-uglify'),
    gls         = require('gulp-live-server'),
    less        = require('gulp-less');


// Run a local server
// gulp.task('server', function() {
//   gulp.src('src')
//     .pipe(server({
//       livereload: true
//     }));
// });


// Run a local server
gulp.task('server', function() {
  var server = gls('./src/app.js', { env: {} });
  server.start();

  // Reload the server on change
  gulp.watch(['./gulpfile.js', './src/app.js'], function() {
    server.start.bind(server)()
  });
});


// Transpile LESS to CSS
gulp.task('less', function() {
  return gulp.src('./src/public/less/style.less')
    .pipe(less())
    .pipe(gulp.dest('./src/public/css'));
});


// Compile all JSX files
gulp.task('react', function() {
  return gulp.src('./src/public/jsx/**/*.js', {read: false})
    .pipe(tap(function(file) {
      gutil.log('bundling ' + file.path);

      file.contents = browserify(file.path).transform('babelify', {presets: ['es2015', 'react']}).bundle()
    }))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./src/public/js/components'));
});

// Watch for changes and run defined tasks
gulp.task('watch', function() {
  gulp.watch(['./src/public/less/**/*.less'], ['less']);
  gulp.watch(['./src/public/jsx/*.js'], ['react']);
});

gulp.task('default', ['watch', 'server']);
