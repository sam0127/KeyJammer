import gulp from "gulp";
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
        prod_js: './dist/src',
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
        './dist/*',
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

gulp.task('ts-prod', () => {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest(config.dist.prod_js));
});

gulp.task('watch', () => {
    gulp.watch(config.src.html, gulp.series('html'));
    gulp.watch(config.src.sass, gulp.series('sass'));
    gulp.watch(config.src.ts, gulp.series('ts'));
    gulp.watch(config.src.assets, gulp.series('assets'));
});

gulp.task("build-prod",
    gulp.parallel(['ts-prod',
    gulp.parallel(['html',
    gulp.parallel(['assets', 'sass'])])]));

gulp.task("default",
        gulp.parallel(['ts',
        gulp.parallel(['html',
        gulp.parallel(['assets', 'sass'])])]));