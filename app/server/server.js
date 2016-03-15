var bodyParser = require('body-parser');
var bunyan = require('bunyan');
var compression = require('compression');
var connectredis = require('connect-redis');
var cookieParser = require('cookie-parser');
var express = require('express');
var helmet = require('helmet');
var livereload = require('connect-livereload');
var path = require('path');
var redis = require('redis');
var session = require('express-session');

module.exports = main = function(config) {

  var app = {};

  // Load config
  app.config = config || require('./config');

  // App logger
  app.log = bunyan.createLogger({
    name: app.config.locals.shortname
  });
  app.log.info('init: ...starting up');

  // Create the Express server
  app.log.info('init: creating express server');
  app.express = express(app.config.server.express);

  // Express config
  app.log.info('init: configuring express');
  app.express.set('view engine', 'jade');
  app.express.set('views', __dirname + '/');
  app.express.set('json spaces', 2);
  app.express.use(express.static(path.normalize(__dirname + '/../public'), {
    maxAge: 3600000
  }));
  app.express.use('/bower_components',
    express.static(path.normalize(__dirname + '/../../bower_components'), {
      maxAge: 3600000
    })
  );
  app.express.use(compression());
  app.express.use(cookieParser(app.config.server.cookie.secret));
  app.express.use(bodyParser.urlencoded({
    extended: true
  }));

  // Security
  app.express.disable('x-powered-by');
  app.express.use(helmet.xframe('deny'));

  // Setup Redis for session storage
  app.log.info('init: creating redis client');
  app.redis = redis.createClient();
  var RedisStore = connectredis(session);

  // Session setup
  app.log.info('init: setting up sessions');
  app.express.use(session({
    name: app.config.locals.shortname,
    secret: app.config.server.session.secret,
    store: new RedisStore({
      client: app.redis
    }),
    resave: true,
    saveUninitialized: true,
    cookie: {
      secret: app.config.server.cookie.secret
    }
  }));

  // Livereload (must come after session initialization)
  app.express.use(livereload({
    port: 35729
  }));

  // Locals
  app.express.locals = app.config.locals;

  // Routing
  app.log.info('init: mounting the app routes');
  app.express.get('/', function(req, res) {
    return res.render('index');
  });

  // Start it up
  app.express.listen(app.config.server.port, app.config.server.address, function() {
    app.log.info("init: server up at " + app.config.server.address + ":" + app.config.server.port);
  });
};

if (require.main === module) {
  main();
}
