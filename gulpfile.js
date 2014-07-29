var gulp = require('gulp');
var less = require('gulp-less');
var webpack = require('webpack');
var gutil = require('gulp-util');
var clean = require('rimraf');
var path = require('path');

gulp.task('clean', function(callback){
    clean('./public',{force: true}, callback);
});

gulp.task('images', ['clean'], function(){
    gulp
        .src('./content/images/**/*.*')
        .pipe(gulp.dest('./public/images'));
});

gulp.task('less', ['clean'], function () {
    gulp
        .src('./content/less/site.less')
        .pipe(less())
        .pipe(gulp.dest('./public/css'));
});

gulp.task('js', ['clean'], function(callback){

    var plugins = [];
    if(gutil.env.prod){
       plugins.push(new webpack.optimize.UglifyJsPlugin())
    }

    webpack({
        entry: {
            blog: './content/js/blog.js'
        },
        output: {
            path: path.join(__dirname, "public/js"),
            publicPath: '/static/js/',
            filename: "[name].app.js"
        },
        plugins: plugins
    }, function(err, stats) {

        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString());

        callback();
    });
});

gulp.task('default', ['clean','less', 'js', 'images']);

gulp.task('watch', ['default'], function(){
    gulp.watch(['./content/less/**/*.less', './content/js/**/*.js'], ['default']);
});
