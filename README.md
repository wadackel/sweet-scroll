# <img src="https://raw.githubusercontent.com/tsuyoshiwada/sweet-scroll/images/logo.png" width="340" height="135" alt="sweet-scroll.js">

[![Build Status](http://img.shields.io/travis/tsuyoshiwada/sweet-scroll.svg?style=flat-square)](https://travis-ci.org/tsuyoshiwada/sweet-scroll)
[![npm version](https://img.shields.io/npm/v/sweet-scroll.svg?style=flat-square)](http://badge.fury.io/js/sweet-scroll)
[![David](https://img.shields.io/david/dev/tsuyoshiwada/sweet-scroll.svg?style=flat-square)](https://david-dm.org/tsuyoshiwada/sweet-scroll/#info=devDependencies&view=table)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/tsuyoshiwada/sweet-scroll/master/LICENSE)

ECMAScript2015 Friendly, dependency-free smooth scroll library.

[See Demo](http://tsuyoshiwada.github.io/sweet-scroll/)



## FEATURES

* Dependecy-free!!
* ECMAScript2015 friendly
* Use `requestAnimationFrame` API (IE9 works in `setTimeout` instead)
* Supports vertical and horizontal scroll
* Supports dynamic trigger (event delegation)
* Supports container for the scroll
* Supports many easing types
* Supports server-side rendering (Can load without putting out errors.)



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


#### via CDN (UNPKG)

```html
<script src="https://unpkg.com/sweet-scroll/sweet-scroll.min.js"></script>
```



### 2. Setup of HTML

```html
<a href="#intro" data-scroll>Go to Introduction</a>
...
<div id="intro">Introduction</div>
```



### 3. Initialize SweetScroll

You need to initialize an instance after `DOMContentLoaded`.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const sweetScroll = new SweetScroll({/* some options */});
}, false);
```



## OPTIONS

The following options are applied by default. It can be customized as needed.

```javascript
{
  trigger: "[data-scroll]",       // Selector for trigger (must be a valid css selector)
  header: "[data-scroll-header]", // Selector for fixed header (must be a valid css selector)
  duration: 1000,                 // Specifies animation duration in integer
  delay: 0,                       // Specifies timer for delaying the execution of the scroll in milliseconds
  easing: "easeOutQuint",         // Specifies the pattern of easing
  offset: 0,                      // Specifies the value to offset the scroll position in pixels
  verticalScroll: true,           // Enable the vertical scroll
  horizontalScroll: false,        // Enable the horizontal scroll
  stopScroll: true,               // When fired wheel or touchstart events to stop scrolling
  updateURL: false,               // Update the URL hash on after scroll (true | false | "push" | "replace")
  preventDefault: true,           // Cancels the container element click event
  stopPropagation: true,          // Prevents further propagation of the container element click event in the bubbling phase
  outputLog: false,               // Specify level of output to log
  quickMode: false,               // Instantly scroll to the destination! (It's recommended to use it with `easeOutExpo`)

  // Callbacks
  beforeScroll: null,
  afterScroll: null,
  cancelScroll: null,
  completeScroll: null,
  stepScroll: null
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
    - `easeOutQuint` **(default)**
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



### Customizing Tips

#### Specifies the container

In the following example we have specified in the container for scrolling the `#container`.

```html
<div id="container">
  <a href="#heading2" data-scroll>Go to Heading2</a>
  ...
  <h2 id="heading2">Heading2</h2>
</div>
```

```javascript
// Specified in the CSS Selector
const sweetScroll = new SweetScroll({/* some options */}, "#container");

// Specified in the Element
const sweetScroll = new SweetScroll({/* some options */}, document.getElementById("container"));
```


#### Specifies a fixed header

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


#### Override of options for each element

You can override the default options by passing the option in `JSON` format to the `data-scroll-options`.

```html
<a href="#target" data-scroll data-scroll-options='{"easing": "easeOutBounce"}'>Go to Target</a>
```


#### if you want to use in non anchor element

Will use the data-scroll attribute instead of href.

```html
<button type="button" data-scroll="+=500">Scroll under 500px</button>
```


#### Do you feel scrolling is slow?

You can solve with `quickMode` options!

```javascript
const sweetScroll = new SweetScroll({
  quickMode: true,
  easing: "easeOutExpo" // Recommended
});
```

`quickMode` finishes scrolling in a moment.



#### Scroll animation in a other page

The following, Introduce one of the mounting method.

```javascript
document.addEventListener("DOMContentLoaded", () => {
  const sweetScroll = new SweetScroll();
  const hash = window.location.hash;
  const needsInitialScroll = document.getElementById(hash.substr(1)) != null;

  if (needsInitialScroll) {
    window.location.hash = "";
  }

  window.addEventListener("load", () => {
    if (needsInitialScroll) {
      sweetScroll.to(hash, { updateURL: "replace" });
    }
  }, false);
}, false);
```

[Live demo](http://tsuyoshiwada.github.io/sweet-scroll/initial-scroll.html#footer)

You can also achieve the same thing in other ways by using the provided API.



## API

* [new SweetScroll(options = {}, container = "body, html")](#new-sweetscrolloptions---container--body-html)
* [to(distance, options = {})](#todistance-options--)
* [toTop(distance, options = {})](#totopdistance-options--)
* [toLeft(distance, options = {})](#toleftdistance-options--)
* [toElement(el, options = {})](#toelementel-options--)
* [update(options = {})](#updateoptions--)
* [stop(gotoEnd = false)](#stopgotoend--true)
* [destroy()](#destroy)
* [Callbacks](#callbacks)
    - `beforeScroll(toScroll, trigger) {}`
    - `cancelScroll() {}`
    - `afterScroll(toScroll, trigger) {}`
    - `completeScroll(isCancel) {}`
    - `stepScroll(currentTime, props) {}`

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
sweetScroll.to("+=500");
sweetScroll.to("-=200");
```


### new SweetScroll(options = {}, container = "body, html")

**options: {Object}**  
**container: {String | Element}**  

Will generate a SweetScroll instance.

**Example:**

```javascript
const sweetScroll = new SweetScroll({
  duration: 1200,
  easing: "easeOutBounce"
}, "#container");
```


### to(distance, options = {})

**distance: {String | Array | Object}**  
**options: {Object}**

Scroll animation to the specified `distance`.

**Example:**

```javascript
sweetScroll.to({top: 1500, left: 400});
```


### toTop(distance, options = {})

**distance: {String | Array | Object}**  
**options: {Object}**

Vertical scroll animation to the specified `distance`.  

**Example:**

```javascript
sweetScroll.toTop(0);
```


### toLeft(distance, options = {})

**distance: {String | Array | Object}**  
**options: {Object}**

Horizontal scroll animation to the specified `distance`.  

**Example:**

```javascript
sweetScroll.toLeft(1500);
```


### toElement(el, options = {})

**el: {Element}**  
**options: {Object}**

Scroll animation to the specified `Element`.

**Example:**

```javascript
sweetScroll.toElement(document.getElementById("content"));
```


### update(options = {})

**options: {Object}**

Will update the SweetScroll instance.  
Primarily used in the case of option update.

**Example:**

```javascript
sweetScroll.update({
  trigger: "a[href^='#']"
  duration: 3000
});
```


### stop(gotoEnd = true)

**gotoEnd: {Boolean}**

Will stop the current scroll animation.

**Example:**

```javascript
sweetScroll.stop(true);
```


### destroy()

Will destroy the SweetScroll instance.  
Disable of the method and event handler.

**Example:**

```javascript
sweetScroll.destory();
```


### Callbacks

In `beforeScroll` and `afterScroll`, you will pass the coordinates and the triggering element in the argument.  
In addition, you can stop the scrolling by return a `beforeScroll` in `false`.

**Example:**

```javascript
const sweetScroll = new SweetScroll({

  // Stop scrolling case of trigger element that contains the `is-disabled` class.
  beforeScroll(toScroll, trigger) {
    console.log("Before!!");
    if (trigger && trigger.classList.contains("is-disabled")) {
      return false;
    }
  },

  // If the `wheel` or `touchstart` event is called
  cancelScroll() {
    console.log("Cancel!!");
  },

  // Scroll animation is complete
  afterScroll(toScroll, trigger) {
    console.log("After!!");
  },

  // Scroll animation is complete (`after` or `cancel`)
  completeScroll(isCancel) {
    console.log("Complete!!", isCancel);
  },

  // Each animation frame
  stepScroll(currentTime, props) {
    console.log("step", currentTime, props);
  }
});
```

**Extends Class:**

The following is a pattern to override a method in the inheritance destination class.

```javascript
class MyScroll extends SweetScroll {
  beforeScroll(toScroll, trigger) {
    // Stop scrolling case of trigger element that contains the `is-disabled` class.
    console.log("Before!!");
    if (trigger && trigger.classList.contains("is-disabled")) {
      return false;
    }
  }

  cancelScroll() {
    console.log("Canell!!");
  }

  afterScroll(toScroll, trigger) {
    console.log("After!!");
  }

  completeScroll(isCancel) {
    console.log("Complete!!", isCancel);
  }

  stepScroll(currentTime, props) {
    console.log("step", currentTime, props);
  }
}
```

## BROWSER SUPPORT

Works in `IE9+`, and all modern browsers.



## CHANGELOG

See the [CHANGELOG.md](https://github.com/tsuyoshiwada/sweet-scroll/blob/master/CHANGELOG.md)



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
You can access to the `http://localhost:3000/`.

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


## CONTRIBUTION

Thank you for your interest in sweet-scroll.js.  
Bugs, feature requests and comments are more than welcome in the [issues](https://github.com/tsuyoshiwada/sweet-scroll/issues).

**Before you open a PR:**

Be careful to follow the code style of the project. Run `npm test` after your changes and ensure you do not introduce any new errors or warnings.
All new features and changes need documentation.

Thanks!
