# CHANGELOG

## 4.0.0

### Breaking changes

- Remove find of scrollabl elements logic.
- Change the default value of `container` from `body,html` to `window`.
  - If you specify `body,html`, it may cause unintended behaviors.
- Remove `quickMode` options.

### Bug fixes

- Fixed a performance problem in which unnecessary matching was execute in `onclick` handling.
  - Performance improves when there is a lot of DOM.

## 3.0.1

### Bug fixes

- Fix bug that did not scroll when opening devtools [#44](https://github.com/tsuyoshiwada/sweet-scroll/pull/44) (Resolves [#38](https://github.com/tsuyoshiwada/sweet-scroll/issues/38))
  - Big thanks :pray:
    - [@adamkarminski](https://github.com/adamkarminski)
    - [@amritk](https://github.com/amritk)
    - [@h6ah4i](https://github.com/h6ah4i)

## 3.0.0

TypeScript support and file size down are the main changes. `3.x` is a version that contains many destructive changes.

### New features

- Support TypeScript :tada:
- Reduce file size by 43.04% !
  - We reviewed many options and functions and cut unnecessary items.
- Add factory method (`SweetScroll.create(options?: PartialOptions, container?: string | Element)`)
  - This is useful if you do not like the coding style using `new` or you do not need to manage instances.

### Breaking changes

- IE9 was excluded from browser support
  - It can correspond by using polyfill of `requestAnimationFrame`.
- Remove options
  - `delay`
  - `outputLog`
- Rename options
  - `verticalScroll` -> `vertical`
  - `horizontalScroll` -> `horizontal`
  - `stopScroll` -> `cancellable`
  - `beforeScroll` -> `before`
  - `afterScroll` -> `after`
  - `canelScroll` -> `canel`
  - `completeScroll` -> `complete`
  - `stepScroll` -> `step`
- Remove easings (You can use the same easing by passing the function described in README instead.)
  - `easeInElastic`
  - `easeOutElastic`
  - `easeInOutElastic`
  - `easeInBack`
  - `easeOutBack`
  - `easeInOutBack`
  - `easeInBounce`
  - `easeOutBounce`
  - `easeInOutBounce`
- Remove `distance` argument pattern
  - Object like string (`top:0, left:100`)
- Rename callback methods
  - `beforeScroll` -> `onBefore`
  - `afterScroll` -> `onAfter`
  - `cancelScroll` -> `onCancel`
  - `completeScroll` -> `onComplete`
  - `stepScroll` -> `onStep`

### Minor changes

- Fixed headers can now be specified from elements. (`header`)
- Add an instance to the final argument to the optional callback.
  - It corresponds to a problem that can not refer to `this` when using arrow function.

## 2.2.0

- Support server-side rendering

## 2.1.0

### New feature

- Add `quickMode` options
  - Instantly scroll to the destination! (It's recommended to use it with `easeOutExpo`)

### Minor changes

- Update doc
- Update devDependencies

## 2.0.1

- Change to silent error if container element is not found. (Outputable with `outputLog` option)
- Minor change in log messages
- Fix demo page can't be viewed locally
- Add loging tests

## 2.0.0

### Breaking changes

Related issues [#31](https://github.com/tsuyoshiwada/sweet-scroll/issues/31). Thanks [@nickclaw](https://github.com/nickclaw)!!

- Need to initialize an instance after `DOMContentLoaded`. (So far it has been listening in the library.)
  - In many cases, since there is no need to be initialized before DOMContentLoaded.
- Removed `initialized` callback & method.
- Removed `searchContainerTimeout` options.

### Minor changes

- Update doc
- Update design of [demo page](http://tsuyoshiwada.github.io/sweet-scroll/)
- Update devDependencies
- Change some of output log
- Update some tests

## 1.1.0

- Add `searchContainerTimeout` options
  - We changed the find logic of container element. Because there is a possibility of Timeout Along with it was to add this option.
- Add `outputLog` options
  - In order to aid in debugging has been added the output of the warning log.
- Add `yarn.lock`
- Update devDependencies
- Fix some tests

## 1.0.4

- Fixed a bug related to the container. (ref: [#27](https://github.com/tsuyoshiwada/sweet-scroll/issues/27))

## 1.0.3

- Fix Chrome/Safari: scroll doesn't fire when browser zoom is less than 100% (ref: [#23](https://github.com/tsuyoshiwada/sweet-scroll/issues/23))

## 1.0.2

- Add this `CHANGELOG.md` (ref: [#21](https://github.com/tsuyoshiwada/sweet-scroll/issues/21))
- Change the distribution file in npm (limited to `src`, `test`, `sweet-scroll.js`, `sweet-scroll.min.js`)
- Update devDependencies

## 1.0.1

- Fix lint
- Update devDependencies

## 1.0.0

- Fix issue [#17](https://github.com/tsuyoshiwada/sweet-scroll/issues/17)
- Change to npm scripts from Gulp the development environment
- Update eslint config and fix lint
- Refactor for file size reduction.
- Published first major version!!

## 0.7.1

- Add `"push"`+`"replace"` to `updateURL` options

## 0.7.0

- Add `step` callback, and method

## 0.6.2

- Refactor for `initialized`

## 0.6.1

- Fix of viewport and element size
- Bugfix that value of the `data-options` do not receive
- Add fallback for `DOMContentLoaded` event
- Some rafactor

## 0.6.0

- Add `preventDefault` & `stopPropagation` options [#11](https://github.com/tsuyoshiwada/sweet-scroll/issues/11)

## 0.5.0

- Add `completeScroll` callback, and method
- Fix comparison of the instance type. `HTMLElement` -> `HTMLElement`
- Change before to after update url timing
- Bugfix that occur at the time of URL update of `file:` protocol.

## 0.4.0

- Add `updateURL` option

## 0.3.1

- Bugfix & Update tests
- Change the method of handling a `DOMContentLoaded`

## 0.3.0

- Add `initialized` callback, and method
- Change to initialization of an instance in async

## 0.2.5

- Refactor for file size reduction.
- Update LICENSE (copyright)

## 0.2.4

- Add Callback Method tests & refactor

## 0.2.3

- Add callback methods (`beforeScroll`, `cancelScroll`, `afterScroll`)

## 0.2.1, 0.2.2

- Fix coordinate calculation of data-scroll-header

## 0.2.0

- Add `toElement` method
- Some refactor

## 0.1.3

- Fix lint & Fix typo in docs

## 0.1.2

- Refactor

## 0.1.1

- Fix minimum value of `scrollTop` and `scrollLeft`

## 0.1.0

- Add update method
- Fix Scroll position bug, case of a fixed header specified
- Update passes the trigger elements to the callback

## 0.0.4

- Fix [#1](https://github.com/tsuyoshiwada/sweet-scroll/issues/1) horizontal scroll bug
- Update Specifies the container in the HTMLElement

## 0.0.3

- Fix get of scrollabel elements

## 0.0.2

- Add data options
- Add relative position syntax

## 0.0.1

- Published
