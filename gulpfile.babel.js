import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import jade from 'jade';
import jadeBabel from 'jade-babel';
import nib from 'nib';

import config from './app/server/config';

const plugins = gulpLoadPlugins();

jade.filters.babel = jadeBabel({});

gulp.task('scripts', () => {
  return gulp.src('./app/client/scripts/app.js', { read: false })
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError("Error: <%= error.message %>")
    }))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.browserify({
      transform: ['babelify']
    }))
    .pipe(plugins.rename('app.js'))
    .pipe(gulp.dest('./app/public/scripts'))
    .pipe(plugins.size({ title: 'scripts' }))
    .pipe(plugins.uglify())
    .pipe(plugins.sourcemaps.write())
    .pipe(plugins.rename('app.min.js'))
    .pipe(gulp.dest('./app/public/scripts'))
    .pipe(plugins.size({ title: 'scripts (min)' }));
});

gulp.task('styles', () => {
  return gulp.src('./app/client/styles/app.styl')
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError("Error: <%= error.message %>")
    }))
    .pipe(plugins.stylus({ use: [nib()] }))
    .pipe(plugins.rename('app.min.css'))
    .pipe(gulp.dest('./app/public/styles'))
    .pipe(plugins.size({ title: 'styles (min)' }));
});

gulp.task('images', () => {
  return gulp.src('./app/client/images/**/*.*')
    .pipe(plugins.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest('./app/public/images'))
    .pipe(plugins.size({ title: 'images' }));
});

gulp.task('elements', () => {
  return gulp.src('./app/client/elements/**/*.jade')
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError("Error: <%= error.message %>")
    }))
    .pipe(plugins.jade({ locals: config.locals }))
    .pipe(gulp.dest('./app/public/elements'))
    .pipe(plugins.size({ title: 'elements' }));
});

gulp.task('watch', () => {
  gulp.watch('./app/client/styles/**/*.styl', ['styles']);
  gulp.watch('./app/client/scripts/**/*.coffee', ['scripts']);
  gulp.watch('./app/client/images/**/*.*', ['images']);
  gulp.watch('./app/client/elements/**/*.jade', ['elements']);
});

gulp.task('serve', () => {
  plugins.livereload.listen();
  plugins.nodemon({
    script: './app/server/server.js',
    ignore: ['**']
  });

  gulp.watch('./app/public/**/**').on('change', plugins.livereload.changed);
  gulp.watch('./app/index.jade').on('change', plugins.livereload.changed);
});

gulp.task('build', ['styles', 'scripts', 'images', 'elements']);

gulp.task('default', ['build', 'watch', 'serve']);
