var gulp = require("gulp");
var watch = require('gulp-watch');
var sass = require('gulp-sass')(require('node-sass'));
var del = require('del');
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");

//const sassDir = 'src/scss/**/*.scss';
//const tsDir = 'src/ts/**/*.ts';
//const  = 'dist/';

const config = {
    src: {
        html: './src/*.html',
        sass: './src/scss/**/*.scss',
        ts: 'src/ts/**/*.ts'
    },
    dist: {
        html: './dist',
        css: './dist',
        js: './dist/js'
    }
};

gulp.task('html', () => {
    return gulp.src(config.src.html)
        .pipe(gulp.dest(config.dist.html));
});

gulp.task('clean', () => {
    return del([
        config.dist.css + '/*.css',
    ]);
});

gulp.task('sass', gulp.series(['clean', () => {
    return gulp.src(config.src.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.dist.css));
}]));

gulp.task('ts', () => {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(config.dist.js));
});

gulp.task('watch', () => {
    gulp.watch(config.src.html, gulp.series('html'));
    gulp.watch(config.src.sass, gulp.series('sass'));
    gulp.watch(config.src.ts, gulp.series('ts'));
});

gulp.task("default", gulp.parallel(['ts', gulp.parallel(['html','sass'])]));