sweet-scroll.js
===============

[![Build Status](http://img.shields.io/travis/tsuyoshiwada/sweet-scroll.svg?style=flat-square)](https://travis-ci.org/tsuyoshiwada/sweet-scroll)
[![npm version](https://img.shields.io/npm/v/sweet-scroll.svg?style=flat-square)](http://badge.fury.io/js/sweet-scroll)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/tsuyoshiwada/sweet-scroll/master/LICENSE)

![logo](https://raw.githubusercontent.com/tsuyoshiwada/sweet-scroll/images/logo.png)

Modern and the sweet smooth scroll library.

[View Demo](http://tsuyoshiwada.github.io/sweet-scroll/)


## FEATURES

* Dependecy-free!!
* ECMAScript 2015(ES6) frendly
* Use `requestAnimationFrame` API (IE9 works in `setTimeout` instead)
* Supports vertical and horizontal scroll
* Supports dynamic trigger (event delegation)
* Supports container for the scroll


## USAGE

### 1. Install

#### via NPM

```bash
$ npm install sweet-scroll
```

##### use

```javascript
import SweetScroll from "sweet-scroll"
```


#### via MANUAL

1. Download the [sweet-scroll.min.js](https://raw.githubusercontent.com/tsuyoshiwada/sweet-scroll/master/sweet-scroll.min.js)
2. Load it in the script tag.

```html
<script src="sweet-scroll.min.js"></script>
```



### 2. Setup of HTML

```html
<a href="#intro" data-scroll>Go to Introduction</a>
...
<div id="intro">Introduction</div>
```



### 3. Initialize SweetScroll

```javascript
const sweetScroll = new SweetScroll({/* some options */});
```



## OPTIONS

The following options are applied by default. It can be customized as needed.

```javascript
{
  trigger: "[data-scroll]",       // Selector for trigger (must be a valid css selector)
  header: "[data-scroll-header]", // Selector for fixed header (must be a valid css selector)
  duration: 1000,                 // Specifies animation duration in integer
  delay: 0,                       // Specifies timer for delaying the execution of the scroll in milliseconds.
  easing: "easeOutQuint",         // Specifies the pattern of easing
  offset: 0,                      // Specifies the value to offset the scroll position in pixels
  verticalScroll: true,           // Enable the vertical scroll
  horizontalScroll: false,        // Enable the horizontal scroll
  stopScroll: true,               // When fired wheel or touchstart events to stop scrolling
  stopPropagation: true,          // Stop the bubbling of trigger element click events

  // Callbacks
  beforeScroll: null,
  afterScroll: null,
  cancelScroll: null
}
```


### Easings

Supports the following easing.


* **Normal**
    - `linear`
* **Quad**
    - `easeInQuad`
    - `easeOutQuad`
    - `easeInOutQuad`
* **Cubic**
    - `easeInCubic`
    - `easeOutCubic`
    - `easeInOutCubic`
* **Quart**
    - `easeInQuart`
    - `easeOutQuart`
    - `easeInOutQuart`
* **Quint**
    - `easeInQuint`
    - `easeOutQuint` (default)
    - `easeInOutQuint`
* **Sine**
    - `easeInSine`
    - `easeOutSine`
    - `easeInOutSine`
* **Expo**
    - `easeInExpo`
    - `easeOutExpo`
    - `easeInOutExpo`
* **Circ**
    - `easeInCirc`
    - `easeOutCirc`
    - `easeInOutCirc`
* **Elastic**
    - `easeInElastic`
    - `easeOutElastic`
    - `easeInOutElastic`
* **Back**
    - `easeInBack`
    - `easeOutBack`
    - `easeInOutBack`
* **Bounce**
    - `easeInBounce`
    - `easeOutBounce`
    - `easeInOutBounce`

[Live demo](http://tsuyoshiwada.github.io/sweet-scroll/easings.html)



### Specifies the container

In the following example we have specified in the container for scrolling the `#container`.

```html
<div id="container">
  <a href="#heading2" data-scroll>Go to Heading2</a>
  ...
  <h2 id="heading2">Heading2</h2>
</div>
```

```javascript
const sweetScroll = new SweetScroll({/* some options */}, "#container");
```


### Specifies a fixed header

Add the `data-scroll-header` attribute in order to offset the height of the fixed header.

```html
<header data-scroll-header></header>
```

Specify the CSS Selector in `header` option instead of the `data-scroll-header` attribute.

```javascript
const sweetScroll = new SweetScroll({
  header: "#header"
});
```


### Override of options for each element

You can override the default options by passing the option in `JSON` format to the `data-scroll-options`.

```html
<a href="#target" data-scroll data-scroll-options='{"easing": "easeOutBounce"}'>Go to Target</a>
```


## API

* `new SweetScroll(options = {}, container = "body, html")`
* `to(distance, options = {})`
* `toTop(distance, options = {})`
* `toLeft(distance, options = {})`
* `destroy()`

`distance` to can specify the CSS Selector or scroll position.

**Example:**

```javascript
const SweetScroll = new SweetScroll();

// CSS Selector of target element
sweetScroll.to("#footer");

// Object
sweetScroll.to({top: 1000, left: 20});

// Array (top:0, left:1000)
sweetScroll.to([0, 1000]);

// Number (Priority to vertical scroll position. by default.)
sweetScroll.to(500);

// String (Like object syntax)
sweetScroll.to("top: 500, left: 100");

// String (Relative position)
sweetScroll.to("+=500")
sweetScroll.to("-=200")
```


## BROWSER SUPPORT

Works in `IE9+`, and all modern browsers.



## LICENCE

Released under the [MIT Licence](https://raw.githubusercontent.com/tsuyoshiwada/sweet-scroll/master/LICENSE)



## AUTHOR

[tsuyoshiwada](https://github.com/tsuyoshiwada)



## DEVELOPMENT

Initialization of the project.

```bash
$ cd /your/project/dir
$ git clone https://github.com/tsuyoshiwada/sweet-scroll.git
```

Install some dependencies.

```bash
$ npm install
```

Start the development.  
You I can access the `http://localhost:3000/`.

```bash
$ npm start
```

Run lint and testing.

```bash
$ npm test
```

Generates build file.

```bash
$ npm run build
```
