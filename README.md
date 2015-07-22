Base CSS4 (v1)
===

#####PRIOR TO FIRST USE (if you don't have these below installed already):
<a href="http://nodejs.org/download/">http://nodejs.org/download/</a>

#####AFTER ABOVE DEPENDENCIES ARE INSTALLED:

Clone this repo into your code directory and copy it to your project:
```
$ cd your/development/directory/
$ git clone git@github.com:wadehammes/base-css4.git your-project-name
$ git rm -rf .git
$ npm install
```

<b>NOTE: if you get an error about node-sass not being installed, take a look at this Stack Overflow (and the answer):</b>
<a href="http://stackoverflow.com/questions/29461831/libsass-bindings-not-found-when-using-node-sass-in-nodejs">http://stackoverflow.com/questions/29461831/libsass-bindings-not-found-when-using-node-sass-in-nodejs</a>

Run Gulp:
```
$ gulp
```

Your project should compile successfully.

##### In order to optimize your SVG
```
$ gulp svg
```

##### In order to optimize your images
```
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
