<script>
  import { page } from '$app/stores';
  import { blogArticles } from '$lib/blog_data.js';
  import Footer from '$lib/components/Footer.svelte';

  $: slug = $page.params.slug;
  $: article = blogArticles.find(a => a.slug === slug);
  
  // Resolve related articles (exclude current one)
  $: relatedArticles = blogArticles
    .filter(a => a.slug !== slug)
    .slice(0, 2);

  // Render schema JSON-LD
  $: schemaJson = article ? JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "image": `https://webapp-two-kappa-11.vercel.app/${article.coverImg}`,
    "datePublished": article.date,
    "dateModified": article.date,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": "Blooming Blossom",
      "logo": {
        "@type": "ImageObject",
        "url": "https://webapp-two-kappa-11.vercel.app/assets/products/profile_avatar.svg"
      }
    },
    "description": article.excerpt,
    "contentLocation": {
      "@type": "Place",
      "name": article.targetLocation
    },
    "keywords": article.keywords.join(", ")
  }) : "";
</script>

<svelte:head>
  <title>{article ? `${article.title} | Blooming Blossom` : 'Blooming Blossom Blog'}</title>
  <meta name="description" content={article?.excerpt || ''}>
  <meta name="keywords" content={article?.keywords ? article.keywords.join(", ") : ''}>
  
  <!-- Open Graph -->
  <meta property="og:title" content={article ? `${article.title} | Blooming Blossom` : 'Blooming Blossom Blog'}>
  <meta property="og:description" content={article?.excerpt || ''}>
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://webapp-two-kappa-11.vercel.app/blog/{article?.slug || ''}">
  <meta property="og:image" content="https://webapp-two-kappa-11.vercel.app/{article?.coverImg || ''}">
  <meta property="article:published_time" content={article?.date || ''}>
  <meta property="article:author" content={article?.author || ''}>
  <meta property="article:section" content={article?.category || ''}>
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content={article ? `${article.title} | Blooming Blossom` : 'Blooming Blossom Blog'}>
  <meta name="twitter:description" content={article?.excerpt || ''}>
  
  <!-- JSON-LD Schema structured data -->
  {#if schemaJson}
    <script type="application/ld+json">
      {@html schemaJson}
    </script>
  {/if}
</svelte:head>

{#if article}

  <article style="background-color: var(--bb-pink-ultra-light); min-height: 100vh; padding-bottom: 60px;">
    
    <!-- Article Header Hero -->
    <div style="background-color: #FFFFFF; border-bottom: 1px solid var(--bb-card-border); padding: 60px 0 40px 0;">
      <div class="container" style="max-width: 800px; padding: 0 20px;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
          <span style="font-size: 12px; font-weight: 700; background-color: var(--bb-pink-ultra-light); color: var(--bb-pink); padding: 4px 12px; border-radius: var(--radius-full);">
            {article.category}
          </span>
          <span style="font-size: 13px; color: var(--bb-text-light);">
            📍 {article.targetLocation}
          </span>
        </div>
        
        <h1 style="font-family: var(--font-display); font-size: 40px; line-height: 1.3; color: var(--bb-text-main); margin: 0 0 20px 0;">
          {article.title}
        </h1>
        
        <div style="display: flex; align-items: center; gap: 16px; border-top: 1px solid var(--bb-card-border); padding-top: 20px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background-color: var(--bb-pink-ultra-light); display: flex; align-items: center; justify-content: center; font-size: 20px;">🌸</div>
          <div>
            <div style="font-size: 14px; font-weight: 700; color: var(--bb-text-main);">{article.author}</div>
            <div style="font-size: 12px; color: var(--bb-text-light);">
              Published {article.date} &bull; {article.readTime}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <div class="container" style="max-width: 800px; padding: 40px 20px;">
      
      <!-- Cover Image -->
      <div style="width: 100%; aspect-ratio: 16/9; border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-md); margin-bottom: 40px; background-color: #FFFFFF;">
        <img src="/{article.coverImg}" alt={article.title} style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <!-- Content Body -->
      <div class="blog-body" style="background-color: #FFFFFF; border: 1px solid var(--bb-card-border); border-radius: var(--radius-md); padding: 40px; box-shadow: var(--shadow-sm); font-size: 16px; line-height: 1.8; color: var(--bb-text-body);">
        {@html article.content}
        
        <!-- Keywords tags -->
        <div style="margin-top: 40px; border-top: 1px solid var(--bb-card-border); padding-top: 20px; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
          <span style="font-size: 12px; font-weight: 700; color: var(--bb-text-light); text-transform: uppercase;">Tags:</span>
          {#each article.keywords as kw}
            <span style="font-size: 12px; background-color: var(--bb-pink-ultra-light); color: var(--bb-pink); padding: 3px 10px; border-radius: 4px; font-weight: 500;">
              #{kw}
            </span>
          {/each}
        </div>
      </div>

      <!-- Related Articles -->
      <div style="margin-top: 60px;">
        <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--bb-text-main); margin-bottom: 24px;">Recommended Reading</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
          {#each relatedArticles as rel}
            <div style="background-color: #FFFFFF; border: 1px solid var(--bb-card-border); border-radius: var(--radius-md); padding: 20px; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 12px;">
              <span style="font-size: 11px; font-weight: 700; color: var(--bb-pink); text-transform: uppercase;">{rel.category}</span>
              <h4 style="font-size: 16px; font-family: var(--font-display); margin: 0; line-height: 1.4;">
                <a href="/blog/{rel.slug}" style="color: var(--bb-text-main); text-decoration: none; transition: color 0.2s;" on:mouseenter={(e) => e.target.style.color = 'var(--bb-pink)'} on:mouseleave={(e) => e.target.style.color = 'var(--bb-text-main)'}>
                  {rel.title}
                </a>
              </h4>
              <p style="color: var(--bb-text-light); font-size: 13px; margin: 0; line-height: 1.5; flex: 1;">
                {rel.excerpt}
              </p>
              <a href="/blog/{rel.slug}" style="font-size: 12px; font-weight: 700; color: var(--bb-pink); text-decoration: none; margin-top: 8px;">
                Read Article &rarr;
              </a>
            </div>
          {/each}
        </div>
      </div>

    </div>
  </article>
{:else}
  <div class="container" style="padding: 100px 20px; text-align: center;">
    <h2>Article not found.</h2>
    <a href="/blog" class="btn btn-primary" style="margin-top: 20px;">Return to Blog</a>
  </div>
{/if}

<Footer />
