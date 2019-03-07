![sweet-scroll](https://raw.githubusercontent.com/tsuyoshiwada/sweet-scroll/artwork/repo-banner.png)

[![CircleCI Status](https://img.shields.io/circleci/project/github/tsuyoshiwada/sweet-scroll/master.svg?style=flat-square)](https://circleci.com/gh/tsuyoshiwada/sweet-scroll/)
[![npm version](https://img.shields.io/npm/v/sweet-scroll.svg?style=flat-square)](https://www.npmjs.com/package/sweet-scroll)
[![David](https://img.shields.io/david/dev/tsuyoshiwada/sweet-scroll.svg?style=flat-square)](https://david-dm.org/tsuyoshiwada/sweet-scroll/#info=devDependencies&view=table)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/tsuyoshiwada/sweet-scroll/master/LICENSE)

> ECMAScript2015+ & TypeScript Friendly, dependency-free smooth scroll library.

:lollipop: [See Demo](http://tsuyoshiwada.github.io/sweet-scroll/)

## Features

- Dependecy-free!!
- ECMAScript2015+ & TypeScript friendly
- Use `requestAnimationFrame` API
- Supports vertical and horizontal scroll
- Supports dynamic trigger (event delegation)
- Supports container for the scroll
- Supports many easing types
- Supports server-side rendering (Can load without putting out errors.)

## Migration Guide

See the [Migration Guide](./MIGRATION.md)

## Table of Contents

- [Usage](#usage)
  - [1. Install](#1-install)
  - [2. Setup of HTML](#2-setup-of-html)
  - [3. Initialize SweetScroll](#3-initialize-sweetscroll)
- [Options](#options)
- [Easings](#easings)
  - [Built-in (22)](#built-in-22)
  - [Advanced (9)](#advanced-9)
- [Customizing Tips](#customizing-tips)
  - [Specifying container elements](#specifying-container-elements)
  - [Specify fixed header](#specify-fixed-header)
  - [Override of options for each element](#override-of-options-for-each-element)
  - [If you want to use in non anchor element](#if-you-want-to-use-in-non-anchor-element)
  - [Do you feel scrolling is slow?](#do-you-feel-scrolling-is-slow)
  - [Scrolling animation in another page](#scrolling-animation-in-another-page)
- [API](#api)
  - [new SweetScroll(options?: PartialOptions, container?: string | Element)](#new-sweetscrolloptions-partialoptions-container-string--element--window)
  - [SweetScroll.create(options?: PartialOptions, container?: string | Element)](#sweetscrollcreateoptions-partialoptions-container-string--element--window)
  - [to(distance: any, options?: PartialOptions)](#todistance-any-options-partialoptions)
  - [toTop(distance: any, options?: PartialOptions)](#totopdistance-any-options-partialoptions)
  - [toLeft(distance: any, options?: PartialOptions)](#toleftdistance-any-options-partialoptions)
  - [toElement(\$el: Element, options?: PartialOptions)](#toelementel-element-options-partialoptions)
  - [update(options: PartialOptions)](#updateoptions-partialoptions)
  - [stop(gotoEnd: boolean = true)](#stopgotoend-boolean--true)
  - [destroy()](#destroy)
  - [Callbacks](#callbacks)
- [Browser Support](#browser-support)
  - [Scrolling with IE9](#scrolling-with-ie9)
- [CHANGELOG](#changelog)
- [Contibute](#contibute)
  - [Development](#development)
- [License](#license)

## Usage

### 1. Install

#### via NPM

```bash
$ npm install sweet-scroll
```

##### use

```typescript
import SweetScroll from 'sweet-scroll';
```

#### via MANUAL

1. Download the [sweet-scroll.min.js](https://raw.githubusercontent.com/tsuyoshiwada/sweet-scroll/master/sweet-scroll.min.js)
1. Load it in the script tag.

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

```typescript
document.addEventListener(
  'DOMContentLoaded',
  () => {
    const scroller = new SweetScroll({
      /* some options */
    });
  },
  false,
);
```

## Options

The following options are applied by default. It can be customized as needed.

```typescript
{
  trigger: '[data-scroll]',       // Selector for trigger (must be a valid css selector)
  header: '[data-scroll-header]', // Selector or Element for fixed header (Selector of must be a valid css selector)
  duration: 1000,                 // Specifies animation duration in integer
  easing: 'easeOutQuint',         // Specifies the pattern of easing
  offset: 0,                      // Specifies the value to offset the scroll position in pixels
  vertical: true,                 // Enable the vertical scroll
  horizontal: false,              // Enable the horizontal scroll
  cancellable: true,              // When fired wheel or touchstart events to stop scrolling
  updateURL: false,               // Update the URL hash on after scroll (true | false | 'push' | 'replace')
  preventDefault: true,           // Cancels the container element click event
  stopPropagation: true,          // Prevents further propagation of the container element click event in the bubbling phase

  // Callbacks
  before: null,
  after: null,
  cancel: null,
  complete: null,
  step: null,
}
```

## Easings

Supports the following easing.

### Built-in (22)

- **Normal**
  - `linear`
- **Quad**
  - `easeInQuad`
  - `easeOutQuad`
  - `easeInOutQuad`
- **Cubic**
  - `easeInCubic`
  - `easeOutCubic`
  - `easeInOutCubic`
- **Quart**
  - `easeInQuart`
  - `easeOutQuart`
  - `easeInOutQuart`
- **Quint**
  - `easeInQuint`
  - `easeOutQuint` **(default)**
  - `easeInOutQuint`
- **Sine**
  - `easeInSine`
  - `easeOutSine`
  - `easeInOutSine`
- **Expo**
  - `easeInExpo`
  - `easeOutExpo`
  - `easeInOutExpo`
- **Circ**
  - `easeInCirc`
  - `easeOutCirc`
  - `easeInOutCirc`

### Advanced (9)

Easing functions that are not built in can pass functions directly.

```typescript
const scroller = new SweetScroll({
  easing: advancedEasingFunction,
});
```

#### Elastic

<details>
  <summary><code>easeInElastic</code></summary>

```typescript
const easeInElastic = (_, t, b, c, d) => {
  let s = 1.70158;
  let p = 0;
  let a = c;
  if (t === 0) return b;
  if ((t /= d) === 1) return b + c;
  if (!p) p = d * 0.3;
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = (p / (2 * Math.PI)) * asin(c / a);
  }
  return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b;
};
```

</details>

<details>
  <summary><code>easeOutElastic</code></summary>

```typescript
const easeOutElastic = (_, t, b, c, d) => {
  let s = 1.70158;
  let p = 0;
  let a = c;
  if (t === 0) return b;
  if ((t /= d) === 1) return b + c;
  if (!p) p = d * 0.3;
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = (p / (2 * Math.PI)) * asin(c / a);
  }
  return a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) + c + b;
};
```

</details>

<details>
  <summary><code>easeInOutElastic</code></summary>

```typescript
const easeInOutElastic = (_, t, b, c, d) => {
  let s = 1.70158;
  let p = 0;
  let a = c;
  if (t === 0) return b;
  if ((t /= d / 2) === 2) return b + c;
  if (!p) p = d * (0.3 * 1.5);
  if (a < Math.abs(c)) {
    a = c;
    s = p / 4;
  } else {
    s = (p / (2 * Math.PI)) * Math.asin(c / a);
  }
  if (t < 1) {
    return (
      -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p)) + b
    );
  }
  return (
    a * Math.pow(2, -10 * (t -= 1)) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) * 0.5 + c + b
  );
};
```

</details>

#### Back

<details>
  <summary><code>easeInBack</code></summary>

```typescript
const easeInBack = (_, t, b, c, d, s = 1.70158) => c * (t /= d) * t * ((s + 1) * t - s) + b;
```

</details>

<details>
  <summary><code>easeOutBack</code></summary>

```typescript
const easeOutBack = (_, t, b, c, d, s = 1.70158) =>
  c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
```

</details>

<details>
  <summary><code>easeInOutBack</code></summary>

```typescript
const easeInOutBack = (_, t, b, c, d, s = 1.70158) =>
  (t /= d / 2) < 1
    ? (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b
    : (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
```

</details>

#### Bounce

<details>
  <summary><code>easeOutBounce</code></summary>

```typescript
const easeOutBounce = (_, t, b, c, d) => {
  if ((t /= d) < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  } else if (t < 2 / 2.75) {
    return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
  } else if (t < 2.5 / 2.75) {
    return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
  }
  return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
};
```

</details>

<details>
  <summary><code>easeInBounce</code></summary>

```typescript
const easeOutBounce = (_, t, b, c, d) => {
  if ((t /= d) < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  } else if (t < 2 / 2.75) {
    return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
  } else if (t < 2.5 / 2.75) {
    return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
  }
  return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
};

const easeInBounce = (x, t, b, c, d) => c - easeOutBounce(x, d - t, 0, c, d) + b;
```

</details>

<details>
  <summary><code>easeInOutBounce</code></summary>

```typescript
const easeOutBounce = (_, t, b, c, d) => {
  if ((t /= d) < 1 / 2.75) {
    return c * (7.5625 * t * t) + b;
  } else if (t < 2 / 2.75) {
    return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
  } else if (t < 2.5 / 2.75) {
    return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
  }
  return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
};

const easeInBounce = (x, t, b, c, d) => c - easeOutBounce(x, d - t, 0, c, d) + b;

const easeInOutBounce = (x, t, b, c, d) =>
  t < d / 2
    ? easeInBounce(x, t * 2, 0, c, d) * 0.5 + b
    : easeOutBounce(x, t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
```

</details>

---

[Live demo](http://tsuyoshiwada.github.io/sweet-scroll/easings.html)

## Customizing Tips

### Specifying container elements

In the following example we have specified in the container for scrolling the `#container`.

```html
<div id="container">
  <a href="#heading2" data-scroll>Go to Heading2</a>
  ...
  <h2 id="heading2">Heading2</h2>
</div>
```

```typescript
// Specified in the CSS Selector
const scroller = new SweetScroll(
  {
    /* some options */
  },
  '#container',
);

// Specified in the Element
const scroller = new SweetScroll(
  {
    /* some options */
  },
  document.getElementById('container'),
);
```

### Specify fixed header

Add the `data-scroll-header` attribute in order to offset the height of the fixed header.

```html
<header data-scroll-header></header>
```

Specify the CSS Selector in `header` option instead of the `data-scroll-header` attribute.

```typescript
const scroller = new SweetScroll({
  header: '#header',
});
```

### Override of options for each element

You can override the default options by passing the option in `JSON` format to the `data-scroll-options`.

```html
<a href="#target" data-scroll data-scroll-options='{"easing": "easeOutExpo"}'>Go to Target</a>
```

### If you want to use in non anchor element

Will use the data-scroll attribute instead of href.

```html
<button type="button" data-scroll="+=500">Scroll under 500px</button>
```

### Scrolling animation in another page

The following, Introduce one of the mounting method.

```typescript
document.addEventListener(
  'DOMContentLoaded',
  () => {
    const scroller = new SweetScroll();
    const hash = window.location.hash;
    const needsInitialScroll = document.getElementById(hash.substr(1)) != null;

    if (needsInitialScroll) {
      window.location.hash = '';
    }

    window.addEventListener(
      'load',
      () => {
        if (needsInitialScroll) {
          scroller.to(hash, { updateURL: 'replace' });
        }
      },
      false,
    );
  },
  false,
);
```

[Live demo](http://tsuyoshiwada.github.io/sweet-scroll/initial-scroll.html#footer)

You can also achieve the same thing in other ways by using the provided API.

## API

### new SweetScroll(options?: PartialOptions, container?: string | Element | Window)

Will generate a SweetScroll instance.

**Example:**

```typescript
const scroller = new SweetScroll(
  {
    duration: 1200,
    easing: 'easeOutExpo',
  },
  '#container',
);
```

### SweetScroll.create(options?: PartialOptions, container?: string | Element | Window)

Will generate a SweetScroll instance. (factory method)

**Example:**

```typescript
const scroller = SweetScroll.create(
  {
    duration: 1200,
    easing: 'easeOutExpo',
  },
  '#container',
);
```

### to(distance: any, options?: PartialOptions)

Scroll animation to the specified `distance`.
`distance` to can specify the CSS Selector or scroll position.

**Example:**

```typescript
const scroller = new SweetScroll();

// CSS Selector of target element
scroller.to('#footer');

// Object
scroller.to({ top: 1000, left: 20 });

// Array (top:0, left:1000)
scroller.to([0, 1000]);

// Number (Priority to vertical scroll position. by default.)
scroller.to(500);

// String (Relative position)
scroller.to('+=500');
scroller.to('-=200');
```

### toTop(distance: any, options?: PartialOptions)

Vertical scroll animation to the specified `distance`.

**Example:**

```typescript
scroller.toTop(0);
```

### toLeft(distance: any, options?: PartialOptions)

Horizontal scroll animation to the specified `distance`.

**Example:**

```typescript
scroller.toLeft(1500);
```

### toElement(\$el: Element, options?: PartialOptions)

Scroll animation to the specified `Element`.

**Example:**

```typescript
scroller.toElement(document.getElementById('content'));
```

### update(options: PartialOptions)

Will update the SweetScroll instance.
Primarily used in the case of option update.

**Example:**

```typescript
scroller.update({
  trigger: 'a[href^="#"]',
  duration: 3000,
});
```

### stop(gotoEnd: boolean = true)

**gotoEnd: {Boolean}**

Will stop the current scroll animation.

**Example:**

```typescript
scroller.stop(true);
```

### destroy()

Will destroy the SweetScroll instance.
Disable of the method and event handler.

**Example:**

```typescript
scroller.destroy();
```

### Callbacks

In `before` and `after`, you will pass the coordinates and the triggering element in the argument.
In addition, you can stop the scrolling by return a `before` in `false`.

**Example:**

```typescript
const scroller = new SweetScroll({
  // Stop scrolling case of trigger element that contains the `is-disabled` class.
  before: (offset: Offset, $trigger: Element | null, scroller: SweetScroll): boolean | void => {
    console.log('Before!!', offset, scroller);
    if ($trigger && $trigger.classList.contains('is-disabled')) {
      return false;
    }
  },

  // If the `wheel` or `touchstart` event is called
  cancel: (scroller: SweetScroll): void => {
    console.log('Cancel!!', scroller);
  },

  // Scroll animation is complete
  after: (offset: Offset, $trigger: Element | null, scroller: SweetScroll): void => {
    console.log('After!!', offset, $trigger, scroller);
  },

  // Scroll animation is complete (`after` or `cancel`)
  complete: (isCancel: boolean, scroller: SweetScroll): void => {
    console.log('Complete!!', isCancel, scroller);
  },

  // Each animation frame
  step: (time: number, scroller: SweetScroll): void => {
    console.log('step', time, scroller);
  },
});
```

**Extends Class:**

The following is a pattern to override a method in the inheritance destination class.

```typescript
import SweetScroll, { Offset } from 'sweet-scroll';

class MyScroll extends SweetScroll {
  protected onBefore(offset: Offset, $trigger: Element | null): boolean | void {
    // Stop scrolling case of trigger element that contains the `is-disabled` class.
    console.log('Before!!', offset);
    if ($trigger && $trigger.classList.contains('is-disabled')) {
      return false;
    }
  }

  protected onCancel(): void {
    console.log('Canell!!');
  }

  protected onAfter(offset: Offset, $trigger: Element | null): void {
    console.log('After!!', offset, $trigger);
  }

  protected onComplete(isCancel: boolean): void {
    console.log('Complete!!', isCancel);
  }

  protected onStep(time: number): void {
    console.log('step', time);
  }
}
```

## Browser Support

Works in `IE10+`, and all modern browsers.

### Scrolling with IE9

It is necessary to use [polyfill](https://gist.github.com/paulirish/1579671) or ponyfill of `requestAnimationFrame`.

<details>
  <summary>Example ponyfill</summary>

Using [raf](https://github.com/chrisdickinson/raf) module.

```typescript
import raf from 'raf';
import SweetScroll from 'sweet-scroll';

SweetScroll.raf = raf;
SweetScroll.caf = raf.cancel;
```

</details>

## CHANGELOG

See the [CHANGELOG.md](./CHANGELOG.md)

## Contibute

1. Fork it!
1. Create your feature branch: `git checkout -b my-new-feature`
1. Commit your changes: `git commit -am 'Add some feature'`
1. Push to the branch: `git push origin my-new-feature`
1. Submit a pull request :muscle:

Bugs, feature requests and comments are more than welcome in the [issues](https://github.com/tsuyoshiwada/sweet-scroll/issues).

### Development

We will develop using the following npm scripts.

#### `yarn start`

Launch the local server and let the demo run. Opening http://localhost:3000 in your browser.

#### `yarn build`

Compile TypeScript and create type definitions.

#### `yarn test`

Run unit testing with Jest.

## License

[MIT © tsuyoshiwada](./LICENSE)
