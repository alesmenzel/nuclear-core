import EventEmitter, { type Listener, type Unsubscribe } from '@alesmenzel/event-emitter';
import { AtomSymbol } from './constants';
import { strictEqual, isSetFn } from './utils';
import type { IAtom, SetFn } from './types';

export type AtomEvents<Value> = {
  update: Value;
};
export type AtomOptions<Value> = {
  isEqual: (prevValue: Value, currValue: Value) => boolean;
};

class Atom<Value, Events extends AtomEvents<Value> = AtomEvents<Value>>
  extends EventEmitter<Events>
  implements IAtom<Value>
{
  [AtomSymbol]: true;

  /** @protected */
  _value: Value;

  /** @protected */
  _isFrozen = false;

  /** @protected */
  _options: AtomOptions<Value> = {
    isEqual: strictEqual,
  };

  /**
   * Construct Atom
   * @example
   * ```js
   * const count = new Atom(42) // default uses strict reference equality
   * const count = new Atom(42, {
   *   isEqual: _.isEqual // lodash's deep equal
   * })
   *
   * // Read atom´s value
   * count.value // 42
   * count.get() // 42
   *
   * // Change atom´s value
   * count.value = 100 // count.value -> 100
   * count.set(150) // count.value -> 150
   * count.set((prevValue) => prevValue + 150) // count.value -> 300
   *
   * // Listen on changes
   * count.subscribe((value) => ...)
   * count.unsubscribe((value) => ...)
   * ```
   */
  constructor(value: Value, options: Partial<AtomOptions<Value>> = {}) {
    super();

    this._value = value;
    this._options = { ...this._options, ...options };

    this.get = this.get.bind(this);
    this.set = this.set.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
  }

  /**
   * Update the value and emit update event
   * @protected
   */
  _update(newValue: Value): this {
    if (this._isFrozen) return this;
    if (this._options.isEqual(this._value, newValue)) return this;
    this._value = newValue;
    this.emit('update', newValue);
    return this;
  }

  /**
   * Disable updates. For testing/devtool purposes only.
   * @protected
   */
  _freeze() {
    this._isFrozen = true;
  }

  /**
   * Enable updates if atom is frozen. For testing/devtool purposes only.
   * @protected
   */
  _unfreeze() {
    this._isFrozen = false;
  }

  /**
   * Return atom´s value
   * @example
   * ```js
   * atom.value // 42
   * ```
   */
  get value(): Value {
    return this._value;
  }

  /**
   * Set atom´s value
   * @example
   * ```js
   * atom.value = 42
   * ```
   */
  set value(value: Value) {
    this._update(value);
  }

  /**
   * Return atom´s value
   * @example
   * ```js
   * atom.get() // 42
   * ```
   */
  get(): Value {
    return this._value;
  }

  /**
   * Set atom´s value
   * @example
   * ```js
   * atom.set(42)
   * atom.set((prevValue) => prevValue + 42)
   * ```
   */
  set(value: Value | SetFn<Value>): this {
    const newValue: Value = isSetFn(value) ? value(this._value) : value;
    this._update(newValue);
    return this;
  }

  /**
   * Subscribe to updates
   */
  subscribe(listener: Listener<Value>): Unsubscribe {
    return this.on('update', listener);
  }

  /**
   * Unsubscribe from updates
   */
  unsubscribe(listener: Listener<Value>): this {
    return this.off('update', listener);
  }
}

/**
 * Create an atom
 * @example
 * ```js
 * const count = atom(42)
 * const count = atom(42, {
 *   isEqual: _.isEqual // lodash's deep equal
 * })
 *
 * // Read atom´s value
 * count.value // 42
 * count.get() // 42
 *
 * // Change atom´s value
 * count.value = 100 // count.value -> 100
 * count.set(150) // count.value -> 150
 * count.set((prevValue) => prevValue + 150) // count.value -> 300
 *
 * // Listen on changes
 * count.subscribe((value) => ...)
 * count.unsubscribe((value) => ...)
 * count.on('update', (value) => ...)
 * ```
 */
export function atom<Value>(value: Value, options?: Partial<AtomOptions<Value>>): Atom<Value> {
  return new Atom(value, options);
}

export default Atom;
