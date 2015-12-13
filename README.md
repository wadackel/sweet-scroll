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
* Supports dynamic trigger
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



## METHODS

* `to()`
* `toTop()`
* `toLeft()`
* `destory()`

```
@TODO
```



## OPTIONS

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
  stopScroll: true,               // Stop scrolling in any of the events of the wheel or touchmove
  stopPropagation: true,          // Stop the bubbling of trigger element click events

  // Callbacks
  beforeScroll: null,
  afterScroll: null,
  cancelScroll: null
}
```


### Easings

Supports the following easing.

* `linear`
* `easeInQuad`
* `easeOutQuad`
* `easeInOutQuad`
* `easeInCubic`
* `easeOutCubic`
* `easeInOutCubic`
* `easeInQuart`
* `easeOutQuart`
* `easeInOutQuart`
* `easeInQuint`
* `easeOutQuint`
* `easeInOutQuint`
* `easeInSine`
* `easeOutSine`
* `easeInOutSine`
* `easeInExpo`
* `easeOutExpo`
* `easeInOutExpo`
* `easeInCirc`
* `easeOutCirc`
* `easeInOutCirc`
* `easeInElastic`
* `easeOutElastic`
* `easeInOutElastic`
* `easeInBack`
* `easeOutBack`
* `easeInOutBack`
* `easeInBounce`
* `easeOutBounce`
* `easeInOutBounce`

[Animation Sample](http://tsuyoshiwada.github.io/sweet-scroll/easings.html)



### Specifies the container

```javascript
__@TODO__
```


### Specifies a fixed header

```javascript
__@TODO__
```



## BROWSER SUPPORT

Works in `IE9+`, and all modern browsers.



## LICENCE

Released under the [MIT Licence](https://raw.githubusercontent.com/tsuyoshiwada/sweet-scroll/master/LICENSE)



## AUTHOR

[tsuyoshiwada](https://github.com/tsuyoshiwada)



## DEVELOPMENT

__@TODO__