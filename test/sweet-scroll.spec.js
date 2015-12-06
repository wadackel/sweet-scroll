import assert from "power-assert"
import SweetScroll from "../src/sweet-scroll"

describe("SweetScroll", () => {
  before(() => {
    document.body.innerHTML = window.__html__["test/fixtures/sweet-scroll.html"]
  });

  after(() => {
    document.body.innerHTML = "";
  });

  describe("Initialize", () => {
    it("Should be initialize module", () => {
      const sweetScroll = new SweetScroll();
      console.log(sweetScroll.container);
      assert(sweetScroll);
      // assert(sweetScroll.container === document.body || sweetScroll.container === document.documentElement);
    });
  });
});