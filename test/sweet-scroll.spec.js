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
    it("Should not find container", (done) => {
      document.body.innerHTML = "";
      getInstance({
        initialized() {
          assert(this.container === undefined);
          done();
        }
      });
    });

    it("Should be initialize module", (done) => {
      getInstance({
        trigger: "a[href^='#']",
        initialized() {
          assert(this.container === getContainer());
          done();
        }
      });
    });

    it("Should be match specified container", (done) => {
      getInstance({
        initialized() {
          assert(this.container === getContainer());
          done();
        }
      }, getContainer());
    });

    it("Should be parse the coodinate", () => {
      // Vertical and Horizontal
      const vh = getInstance({verticalScroll: true, horizontalScroll: true});
      assert.deepEqual(vh.parseCoodinate({top: 0, left: 0}), {top: 0, left: 0});
      assert.deepEqual(vh.parseCoodinate([1, 2]), {top: 1, left: 2});
      assert.deepEqual(vh.parseCoodinate(140), {top: 140, left: 0});
      assert.deepEqual(vh.parseCoodinate("200"), {top: 200, left: 0});
      assert.deepEqual(vh.parseCoodinate("120,150"), {top: 120, left: 150});
      assert.deepEqual(vh.parseCoodinate("120, 150"), {top: 120, left: 150});
      assert.deepEqual(vh.parseCoodinate("top: 500, left: 10"), {top: 500, left: 10});
      assert.deepEqual(vh.parseCoodinate("top:100, left:02"), {top: 100, left: 2});
      assert(vh.parseCoodinate(null) == null);
      assert(vh.parseCoodinate(undefined) == null);

      // Vertical only
      const v = getInstance({verticalScroll: true, horizontalScroll: false});
      assert.deepEqual(v.parseCoodinate(1200), {top: 1200, left: 0});
      assert.deepEqual(v.parseCoodinate("200"), {top: 200, left: 0});
      assert.deepEqual(v.parseCoodinate([30]), {top: 30, left: 0});

      // Horizontal only
      const h = getInstance({verticalScroll: false, horizontalScroll: true});
      assert.deepEqual(h.parseCoodinate(1200), {top: 0, left: 1200});
      assert.deepEqual(h.parseCoodinate("200"), {top: 0, left: 200});
      assert.deepEqual(h.parseCoodinate([30]), {top: 0, left: 30});
    });

    describe("Should be parse the relative coodinate", () => {
      it("Vertical and Horizontal", () => {
        const sweetScroll = getInstance({verticalScroll: true, horizontalScroll: true});
        assert.deepEqual(sweetScroll.parseCoodinate("+=100"), {top: 100, left: 0});
        sweetScroll.container.scrollTop = 100;
        assert.deepEqual(sweetScroll.parseCoodinate("+=100"), {top: 200, left: 0});
        sweetScroll.container.scrollTop = 200;
        assert.deepEqual(sweetScroll.parseCoodinate("-=50"), {top: 150, left: 0});
        sweetScroll.container.scrollTop = 150;
        assert.deepEqual(sweetScroll.parseCoodinate("-=50"), {top: 100, left: 0});
      });

      it("Vertical only", () => {
        const sweetScroll = getInstance({verticalScroll: true, horizontalScroll: false});
        assert.deepEqual(sweetScroll.parseCoodinate("+=100"), {top: 100, left: 0});
        sweetScroll.container.scrollTop = 100;
        assert.deepEqual(sweetScroll.parseCoodinate("+=100"), {top: 200, left: 0});
        sweetScroll.container.scrollTop = 200;
        assert.deepEqual(sweetScroll.parseCoodinate("-=50"), {top: 150, left: 0});
        sweetScroll.container.scrollTop = 150;
        assert.deepEqual(sweetScroll.parseCoodinate("-=50"), {top: 100, left: 0});
      });

      it("Horizontal only", () => {
        const sweetScroll = getInstance({verticalScroll: false, horizontalScroll: true});
        assert.deepEqual(sweetScroll.parseCoodinate("+=100"), {top: 0, left: 100});
        sweetScroll.container.scrollLeft = 100;
        assert.deepEqual(sweetScroll.parseCoodinate("+=100"), {top: 0, left: 200});
        sweetScroll.container.scrollLeft = 200;
        assert.deepEqual(sweetScroll.parseCoodinate("-=50"), {top: 0, left: 150});
        sweetScroll.container.scrollLeft = 150;
        assert.deepEqual(sweetScroll.parseCoodinate("-=50"), {top: 0, left: 100});
      });
    });
  });

  describe("Update", () => {
    it("Should be option updated", () => {
      const sweetScroll = getInstance({
        easing: "linear",
        duration: 1000,
        offset: -10
      });

      assert(sweetScroll.options.easing === "linear");
      sweetScroll.update({easing: "easeOutExpo"});
      assert(sweetScroll.options.easing === "easeOutExpo");

      assert(sweetScroll.options.duration === 1000);
      sweetScroll.update({duration: 1500});
      assert(sweetScroll.options.duration === 1500);

      assert(sweetScroll.options.offset === -10);
      sweetScroll.update({offset: 0});
      assert(sweetScroll.options.offset === 0);
    });
  });

  describe("Callbacks", () => {
    it("Should be run beforeScroll", (done) => {
      const sweetScroll = getInstance({beforeScroll(toScroll) {
        assert(toScroll.top === 100);
        assert(toScroll.left === 0);
        done();
      }});
      sweetScroll.to(100);
    });

    it("Should be run afterScroll", (done) => {
      const sweetScroll = getInstance({afterScroll(toScroll) {
        assert(toScroll.top === 500);
        assert(toScroll.left === 0);
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

  describe("Callback Methods", () => {
    it("Should be run beforeScroll", (done) => {
      class MyScroll extends SweetScroll {
        beforeScroll(toScroll, trigger) {
          assert(toScroll.top === 100);
          assert(toScroll.left === 0);
          done();
        }
      }
      const myScroll = new MyScroll({}, "#container");
      myScroll.to(100);
    });

    it("Should be run afterScroll", (done) => {
      class MyScroll extends SweetScroll {
        afterScroll(toScroll, trigger) {
          assert(toScroll.top === 500);
          assert(toScroll.left === 0);
          done();
        }
      }
      const myScroll = new MyScroll({}, "#container");
      myScroll.to(500);
    });

    it("Should be run cancelScroll", (done) => {
      class MyScroll extends SweetScroll {
        cancelScroll() {
          done();
        }
      }
      const $container = getContainer();
      const myScroll = new MyScroll({}, "#container");
      myScroll.to(1200);
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
