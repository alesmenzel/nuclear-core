import Atom from './atom';

describe('Library', () => {
  it('works with custom atoms', () => {
    type ShoppingCartItem = {
      quantity: number;
      price: number;
    };
    type ShoppingCartValue = { [id: string]: ShoppingCartItem };

    class ShoppingCart extends Atom<ShoppingCartValue> {
      constructor() {
        super({});
      }

      addToCart(id: string, cartItem: ShoppingCartItem) {
        this._update({ ...this._value, [id]: cartItem });
      }

      changeQuantity(id: string, quantity: number) {
        this._update({
          ...this._value,
          [id]: {
            ...this._value[id],
            quantity,
          },
        });
      }

      toArray() {
        return Object.keys(this._value).map((key) => ({ id: key, ...this._value[key] }));
      }
    }

    type PriceValue = number;

    class PriceToPay extends Atom<PriceValue> {
      constructor(atom: ShoppingCart) {
        const getTotal = () => {
          return atom.toArray().reduce((acc, item) => {
            const { price, quantity } = item;
            return acc + quantity * price;
          }, 0);
        };
        super(getTotal());

        atom.subscribe(() => {
          this._update(getTotal());
        });
      }

      getPriceInDollars() {
        return this._value / 20;
      }
    }

    const shoppingCart = new ShoppingCart();
    const priceToPay = new PriceToPay(shoppingCart);

    expect(shoppingCart.value).toEqual({});
    expect(priceToPay.value).toEqual(0);

    shoppingCart.addToCart('banana', {
      quantity: 1,
      price: 10,
    });

    expect(shoppingCart.value).toEqual({
      banana: {
        quantity: 1,
        price: 10,
      },
    });
    expect(priceToPay.value).toEqual(10);

    shoppingCart.addToCart('nuts', {
      quantity: 20,
      price: 2,
    });

    expect(shoppingCart.value).toEqual({
      banana: {
        quantity: 1,
        price: 10,
      },
      nuts: {
        quantity: 20,
        price: 2,
      },
    });
    expect(priceToPay.value).toEqual(50);

    shoppingCart.changeQuantity('banana', 10);

    expect(shoppingCart.value).toEqual({
      banana: {
        quantity: 10,
        price: 10,
      },
      nuts: {
        quantity: 20,
        price: 2,
      },
    });
    expect(priceToPay.value).toEqual(140);
    expect(priceToPay.getPriceInDollars()).toEqual(7);
  });
});
