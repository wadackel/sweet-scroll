import { parseCoordinate } from '../coordinate';

describe('Coordinate', () => {
  it('Should be parse coordinates', () => {
    const table: any[] = [
      // Object
      [
        [{ top: 10, left: 20 }, true],
        { top: 10, left: 20, relative: false },
      ],
      [
        [{ top: 10 }, true],
        { top: 10, left: 0, relative: false },
      ],
      [
        [{ left: 10 }, true],
        { top: 0, left: 10, relative: false },
      ],
      [
        [{}, true],
        null,
      ],

      // Array
      [
        [[100, 200], true],
        { top: 100, left: 200, relative: false },
      ],
      [
        [[300], true],
        { top: 300, left: 0, relative: false },
      ],
      [
        [[300], false],
        { top: 0, left: 300, relative: false },
      ],
      [
        [[1, 2, 3, 4, 5], true],
        { top: 1, left: 2, relative: false },
      ],
      [
        [[], true],
        null,
      ],
      [
        ['250', true],
        { top: '250', left: 0, relative: false },
      ],
      [
        ['250', false],
        { top: 0, left: '250', relative: false },
      ],

      // Number
      [
        [100, true],
        { top: 100, left: 0, relative: false },
      ],
      [
        [100, false],
        { top: 0, left: 100, relative: false },
      ],

      // String
      [
        ['+=100', true],
        { top: 100, left: 0, relative: true },
      ],
      [
        ['+=100', false],
        { top: 0, left: 100, relative: true },
      ],
      [
        ['-=100', true],
        { top: -100, left: 0, relative: true },
      ],
      [
        ['-=100', false],
        { top: 0, left: -100, relative: true },
      ],
      [
        ['+=100.23', true],
        { top: 100, left: 0, relative: true },
      ],
      [
        ['+=203.8221', true],
        { top: 203, left: 0, relative: true },
      ],
      [
        ['+=100.00.000', true],
        null,
      ],
      [
        ['-=100.00.000', true],
        null,
      ],
    ];

    for (let i = 0; i < table.length; i += 1) {
      const [v, e] = table[i];
      expect(parseCoordinate(v[0], v[1])).toEqual(e);
    }
  });
});
