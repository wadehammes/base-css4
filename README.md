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

All theme dev is done in `src/` and uses ZURBs Panini for templating. See https://github.com/zurb/panini for more. CSS framework is BASSCSS, see http://basscss.com for documentation, and for more info on using CSS4 now, visit the CSS Next website at http://cssnext.io.

To include new CSS files outside of the BASSCSS defaults, comment out modules, or add optional modules, please see `src/assets/css/base.css</code>`.

You can also use .php files if you need, just change index to .php and then create your files that way (use <code>include</code> where you can to keep things DRY).
