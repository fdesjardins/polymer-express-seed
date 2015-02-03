bodyParser = require 'body-parser'
bunyan = require 'bunyan'
compression = require 'compression'
connectredis = require 'connect-redis'
cookieParser = require 'cookie-parser'
express = require 'express'
helmet = require 'helmet'
livereload = require 'connect-livereload'
path = require 'path'
redis = require 'redis'
session = require 'express-session'

module.exports = main = (config) ->

  app = {}

  # Load config
  app.config = config or (require './config')

  # App logger
  app.log = bunyan.createLogger(name: app.config.locals.shortname)
  app.log.info 'init: ...starting up'

  # Create the Express webserver
  app.log.info 'init: creating express server'
  app.express = express app.config.server.express

  # Express config
  app.log.info 'init: configuring express'
  app.express.set 'view engine', 'jade'
  app.express.set 'views', __dirname + '/'
  app.express.set 'json spaces', 2
  app.express.use express.static(path.normalize(__dirname + '/../public'), maxAge: 3600000)
  app.express.use '/bower_components', express.static(path.normalize(__dirname + '/../../bower_components'), maxAge: 3600000)
  app.express.use compression()
  app.express.use cookieParser(app.config.server.cookie.secret)
  app.express.use bodyParser.urlencoded(extended: true)

  # Security settings
  app.express.disable 'x-powered-by'
  app.express.use helmet.xframe 'deny'

  # Setup redis for session storage
  app.log.info 'init: creating redis client'
  app.redis = redis.createClient()
  RedisStore = connectredis session

  # Session setup
  app.log.info 'init: setting up sessions'
  app.express.use session(
    name: 'slaterscreens'
    secret: app.config.server.session.secret
    store: new RedisStore(client: app.redis)
    resave: true
    saveUninitialized: true
    cookie:
      secret: app.config.server.cookie.secret
  )

  # always use after session initialization!
  app.express.use livereload(port: 35729)

  # App locals
  app.express.locals = app.config.locals

  # Routing
  app.log.info 'init: mounting the app routes'
  app.express.get '/', (req, res) ->
    res.render 'index'

  # Start the server
  app.express.listen app.config.server.port, app.config.server.address, ->
    app.log.info "init: server up at #{app.config.server.address}:#{app.config.server.port}"


if require.main is module then main()
