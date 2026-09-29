import { createElement, lazy } from 'react';

/**
 * React.lazy that renders straight away once its chunk has been preloaded. main.jsx preloads the
 * current route before the first render, so the prerendered HTML is swapped for the same page
 * instead of flashing the Suspense fallback while the chunk downloads.
 */
export function lazyPage(load) {
    let Loaded = null;
    const preload = () =>
        load().then((module) => {
            Loaded = module.default;
            return module;
        });
    const Lazy = lazy(preload);
    const Page = (props) => createElement(Loaded ?? Lazy, props);
    Page.preload = preload;
    return Page;
}
