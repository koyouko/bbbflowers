<script>
  import { page } from '$app/stores';
  import { bouquetsList, deliveryLocations, upsellAddons } from '$lib/data.js';
  import { cartStore } from '$lib/stores/cart.js';
  import { goto } from '$app/navigation';
  import Footer from '$lib/components/Footer.svelte';

  // Read product ID from routing params reactively
  $: productId = $page.params.id;
  $: product = bouquetsList.find(b => b.id === productId);

  // Default configuration selection states
  let selectedShape = 'Bouquet';
  let selectedSize = '50 Roses';
  let selectedWrapping = 'Black';
  let extraItemsSelected = [];
  
  let deliveryLoc = deliveryLocations[0];
  let deliveryDate = new Date().toISOString().split('T')[0];
  let deliverySlot = '3:00 PM - 6:00 PM';

  let activeThumbIdx = 0;

  // Calculate dynamic price reactively
  let currentPrice = 0;
  $: {
    if (product) {
      let price = product.basePrice;
      if (selectedSize === '30 Roses') price = product.basePrice - 40;
      if (selectedSize === '100 Roses') price = product.basePrice + 160;
      if (selectedSize === '200 Roses') price = product.basePrice + 480;

      const extrasCost = extraItemsSelected.reduce((sum, itemId) => {
        const addon = upsellAddons.find(a => a.id === itemId);
        return sum + (addon ? addon.price : 0);
      }, 0);

      currentPrice = price + extrasCost;
    }
  }

  // Toggle extras selection helper
  function toggleExtra(addonId) {
    if (extraItemsSelected.includes(addonId)) {
      extraItemsSelected = extraItemsSelected.filter(id => id !== addonId);
    } else {
      extraItemsSelected = [...extraItemsSelected, addonId];
    }
  }

  // Gather configured item details and add to cart store
  function addToCart(redirect = false) {
    const addonsData = extraItemsSelected.map(id => {
      const add = upsellAddons.find(a => a.id === id);
      return { id: add.id, name: add.name, price: add.price };
    });

    const item = {
      id: product.id,
      name: product.name,
      price: currentPrice,
      img: product.img,
      shape: selectedShape,
      size: selectedSize,
      wrapping: selectedWrapping,
      addons: addonsData,
      deliveryLocation: deliveryLoc,
      deliveryDate: deliveryDate,
      deliverySlot: deliverySlot
    };

    cartStore.add(item);
    
    if (redirect) {
      goto('/checkout');
    } else {
      alert(`${product.name} added to your cart!`);
    }
  }
</script>

{#if product}
  <div class="container product-detail-grid">
    <!-- Image Gallery -->
    <div class="product-gallery">
      <div class="gallery-thumbs">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="thumb-item {activeThumbIdx === 0 ? 'active' : ''}" on:click={() => activeThumbIdx = 0}>
          <img src="/{product.img}" alt="Thumbnail">
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="thumb-item {activeThumbIdx === 1 ? 'active' : ''}" on:click={() => activeThumbIdx = 1}>
          <img src="/assets/products/hero_flowers.svg" alt="Thumbnail">
        </div>
      </div>
      <div class="gallery-main">
        {#if activeThumbIdx === 0}
          <img src="/{product.img}" alt={product.name}>
        {:else}
          <img src="/assets/products/hero_flowers.svg" alt="Preview alt">
        {/if}
        <div class="badge-3d-view"><i class="fa-solid fa-rotate"></i> 360&deg; View</div>
      </div>
    </div>

    <!-- Configuration Panel -->
    <div class="product-purchase-options">
      <div>
        <h2 style="font-size: 36px; margin-bottom: 8px;">{product.name}</h2>
        <div class="product-rating" style="margin-bottom: 16px;">
          <span class="rating-stars">
            {#each Array(Math.floor(product.rating)) as _}
              <i class="fa-solid fa-star"></i>
            {/each}
          </span>
          <span style="font-weight: 700; color: var(--bb-text-main);">{product.rating}</span>
          <span>({product.reviewCount} Reviews)</span>
        </div>
        <p style="color: var(--bb-text-light); font-size: 15px;">{product.description}</p>
      </div>

      <!-- Price details -->
      <div style="border-bottom: 1px solid var(--bb-card-border); padding-bottom: 20px;">
        <div style="font-size: 32px; font-weight: 700; color: var(--bb-pink);">AED {currentPrice.toFixed(2)}</div>
        <span style="font-size: 13px; font-weight: 500; color: #00897B; background-color: #E0F2F1; padding: 4px 10px; border-radius: 4px; display: inline-block; margin-top: 6px;">
          or 4 interest-free payments of AED {(currentPrice / 4).toFixed(2)} with tabby
        </span>
      </div>

      <!-- 1. Choose Shape -->
      <div>
        <h4 class="option-group-title">1. Choose The Shape</h4>
        <div class="shape-options">
          {#each ['Bouquet', 'Heart', 'Basket', 'Vase', 'Hat Box'] as shape}
            <button class="shape-option-btn {selectedShape === shape ? 'active' : ''}" on:click={() => selectedShape = shape}>
              {#if shape === 'Bouquet'}💐
              {:else if shape === 'Heart'}❤️
              {:else if shape === 'Basket'}🧺
              {:else if shape === 'Vase'}🏺
              {:else if shape === 'Hat Box'}📦{/if}
              {shape}
            </button>
          {/each}
        </div>
      </div>

      <!-- 2. Choose Size -->
      <div>
        <h4 class="option-group-title">2. Choose Size (Number of Roses)</h4>
        <div class="size-options">
          <!-- 30 Roses -->
          <button class="size-option-btn {selectedSize === '30 Roses' ? 'active' : ''}" on:click={() => selectedSize = '30 Roses'}>
            <span class="size-label">30 Roses</span>
            <span class="size-count">Elegant Surprise</span>
            <span class="size-price-add">AED {product.basePrice - 40}</span>
          </button>
          
          <!-- 50 Roses -->
          <button class="size-option-btn {selectedSize === '50 Roses' ? 'active' : ''}" on:click={() => selectedSize = '50 Roses'}>
            <span class="size-popular-badge">★ Popular</span>
            <span class="size-label" style="margin-top: 4px;">50 Roses</span>
            <span class="size-count">Grand Romance</span>
            <span class="size-price-add">AED {product.basePrice}</span>
          </button>

          <!-- 100 Roses -->
          <button class="size-option-btn {selectedSize === '100 Roses' ? 'active' : ''}" on:click={() => selectedSize = '100 Roses'}>
            <span class="size-label">100 Roses</span>
            <span class="size-count">Luxury Statement</span>
            <span class="size-price-add">AED {product.basePrice + 160}</span>
          </button>

          <!-- 200 Roses -->
          <button class="size-option-btn {selectedSize === '200 Roses' ? 'active' : ''}" on:click={() => selectedSize = '200 Roses'}>
            <span class="size-label">200 Roses</span>
            <span class="size-count">Ultimate Love</span>
            <span class="size-price-add">AED {product.basePrice + 480}</span>
          </button>
        </div>
      </div>

      <!-- 3. Wrapping Color -->
      <div>
        <h4 class="option-group-title">3. Choose Wrapping Color</h4>
        <div class="wrapping-options">
          {#each ['Black', 'Red', 'Pink', 'White', 'Gold'] as color}
            <button class="wrapping-option-btn {selectedWrapping === color ? 'active' : ''}" on:click={() => selectedWrapping = color}>
              {color} Wrapper
            </button>
          {/each}
        </div>
      </div>

      <!-- 4. Delivery Details -->
      <div class="delivery-details-card">
        <h4 class="option-group-title" style="margin-bottom: 16px;">4. Delivery Details</h4>
        <div class="delivery-form-grid">
          <div>
            <label class="input-label" for="prod-delivery-loc-select">Deliver To</label>
            <select class="input-style" id="prod-delivery-loc-select" bind:value={deliveryLoc}>
              {#each deliveryLocations as loc}
                <option value={loc}>{loc.split(',')[0]}</option>
              {/each}
            </select>
          </div>
          <div>
            <label class="input-label" for="prod-delivery-date-input">Delivery Date</label>
            <input type="date" id="prod-delivery-date-input" class="input-style" bind:value={deliveryDate}>
          </div>
          <div style="grid-column: 1/-1;">
            <label class="input-label" for="prod-delivery-slot-select">Preferred Time Slot</label>
            <select class="input-style" id="prod-delivery-slot-select" bind:value={deliverySlot}>
              <option value="9:00 AM - 12:00 PM">Morning (9 AM - 12 PM)</option>
              <option value="12:00 PM - 3:00 PM">Afternoon (12 PM - 3 PM)</option>
              <option value="3:00 PM - 6:00 PM">Evening (3 PM - 6 PM)</option>
              <option value="6:00 PM - 9:00 PM">Night (6 PM - 9 PM)</option>
            </select>
          </div>
        </div>
        <div class="delivery-available-msg">
          <i class="fa-solid fa-circle-check"></i> Same-day delivery is available for the selected slot.
        </div>
      </div>

      <!-- 5. Add Luxury Extras -->
      <div>
        <h4 class="option-group-title">5. Add Luxury Extras <span class="option-group-desc">(Select as many as you like)</span></h4>
        <div class="extras-carousel">
          {#each upsellAddons as addon}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="extra-item-card {extraItemsSelected.includes(addon.id) ? 'active' : ''}" on:click={() => toggleExtra(addon.id)}>
              <img src="/{addon.img}" class="extra-img" alt={addon.name}>
              <div class="extra-info">
                <div class="extra-name">{addon.name}</div>
                <div class="extra-price">+ AED {addon.price}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Actions -->
      <div class="purchase-actions">
        <button class="btn btn-secondary" on:click={() => addToCart(false)}><i class="fa-solid fa-cart-plus"></i> Add to Cart</button>
        <button class="btn btn-primary" on:click={() => addToCart(true)}>Buy Now</button>
      </div>
    </div>
  </div>
{:else}
  <div class="container" style="padding: 100px 20px; text-align: center;">
    <h2>Bouquet not found.</h2>
    <a href="/shop" class="btn btn-primary" style="margin-top: 20px;">Return to Shop</a>
  </div>
{/if}

<Footer />
