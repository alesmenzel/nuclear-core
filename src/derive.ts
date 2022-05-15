import Atom, { type AtomOptions } from './atom';
import type { IAtom } from './types';

export type SelectFn<AtomValues, Return = AtomValues> = (...values: AtomValues[]) => Return;

/**
 * Calculate derived value
 */
function getDerivedValue<Values, DerivedValue>(
  atoms: IAtom<Values>[],
  select: SelectFn<Values, DerivedValue>
): DerivedValue {
  return select(...atoms.map((atom) => atom.value));
}

class DerivedAtom<Values, DerivedValue> extends Atom<DerivedValue> {
  /** @protected */
  _select: SelectFn<Values, DerivedValue>;

  /** @protected */
  _atoms: IAtom<Values>[];

  /**
   * Create reactive derived value
   * @example
   * ```js
   * const sum = derive(
   *   [atom(42), atom(100), atom(200)],
   *   (a, b, c) => a + b + c
   * )
   *
   * // Pass options to the selector atom
   * const sum = selector(
   *   [atom(42), atom(100), atom(200)],
   *   (a, b, c) => a + b + c
   *   { isEqual: _.isEqual } // Uses lodash's deep equal to compare derived value to its previous value
   * )
   * ```
   */
  constructor(
    atoms: IAtom<Values>[],
    select: SelectFn<Values, DerivedValue>,
    options?: Partial<AtomOptions<DerivedValue>>
  ) {
    const value = getDerivedValue(atoms, select);
    super(value, options);

    this._atoms = atoms;
    this._select = select;

    atoms.forEach((atom) => {
      atom.subscribe(() => {
        this._update(getDerivedValue(this._atoms, this._select));
      });
    });
  }
}

/**
 * Create reactive derived value
 * @example
 * ```js
 * const sum = derive(
 *   [atom(42), atom(100), atom(200)],
 *   (a, b, c) => a + b + c
 * )
 *
 * // Pass options to the selector atom
 * const sum = selector(
 *   [atom(42), atom(100), atom(200)],
 *   (a, b, c) => a + b + c
 *   { isEqual: _.isEqual } // Uses lodash's deep equal to compare derived value to its previous value
 * )
 * ```
 */
export function derive<Values, DerivedValue>(
  atoms: IAtom<Values>[],
  select: SelectFn<Values, DerivedValue>,
  options?: Partial<AtomOptions<DerivedValue>>
): DerivedAtom<Values, DerivedValue> {
  return new DerivedAtom(atoms, select, options);
}

export default DerivedAtom;
