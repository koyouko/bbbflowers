<script>
  import { page } from '$app/stores';
  import { orders } from '$lib/stores/dashboard.js';
  import { celebrationsStore } from '$lib/stores/celebrations.js';
  import Footer from '$lib/components/Footer.svelte';

  $: orderId = $page.params.id;
  $: order = $orders.find(o => o.id === orderId);

  // Delivery Stages Setup
  let currentActiveStep = 2; // Defaults to "Driver Assigned"
  
  const trackingSteps = [
    { title: "Order Confirmed", desc: "Your order has been received successfully and sent to our florists.", time: "10:35 AM", icon: "✓" },
    { title: "Bouquet Preparation", desc: "Our florist is carefully selecting and wrapping your fresh flowers.", time: "10:45 AM", icon: "🌸" },
    { title: "Driver Assigned", desc: "Your delivery partner has been assigned and is collecting the bouquet.", time: "12:15 PM", icon: "🚚" },
    { title: "Out for Delivery", desc: "Your flowers are on the way to the destination. Fresh and cool.", time: "Pending", icon: "📍" },
    { title: "Delivered Successfully", desc: "Flowers delivered! We made them smile.", time: "Pending", icon: "🎁" }
  ];

  function speedUpSimulation() {
    if (currentActiveStep < trackingSteps.length - 1) {
      currentActiveStep++;
      const now = new Date();
      const mins = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
      trackingSteps[currentActiveStep - 1].time = `${now.getHours()}:${mins} PM`;
      
      if (currentActiveStep === trackingSteps.length - 1) {
        setTimeout(() => alert('Your bouquet has been delivered successfully! Mom has been sent a WhatsApp message with the greeting card.'), 100);
      }
    } else {
      alert('Package is already delivered!');
    }
  }

  function saveDateToCalendar() {
    const newEvent = {
      name: `${order.recipient}'s Special Surprise`,
      category: "family",
      date: order.deliveryDetails.date,
      reminder: "7 days before",
      budget: order.total,
      preferredFlower: order.itemSummary,
      notes: `Recurred from order ${order.id}. Message was: "${order.deliveryDetails.greetingCardText}"`
    };
    celebrationsStore.save(newEvent);
    alert('Event saved successfully to your BB Moments Celebrations list! Reminders scheduled.');
  }
</script>

{#if order}
  <div class="container" style="padding: 40px 0;">
    <div class="tracking-header">
      <h2 style="font-size: 32px; color: var(--bb-pink); margin-bottom: 8px;">Your flowers are on their way!</h2>
      <p>Order ID: <b style="color: var(--bb-text-main);">{order.id}</b> &bull; Tracked in Real-Time</p>
      
      <!-- Simulation control button -->
      <button class="btn btn-secondary btn-sm" on:click={speedUpSimulation} style="margin-top: 16px;">
        <i class="fa-solid fa-bolt"></i> Speed Up Simulation Status
      </button>
    </div>

    <div class="cart-grid">
      <!-- Tracking Timeline -->
      <div class="dashboard-card">
        <h3 class="dashboard-card-title">Live Delivery Status</h3>
        <div class="timeline">
          {#each trackingSteps as step, idx}
            <div class="timeline-step {idx < currentActiveStep ? 'completed' : ''} {idx === currentActiveStep ? 'active' : ''}">
              <div class="timeline-icon-node">{step.icon}</div>
              <div class="timeline-content">
                <div class="timeline-time">{idx === currentActiveStep ? 'LIVE' : step.time}</div>
                <h4 class="timeline-title">{step.title}</h4>
                <p class="timeline-desc">{step.desc}</p>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- Detail cards -->
      <div>
        <div class="dashboard-card" style="margin-bottom: 24px;">
          <h3 class="dashboard-card-title">Delivery Details</h3>
          <ul style="list-style: none; font-size: 14px; display: flex; flex-direction: column; gap: 8px; padding-left: 0;">
            <li>Recipient Name: <b>{order.recipient}</b></li>
            <li>Delivery Location: <b>{order.deliveryDetails.address}, {order.deliveryDetails.city.split(',')[0]}</b></li>
            <li>Estimated Delivery: <b>Today before 6:00 PM</b></li>
            <li>Real-Time Updates: <b>WhatsApp (<i class="fa-solid fa-circle-check" style="color: var(--bb-success);"></i> Enabled)</b></li>
          </ul>
        </div>

        <!-- Emotional Trigger: Save Anniversary next year -->
        <div class="dashboard-card" style="margin-bottom: 24px; border: 1px dashed var(--bb-pink);">
          <h3 class="dashboard-card-title" style="color: var(--bb-pink);">Want us to remind you next year?</h3>
          <p style="font-size: 13px; margin-bottom: 12px;">Save this special occasion to your BB Moments Calendar and never miss it again!</p>
          <button class="btn btn-primary btn-sm btn-block" on:click={saveDateToCalendar}>
            <i class="fa-solid fa-calendar-check"></i> Save This Date
          </button>
        </div>

        <div class="dashboard-card">
          <h3 class="dashboard-card-title">Make your next surprise even more memorable</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <a href="/shop" class="btn btn-outline btn-block">Explore Flowers & Gifts</a>
            <a href="/dashboard/dashboard" class="btn btn-secondary btn-block">Go to My Dashboard</a>
          </div>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="container" style="padding: 100px 20px; text-align: center;">
    <h2>Order not found.</h2>
    <a href="/" class="btn btn-primary">Go Home</a>
  </div>
{/if}

<Footer />
