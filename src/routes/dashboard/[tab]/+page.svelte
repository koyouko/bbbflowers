<script>
  import { page } from '$app/stores';
  import { profile, wishlist, orders, addresses, reminders } from '$lib/stores/dashboard.js';
  import { celebrationsStore } from '$lib/stores/celebrations.js';
  import { bouquetsList, deliveryLocations, upsellAddons } from '$lib/data.js';
  import { cartStore } from '$lib/stores/cart.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  $: activeTab = $page.params.tab || 'dashboard';

  // Modal display toggles
  let showCelebrationModal = false;
  let showAddressModal = false;

  // Celebration form fields binding
  let celId = null;
  let celName = '';
  let celCategory = 'personal';
  let celDate = '';
  let celReminder = '7 days before';
  let celBudget = '';
  let celFlower = '';
  let celNotes = '';

  // Address form fields binding
  let addrId = null;
  let addrLabel = '';
  let addrRecipient = '';
  let addrDetails = '';
  let addrPhone = '';
  let addrType = 'Home';

  // Calendar state
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  $: daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  $: firstDayIdx = new Date(currentYear, currentMonth, 1).getDay();

  // Corporate Portal CSV import simulation variables
  let csvFileName = '';
  let csvLoadedCount = 0;
  let corpOccasion = '';
  let corpBouquet = 'Elegant Grace (White Lilies + Roses)';

  // Open Modal helpers
  function openCelModal(event = null) {
    if (event) {
      celId = event.id;
      celName = event.name;
      celCategory = event.category;
      celDate = event.date;
      celReminder = event.reminder;
      celBudget = event.budget || '';
      celFlower = event.preferredFlower || '';
      celNotes = event.notes || '';
    } else {
      celId = null;
      celName = '';
      celCategory = 'personal';
      celDate = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0]; // Default +10 days
      celReminder = '7 days before';
      celBudget = '';
      celFlower = '';
      celNotes = '';
    }
    showCelebrationModal = true;
  }

  function submitCelebrationForm() {
    const newEvent = {
      name: celName,
      category: celCategory,
      date: celDate,
      reminder: celReminder,
      budget: parseFloat(celBudget) || null,
      preferredFlower: celFlower,
      notes: celNotes
    };
    if (celId) newEvent.id = celId;
    
    celebrationsStore.save(newEvent);
    showCelebrationModal = false;
  }

  function deleteCelebration(id) {
    if (confirm('Are you sure you want to delete this celebration?')) {
      celebrationsStore.delete(id);
    }
  }

  function openAddrModal(addr = null) {
    if (addr) {
      addrId = addr.id;
      addrLabel = addr.label;
      addrRecipient = addr.recipient;
      addrDetails = addr.address;
      addrPhone = addr.phone;
      addrType = addr.type;
    } else {
      addrId = null;
      addrLabel = '';
      addrRecipient = '';
      addrDetails = '';
      addrPhone = '';
      addrType = 'Home';
    }
    showAddressModal = true;
  }

  function submitAddressForm() {
    const newAddr = {
      label: addrLabel,
      recipient: addrRecipient,
      address: addrDetails,
      phone: addrPhone,
      type: addrType
    };
    if (addrId) newAddr.id = addrId;
    
    addresses.save(newAddr);
    showAddressModal = false;
  }

  function deleteAddress(id) {
    if (confirm('Delete this address?')) {
      addresses.delete(id);
    }
  }

  // Calendar Navigation
  function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
  }
  
  function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
  }

  function handleCalendarCellClick(day) {
    const monthStr = (currentMonth + 1) < 10 ? '0' + (currentMonth + 1) : (currentMonth + 1);
    const dayStr = day < 10 ? '0' + day : day;
    const dateKey = `${currentYear}-${monthStr}-${dayStr}`;

    const activeEvents = $celebrationsStore.filter(c => {
      const parts = c.date.split('-');
      return parseInt(parts[1]) === (currentMonth + 1) && parseInt(parts[2]) === day;
    });

    if (activeEvents.length > 0) {
      const ev = activeEvents[0];
      alert(`Occasion: ${ev.name}\nBudget: AED ${ev.budget || 'Open'}\nPreferences: ${ev.preferredFlower || 'None'}`);
    } else {
      if (confirm(`No event scheduled on ${months[currentMonth]} ${day}. Add one?`)) {
        openCelModal();
        celDate = dateKey;
      }
    }
  }

  // Corporate CSV Mock loading
  function handleCsvFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      csvFileName = file.name;
      csvLoadedCount = 16; // Simulate parsed contacts
    }
  }

  // Repeat last order helper
  function repeatLastOrder(order) {
    cartStore.add({
      id: 'red-moon',
      name: order.itemSummary.split('(')[0].trim(),
      price: order.total,
      img: order.img,
      size: '50 Roses',
      shape: 'Bouquet',
      wrapping: 'Black',
      quantity: 1,
      deliveryLocation: 'Dubai Marina, UAE',
      deliveryDate: new Date().toISOString().split('T')[0],
      deliverySlot: '3:00 PM - 6:00 PM'
    });
    alert('Last order items copied to cart!');
    goto('/cart');
  }

  // Profile Form Updates
  let profFirst = '';
  let profLast = '';
  let profEmail = '';
  let profPhone = '';

  profile.subscribe(val => {
    profFirst = val.name;
    profLast = val.lastName;
    profEmail = val.email;
    profPhone = val.phone;
  });

  function submitProfileForm() {
    profile.update(current => {
      current.name = profFirst;
      current.lastName = profLast;
      current.email = profEmail;
      current.phone = profPhone;
      return { ...current };
    });
    alert('Profile updated successfully!');
  }
</script>

<div class="dashboard-shell">
  <!-- Left Sidebar Navigation -->
  <aside class="dashboard-sidebar">
    <div class="dashboard-profile-summary">
      <img src="/assets/products/profile_avatar.svg" class="profile-avatar" alt="Avatar">
      <div class="profile-summary-text">
        <h4>Hello, {$profile.name} 🌸</h4>
        <p>{$profile.memberTier}</p>
      </div>
    </div>

    <ul class="dashboard-nav">
      <li class="dashboard-nav-item {activeTab === 'dashboard' ? 'active' : ''}">
        <a href="/dashboard/dashboard"><i class="fa-solid fa-house-chimney"></i> Dashboard</a>
      </li>
      <li class="dashboard-nav-item {activeTab === 'celebrations' ? 'active' : ''}">
        <a href="/dashboard/celebrations"><i class="fa-solid fa-heart"></i> My Celebrations</a>
      </li>
      <li class="dashboard-nav-item {activeTab === 'calendar' ? 'active' : ''}">
        <a href="/dashboard/calendar"><i class="fa-solid fa-calendar-days"></i> BB Calendar</a>
      </li>
      <li class="dashboard-nav-item {activeTab === 'reminders' ? 'active' : ''}">
        <a href="/dashboard/reminders"><i class="fa-solid fa-bell"></i> Reminder Center</a>
      </li>
      <li class="dashboard-nav-item {activeTab === 'orders' ? 'active' : ''}">
        <a href="/dashboard/orders"><i class="fa-solid fa-box"></i> Orders</a>
      </li>
      <li class="dashboard-nav-item {activeTab === 'addresses' ? 'active' : ''}">
        <a href="/dashboard/addresses"><i class="fa-solid fa-location-dot"></i> Saved Addresses</a>
      </li>
      <li class="dashboard-nav-item {activeTab === 'favorites' ? 'active' : ''}">
        <a href="/dashboard/favorites"><i class="fa-solid fa-star"></i> Favorite Bouquets</a>
      </li>
      <li class="dashboard-nav-item {activeTab === 'subscriptions' ? 'active' : ''}">
        <a href="/dashboard/subscriptions"><i class="fa-solid fa-calendar-check"></i> Subscription Plans</a>
      </li>
      <li class="dashboard-nav-item {activeTab === 'corporate' ? 'active' : ''}">
        <a href="/dashboard/corporate"><i class="fa-solid fa-building"></i> Corporate Gifting</a>
      </li>
      <li class="dashboard-nav-item {activeTab === 'rewards' ? 'active' : ''}">
        <a href="/dashboard/rewards"><i class="fa-solid fa-award"></i> Rewards</a>
      </li>
      <li class="dashboard-nav-item {activeTab === 'profile' ? 'active' : ''}">
        <a href="/dashboard/profile"><i class="fa-solid fa-user-gear"></i> Profile</a>
      </li>
      
      <li class="dashboard-nav-item" style="margin-top: auto;">
        <a href="/" on:click={() => cartStore.clear()}><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
      </li>
    </ul>
  </aside>

  <!-- Content Panel Area -->
  <main class="dashboard-content-area">
    
    <!-- SUB-VIEW 1: MAIN DASHBOARD -->
    {#if activeTab === 'dashboard'}
      <div class="welcome-banner">
        <h2>Welcome back, {$profile.name}!</h2>
        <p>Your personal celebration companion is ready to make your relationships bloom.</p>
        
        {#if $celebrationsStore.length > 0}
          <div class="countdown-box">
            <span class="countdown-badge"><i class="fa-solid fa-clock"></i> Next Moment: {$celebrationsStore[0].daysLeft} Days</span>
            <span><b>{$celebrationsStore[0].name}</b> is on <b>{new Date($celebrationsStore[0].date).toLocaleDateString('default', { day: 'numeric', month: 'short' })}</b></span>
          </div>
        {/if}
      </div>

      <div class="dashboard-grid-2">
        <div class="dashboard-card">
          <div class="dashboard-card-title">
            <h3>Upcoming Moments</h3>
            <a href="/dashboard/celebrations" class="dashboard-card-action">View Registry</a>
          </div>
          <div class="data-table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Occasion</th>
                  <th>Relationship</th>
                  <th>Date</th>
                  <th>Days Left</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {#each $celebrationsStore.slice(0, 4) as c}
                  <tr>
                    <td style="font-weight: 600;">{c.name}</td>
                    <td><span class="relationship-badge badge-{c.category}">{c.category}</span></td>
                    <td>{new Date(c.date).toLocaleDateString('default', { day: 'numeric', month: 'short' })}</td>
                    <td style="font-weight: 700; color: {c.daysLeft <= 15 ? 'var(--bb-pink)' : 'var(--bb-text-main)'};">{c.daysLeft} Days</td>
                    <td>
                      <a href="/shop" class="btn btn-primary btn-sm" style="padding: 6px 12px; font-size:11px;">Send Flowers</a>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>

        <div class="dashboard-card">
          <h3 class="dashboard-card-title">Quick Actions</h3>
          <div class="quick-actions-grid">
            <a href="/shop" class="quick-action-btn"><span class="quick-action-icon">💐</span> Send Flowers</a>
            <button class="quick-action-btn" on:click={() => repeatLastOrder($orders[0])} disabled={$orders.length === 0}>
              <span class="quick-action-icon">🔁</span> Repeat Last
            </button>
            <button class="quick-action-btn" on:click={() => openCelModal()}><span class="quick-action-icon">📅</span> Save New Date</button>
            <a href="/dashboard/corporate" class="quick-action-btn"><span class="quick-action-icon">🏢</span> Bulk Gifting</a>
          </div>
        </div>
      </div>

      <div class="dashboard-card">
        <div class="dashboard-card-title">
          <h3>Recent Orders</h3>
          <a href="/dashboard/orders" class="dashboard-card-action">All Orders</a>
        </div>
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Bouquet</th>
                <th>Recipient</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {#each $orders.slice(0, 3) as o}
                <tr>
                  <td style="font-weight: 700;">#{o.id}</td>
                  <td>{o.date}</td>
                  <td style="display: flex; align-items: center; gap: 10px; border-bottom: none;">
                    <img src="/{o.img}" style="width:32px; aspect-ratio:1; object-fit:cover; border-radius:4px;" alt="flowers">
                    <span>{o.itemSummary.split(',')[0]}</span>
                  </td>
                  <td>{o.recipient}</td>
                  <td style="font-weight: 700;">AED {o.total.toFixed(2)}</td>
                  <td>
                    <span style="background-color: {o.status.includes('Confirmed') ? 'var(--bb-pink-bg)' : 'var(--bb-success-bg)'}; 
                                 color: {o.status.includes('Confirmed') ? 'var(--bb-pink)' : 'var(--bb-success)'}; 
                                 padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 11px;">
                      {o.status}
                    </span>
                  </td>
                  <td>
                    <a href="/tracking/{o.id}" class="btn btn-outline btn-sm" style="padding: 4px 12px; font-size:11px;">Track</a>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    {/if}

    <!-- SUB-VIEW 2: CELEBRATIONS REGISTRY -->
    {#if activeTab === 'celebrations'}
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 28px; font-family: 'Playfair Display', serif;">My Celebrations Registry</h2>
          <p style="font-size: 14px; color: var(--bb-text-light);">Manage dates of people you care about. We trigger WhatsApp reminders before each event.</p>
        </div>
        <button class="btn btn-primary" on:click={() => openCelModal()}><i class="fa-solid fa-plus"></i> Save New Date</button>
      </div>

      <div class="celebrations-grid">
        {#each $celebrationsStore as c}
          <div class="celebration-card">
            <div class="celebration-category-line" style="background-color: var(--cat-{c.category});"></div>
            <span class="relationship-badge badge-{c.category}" style="position: absolute; top: 12px; right: 20px;">{c.category}</span>
            
            <div class="celebration-header">
              <div>
                <h4 class="celebration-name">{c.name}</h4>
                <span class="celebration-date">{new Date(c.date).toLocaleDateString('default', { day: 'numeric', month: 'long' })}</span>
              </div>
            </div>
            
            <div class="celebration-details">
              <div class="celebration-detail-row">
                <span style="color: var(--bb-text-light);">Reminder Schedule:</span>
                <span style="font-weight: 600;">{c.reminder}</span>
              </div>
              <div class="celebration-detail-row">
                <span style="color: var(--bb-text-light);">Gift Budget:</span>
                <span style="font-weight: 600;">AED {c.budget || 'Open'}</span>
              </div>
              <div class="celebration-detail-row">
                <span style="color: var(--bb-text-light);">Preferred flowers:</span>
                <span style="font-weight: 600; color: var(--bb-pink);">{c.preferredFlower || 'Any'}</span>
              </div>
              {#if c.notes}
                <div style="font-size: 11px; color: var(--bb-text-light); border-top:1px solid var(--bb-card-border); padding-top:6px; margin-top:4px;">Note: {c.notes}</div>
              {/if}
            </div>

            <div class="celebration-actions">
              <button class="btn btn-outline btn-sm" on:click={() => openCelModal(c)}><i class="fa-solid fa-pencil"></i> Edit</button>
              <button class="btn btn-secondary btn-sm" on:click={() => deleteCelebration(c.id)}><i class="fa-solid fa-trash-can"></i> Delete</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- SUB-VIEW 3: CALENDAR -->
    {#if activeTab === 'calendar'}
      <div class="calendar-wrapper">
        <div class="calendar-header">
          <h2 class="calendar-month-title">{months[currentMonth]} {currentYear}</h2>
          <div class="calendar-arrows">
            <button class="calendar-arrow-btn" on:click={prevMonth}><i class="fa-solid fa-chevron-left"></i></button>
            <button class="calendar-arrow-btn" on:click={nextMonth}><i class="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>

        <div class="calendar-days-grid">
          {#each ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as dayName}
            <div class="calendar-day-header">{dayName}</div>
          {/each}

          {#each Array(firstDayIdx) as _}
            <div class="calendar-day-cell other-month"></div>
          {/each}

          {#each Array(daysInMonth) as _, idx}
            {@const day = idx + 1}
            {@const activeEvents = $celebrationsStore.filter(c => {
              const parts = c.date.split('-');
              return parseInt(parts[1]) === (currentMonth + 1) && parseInt(parts[2]) === day;
            })}
            {@const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth && new Date().getFullYear() === currentYear}

            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="calendar-day-cell {isToday ? 'today' : ''}" on:click={() => handleCalendarCellClick(day)}>
              <span class="day-number">{day}</span>
              <div class="calendar-dots">
                {#each activeEvents as ev}
                  <span class="calendar-dot dot-{ev.category}" title={ev.name}></span>
                {/each}
              </div>
            </div>
          {/each}
        </div>

        <div style="display: flex; gap: 20px; justify-content: center; margin-top: 30px; font-size: 13px;">
          <div style="display:flex; align-items:center; gap:6px;"><span class="calendar-dot dot-personal"></span> Personal</div>
          <div style="display:flex; align-items:center; gap:6px;"><span class="calendar-dot dot-family"></span> Family</div>
          <div style="display:flex; align-items:center; gap:6px;"><span class="calendar-dot dot-friends"></span> Friends</div>
          <div style="display:flex; align-items:center; gap:6px;"><span class="calendar-dot dot-work"></span> Work</div>
        </div>
      </div>
    {/if}

    <!-- SUB-VIEW 4: REMINDER CENTER -->
    {#if activeTab === 'reminders'}
      <div class="dashboard-card" style="max-width: 700px;">
        <h2 style="font-size: 24px; font-family: 'Playfair Display', serif; margin-bottom: 12px;">Reminder Center</h2>
        <p style="font-size: 14px; color: var(--bb-text-light); margin-bottom: 24px;">Control where and when you receive celebration reminders. We recommend WhatsApp for the highest delivery rates.</p>

        <form on:submit|preventDefault={() => alert('Settings saved successfully!')}>
          <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 16px; border-bottom:1px solid var(--bb-card-border); padding-bottom:6px;">Reminder Channels</h4>
          
          <div style="display:flex; flex-direction:column; gap:16px; margin-bottom: 30px;">
            <label class="filter-checkbox-label" style="justify-content: space-between; font-weight: 600;">
              <span><i class="fa-brands fa-whatsapp" style="color: #25D366; font-size: 18px;"></i> WhatsApp Reminders (Recommended)</span>
              <input type="checkbox" bind:checked={$reminders.whatsapp} style="width: 20px; height: 20px;">
            </label>
            <label class="filter-checkbox-label" style="justify-content: space-between; font-weight: 600;">
              <span><i class="fa-solid fa-comment-sms" style="color: #2b6cb0; font-size: 16px;"></i> SMS Alerts</span>
              <input type="checkbox" bind:checked={$reminders.sms} style="width: 20px; height: 20px;">
            </label>
            <label class="filter-checkbox-label" style="justify-content: space-between; font-weight: 600;">
              <span><i class="fa-solid fa-envelope" style="color: var(--bb-pink); font-size: 16px;"></i> Email Notifications</span>
              <input type="checkbox" bind:checked={$reminders.email} style="width: 20px; height: 20px;">
            </label>
            <label class="filter-checkbox-label" style="justify-content: space-between; font-weight: 600;">
              <span><i class="fa-solid fa-bell" style="color: var(--bb-gold); font-size: 16px;"></i> Mobile App Push</span>
              <input type="checkbox" bind:checked={$reminders.push} style="width: 20px; height: 20px;">
            </label>
          </div>

          <h4 style="font-size: 15px; font-weight: 700; margin-bottom: 16px; border-bottom:1px solid var(--bb-card-border); padding-bottom:6px;">Timing Intervals</h4>
          <div class="filter-list" style="margin-bottom: 30px;">
            <label class="filter-checkbox-label"><input type="checkbox" checked disabled> 14 days before</label>
            <label class="filter-checkbox-label"><input type="checkbox" checked disabled> 7 days before</label>
            <label class="filter-checkbox-label"><input type="checkbox" checked disabled> 2 days before</label>
            <label class="filter-checkbox-label"><input type="checkbox" checked disabled> Same-day morning</label>
          </div>

          <button type="submit" class="btn btn-primary btn-block">Save Reminder Settings</button>
        </form>
      </div>
    {/if}

    <!-- SUB-VIEW 5: ORDERS -->
    {#if activeTab === 'orders'}
      <h2 style="font-size: 28px; font-family: 'Playfair Display', serif; margin-bottom: 24px;">Orders History</h2>
      <div style="display: flex; flex-direction: column; gap: 20px;">
        {#each $orders as o}
          <div class="cart-item-row" style="align-items: center;">
            <img src="/{o.img}" class="cart-item-img" style="width: 80px;" alt="flowers">
            <div class="cart-item-details">
              <h3 class="cart-item-name" style="font-size: 16px;">Order #{o.id}</h3>
              <div class="cart-item-meta" style="margin-bottom: 0;">
                <span>Date: <b>{o.date}</b></span> &bull; 
                <span>Recipient: <b>{o.recipient}</b></span> &bull; 
                <span>Total: <b>AED {o.total.toFixed(2)}</b></span>
              </div>
              <div style="margin-top: 8px;">
                <span style="background-color: {o.status.includes('Confirmed') ? 'var(--bb-pink-bg)' : 'var(--bb-success-bg)'}; 
                             color: {o.status.includes('Confirmed') ? 'var(--bb-pink)' : 'var(--bb-success)'}; 
                             padding: 4px 10px; border-radius: 4px; font-weight: 700; font-size: 11px;">
                  {o.status}
                </span>
              </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px; width: 140px;">
              <a href="/tracking/{o.id}" class="btn btn-primary btn-sm btn-block" style="font-size: 12px; padding: 6px 12px;">Track Status</a>
              <button class="btn btn-outline btn-sm btn-block" on:click={() => alert('Downloading PDF invoice...')} style="font-size: 12px; padding: 6px 12px;">Invoice</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- SUB-VIEW 6: ADDRESSES -->
    {#if activeTab === 'addresses'}
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px;">
        <div>
          <h2 style="font-size: 28px; font-family: 'Playfair Display', serif;">Saved Addresses</h2>
          <p style="font-size: 14px; color: var(--bb-text-light);">Manage shipping profiles for your friends, family, and corporate contacts.</p>
        </div>
        <button class="btn btn-primary" on:click={() => openAddrModal()}><i class="fa-solid fa-plus"></i> Add Address</button>
      </div>

      <div class="celebrations-grid">
        {#each $addresses as a}
          <div class="celebration-card">
            <div class="celebration-category-line" style="background-color: var(--bb-pink);"></div>
            
            <h4 class="celebration-name" style="margin-top: 10px; margin-bottom: 4px;">{a.label}</h4>
            <span style="font-size: 11px; background-color: var(--bb-pink-bg); color: var(--bb-pink); padding: 2px 6px; border-radius: 4px; font-weight: 700;">{a.type}</span>
            
            <div class="celebration-details" style="border-top: none; padding-top: 0; margin-top: 12px;">
              <div>Recipient: <b>{a.recipient}</b></div>
              <div>Address: <b>{a.address}</b></div>
              <div>Mobile: <b>{a.phone}</b></div>
            </div>

            <div class="celebration-actions" style="margin-top: 20px;">
              <button class="btn btn-outline btn-sm" on:click={() => openAddrModal(a)}><i class="fa-solid fa-pencil"></i> Edit</button>
              <button class="btn btn-secondary btn-sm" on:click={() => deleteAddress(a.id)}><i class="fa-solid fa-trash-can"></i> Delete</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}

    <!-- SUB-VIEW 7: FAVORITES -->
    {#if activeTab === 'favorites'}
      <h2 style="font-size: 28px; font-family: 'Playfair Display', serif; margin-bottom: 24px;">Favorite Bouquets</h2>
      {#if $wishlist.length === 0}
        <div class="dashboard-card" style="text-align: center; padding: 60px 20px;">
          <i class="fa-solid fa-star" style="font-size: 48px; color: var(--bb-card-border); margin-bottom: 16px;"></i>
          <h3>Your favorites list is empty.</h3>
          <a href="/shop" class="btn btn-primary" style="margin-top: 20px;">Browse Shop</a>
        </div>
      {:else}
        <div class="product-grid">
          {#each bouquetsList.filter(b => $wishlist.includes(b.id)) as b}
            <div class="product-card">
              <button class="wishlist-btn active" on:click={() => wishlist.toggle(b.id)}>
                <i class="fa-solid fa-heart"></i>
              </button>
              <a href="/product/{b.id}" class="product-img-wrapper">
                <img src="/{b.img}" class="product-img" alt={b.name}>
              </a>
              <div class="product-info">
                <a href="/product/{b.id}"><h3 class="product-title">{b.name}</h3></a>
                <div class="product-rating">
                  <span class="rating-stars"><i class="fa-solid fa-star"></i></span>
                  <span>{b.rating}</span>
                </div>
                <div class="product-price-row">
                  <span class="product-price">AED {b.price}</span>
                  <a href="/product/{b.id}" class="btn btn-primary btn-sm" style="padding: 6px 14px;">Gift Now</a>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    {/if}

    <!-- SUB-VIEW 8: SUBSCRIPTIONS -->
    {#if activeTab === 'subscriptions'}
      <h2 style="font-size: 28px; font-family: 'Playfair Display', serif; margin-bottom: 8px;">Subscription Plans</h2>
      <p style="font-size: 14px; color: var(--bb-text-light); margin-bottom: 24px;">Receive fresh, handcrafted flower arrangements regularly at your doorstep. Change schedules anytime.</p>
      
      <div class="product-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px;">
        <!-- Weekly -->
        <div class="celebration-card" style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
          <div class="celebration-category-line" style="background-color: var(--bb-pink);"></div>
          <div>
            <h4 style="font-size: 18px; margin-top: 10px;">Weekly Refresh</h4>
            <span style="font-size: 24px; font-weight: 700; color: var(--bb-pink); display: block; margin: 10px 0;">AED 180 / week</span>
            <p style="font-size: 13px; color: var(--bb-text-light); margin-bottom: 16px;">Deliver a new bespoke vase arrangement every Monday morning.</p>
          </div>
          <button class="btn btn-primary btn-block" on:click={() => alert('Subscription activated!')}>Subscribe Now</button>
        </div>

        <!-- Monthly -->
        <div class="celebration-card" style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
          <div class="celebration-category-line" style="background-color: var(--bb-gold);"></div>
          <div>
            <h4 style="font-size: 18px; margin-top: 10px;">Monthly Gifting</h4>
            <span style="font-size: 24px; font-weight: 700; color: var(--bb-gold); display: block; margin: 10px 0;">AED 220 / month</span>
            <p style="font-size: 13px; color: var(--bb-text-light); margin-bottom: 16px;">Select up to 12 milestones, and we auto-ship bouquets on the exact dates.</p>
          </div>
          <button class="btn btn-secondary btn-block" on:click={() => alert('Subscription activated!')}>Subscribe Now</button>
        </div>
      </div>
    {/if}

    <!-- SUB-VIEW 9: CORPORATE -->
    {#if activeTab === 'corporate'}
      <h2 style="font-size: 28px; font-family: 'Playfair Display', serif; margin-bottom: 8px;">Corporate Gifting Portal</h2>
      <p style="font-size: 14px; color: var(--bb-text-light); margin-bottom: 24px;">Upload your client or employee list to schedule automated bulk gifting deliveries.</p>

      <div class="dashboard-grid-2">
        <div class="dashboard-card">
          <h3 class="dashboard-card-title">Bulk Scheduler</h3>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div style="border: 2px dashed var(--bb-card-border); border-radius: var(--radius-sm); padding: 40px; text-align: center; margin-bottom: 20px; cursor: pointer;" on:click={() => document.getElementById('corp-file').click()}>
            <i class="fa-solid fa-file-excel" style="font-size: 48px; color: #1f7244; margin-bottom: 16px;"></i>
            {#if csvFileName}
              <h4 style="font-size: 15px; font-weight: 700; color: var(--bb-success);">Loaded: {csvFileName}</h4>
              <p style="font-size: 12px; color: var(--bb-success); margin-top: 4px;">Found {csvLoadedCount} contacts ready to schedule</p>
            {:else}
              <h4 style="font-size: 15px; font-weight: 700;">Drag & Drop Employee/Client List</h4>
              <p style="font-size: 12px; color: var(--bb-text-light); margin-top: 4px;">Supports .CSV or .XLSX sheets</p>
            {/if}
            <input type="file" id="corp-file" style="display: none;" on:change={handleCsvFileSelect} accept=".csv,.xlsx">
          </div>

          <form on:submit|preventDefault={() => alert('Bulk scheduled!')}>
            <div class="modal-form-group">
              <label class="input-label" for="corp-occ-name">Corporate Occasion Name</label>
              <input type="text" id="corp-occ-name" class="input-style" bind:value={corpOccasion} placeholder="e.g. Employee Birthdays" required>
            </div>
            <button type="submit" class="btn btn-primary btn-block">Confirm Bulk Schedule</button>
          </form>
        </div>

        <div class="dashboard-card">
          <h3 class="dashboard-card-title">Scheduled Corporate Deliveries</h3>
          <div style="font-size: 13px; color: var(--bb-text-light); display:flex; flex-direction:column; gap:16px;">
            <div style="border-bottom: 1px solid var(--bb-card-border); padding-bottom: 8px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <h5 style="font-weight:700; color:var(--bb-text-main);">Ahmed Al Maktoum</h5>
                <span>Client &bull; Eid Gifting</span>
              </div>
              <span style="font-weight:700; color:var(--bb-pink);">12 Oct</span>
            </div>
          </div>
        </div>
      </div>
    {/if}

    <!-- SUB-VIEW 10: REWARDS -->
    {#if activeTab === 'rewards'}
      <h2 style="font-size: 28px; font-family: 'Playfair Display', serif; margin-bottom: 24px;">Rewards & Surprises</h2>
      
      <div class="rewards-card">
        <span class="tier-title">{$profile.memberTier}</span>
        <div class="tier-points">{$profile.points} Points</div>
        
        <div class="rewards-progress-wrapper">
          <div class="rewards-progress-labels">
            <span>Tier Progress</span>
            <span>{$profile.ordersCompleted} / 10 orders completed for Gold Member</span>
          </div>
          <div class="rewards-progress-bar-bg">
            <div class="rewards-progress-bar" style="width: {$profile.ordersCompleted * 10}%;"></div>
          </div>
        </div>
      </div>
    {/if}

    <!-- SUB-VIEW 11: PROFILE -->
    {#if activeTab === 'profile'}
      <div class="dashboard-card" style="max-width: 600px;">
        <h2 style="font-size: 24px; font-family: 'Playfair Display', serif; margin-bottom: 20px; border-bottom:1px solid var(--bb-card-border); padding-bottom:10px;">Profile Settings</h2>
        
        <form on:submit|preventDefault={submitProfileForm}>
          <div class="modal-form-group">
            <label class="input-label" for="prof-fn">First Name *</label>
            <input type="text" id="prof-fn" class="input-style" bind:value={profFirst} required>
          </div>
          <div class="modal-form-group">
            <label class="input-label" for="prof-ln">Last Name *</label>
            <input type="text" id="prof-ln" class="input-style" bind:value={profLast} required>
          </div>
          <div class="modal-form-group">
            <label class="input-label" for="prof-em">Email Address *</label>
            <input type="email" id="prof-em" class="input-style" bind:value={profEmail} required>
          </div>
          <div class="modal-form-group">
            <label class="input-label" for="prof-ph">Mobile Contact Number *</label>
            <input type="text" id="prof-ph" class="input-style" bind:value={profPhone} required>
          </div>
          <button type="submit" class="btn btn-primary btn-block" style="margin-top: 24px;">Update Profile Details</button>
        </form>
      </div>
    {/if}

  </main>
</div>

<!-- CELEBRATION DIALOG MODAL -->
{#if showCelebrationModal}
  <div class="modal-overlay active">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">{celId ? 'Edit Celebration' : 'Save New Celebration'}</h3>
        <button class="modal-close" on:click={() => showCelebrationModal = false}><i class="fa-solid fa-xmark"></i></button>
      </div>
      <form on:submit|preventDefault={submitCelebrationForm}>
        <div class="modal-form-group">
          <label class="input-label" for="cel-m-name">Occasion Name *</label>
          <input type="text" id="cel-m-name" class="input-style" bind:value={celName} placeholder="e.g. Mom's Birthday" required>
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="cel-m-cat">Relationship Category *</label>
          <select id="cel-m-cat" class="input-style" bind:value={celCategory} required>
            <option value="personal">Personal (Self/Partner)</option>
            <option value="family">Family (Parents/Kids/Siblings)</option>
            <option value="friends">Friends (Best Friend/Others)</option>
            <option value="work">Work (Anniversary/Launch)</option>
          </select>
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="cel-m-date">Date *</label>
          <input type="date" id="cel-m-date" class="input-style" bind:value={celDate} required>
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="cel-m-rem">Notification Schedule</label>
          <select id="cel-m-rem" class="input-style" bind:value={celReminder}>
            <option value="14 days before">14 days before</option>
            <option value="7 days before">7 days before</option>
            <option value="2 days before">2 days before</option>
            <option value="Same day morning">Same day morning</option>
          </select>
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="cel-m-budget">Gift Budget (AED)</label>
          <input type="number" id="cel-m-budget" class="input-style" bind:value={celBudget} placeholder="e.g. 250" min="0">
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="cel-m-flower">Preferred Bouquet / Style</label>
          <input type="text" id="cel-m-flower" class="input-style" bind:value={celFlower} placeholder="e.g. Red Roses">
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="cel-m-notes">Special Notes</label>
          <textarea id="cel-m-notes" class="input-style" style="height: 60px;" bind:value={celNotes}></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Save Celebration Date</button>
      </form>
    </div>
  </div>
{/if}

<!-- ADDRESS DIALOG MODAL -->
{#if showAddressModal}
  <div class="modal-overlay active">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">{addrId ? 'Edit Address Profile' : 'Save Gifting Address'}</h3>
        <button class="modal-close" on:click={() => showAddressModal = false}><i class="fa-solid fa-xmark"></i></button>
      </div>
      <form on:submit|preventDefault={submitAddressForm}>
        <div class="modal-form-group">
          <label class="input-label" for="addr-m-label">Address Nickname *</label>
          <input type="text" id="addr-m-label" class="input-style" bind:value={addrLabel} placeholder="e.g. Home, Office" required>
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="addr-m-rec">Recipient Name *</label>
          <input type="text" id="addr-m-rec" class="input-style" bind:value={addrRecipient} placeholder="Who receives the flowers?" required>
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="addr-m-details">Street Address / Villa / Landmark *</label>
          <input type="text" id="addr-m-details" class="input-style" bind:value={addrDetails} placeholder="e.g. Villa 14" required>
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="addr-m-phone">Mobile Number *</label>
          <input type="text" id="addr-m-phone" class="input-style" bind:value={addrPhone} placeholder="e.g. +971 50 123 4567" required>
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="addr-m-type">Address Type</label>
          <select id="addr-m-type" class="input-style" bind:value={addrType}>
            <option value="Home">Home</option>
            <option value="Office">Office</option>
            <option value="Family">Family</option>
            <option value="Friend">Friend</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Save Gifting Address</button>
      </form>
    </div>
  </div>
{/if}
