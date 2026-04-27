/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

/**
 * Vite multi-page app configuration.
 *
 * Each HTML file in the project root is an independent entry point.
 * `index.html` is the landing page (previously `index.html`).
 */
export default defineConfig({
    root: '.',
    publicDir: 'public',

    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@lib': resolve(__dirname, 'src/lib'),
            '@models': resolve(__dirname, 'src/types'),
            '@styles': resolve(__dirname, 'src/styles'),
            '@translations': resolve(__dirname, 'src/translations'),
        },
    },

    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
        // Firebase SDK is ~500 kB unminified. Without chunking each entry
        // that imports it inlines the whole thing. With manualChunks it
        // lives in its own files that are shared and long-term cached
        // across every page.
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                login: resolve(__dirname, 'login.html'),
                register: resolve(__dirname, 'register.html'),
                settings: resolve(__dirname, 'settings.html'),
                support: resolve(__dirname, 'support.html'),
                myTickets: resolve(__dirname, 'my-tickets.html'),
                ticket: resolve(__dirname, 'ticket.html'),
                adminTickets: resolve(__dirname, 'admin-tickets.html'),
                privacy: resolve(__dirname, 'privacy.html'),
                terms: resolve(__dirname, 'terms.html'),
                news: resolve(__dirname, 'news.html'),
                forum: resolve(__dirname, 'forum.html'),
                authAction: resolve(__dirname, 'auth-action.html'),
                notfound: resolve(__dirname, '404.html'),
            },
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/@firebase/firestore') ||
                        id.includes('node_modules/firebase/firestore')) {
                        return 'firebase-firestore';
                    }
                    if (id.includes('node_modules/@firebase/auth') ||
                        id.includes('node_modules/firebase/auth')) {
                        return 'firebase-auth';
                    }
                    if (id.includes('node_modules/@firebase') ||
                        id.includes('node_modules/firebase')) {
                        return 'firebase-app';
                    }
                    return undefined;
                },
            },
        },
    },

    server: {
        port: 5173,
        open: '/',
        strictPort: false,
    },

    preview: {
        port: 4173,
        open: '/',
    },

    test: {
        include: ['tests/unit/**/*.test.ts'],
    },
});
