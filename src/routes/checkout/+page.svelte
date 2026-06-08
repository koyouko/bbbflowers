<script>
  import { cartStore } from '$lib/stores/cart.js';
  import { profile, orders, addresses } from '$lib/stores/dashboard.js';
  import { deliveryLocations } from '$lib/data.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import Footer from '$lib/components/Footer.svelte';

  let subtotal = 0;
  let hasDiscount = false;
  let total = 0;

  // Sync calculations
  $: subtotal = $cartStore.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  $: total = Math.max(0, subtotal - (hasDiscount ? 50 : 0));

  let activeStep = 1;
  let activePayment = 'credit-card';
  let activeCardTemplate = 'Birthday';
  let selectedToneIdx = 0;

  const greetingTemplates = {
    Birthday: [
      { tone: 'Sweet', text: "Dearest {name}, wishing you a day as bright and beautiful as your smile. Happy Birthday!" },
      { tone: 'Warm', text: "Happy Birthday, {name}! May this year bring you endless joy, peace, and all the success you deserve." },
      { tone: 'Elegant', text: "Sending you warmest wishes on your birthday, {name}. May your day be as exquisite and wonderful as you are." }
    ],
    Anniversary: [
      { tone: 'Romantic', text: "Happy Anniversary, {name}! Every day with you is a beautiful page in our love story. Cheers to forever." },
      { tone: 'Deep', text: "Happy Anniversary, {name}! Wishing you endless love, happiness, and beautiful years ahead. Love always." },
      { tone: 'Short', text: "To another year of sharing sunsets, laughter, and dreams. Happy Anniversary, {name}!" }
    ],
    Romance: [
      { tone: 'Poetic', text: "Just wanted to remind you how much you mean to me, {name}. You make my world bloom. Thinking of you today!" },
      { tone: 'Sweet', text: "No matter how busy the day gets, you are always on my mind, {name}. Sending you these blooms to make you smile." },
      { tone: 'Passionate', text: "Dearest {name}, my love for you grows with each passing day. You are my today and all of my tomorrows." }
    ],
    "Get Well": [
      { tone: 'Warm', text: "Dearest {name}, sending you healing thoughts, strength, and warm wishes. Hope you feel better and recover quickly!" },
      { tone: 'Soothing', text: "Wishing you a speedy recovery, {name}. May these flowers bring a touch of sunshine and cheer to your day." }
    ],
    Congrats: [
      { tone: 'Proud', text: "Huge congratulations, {name}! So proud of your amazing achievement. You deserve all the success!" },
      { tone: 'Excited', text: "Cheers to your new milestone, {name}! Wishing you the very best in this exciting new chapter." }
    ],
    "Thank You": [
      { tone: 'Grateful', text: "Dearest {name}, thank you for your kindness, generosity, and support. I am incredibly grateful to have you in my life." },
      { tone: 'Appreciative', text: "Thank you so much, {name}! Your help meant the world to me, and I wanted to send these flowers as a small token of my appreciation." }
    ]
  };

  let fullName = '';
  let phone = '';
  let addressDetails = '';
  let deliveryCity = deliveryLocations[0];
  let deliveryDate = new Date().toISOString().split('T')[0];
  let greetingCardText = '';

  let selectedAddressIdx = '';

  onMount(() => {
    if (typeof window !== 'undefined') {
      hasDiscount = localStorage.getItem('bb_applied_discount') === 'true';
    }
    
    // Default form to first address
    if ($addresses.length > 0) {
      selectedAddressIdx = '0';
      loadSelectedAddress(0);
    }
  });

  function loadSelectedAddress(idx) {
    const ad = $addresses[idx];
    if (ad) {
      fullName = ad.recipient;
      phone = ad.phone;
      addressDetails = ad.address;
    }
  }

  function handleAddressSelectChange() {
    if (selectedAddressIdx !== '') {
      loadSelectedAddress(parseInt(selectedAddressIdx));
    } else {
      fullName = '';
      phone = '';
      addressDetails = '';
    }
  }

  function selectCardTemplate(tpl) {
    activeCardTemplate = tpl;
    selectedToneIdx = 0;
  }

  $: {
    const templates = greetingTemplates[activeCardTemplate] || [];
    const item = templates[selectedToneIdx] || templates[0];
    if (item) {
      const namePlaceholder = fullName.trim() || 'Recipient';
      greetingCardText = item.text.replace(/{name}/g, namePlaceholder);
    }
  }

  function nextToCard() {
    if (fullName && phone && addressDetails) {
      activeStep = 2;
    } else {
      alert('Please fill out all delivery fields.');
    }
  }

  function nextToPayment() {
    activeStep = 3;
  }

  function prevToDelivery() {
    activeStep = 1;
  }

  function prevToCard() {
    activeStep = 2;
  }

  // Handle final checkout order placement
  function handlePlaceOrder() {
    if ($cartStore.length === 0) return;

    const orderId = 'BB' + (20480 + $orders.length + 1);
    const newOrder = {
      id: orderId,
      date: new Date().toISOString().split('T')[0],
      itemSummary: $cartStore.map(i => `${i.name} (${i.size})`).join(', '),
      total: total,
      recipient: fullName,
      status: 'Order Confirmed',
      img: $cartStore[0].img,
      deliveryDetails: {
        fullName,
        phone,
        address: addressDetails,
        city: deliveryCity,
        date: deliveryDate,
        greetingCardText
      },
      paymentMethod: activePayment,
      items: [...$cartStore]
    };

    // Save order
    orders.update(current => [newOrder, ...current]);

    // Clear cart and local discount
    cartStore.clear();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('bb_applied_discount');
    }

    // Update Profile
    profile.update(prof => {
      prof.ordersCompleted += 1;
      prof.points += Math.floor(total / 10) * 10;
      if (prof.ordersCompleted >= 5) prof.memberTier = "BB Gold Member";
      return { ...prof };
    });

    // Go to tracking
    goto(`/tracking/${orderId}`);
  }
</script>

<div class="container" style="padding: 40px 0;">
  {#if $cartStore.length === 0}
    <div style="text-align: center; padding: 60px 20px;">
      <h2>No items in cart to checkout.</h2>
      <a href="/shop" class="btn btn-primary" style="margin-top: 20px;">Back to Shop</a>
    </div>
  {:else}
    <!-- Steps Breadcrumb -->
    <div class="checkout-steps">
      <div class="step-node {activeStep >= 1 ? 'completed' : ''} {activeStep === 1 ? 'active' : ''}">
        <div class="step-circle">1</div>
        <span class="step-label">Delivery Details</span>
      </div>
      <div class="step-node {activeStep >= 2 ? 'completed' : ''} {activeStep === 2 ? 'active' : ''}">
        <div class="step-circle">2</div>
        <span class="step-label">Greeting Card</span>
      </div>
      <div class="step-node {activeStep === 3 ? 'active' : ''}">
        <div class="step-circle">3</div>
        <span class="step-label">Payment Mode</span>
      </div>
    </div>

    <div class="cart-grid">
      <!-- Checkout Options -->
      <div class="dashboard-card">
        <form on:submit|preventDefault={handlePlaceOrder}>
          
          <!-- STEP 1: DELIVERY -->
          {#if activeStep === 1}
            <div>
              <h3 style="font-size: 20px; margin-bottom: 20px; border-bottom: 1px solid var(--bb-card-border); padding-bottom: 10px;">1. Delivery Location & Recipient</h3>
              
              {#if $addresses.length > 0}
                <div style="margin-bottom: 20px;">
                  <label class="input-label" for="chk-saved-addr">Select from Saved Addresses</label>
                  <select class="input-style" id="chk-saved-addr" bind:value={selectedAddressIdx} on:change={handleAddressSelectChange}>
                    <option value="">-- Enter New Address --</option>
                    {#each $addresses as addr, idx}
                      <option value={idx.toString()}>{addr.label}: {addr.recipient} ({addr.address})</option>
                    {/each}
                  </select>
                </div>
              {/if}

              <div class="modal-form-group">
                <label class="input-label" for="chk-fullname">Recipient Full Name *</label>
                <input type="text" id="chk-fullname" class="input-style" bind:value={fullName} required>
              </div>
              <div class="modal-form-group">
                <label class="input-label" for="chk-phone">Mobile Contact Number *</label>
                <input type="text" id="chk-phone" class="input-style" bind:value={phone} required>
              </div>
              <div class="modal-form-group">
                <label class="input-label" for="chk-address">Detailed Address / Villa / Landmark *</label>
                <input type="text" id="chk-address" class="input-style" bind:value={addressDetails} required>
              </div>
              <div class="delivery-form-grid" style="margin-top: 16px;">
                <div>
                  <label class="input-label" for="chk-city">Select Delivery Location</label>
                  <select class="input-style" id="chk-city" bind:value={deliveryCity}>
                    {#each deliveryLocations as loc}
                      <option value={loc}>{loc}</option>
                    {/each}
                  </select>
                </div>
                <div>
                  <label class="input-label" for="chk-date">Preferred Delivery Date</label>
                  <input type="date" id="chk-date" class="input-style" bind:value={deliveryDate} required>
                </div>
              </div>

              <button type="button" class="btn btn-primary btn-block" style="margin-top: 30px;" on:click={nextToCard}>Continue to Greeting Card</button>
            </div>
          {/if}

          <!-- STEP 2: GREETING CARD -->
          {#if activeStep === 2}
            <div>
              <h3 style="font-size: 20px; margin-bottom: 20px; border-bottom: 1px solid var(--bb-card-border); padding-bottom: 10px;">2. Add a Custom Greeting Card</h3>
              <p style="font-size: 13px; color: var(--bb-text-light); margin-bottom: 16px;">We will print this message on a premium card and tuck it inside the wrapping paper.</p>
              
              <div class="greeting-card-writer">
                <!-- Occasion Categories -->
                <div class="card-templates" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px;">
                  {#each Object.keys(greetingTemplates) as occasion}
                    <button type="button" 
                            class="template-btn {activeCardTemplate === occasion ? 'active' : ''}" 
                            on:click={() => selectCardTemplate(occasion)}>
                      {#if occasion === 'Birthday'}🎂
                      {:else if occasion === 'Anniversary'}💍
                      {:else if occasion === 'Romance'}❤️
                      {:else if occasion === 'Get Well'}🩹
                      {:else if occasion === 'Congrats'}🎓
                      {:else if occasion === 'Thank You'}🙏{/if}
                      {occasion}
                    </button>
                  {/each}
                </div>

                <!-- Tone Selection -->
                <div class="tone-selector" style="display: flex; gap: 10px; margin-bottom: 16px; align-items: center;">
                  <span style="font-size: 12px; font-weight: 700; color: var(--bb-text-light); text-transform: uppercase;">Message Tone:</span>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    {#each greetingTemplates[activeCardTemplate] as item, idx}
                      <button type="button" 
                              class="tone-btn" 
                              style="font-size: 12px; padding: 4px 12px; border-radius: var(--radius-full); border: 1px solid {selectedToneIdx === idx ? 'var(--bb-pink)' : 'var(--bb-card-border)'}; background-color: {selectedToneIdx === idx ? 'var(--bb-pink-bg)' : '#FFFFFF'}; color: {selectedToneIdx === idx ? 'var(--bb-pink)' : 'var(--bb-text-main)'}; font-weight: 600; cursor: pointer;"
                              on:click={() => { selectedToneIdx = idx; }}>
                        {item.tone}
                      </button>
                    {/each}
                  </div>
                </div>

                <textarea class="greeting-textarea" bind:value={greetingCardText} placeholder="Write your personal message here..."></textarea>
              </div>

              <div style="display: flex; gap: 16px; margin-top: 30px;">
                <button type="button" class="btn btn-outline" on:click={prevToDelivery}>Back</button>
                <button type="button" class="btn btn-primary" style="flex: 1;" on:click={nextToPayment}>Proceed to Payment</button>
              </div>
            </div>
          {/if}

          <!-- STEP 3: PAYMENT -->
          {#if activeStep === 3}
            <div>
              <h3 style="font-size: 20px; margin-bottom: 20px; border-bottom: 1px solid var(--bb-card-border); padding-bottom: 10px;">3. Select Payment Method</h3>
              
              <div class="payment-selector">
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="payment-option {activePayment === 'credit-card' ? 'active' : ''}" on:click={() => activePayment = 'credit-card'}>
                  <input type="radio" name="pay-opt" value="credit-card" checked={activePayment === 'credit-card'}>
                  <div>
                    <h4 style="font-size: 14px; font-weight: 700;"><i class="fa-solid fa-credit-card"></i> Credit / Debit Card</h4>
                    <p style="font-size: 11px; color: var(--bb-text-light);">Visa, Mastercard, AMEX secure gateway</p>
                  </div>
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="payment-option {activePayment === 'apple-pay' ? 'active' : ''}" on:click={() => activePayment = 'apple-pay'}>
                  <input type="radio" name="pay-opt" value="apple-pay" checked={activePayment === 'apple-pay'}>
                  <div>
                    <h4 style="font-size: 14px; font-weight: 700;"><i class="fa-brands fa-apple-pay"></i> Apple Pay</h4>
                    <p style="font-size: 11px; color: var(--bb-text-light);">One click instant secure checkout</p>
                  </div>
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="payment-option {activePayment === 'tabby' ? 'active' : ''}" on:click={() => activePayment = 'tabby'}>
                  <input type="radio" name="pay-opt" value="tabby" checked={activePayment === 'tabby'}>
                  <div>
                    <h4 style="font-size: 14px; font-weight: 700;"><i class="fa-solid fa-clock-rotate-left"></i> Buy Now, Pay Later (tabby)</h4>
                    <p style="font-size: 11px; color: var(--bb-text-light);">Split into 4 interest-free payments of AED {(total/4).toFixed(2)}</p>
                  </div>
                </div>
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="payment-option {activePayment === 'cash' ? 'active' : ''}" on:click={() => activePayment = 'cash'}>
                  <input type="radio" name="pay-opt" value="cash" checked={activePayment === 'cash'}>
                  <div>
                    <h4 style="font-size: 14px; font-weight: 700;"><i class="fa-solid fa-money-bill-wave"></i> Cash on Delivery (COD)</h4>
                    <p style="font-size: 11px; color: var(--bb-text-light);">Pay at your doorstep upon receiving flowers</p>
                  </div>
                </div>
              </div>

              <div style="display: flex; gap: 16px; margin-top: 30px;">
                <button type="button" class="btn btn-outline" on:click={prevToCard}>Back</button>
                <button type="submit" class="btn btn-primary" style="flex: 1;"><i class="fa-solid fa-lock"></i> Place Order - AED {total.toFixed(2)}</button>
              </div>
            </div>
          {/if}

        </form>
      </div>

      <!-- Summary Sidebar -->
      <aside class="order-summary-sidebar">
        <h3 class="summary-title">Your Order</h3>
        <div style="max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px;">
          {#each $cartStore as item}
            <div style="display: flex; gap: 10px; font-size: 13px;">
              <img src="/{item.img}" style="width: 42px; aspect-ratio: 1; object-fit: cover; border-radius: 4px;" alt={item.name}>
              <div style="flex: 1;">
                <div style="font-weight: 600;">{item.name} ({item.size})</div>
                <div style="color: var(--bb-text-light);">Qty: {item.quantity} &bull; AED {(item.price * item.quantity).toFixed(2)}</div>
              </div>
            </div>
          {/each}
        </div>

        <div class="summary-row" style="font-size: 13px; border-top: 1px solid var(--bb-card-border); padding-top: 12px;">
          <span>Subtotal</span>
          <span>AED {subtotal.toFixed(2)}</span>
        </div>
        <div class="summary-row" style="font-size: 13px;">
          <span>Delivery Fee</span>
          <span style="color: var(--bb-success); font-weight: 600;">FREE</span>
        </div>
        {#if hasDiscount}
          <div class="summary-row" style="font-size: 13px; color: var(--bb-success); font-weight: 600;">
            <span>Discount</span>
            <span>- AED 50.00</span>
          </div>
        {/if}
        <div class="summary-row total" style="font-size: 16px;">
          <span>Total Amount</span>
          <span>AED {total.toFixed(2)}</span>
        </div>
      </aside>
    </div>
  {/if}
</div>

<Footer />
