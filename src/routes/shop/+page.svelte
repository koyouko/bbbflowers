<script>
  import { page } from '$app/stores';
  import { bouquetsList, occasionsList } from '$lib/data.js';
  import { wishlist } from '$lib/stores/dashboard.js';
  import Footer from '$lib/components/Footer.svelte';
  
  let selectedOccasions = [];
  let selectedFlowers = [];
  let selectedColors = [];
  let maxPrice = 700;
  let sortBy = 'popular';

  // Reactively sync url query parameters with selected occasions
  $: {
    const occasionParam = $page.url.searchParams.get('occasion');
    if (occasionParam && !selectedOccasions.includes(occasionParam)) {
      selectedOccasions = [occasionParam];
    }
  }

  // Reactive wishlist tracking
  let savedItems = [];
  wishlist.subscribe(val => {
    savedItems = val;
  });

  // Toggle color filter helper
  function toggleColor(color) {
    if (selectedColors.includes(color)) {
      selectedColors = selectedColors.filter(c => c !== color);
    } else {
      selectedColors = [...selectedColors, color];
    }
  }

  // Clear all filters
  function clearAllFilters() {
    selectedOccasions = [];
    selectedFlowers = [];
    selectedColors = [];
    maxPrice = 700;
    sortBy = 'popular';
  }

  // Reactive filtering logic
  let filteredList = [];
  $: {
    filteredList = bouquetsList.filter(b => {
      if (selectedOccasions.length > 0 && !b.occasions.some(o => selectedOccasions.includes(o))) return false;
      if (selectedFlowers.length > 0 && !selectedFlowers.includes(b.flowerType)) return false;
      if (selectedColors.length > 0 && !b.colors.some(c => selectedColors.includes(c))) return false;
      if (b.price > maxPrice) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });
  }
</script>

<div class="container shop-container">
  <!-- Sidebar Filters -->
  <aside class="sidebar-filters">
    <div class="filter-header">
      <h3>Filters</h3>
      <button class="filter-clear" on:click={clearAllFilters}>Clear All</button>
    </div>

    <!-- Occasions Filter -->
    <div class="filter-group">
      <h4 class="filter-title-sub">Occasions</h4>
      <div class="filter-list">
        {#each occasionsList as o}
          <label class="filter-checkbox-label">
            <input type="checkbox" value={o.id} bind:group={selectedOccasions}>
            {o.name}
          </label>
        {/each}
      </div>
    </div>

    <!-- Flower Type Filter -->
    <div class="filter-group">
      <h4 class="filter-title-sub">Flower Type</h4>
      <div class="filter-list">
        <label class="filter-checkbox-label"><input type="checkbox" value="Roses" bind:group={selectedFlowers}> Roses</label>
        <label class="filter-checkbox-label"><input type="checkbox" value="Sunflowers" bind:group={selectedFlowers}> Sunflowers</label>
        <label class="filter-checkbox-label"><input type="checkbox" value="Lilies" bind:group={selectedFlowers}> Lilies</label>
        <label class="filter-checkbox-label"><input type="checkbox" value="Orchids" bind:group={selectedFlowers}> Orchids</label>
        <label class="filter-checkbox-label"><input type="checkbox" value="Mixed Flowers" bind:group={selectedFlowers}> Mixed Flowers</label>
      </div>
    </div>

    <!-- Color Filter -->
    <div class="filter-group">
      <h4 class="filter-title-sub">Colors</h4>
      <div class="color-circles">
        <button class="color-circle-btn {selectedColors.includes('Red') ? 'active' : ''}" on:click={() => toggleColor('Red')} style="background-color: #EF4444;" title="Red"></button>
        <button class="color-circle-btn {selectedColors.includes('Yellow') ? 'active' : ''}" on:click={() => toggleColor('Yellow')} style="background-color: #FBBF24;" title="Yellow"></button>
        <button class="color-circle-btn {selectedColors.includes('Pink') ? 'active' : ''}" on:click={() => toggleColor('Pink')} style="background-color: #F472B6;" title="Pink"></button>
        <button class="color-circle-btn {selectedColors.includes('White') ? 'active' : ''}" on:click={() => toggleColor('White')} style="background-color: #F3F4F6;" title="White"></button>
        <button class="color-circle-btn {selectedColors.includes('Blue') ? 'active' : ''}" on:click={() => toggleColor('Blue')} style="background-color: #3B82F6;" title="Blue"></button>
        <button class="color-circle-btn {selectedColors.includes('Purple') ? 'active' : ''}" on:click={() => toggleColor('Purple')} style="background-color: #8B5CF6;" title="Purple"></button>
      </div>
    </div>

    <!-- Price Range Filter -->
    <div class="filter-group">
      <h4 class="filter-title-sub">Price Range (AED)</h4>
      <div class="range-slider">
        <input type="range" min="100" max="700" bind:value={maxPrice}>
        <div class="range-values">
          <span>AED 100</span>
          <span style="font-weight: 700; color: var(--bb-pink);">AED {maxPrice}</span>
        </div>
      </div>
    </div>
  </aside>

  <!-- Shop Content -->
  <main class="shop-content">
    <div class="shop-header-row">
      <div>
        <h2 style="font-size: 28px; font-family: 'Playfair Display', serif; margin-bottom: 4px;">All Bouquets</h2>
        <div class="products-count">Showing {filteredList.length} of {bouquetsList.length} products</div>
      </div>
      <div class="sort-select-wrapper">
        <label style="font-size: 14px; font-weight: 600;" for="sort-select-input">Sort by:</label>
        <select class="sort-select" id="sort-select-input" bind:value={sortBy}>
          <option value="popular">Popularity</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
    </div>

    <!-- Bouquets Product Grid -->
    <div class="product-grid">
      {#each filteredList as b}
        <div class="product-card">
          {#if b.badge}
            <span class="product-badge {b.badgeClass}">{b.badge}</span>
          {/if}
          <button class="wishlist-btn {savedItems.includes(b.id) ? 'active' : ''}" on:click={() => wishlist.toggle(b.id)}>
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
              </span>
              <span>{b.rating} ({b.reviewCount})</span>
            </div>
            <div class="product-price-row">
              <span class="product-price">AED {b.price}</span>
              <a href="/product/{b.id}" class="btn btn-secondary btn-sm" style="padding: 6px 14px;">Select</a>
            </div>
          </div>
        </div>
      {:else}
        <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
          <i class="fa-solid fa-leaf" style="font-size: 48px; color: var(--bb-card-border); margin-bottom: 20px;"></i>
          <h3>No bouquets match your filter choices.</h3>
          <p style="color: var(--bb-text-light); margin-top: 10px;">Try clearing filters to explore all items.</p>
        </div>
      {/each}
    </div>
  </main>
</div>

<Footer />
