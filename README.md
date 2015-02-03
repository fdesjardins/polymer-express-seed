# Polymer Starter Kit

## Overview

This is basically a working reimplementation of [Polymer in 10 minutes](https://www.polymer-project.org/docs/start/creatingelements.html)
with some infrastructure so you can quickly dive into Polymer components. It's
an example of how you might begin to organize an application. You can either
continue using Jade templates on the server side or add in your favorite
client-side framework.

This kit is setup with

* Express.js server
* Gulp
* CoffeeScript
* Jade templates
* Stylus stylesheets
* LiveReload
* Redis sessions

and some other stuff you can remove if you don't need it.


## Prerequisites

* Node.js
* NPM


## Getting Started

1. `$ npm i -g gulp && npm i && bower i && cp ./app/server/secrets{-sample.coffee,.coffee} && gulp`
2. Change the secrets in app/server/secrets.coffee
2. Modify the code to your liking

## Commands

### `gulp build`

Builds everything.

### `gulp`

Builds everything, then serves the app using nodemon and watches for changes.
