<script>
  import { bouquetsList, occasionsList, reviewsList, deliveryLocations } from '$lib/data.js';
  import { wishlist } from '$lib/stores/dashboard.js';
  import Footer from '$lib/components/Footer.svelte';

  let checkPincode = '';
  let checkResult = '';
  let checkColor = 'var(--bb-text-main)';
  let reviewsIndex = 0;

  // Check delivery eligibility
  function handleCheckDelivery() {
    const code = checkPincode.trim().toLowerCase();
    if (!code) {
      checkResult = 'Please enter an area name.';
      checkColor = 'var(--bb-error)';
      return;
    }
    const matches = deliveryLocations.some(loc => loc.toLowerCase().includes(code));
    if (matches) {
      checkResult = 'Standard & Express delivery is available for this location!';
      checkColor = 'var(--bb-success)';
    } else {
      checkResult = 'Next-day delivery available for this location. Same-day on request.';
      checkColor = 'var(--bb-warning)';
    }
  }

  // Reviews Carousel
  function prevReview() {
    reviewsIndex = (reviewsIndex - 1 + reviewsList.length) % reviewsList.length;
  }
  function nextReview() {
    reviewsIndex = (reviewsIndex + 1) % reviewsList.length;
  }

  // Reactive subscription to wishlist
  let savedItems = [];
  wishlist.subscribe(val => {
    savedItems = val;
  });

  function toggleSaved(productId) {
    wishlist.toggle(productId);
  }
</script>

<!-- Hero Section -->
<section class="hero-section">
  <div class="container hero-grid">
    <div class="hero-content">
      <h1 class="hero-title">
        Luxury Flowers<br>Delivered in Dubai,
        <span>For Your Special Moments</span>
      </h1>
      <p class="hero-subtitle">Handcrafted with premium blooms for every emotion, every celebration.</p>
      <div class="hero-features">
        <div class="feature-item"><div class="feature-icon"><i class="fa-solid fa-truck-fast"></i></div> Same-Day Delivery</div>
        <div class="feature-item"><div class="feature-icon"><i class="fa-solid fa-leaf"></i></div> Fresh Flowers Daily</div>
        <div class="feature-item"><div class="feature-icon"><i class="fa-solid fa-award"></i></div> 5000+ Happy Customers</div>
      </div>
      <div class="hero-buttons">
        <a href="/shop" class="btn btn-primary">Shop Now</a>
        <a href="/dashboard/dashboard" class="btn btn-secondary"><i class="fa-solid fa-heart"></i> BB Moments Login</a>
      </div>
    </div>
    <div class="hero-image-wrapper">
      <img src="/assets/products/hero_flowers.png" class="hero-image" alt="Luxury Flower Bouquet">
      
      <!-- Delivery Checker Card -->
      <div class="delivery-checker">
        <div class="delivery-checker-title">
          <i class="fa-solid fa-location-dot" style="color: var(--bb-pink);"></i> Delivering to Your Location
        </div>
        <form on:submit|preventDefault={handleCheckDelivery} class="delivery-input-group">
          <input type="text" bind:value={checkPincode} class="delivery-input" placeholder="Enter your area or area code (e.g. JLT, Marina)">
          <button type="submit" class="btn btn-primary btn-sm">Check</button>
        </form>
        {#if checkResult}
          <div style="font-size: 12px; color: {checkColor}; font-weight: 600;">
            {#if checkColor === 'var(--bb-success)'}
              <i class="fa-solid fa-circle-check"></i>
            {:else}
              <i class="fa-solid fa-triangle-exclamation"></i>
            {/if}
            {checkResult}
          </div>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- Occasions Quick Circle Links -->
<section class="section section-bg">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Shop by Occasion</h2>
      <p class="section-subtitle">Find the perfect arrangement for any milestone</p>
    </div>
    <div class="occasion-scroll">
      {#each occasionsList as o}
        <a href="/shop?occasion={o.id}" class="occasion-circle-card">
          <div class="circle-img-wrapper">
            <img src="/{o.img}" class="circle-img" alt={o.name}>
          </div>
          <span class="circle-title">{o.name}</span>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- Dubai's Most Loved Bouquets Grid -->
<section class="section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Dubai's Most Loved Bouquets</h2>
      <p class="section-subtitle">Our best-selling floral arrangements prepared fresh daily</p>
    </div>
    <div class="product-grid">
      {#each bouquetsList.filter(b => b.popular).slice(0, 6) as b}
        <div class="product-card">
          {#if b.badge}
            <span class="product-badge {b.badgeClass}">{b.badge}</span>
          {/if}
          <button class="wishlist-btn {savedItems.includes(b.id) ? 'active' : ''}" on:click={() => toggleSaved(b.id)}>
            <i class="fa-solid fa-heart"></i>
          </button>
          <a href="/product/{b.id}" class="product-img-wrapper">
            <img src="/{b.img}" class="product-img" alt={b.name}>
          </a>
          <div class="product-info">
            <a href="/product/{b.id}"><h3 class="product-title">{b.name}</h3></a>
            <div class="product-rating">
              <span class="rating-stars">
                {#each Array(Math.floor(b.rating)) as _}
                  <i class="fa-solid fa-star"></i>
                {/each}
                {#if b.rating % 1 !== 0}
                  <i class="fa-solid fa-star-half-stroke"></i>
                {/if}
              </span>
              <span>{b.rating} ({b.reviewCount})</span>
            </div>
            <div class="product-price-row">
              <span class="product-price">AED {b.price}</span>
              <a href="/product/{b.id}" class="btn btn-secondary btn-sm" style="padding: 6px 14px;">Select</a>
            </div>
          </div>
        </div>
      {/each}
    </div>
    <div style="text-align: center; margin-top: 40px;">
      <a href="/shop" class="btn btn-outline">View All Collections</a>
    </div>
  </div>
</section>

<!-- Reviews Slider Section -->
<section class="reviews-section">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">What Our Customers Say</h2>
      <p class="section-subtitle">Stories of smiles created by Blooming Blossom</p>
    </div>
    <div class="reviews-carousel">
      {#each reviewsList as r, idx}
        <div class="review-slide {idx === reviewsIndex ? 'active' : ''}">
          <div class="review-stars">
            {#each Array(r.stars) as _}
              <i class="fa-solid fa-star"></i>
            {/each}
          </div>
          <p class="review-text">"{r.text}"</p>
          <p class="review-author">- {r.author}</p>
        </div>
      {/each}
      <div class="carousel-nav">
        <button class="carousel-btn" on:click={prevReview}><i class="fa-solid fa-arrow-left"></i></button>
        <button class="carousel-btn" on:click={nextReview}><i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  </div>
</section>

<!-- Instagram Feed -->
<section class="section section-bg">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Follow Us on Instagram</h2>
      <p class="section-subtitle">Get your daily dose of floral inspirations @bloomingblossom.ae</p>
    </div>
    <div class="instagram-grid">
      {#each [1, 2, 3, 4, 1, 2, 3, 4] as n}
        <div class="instagram-item">
          <img src="/assets/products/red_moon_bouquet_black.png" alt="Instagram bouquet">
          <div class="instagram-overlay"><i class="fa-brands fa-instagram" style="font-size: 24px;"></i></div>
        </div>
      {/each}
    </div>
    <div class="instagram-cta">
      <div class="instagram-cta-info">
        <div class="instagram-icon"><i class="fa-brands fa-instagram"></i></div>
        <div class="instagram-cta-text">
          <h4>@bloomingblossom.ae</h4>
          <p>Join our florist community of flower lovers</p>
        </div>
      </div>
      <!-- svelte-ignore a11y-invalid-attribute -->
      <a href="#" class="btn btn-primary" on:click|preventDefault={() => alert('Following @bloomingblossom.ae!')}>Follow Us</a>
    </div>
  </div>
</section>

<!-- Newsletter -->
<section class="section" style="padding-top: 0;">
  <div class="container">
    <div class="newsletter-banner">
      <div class="newsletter-grid">
        <div class="newsletter-info">
          <h3>Stay In Bloom</h3>
          <p>Subscribe to receive special offers, new arrivals, and relations-strengthening tips.</p>
        </div>
        <form class="newsletter-form" on:submit|preventDefault={() => { alert('Subscribed successfully!'); }}>
          <input type="email" class="newsletter-input" placeholder="Enter your email address" required>
          <button type="submit" class="newsletter-submit">Subscribe</button>
        </form>
      </div>
    </div>
  </div>
</section>

<Footer />
