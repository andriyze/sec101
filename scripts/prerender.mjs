// Renders every route to static HTML after `vite build`, so crawlers and AI assistants see the
// lessons without running JavaScript. The browser bundle still boots and takes over on load.
// Runs under bun (JSX + JSON imports); the built dist/index.html is the template.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import React from 'react';
import { StaticRouter } from 'react-router';
import { MotionConfig } from 'framer-motion';
import { ProgressProvider } from '../src/contexts/ProgressContext.jsx';
import i18n from '../src/i18n/i18n.js';
import ua from '../src/i18n/ua.json';
import { AppRoutes } from '../src/App.jsx';

const SITE = 'https://sec101.a3sec.net';
const dist = process.argv[2] || 'dist';
const template = readFileSync(join(dist, 'index.html'), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const routes = [
    { path: '/', title: ua.app.title, desc: ua.app.subtitle },
    ...['phishing', 'passwords', 'browsing', 'social', 'devices', 'tools', 'ai', 'advanced'].map((id) => ({
        path: `/${id}`,
        title: `${ua.nav[id]} · SEC101`,
        desc: ua[id]?.subtitle || ua.app.subtitle,
    })),
];

async function renderToString(element) {
    const mod = await import('react-dom/static');
    if (mod.prerender) {
        const { prelude } = await mod.prerender(element);
        return await new globalThis.Response(prelude).text();
    }
    const { prelude } = await mod.prerenderToNodeStream(element);
    return await new Promise((resolve, reject) => {
        let out = '';
        prelude.on('data', (c) => { out += c; });
        prelude.on('end', () => resolve(out));
        prelude.on('error', reject);
    });
}

await i18n.changeLanguage('ua');
for (const route of routes) {
    const element = React.createElement(
        MotionConfig, { reducedMotion: 'user' },
        React.createElement(ProgressProvider, null,
            React.createElement(StaticRouter, { location: route.path }, React.createElement(AppRoutes))),
    );
    const markup = await renderToString(element);
    const url = SITE + (route.path === '/' ? '/' : route.path);
    let html = template
        .replace(/<title>[^<]*<\/title>/, `<title>${esc(route.title)}</title>`)
        .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(route.desc)}$2`)
        .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`)
        .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${esc(route.desc)}$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
        .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(route.title)}$2`)
        .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${esc(route.desc)}$2`)
        .replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`)
        .replace('<div id="root"></div>', `<div id="root">${markup}</div>`);
    if (!html.includes(markup)) throw new Error(`root placeholder not found for ${route.path}`);
    const outDir = route.path === '/' ? dist : join(dist, route.path.slice(1));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html);
    console.log(`prerendered ${route.path} (${Math.round(markup.length / 1024)} KB)`);
}
