import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve, sep } from 'node:path';

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
    '.webp': 'image/webp',
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

    if (existsSync(candidate) && statSync(candidate).isFile()) {
        return candidate;
    }

    return join(root, 'index.html');
};

const server = createServer((request, response) => {
    try {
        const filePath = resolveAssetPath(request.url || '/');
        const extension = extname(filePath);

        response.setHeader('Content-Type', mimeTypes[extension] || 'application/octet-stream');
        response.setHeader('X-Content-Type-Options', 'nosniff');

        if (filePath.includes(`${sep}assets${sep}`)) {
            response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
            // The shell must revalidate on every load so a fresh deploy's
            // hashed asset URLs are picked up immediately.
            response.setHeader('Cache-Control', 'no-cache');
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
