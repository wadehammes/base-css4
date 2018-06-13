Base CSS4 (v2)
===

#####USE (install <a href="http://nodejs.org/download/">NPM</a>):
Clone this repo into your code directory and remove the .git file:
```
$ cd your/development/directory/
$ git clone git@github.com:wadehammes/base-css4.git your-project-name
$ cd your-project-name
$ rm -rf .git
$ npm install
```

Run Gulp:
```
$ gulp
```

Your project should compile successfully.

Using this to build
===

All theme dev is done in `src/` and uses ZURBs Panini for templating. See https://github.com/zurb/panini for more. CSS is compiled with PostCSS and uses the new PostCSS Preset Env which gives you access to in proposal future CSS.
