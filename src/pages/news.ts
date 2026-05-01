/**
 * News page entry point.
 *
 * Renders a category-filtered grid of news cards + a featured post from
 * the live `news` Firestore collection via `subscribeNews()`.
 *
 * While the first snapshot is loading the UI shows a skeleton state;
 * if the subscription errors out we fall back to a human-readable
 * message. UI text (category badges, "Read more", dates, etc.) is
 * translated via the `news` dictionary.
 */

import type { Language } from '@models/user';
import {
    applyAnimationPref,
    byId,
    byIdMaybe,
    getCurrentLanguage,
    hasStaffRole,
    initI18n,
    initLangSwitcher,
    onLanguageChange,
    onCurrentUserChange,
    registerTranslations,
    showToast,
    subscribeNews,
    t,
} from '@lib';
import { createNewsItem, validateNewsData, uploadNewsImage, type NewsPostDocCreate } from '@lib/news';
import { buildDict, newsTranslations, type NewsDict } from '@translations';
import type { NewsPostDoc } from '@lib/content';

type NewsCategory = NewsPostDoc['category'];
type FilterValue = 'all' | NewsCategory;

applyAnimationPref();
registerTranslations(buildDict('news'));
initI18n();

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

// ---- DOM refs ----
const gridEl = byId<HTMLDivElement>('news-grid');
const featuredEl = byId<HTMLElement>('news-featured');
const emptyEl = byId<HTMLDivElement>('news-empty');
const filtersEl = byId<HTMLDivElement>('news-filters');
const createNewsBtn = byIdMaybe<HTMLButtonElement>('create-news-btn');

// Modal refs
const modalOverlay = byIdMaybe<HTMLDivElement>('news-editor-modal');
const modalForm = byIdMaybe<HTMLFormElement>('news-editor-form');
const modalClose = byIdMaybe<HTMLButtonElement>('news-editor-close');
const modalCancel = byIdMaybe<HTMLButtonElement>('news-editor-cancel');

const ADMIN_LANG_LABELS: Record<string, string> = {
    ru: 'RU - Русский',
    en: 'EN - English',
    de: 'DE - Deutsch',
    fr: 'FR - Français',
    pl: 'PL - Polski',
    es: 'ES - Español',
    cz: 'CZ - Čeština',
    it: 'IT - Italiano',
};

// ---- State ----
let activeFilter: FilterValue = 'all';
let posts: NewsPostDoc[] = [];
let loaded = false;
let loadError: Error | null = null;

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
    UA: 'uk-UA',
};

function formatDate(iso: string, lang: Language): string {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return new Intl.DateTimeFormat(LOCALE_MAP[lang], {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(d);
}

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** Build a news card (either regular grid card or featured hero). */
function renderCard(post: NewsPostDoc, lang: Language, featured: boolean): string {
    const catLabel = t(post.category);
    const dateLabel = formatDate(post.date, lang);
    const readMore = t('readMore');
    const minRead = t('minRead');
    const byAuthor = t('byAuthor');
    const featuredLabel = t('featuredLabel');
    const coverAlt = post.title;

    const cls = featured ? 'news-card news-card--featured' : 'news-card';

    return `
        <article class="${cls}" data-category="${post.category}">
            <div class="news-card-media">
                <img src="${post.cover}" alt="${escapeHtml(coverAlt)}" class="news-card-img" loading="lazy">
                <span class="news-card-badge">${escapeHtml(catLabel)}</span>
                ${featured ? `<span class="news-card-featured-label">${escapeHtml(featuredLabel)}</span>` : ''}
            </div>
            <div class="news-card-body">
                <div class="news-card-meta">
                    <time datetime="${post.date}">${escapeHtml(dateLabel)}</time>
                    <span class="news-card-dot">•</span>
                    <span>${post.minRead} ${escapeHtml(minRead)}</span>
                </div>
                <h3 class="news-card-title">${escapeHtml(post.title)}</h3>
                <p class="news-card-excerpt">${escapeHtml(post.excerpt)}</p>
                <div class="news-card-footer">
                    <span class="news-card-author">${escapeHtml(byAuthor)}: ${escapeHtml(post.author)}</span>
                    <span class="news-card-link" aria-hidden="true">
                        ${escapeHtml(readMore)}
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M2 6h8M7 3l3 3-3 3"/>
                        </svg>
                    </span>
                </div>
            </div>
        </article>
    `;
}

function renderSkeleton(count: number): string {
    let out = '';
    for (let i = 0; i < count; i++) {
        out += `
            <article class="news-card news-card--skeleton" aria-hidden="true">
                <div class="news-card-media skeleton-box"></div>
                <div class="news-card-body">
                    <div class="skeleton-line skeleton-line--sm"></div>
                    <div class="skeleton-line skeleton-line--lg"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line skeleton-line--sm"></div>
                </div>
            </article>
        `;
    }
    return out;
}

function render(): void {
    const lang = getCurrentLanguage();
    filtersEl.setAttribute('aria-label', t('filtersLabel'));

    // --- loading ---
    if (!loaded && !loadError) {
        featuredEl.hidden = true;
        featuredEl.innerHTML = '';
        gridEl.hidden = false;
        gridEl.innerHTML = renderSkeleton(6);
        emptyEl.hidden = true;
        return;
    }

    // --- error ---
    if (loadError) {
        featuredEl.hidden = true;
        featuredEl.innerHTML = '';
        gridEl.hidden = true;
        gridEl.innerHTML = '';
        emptyEl.hidden = false;
        emptyEl.innerHTML = `<p>${escapeHtml(t('loadError'))}</p>`;
        return;
    }

    // --- data ---
    const filtered = posts.filter(
        p => activeFilter === 'all' || p.category === activeFilter,
    );

    const featured =
        activeFilter === 'all'
            ? filtered.find(p => p.featured)
            : undefined;
    const rest = featured ? filtered.filter(p => p !== featured) : filtered;

    if (featured) {
        featuredEl.innerHTML = renderCard(featured, lang, true);
        featuredEl.hidden = false;
    } else {
        featuredEl.innerHTML = '';
        featuredEl.hidden = true;
    }

    gridEl.innerHTML = rest.map(p => renderCard(p, lang, false)).join('');

    const isEmpty = !featured && rest.length === 0;
    emptyEl.hidden = !isEmpty;
    if (isEmpty) {
        emptyEl.innerHTML = `
            <h3>${escapeHtml(t('emptyTitle'))}</h3>
            <p>${escapeHtml(t('emptyDesc'))}</p>
        `;
    }
    gridEl.hidden = isEmpty;
}

// ---- Filter clicks ----
filtersEl.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.news-filter');
    if (!btn) return;
    const filter = btn.dataset.filter as FilterValue | undefined;
    if (!filter) return;

    filtersEl.querySelectorAll<HTMLButtonElement>('.news-filter').forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle('active', isActive);
        b.setAttribute('aria-selected', String(isActive));
    });

    activeFilter = filter;
    render();
});

// ---- Modal functions ----
function closeAdminDropdowns(): void {
    if (!modalForm) return;
    modalForm.querySelectorAll<HTMLElement>('.admin-dropdown.open').forEach((dropdown) => {
        dropdown.classList.remove('open');
        const trigger = dropdown.querySelector<HTMLButtonElement>('.admin-dropdown-btn');
        trigger?.setAttribute('aria-expanded', 'false');
    });
}

function setAdminDropdownValue(dropdown: HTMLElement, value: string): void {
    const hiddenInput = dropdown.parentElement?.querySelector<HTMLInputElement>('input[type="hidden"]');
    const current = dropdown.querySelector<HTMLElement>('[data-dropdown-current]');
    const options = dropdown.querySelectorAll<HTMLButtonElement>('.admin-dropdown-option');
    const nextOption = Array.from(options).find((option) => option.dataset.value === value);
    if (!hiddenInput || !current || !nextOption) return;

    hiddenInput.value = value;

    options.forEach((option) => {
        const isActive = option === nextOption;
        option.classList.toggle('active', isActive);
        option.setAttribute('aria-selected', String(isActive));
    });

    if (dropdown.dataset.dropdownName === 'category') {
        current.textContent = nextOption.textContent ?? '';
        current.dataset.i18n = value;
    } else {
        current.textContent = ADMIN_LANG_LABELS[value] ?? (nextOption.textContent ?? value.toUpperCase());
        delete current.dataset.i18n;
    }
}

function syncAdminDropdowns(): void {
    if (!modalForm) return;
    modalForm.querySelectorAll<HTMLElement>('.admin-dropdown').forEach((dropdown) => {
        const hiddenInput = dropdown.parentElement?.querySelector<HTMLInputElement>('input[type="hidden"]');
        if (hiddenInput?.value) {
            setAdminDropdownValue(dropdown, hiddenInput.value);
        }
    });
}

function openNewsModal() {
    if (!modalOverlay || !modalForm) return;
    
    // Reset form
    modalForm.reset();
    
    // Set default language to current
    const langInput = modalForm.querySelector('#news-lang') as HTMLInputElement;
    if (langInput) {
        langInput.value = getCurrentLanguage().toLowerCase();
    }

    const categoryInput = modalForm.querySelector('#news-category') as HTMLInputElement;
    if (categoryInput) {
        categoryInput.value = 'catAnnouncements';
    }

    const filePreview = modalForm.querySelector('#news-image-preview') as HTMLDivElement;
    if (filePreview) {
        filePreview.style.backgroundImage = 'none';
        filePreview.classList.remove('has-image');
    }

    closeAdminDropdowns();
    syncAdminDropdowns();
    
    // Show modal
    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    const firstInput = modalForm.querySelector('#news-title') as HTMLInputElement;
    firstInput?.focus();
}

function closeNewsModal() {
    if (!modalOverlay) return;
    
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
}

function setupModalEvents() {
    if (!modalOverlay || !modalForm || !modalClose || !modalCancel) return;
    
    // Close buttons
    modalClose.onclick = closeNewsModal;
    modalCancel.onclick = closeNewsModal;
    
    // Overlay click to close
    modalOverlay.onclick = (e) => {
        if (e.target === modalOverlay) {
            closeNewsModal();
        }
    };

    modalForm.querySelectorAll<HTMLElement>('.admin-dropdown').forEach((dropdown) => {
        const trigger = dropdown.querySelector<HTMLButtonElement>('.admin-dropdown-btn');
        const options = dropdown.querySelectorAll<HTMLButtonElement>('.admin-dropdown-option');
        if (!trigger) return;

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const nextOpen = !dropdown.classList.contains('open');
            closeAdminDropdowns();
            dropdown.classList.toggle('open', nextOpen);
            trigger.setAttribute('aria-expanded', String(nextOpen));
        });

        options.forEach((option) => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                if (!value) return;
                setAdminDropdownValue(dropdown, value);
                dropdown.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            });
        });
    });

    document.addEventListener('click', (e) => {
        if (!modalForm.contains(e.target as Node)) {
            closeAdminDropdowns();
        }
    });

    modalForm.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.admin-dropdown')) {
            closeAdminDropdowns();
        }
    });
    
    // Escape key to close
    const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !modalOverlay.hidden) {
            closeNewsModal();
        }
    };
    document.addEventListener('keydown', handleEscape);
    
    // Setup file input preview
    const fileInput = modalForm.querySelector('#news-image') as HTMLInputElement;
    const filePreview = modalForm.querySelector('#news-image-preview') as HTMLDivElement;
    
    if (fileInput && filePreview) {
        fileInput.addEventListener('change', () => {
            if (fileInput.files && fileInput.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    filePreview.style.backgroundImage = `url(${e.target?.result})`;
                    filePreview.classList.add('has-image');
                };
                reader.readAsDataURL(fileInput.files[0]);
            } else {
                filePreview.style.backgroundImage = 'none';
                filePreview.classList.remove('has-image');
            }
        });
    }
    
    modalForm.onsubmit = async (e) => {
        e.preventDefault();
        
        const submitBtn = modalForm.querySelector('button[type="submit"]') as HTMLButtonElement;
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Сохранение...';
        }
        
        try {
            const formData = new FormData(modalForm);
            
            // Extract tags
            const tagsString = formData.get('tags') as string || '';
            const tags = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            
            // Upload image if a file was selected
            const imageFile = formData.get('imageFile') as File;
            let imageUrl = '';
            
            if (imageFile && imageFile.size > 0) {
                // Upload the file to Firebase Storage
                submitBtn.textContent = 'Загрузка обложки...';
                try {
                    imageUrl = await uploadNewsImage(imageFile);
                } catch (imgError) {
                    console.error('[news] Image upload failed:', imgError);
                    throw new Error('Не удалось загрузить изображение обложки');
                }
                submitBtn.textContent = 'Сохранение...';
            } else {
                throw new Error('Обложка обязательна для новости');
            }
            
            // Auto-generate slug if not provided or empty
            let slug = formData.get('slug') as string;
            const title = formData.get('title') as string;
            
            if (!slug || slug.trim() === '') {
                // Generate slug from title
                slug = title.toLowerCase()
                    .replace(/[^\w\sа-яё-]/g, '') // Remove special chars
                    .replace(/\s+/g, '-') // Replace spaces with hyphens
                    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
            }
            
            const newsData = {
                title,
                slug,
                category: formData.get('category') as NewsPostDoc['category'],
                imageUrl,
                excerpt: formData.get('excerpt') as string,
                content: formData.get('content') as string,
                tags,
                featured: formData.has('featured'),
                lang: formData.get('lang') as string,
            };
            
            // Validate data
            validateNewsData(newsData);
            
            // Create news item
            await createNewsItem(newsData);
            
            // Close modal and refresh
            closeNewsModal();
            
            // Show success message
            showToast(t('newsCreatedSuccess') || 'Новость успешно создана');
            
        } catch (error) {
            console.error('[news] Failed to create news:', error);
            const errorMessage = error instanceof Error ? error.message : 'Ошибка при создании новости';
            showToast(t('newsCreateError') || errorMessage);
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = t('save') || 'Сохранить';
            }
        }
    };
    
    // Auto-generate slug from title
    const titleInput = modalForm.querySelector('#news-title') as HTMLInputElement;
    const slugInput = modalForm.querySelector('#news-slug') as HTMLInputElement;
    
    if (titleInput && slugInput) {
        titleInput.oninput = () => {
            if (!slugInput.value || slugInput.dataset.autoGenerated === 'true') {
                const slug = titleInput.value
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                slugInput.value = slug;
                slugInput.dataset.autoGenerated = 'true';
            }
        };
        
        slugInput.oninput = () => {
            slugInput.dataset.autoGenerated = 'false';
        };
    }

    syncAdminDropdowns();
}

// ---- Staff UI ----
function updateStaffUI() {
    if (!createNewsBtn) return;
    
    // Check staff role synchronously for initial UI
    hasStaffRole().then(isStaff => {
        if (isStaff) {
            createNewsBtn.hidden = false;
            createNewsBtn.textContent = t('createNews');
            
            createNewsBtn.onclick = () => {
                openNewsModal();
            };
        } else {
            createNewsBtn.hidden = true;
        }
    }).catch(err => {
        console.error('[news] Error checking staff role:', err);
        createNewsBtn.hidden = true;
    });
}

// Listen for auth changes to update staff UI
onCurrentUserChange(() => {
    updateStaffUI();
});

// ---- Title sync ----
const syncTitle = (lang: Language): void => {
    document.title = `${newsTranslations[lang].title} | Sword Art Online`;
};

syncTitle(getCurrentLanguage());
render();
updateStaffUI();
setupModalEvents();

onLanguageChange((lang) => {
    syncTitle(lang);
    render();
    syncAdminDropdowns();
});

// ---- Live data subscription ----
subscribeNews(
    (list) => {
        posts = list;
        loaded = true;
        loadError = null;
        render();
    },
    (err) => {
        console.error('[news] subscription failed', err);
        loadError = err;
        loaded = true;
        render();
    },
);

// Expose types so the bundler doesn't shake them away.
export type { NewsDict };
