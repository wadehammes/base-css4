Base CSS4 (v1)
===

#####USE (install <a href="http://nodejs.org/download/">NPM</a>):
Clone this repo into your code directory and remove the .git file:
```
$ cd your/development/directory/
$ git clone git@github.com:wadehammes/base-css4.git your-project-name
$ rm -rf .git
$ rm .gitignore
$ npm install
```

<b>NOTE: if you get an error about node-sass not being installed, take a look at this Stack Overflow (and the answer):</b>
<a href="http://stackoverflow.com/questions/29461831/libsass-bindings-not-found-when-using-node-sass-in-nodejs">http://stackoverflow.com/questions/29461831/libsass-bindings-not-found-when-using-node-sass-in-nodejs</a>

Run Gulp:
```
$ npm start
```

Your project should compile successfully.

##### In order to optimize your SVG
```
$ cd assets
$ mkdir svg
$ gulp svg
```

##### In order to optimize your images
```
$ cd assets
$ mkdir img
$ gulp images
```

##### In order to update packages:
```
$ npm run-script update
```

#### To fix breaking npm builds
```
$ npm rebuild
```

Using this to build
===

All theme dev is done in the assets/ directory. You will need to create the SVG and IMG directories (svg/ and img/ respectively). For more information on BASSCSS, see http://basscss.com, and for more info on using CSS4 now, visit the CSS Next website at http://cssnext.io

To include new CSS files outside of the BASSCSS defaults, comment out modules, or add optional modules, please see <code>assets/css/base.css</code>.

You can also use .php files if you need, just change index to .php and then create your files that way (use <code>include</code> where you can to keep things DRY).
