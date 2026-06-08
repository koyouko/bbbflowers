<script>
  import { cartStore } from '$lib/stores/cart.js';
  import { upsellAddons } from '$lib/data.js';
  import { onMount } from 'svelte';
  import Footer from '$lib/components/Footer.svelte';

  let hasDiscount = false;
  let couponInput = '';
  let couponMsg = '';
  let couponColor = 'var(--bb-text-main)';

  onMount(() => {
    if (typeof window !== 'undefined') {
      hasDiscount = localStorage.getItem('bb_applied_discount') === 'true';
    }
  });

  function applyCoupon() {
    if (couponInput.trim().toUpperCase() === 'WELCOME50') {
      hasDiscount = true;
      localStorage.setItem('bb_applied_discount', 'true');
      couponMsg = 'Coupon applied! AED 50.00 off.';
      couponColor = 'var(--bb-success)';
    } else {
      couponMsg = 'Invalid coupon code. Try WELCOME50.';
      couponColor = 'var(--bb-error)';
    }
  }

  function quickAddAddon(addon) {
    cartStore.add({
      id: addon.id,
      name: addon.name,
      price: addon.price,
      img: addon.img,
      size: 'Standard',
      shape: 'Addon',
      wrapping: 'None',
      quantity: 1,
      deliveryLocation: 'Dubai Marina, UAE',
      deliveryDate: new Date().toISOString().split('T')[0],
      deliverySlot: '3:00 PM - 6:00 PM'
    });
    alert(`${addon.name} added to cart!`);
  }

  // Reactive price calculations
  let subtotal = 0;
  let total = 0;
  $: subtotal = $cartStore.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  $: total = Math.max(0, subtotal - (hasDiscount ? 50 : 0));
</script>

<div class="container cart-grid">
  {#if $cartStore.length === 0}
    <div style="grid-column: 1/-1; text-align: center; padding: 80px 20px;">
      <i class="fa-solid fa-shopping-bag" style="font-size: 64px; color: var(--bb-card-border); margin-bottom: 20px;"></i>
      <h2>Your Cart is empty.</h2>
      <p style="color: var(--bb-text-light); margin-top: 10px;">Fill it with luxury blooms and make someone smile!</p>
      <a href="/shop" class="btn btn-primary" style="margin-top: 30px;">Shop Collections</a>
    </div>
  {:else}
    <!-- Cart Items List -->
    <div>
      <h2 style="font-size: 28px; font-family: 'Playfair Display', serif; margin-bottom: 24px;">Your Cart ({$cartStore.length})</h2>
      <div class="cart-items-list">
        {#each $cartStore as item}
          <div class="cart-item-row">
            <img src="/{item.img}" class="cart-item-img" alt={item.name}>
            <div class="cart-item-details">
              <h3 class="cart-item-name">{item.name}</h3>
              <div class="cart-item-meta">
                <span>Shape: <b>{item.shape}</b></span> &bull; 
                <span>Roses: <b>{item.size}</b></span> &bull; 
                <span>Wrapping: <b>{item.wrapping}</b></span>
                {#if item.addons && item.addons.length > 0}
                  <div style="margin-top: 4px;">Extras: <b>{item.addons.map(a => a.name).join(', ')}</b></div>
                {/if}
                <div style="font-size: 11px; margin-top: 6px; color: var(--bb-pink); font-weight: 500;">
                  <i class="fa-solid fa-truck"></i> Delivering to {item.deliveryLocation.split(',')[0]} on {item.deliveryDate}
                </div>
              </div>
              <div class="cart-item-actions">
                <div class="quantity-controller">
                  <button class="qty-btn" on:click={() => cartStore.updateQty(item.cartItemId, item.quantity - 1)}>-</button>
                  <span class="qty-value">{item.quantity}</span>
                  <button class="qty-btn" on:click={() => cartStore.updateQty(item.cartItemId, item.quantity + 1)}>+</button>
                </div>
                <div class="cart-item-price">AED {(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
            <button class="remove-cart-item" on:click={() => cartStore.remove(item.cartItemId)}><i class="fa-solid fa-trash-can"></i></button>
          </div>
        {/each}
      </div>

      <!-- Quick Add Addons -->
      <div style="margin-top: 40px;">
        <h4 style="font-size: 16px; font-weight: 700; margin-bottom: 16px;">Add something extra to make it more special</h4>
        <div class="product-grid" style="grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px;">
          {#each upsellAddons as addon}
            <div class="product-card" style="padding: 12px; align-items: center; text-align: center;">
              <img src="/{addon.img}" style="width: 80px; aspect-ratio: 1; object-fit: cover; border-radius: var(--radius-sm);" alt={addon.name}>
              <h5 style="font-size: 13px; font-family: 'Outfit', sans-serif; font-weight: 600; margin: 10px 0 4px;">{addon.name}</h5>
              <div style="color: var(--bb-pink); font-weight: 700; font-size: 13px; margin-bottom: 8px;">AED {addon.price}</div>
              <button class="btn btn-secondary btn-sm" on:click={() => quickAddAddon(addon)} style="width: 100%; padding: 4px 8px; font-size: 12px;">Add</button>
            </div>
          {/each}
        </div>
      </div>
    </div>

    <!-- Summary Sidebar -->
    <aside class="order-summary-sidebar">
      <h3 class="summary-title">Order Summary</h3>
      <div class="summary-row">
        <span>Subtotal</span>
        <span>AED {subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Delivery Fee</span>
        <span style="color: var(--bb-success); font-weight: 600;">FREE</span>
      </div>
      {#if hasDiscount}
        <div class="summary-row" style="color: var(--bb-success); font-weight: 600;">
          <span>Discount (WELCOME50)</span>
          <span>- AED 50.00</span>
        </div>
      {/if}
      <div class="summary-row total">
        <span>Total</span>
        <span>AED {total.toFixed(2)}</span>
      </div>

      <!-- Coupon -->
      <div class="coupon-section">
        <input type="text" bind:value={couponInput} class="input-style" placeholder="Promo Code (e.g. WELCOME50)" style="padding: 8px 12px; font-size: 13px;" disabled={hasDiscount}>
        <button class="btn btn-outline btn-sm" on:click={applyCoupon} disabled={hasDiscount}>Apply</button>
      </div>
      {#if couponMsg}
        <div style="font-size: 12px; color: {couponColor}; font-weight: 600; margin-bottom: 16px;">{couponMsg}</div>
      {/if}

      <a href="/checkout" class="btn btn-primary btn-block">Proceed to Checkout <i class="fa-solid fa-arrow-right"></i></a>
      <a href="/shop" class="btn btn-outline btn-block" style="margin-top: 10px;">Continue Shopping</a>
    </aside>
  {/if}
</div>

<Footer />
