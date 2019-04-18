var gulp = require('gulp'),
    browserSync = require('browser-sync').create();
    sass = require('gulp-sass'),
    imagemin = require('gulp-imagemin');
    uglifycss = require('gulp-uglifycss'),

    paths = {
        src: 'src/**/*',
        srcHTML: 'src/*.html',
        srcCSS: 'src/**/*.css',
        srcJS: 'src/**/*.js',
        dist: 'dist',
        distIndex: 'dist/index.html',
        distCSS: 'dist/**/*.css',
        distJS: 'dist/**/*.js'
    };

gulp.task('serve', function () {
    browserSync.init({
        server: "./dist"
    });

    gulp.watch("./src/scss/*.scss", ['sass']);
    gulp.watch("./src/*.html", ['html']).on('change', browserSync.reload);
});

gulp.task('sass:watch', function () {
    gulp.watch('./src/scss/*.scss', ['sass']);
});

gulp.task('sass', function () {
    return gulp.src(['node_modules/bootstrap/scss/bootstrap.scss', './src/scss/styles.scss'])
        .pipe(sass({ includePaths: require('node-normalize-scss').includePaths }).on('error', sass.logError))
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());
});

gulp.task('html', function () {
    gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/tether/dist/js/tether.min.js', 'js/script.js'])
        .pipe(gulp.dest("./dist/js"))
        .pipe(browserSync.stream());
});

gulp.task('img', function () {
    gulp.src('src/img/*/*')
        .pipe(imagemin([
            imagemin.gifsicle({ interlaced: true }),
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [
                    { removeViewBox: true },
                    { cleanupIDs: false }
                ]
            })
        ]))
        .pipe(gulp.dest('dist/img'))
});

gulp.task('copy', ['html', 'sass', 'js', 'img']);

gulp.task('default', ['copy', 'serve']);