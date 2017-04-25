'use strict'

const gulp = require('gulp')
const connect = require('gulp-connect')
const open = require('gulp-open')
const browserify = require('browserify')
const reactify = require('reactify')
const source = require('vinyl-source-stream')
const concat = require('gulp-concat')
const eslint = require('gulp-eslint')

const config = {
    port: 8080,
    baseDevURL: 'http://0.0.0.0',
    paths: {
        html: './src/*.html',
        js: './src/**/*.js',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.css'
        ],
        mainJS: './src/app.js',
        dist: './dist/'
    }
}

gulp.task('connect', () => {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.baseDevURL,
        livereload: true
    })
})

gulp.task('html', () => {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload())
})

gulp.task('js', () => {
    browserify(config.paths.mainJS)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(config.paths.dist + 'scripts/'))
        .pipe(connect.reload())
})

gulp.task('lint', () => {
    return gulp.src(config.paths.js)
        .pipe(eslint({ config: 'eslint.config.json' }))
        .pipe(eslint.format())
})

gulp.task('css', () => {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(config.paths.dist + 'css/'))
        .pipe(connect.reload())
})

gulp.task('watch', () => {
    gulp.watch(config.paths.html, ['html'])
    gulp.watch(config.paths.js, ['lint', 'js'])

})

gulp.task('default', ['html', 'lint', 'js', 'css', 'connect', 'watch'])