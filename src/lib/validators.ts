/**
 * Shared input validators.
 *
 * The email check is stricter than HTML5 `type="email"` because we verify
 * brand-specific TLD pairs (e.g. `gmail.com` is valid, `gmail.ru` is not).
 */

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;

/**
 * Known email-provider brand → allowed TLD variants.
 * Domains listed here are validated for plausible TLDs.
 * Unknown domains pass through as long as they match the generic regex.
 */
const KNOWN_BRANDS: Record<string, readonly string[]> = {
    gmail: ['com'],
    googlemail: ['com'],
    hotmail: ['com'],
    outlook: ['com'],
    live: ['com'],
    yahoo: ['com', 'ru', 'co.uk'],
    icloud: ['com'],
    protonmail: ['com'],
    proton: ['me'],
    mail: ['ru'],
    yandex: ['ru', 'com', 'by', 'ua', 'kz'],
    ya: ['ru'],
    rambler: ['ru'],
    bk: ['ru'],
    list: ['ru'],
    inbox: ['ru'],
    ukr: ['net'],
    meta: ['ua'],
};

/**
 * Validate an email address using regex + known-brand TLD check.
 *
 * @example
 * validateEmail('user@gmail.com')   // → true
 * validateEmail('user@gmail.ru')    // → false (brand mismatch)
 * validateEmail('user@example.com') // → true (unknown brand passes regex)
 */
export function validateEmail(value: string): boolean {
    const trimmed = value.trim().toLowerCase();
    if (!EMAIL_REGEX.test(trimmed)) return false;

    const atIndex = trimmed.indexOf('@');
    const domain = trimmed.slice(atIndex + 1);
    const dotIndex = domain.indexOf('.');
    if (dotIndex === -1) return false;

    const brand = domain.slice(0, dotIndex);
    const tldPart = domain.slice(dotIndex + 1);

    const allowedTlds = KNOWN_BRANDS[brand];
    if (allowedTlds && !allowedTlds.includes(tldPart)) return false;

    return true;
}

/**
 * Username validation: 3–20 chars, letters/digits/underscore/dash.
 */
export function validateUsername(value: string): boolean {
    const trimmed = value.trim();
    if (trimmed.length < 3 || trimmed.length > 20) return false;
    return /^[a-zA-Z0-9_-]+$/.test(trimmed);
}

/**
 * Password-strength score (0 — very weak, 4 — strong).
 */
export function passwordStrength(password: string): 0 | 1 | 2 | 3 | 4 {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password) && /[^a-zA-Z0-9]/.test(password)) score++;
    return Math.min(score, 4) as 0 | 1 | 2 | 3 | 4;
}

/**
 * Basic password validity: min 6 chars.
 */
export function validatePassword(password: string): boolean {
    return password.length >= 6;
}

// ===== Detailed validators (used for real-time field feedback) =====

/**
 * TLDs that we recognise as plausibly real. Unknown TLDs surface a
 * `noTld` state so the UI can suggest a retype. This is intentionally
 * generous (accept "example.ai", reject "example.foo").
 */
const VALID_TLDS: ReadonlySet<string> = new Set([
    // Generic
    'com', 'net', 'org', 'info', 'biz', 'name', 'pro', 'mobi', 'xyz',
    'online', 'site', 'website', 'store', 'tech', 'app', 'dev', 'io',
    'ai', 'me', 'tv', 'cc', 'co',
    // Country codes (popular)
    'ru', 'ua', 'by', 'kz', 'uz', 'az', 'ge', 'am', 'md', 'lv', 'lt',
    'ee', 'pl', 'cz', 'sk', 'de', 'fr', 'it', 'es', 'pt', 'nl', 'be',
    'ch', 'at', 'gr', 'hu', 'ro', 'bg', 'rs', 'hr', 'si', 'fi', 'se',
    'no', 'dk', 'is', 'ie', 'uk', 'gb', 'us', 'ca', 'mx', 'br', 'ar',
    'cl', 'au', 'nz', 'jp', 'cn', 'kr', 'in', 'tr', 'il', 'eg', 'za',
    'sg', 'hk', 'tw', 'th', 'vn', 'id', 'ph', 'my',
    // Education/gov/mil
    'edu', 'gov', 'mil', 'int', 'eu', 'asia',
]);

/**
 * Popular email providers with known authenticity of their domain.
 * `true` — legit, `false` — common typo or lookalike that we reject.
 */
const POPULAR_DOMAINS: Record<string, boolean> = {
    'gmail.com': true, 'gmail.ru': false,
    'mail.ru': true,
    'yandex.ru': true, 'yandex.com': true, 'ya.ru': true,
    'outlook.com': true, 'hotmail.com': true, 'live.com': true,
    'icloud.com': true, 'me.com': true,
    'yahoo.com': true, 'yahoo.ru': true,
    'rambler.ru': true, 'bk.ru': true, 'list.ru': true, 'inbox.ru': true,
    'proton.me': true, 'protonmail.com': true,
    'ukr.net': true, 'i.ua': true, 'meta.ua': true,
};

export type EmailValidation =
    | { state: 'ok' }
    | { state: 'noAt' | 'noLocal' | 'badDomain' | 'bad' | 'fakeDomain' | 'tldShort' }
    | { state: 'noTld'; tld: string };

/**
 * Detailed email validation returning a discriminated union the UI can map
 * onto a localised message. Does NOT check taken-ness (that is a separate
 * lookup in `auth.ts`).
 */
export function validateEmailDetailed(value: string): EmailValidation {
    const val = value.trim().toLowerCase();

    if (!val.includes('@')) return { state: 'noAt' };

    const atIndex = val.indexOf('@');
    const local = val.slice(0, atIndex);
    const domain = val.slice(atIndex + 1);

    if (!local) return { state: 'noLocal' };
    if (!domain || !domain.includes('.')) return { state: 'badDomain' };
    if (!EMAIL_REGEX.test(val)) return { state: 'bad' };

    // Known popular domains (exact match) — fast-path
    if (POPULAR_DOMAINS[domain] === true) return { state: 'ok' };
    if (POPULAR_DOMAINS[domain] === false) return { state: 'fakeDomain' };

    // Brand with wrong TLD (e.g. "gmail.co", "yahoo.cm")
    const domainParts = domain.split('.');
    const brand = domainParts[0];
    const tldPart = domainParts.slice(1).join('.');
    const allowedTlds = KNOWN_BRANDS[brand];
    if (allowedTlds && !allowedTlds.includes(tldPart)) {
        return { state: 'fakeDomain' };
    }

    const tld = domainParts[domainParts.length - 1];
    if (!VALID_TLDS.has(tld)) return { state: 'noTld', tld };
    if (tld.length < 2) return { state: 'tldShort' };

    return { state: 'ok' };
}

export type UsernameValidation =
    | { state: 'ok' }
    | { state: 'tooShort' | 'tooLong' | 'badChars' };

/**
 * Length + character-class check for a username. Availability and
 * "similar-to-existing" warnings come from `auth.ts`.
 */
export function validateUsernameDetailed(value: string): UsernameValidation {
    const trimmed = value.trim();
    if (trimmed.length < 3) return { state: 'tooShort' };
    if (trimmed.length > 20) return { state: 'tooLong' };
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) return { state: 'badChars' };
    return { state: 'ok' };
}

export type PasswordStrengthHint =
    | 'tooShort'
    | 'noCase'
    | 'noNumber'
    | 'noSpecial'
    | 'tooShort10'
    | 'great';

export interface PasswordStrengthResult {
    /** 1 = weakest, 4 = strongest. Never 0 for a non-empty input. */
    level: 1 | 2 | 3 | 4;
    /** Which hint key to display — maps to `strengthHints` dictionary in translations. */
    hint: PasswordStrengthHint;
}

/**
 * Password strength meter tuned for the registration flow.
 *
 * Matches the legacy scoring used in `register.html` so behaviour stays
 * identical through the migration.
 */
export function passwordStrengthDetailed(password: string): PasswordStrengthResult {
    const checks = {
        length6: password.length >= 6,
        length10: password.length >= 10,
        lower: /[a-zа-я]/.test(password),
        upper: /[A-ZА-Я]/.test(password),
        number: /\d/.test(password),
        special: /[^A-Za-zА-Яа-я\d]/.test(password),
    };

    let score = 0;
    if (checks.length6) score++;
    if (checks.length10) score++;
    if (checks.lower && checks.upper) score++;
    if (checks.number) score++;
    if (checks.special) score++;

    // Scale 0-5 score into 1-4 visual level (1 is always shown for non-empty input).
    let level = Math.min(4, Math.ceil(score * 0.8));
    if (level === 0) level = 1;

    let hint: PasswordStrengthHint;
    if (!checks.length6) hint = 'tooShort';
    else if (!checks.upper || !checks.lower) hint = 'noCase';
    else if (!checks.number) hint = 'noNumber';
    else if (!checks.special) hint = 'noSpecial';
    else if (!checks.length10) hint = 'tooShort10';
    else hint = 'great';

    return { level: level as 1 | 2 | 3 | 4, hint };
}
