# Polymer Quickstart

[Polymer in 10 minutes](https://www.polymer-project.org/docs/start/creatingelements.html)
with some extras so you can quickly dive into Polymer components.

## Contains

* Express.js
* Gulp
* Babel
* Jade templates
* Stylus stylesheets
* LiveReload
* Redis sessions
* Bunyan logging
* Sourcemaps

## Getting Started

1. `git clone https://github.com/fdesjardins/polymer-express-seed`
2. `npm install`
3. `bower install`
4. `cp ./app/server/secrets{-sample.coffee,.coffee}`
5. Change the secrets in app/server/secrets.coffee
6. `gulp`
7. Open http://localhost:3333/ in your browser

## Gulp

- `gulp build` builds the app
- `gulp` builds then serves/watches for change using nodemon

## Structure

```
.
├── app
│   ├── client
│   │   ├── elements
│   │   │   ├── age-slider.jade
│   │   │   ├── color-picker.jade
│   │   │   ├── editable-color-picker.jade
│   │   │   ├── fav-color.jade
│   │   │   ├── my-element.jade
│   │   │   ├── name-tag.jade
│   │   │   ├── proto-element.jade
│   │   │   └── ready-element.jade
│   │   ├── images
│   │   ├── scripts
│   │   │   └── app.js
│   │   └── styles
│   │       └── app.styl
│   └── server
│       ├── config.js
│       ├── index.jade
│       ├── secrets-example.js
│       └── server.js
├── bower.json
├── docs
├── gulpfile.js
├── LICENSE
├── package.json
└── README.md
```

## License

MIT © Forrest Desjardins
