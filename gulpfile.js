var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var rename = require("gulp-rename");
var minifyCss = require('gulp-minify-css');
var uncss = require('gulp-uncss');
var htmlify = require('gulp-angular-htmlify');

var config = {
  bootstrapDir: 'bower_components',
  publicDir: 'app'
};

gulp.task('htmlify', function() {
  gulp.src('src/**/*.html')
    .pipe(htmlify())
    .pipe(gulp.dest('app/'));
});

gulp.task('ngmin', function () {
  return gulp.src([
    'src/js/app.js',
    'bower_components/angular/*.js',
    'bower_components/angular-route/*.js',
    'bower_components/bootstrap/dist/js/*.js',
    'bower_components/jquery/dist/*.js',
  ])
  .pipe(gulp.dest('app/js'));
});

gulp.task('css', function () {
  return gulp.src([
      config.bootstrapDir + '/bootstrap/dist/css/bootstrap.min.css',
      'src/style/style.css'
    ])
    .pipe(concatCss("style/style.css"))
    //.pipe(uncss({html: ['app/index.html', 'app/pages/*.html']})) //@fixme commented for redeclare "input.ng-invalid-pattern"
    .pipe(minifyCss())
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest(config.publicDir + '/style'));
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.html' , ['htmlify'])
  gulp.watch('src/js/*.js' , ['ngmin'])
  gulp.watch('src/style/*.css', ['css'])
});

gulp.task('default', ['htmlify', 'css', 'ngmin']);
