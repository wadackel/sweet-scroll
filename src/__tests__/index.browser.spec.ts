/* tslint:disable:no-console */
/* tslint:disable:max-classes-per-file */
import SweetScroll, { Offset } from '../index';
import { fixture } from './fixture';
import { $ } from '../dom/selectors';

jest.useFakeTimers();

const trigger = ($el: Element, eventName: string): void => {
  const e = document.createEvent('HTMLEvents');
  e.initEvent(eventName, true, true);
  $el.dispatchEvent(e);
};

const getContainer = () => ($('#container') as Element);
const context = (ss: any): any => ss.ctx;

describe('SweetScroll#Browser', () => {
  beforeEach(() => {
    document.body.innerHTML = fixture;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Helpers', () => {
    it('Should be works', () => {
      expect(getContainer() instanceof Element).toBe(true);
    });
  });

  describe('Initialize', () => {
    it('Should be initialize', () => {
      const $el = getContainer();
      const ss = new SweetScroll({}, '#container');
      expect((ss as any).$el).toBe($el);
    });

    it('Should be match specified container element', () => {
      const $el = getContainer();
      const ss = new SweetScroll({}, $el);
      expect((ss as any).$el).toBe($el);
    });

    it('Should not be find container element', () => {
      const ss = new SweetScroll({}, '#notfoundelement');
      expect((ss as any).$el).toBeFalsy();
    });

    it('Should be override default options', () => {
      const $el = getContainer();
      let opts: any;

      opts = (new SweetScroll({}, $el) as any).opts;
      expect(opts.duration).toBe(1000);
      expect(opts.cancellable).toBe(true);

      opts = (new SweetScroll({ duration: 200, cancellable: false }, $el) as any).opts;
      expect(opts.duration).toBe(200);
      expect(opts.cancellable).toBe(false);
    });

    it('Should be create instance', () => {
      expect(SweetScroll.create() instanceof SweetScroll);
      expect(SweetScroll.create({ duration: 2000 }) instanceof SweetScroll);
      expect(SweetScroll.create({}, '#container') instanceof SweetScroll);
    });
  });

  describe('to()', () => {
    it('Should be handled', () => {
      const ss = new SweetScroll({}, getContainer());
      expect(context(ss).progress).toBe(false);
      ss.to('#content01');
      expect(context(ss).progress).toBe(true);
      jest.runAllTimers();
      expect(context(ss).progress).toBe(false);
    });

    it('Should not be handled', () => {
      const ss = new SweetScroll({}, '#notfound');
      expect(context(ss).progress).toBe(false);
      ss.to('#content01');
      expect(context(ss).progress).toBe(false);
      jest.runAllTimers();
      expect(context(ss).progress).toBe(false);
    });

    it('Should be use current options + method options', () => {
      const ss = new SweetScroll({
        duration: 1,
        vertical: true,
        horizontal: true,
      }, getContainer());

      expect((ss as any).opts.duration).toBe(1);
      expect((ss as any).opts.vertical).toBe(true);
      expect((ss as any).opts.horizontal).toBe(true);

      ss.to('#content01', {
        duration: 2,
        vertical: false,
      });

      expect((ss as any).opts.duration).toBe(1);
      expect((ss as any).opts.vertical).toBe(true);
      expect((ss as any).opts.horizontal).toBe(true);

      expect(context(ss).opts.duration).toBe(2);
      expect(context(ss).opts.vertical).toBe(false);
      expect(context(ss).opts.horizontal).toBe(true);
    });
  });

  describe('toTop()', () => {
    it('Should be vertical only', () => {
      const ss = new SweetScroll({ vertical: false, horizontal: true }, getContainer());
      ss.toTop('#content01');
      expect(context(ss).opts.vertical).toBe(true);
      expect(context(ss).opts.horizontal).toBe(false);
    });
  });

  describe('toLeft()', () => {
    it('Should be vertical only', () => {
      const ss = new SweetScroll({ vertical: true, horizontal: false }, getContainer());
      ss.toLeft('#content01');
      expect(context(ss).opts.vertical).toBe(false);
      expect(context(ss).opts.horizontal).toBe(true);
    });
  });

  describe('stop()', () => {
    it('Should be stop current scrolling animation', () => {
      const ss = new SweetScroll({}, getContainer());
      expect(context(ss).progress).toBe(false);
      ss.to(100);
      expect(context(ss).progress).toBe(true);
      ss.stop();
      expect(context(ss).progress).toBe(false);
    });
  });

  describe('update()', () => {
    it('Should be update options', () => {
      const ss = new SweetScroll({
        duration: 2000,
        cancellable: false,
        easing: 'linear',
      }, getContainer());

      ss.update({
        duration: 10,
        cancellable: true,
        easing: 'easeOutExpo',
      });

      const opts = (ss as any).opts;
      expect(opts.duration).toBe(10);
      expect(opts.cancellable).toBe(true);
      expect(opts.easing).toBe('easeOutExpo');
    });
  });

  describe('Callback options', () => {
    it('Should be call before callback', () => {
      const before = jest.fn();
      const ss = new SweetScroll({ before }, getContainer());

      expect(before.mock.calls.length).toBe(0);

      ss.to(1000);

      expect(before.mock.calls.length).toBe(1);
      expect(before.mock.calls[0]).toEqual([
        { top: 0, left: 0, relative: false },
        null,
        ss,
      ]);
    });

    it('Should be call after and complete callback', () => {
      const after = jest.fn();
      const complete = jest.fn();
      const ss = new SweetScroll({ after, complete }, getContainer());

      expect(after.mock.calls.length).toBe(0);
      expect(complete.mock.calls.length).toBe(0);

      ss.to(1000);

      expect(after.mock.calls.length).toBe(0);
      expect(complete.mock.calls.length).toBe(0);

      jest.runAllTimers();

      expect(after.mock.calls.length).toBe(1);
      expect(after.mock.calls[0]).toEqual([
        { top: 0, left: 0, relative: false },
        null,
        ss,
      ]);

      expect(complete.mock.calls.length).toBe(1);
      expect(complete.mock.calls[0]).toEqual([false, ss]);
    });

    it('Should be call canel and complete callback', () => {
      const $container = getContainer();
      const cancel = jest.fn();
      const complete = jest.fn();
      const ss = new SweetScroll({ cancel, complete }, $container);

      expect(cancel.mock.calls.length).toBe(0);

      ss.to(1000);
      jest.runAllTimers();

      expect(cancel.mock.calls.length).toBe(0);
      expect(complete.mock.calls.length).toBe(1);
      expect(complete.mock.calls[0]).toEqual([false, ss]);

      ss.to(1000);
      trigger($container, 'wheel');

      expect(cancel.mock.calls.length).toBe(1);
      expect(cancel.mock.calls[0]).toEqual([ss]);

      expect(complete.mock.calls.length).toBe(2);
      expect(complete.mock.calls[1]).toEqual([true, ss]);
    });

    it('Should be call step callback', () => {
      const step = jest.fn();
      const ss = new SweetScroll({ step }, getContainer());

      ss.to(1000);

      jest.runOnlyPendingTimers();
      expect(step.mock.calls.length).toBe(1);
      expect(step.mock.calls[0][1]).toEqual(ss);

      jest.runOnlyPendingTimers();
      expect(step.mock.calls.length).toBe(2);
      expect(step.mock.calls[1][1]).toEqual(ss);

      jest.runOnlyPendingTimers();
      expect(step.mock.calls.length).toBe(3);
      expect(step.mock.calls[2][1]).toEqual(ss);
    });
  });

  describe('Callback methods', () => {
    it('Should be call onBefore callback method', () => {
      const before: any[] = [];

      class MyScroller extends SweetScroll {
        protected onBefore(offset: Offset, $trigger: Element | null): boolean | void {
          before.push([offset, $trigger]);
        }
      }

      const ss = new MyScroller({}, getContainer());

      expect(before.length).toBe(0);

      ss.to(1000);

      expect(before.length).toBe(1);
      expect(before[0]).toEqual([
        { top: 0, left: 0, relative: false },
        null,
      ]);
    });

    it('Should be call onAfter and onComplete callback method', () => {
      const after: any[] = [];
      const complete: any[] = [];

      class MyScroller extends SweetScroll {
        protected onAfter(offset: Offset, $trigger: Element | null): void {
          after.push([offset, $trigger]);
        }

        protected onComplete(cancel: boolean): void {
          complete.push([cancel]);
        }
      }

      const ss = new MyScroller({}, getContainer());

      expect(after.length).toBe(0);
      expect(complete.length).toBe(0);

      ss.to(1000);

      expect(after.length).toBe(0);
      expect(complete.length).toBe(0);

      jest.runAllTimers();

      expect(after.length).toBe(1);
      expect(after[0]).toEqual([
        { top: 0, left: 0, relative: false },
        null,
      ]);

      expect(complete.length).toBe(1);
      expect(complete[0]).toEqual([false]);
    });

    it('Should be call onCancel and onComplete callback method', () => {
      const $container = getContainer();
      const cancel: any[] = [];
      const complete: any[] = [];

      class MyScroller extends SweetScroll {
        protected onCancel(): void {
          cancel.push([]);
        }

        protected onComplete(isCancel: boolean): void {
          complete.push([isCancel]);
        }
      }

      const ss = new MyScroller({}, $container);

      expect(cancel.length).toBe(0);
      expect(complete.length).toBe(0);

      ss.to(1000);

      expect(cancel.length).toBe(0);
      expect(complete.length).toBe(0);

      jest.runAllTimers();

      expect(cancel.length).toBe(0);
      expect(complete.length).toBe(1);
      expect(complete[0]).toEqual([false]);

      ss.to(1000);
      trigger($container, 'wheel');

      expect(cancel.length).toBe(1);
      expect(complete.length).toBe(2);
      expect(complete[1]).toEqual([true]);
    });

    it('Should be call onStep callback method', () => {
      const step: any[] = [];

      class MyScroller extends SweetScroll {
        protected onStep(time: number): void {
          step.push([time]);
        }
      }

      const ss = new MyScroller({}, getContainer());

      expect(step.length).toBe(0);

      ss.to(1000);
      expect(step.length).toBe(0);

      jest.runOnlyPendingTimers();
      expect(step.length).toBe(1);

      jest.runOnlyPendingTimers();
      expect(step.length).toBe(2);

      jest.runOnlyPendingTimers();
      expect(step.length).toBe(3);
    });
  });

  describe('Handle click of trigger element', () => {
    it('Should be handle click event', () => {
      const $link = (document.querySelector('[href="#content01"]') as Element);
      const ss = new SweetScroll({ trigger: 'a[href^="#"]' }, getContainer());
      expect((ss as any).ctx.$trigger).not.toBe($link);
      trigger($link, 'click');
      expect((ss as any).ctx.$trigger).toBe($link);
    });
  });
});
