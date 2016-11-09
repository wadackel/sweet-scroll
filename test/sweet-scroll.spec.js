/* eslint-disable no-underscore-dangle, no-undefined, max-nested-callbacks, no-console */
import assert from "power-assert";
import sinon from "sinon";
import SweetScroll from "../src/sweet-scroll";


// Helpers
function trigger(el, type) {
  const e = document.createEvent("HTMLEvents");
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

function getInstance(options = {}, container = "#container") {
  return new SweetScroll(options, container);
}

function getContainer() {
  return document.querySelector("#container");
}


let clock = null;

describe("SweetScroll", () => {
  before(() => {
    clock = sinon.useFakeTimers();
  });

  after(() => {
    clock.restore();
  });

  beforeEach(() => {
    document.body.innerHTML = window.__html__["test/fixtures/sweet-scroll.html"];
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("Initialize", () => {
    it("Should not find container", () => {
      document.body.innerHTML = "";
      const scroller = getInstance();
      assert(scroller.container == null);
    });

    it("Should be initialize module", () => {
      const scroller = getInstance({ trigger: "a[href^='#']" });
      assert(scroller.container === getContainer());
    });

    it("Should be match specified container", () => {
      const scroller = getInstance({}, getContainer());
      assert(scroller.container === getContainer());
    });

    it("Should be parse the coodinate", () => {
      // Vertical and Horizontal
      const vh = getInstance({ verticalScroll: true, horizontalScroll: true });
      assert.deepEqual(vh.parseCoodinate({ top: 0, left: 0 }), { top: 0, left: 0 });
      assert.deepEqual(vh.parseCoodinate([1, 2]), { top: 1, left: 2 });
      assert.deepEqual(vh.parseCoodinate(140), { top: 140, left: 0 });
      assert.deepEqual(vh.parseCoodinate("200"), { top: 200, left: 0 });
      assert.deepEqual(vh.parseCoodinate("120,150"), { top: 120, left: 150 });
      assert.deepEqual(vh.parseCoodinate("120, 150"), { top: 120, left: 150 });
      assert.deepEqual(vh.parseCoodinate("top: 500, left: 10"), { top: 500, left: 10 });
      assert.deepEqual(vh.parseCoodinate("top:100, left:02"), { top: 100, left: 2 });
      assert(vh.parseCoodinate(null) == null);
      assert(vh.parseCoodinate(undefined) == null);

      // Vertical only
      const v = getInstance({ verticalScroll: true, horizontalScroll: false });
      assert.deepEqual(v.parseCoodinate(1200), { top: 1200, left: 0 });
      assert.deepEqual(v.parseCoodinate("200"), { top: 200, left: 0 });
      assert.deepEqual(v.parseCoodinate([30]), { top: 30, left: 0 });

      // Horizontal only
      const h = getInstance({ verticalScroll: false, horizontalScroll: true });
      assert.deepEqual(h.parseCoodinate(1200), { top: 0, left: 1200 });
      assert.deepEqual(h.parseCoodinate("200"), { top: 0, left: 200 });
      assert.deepEqual(h.parseCoodinate([30]), { top: 0, left: 30 });
    });

    describe("Should be parse the relative coodinate", () => {
      it("Vertical and Horizontal", () => {
        const scroller = getInstance({ verticalScroll: true, horizontalScroll: true });
        assert.deepEqual(scroller.parseCoodinate("+=100"), { top: 100, left: 0 });
        scroller.container.scrollTop = 100;
        assert.deepEqual(scroller.parseCoodinate("+=100"), { top: 200, left: 0 });
        scroller.container.scrollTop = 200;
        assert.deepEqual(scroller.parseCoodinate("-=50"), { top: 150, left: 0 });
        scroller.container.scrollTop = 150;
        assert.deepEqual(scroller.parseCoodinate("-=50"), { top: 100, left: 0 });
      });

      it("Vertical only", () => {
        const scroller = getInstance({ verticalScroll: true, horizontalScroll: false });
        assert.deepEqual(scroller.parseCoodinate("+=100"), { top: 100, left: 0 });
        scroller.container.scrollTop = 100;
        assert.deepEqual(scroller.parseCoodinate("+=100"), { top: 200, left: 0 });
        scroller.container.scrollTop = 200;
        assert.deepEqual(scroller.parseCoodinate("-=50"), { top: 150, left: 0 });
        scroller.container.scrollTop = 150;
        assert.deepEqual(scroller.parseCoodinate("-=50"), { top: 100, left: 0 });
      });

      it("Horizontal only", () => {
        const scroller = getInstance({ verticalScroll: false, horizontalScroll: true });
        assert.deepEqual(scroller.parseCoodinate("+=100"), { top: 0, left: 100 });
        scroller.container.scrollLeft = 100;
        assert.deepEqual(scroller.parseCoodinate("+=100"), { top: 0, left: 200 });
        scroller.container.scrollLeft = 200;
        assert.deepEqual(scroller.parseCoodinate("-=50"), { top: 0, left: 150 });
        scroller.container.scrollLeft = 150;
        assert.deepEqual(scroller.parseCoodinate("-=50"), { top: 0, left: 100 });
      });
    });
  });

  describe("Update", () => {
    it("Should be option updated", () => {
      const scroller = getInstance({
        easing: "linear",
        duration: 1000,
        offset: -10
      });

      assert(scroller.options.easing === "linear");
      scroller.update({ easing: "easeOutExpo" });
      assert(scroller.options.easing === "easeOutExpo");

      assert(scroller.options.duration === 1000);
      scroller.update({ duration: 1500 });
      assert(scroller.options.duration === 1500);

      assert(scroller.options.offset === -10);
      scroller.update({ offset: 0 });
      assert(scroller.options.offset === 0);
    });
  });

  describe("Callbacks", () => {
    it("Should be run beforeScroll", done => {
      const scroller = getInstance({ beforeScroll(toScroll) {
        assert(toScroll.top === 100);
        assert(toScroll.left === 0);
        done();
      } });
      scroller.to(100);
    });

    it("Should be run afterScroll", done => {
      const scroller = getInstance({
        afterScroll(toScroll) {
          assert(toScroll.top === 500);
          assert(toScroll.left === 0);
          done();
        }
      });
      scroller.to(500);
      clock.tick(1000);
    });

    it("Should be run cancelScroll", done => {
      const $container = getContainer();
      const scroller = getInstance({ cancelScroll: done });
      scroller.to(1200);
      clock.tick(500);
      trigger($container, "touchstart");
    });

    it("Should be run completeScroll (isCancel=false)", done => {
      const scroller = getInstance({
        completeScroll(isCancel) {
          assert(isCancel === false);
          done();
        }
      });
      scroller.to(1200);
      clock.tick(1000);
    });

    it("Should be run completeScroll (isCancel=true)", done => {
      const $container = getContainer();
      const scroller = getInstance({
        completeScroll(isCancel) {
          assert(isCancel === true);
          done();
        }
      });
      scroller.to(1200);
      clock.tick(500);
      trigger($container, "touchstart");
    });
  });

  describe("Callback Methods", () => {
    it("Should be run beforeScroll", done => {
      class MyScroll extends SweetScroll {
        beforeScroll(toScroll) {
          assert(toScroll.top === 100);
          assert(toScroll.left === 0);
          done();
        }
      }
      const myScroll = new MyScroll({}, "#container");
      myScroll.to(100);
    });

    it("Should be run afterScroll", done => {
      class MyScroll extends SweetScroll {
        afterScroll(toScroll) {
          assert(toScroll.top === 500);
          assert(toScroll.left === 0);
          done();
        }
      }
      const myScroll = new MyScroll({}, "#container");
      myScroll.to(500);
      clock.tick(1000);
    });

    it("Should be run cancelScroll", done => {
      class MyScroll extends SweetScroll {
        cancelScroll() {
          done();
        }
      }
      const $container = getContainer();
      const myScroll = new MyScroll({}, "#container");
      myScroll.to(1200);
      clock.tick(500);
      trigger($container, "touchstart");
    });

    it("Should be run completeScroll(isCancel=false)", done => {
      class MyScroll extends SweetScroll {
        completeScroll(isCancel) {
          assert(isCancel === false);
          done();
        }
      }
      const myScroll = new MyScroll({}, "#container");
      myScroll.to(1200);
      clock.tick(1000);
    });

    it("Should be run completeScroll(isCancel=true)", done => {
      class MyScroll extends SweetScroll {
        completeScroll(isCancel) {
          assert(isCancel === true);
          done();
        }
      }
      const $container = getContainer();
      const myScroll = new MyScroll({}, "#container");
      myScroll.to(1200);
      clock.tick(500);
      trigger($container, "touchstart");
    });
  });

  describe("Click of Anchor", () => {
    const triggerAnchorSelector = "a[href^='#']";

    function getAnchor() {
      return document.querySelector("a[href='#content01']");
    }

    it("Should be run beforeScroll", done => {
      getInstance({ trigger: triggerAnchorSelector, beforeScroll: () => done() });
      trigger(getAnchor(), "click");
      clock.tick(1000);
    });

    it("Should be run afterScroll", done => {
      getInstance({ trigger: triggerAnchorSelector, afterScroll: () => done() });
      trigger(getAnchor(), "click");
      clock.tick(1000);
    });

    it("Should be run cancelScroll", done => {
      const $container = getContainer();
      getInstance({ trigger: triggerAnchorSelector, cancelScroll: () => done() });
      trigger(getAnchor(), "click");
      clock.tick(500);
      trigger($container, "touchstart");
    });

    it("Should be run completeScroll", done => {
      getInstance({ trigger: triggerAnchorSelector, completeScroll: () => done() });
      trigger(getAnchor(), "click");
      clock.tick(1000);
    });
  });

  describe("Keep silent on error", () => {
    beforeEach(() => {
      sinon.spy(console, "error");
      document.body.innerHTML = "";
    });

    afterEach(() => {
      console.error.restore();
    });

    it("constructor", () => {
      getInstance({ outputLog: false });
      assert(console.error.called === false);
    });

    it("to()", () => {
      const scroller = getInstance({ outputLog: false });
      scroller.to("+=100");
      assert(console.error.called === false);
    });

    it("toTop()", () => {
      const scroller = getInstance({ outputLog: false });
      scroller.toTop(0);
      assert(console.error.called === false);
    });

    it("toElement()", () => {
      const scroller = getInstance({ outputLog: false });
      scroller.toElement(document.body);
      assert(console.error.called === false);
    });

    it("update()", () => {
      const scroller = getInstance({ outputLog: false });
      scroller.update({ stopScroll: false });
      assert(console.error.called === false);
    });

    it("stop()", () => {
      const scroller = getInstance({ outputLog: false });
      scroller.stop(true);
      assert(console.error.called === false);
    });

    it("destroy()", () => {
      const scroller = getInstance({ outputLog: false });
      scroller.destroy();
      assert(console.error.called === false);
    });
  });

  describe("Output error log", () => {
    beforeEach(() => {
      sinon.spy(console, "error");
      document.body.innerHTML = "";
    });

    afterEach(() => {
      console.error.restore();
    });

    it("constructor", () => {
      getInstance({ outputLog: true });
      assert(console.error.called === true);
    });

    it("to()", () => {
      const scroller = getInstance({ outputLog: true });
      scroller.to("+=100");
      assert(console.error.called === true);
    });

    it("toTop()", () => {
      const scroller = getInstance({ outputLog: true });
      scroller.toTop(0);
      assert(console.error.called === true);
    });

    it("toElement()", () => {
      const scroller = getInstance({ outputLog: true });
      scroller.toElement(document.body);
      assert(console.error.called === true);
    });

    it("update()", () => {
      const scroller = getInstance({ outputLog: true });
      scroller.update({ stopScroll: false });
      assert(console.error.called === true);
    });

    it("stop()", () => {
      const scroller = getInstance({ outputLog: true });
      scroller.stop(true);
      assert(console.error.called === true);
    });

    it("destroy()", () => {
      const scroller = getInstance({ outputLog: true });
      scroller.destroy();
      assert(console.error.called === true);
    });
  });
});
