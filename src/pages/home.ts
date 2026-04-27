/**
 * Home / landing page entry point.
 *
 * Responsibilities:
 *   1. Translations + custom language switcher (home has its own chrome with
 *      unique class names, so `initLangSwitcher` from `@lib` isn't used here).
 *   2. User auth chip in the header (avatar + dropdown with Settings / Logout).
 *   3. Entry-overlay audio gate — clicking "Enter" unmutes the about-section
 *      video and starts playback. Skipped for logged-in users.
 *   4. Sound toggle on the about section video.
 *   5. Fullpage snap-scroll across 3 sections (wheel / arrow / touch / Home / End).
 *   6. Scroll-hint click → next section; logo click → top.
 */

import type { TranslationMap } from '@models/i18n';
import {
    SUPPORTED_LANGUAGES,
    type Language,
    type User,
} from '@models/user';
import {
    getCurrentLanguage,
    initI18n,
    isSupportedLanguage,
    onLanguageChange,
    registerTranslations,
    setActiveLanguage,
} from '@lib/i18n';
import { getCurrentUser, getPrefs } from '@lib/storage';
import { showToast } from '@lib/toast';
import {
    applyAnimationPref,
    byId,
    byIdMaybe,
    onClickOutside,
    onEscape,
} from '@lib/ui';
import { validateEmail } from '@lib/validators';
import { consumeWelcome } from '@lib/welcome';
import { common as commonDict, type CommonDict } from '@translations/common';
import { homeTranslations as homeDict, type HomeDict } from '@translations/home';

// ===== Boot =====

applyAnimationPref();
document.documentElement.classList.add('page-home');
registerTranslations(buildHomeDict());
initI18n();

// ===== Typed dict access =====

type AuthModule = typeof import('@lib/auth');
type FirebaseModule = typeof import('@lib/firebase');
type WaitlistModule = typeof import('@lib/waitlist');

function buildHomeDict(): TranslationMap {
    const result = {} as TranslationMap;
    for (const lang of SUPPORTED_LANGUAGES) {
        result[lang] = {
            ...commonDict[lang],
            ...homeDict[lang],
        };
    }
    return result;
}

/** Merge common + home dicts for the current language, keeping precise types. */
function dict(): CommonDict & HomeDict {
    const lang = getCurrentLanguage();
    return { ...commonDict[lang], ...homeDict[lang] };
}

// ===== Custom language switcher (home has its own DOM classes) =====

const langSwitcher = byId<HTMLDivElement>('lang-switcher');
const langBtn = byId<HTMLButtonElement>('lang-btn');
const langDropdown = byId<HTMLDivElement>('lang-dropdown');
const currentLangLabel = byId<HTMLSpanElement>('current-lang');

function syncHomeLangExpanded(isOpen: boolean): void {
    langBtn.setAttribute('aria-expanded', String(isOpen));
}

langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const nextOpen = !langSwitcher.classList.contains('open');
    langSwitcher.classList.toggle('open', nextOpen);
    syncHomeLangExpanded(nextOpen);
});

onClickOutside(langSwitcher, () => {
    langSwitcher.classList.remove('open');
    syncHomeLangExpanded(false);
});

langDropdown.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
    a.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const lang = a.dataset.lang;
        langSwitcher.classList.remove('open');
        syncHomeLangExpanded(false);
        if (lang && isSupportedLanguage(lang)) setActiveLanguage(lang);
    });
});

function syncLangChrome(lang: Language): void {
    currentLangLabel.textContent = lang;
    langDropdown.querySelectorAll<HTMLAnchorElement>('a').forEach((a) => {
        a.classList.toggle('active', a.dataset.lang === lang);
    });
    document.title = `${dict().title} | Sword Art Online`;
}

syncHomeLangExpanded(false);
syncLangChrome(getCurrentLanguage());
onLanguageChange(syncLangChrome);

// ===== Auth chip (header user menu / login button) =====

const loginBtn = byId<HTMLAnchorElement>('nav-login-btn');
const userMenu = byId<HTMLDivElement>('user-menu');
const userBtn = byId<HTMLButtonElement>('user-btn');
const userAvatar = byId<HTMLSpanElement>('user-avatar');
const userNameEl = byId<HTMLSpanElement>('user-name');
const userEmailEl = byId<HTMLDivElement>('user-dropdown-email');
const myTicketsLink = byId<HTMLAnchorElement>('my-tickets-link');
const adminTicketsLink = byId<HTMLAnchorElement>('admin-tickets-link');
const logoutMenuBtn = byId<HTMLButtonElement>('logout-btn');
let homeUser: User | null = getCurrentUser();
let authModulePromise: Promise<AuthModule> | null = null;
let firebaseModulePromise: Promise<FirebaseModule> | null = null;
let waitlistModulePromise: Promise<WaitlistModule> | null = null;
let authBootstrapStarted = false;
let authListenerAttached = false;

function loadAuthModule(): Promise<AuthModule> {
    authModulePromise ??= import('@lib/auth');
    return authModulePromise;
}

function loadFirebaseModule(): Promise<FirebaseModule> {
    firebaseModulePromise ??= import('@lib/firebase');
    return firebaseModulePromise;
}

function loadWaitlistModule(): Promise<WaitlistModule> {
    waitlistModulePromise ??= import('@lib/waitlist');
    return waitlistModulePromise;
}

async function syncRoleLinks(authReady = false): Promise<void> {
    if (!homeUser) {
        myTicketsLink.hidden = true;
        adminTicketsLink.hidden = true;
        return;
    }

    myTicketsLink.hidden = false;
    if (!authReady) {
        adminTicketsLink.hidden = true;
        return;
    }

    try {
        const firebaseApi = await loadFirebaseModule();
        const token = await firebaseApi.auth.currentUser?.getIdTokenResult(true);
        const role = typeof token?.claims.role === 'string' ? token.claims.role : '';
        adminTicketsLink.hidden = role !== 'staff' && role !== 'admin';
    } catch {
        adminTicketsLink.hidden = true;
    }
}

function renderUserChip(): void {
    if (!homeUser) {
        userMenu.classList.remove('show', 'open');
        loginBtn.style.display = '';
        myTicketsLink.hidden = true;
        adminTicketsLink.hidden = true;
        return;
    }

    loginBtn.style.display = 'none';
    userMenu.classList.add('show');
    myTicketsLink.hidden = false;

    const display = homeUser.name || homeUser.email || 'Player';
    userNameEl.textContent = display.length > 15 ? `${display.slice(0, 15)}…` : display;
    userEmailEl.textContent = homeUser.email || display;

    if (homeUser.avatar) {
        const img = document.createElement('img');
        img.src = homeUser.avatar;
        img.alt = display;
        img.width = 32;
        img.height = 32;
        img.referrerPolicy = 'no-referrer';
        userAvatar.replaceChildren(img);
    } else {
        userAvatar.textContent = display.charAt(0).toUpperCase();
    }
}

function startAuthBootstrap(): void {
    if (!homeUser || authBootstrapStarted) return;
    authBootstrapStarted = true;

    const run = () => {
        void loadAuthModule()
            .then((authApi) => {
                homeUser = authApi.currentUser();
                renderUserChip();
                void syncRoleLinks(true);

                if (authListenerAttached) return;
                authListenerAttached = true;
                authApi.onCurrentUserChange((user) => {
                    homeUser = user;
                    renderUserChip();
                    void syncRoleLinks(true);
                });
            })
            .catch((err) => {
                console.warn('[home] auth bootstrap failed', err);
            });
    };

    if (document.readyState === 'complete') {
        window.setTimeout(run, 1200);
        return;
    }

    window.addEventListener('load', () => {
        window.setTimeout(run, 1200);
    }, { once: true });
}

renderUserChip();
void syncRoleLinks();
startAuthBootstrap();

// Keep the header chip in sync with live auth state (covers sign-out
// in another tab, Firebase token refresh, etc.)
if (homeUser) {
    userBtn.addEventListener('click', () => {
        startAuthBootstrap();
    }, { once: true });
}

// Greet the user once if they just arrived from the login/register flow.
// `consumeWelcome` clears the flag so a refresh never shows it twice.
{
    const kind = consumeWelcome();
    if (kind) {
        const displayName =
            homeUser?.name ||
            homeUser?.email?.split('@')[0] ||
            'Player';
        const d = dict();
        const msg = kind === 'back'
            ? d.welcomeBackToast(displayName)
            : d.welcomeNewToast(displayName);
        showToast(msg, 'ok', { duration: 4500 });
    }
}

userBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    userMenu.classList.toggle('open');
});
onClickOutside(userMenu, () => userMenu.classList.remove('open'));

logoutMenuBtn.addEventListener('click', async () => {
    userMenu.classList.remove('open');
    try {
        const authApi = await loadAuthModule();
        await authApi.signOut();
        // renderUserChip runs automatically via onCurrentUserChange
    } catch (err) {
        console.error('[home] signOut failed', err);
    }
});

// ===== Mobile nav toggle =====

const mobileMenuBtn = byIdMaybe<HTMLButtonElement>('mobile-menu-btn');
const mainNav = byIdMaybe<HTMLElement>('main-nav');
if (mobileMenuBtn && mainNav) {
    const syncMobileMenuExpanded = () => {
        mobileMenuBtn.setAttribute('aria-controls', 'main-nav');
        mobileMenuBtn.setAttribute('aria-expanded', String(mainNav.classList.contains('nav-open')));
    };

    syncMobileMenuExpanded();
    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('nav-open');
        syncMobileMenuExpanded();
    });
}

// ===== Entry overlay (audio consent) =====

const overlay = byId<HTMLDivElement>('entry-overlay');
const entryBtn = byId<HTMLButtonElement>('entry-btn');
const heroVideo = byIdMaybe<HTMLVideoElement>('hero-video');
const aboutVideo = byId<HTMLVideoElement>('about-video');
const featuresVideo = byIdMaybe<HTMLVideoElement>('features-video');
const soundBtn = byId<HTMLButtonElement>('sound-toggle');
const soundIcon = byId<HTMLSpanElement>('sound-icon');
const sectionVideos = [heroVideo, aboutVideo, featuresVideo];
const loadedSectionVideos = new Set<number>();
const mobileLiteMedia = typeof window.matchMedia === 'function'
    ? window.matchMedia('(max-width: 768px)')
    : null;
const mobileLite = document.documentElement.classList.contains('mobile-lite')
    || mobileLiteMedia?.matches === true;

function loadSectionVideo(index: number): void {
    if (mobileLite) return;
    const video = sectionVideos[index];
    if (!video || loadedSectionVideos.has(index)) return;
    const source = video.querySelector<HTMLSourceElement>('source[data-src]');
    const src = source?.dataset.src?.trim();
    if (!source || !src) return;
    source.src = src;
    loadedSectionVideos.add(index);
    video.load();
    void video.play().catch(() => {
        /* no-op */
    });
}

if (document.readyState === 'complete') {
    window.setTimeout(() => {
        loadSectionVideo(0);
    }, 250);
} else {
    window.addEventListener('load', () => {
        window.setTimeout(() => {
            loadSectionVideo(0);
        }, 250);
    }, { once: true });
}

function syncHomeControlLabels(): void {
    const d = dict();
    langBtn.setAttribute('aria-label', d.languageSwitcherLabel);
    mobileMenuBtn?.setAttribute('aria-label', d.menuToggleLabel);
    soundBtn.setAttribute('aria-label', d.soundToggleLabel);
    soundBtn.title = d.soundToggleLabel;
}

syncHomeControlLabels();
onLanguageChange(syncHomeControlLabels);

function setSoundIndicator(isMuted: boolean): void {
    soundIcon.textContent = isMuted ? '🔇' : '🔊';
    soundBtn.style.opacity = isMuted ? '0.5' : '1';
    soundBtn.setAttribute('aria-pressed', String(!isMuted));
}

// Skip the audio-consent overlay when:
//   - the user is already signed in (they've seen it before), or
//   - they previously checked "don't show again" (persisted in prefs).
// The prerender guard in index.html already adds `.skip-intro` so the
// overlay never flashes; we just need to keep the DOM state consistent.
const skipIntroPref = getPrefs().skipIntro === true;
if (homeUser || skipIntroPref || mobileLite) {
    overlay.classList.add('hidden');
    setSoundIndicator(true);
}

// Always loop the about-section video: once it ends we mute and restart.
// Must be attached unconditionally — logged-in users skip the entry overlay
// below, so nesting this inside the Enter-button click would mean the video
// stops dead after one play for returning visitors.
aboutVideo.addEventListener('ended', () => {
    setSoundIndicator(true);
    aboutVideo.muted = true;
    aboutVideo.currentTime = 0;
    void aboutVideo.play();
});

entryBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    if (mobileLite) {
        aboutVideo.muted = true;
        setSoundIndicator(true);
        return;
    }
    loadSectionVideo(1);
    aboutVideo.muted = false;
    aboutVideo.volume = 0.3;
    void aboutVideo.play();
    setSoundIndicator(false);
});

soundBtn.addEventListener('click', () => {
    if (mobileLite) return;
    if (aboutVideo.muted) {
        aboutVideo.muted = false;
        aboutVideo.volume = 0.3;
        setSoundIndicator(false);
    } else {
        aboutVideo.muted = true;
        setSoundIndicator(true);
    }
});

// ===== Footer (built dynamically — contains links) =====

const footerCopyEl = byId<HTMLDivElement>('footer-copy');

function renderFooter(): void {
    const d = dict();
    const [terms, privacy, email] = d.footerLinks;
    footerCopyEl.innerHTML = `
        ${d.footerCopy}<br>
        <a href="terms.html">${terms}</a> ·
        <a href="privacy.html">${privacy}</a> ·
        <a href="mailto:${email}">${email}</a>
    `;
}

renderFooter();
onLanguageChange(renderFooter);

// ===== Fullpage snap-scroll =====

const container = byId<HTMLDivElement>('fullpage-container');
const sections = document.querySelectorAll<HTMLElement>('.fp-section');
const totalSections = sections.length;
const animDuration =
    document.documentElement.classList.contains('no-anim') ? 0 : 800;

let currentSection = 0;
let isAnimating = false;

function goToSection(index: number): void {
    if (mobileLite) {
        const section = sections[index];
        if (!section) return;
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        currentSection = index;
        return;
    }
    if (index < 0 || index >= totalSections || isAnimating) return;
    isAnimating = true;
    currentSection = index;
    loadSectionVideo(index);
    container.style.transform = `translateY(-${index * 100}vh)`;
    window.setTimeout(() => { isAnimating = false; }, animDuration);
}

function overlayVisible(): boolean {
    return !overlay.classList.contains('hidden');
}

document.addEventListener(
    'wheel',
    (e) => {
        if (mobileLite) return;
        if (overlayVisible()) return;
        e.preventDefault();
        if (isAnimating) return;
        if (e.deltaY > 0) goToSection(currentSection + 1);
        else if (e.deltaY < 0) goToSection(currentSection - 1);
    },
    { passive: false },
);

document.addEventListener('keydown', (e) => {
    if (mobileLite) return;
    if (overlayVisible() || isAnimating) return;

    switch (e.key) {
        case 'ArrowDown':
        case 'PageDown':
            e.preventDefault();
            goToSection(currentSection + 1);
            break;
        case 'ArrowUp':
        case 'PageUp':
            e.preventDefault();
            goToSection(currentSection - 1);
            break;
        case 'Home':
            e.preventDefault();
            goToSection(0);
            break;
        case 'End':
            e.preventDefault();
            goToSection(totalSections - 1);
            break;
    }
});

// Touch swipe
let touchStartY = 0;
document.addEventListener(
    'touchstart',
    (e) => {
        if (mobileLite) return;
        touchStartY = e.touches[0].clientY;
    },
    { passive: true },
);
document.addEventListener(
    'touchend',
    (e) => {
        if (mobileLite) return;
        if (overlayVisible() || isAnimating) return;
        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;
        if (Math.abs(diff) < 50) return;
        if (diff > 0) goToSection(currentSection + 1);
        else goToSection(currentSection - 1);
    },
    { passive: true },
);

// Scroll-hint and logo shortcuts
byIdMaybe<HTMLButtonElement>('scroll-hint')?.addEventListener('click', () => goToSection(1));
byIdMaybe<HTMLAnchorElement>('home-logo')?.addEventListener('click', (e) => {
    e.preventDefault();
    goToSection(0);
});

// ===== Play Now -> waitlist modal =====
//
// The game client is not shipped yet. Instead of dead-ending users on
// register.html (which is what the anchor's href falls back to when JS is
// disabled), clicking Play Now opens a modal that captures their email
// into the `waitlist` Firestore collection. Security rules forbid reads
// and updates, so duplicates bounce back with a friendly "already on the
// list" message.

const playNowCta = byIdMaybe<HTMLAnchorElement>('play-now-cta');
const waitlistModal = byIdMaybe<HTMLDivElement>('waitlist-modal');
const waitlistForm = byIdMaybe<HTMLFormElement>('waitlist-form');
const waitlistFormView = byIdMaybe<HTMLDivElement>('waitlist-form-view');
const waitlistSuccessView = byIdMaybe<HTMLDivElement>('waitlist-success-view');
const waitlistSuccessMsg = byIdMaybe<HTMLParagraphElement>('waitlist-success-msg');
const waitlistEmailInput = byIdMaybe<HTMLInputElement>('waitlist-email');
const waitlistError = byIdMaybe<HTMLDivElement>('waitlist-error');
const waitlistSubmitBtn = byIdMaybe<HTMLButtonElement>('waitlist-submit');
const waitlistCancelBtn = byIdMaybe<HTMLButtonElement>('waitlist-cancel');
const waitlistCloseBtn = byIdMaybe<HTMLButtonElement>('waitlist-close');

let disposeWaitlistEsc: (() => void) | null = null;

function showWaitlistError(text: string): void {
    if (!waitlistError || !waitlistEmailInput) return;
    waitlistError.textContent = text;
    waitlistError.classList.add('show');
    waitlistEmailInput.classList.add('error');
}

function clearWaitlistError(): void {
    if (!waitlistError || !waitlistEmailInput) return;
    waitlistError.textContent = '';
    waitlistError.classList.remove('show');
    waitlistEmailInput.classList.remove('error');
}

function resetWaitlistForm(): void {
    if (!waitlistForm || !waitlistSubmitBtn || !waitlistFormView || !waitlistSuccessView) return;
    waitlistForm.reset();
    clearWaitlistError();
    const d = dict();
    waitlistSubmitBtn.textContent = d.waitlistSubmit;
    waitlistSubmitBtn.disabled = false;
    waitlistFormView.hidden = false;
    waitlistSuccessView.hidden = true;
}

function openWaitlistModal(): void {
    if (!waitlistModal || !waitlistEmailInput) return;
    resetWaitlistForm();

    // Pre-fill email for signed-in users - one less field to type.
    if (homeUser?.email) waitlistEmailInput.value = homeUser.email;

    waitlistModal.classList.add('show');
    // Defer focus so the browser has applied the transition first.
    window.setTimeout(() => waitlistEmailInput.focus(), 50);

    disposeWaitlistEsc?.();
    disposeWaitlistEsc = onEscape(closeWaitlistModal);
}

function closeWaitlistModal(): void {
    if (!waitlistModal) return;
    waitlistModal.classList.remove('show');
    disposeWaitlistEsc?.();
    disposeWaitlistEsc = null;
}

if (playNowCta && waitlistModal && waitlistForm && waitlistEmailInput && waitlistSubmitBtn) {
    playNowCta.addEventListener('click', (e) => {
        e.preventDefault();
        openWaitlistModal();
    });

    waitlistCancelBtn?.addEventListener('click', closeWaitlistModal);
    waitlistCloseBtn?.addEventListener('click', closeWaitlistModal);

    // Click on backdrop (outside the .modal) also closes.
    waitlistModal.addEventListener('click', (e) => {
        if (e.target === waitlistModal) closeWaitlistModal();
    });

    waitlistEmailInput.addEventListener('input', clearWaitlistError);

    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const d = dict();
        const email = waitlistEmailInput.value.trim();

        if (!validateEmail(email)) {
            showWaitlistError(d.waitlistErrInvalid);
            return;
        }

        clearWaitlistError();
        waitlistSubmitBtn.disabled = true;
        waitlistSubmitBtn.textContent = d.waitlistSubmitting;

        const { joinWaitlist } = await loadWaitlistModule();
        const result = await joinWaitlist(email, getCurrentLanguage());

        if (result.ok) {
            if (waitlistFormView && waitlistSuccessView && waitlistSuccessMsg) {
                waitlistSuccessMsg.textContent = d.waitlistSuccessMsg(email);
                waitlistFormView.hidden = true;
                waitlistSuccessView.hidden = false;
            } else {
                // Fallback: toast + close
                showToast(d.waitlistSuccessMsg(email), 'ok');
                closeWaitlistModal();
            }
            return;
        }

        // Error: re-enable submit and show an inline message.
        waitlistSubmitBtn.disabled = false;
        waitlistSubmitBtn.textContent = d.waitlistSubmit;

        switch (result.reason) {
            case 'invalid-email':
                showWaitlistError(d.waitlistErrInvalid);
                break;
            case 'already-signed-up':
                showWaitlistError(d.waitlistErrAlready);
                break;
            case 'network':
                showToast(d.waitlistErrNetwork, 'err');
                break;
            default:
                showToast(d.waitlistErrUnknown, 'err');
        }
    });
}

