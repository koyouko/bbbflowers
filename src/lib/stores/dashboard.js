import { writable } from 'svelte/store';

// Helper to create store with localStorage fallback
function createLocalStore(key, initialValue) {
  const isBrowser = typeof window !== 'undefined';
  let data = initialValue;
  
  if (isBrowser) {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        data = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    } else {
      localStorage.setItem(key, JSON.stringify(initialValue));
    }
  }

  const store = writable(data);

  if (isBrowser) {
    store.subscribe(val => {
      localStorage.setItem(key, JSON.stringify(val));
    });
  }

  return store;
}

// 1. Profile Store
export const profile = createLocalStore('bb_profile', {
  name: "Shanthi",
  lastName: "Anand",
  email: "shanthi.anand@example.com",
  phone: "+971 50 123 4567",
  memberTier: "BB Silver Member",
  points: 450,
  ordersCompleted: 5,
  creditEarned: 25,
  avatar: "assets/products/profile_avatar.svg"
});

// 2. Wishlist Store
const wishlistInner = createLocalStore('bb_wishlist', []);
export const wishlist = {
  subscribe: wishlistInner.subscribe,
  toggle(productId) {
    let active = false;
    wishlistInner.update(current => {
      const idx = current.indexOf(productId);
      if (idx !== -1) {
        current.splice(idx, 1);
        active = false;
      } else {
        current.push(productId);
        active = true;
      }
      return [...current];
    });
    return active;
  }
};

// 3. Orders Store
export const orders = createLocalStore('bb_orders', [
  {
    id: 'BB20450',
    date: '2026-05-10',
    itemSummary: 'Red Moon — 50 Roses',
    total: 220,
    recipient: 'Mom (Rajeev)',
    status: 'Delivered',
    img: 'assets/products/red_moon.svg'
  },
  {
    id: 'BB20412',
    date: '2026-04-14',
    itemSummary: 'Pure Sun — Sunflowers',
    total: 345,
    recipient: 'Best Friend (Sara)',
    status: 'Delivered',
    img: 'assets/products/pure_sun.svg'
  }
]);

// 4. Addresses Store
const addressesInner = createLocalStore('bb_addresses', [
  { id: 'addr-1', label: 'Home (Dubai)', recipient: 'Shanthi Anand', address: 'Villa 14, Street 2B, Dubai Marina', phone: '+971 50 123 4567', type: 'Home' },
  { id: 'addr-2', label: 'Office (JLT)', recipient: 'Shanthi Anand', address: 'Floor 32, Fortune Tower, Cluster C, JLT', phone: '+971 50 123 4567', type: 'Office' },
  { id: 'addr-3', label: "Parents' House", recipient: 'Rajeev Anand', address: 'Villa 5, Al Barsha 1, Dubai', phone: '+971 50 987 6543', type: 'Parents' }
]);

export const addresses = {
  subscribe: addressesInner.subscribe,
  save(addr) {
    addressesInner.update(current => {
      if (addr.id) {
        const idx = current.findIndex(a => a.id === addr.id);
        if (idx !== -1) current[idx] = addr;
      } else {
        addr.id = 'addr-' + Date.now();
        current.push(addr);
      }
      return [...current];
    });
  },
  delete(id) {
    addressesInner.update(current => current.filter(a => a.id !== id));
  }
};

// 5. Reminders Store
export const reminders = createLocalStore('bb_reminders', {
  whatsapp: true,
  sms: false,
  email: true,
  push: true,
  whatsappRules: [14, 7, 2, 0]
});
