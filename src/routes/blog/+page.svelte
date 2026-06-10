<script>
  import { blogArticles } from '$lib/blog_data.js';
  import Footer from '$lib/components/Footer.svelte';

  let searchQuery = '';
  let selectedCategory = 'All';

  // Extract unique categories from articles
  const categories = ['All', ...new Set(blogArticles.map(a => a.category))];

  // Filter articles reactively
  $: filteredArticles = blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
</script>

<svelte:head>
  <title>Blooming Blossom Blog - Floral Trends & Same-Day Flower Delivery UAE</title>
  <meta name="description" content="Read expert floral guides, gifting tips, and same-day delivery insights for Dubai, Abu Dhabi, Sharjah and the UAE. Stay updated with Blooming Blossom.">
  <meta name="keywords" content="flower delivery blog, dubai florist guide, rose box gifting uae, luxury flower delivery dubai">
  
  <!-- Open Graph -->
  <meta property="og:title" content="Blooming Blossom Blog - Floral Trends & Same-Day Flower Delivery UAE">
  <meta property="og:description" content="Read expert floral guides, gifting tips, and same-day delivery insights for Dubai, Abu Dhabi, Sharjah and the UAE.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://webapp-two-kappa-11.vercel.app/blog">
  <meta property="og:image" content="https://webapp-two-kappa-11.vercel.app/assets/products/hero_flowers.png">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Blooming Blossom Blog - Floral Trends & Same-Day Flower Delivery UAE">
  <meta name="twitter:description" content="Read expert floral guides, gifting tips, and same-day delivery insights for Dubai, Abu Dhabi, Sharjah and the UAE.">
</svelte:head>

<div style="background-color: var(--bb-pink-ultra-light); padding: 50px 0 20px 0;">
  <div class="container" style="text-align: center;">
    <h1 style="font-family: var(--font-display); font-size: 48px; color: var(--bb-text-main); margin-bottom: 12px;">The Blossom Journal</h1>
    <p style="color: var(--bb-text-light); font-size: 16px; max-width: 600px; margin: 0 auto;">
      Expert floral guides, location delivery highlights, and design inspiration tailored for every special moment across the UAE.
    </p>
  </div>
</div>

<div class="container" style="padding: 40px 20px;">
  <!-- Search & Filters -->
  <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 40px; border-bottom: 1px solid var(--bb-card-border); padding-bottom: 24px;">
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px;">
      
      <!-- Category Buttons -->
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        {#each categories as category}
          <button 
            type="button" 
            style="padding: 8px 18px; border-radius: var(--radius-full); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s;
                   border: 1px solid {selectedCategory === category ? 'var(--bb-pink)' : 'var(--bb-card-border)'}; 
                   background-color: {selectedCategory === category ? 'var(--bb-pink)' : '#FFFFFF'}; 
                   color: {selectedCategory === category ? '#FFFFFF' : 'var(--bb-text-main)'};"
            on:click={() => selectedCategory = category}>
            {category}
          </button>
        {/each}
      </div>

      <!-- Search Input -->
      <div style="position: relative; width: 100%; max-width: 320px;">
        <input 
          type="text" 
          bind:value={searchQuery}
          placeholder="Search articles..." 
          style="width: 100%; padding: 10px 16px 10px 40px; font-size: 14px; border: 1px solid var(--bb-card-border); border-radius: var(--radius-full); box-shadow: var(--shadow-sm); outline: none;">
        <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--bb-text-light);"></i>
      </div>
    </div>
  </div>

  <!-- Blog Grid -->
  {#if filteredArticles.length > 0}
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px;">
      {#each filteredArticles as article}
        <article class="blog-card" style="background-color: #FFFFFF; border: 1px solid var(--bb-card-border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; transition: transform 0.2s, box-shadow 0.2s;">
          <a href="/blog/{article.slug}" style="display: block; aspect-ratio: 16/10; overflow: hidden; background-color: var(--bb-pink-ultra-light);">
            <img src="/{article.coverImg}" alt={article.title} style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s;" on:mouseenter={(e) => e.target.style.transform = 'scale(1.05)'} on:mouseleave={(e) => e.target.style.transform = 'scale(1)'}>
          </a>
          
          <div style="padding: 24px; display: flex; flex-direction: column; flex: 1; gap: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; font-weight: 700; color: var(--bb-pink);">
              <span>{article.category}</span>
              <span style="color: var(--bb-text-light); font-weight: 500;">{article.readTime}</span>
            </div>

            <h2 style="font-size: 20px; font-family: var(--font-display); line-height: 1.4; margin: 0;">
              <a href="/blog/{article.slug}" style="color: var(--bb-text-main); text-decoration: none; transition: color 0.2s;" on:mouseenter={(e) => e.target.style.color = 'var(--bb-pink)'} on:mouseleave={(e) => e.target.style.color = 'var(--bb-text-main)'}>
                {article.title}
              </a>
            </h2>

            <p style="color: var(--bb-text-light); font-size: 14px; line-height: 1.5; margin: 0; flex: 1;">
              {article.excerpt}
            </p>

            <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--bb-card-border); padding-top: 16px; margin-top: 8px;">
              <div style="display: flex; flex-direction: column; gap: 2px;">
                <span style="font-size: 12px; font-weight: 600; color: var(--bb-text-main);">{article.author}</span>
                <span style="font-size: 11px; color: var(--bb-text-light);">{article.date}</span>
              </div>
              <a href="/blog/{article.slug}" style="font-size: 12px; font-weight: 700; color: var(--bb-pink); text-decoration: none; display: flex; align-items: center; gap: 4px;">
                Read Article <i class="fa-solid fa-arrow-right" style="font-size: 10px;"></i>
              </a>
            </div>
          </div>
        </article>
      {/each}
    </div>
  {:else}
    <div style="padding: 80px 20px; text-align: center; background-color: #FFFFFF; border: 1px dashed var(--bb-card-border); border-radius: var(--radius-md);">
      <i class="fa-solid fa-folder-open" style="font-size: 48px; color: var(--bb-text-light); margin-bottom: 16px;"></i>
      <h3 style="font-size: 18px; color: var(--bb-text-main); margin-bottom: 6px;">No articles found</h3>
      <p style="color: var(--bb-text-light); font-size: 14px;">Try adjusting your filters or search terms.</p>
    </div>
  {/if}
</div>

<Footer />
