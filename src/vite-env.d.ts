/// <reference types="vite/client" />

/**
 * Custom environment variables exposed by Vite to the client bundle.
 *
 * Only variables prefixed with `VITE_` are shipped to the browser —
 * everything else stays server-side (which, for a static site, means
 * it simply does not leave your machine).
 *
 * Define these in `.env.local` (git-ignored) or `.env`:
 *
 *   VITE_GOOGLE_CLIENT_ID=xxxx.apps.googleusercontent.com
 *   VITE_FIREBASE_API_KEY=...
 */
interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID?: string;

    /** Firebase configuration (Step 6) */
    readonly VITE_FIREBASE_API_KEY?: string;
    readonly VITE_FIREBASE_AUTH_DOMAIN?: string;
    readonly VITE_FIREBASE_PROJECT_ID?: string;
    readonly VITE_FIREBASE_STORAGE_BUCKET?: string;
    readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string;
    readonly VITE_FIREBASE_APP_ID?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

/**
 * Google Identity Services — script loaded via a CDN `<script>` tag,
 * so we declare the global shape here instead of pulling in `@types/google.accounts`.
 */
interface Window {
    google?: {
        accounts: {
            oauth2: {
                initTokenClient(config: {
                    client_id: string;
                    scope: string;
                    callback: (response: GoogleTokenResponse) => void;
                }): GoogleTokenClient;
            };
        };
    };
}

interface GoogleTokenClient {
    requestAccessToken(): void;
}

interface GoogleTokenResponse {
    access_token?: string;
    error?: string;
    error_description?: string;
}

interface GoogleUserInfo {
    email: string;
    name: string;
    given_name?: string;
    picture?: string;
}
