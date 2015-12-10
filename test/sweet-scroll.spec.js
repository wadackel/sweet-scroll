import assert from "power-assert"
import SweetScroll from "../src/sweet-scroll"

// Helpers
function trigger(el, type) {
  let e = document.createEvent("HTMLEvents");
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

function getInstance(options = {}) {
  return new SweetScroll(options, "#container");
}

function getContainer() {
  return document.querySelector("#container");
}


describe("SweetScroll", () => {
  beforeEach(() => {
    document.body.innerHTML = window.__html__["test/fixtures/sweet-scroll.html"];
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("Initialize", () => {
    it("Should not find container", () => {
      document.body.innerHTML = "";
      const sweetScroll = getInstance();
      assert(sweetScroll.container === undefined);
    });

    it("Should be initialize module", () => {
      const sweetScroll = getInstance({trigger: "a[href^='#']"});
      assert(sweetScroll.container === getContainer());
    });

    it("Should be parse the coodinate", () => {
      // Vertical and Horizontal
      const vh = getInstance({verticalScroll: true, horizontalScroll: true});
      assert.deepEqual(vh._parseCoodinate({top: 0, left: 0}), {top: 0, left: 0});
      assert.deepEqual(vh._parseCoodinate([1, 2]), {top: 1, left: 2});
      assert.deepEqual(vh._parseCoodinate(140), {top: 140, left: 0});
      assert.deepEqual(vh._parseCoodinate("200"), {top: 200, left: 0});
      assert.deepEqual(vh._parseCoodinate("120,150"), {top: 120, left: 150});
      assert.deepEqual(vh._parseCoodinate("120, 150"), {top: 120, left: 150});
      assert.deepEqual(vh._parseCoodinate("top: 500, left: 10"), {top: 500, left: 10});
      assert.deepEqual(vh._parseCoodinate("top:100, left:02"), {top: 100, left: 2});
      assert(vh._parseCoodinate(null) == null);
      assert(vh._parseCoodinate(undefined) == null);

      // Vertical only
      const v = getInstance({verticalScroll: true, horizontalScroll: false});
      assert.deepEqual(v._parseCoodinate(1200), {top: 1200, left: 0});
      assert.deepEqual(v._parseCoodinate("200"), {top: 200, left: 0});
      assert.deepEqual(v._parseCoodinate([30]), {top: 30, left: 0});

      // Horizontal only
      const h = getInstance({verticalScroll: false, horizontalScroll: true});
      assert.deepEqual(h._parseCoodinate(1200), {top: 0, left: 1200});
      assert.deepEqual(h._parseCoodinate("200"), {top: 0, left: 200});
      assert.deepEqual(h._parseCoodinate([30]), {top: 0, left: 30});
    });
  });

  describe("Callbacks", () => {
    it("Should be run beforeScroll", (done) => {
      const sweetScroll = getInstance({beforeScroll: (scroll) => {
        assert(scroll.top === 100);
        assert(scroll.left === 0);
        done();
      }});
      sweetScroll.to(100);
    });

    it("Should be run afterScroll", (done) => {
      const sweetScroll = getInstance({afterScroll: (scroll) => {
        assert(scroll.top === 500);
        assert(scroll.left === 0);
        done();
      }});
      sweetScroll.to(500);
    });

    it("Should be run cancelScroll", (done) => {
      const $container = getContainer();
      const sweetScroll = getInstance({cancelScroll: done});
      sweetScroll.to(1200);
      setTimeout(() => {
        trigger($container, "touchstart");
      }, 500);
    });
  });

  describe("Click of Anchor", () => {
    const triggerAnchorSelector = "a[href^='#']";

    function getAnchor() {
      return document.querySelector("a[href='#content01']");
    }

    it("Should be run beforeScroll", (done) => {
      getInstance({trigger: triggerAnchorSelector, beforeScroll: () => done()});
      trigger(getAnchor(), "click");
    });

    it("Should be run afterScroll", (done) => {
      getInstance({trigger: triggerAnchorSelector, afterScroll: () => done()});
      trigger(getAnchor(), "click");
    });

    it("Should be run cancelScroll", (done) => {
      const $container = getContainer();
      getInstance({trigger: triggerAnchorSelector, cancelScroll: () => done()});
      trigger(getAnchor(), "click");
      setTimeout(() => {
        trigger($container, "touchstart");
      }, 500);
    });
  });
});