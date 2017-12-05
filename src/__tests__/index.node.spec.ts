/* tslint:disable:no-console */
/* tslint:disable:max-classes-per-file */
import SweetScroll from '../index';

jest.useFakeTimers();

describe('SweetScroll', () => {
  it('Should not throw an error', () => {
    const ss = new SweetScroll();

    ss.to(1000);
    jest.runAllTimers();

    ss.to('#content01');
    jest.runAllTimers();

    ss.to([0, 100]);
    jest.runAllTimers();

    ss.to({ top: 100, left: 0 });
    jest.runAllTimers();

    ss.toTop(200);
    jest.runAllTimers();

    ss.toLeft(200);
    jest.runAllTimers();

    ss.toElement((null as any));
    jest.runAllTimers();

    ss.update({ duration: 1000 });

    ss.stop();

    ss.destroy();

    SweetScroll.create();

    expect(true).toBe(true);
  });
});
