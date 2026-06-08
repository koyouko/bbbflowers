import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';
let initialCart = [];
if (isBrowser) {
  const saved = localStorage.getItem('bb_cart');
  if (saved) {
    try {
      initialCart = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
}

const cart = writable(initialCart);

if (isBrowser) {
  cart.subscribe(value => {
    localStorage.setItem('bb_cart', JSON.stringify(value));
  });
}

export const cartStore = {
  subscribe: cart.subscribe,
  set: cart.set,
  update: cart.update,
  add(item) {
    cart.update(current => {
      const index = current.findIndex(i => 
        i.id === item.id && 
        i.size === item.size && 
        i.shape === item.shape && 
        i.wrapping === item.wrapping
      );
      if (index !== -1) {
        current[index].quantity += (item.quantity || 1);
      } else {
        current.push({
          ...item,
          quantity: item.quantity || 1,
          cartItemId: 'cart-' + Date.now() + Math.random().toString(36).substring(2, 6)
        });
      }
      return [...current];
    });
  },
  remove(cartItemId) {
    cart.update(current => current.filter(i => i.cartItemId !== cartItemId));
  },
  updateQty(cartItemId, qty) {
    cart.update(current => {
      if (qty <= 0) {
        return current.filter(i => i.cartItemId !== cartItemId);
      }
      const index = current.findIndex(i => i.cartItemId === cartItemId);
      if (index !== -1) current[index].quantity = qty;
      return [...current];
    });
  },
  clear() {
    cart.set([]);
  }
};
