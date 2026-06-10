import { blogArticles } from '$lib/blog_data.js';

export async function GET() {
  const websiteUrl = 'https://webapp-two-kappa-11.vercel.app';
  
  const staticPages = [
    '',
    '/shop',
    '/blog',
    '/about',
    '/contact',
    '/dashboard/dashboard'
  ];

  const blogPages = blogArticles.map(a => `/blog/${a.slug}`);
  const allPages = [...staticPages, ...blogPages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages.map(page => `
  <url>
    <loc>${websiteUrl}${page}</loc>
    <changefreq>${page.includes('/blog/') ? 'weekly' : 'daily'}</changefreq>
    <priority>${page === '' ? '1.0' : page.includes('/blog/') ? '0.7' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=0, s-maxage=3600'
    }
  });
}
