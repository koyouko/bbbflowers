import { writable } from 'svelte/store';

const initialCelebrations = [
  { id: 1, name: "Mom's Birthday", category: "family", date: "2026-06-19", daysLeft: 12, reminder: "7 days before", budget: 250, preferredFlower: "White Lilies + Pink Roses", notes: "She prefers light colors and soft wrappings." },
  { id: 2, name: "Wedding Anniversary", category: "personal", date: "2026-06-27", daysLeft: 20, reminder: "14 days before", budget: 400, preferredFlower: "Red Moon (50 Roses)", notes: "Book early, our special date!" },
  { id: 3, name: "Son's Birthday", category: "family", date: "2026-07-09", daysLeft: 32, reminder: "2 days before", budget: 150, preferredFlower: "Pure Sun (Sunflowers)", notes: "Bright and happy colors!" },
  { id: 4, name: "First Meet Surprise", category: "personal", date: "2026-07-15", daysLeft: 38, reminder: "7 days before", budget: 300, preferredFlower: "Pink Romance (30 Roses)", notes: "Surprise her at the office." },
  { id: 5, name: "Office Anniversary", category: "work", date: "2026-10-15", daysLeft: 130, reminder: "7 days before", budget: 200, preferredFlower: "Garden Delight Basket", notes: "Send to corporate headquarters." }
];

const isBrowser = typeof window !== 'undefined';
let initialList = [];
if (isBrowser) {
  const saved = localStorage.getItem('bb_celebrations');
  if (saved) {
    try {
      initialList = JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  } else {
    initialList = initialCelebrations;
    localStorage.setItem('bb_celebrations', JSON.stringify(initialList));
  }
}

// Recalculates daysLeft dynamically
function getUpdatedCelebrations(list) {
  const today = new Date();
  today.setHours(0,0,0,0);
  
  return list.map(c => {
    const eventDate = new Date(c.date);
    eventDate.setHours(0,0,0,0);
    
    // If the date has passed in the current year, set it to next year's date
    if (eventDate < today) {
      eventDate.setFullYear(today.getFullYear() + 1);
      c.date = eventDate.toISOString().split('T')[0];
    }
    
    const diffTime = eventDate - today;
    c.daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return c;
  }).sort((a, b) => a.daysLeft - b.daysLeft);
}

const celebrations = writable(getUpdatedCelebrations(initialList));

if (isBrowser) {
  celebrations.subscribe(value => {
    localStorage.setItem('bb_celebrations', JSON.stringify(value));
  });
}

export const celebrationsStore = {
  subscribe: celebrations.subscribe,
  set: celebrations.set,
  update: celebrations.update,
  save(event) {
    celebrations.update(current => {
      if (event.id) {
        // Edit existing
        const index = current.findIndex(c => c.id === event.id);
        if (index !== -1) current[index] = event;
      } else {
        // Add new
        event.id = Date.now();
        current.push(event);
      }
      return getUpdatedCelebrations(current);
    });
  },
  delete(id) {
    celebrations.update(current => current.filter(c => c.id !== id));
  }
};
