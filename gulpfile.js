var gulp = require('gulp');
var concatCss = require('gulp-concat-css');
var rename = require("gulp-rename");
var minifyCss = require('gulp-minify-css');
var uncss = require('gulp-uncss');
var notify = require("gulp-notify");
var ngmin = require('gulp-ngmin');
var htmlify = require('gulp-angular-htmlify');
var debug = require('gulp-debug');

//var browserSync = require('browser-sync').create();
//return gulp.src(['src/partials/**/*.html', 'src/scripts/**/*.js'])
var config = {
  bootstrapDir: 'bower_components',
  publicDir: 'app'
};


gulp.task('htmlify', function() {
  gulp.src('src/**/*.html')
    //.pipe(debug({title: 'unicorn:'}))
    .pipe(htmlify())
    //.pipe(debug({title: 'unicorn:'}))
    .pipe(gulp.dest('app/'))
    //.pipe(notify('Gulp build:html done!'))
    ;
});

gulp.task('ngmin', function () {
  return gulp.src([
    'src/js/app.js',
    'bower_components/angular/*.js',
    'bower_components/angular-route/*.js',
    'bower_components/bootstrap/dist/js/*.js',
    'bower_components/jquery/dist/*.js',
  ])
    //.pipe(ngmin({dynamic: true}))
    .pipe(gulp.dest('app/js'))
    //.pipe(notify('Gulp build:js done!'))
    ;
});

//gulp.task('minify-css', function() {
//  return gulp.src('src/style/*.css')
//    .pipe(minifyCss({compatibility: 'ie8'}))
//    .pipe(gulp.dest('dist'));
//});

gulp.task('clean', function () {
  //rimraf(path.clean, cb);
  
});

gulp.task('css', function () {
  return gulp.src(['src/style/*.css', config.bootstrapDir + '/bootstrap/dist/css/*.css'])
  //return gulp.src('src/style/*.css')
  //return gulp.src(['src/style/*.css', 'bower_components/bootstrap/dist/css/*.css'])
    //.pipe(debug({title: 'unicorn:'}))
    //.pipe(concatCss("style/style.css"))
    //.pipe(uncss({
    //  html: ['index.html', 'pages/**/*.html', 'http://example.com']
    //}))
    //.pipe(minifyCss({compatibility: 'ie8'}))
    //.pipe(rename("style/style.min.css"))
    //.pipe(gulp.dest('app/'))
    .pipe(gulp.dest(config.publicDir + '/style'))
    //.pipe(notify('Gulp build:css done!'))
    ;
});

gulp.task('watch', function() {
  gulp.watch('src/style/*.css', ['css'])
  gulp.watch('src/js/*.js' , ['ngmin'])
  gulp.watch('src/**/*.html' , ['htmlify'])
});

gulp.task('build', ['css', 'ngmin', 'htmlify']);

gulp.task('default',  ['clean', 'css', 'ngmin', 'htmlify']);

// Static server
//gulp.task('browser-sync', function() {
//  browserSync.init({
//    server: {
//      baseDir: "./"
//    }
//  });
//});

// or...
//gulp.task('browser-sync', function() {
//  browserSync.init({
//    proxy: "yourlocal.dev"
//  });
//});


//var gulp = require('gulp');
//var cssmin = require('gulp-cssmin');
//var rename = require('gulp-rename');
//
//gulp.task('default', function () {
//  gulp.src('src/**/*.css')
//    .pipe(cssmin())
//    .pipe(rename({suffix: '.min'}))
//    .pipe(gulp.dest('dist'));
//});