/**
 * Forum page entry point.
 *
 * Renders two blocks:
 *   1. Categories — 5 cards with icon, description, thread/post counts, last-post.
 *   2. Recent threads — scrollable list with search filtering.
 *
 * Both are subscribed to live Firestore collections (`forumCategories`,
 * `forumThreads`). Search filtering happens client-side over the threads
 * currently in memory.
 */

import type { Language } from '@models/user';
import {
    applyAnimationPref,
    auth,
    byId,
    byIdMaybe,
    createForumReply,
    createForumThread,
    deleteForumPost,
    deleteForumThread,
    clampCounter,
    incrementThreadViews,
    currentUser,
    debounce,
    getCurrentLanguage,
    hasStaffRole,
    initI18n,
    initLangSwitcher,
    onLanguageChange,
    onCurrentUserChange,
    registerTranslations,
    setForumPostingEnabled,
    setForumPublicVisibility,
    subscribeForumPosts,
    subscribeForumThread,
    subscribeForumCategories,
    subscribeForumVisibility,
    subscribeForumThreads,
    showToast,
    t,
    whenAuthReady,
    uploadForumImage,
    type ForumCategoryKey,
    type ForumCategoryDoc,
    type ForumPostDoc,
    type ForumThreadDetailDoc,
    type ForumThreadDoc,
} from '@lib';
import { buildDict, forumTranslations } from '@translations';

applyAnimationPref();
registerTranslations(buildDict('forum'));
initI18n();

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

// ---- DOM refs ----
const categoriesEl = byId<HTMLDivElement>('forum-categories');
const threadsEl = byId<HTMLDivElement>('forum-threads');
const emptyEl = byId<HTMLDivElement>('forum-empty');
const toolbarEl = byId<HTMLDivElement>('forum-toolbar');
const searchInput = byId<HTMLInputElement>('forum-search-input');
const hiddenStateEl = byId<HTMLDivElement>('forum-hidden-state');
const threadScreenEl = byId<HTMLElement>('forum-thread-screen');
const threadStateEl = byId<HTMLDivElement>('forum-thread-state');
const threadReadyEl = byId<HTMLDivElement>('forum-thread-ready');
const threadViewTitleEl = byId<HTMLHeadingElement>('forum-thread-view-title');
const threadBreadcrumbCat = byId<HTMLButtonElement>('forum-thread-breadcrumb-cat');
const threadBreadcrumbCurrent = byId<HTMLSpanElement>('forum-thread-breadcrumb-current');
const threadViewMetaEl = byId<HTMLDivElement>('forum-thread-view-meta');
const threadPostsEl = byId<HTMLDivElement>('forum-thread-posts');
const threadStatusBarEl = byId<HTMLDivElement>('forum-thread-status-bar');
const threadReplyFormEl = byId<HTMLFormElement>('forum-thread-reply-form');
const threadReplyInputEl = byId<HTMLTextAreaElement>('forum-thread-reply-input');
const threadReplySubmitBtn = byId<HTMLButtonElement>('forum-thread-reply-submit');
const newThreadBtn = byId<HTMLButtonElement>('forum-new-thread-btn');
const threadModalEl = byId<HTMLDivElement>('forum-thread-modal');
const threadFormEl = byId<HTMLFormElement>('forum-thread-form');
const threadCategorySelectEl = byId<HTMLSelectElement>('forum-thread-category');
const threadTitleInputEl = byId<HTMLInputElement>('forum-thread-title');
const threadContentInputEl = byId<HTMLTextAreaElement>('forum-thread-content');
const threadCancelBtn = byId<HTMLButtonElement>('forum-thread-cancel');
const threadSubmitBtn = byId<HTMLButtonElement>('forum-thread-submit');
const mainViewEl = byId<HTMLElement>('forum-main-view');
const categoryViewEl = byId<HTMLElement>('forum-category-view');
const categoryViewTitleEl = byId<HTMLHeadingElement>('forum-category-view-title');
const categoryBreadcrumbCurrent = byId<HTMLSpanElement>('forum-category-breadcrumb-current');
const pageHeaderEl = byId<HTMLElement>('forum-page-header');
const categoriesSectionEl = byId<HTMLElement>('forum-categories-section');
const threadsSectionEl = byId<HTMLElement>('forum-threads-section');
const adminPanelEl = byIdMaybe<HTMLElement>('forum-admin-panel');
const forumPostingStateEl = byIdMaybe<HTMLElement>('forum-posting-state');
const forumVisibilityToggle = byIdMaybe<HTMLButtonElement>('forum-visibility-toggle');
const forumPostingToggle = byIdMaybe<HTMLButtonElement>('forum-posting-toggle');
const forumStatusBadge = document.querySelector<HTMLElement>('.forum-status-badge');
const forumStatusText = document.querySelector<HTMLElement>('.forum-status-text');

// ---- State ----
let searchQuery = '';
let activeCategory: ForumCategoryKey | null = null;
let categories: ForumCategoryDoc[] = [];
let threads: ForumThreadDoc[] = [];
let categoriesLoaded = false;
let threadsLoaded = false;
let loadError: Error | null = null;
let forumPublicVisible = false;
let forumPostingEnabled = false;
let activeThreadId = new URLSearchParams(window.location.search).get('thread')?.trim() ?? '';
let activeThread: ForumThreadDetailDoc | null = null;
let activePosts: ForumPostDoc[] = [];
let threadViewState: 'idle' | 'loading' | 'ready' | 'notfound' = activeThreadId ? 'loading' : 'idle';
let threadUnsub: (() => void) | null = null;
let threadPostsUnsub: (() => void) | null = null;
let threadModalOpen = false;
let isStaffViewer = false;
const viewedThreadIds = new Set<string>();

// Files
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB
let threadFiles: { file: File; preview: string | null }[] = [];
let replyFiles: { file: File; preview: string | null }[] = [];

const threadFilesInput = byId<HTMLInputElement>('forum-thread-files');
const threadFilePreview = byId<HTMLDivElement>('forum-thread-file-preview');
const replyFilesInput = byId<HTMLInputElement>('forum-reply-files');
const replyFilePreview = byId<HTMLDivElement>('forum-reply-file-preview');

// ---- Helpers ----
const LOCALE_MAP: Record<Language, string> = {
    RU: 'ru-RU',
    EN: 'en-US',
    DE: 'de-DE',
    FR: 'fr-FR',
    PL: 'pl-PL',
    ES: 'es-ES',
    CZ: 'cs-CZ',
    IT: 'it-IT',
};

/**
 * Human-readable relative time using the browser's built-in
 * `Intl.RelativeTimeFormat` — localised automatically.
 */
function formatRelative(iso: string, lang: Language): string {
    const then = new Date(iso).getTime();
    const now = Date.now();
    const diff = Math.round((then - now) / 1000); // seconds, negative for past

    const rtf = new Intl.RelativeTimeFormat(LOCALE_MAP[lang], { numeric: 'auto' });

    const abs = Math.abs(diff);
    if (abs < 60) return rtf.format(diff, 'second');
    if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
    if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
    if (abs < 2592000) return rtf.format(Math.round(diff / 86400), 'day');
    if (abs < 31536000) return rtf.format(Math.round(diff / 2592000), 'month');
    return rtf.format(Math.round(diff / 31536000), 'year');
}

function formatCount(count: number): string {
    return new Intl.NumberFormat(LOCALE_MAP[getCurrentLanguage()]).format(count);
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDateTime(iso: string): string {
    return new Intl.DateTimeFormat(LOCALE_MAP[getCurrentLanguage()], {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(iso));
}

function redirectToLogin(): void {
    const returnTo = `${window.location.pathname}${window.location.search}`;
    window.location.href = `login.html?returnTo=${encodeURIComponent(returnTo)}`;
}

function closeThreadModal(): void {
    threadModalOpen = false;
    threadModalEl.classList.remove('show');
    threadModalEl.setAttribute('aria-hidden', 'true');
}

function syncThreadCategoryOptions(): void {
    const currentValue = threadCategorySelectEl.value;
    threadCategorySelectEl.innerHTML = categories.map((cat) => `
        <option value="${escapeHtml(cat.id)}" data-key="${cat.key}">${escapeHtml(t(cat.key))}</option>
    `).join('');

    if (categories.some((cat) => cat.id === currentValue)) {
        threadCategorySelectEl.value = currentValue;
        return;
    }

    const preferred = activeCategory
        ? categories.find((cat) => cat.key === activeCategory)
        : null;
    threadCategorySelectEl.value = preferred?.id ?? categories[0]?.id ?? '';
}

function openThreadModal(): void {
    if (!forumPostingEnabled) {
        showToast(t('readOnlyDesc'), 'err');
        return;
    }

    if (!auth.currentUser && !currentUser()) {
        redirectToLogin();
        return;
    }

    if (!categoriesLoaded || categories.length === 0) {
        showToast(t('loadError'), 'err');
        return;
    }

    syncThreadCategoryOptions();
    threadTitleInputEl.value = '';
    threadContentInputEl.value = '';
    threadFiles = [];
    renderFilePreviews(threadFiles, threadFilePreview);
    threadModalOpen = true;
    threadModalEl.classList.add('show');
    threadModalEl.setAttribute('aria-hidden', 'false');
    threadTitleInputEl.focus();
}

function stopActiveThreadSubscriptions(): void {
    threadUnsub?.();
    threadPostsUnsub?.();
    threadUnsub = null;
    threadPostsUnsub = null;
}

function updateThreadUrl(nextThreadId: string, replace = false): void {
    const url = new URL(window.location.href);
    if (nextThreadId) {
        url.searchParams.set('thread', nextThreadId);
    } else {
        url.searchParams.delete('thread');
    }
    window.history[replace ? 'replaceState' : 'pushState']({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function activateThread(threadId: string, updateUrl = true, replaceUrl = false): void {
    if (!threadId) return;

    if (updateUrl) {
        updateThreadUrl(threadId, replaceUrl);
    }

    closeThreadModal();
    stopActiveThreadSubscriptions();
    activeThreadId = threadId;
    activeThread = null;
    activePosts = [];
    threadViewState = 'loading';

    threadUnsub = subscribeForumThread(
        threadId,
        (thread) => {
            if (!thread) {
                activeThread = null;
                threadViewState = 'notfound';
                render();
                return;
            }

            activeThread = thread;
            threadViewState = 'ready';
            syncTitle(getCurrentLanguage());
            render();
        },
        (err) => {
            console.error('[forum] thread subscription failed', err);
            activeThread = null;
            threadViewState = 'notfound';
            render();
        },
    );

    threadPostsUnsub = subscribeForumPosts(
        threadId,
        (posts) => {
            activePosts = posts;
            render();
        },
        (err) => {
            console.error('[forum] thread posts subscription failed', err);
        },
    );

    // Increment at most once per page session (server also enforces per-account uniqueness).
    if (!viewedThreadIds.has(threadId)) {
        viewedThreadIds.add(threadId);
        void incrementThreadViews(threadId);
    }

    render();
}

function deactivateThread(updateUrl = true, replaceUrl = false): void {
    if (updateUrl) {
        updateThreadUrl('', replaceUrl);
    }

    stopActiveThreadSubscriptions();
    activeThreadId = '';
    activeThread = null;
    activePosts = [];
    threadViewState = 'idle';
    syncTitle(getCurrentLanguage());
    render();
}

function staffText(key: 'deleteThread' | 'deleteReply' | 'deleteConfirmThread' | 'deleteConfirmReply' | 'deleteFailed' | 'deleteDone'): string {
    const ru = getCurrentLanguage() === 'RU';
    if (key === 'deleteThread') return ru ? 'Удалить тему' : 'Delete thread';
    if (key === 'deleteReply') return ru ? 'Удалить' : 'Delete';
    if (key === 'deleteConfirmThread') return ru ? 'Удалить эту тему полностью?' : 'Delete this thread completely?';
    if (key === 'deleteConfirmReply') return ru ? 'Удалить это сообщение?' : 'Delete this reply?';
    if (key === 'deleteDone') return ru ? 'Удалено' : 'Deleted';
    return ru ? 'Не удалось удалить' : 'Failed to delete';
}

function renderThreadPost(author: string, text: string, createdAt: string, root = false, postId = '', images?: string[]): string {
    const deleteBtn = (!root && isStaffViewer && postId)
        ? `<button type="button" class="forum-post-delete btn btn-secondary btn-sm" data-delete-post-id="${escapeHtml(postId)}">${escapeHtml(staffText('deleteReply'))}</button>`
        : '';
        
    const imagesHtml = images && images.length > 0 
        ? `<div class="forum-post-images">
             ${images.map(img => `<a href="${escapeHtml(img)}" target="_blank" rel="noopener noreferrer"><img src="${escapeHtml(img)}" alt="Attachment" loading="lazy"></a>`).join('')}
           </div>` 
        : '';

    return `
        <article class="forum-post${root ? ' forum-post--root' : ''}">
            <div class="forum-post-header">
                <div class="forum-post-header-main">
                    <span class="forum-post-author">${escapeHtml(author)}</span>
                    <time class="forum-post-time" datetime="${escapeHtml(createdAt)}">${escapeHtml(formatDateTime(createdAt))}</time>
                </div>
                ${deleteBtn}
            </div>
            <div class="forum-post-text">${escapeHtml(text)}</div>
            ${imagesHtml}
        </article>
    `;
}

// ---- File attachments logic ----
function handleFilesSelection(files: FileList | null, dest: { file: File; preview: string | null }[], container: HTMLElement) {
    if (!files) return;
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) {
            showToast('Разрешены только картинки', 'err');
            continue;
        }
        if (file.size > MAX_IMAGE_SIZE) {
            showToast(`Файл ${file.name} слишком большой (макс. 5МБ)`, 'err');
            continue;
        }
        if (dest.length >= 10) {
            showToast('Максимум 10 скриншотов', 'err');
            break;
        }
        
        const entry = { file, preview: null as string | null };
        dest.push(entry);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            entry.preview = typeof e.target?.result === 'string' ? e.target.result : null;
            renderFilePreviews(dest, container);
        };
        reader.readAsDataURL(file);
    }
}

function renderFilePreviews(list: { file: File; preview: string | null }[], container: HTMLElement) {
    container.innerHTML = list.map((entry, idx) => {
        if (!entry.preview) return '';
        return `
            <div class="file-preview-item">
                <img src="${escapeHtml(entry.preview)}" alt="preview">
                <button type="button" class="remove-btn" data-idx="${idx}">✕</button>
            </div>
        `;
    }).join('');
    
    container.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt((e.target as HTMLElement).dataset.idx || '0', 10);
            list.splice(idx, 1);
            renderFilePreviews(list, container);
        });
    });
}

threadFilesInput?.addEventListener('change', () => {
    handleFilesSelection(threadFilesInput.files, threadFiles, threadFilePreview);
    threadFilesInput.value = '';
});

replyFilesInput?.addEventListener('change', () => {
    handleFilesSelection(replyFilesInput.files, replyFiles, replyFilePreview);
    replyFilesInput.value = '';
});

// ---- Rendering ----

function renderCategory(cat: ForumCategoryDoc, lang: Language): string {
    const safeThreads = clampCounter(cat.threads);
    const safePosts = clampCounter(cat.posts);

    const name = t(cat.key);
    const desc = t(cat.descKey);
    const threadsLabel = t('threadsCount');
    const postsLabel = t('postsCount');
    const lastPostLabel = t('lastPost');
    const noPostsLabel = t('noPosts');
    const isActive = activeCategory === cat.key;

    const lastPost = cat.lastPost
        ? `
            <div class="forum-cat-last">
                <span class="forum-cat-last-label">${escapeHtml(lastPostLabel)}</span>
                <span class="forum-cat-last-title" title="${escapeHtml(cat.lastPost.title)}">
                    ${escapeHtml(cat.lastPost.title)}
                </span>
                <span class="forum-cat-last-meta">
                    <strong>${escapeHtml(cat.lastPost.author)}</strong>
                    · ${escapeHtml(formatRelative(cat.lastPost.at, lang))}
                </span>
            </div>
        `
        : `<div class="forum-cat-last forum-cat-last--empty">${escapeHtml(noPostsLabel)}</div>`;

    return `
        <button
            type="button"
            class="forum-cat-card${isActive ? ' active' : ''}"
            data-category="${cat.key}"
            aria-pressed="${isActive ? 'true' : 'false'}"
        >
            <div class="forum-cat-main">
                <div class="forum-cat-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="${cat.iconSvg}"/>
                    </svg>
                </div>
                <div class="forum-cat-body">
                    <h3 class="forum-cat-title">${escapeHtml(name)}</h3>
                    <p class="forum-cat-desc">${escapeHtml(desc)}</p>
                </div>
            </div>
            <span class="col-stats" data-label="${escapeHtml(threadsLabel)}"><span class="forum-cat-stat-val">${formatCount(safeThreads)}</span></span>
            <span class="col-stats" data-label="${escapeHtml(postsLabel)}"><span class="forum-cat-stat-val">${formatCount(safePosts)}</span></span>
            ${lastPost}
        </button>
    `;
}

function renderThread(thread: ForumThreadDoc, lang: Language): string {
    const catName = t(thread.category);
    const repliesLabel = t('replies');
    const viewsLabel = t('views');

    const pinnedBadge = thread.pinned
        ? `<svg class="forum-thread-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
               <path d="M12 17v5M9 3h6l1 8H8zM8 11l4 6 4-6"/>
           </svg>`
        : '';
    const staffDeleteBtn = isStaffViewer
        ? `<button type="button" class="btn btn-secondary btn-sm forum-thread-card-delete" data-delete-thread-id="${escapeHtml(thread.id)}">${escapeHtml(staffText('deleteThread'))}</button>`
        : '';

    return `
        <button type="button" class="forum-thread" data-thread-id="${escapeHtml(thread.id)}" data-category="${thread.category}" data-search="${escapeHtml(
        (thread.title + ' ' + thread.author).toLowerCase(),
    )}">
            <div class="forum-thread-main">
                <span class="forum-thread-cat">${escapeHtml(catName)}</span>
                <h4 class="forum-thread-title">
                    ${pinnedBadge}
                    ${escapeHtml(thread.title)}
                </h4>
                <span class="forum-thread-author">${escapeHtml(thread.author)}</span>
            </div>
            <span class="col-stats" data-label="${escapeHtml(repliesLabel)}"><span class="forum-cat-stat-val">${formatCount(thread.replies)}</span></span>
            <span class="col-stats" data-label="${escapeHtml(viewsLabel)}"><span class="forum-cat-stat-val">${formatCount(thread.views)}</span></span>
            <div class="col-last">
                <time datetime="${thread.lastActivity}">${escapeHtml(formatRelative(thread.lastActivity, lang))}</time>
                ${staffDeleteBtn}
            </div>
        </button>
    `;
}

function renderSkeletonCategories(count: number): string {
    let out = '';
    for (let i = 0; i < count; i++) {
        out += `
            <div class="forum-cat-card forum-cat-card--skeleton" aria-hidden="true">
                <div class="forum-cat-main">
                    <div class="forum-cat-icon skeleton-box"></div>
                    <div class="forum-cat-body" style="width: 100%;">
                        <div class="skeleton-line skeleton-line--lg"></div>
                        <div class="skeleton-line skeleton-line--sm"></div>
                    </div>
                </div>
                <div class="col-stats"><div class="skeleton-line skeleton-line--sm" style="margin:0 auto;"></div></div>
                <div class="col-stats"><div class="skeleton-line skeleton-line--sm" style="margin:0 auto;"></div></div>
                <div class="col-last">
                    <div class="skeleton-line skeleton-line--md"></div>
                    <div class="skeleton-line skeleton-line--sm"></div>
                </div>
            </div>
        `;
    }
    return out;
}

function renderSkeletonThreads(count: number): string {
    let out = '';
    for (let i = 0; i < count; i++) {
        out += `
            <div class="forum-thread forum-thread--skeleton" aria-hidden="true">
                <div class="forum-thread-main">
                    <div class="skeleton-line skeleton-line--sm"></div>
                    <div class="skeleton-line skeleton-line--lg"></div>
                    <div class="skeleton-line skeleton-line--sm"></div>
                </div>
            </div>
        `;
    }
    return out;
}

function render(): void {
    const lang = getCurrentLanguage();
    const signedIn = Boolean(currentUser() || auth.currentUser);

    if (forumStatusBadge) {
        forumStatusBadge.textContent = !forumPublicVisible
            ? t('hiddenBadge')
            : forumPostingEnabled
                ? t('postingBadge')
                : t('readOnlyBadge');
    }
    if (forumStatusText) {
        forumStatusText.textContent = !forumPublicVisible
            ? t('hiddenDesc')
            : forumPostingEnabled
                ? t('postingDesc')
                : t('readOnlyDesc');
    }

    if (forumVisibilityToggle) {
        forumVisibilityToggle.textContent = forumPublicVisible ? 'Скрыть форум' : 'Показать форум';
    }
    if (forumPostingToggle) {
        forumPostingToggle.textContent = forumPostingEnabled ? 'Выключить постинг' : 'Включить постинг';
    }
    if (forumPostingStateEl) {
        forumPostingStateEl.textContent = forumPostingEnabled ? 'Постинг: включен' : 'Постинг: выключен';
        forumPostingStateEl.classList.toggle('is-enabled', forumPostingEnabled);
    }
    newThreadBtn.hidden = !forumPublicVisible || !forumPostingEnabled || Boolean(activeThreadId);
    newThreadBtn.textContent = signedIn ? t('newThread') : t('loginToPost');

    if (!forumPublicVisible) {
        toolbarEl.hidden = false;
        mainViewEl.hidden = true;
        categoryViewEl.hidden = true;
        threadScreenEl.hidden = true;
        categoriesEl.innerHTML = '';
        threadsEl.innerHTML = '';
        emptyEl.hidden = true;
        hiddenStateEl.hidden = false;
        hiddenStateEl.innerHTML = `
            <h2>${escapeHtml(t('title'))}</h2>
            <p>${escapeHtml(t('hiddenDesc'))}</p>
        `;
        return;
    }

    if (activeThreadId) {
        pageHeaderEl.hidden = true;
        mainViewEl.hidden = true;
        categoryViewEl.hidden = true;
        toolbarEl.hidden = true;
        hiddenStateEl.hidden = true;
        emptyEl.hidden = true;
        threadScreenEl.hidden = false;
        if (adminPanelEl) adminPanelEl.hidden = true;

        if (threadViewState !== 'ready' || !activeThread) {
            threadReadyEl.hidden = true;
            threadStateEl.hidden = false;
            threadStateEl.textContent = threadViewState === 'notfound' ? t('threadNotFound') : t('threadLoading');
            return;
        }

        threadStateEl.hidden = true;
        threadReadyEl.hidden = false;
        threadBreadcrumbCat.textContent = t(activeThread.category);
        threadBreadcrumbCurrent.textContent = activeThread.title;
        threadViewTitleEl.textContent = activeThread.title;
        threadViewMetaEl.innerHTML = `
            <span>${escapeHtml(activeThread.author)}</span>
            <span>·</span>
            <time datetime="${escapeHtml(activeThread.createdAt ?? activeThread.lastActivity)}">${escapeHtml(formatDateTime(activeThread.createdAt ?? activeThread.lastActivity))}</time>
            <span>·</span>
            <span>${formatCount(activeThread.replies)} ${escapeHtml(t('replies'))}</span>
            ${isStaffViewer ? `<button type="button" class="btn btn-secondary btn-sm forum-thread-delete" data-delete-thread-id="${escapeHtml(activeThread.id)}">${escapeHtml(staffText('deleteThread'))}</button>` : ''}
        `;

        const rootText = activeThread.content?.trim() || activeThread.title;
        const rootCreatedAt = activeThread.createdAt ?? activeThread.lastActivity;
        threadPostsEl.innerHTML = [
            renderThreadPost(activeThread.author, rootText, rootCreatedAt, true, '', activeThread.images),
            ...activePosts.map((post) => renderThreadPost(post.author, post.text, post.createdAt, false, post.id, post.images)),
        ].join('');

        if (!forumPostingEnabled) {
            threadStatusBarEl.hidden = false;
            threadStatusBarEl.textContent = t('readOnlyDesc');
            threadReplyFormEl.hidden = true;
        } else if (!signedIn) {
            threadStatusBarEl.hidden = false;
            const currentUrl = encodeURIComponent(`${window.location.pathname}${window.location.search}`);
            threadStatusBarEl.innerHTML = `
                <span>${escapeHtml(t('threadReplyLogin'))}</span>
                <a href="login.html?returnTo=${currentUrl}" class="btn btn-primary btn-sm" style="margin-left: 12px; text-decoration: none;" data-i18n="login">Войти</a>
            `;
            threadReplyFormEl.hidden = true;
        } else {
            threadStatusBarEl.hidden = true;
            threadStatusBarEl.textContent = '';
            threadReplyFormEl.hidden = false;
        }
        return;
    }

    if (activeCategory) {
        pageHeaderEl.hidden = true;
        mainViewEl.hidden = true;
        categoryViewEl.hidden = false;
        threadScreenEl.hidden = true;
        hiddenStateEl.hidden = true;
        toolbarEl.hidden = false;
        if (adminPanelEl) adminPanelEl.hidden = true;
        
        const catObj = categories.find(c => c.key === activeCategory);
        const titleText = catObj ? t(catObj.key) : 'Категория';
        categoryViewTitleEl.textContent = titleText;
        categoryBreadcrumbCurrent.textContent = titleText;
    } else {
        pageHeaderEl.hidden = false;
        mainViewEl.hidden = false;
        categoryViewEl.hidden = true;
        threadScreenEl.hidden = true;
        hiddenStateEl.hidden = true;
        toolbarEl.hidden = true;
        if (adminPanelEl) adminPanelEl.hidden = !isStaffViewer;
    }

    // --- error overrides everything ---
    if (loadError) {
        categoriesEl.innerHTML = '';
        threadsEl.innerHTML = '';
        threadsEl.hidden = true;
        emptyEl.hidden = false;
        emptyEl.innerHTML = `<p>${escapeHtml(t('loadError'))}</p>`;
        return;
    }

    // --- categories ---
    if (!categoriesLoaded) {
        categoriesEl.innerHTML = renderSkeletonCategories(5);
    } else {
        categoriesEl.innerHTML = categories.map(c => renderCategory(c, lang)).join('');
    }

    // --- threads (with search filter + client-side sort as defence in depth) ---
    if (!threadsLoaded) {
        threadsEl.innerHTML = renderSkeletonThreads(6);
        threadsEl.hidden = false;
        emptyEl.hidden = true;
        return;
    }

    const q = searchQuery.trim().toLowerCase();
    const filtered = threads.filter((th) => {
        const matchesCategory = !activeCategory || th.category === activeCategory;
        const matchesSearch =
            q.length === 0 || (th.title + ' ' + th.author).toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
    });

    // Firestore already sorts pinned-first, lastActivity-desc; re-sort
    // here anyway so search + local-only ordering don't diverge.
    const sorted = [...filtered].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return b.lastActivity.localeCompare(a.lastActivity);
    });

    threadsEl.innerHTML = sorted.map(th => renderThread(th, lang)).join('');

    const isEmpty = sorted.length === 0;
    emptyEl.hidden = !isEmpty;
    threadsEl.hidden = isEmpty;
    if (isEmpty) {
        if (q.length > 0 || activeCategory) {
            emptyEl.innerHTML = `
                <h3 class="forum-empty-title">${escapeHtml(t('emptyTitle'))}</h3>
                <p class="forum-empty-desc">${escapeHtml(t('emptyDesc'))}</p>
            `;
        } else {
            emptyEl.innerHTML = `<p>${escapeHtml(t('emptyThreads'))}</p>`;
        }
    }
}

// ---- Search ----
const onSearchInput = debounce((e: Event) => {
    searchQuery = (e.target as HTMLInputElement).value;
    render();
}, 200);
searchInput.addEventListener('input', onSearchInput);

document.querySelectorAll('.forum-home-link').forEach((btn: Element) => {
    btn.addEventListener('click', (e: Event) => {
        deactivateThread(false, true);
        activeCategory = null;
        searchQuery = '';
        searchInput.value = '';
        render();
    });
});

threadBreadcrumbCat.addEventListener('click', (e: Event) => {
    if (activeThread) {
        activeCategory = activeThread.category;
        searchQuery = '';
        searchInput.value = '';
        deactivateThread();
    }
});

newThreadBtn.addEventListener('click', (e: Event) => {
    if (!forumPostingEnabled) {
        showToast(t('readOnlyDesc'), 'err');
        return;
    }

    if (!currentUser() && !auth.currentUser) {
        redirectToLogin();
        return;
    }

    openThreadModal();
});

threadCancelBtn.addEventListener('click', (e: Event) => {
    closeThreadModal();
});

threadModalEl.addEventListener('click', (event: Event) => {
    if (event.target === threadModalEl) {
        closeThreadModal();
    }
});

document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.key === 'Escape' && threadModalOpen) {
        closeThreadModal();
    }
});

threadFormEl.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
    const title = threadTitleInputEl.value.trim();
    const content = threadContentInputEl.value.trim();
    const categoryId = threadCategorySelectEl.value.trim();
    const selected = categories.find((cat) => cat.id === categoryId);

    if (!forumPostingEnabled) {
        showToast(t('readOnlyDesc'), 'err');
        return;
    }
    if (!selected || !title || !content) {
        showToast(t('threadCreateError'), 'err');
        return;
    }

    threadSubmitBtn.disabled = true;
    const originalText = threadSubmitBtn.textContent;
    if (threadFiles.length > 0) {
        threadSubmitBtn.textContent = 'Загрузка...';
    }
    
    try {
        const imageUrls = [];
        for (const f of threadFiles) {
            const url = await uploadForumImage(f.file);
            imageUrls.push(url);
        }
        
        const threadId = await createForumThread({
            categoryId: selected.id,
            categoryKey: selected.key,
            title,
            content,
            images: imageUrls,
        });
        showToast(t('threadCreateSuccess'), 'ok');
        activateThread(threadId);
    } catch (err) {
        console.error('[forum] thread create failed', err);
        showToast(t('threadCreateError'), 'err');
    } finally {
        threadSubmitBtn.disabled = false;
        threadSubmitBtn.textContent = originalText;
    }
});

threadReplyInputEl.addEventListener('input', (e: Event) => {
    threadReplyInputEl.style.height = '0px';
    threadReplyInputEl.style.height = `${Math.min(threadReplyInputEl.scrollHeight, 160)}px`;
});

threadReplyFormEl.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
    if (!activeThread) return;

    if (!forumPostingEnabled) {
        showToast(t('readOnlyDesc'), 'err');
        return;
    }
    if (!currentUser() && !auth.currentUser) {
        redirectToLogin();
        return;
    }

    const text = threadReplyInputEl.value.trim();
    if (!text) return;

    threadReplySubmitBtn.disabled = true;
    const originalText = threadReplySubmitBtn.textContent;
    if (replyFiles.length > 0) {
        threadReplySubmitBtn.textContent = 'Загрузка...';
    }
    
    try {
        const imageUrls = [];
        for (const f of replyFiles) {
            const url = await uploadForumImage(f.file);
            imageUrls.push(url);
        }
        
        await createForumReply({
            threadId: activeThread.id,
            text,
            images: imageUrls,
        });
        threadReplyInputEl.value = '';
        threadReplyInputEl.style.height = '';
        replyFiles = [];
        renderFilePreviews(replyFiles, replyFilePreview);
    } catch (err) {
        console.error('[forum] reply create failed', err);
        showToast(t('threadReplyError'), 'err');
    } finally {
        threadReplySubmitBtn.disabled = false;
        threadReplySubmitBtn.textContent = originalText;
    }
});

threadPostsEl.addEventListener('click', async (event: Event) => {
    if (!isStaffViewer || !activeThread) return;
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-delete-post-id]');
    if (!btn) return;

    const postId = btn.dataset.deletePostId?.trim() ?? '';
    if (!postId) return;
    if (!window.confirm(staffText('deleteConfirmReply'))) return;

    btn.disabled = true;
    try {
        await deleteForumPost(activeThread.id, postId);
        showToast(staffText('deleteDone'), 'ok');
    } catch (err) {
        console.error('[forum] post delete failed', err);
        showToast(staffText('deleteFailed'), 'err');
        btn.disabled = false;
    }
});

threadViewMetaEl.addEventListener('click', async (event: Event) => {
    if (!isStaffViewer || !activeThread) return;
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-delete-thread-id]');
    if (!btn) return;
    if (!window.confirm(staffText('deleteConfirmThread'))) return;

    btn.disabled = true;
    try {
        await deleteForumThread(activeThread.id);
        showToast(staffText('deleteDone'), 'ok');
        deactivateThread();
    } catch (err) {
        console.error('[forum] thread delete failed', err);
        showToast(staffText('deleteFailed'), 'err');
        btn.disabled = false;
    }
});

categoriesEl.addEventListener('click', (e: Event) => {
    const card = (e.target as HTMLElement).closest<HTMLButtonElement>('.forum-cat-card[data-category]');
    if (!card) return;

    const category = card.dataset.category as ForumCategoryKey | undefined;
    if (!category) return;

    activeCategory = category;
    searchQuery = '';
    searchInput.value = '';
    render();
});

threadsEl.addEventListener('click', (event: Event) => {
    const deleteBtn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-delete-thread-id]');
    if (deleteBtn) {
        void (async () => {
            if (!isStaffViewer) return;

            const threadId = deleteBtn.dataset.deleteThreadId?.trim() ?? '';
            if (!threadId) return;
            if (!window.confirm(staffText('deleteConfirmThread'))) return;

            deleteBtn.disabled = true;
            try {
                await deleteForumThread(threadId);
                showToast(staffText('deleteDone'), 'ok');
                if (activeThreadId === threadId) {
                    deactivateThread();
                }
            } catch (err) {
                console.error('[forum] thread delete from list failed', err);
                showToast(staffText('deleteFailed'), 'err');
                deleteBtn.disabled = false;
            }
        })();
        return;
    }

    const threadCard = (event.target as HTMLElement).closest<HTMLButtonElement>('.forum-thread[data-thread-id]');
    if (!threadCard) return;

    const threadId = threadCard.dataset.threadId?.trim() ?? '';
    if (!threadId) return;
    activateThread(threadId);
});

window.addEventListener('popstate', (e: Event) => {
    const nextThreadId = new URLSearchParams(window.location.search).get('thread')?.trim() ?? '';
    if (nextThreadId === activeThreadId) return;
    if (nextThreadId) {
        activateThread(nextThreadId, false, true);
    } else {
        deactivateThread(false, true);
    }
});

// ---- Title sync ----
const syncTitle = (lang: Language): void => {
    const title = activeThread?.title?.trim() || forumTranslations[lang].title;
    document.title = `${title} | Sword Art Online`;
};

// ---- Initial render + re-render on language change ----
syncTitle(getCurrentLanguage());
render();

async function refreshForumStaffUi(): Promise<void> {
    isStaffViewer = await hasStaffRole().catch(() => false);
    render();
}

forumVisibilityToggle?.addEventListener('click', async (e: Event) => {
    if (!forumVisibilityToggle) return;
    const nextVisible = !forumPublicVisible;
    forumVisibilityToggle.disabled = true;
    const prevLabel = forumVisibilityToggle.textContent;
    forumVisibilityToggle.textContent = nextVisible ? 'Открытие...' : 'Скрытие...';
    try {
        await setForumPublicVisibility(nextVisible);
        showToast(nextVisible ? 'Форум снова виден пользователям' : 'Публичный форум скрыт');
    } catch (err) {
        console.error('[forum] failed to toggle visibility', err);
        showToast('Не удалось изменить видимость форума');
        forumVisibilityToggle.textContent = prevLabel ?? '';
    } finally {
        forumVisibilityToggle.disabled = false;
    }
});

forumPostingToggle?.addEventListener('click', async (e: Event) => {
    if (!forumPostingToggle) return;
    const nextEnabled = !forumPostingEnabled;
    forumPostingToggle.disabled = true;
    const prevLabel = forumPostingToggle.textContent;
    forumPostingToggle.textContent = nextEnabled ? 'Включение...' : 'Отключение...';
    try {
        await setForumPostingEnabled(nextEnabled);
        showToast(nextEnabled ? 'Режим постинга включен для следующего этапа' : 'Режим постинга выключен');
    } catch (err) {
        console.error('[forum] failed to toggle posting state', err);
        showToast('Не удалось изменить режим постинга');
        forumPostingToggle.textContent = prevLabel ?? '';
    } finally {
        forumPostingToggle.disabled = false;
    }
});

onCurrentUserChange(() => {
    void refreshForumStaffUi();
});

onLanguageChange((lang: Language) => {
    syncThreadCategoryOptions();
    syncTitle(lang);
    render();
});

subscribeForumVisibility(
    (state: any) => {
        forumPublicVisible = state.publicVisible;
        forumPostingEnabled = state.postingEnabled;
        render();
    },
    (err: Error) => {
        console.error('[forum] visibility subscription failed', err);
    },
);

void refreshForumStaffUi();
void whenAuthReady().then(() => {
    render();
});

if (activeThreadId) {
    activateThread(activeThreadId, false, true);
}

// ---- Live data ----
subscribeForumCategories(
    (list: ForumCategoryDoc[]) => {
        categories = list;
        categoriesLoaded = true;
        loadError = null;
        syncThreadCategoryOptions();
        render();
    },
    (err: Error) => {
        console.error('[forum] categories subscription failed', err);
        loadError = err;
        render();
    },
);

subscribeForumThreads(
    (list: ForumThreadDoc[]) => {
        threads = list;
        threadsLoaded = true;
        loadError = null;
        render();
    },
    (err: Error) => {
        console.error('[forum] threads subscription failed', err);
        loadError = err;
        render();
    },
);
