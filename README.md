# 🍱 Nuclear Core

Framework agnostic reactive state management library.

## Installation

```bash
npm install @alesmenzel/nuclear-core
```

### Usage

#### Atom

`Atom` is the basic building block. It is a micro observable wrapper that emits an `update` event you can
listen on with `subscribe(...)`. The value of `Atom` can be anything. By default the `update` event will
be fired only when the value changes with strict value comparison `===`, but you can change the equality function
to for example deepEqual if you want to with atom's options.

```ts
import { atom } from "@alesmenzel/nuclear-core"

const listOfBears = atom(['🧸', '🐻', '🐻‍❄️'])
// With options
// const listOfBears = atom(['🧸', '🐻', '🐻‍❄️'], { equal: _.deepEqual })
listOfBears.value // -> ['🧸', '🐻', '🐻‍❄️']
listOfBears.get() // -> ['🧸', '🐻', '🐻‍❄️']
listOfBears.value = ['🐻‍❄️'] // -> ['🐻‍❄️']
listOfBears.set((bears) => [...bears, '🐻‍❄️']) // -> ['🐻‍❄️', '🐻‍❄️']
listOfBears.set(['🐻‍❄️', '🐻‍❄️', '🐻‍❄️']) // -> ['🐻‍❄️', '🐻‍❄️', '🐻‍❄️']

const onUpdate = (bears) => {
  console.log(bears)
}
const unsubscribe = listOfBears.subscribe(onUpdate)
listOfBears.unsubscribe(onUpdate) // or unsubscribe()
```

#### Derived Atom

`DerivedAtom` is also an `Atom`, but its value is derived from the given list of `atoms` and a `select` function. Since `DerivedAtom` is also an `Atom`, you can do anything that you can do with `Atom` (see above).

```ts
import { derive } from "@alesmenzel/nuclear-core"

const shoppingList = atom([{name: '🍎', qt: 10, price: 3}, {name: '🍐', qt: 2, price: 5}])
const grandTotal = derive([shoppingList], (list) => {
  return list.reduce((acc, item) => acc + item.qt * item.price, 0)
})

grandTotal.value // 40
```

### Custom Atom

Atom by itself is pretty plain reactive container, would it be great if we could create a reactive model with helper methods like `addItemToCart(...)` or `increase/decreaseQuantity(...)`? I think it would.

```ts
import { Atom, derive } from "@alesmenzel/nuclear-core"

type ShoppingListItem = {name: string, qt: number, price: number}

class ShoppingListAtom extends Atom<ShoppingListItem[]> {
  addItemToCart(item: ShoppingListItem) {
    this._value = [...this._value, item]
  }

  increaseQuantity(itemName, count = 1) {
    // In a real project, you would probably want to store the items in a Map instead, so you can access them directly
    this._value = this._value.map(item => item.name === itemName ? {...item, qt: item.qt + count} : item)
  }
}

const shoppingList = new ShoppingListAtom([{name: '🍎', qt: 10, price: 3}, {name: '🍐', qt: 2, price: 5}])
const grandTotal = derive([shoppingList], (list) => {
  return list.reduce((acc, item) => acc + item.qt * item.price, 0)
})

grandTotal.value // 40
```

You could also create your custom `DeriveAtom` if you want to with helper functions like `getPriceInEuro(...)` for example.
