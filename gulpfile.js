/*
IN CASE OF COMMONJS

var gulp = require("gulp");
var watch = require('gulp-watch');
var sass = require('gulp-sass')(require('node-sass'));
var del = require('del');
var ts = require("gulp-typescript");
*/
import gulp from "gulp";
import watch from "gulp-watch";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import { deleteSync } from "del";
import ts from "gulp-typescript";
var tsProject = ts.createProject("tsconfig.json");
const sass = gulpSass(dartSass);

const config = {
    src: {
        html: './src/*.html',
        sass: './src/scss/**/*.scss',
        ts: 'src/ts/**/*.ts',
        assets: 'src/assets/**/*'
    },
    dist: {
        html: './dist',
        css: './dist/css',
        js: './dist/js',
        assets: './dist/assets'
    }
};

gulp.task('html', () => {
    return gulp.src(config.src.html)
        .pipe(gulp.dest(config.dist.html));
});

gulp.task('assets', () => {
    return gulp.src(config.src.assets)
        .pipe(gulp.dest(config.dist.assets));
});

gulp.task('clean', () => {
    return deleteSync([
        config.dist.css + '/*.css',
    ]);
});

gulp.task('sass', () => {
    return gulp.src(config.src.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.dist.css));
});

gulp.task('ts', () => {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(config.dist.js));
});

gulp.task('watch', () => {
    gulp.watch(config.src.html, gulp.series('html'));
    gulp.watch(config.src.sass, gulp.series('sass'));
    gulp.watch(config.src.ts, gulp.series('ts'));
    gulp.watch(config.src.assets, gulp.series('assets'));
});

gulp.task("default",
        gulp.parallel(['ts',
        gulp.parallel(['html',
        gulp.parallel(['assets', 'sass'])])]));