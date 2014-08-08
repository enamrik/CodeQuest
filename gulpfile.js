var gulp = require('gulp');
var less = require('gulp-less');
var webpack = require('webpack');
var gutil = require('gulp-util');
var clean = require('rimraf');
var path = require('path');

function path_from(p){
   return './app/' + p;
}

gulp.task('clean', function(callback){
    clean(path_from('public'),{force: true}, callback);
});

gulp.task('images', ['clean'], function(){
    gulp
        .src(path_from('content/images/**/*.*'))
        .pipe(gulp.dest(path_from('public/images')));
});

gulp.task('less', ['clean'], function () {
    gulp
        .src(path_from('content/less/site.less'))
        .pipe(less({compress: gutil.env.prod}))
        .pipe(gulp.dest(path_from('public/css')));
});

gulp.task('js', ['clean'], function(callback){

    var plugins = [];
    if(gutil.env.prod){
       plugins.push(new webpack.optimize.UglifyJsPlugin())
    }

    webpack({
        entry: {
            blog: path_from('content/js/blog.js')
        },
        output: {
            path: path_from("public/js"),
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
    gulp.watch([path_from('content/less/**/*.less'), path_from('content/js/**/*.js')], ['default']);
});
