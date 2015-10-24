gulp = require 'gulp'
plug = (require 'gulp-load-plugins')()
nib = require 'nib'

# compile coffeescript, concat, minify
gulp.task 'scripts', ->
  gulp.src('./app/client/scripts/app.coffee', read: false)
    .pipe(plug.plumber(
      errorHandler: plug.notify.onError("Error: <%= error.message %>")
    ))
    .pipe(plug.sourcemaps.init())
    .pipe(plug.browserify(
      transform: ['coffeeify']
      extensions: ['.coffee']
    ))
    .pipe(plug.rename('app.js'))
    .pipe(gulp.dest('./app/public/scripts'))
    .pipe(plug.size(title: 'scripts'))
    .pipe(plug.uglify())
    .pipe(plug.sourcemaps.write())
    .pipe(plug.rename('app.min.js'))
    .pipe(gulp.dest('./app/public/scripts'))
    .pipe(plug.size(title: 'scripts (min)'))

# compile stylus
gulp.task 'styles', ->
  gulp.src('./app/client/styles/app.styl')
    .pipe(plug.plumber(
      errorHandler: plug.notify.onError("Error: <%= error.message %>")
    ))
    .pipe(plug.stylus(use: [nib()]))
    .pipe(plug.rename('app.min.css'))
    .pipe(gulp.dest('./app/public/styles'))
    .pipe(plug.size(title: 'styles (min)'))

# copy images
gulp.task 'images', ->
  gulp.src('./app/client/images/**/*.*')
    .pipe(plug.imagemin(
      progressive: true
      interlaced: true
    ))
    .pipe(gulp.dest('./app/public/images'))
    .pipe(plug.size(title: 'images'))

# copy elements
gulp.task 'elements', ->
  gulp.src('./app/client/elements/**/*.jade')
    .pipe(plug.plumber(
      errorHandler: plug.notify.onError("Error: <%= error.message %>")
    ))
    .pipe(plug.jade(locals: ('./app/server/config').locals))
    .pipe(gulp.dest('./app/public/elements'))
    .pipe(plug.size(title: 'elements'))

# watch for changes
gulp.task 'watch', ->
  gulp.watch './app/client/styles/**/*.styl', ['styles']
  gulp.watch './app/client/scripts/**/*.coffee', ['scripts']
  gulp.watch './app/client/images/**/*.*', ['images']
  gulp.watch './app/client/elements/**/*.jade', ['elements']

# serve task
gulp.task 'serve', ->
  plug.livereload.listen()
  plug.nodemon
    script: './app/server/server.coffee'
    ext: 'coffee'
    ignore: ['**']

  gulp.watch('./app/public/scripts/**').on 'change', plug.livereload.changed
  gulp.watch('./app/public/styles/**').on 'change', plug.livereload.changed
  gulp.watch('./app/public/images/**').on 'change', plug.livereload.changed
  gulp.watch('./app/public/elements/**').on 'change', plug.livereload.changed
  gulp.watch('./app/index.jade').on 'change', plug.livereload.changed

# build task
gulp.task 'build', ['styles', 'scripts', 'images', 'elements']

# default task
gulp.task 'default', ['build', 'watch', 'serve']
