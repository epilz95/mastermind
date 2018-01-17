# ToC

<!-- vim-markdown-toc GFM -->

* [mastermind](#cookiecutterproject_name)
    * [Installing / Getting started](#installing--getting-started)
    * [Developing](#developing)
        * [Built With](#built-with)
        * [Development commands](#development-commands)
            * [Dev-Server](#dev-server)
            * [Type-Checker (Flow)](#type-checker-flow)
                * [Required module not found](#required-module-not-found)
            * [Linters](#linters)
            * [Testing](#testing)
        * [Building](#building)
        * [CI](#ci)

<!-- vim-markdown-toc -->


# mastermind
The well-known mastermind game programmed in JavaScript, HTML and SCSS.

The aim is to guess a randomly generated color code out of 8 colors
(colors can occurr multiple times) within 12 tries. See the rules here: 
https://en.wikipedia.org/wiki/Mastermind_(board_game)

The number of maximum tries and the code length are currently handled in a static way.

Maximum tries: 12

Code length: 4

## Installing / Getting started

To install all project dependencies simply run

```shell
npm i
```


## Developing

### Built With

This project includes quite a few opinionated settings which were
made according to our own guidelines. Therefore this template includes:

* Webpack as module bundler, dev server and build tool
* Babel for ES6 and Flow transpilation
* Flow as type-checker
* Standard as JS linter
* StyleLint as scss/css linter
* CSS-Autoprefixing via postcss
* Jest as testing framework
* SVG-Sprite for automatic sprite/scss generation
* normalize.css as CSS-reset


### Development commands

#### Dev-Server

To start the development server run:

```shell
npm start
```

This will build the svg-sprite files and start an instance
of webpack-dev-server. From then on the whole project will
rebuild, run your JS files through the Flow type-checker and
lint your JS with standard and your scss/CSS with stylelint.


#### Type-Checker (Flow)

To separately type-check your JS-files, run:

```shell
npm run flow
```

##### Required module not found

To add third party library flow support use [flow-typed](https://github.com/flowtype/flow-typed).

If the library of your choice does not support flow, you can add a file
named after the module into the `flow-typed`-directory. The file should have
the following content in it:

```javascript
// myModule.js
declare module 'myModule' {
  declare module.exports: any
}
```

If a local module is not resolved you can add an option to
the `.flowconfig` like so:

```bash
[options]
module.system.node.resolve_dirname=src
```

#### Linters

To separately lint your JS-files, run:

```shell
npm run lint
```

or to autmatically fix issues if possible, run:

```shell
npm run lint:fix
```

To separately lint your stylesheets, run:

```shell
npm run stylelint
```

or to automatically fix issues if possible, run:

```shell
npm run stylelint:fix
```


#### Testing

Tests should usually live next to their base files and should
be named like: `<myBaseFile>.test.js`.

To run Jest and check if your tests pass invoke:

```shell
npm run test
```

This will also generate a coverage folder, containing information
about the project's test coverage.

To continuously run Jest and have Jest watching for changes, run:

```shell
npm run test:watch
```


### Building

To build the project, run:

```shell
npm run build
```

This will build your svg-sprite files, compile, minify and bundle
everything and put all packaged files into the _dist/_ directory (if there is no such directory it will just be newly created, an existing directory will be removed first).
To allow our client's browsers to cache vendor files and only update the cache when it is really necessary, all important filenames include hashes for reference inside the built manifest file.


### CI

This project already includes a default _.gitlab-ci.yml_.
Just configure the file to your needs.