import assert from "power-assert"
import SweetScroll from "../src/sweet-scroll"

describe("SweetScroll", () => {
  before(() => {
    document.body.innerHTML = window.__html__["test/fixtures/sweet-scroll.html"];
  });

  after(() => {
    document.body.innerHTML = "";
  });

  describe("Initialize", () => {
    it("Should not find container", () => {
      document.body.innerHTML = "";
      const sweetScroll = new SweetScroll({}, "#container");
      assert(sweetScroll.container === undefined);
    });

    it("Should be initialize module", () => {
      document.body.innerHTML = window.__html__["test/fixtures/sweet-scroll.html"];
      const sweetScroll = new SweetScroll({trigger: "a[href^='#']"}, "#container");
      assert(sweetScroll.container === document.querySelector("#container"));
    });
  });
});