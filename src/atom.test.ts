import _isEqual from 'lodash/isEqual';
import Atom, { atom } from './atom';

describe('Atom', () => {
  describe('Construction', () => {
    it('new Atom(...)', () => {
      const listener = jest.fn();

      const count = new Atom('{VALUE}');
      count.subscribe(listener);
      count.value = '{NEW_VALUE}';

      expect(listener).toBeCalledTimes(1);
      expect(listener).toBeCalledWith('{NEW_VALUE}');
    });

    it('atom(...)', () => {
      const listener = jest.fn();

      const count = atom({ data: 'payload' });
      count.subscribe(listener);
      count.value = { data: 'another-payload' };

      expect(listener).toBeCalledTimes(1);
      expect(listener).toBeCalledWith({ data: 'another-payload' });
    });
  });

  describe('Options', () => {
    it('isEqual - deep equal', () => {
      const listener = jest.fn();

      const count = new Atom(
        { data: 'payload' },
        {
          isEqual: _isEqual,
        }
      );
      count.subscribe(listener);
      count.value = { data: 'new-payload' };

      expect(listener).toBeCalledTimes(1);
      expect(listener).toBeCalledWith({ data: 'new-payload' });
    });
  });

  it('emits update on change', () => {
    const count = new Atom('{VALUE}');
    const listener = jest.fn();
    count.subscribe(listener);
    count.value = '{NEW_VALUE}';
    expect(listener).toBeCalledTimes(1);
    expect(listener).toBeCalledWith('{NEW_VALUE}');
  });

  it('set', () => {
    const count = new Atom('{VALUE}');
    const listener = jest.fn();
    count.subscribe(listener);
    count.set(() => '{NEW_VALUE}');
    expect(listener).toBeCalledTimes(1);
    expect(listener).toBeCalledWith('{NEW_VALUE}');
  });

  describe('Custom Atom', () => {
    it('is possible to create a custom Atom with custom handlers', () => {
      type MyValue = 'a' | 'b' | 'c';
      class MyAtom extends Atom<MyValue> {
        constructor() {
          super('a');
        }

        changeToC() {
          this._update('c');
        }
      }
      const listener = jest.fn();

      const customAtom = new MyAtom();
      customAtom.subscribe(listener);
      customAtom.value = 'b';
      customAtom.changeToC();

      expect(listener).toBeCalledTimes(2);
      expect(listener).toBeCalledWith('b');
      expect(listener).toBeCalledWith('c');
      expect(customAtom.value).toBe('c');
    });
  });
});
