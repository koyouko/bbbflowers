<script>
  import Footer from '$lib/components/Footer.svelte';
</script>

<div class="container" style="padding: 60px 0;">
  <h1 style="font-size: 38px; text-align: center; margin-bottom: 40px;">Contact Our Floral Experts</h1>
  
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
    <div class="dashboard-card">
      <h3 style="font-size: 20px; margin-bottom: 20px; border-bottom: 1px solid var(--bb-card-border); padding-bottom: 10px;">Send a Message</h3>
      <form on:submit|preventDefault={() => { alert('Message sent successfully!'); }}>
        <div class="modal-form-group">
          <label class="input-label" for="contact-name">Your Name</label>
          <input type="text" id="contact-name" class="input-style" required>
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="contact-email">Email Address</label>
          <input type="email" id="contact-email" class="input-style" required>
        </div>
        <div class="modal-form-group">
          <label class="input-label" for="contact-msg">How can we help you?</label>
          <textarea id="contact-msg" class="input-style" style="height: 100px;" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Send Message</button>
      </form>
    </div>

    <div style="padding: 20px;">
      <h2 style="font-size: 24px; margin-bottom: 16px;">Get In Touch</h2>
      <p style="font-size: 15px; color: var(--bb-text-body); margin-bottom: 24px;">Our team is available 7 days a week to handle bespoke arrangements, corporate contracts, and bulk schedules.</p>
      
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; gap: 14px; align-items: flex-start;">
          <div style="font-size: 20px; color: var(--bb-pink);"><i class="fa-solid fa-phone"></i></div>
          <div>
            <h4 style="font-size: 15px; font-weight: 700;">Customer Care</h4>
            <p style="font-size: 13px; color: var(--bb-text-light);">+971 50 123 4567 (9:00 AM - 10:00 PM)</p>
          </div>
        </div>
        <div style="display: flex; gap: 14px; align-items: flex-start;">
          <div style="font-size: 20px; color: var(--bb-pink);"><i class="fa-solid fa-envelope"></i></div>
          <div>
            <h4 style="font-size: 15px; font-weight: 700;">General Queries</h4>
            <p style="font-size: 13px; color: var(--bb-text-light);">hello@bloomingblossom.ae</p>
          </div>
        </div>
        <div style="display: flex; gap: 14px; align-items: flex-start;">
          <div style="font-size: 20px; color: var(--bb-pink);"><i class="fa-solid fa-location-dot"></i></div>
          <div>
            <h4 style="font-size: 15px; font-weight: 700;">Flagship Store</h4>
            <p style="font-size: 13px; color: var(--bb-text-light);">Park Tower, Ground Floor, Dubai Marina, Dubai, UAE</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<Footer />
