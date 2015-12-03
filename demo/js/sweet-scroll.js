/*!
 * sweet-scroll
 * Modern and the sweet smooth scroll library.
 * 
 * @author tsuyoshiwada
 * @homepage https://github.com/tsuyoshiwada/sweet-scroll
 * @license MIT
 * @version 0.0.1
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.SweetScroll = factory();
}(this, function () { 'use strict';

  class SweetScroll {
    static initialize() {}

    static destroy() {}

    static to() {}
  }

  return SweetScroll;

}));