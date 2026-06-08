export const occasionsList = [
  { id: 'birthday', name: 'Birthday', img: 'assets/products/birthday.png' },
  { id: 'anniversary', name: 'Anniversary', img: 'assets/products/anniversary.png' },
  { id: 'romantic', name: 'Romantic Surprise', img: 'assets/products/romantic.png' },
  { id: 'get-well', name: 'Get Well Soon', img: 'assets/products/get_well.png' },
  { id: 'congrats', name: 'Congratulations', img: 'assets/products/congrats.png' },
  { id: 'new-baby', name: 'New Baby', img: 'assets/products/new_baby.png' },
  { id: 'thank-you', name: 'Thank You', img: 'assets/products/thank_you.png' },
  { id: 'elegant-white', name: 'Elegant White Collection', img: 'assets/products/elegant_white.png' }
];

export const bouquetsList = [
  {
    id: 'red-moon',
    name: 'Red Moon',
    price: 220,
    basePrice: 220,
    rating: 4.9,
    reviewCount: 120,
    badge: 'Best Seller',
    badgeClass: 'badge-bestseller',
    img: 'assets/products/red_moon_bouquet_black.png',
    description: 'A timeless expression of deep love and passion. Handcrafted with premium red roses, beautifully arranged in a sleek wrapper. Perfect for making hearts flutter.',
    occasions: ['romantic', 'anniversary', 'birthday'],
    flowerType: 'Roses',
    colors: ['Red'],
    popular: true
  },
  {
    id: 'pure-sun',
    name: 'Pure Sun',
    price: 345,
    basePrice: 345,
    rating: 4.8,
    reviewCount: 98,
    badge: 'Most Loved',
    badgeClass: 'badge-mostloved',
    img: 'assets/products/pure_sun.png',
    description: 'Brighten up any room with these radiant, handpicked sunflowers. Combined with fresh greens, this bouquet brings the warmth of summer right to their doorstep.',
    occasions: ['birthday', 'get-well', 'thank-you'],
    flowerType: 'Sunflowers',
    colors: ['Yellow'],
    popular: true
  },
  {
    id: 'pink-romance',
    name: 'Pink Romance',
    price: 220,
    basePrice: 220,
    rating: 4.9,
    reviewCount: 110,
    badge: 'Best Seller',
    badgeClass: 'badge-bestseller',
    img: 'assets/products/pink_romance.png',
    description: 'Soft pink roses arranged to create an atmosphere of pure enchantment. A sweet and elegant gesture for the special people in your life.',
    occasions: ['romantic', 'anniversary', 'birthday', 'new-baby'],
    flowerType: 'Roses',
    colors: ['Pink'],
    popular: true
  },
  {
    id: 'heart-of-love',
    name: 'Heart of Love',
    price: 420,
    basePrice: 420,
    rating: 4.9,
    reviewCount: 130,
    badge: 'Most Loved',
    badgeClass: 'badge-mostloved',
    img: 'assets/products/red_moon_heart.png',
    description: 'A luxurious heart-shaped arrangement of 100 premium red roses housed in a velvet black box. An unforgettable declaration of devotion.',
    occasions: ['romantic', 'anniversary'],
    flowerType: 'Roses',
    colors: ['Red'],
    popular: true
  },
  {
    id: 'elegant-grace',
    name: 'Elegant Grace',
    price: 365,
    basePrice: 365,
    rating: 4.8,
    reviewCount: 105,
    badge: '',
    badgeClass: '',
    img: 'assets/products/elegant_grace.png',
    description: 'A majestic arrangement of pure white lilies and white roses, representing innocence and grace. Ideal for formal gifting and elegant homes.',
    occasions: ['congrats', 'thank-you', 'elegant-white'],
    flowerType: 'Lilies',
    colors: ['White'],
    popular: true
  },
  {
    id: 'garden-delight',
    name: 'Garden Delight',
    price: 310,
    basePrice: 310,
    rating: 4.7,
    reviewCount: 85,
    badge: 'Best Seller',
    badgeClass: 'badge-bestseller',
    img: 'assets/products/garden_delight.png',
    description: 'A vibrant garden basket bursting with a colorful assortment of roses, carnations, and seasonal fresh blooms. Perfect to uplift and inspire.',
    occasions: ['birthday', 'congrats', 'get-well'],
    flowerType: 'Mixed Flowers',
    colors: ['Pink', 'Yellow', 'White'],
    popular: true
  },
  {
    id: 'blushing-beauty',
    name: 'Blushing Beauty',
    price: 280,
    basePrice: 280,
    rating: 4.7,
    reviewCount: 59,
    badge: '',
    badgeClass: '',
    img: 'assets/products/blushing_beauty.png',
    description: 'Soft lilac carnations and blush pink roses arranged in a decorative glass vase. Delivers a gentle, soothing touch of natural beauty.',
    occasions: ['birthday', 'thank-you', 'new-baby'],
    flowerType: 'Mixed Flowers',
    colors: ['Pink', 'Purple'],
    popular: false
  },
  {
    id: 'luxury-pink-box',
    name: 'Luxury Pink Box',
    price: 390,
    basePrice: 390,
    rating: 4.9,
    reviewCount: 81,
    badge: '',
    badgeClass: '',
    img: 'assets/products/luxury_pink_box.png',
    description: 'Fresh pink roses set beautifully inside our signature Blooming Blossom round box. Combines vintage luxury with modern florist design.',
    occasions: ['romantic', 'anniversary', 'birthday'],
    flowerType: 'Roses',
    colors: ['Pink'],
    popular: false
  },
  {
    id: 'ocean-breeze',
    name: 'Ocean Breeze',
    price: 330,
    basePrice: 330,
    rating: 4.6,
    reviewCount: 48,
    badge: 'New Arrival',
    badgeClass: 'badge-new',
    img: 'assets/products/ocean_breeze.png',
    description: 'A unique collection of blue orchids and white tulips in a clear vase, designed to evoke the peace and calm of sea waves.',
    occasions: ['thank-you', 'get-well', 'congrats'],
    flowerType: 'Orchids',
    colors: ['Blue', 'White'],
    popular: false
  }
];

export const reviewsList = [
  {
    stars: 5,
    text: "The flowers were beyond beautiful and the delivery was right on time. My wife loved them!",
    author: "Aisha, Dubai"
  },
  {
    stars: 5,
    text: "Excellent quality and packaging. Definitely my go-to florist from now on!",
    author: "Ramesh, Dubai"
  },
  {
    stars: 5,
    text: "Ordered for my anniversary, the roses were absolutely fresh and lasted over a week.",
    author: "Ahmed, Sharjah"
  }
];

export const deliveryLocations = [
  "Dubai Marina, UAE",
  "Downtown Dubai, UAE",
  "JLT, Dubai, UAE",
  "JBR, Dubai, UAE",
  "Palm Jumeirah, Dubai, UAE",
  "Business Bay, Dubai, UAE",
  "Sharjah, UAE"
];

export const upsellAddons = [
  { id: 'chocolates', name: 'Premium Chocolates', price: 45, img: 'assets/products/addon_chocolates.svg' },
  { id: 'teddy', name: 'Teddy Bear (25cm)', price: 60, img: 'assets/products/addon_teddy.svg' },
  { id: 'perfume', name: 'Luxury Perfume', price: 120, img: 'assets/products/addon_perfume.svg' },
  { id: 'balloon', name: 'Helium Balloon', price: 25, img: 'assets/products/addon_balloon.svg' }
];

export const initialCelebrations = [
  {
    id: 1,
    name: "Mom's Birthday",
    category: "family",
    date: "2026-06-19", // 12 days after current local time (June 7, 2026)
    daysLeft: 12,
    reminder: "7 days before",
    budget: 250,
    preferredFlower: "White Lilies + Pink Roses",
    notes: "She prefers light colors and soft wrappings."
  },
  {
    id: 2,
    name: "Wedding Anniversary",
    category: "personal",
    date: "2026-06-27", // 20 days after
    daysLeft: 20,
    reminder: "14 days before",
    budget: 400,
    preferredFlower: "Red Moon (50 Roses)",
    notes: "Book early, our special date!"
  },
  {
    id: 3,
    name: "Son's Birthday",
    category: "family",
    date: "2026-07-09", // 32 days after
    daysLeft: 32,
    reminder: "2 days before",
    budget: 150,
    preferredFlower: "Pure Sun (Sunflowers)",
    notes: "Bright and happy colors!"
  },
  {
    id: 4,
    name: "First Meet Surprise",
    category: "personal",
    date: "2026-07-15", // 38 days after
    daysLeft: 38,
    reminder: "7 days before",
    budget: 300,
    preferredFlower: "Pink Romance (30 Roses)",
    notes: "Surprise her at the office."
  },
  {
    id: 5,
    name: "Office Anniversary",
    category: "work",
    date: "2026-10-15",
    daysLeft: 130,
    reminder: "7 days before",
    budget: 200,
    preferredFlower: "Garden Delight Basket",
    notes: "Send to corporate headquarters."
  }
];
