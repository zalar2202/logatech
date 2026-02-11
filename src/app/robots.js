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
                userAgent: [
                    'Amazonbot',
                    'Applebot-Extended',
                    'Bytespider',
                    'CCBot',
                    'ClaudeBot',
                    'Google-Extended',
                    'GPTBot',
                    'meta-externalagent'
                ],
                disallow: '/',
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
