# Migration Guide

## Table of Contents

- [From version 3 to 4](#from-version-3-to-4)
  - [Change behavior of find scrollable element](#change-behavior-of-find-scrollable-element)
  - [Remove `quickMode`](#remove-quickmode)

## From version 3 to 4

`sweet-scroll@4` contains several breaking changes. If you are considering migration from v3, please refer to this document.

### Change behavior of find scrollable element

Previously, we had logic to find scrollable element from the selector or element specified in `container` argument. However, due to this logic, we could develop into unexpected behavior.

```typescript
// ~ v3
SweetScroll.create({}, 'body,html');
// document.body or document.documentElement

// v4
SweetScroll.create({}, window);
```

From v4 we changed the element specified as `container` to logic that we use unconditionally.

If you specify `body,html`,

**Please specify `window` when scrolling the whole page.**

Well, this change has the following advantages.

- Constructor performance improvement
- Abolition of implicit behavior
- (A little bit) Reducing the amount of code

### Remove `quickMode`

We removed `quickMode` as it is less necessary and can be expressed in other ways, such as a custom easing function as needed.
