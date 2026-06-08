<script>
  import '../app.css';
  import { cartStore } from '$lib/stores/cart.js';
  import { onMount } from 'svelte';

  let cartCount = 0;
  
  // Reactive subscription to cart count
  $: cartCount = $cartStore.reduce((sum, item) => sum + item.quantity, 0);

  let showWhatsAppChat = false;
  let showWhatsAppBubble = true;
  let chatMessages = [
    { sender: 'agent', text: 'Hello! 🌸 I am your Blooming Blossom celebration companion. Need help choosing the perfect arrangement or scheduling a reminder? Ask me anything!' }
  ];
  let chatInput = '';
  
  let toastText = '';
  let showToast = false;
  
  function toggleWhatsAppChat() {
    showWhatsAppChat = !showWhatsAppChat;
    if (showWhatsAppChat) showWhatsAppBubble = false;
  }
  
  function sendChatMessage(e) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    chatMessages = [...chatMessages, { sender: 'user', text: chatInput }];
    const userMsg = chatInput;
    chatInput = '';
    
    setTimeout(() => {
      let reply = "I'd be glad to assist with that. Are you purchasing flowers for an upcoming celebration, or would you like to set up a calendar reminder?";
      const lower = userMsg.toLowerCase();
      if (lower.includes('order') || lower.includes('track')) {
        reply = `Sure! You can track your recent orders in your <a href="/dashboard/orders" style="color: var(--bb-pink); font-weight: 600;">Orders page</a>. Your active order is #BB20450.`;
      } else if (lower.includes('sunflower') || lower.includes('pure sun')) {
        reply = `Great choice! The <b>Pure Sun</b> Sunflower bouquet is highly recommended. You can buy it directly <a href="/product/pure-sun" style="color: var(--bb-pink); font-weight: 600;">here</a>!`;
      }
      chatMessages = [...chatMessages, { sender: 'agent', text: reply }];
    }, 1000);
  }
  
  function dismissToast() {
    showToast = false;
  }
  
  onMount(() => {
    // Emotional Engine reminder triggers after 8s
    setTimeout(() => {
      toastText = `<b>Mom's Birthday</b> is in 12 days! We've selected 5 bouquets she'll love.<br><a href="/shop?occasion=birthday" style="color: var(--bb-pink); font-weight:700; font-size:11px; text-decoration: underline;">View suggestions</a>`;
      showToast = true;
      setTimeout(() => showToast = false, 12000);
    }, 8000);
  });
</script>

<!-- Header -->
<header class="site-header">
  <div class="container header-container">
    <a href="/" class="logo">
      <div class="logo-icon">BB</div>
      <div class="logo-text">
        BLOOMING BLOSSOM
        <span>Flowers & Gifts</span>
      </div>
    </a>

    <!-- Navigation links -->
    <nav>
      <ul class="nav-menu">
        <li><a href="/" class="nav-link">Home</a></li>
        <li><a href="/shop" class="nav-link">Shop by Collections</a></li>
        <li><a href="/dashboard/dashboard" class="nav-link">BB Moments</a></li>
        <li><a href="/about" class="nav-link">About Us</a></li>
        <li><a href="/contact" class="nav-link">Contact Us</a></li>
      </ul>
    </nav>

    <!-- Header actions -->
    <div class="header-actions">
      <a href="/shop" class="search-trigger" title="Search Flowers">
        <i class="fa-solid fa-magnifying-glass"></i>
      </a>
      <a href="/dashboard/dashboard" class="profile-trigger" title="My Account">
        <i class="fa-solid fa-user"></i>
      </a>
      <a href="/cart" class="cart-trigger" title="Cart">
        <i class="fa-solid fa-shopping-bag"></i>
        <span class="cart-count">{cartCount}</span>
      </a>
    </div>
  </div>
</header>

<!-- Main Page Router Content Slot -->
<main id="app">
  <slot />
</main>

<!-- Floating WhatsApp Widget -->
<!-- svelte-ignore a11y-invalid-attribute -->
<a href="#" class="whatsapp-widget" id="whatsapp-btn" on:click|preventDefault={toggleWhatsAppChat}>
  <i class="fa-brands fa-whatsapp"></i>
  {#if showWhatsAppBubble}
    <span class="whatsapp-bubble">Need help choosing flowers? Chat with us</span>
  {/if}
</a>

<!-- WhatsApp Simulated Chatbox -->
{#if showWhatsAppChat}
  <div class="modal-overlay" style="align-items: flex-end; justify-content: flex-end; padding: 24px; display: flex; opacity: 1; visibility: visible; pointer-events: none;">
    <div class="modal-container" style="pointer-events: auto; width: 340px; margin: 0; border-radius: var(--radius-md); box-shadow: var(--shadow-lg); overflow: hidden; padding: 0;">
      <div style="background-color: #075E54; color: #FFFFFF; padding: 16px; display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 36px; height: 36px; border-radius: 50%; background-color: #128C7E; display: flex; align-items: center; justify-content: center; font-size: 18px;">🌸</div>
          <div>
            <h4 style="color: #FFFFFF; font-size: 14px;">Floral Expert</h4>
            <span style="font-size: 10px; opacity: 0.8; display: block;">Typically replies instantly</span>
          </div>
        </div>
        <button style="color: #FFFFFF;" on:click={toggleWhatsAppChat}><i class="fa-solid fa-xmark"></i></button>
      </div>
      
      <div style="height: 240px; background-color: #ECE5DD; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;">
        {#each chatMessages as msg}
          <div style="padding: 10px 14px; border-radius: 8px; font-size: 13px; max-width: 80%; box-shadow: 0 1px 1px rgba(0,0,0,0.1); 
                      {msg.sender === 'user' ? 'background-color: #E2F7CB; align-self: flex-end;' : 'background-color: #FFFFFF; align-self: flex-start;'}">
            {@html msg.text}
          </div>
        {/each}
      </div>

      <form on:submit={sendChatMessage} style="display: flex; border-top: 1px solid var(--bb-card-border); padding: 8px; background-color: #FFFFFF;">
        <input type="text" bind:value={chatInput} placeholder="Type a message..." style="flex: 1; border: none; padding: 8px 12px; font-size: 13px;">
        <button type="submit" style="color: #075E54; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 16px;"><i class="fa-solid fa-paper-plane"></i></button>
      </form>
    </div>
  </div>
{/if}

<!-- Simulated Notification Toast -->
{#if showToast}
  <div id="simulated-notification-toast" style="position: fixed; top: 20px; right: 20px; background-color: #FFFFFF; border-left: 4px solid var(--bb-pink); border-radius: var(--radius-sm); padding: 16px 20px; box-shadow: var(--shadow-md); z-index: 10000; transform: translateX(0); display: flex; align-items: center; gap: 14px; max-width: 320px;">
    <div style="font-size: 24px; color: var(--bb-pink);"><i class="fa-brands fa-whatsapp"></i></div>
    <div>
      <h5 style="font-size: 13px; font-weight: 700; margin-bottom: 2px;">BB Moments Reminder</h5>
      <p style="font-size: 12px; color: var(--bb-text-body);">{@html toastText}</p>
    </div>
    <button on:click={dismissToast} style="color: var(--bb-text-light); margin-left: auto; font-size: 14px;"><i class="fa-solid fa-xmark"></i></button>
  </div>
{/if}
