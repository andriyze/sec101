import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { brotliCompressSync, constants as zlibConstants, gzipSync } from 'node:zlib';

const root = resolve(process.argv[2] || 'dist');
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || '0.0.0.0';

const mimeTypes = {
    '.css': 'text/css; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.webp': 'image/webp',
};

// Sent on every response. Scripts and styles are our own bundle; framer-motion writes inline
// style attributes, hence 'unsafe-inline' for styles only. The one cross-origin call is the
// live MCP demo on the AI page, which talks to a3sec.net.
const securityHeaders = {
    'Content-Security-Policy':
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; " +
        "font-src 'self'; connect-src 'self' https://www.a3sec.net; object-src 'none'; frame-ancestors 'none'; " +
        "base-uri 'self'; form-action 'self'",
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
    'Cross-Origin-Opener-Policy': 'same-origin',
};

const compressibleExtensions = new Set(['.css', '.html', '.js', '.json', '.svg', '.txt', '.xml']);

const pickEncoding = (acceptEncoding = '') => {
    if (/\bbr\b/.test(acceptEncoding)) return 'br';
    if (/\bgzip\b/.test(acceptEncoding)) return 'gzip';
    return null;
};

// Built files only change on deploy, so each one is compressed once, at the highest level, and
// kept; the mtime check covers a rebuild while the server is running.
const compressedCache = new Map();
const compressFile = (filePath, encoding) => {
    const { mtimeMs } = statSync(filePath);
    const key = `${encoding}:${filePath}`;
    const cached = compressedCache.get(key);
    if (cached?.mtimeMs === mtimeMs) return cached.body;
    const raw = readFileSync(filePath);
    const body = encoding === 'br'
        ? brotliCompressSync(raw, {
            params: {
                [zlibConstants.BROTLI_PARAM_QUALITY]: zlibConstants.BROTLI_MAX_QUALITY,
                [zlibConstants.BROTLI_PARAM_SIZE_HINT]: raw.length,
            },
        })
        : gzipSync(raw, { level: 9 });
    compressedCache.set(key, { mtimeMs, body });
    return body;
};

const resolveAssetPath = (pathname) => {
    let decodedPath;
    try {
        decodedPath = decodeURIComponent(pathname.split('?')[0]);
    } catch {
        return join(root, 'index.html');
    }
    const normalized = normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
    const candidate = join(root, normalized);

    if (!candidate.startsWith(`${root}${sep}`) && candidate !== root) {
        return join(root, 'index.html');
    }

    if (existsSync(candidate)) {
        if (statSync(candidate).isFile()) return candidate;
        // a prerendered route: dist/<route>/index.html
        const prerendered = join(candidate, 'index.html');
        if (existsSync(prerendered)) return prerendered;
    }

    // Unknown files (a stray .png, .js, .txt) are a real 404; only extensionless app routes fall back.
    if (extname(normalized)) return null;

    return join(root, 'index.html');
};

const server = createServer((request, response) => {
    try {
        const filePath = resolveAssetPath(request.url || '/');
        if (!filePath) {
            response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            response.end('Not found');
            return;
        }
        const extension = extname(filePath);

        response.setHeader('Content-Type', mimeTypes[extension] || 'application/octet-stream');
        for (const [name, value] of Object.entries(securityHeaders)) {
            response.setHeader(name, value);
        }

        if (filePath.includes(`${sep}assets${sep}`)) {
            response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
            // The shell must revalidate on every load so a fresh deploy's
            // hashed asset URLs are picked up immediately.
            response.setHeader('Cache-Control', 'no-cache');
        }

        if (compressibleExtensions.has(extension)) {
            response.setHeader('Vary', 'Accept-Encoding');
            const encoding = pickEncoding(request.headers['accept-encoding']);
            if (encoding) {
                const body = compressFile(filePath, encoding);
                response.setHeader('Content-Encoding', encoding);
                response.setHeader('Content-Length', body.length);
                response.end(body);
                return;
            }
        }

        createReadStream(filePath)
            .on('error', () => {
                if (response.headersSent) {
                    response.destroy();
                    return;
                }
                response.writeHead(404);
                response.end('Not found');
            })
            .pipe(response);
    } catch {
        if (response.headersSent) {
            response.destroy();
            return;
        }
        response.writeHead(500);
        response.end('Internal server error');
    }
});

server.listen(port, host, () => {
    console.log(`Serving ${root} on http://${host}:${port}`);
});
