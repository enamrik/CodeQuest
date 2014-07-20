var gulp = require('gulp');
var less = require('gulp-less');
var concat = require('gulp-concat');
var clean = require('rimraf');

gulp.task('clean', function(cb){
    clean('./public',{force: true}, cb);
});

gulp.task('less', ['clean'], function () {
    gulp
        .src('./content/less/site.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', ['clean'], function(){
    gulp
        .src([
            './content/js/lib/jquery.js',
            './content/js/lib/bootstrap.js',
            './content/js/lib/knockout.js',
            './content/js/lib/mapping.js',
            './content/js/lib/moment.js',
            './content/js/lib/underscore.js'
        ])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest('./public/js'));
    gulp
        .src('./content/js/main.js')
        .pipe(gulp.dest('./public/js'));
    gulp
        .src(['./content/js/lib/require.js'])
        .pipe(gulp.dest('./public/js'));
});

gulp.task('default', ['clean','less', 'js']);

gulp.task('watch', ['default'], function(){
    gulp.watch(['./content/less/**/*.less', './content/js/**/*.js'], ['default']);
});
