export default function robots() {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://logatech.net';
    
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/panel/', '/api/'], // Hide admin and api from search engines
            },
            {
                userAgent: 'GPTBot', // Specifically welcome AI
                allow: '/',
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
