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

  let is360Mode = false;
  let is360VideoMode = false;
  let activeAngleIdx = 0;
  let isDragging = false;
  let startX = 0;

  // Resolve dynamic preview image based on user configuration selection
  $: displayImg = (() => {
    if (!product) return '';
    
    // Red Moon options mapping
    if (product.id === 'red-moon') {
      if (selectedShape === 'Heart') return 'assets/products/red_moon_heart.png';
      if (selectedShape === 'Basket') return 'assets/products/red_moon_basket.png';
      if (selectedShape === 'Vase') return 'assets/products/red_moon_vase.png';
      if (selectedShape === 'Hat Box') return 'assets/products/red_moon_hatbox.png';
      
      // Bouquet wrapper colors
      if (selectedWrapping === 'Black') return 'assets/products/red_moon_bouquet_black.png';
      if (selectedWrapping === 'Red') return 'assets/products/red_moon_bouquet_red.png';
      if (selectedWrapping === 'Pink') return 'assets/products/red_moon_bouquet_pink.png';
      if (selectedWrapping === 'White') return 'assets/products/red_moon_bouquet_white.png';
      if (selectedWrapping === 'Gold') return 'assets/products/red_moon_bouquet_gold.png';
    }

    // Ocean Breeze options mapping
    if (product.id === 'ocean-breeze') {
      if (selectedShape === 'Heart') return 'assets/products/ocean_breeze_heart.png';
      if (selectedShape === 'Basket') return 'assets/products/ocean_breeze_basket.png';
      if (selectedShape === 'Hat Box') return 'assets/products/ocean_breeze_hatbox.png';
      if (selectedShape === 'Bouquet') return 'assets/products/ocean_breeze_bouquet.png';
      return 'assets/products/ocean_breeze.png';
    }

    // Pink Romance options mapping
    if (product.id === 'pink-romance' || product.id === 'luxury-pink-box') {
      if (selectedShape === 'Hat Box') return 'assets/products/luxury_pink_box.png';
      if (selectedShape === 'Heart') return 'assets/products/red_moon_heart.png'; // fallback
      if (selectedShape === 'Basket') return 'assets/products/garden_delight.png'; // pink-ish mixed
      if (selectedShape === 'Vase') return 'assets/products/blushing_beauty.png'; // pink roses in vase
      return 'assets/products/pink_romance.png';
    }

    // Heart of Love options mapping
    if (product.id === 'heart-of-love') {
      if (selectedShape === 'Bouquet') return 'assets/products/red_moon_bouquet_black.png';
      if (selectedShape === 'Basket') return 'assets/products/red_moon_basket.png';
      if (selectedShape === 'Vase') return 'assets/products/red_moon_vase.png';
      if (selectedShape === 'Hat Box') return 'assets/products/red_moon_hatbox.png';
      return 'assets/products/red_moon_heart.png';
    }

    // Elegant Grace options mapping
    if (product.id === 'elegant-grace') {
      if (selectedShape === 'Vase') return 'assets/products/elegant_white.png';
      if (selectedShape === 'Hat Box') return 'assets/products/elegant_white.png';
    }

    // Default fallback to product's own image
    return product.img;
  })();

  // Resolve dynamic alternative view image for the second thumbnail
  $: displayImg2 = (() => {
    if (!product) return '';
    // Show a different configuration or angle of the product
    if (product.id === 'red-moon') {
      return 'assets/products/red_moon_360_side.png';
    }
    if (product.id === 'ocean-breeze') {
      return 'assets/products/ocean_breeze_bouquet.png';
    }
    if (product.id === 'pink-romance') {
      return 'assets/products/red_moon_heart.png';
    }
    if (product.id === 'luxury-pink-box') {
      return 'assets/products/pink_romance.png';
    }
    if (product.id === 'heart-of-love') {
      return 'assets/products/red_moon_bouquet_black.png';
    }
    if (product.id === 'elegant-grace') {
      return 'assets/products/elegant_white.png';
    }
    return product.img;
  })();

  // Resolve dynamic rotation frames list based on product
  $: anglesList = (() => {
    if (!product) return [];
    if (product.id === 'red-moon') {
      return [
        'assets/products/red_moon_bouquet_black.png',
        'assets/products/red_moon_360_side.png',
        'assets/products/red_moon_360_back.png',
        'assets/products/red_moon_360_top.png'
      ];
    }
    if (product.id === 'ocean-breeze') {
      return [
        'assets/products/ocean_breeze.png',
        'assets/products/ocean_breeze_bouquet.png',
        'assets/products/ocean_breeze_basket.png',
        'assets/products/ocean_breeze_hatbox.png',
        'assets/products/ocean_breeze_heart.png'
      ];
    }
    // Fallback: spin shape configurations for other items
    const defaultImg = product.img;
    let heartImg = 'assets/products/red_moon_heart.png';
    let basketImg = 'assets/products/garden_delight.png';
    let hatboxImg = 'assets/products/luxury_pink_box.png';

    if (product.id === 'pink-romance' || product.id === 'luxury-pink-box') {
      return [defaultImg, heartImg, basketImg, hatboxImg];
    }
    return [defaultImg, defaultImg, defaultImg, defaultImg];
  })();

  // Mouse/Touch controls for 360 view dragging
  function handleMouseDown(e) {
    if (!is360Mode) return;
    isDragging = true;
    startX = e.clientX;
  }

  function handleMouseMove(e) {
    if (!isDragging) return;
    const diffX = e.clientX - startX;
    const stepThreshold = 40;
    if (Math.abs(diffX) > stepThreshold) {
      const step = diffX > 0 ? 1 : -1;
      const count = anglesList.length;
      activeAngleIdx = (activeAngleIdx + step + count) % count;
      startX = e.clientX;
    }
  }

  function handleMouseUp() {
    isDragging = false;
  }

  function handleTouchStart(e) {
    if (!is360Mode) return;
    isDragging = true;
    startX = e.touches[0].clientX;
  }

  function handleTouchMove(e) {
    if (!isDragging) return;
    const diffX = e.touches[0].clientX - startX;
    const stepThreshold = 30;
    if (Math.abs(diffX) > stepThreshold) {
      const step = diffX > 0 ? 1 : -1;
      const count = anglesList.length;
      activeAngleIdx = (activeAngleIdx + step + count) % count;
      startX = e.touches[0].clientX;
    }
  }

  function selectThumb(idx) {
    is360Mode = false;
    activeThumbIdx = idx;
  }

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
      img: displayImg,
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
        <div class="thumb-item {!is360Mode && activeThumbIdx === 0 ? 'active' : ''}" on:click={() => selectThumb(0)}>
          <img src="/{displayImg}" alt="Thumbnail">
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="thumb-item {!is360Mode && activeThumbIdx === 1 ? 'active' : ''}" on:click={() => selectThumb(1)}>
          <img src="/{displayImg2}" alt="Thumbnail alternative view">
        </div>
        <!-- 360 Thumbnail shortcut -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="thumb-item {is360Mode ? 'active' : ''}" on:click={() => { is360Mode = true; activeAngleIdx = 0; }} style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fce4ec; border: 1px dashed var(--bb-pink); border-radius: 8px;">
          <i class="fa-solid fa-rotate" style="font-size: 20px; color: var(--bb-pink);"></i>
          <span style="font-size: 10px; font-weight: 700; color: var(--bb-pink); margin-top: 4px;">360&deg; View</span>
        </div>
      </div>
      
      <!-- svelte-ignore a11y-no-static-element-interactions -->
      <div class="gallery-main" 
           style="cursor: {is360Mode && !is360VideoMode ? 'ew-resize' : 'default'}; position: relative; overflow: hidden; user-select: none;"
           on:mousedown={handleMouseDown}
           on:mousemove={handleMouseMove}
           on:mouseup={handleMouseUp}
           on:mouseleave={handleMouseUp}
           on:touchstart={handleTouchStart}
           on:touchmove={handleTouchMove}
           on:touchend={handleMouseUp}>
        
        {#if is360Mode}
          <!-- Video/Spin Switcher Tabs -->
          <div class="mode-selector" style="position: absolute; top: 12px; left: 50%; transform: translateX(-50%); z-index: 20; display: flex; gap: 4px; background: rgba(0,0,0,0.6); padding: 4px; border-radius: var(--radius-full);">
            <button type="button" 
                    style="font-size: 11px; padding: 4px 12px; border-radius: var(--radius-full); border: none; background: {!is360VideoMode ? 'var(--bb-pink)' : 'transparent'}; color: white; font-weight: 600; cursor: pointer; transition: background 0.2s;"
                    on:click={() => is360VideoMode = false}>
              <i class="fa-solid fa-arrows-left-right"></i> Spin
            </button>
            <button type="button" 
                    style="font-size: 11px; padding: 4px 12px; border-radius: var(--radius-full); border: none; background: {is360VideoMode ? 'var(--bb-pink)' : 'transparent'}; color: white; font-weight: 600; cursor: pointer; transition: background 0.2s;"
                    on:click={() => is360VideoMode = true}>
              <i class="fa-solid fa-play"></i> Video Clip
            </button>
          </div>

          {#if is360VideoMode}
            <!-- 360° Looping Video -->
            <!-- svelte-ignore a11y-media-has-caption -->
            <video src="https://player.vimeo.com/external/371433846.sd.mp4?s=236da2f3c054fb4d9d3d3b76cf6c7d1e8c7c91ad&profile_id=139&oauth2_token_id=57447761"
                   autoplay
                   loop
                   muted
                   playsinline
                   style="width: 100%; height: 100%; object-fit: cover;">
            </video>
            <div class="rotate-hint-overlay" style="position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 8px; pointer-events: none; animation: pulse 2s infinite;">
              <i class="fa-solid fa-video"></i> 360&deg; Video Loop
            </div>
          {:else}
            <!-- 360° Interactive Drag to Spin -->
            <img src="/{anglesList[activeAngleIdx]}" alt="360 rotation view" style="pointer-events: none; user-drag: none; -webkit-user-drag: none; width: 100%; height: 100%; object-fit: cover;">
            <div class="rotate-hint-overlay" style="position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.6); color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 8px; pointer-events: none; animation: pulse 2s infinite;">
              <i class="fa-solid fa-arrows-left-right"></i> Drag left/right to spin
            </div>
          {/if}
        {:else if activeThumbIdx === 0}
          <img src="/{displayImg}" alt={product.name}>
        {:else}
          <img src="/{displayImg2}" alt="Alternative view">
        {/if}
        
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="badge-3d-view {is360Mode ? 'active' : ''}" on:click|stopPropagation={() => { is360Mode = !is360Mode; activeAngleIdx = 0; }} style="cursor: pointer; z-index: 10;">
          {#if is360Mode}
            <i class="fa-solid fa-circle-xmark"></i> Exit 360&deg;
          {:else}
            <i class="fa-solid fa-rotate"></i> 360&deg; View
          {/if}
        </div>
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
