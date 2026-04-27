/**
 * Support page entry point.
 *
 * Responsibilities:
 *   1. Translations + language switcher.
 *   2. Render FAQ accordion from dict (re-rendered on language change).
 *   3. Prefill name/email from logged-in user (if any).
 *   4. File attachments: click-to-browse + drag-and-drop, mime/ext/size
 *      validation, image preview, video-frame thumbnail generation, remove.
 *   5. Form submission: client-side validation, Firestore write to
 *      `supportTickets/`, success/error toast, form reset.
 *
 * Attachments are metadata-only at rest (name/size/type) - the actual bytes
 * are never uploaded. A Cloud Function listens on the collection and fans
 * each ticket out to Discord + an auto-reply email (see `functions/`).
 */

import type { Language } from '@models/user';
import {
    applyAnimationPref,
    byId,
    byIdMaybe,
    currentUser,
    formatBytes,
    formatUserDisplayName,
    getCurrentLanguage,
    hasStaffRole,
    initI18n,
    initLangSwitcher,
    onCurrentUserChange,
    onLanguageChange,
    registerTranslations,
    showToast,
    submitSupportTicket,
    validateEmail,
    whenAuthReady,
} from '@lib';
import type { TicketInput } from '@lib';
import { buildDict, supportTranslations } from '@translations';
import type { FaqItem, SupportDict } from '@translations';

// ===== Boot =====

applyAnimationPref();
registerTranslations(buildDict('support'));
initI18n();

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

const supportAdminTicketsLink = byIdMaybe<HTMLAnchorElement>('support-admin-tickets-link');

async function syncSupportHubNav(): Promise<void> {
    const user = currentUser();
    if (supportAdminTicketsLink) {
        supportAdminTicketsLink.hidden = !(user && await hasStaffRole().catch(() => false));
    }
}

// ===== Typed dict access =====

/** Full typed SupportDict for the active locale. */
function dict(): SupportDict {
    return supportTranslations[getCurrentLanguage()];
}

// Keep <title> in sync with active language
const syncDocTitle = () => {
    document.title = `${dict().title} | Sword Art Online`;
};
syncDocTitle();
onLanguageChange(syncDocTitle);

// ===== FAQ accordion =====

const faqList = byId<HTMLDivElement>('faq-list');

/**
 * Rebuild the FAQ list from the active dictionary. Called on boot and
 * on every language change - the FAQ answers may contain inline HTML so
 * we use innerHTML for `.faq-answer-inner` (the strings are author-controlled).
 */
function renderFaq(): void {
    const items: FaqItem[] = dict().faq;
    faqList.replaceChildren();

    for (const item of items) {
        const wrap = document.createElement('div');
        wrap.className = 'faq-item';

        const btn = document.createElement('button');
        btn.className = 'faq-question';
        btn.type = 'button';

        const q = document.createElement('span');
        q.textContent = item.q;
        btn.appendChild(q);

        // Plus icon (rotates into an ✕ on open via CSS)
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('class', 'faq-icon');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2.5');
        svg.setAttribute('stroke-linecap', 'round');
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', 'M12 5v14M5 12h14');
        svg.appendChild(path);
        btn.appendChild(svg);

        const answer = document.createElement('div');
        answer.className = 'faq-answer';
        const inner = document.createElement('div');
        inner.className = 'faq-answer-inner';
        // FAQ text may contain <a href="..."> - author-trusted content.
        inner.innerHTML = item.a;
        answer.appendChild(inner);

        btn.addEventListener('click', () => wrap.classList.toggle('open'));

        wrap.appendChild(btn);
        wrap.appendChild(answer);
        faqList.appendChild(wrap);
    }
}

renderFaq();
onLanguageChange(renderFaq);

// ===== Prefill from logged-in user =====

const nameInput = byId<HTMLInputElement>('sup-name');
const emailInput = byId<HTMLInputElement>('sup-email');
const categorySelect = byId<HTMLSelectElement>('sup-category');
const subjectInput = byId<HTMLInputElement>('sup-subject');
const messageInput = byId<HTMLTextAreaElement>('sup-message');

function prefill(): void {
    const user = currentUser();
    if (!user) return;
    const displayName = formatUserDisplayName(user);
    if (displayName) nameInput.value = displayName;
    if (user.email) emailInput.value = user.email;
}

prefill();
onCurrentUserChange(() => {
    prefill();
    void syncSupportHubNav();
});
void whenAuthReady().then(() => {
    prefill();
    return syncSupportHubNav();
});

// ===== File attachments =====

const MAX_FILES = 5;
const MAX_IMAGE_DOC_SIZE = 5 * 1024 * 1024;   // 5 MB
const MAX_VIDEO_SIZE = 20 * 1024 * 1024;      // 20 MB

const ALLOWED_TYPES: readonly string[] = [
    'image/png', 'image/jpeg', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/quicktime',
    'application/pdf', 'text/plain',
];
/** Fallback when mime type is absent (Windows reports .log as empty). */
const ALLOWED_EXTS: readonly string[] = ['log'];

interface AttachedFile {
    file: File;
    /** data-URL or blob-URL for preview; `null` until thumbnail is ready. */
    preview: string | null;
}

const attached: AttachedFile[] = [];

const dropzone = byId<HTMLDivElement>('file-dropzone');
const fileInput = byId<HTMLInputElement>('file-input');
const fileList = byId<HTMLDivElement>('file-list');
const fileMsg = byId<HTMLDivElement>('file-msg');

function isVideo(file: File): boolean {
    return file.type.startsWith('video/');
}

function maxSizeFor(file: File): number {
    return isVideo(file) ? MAX_VIDEO_SIZE : MAX_IMAGE_DOC_SIZE;
}

function isAllowed(file: File): boolean {
    if (ALLOWED_TYPES.includes(file.type)) return true;
    const ext = (file.name.split('.').pop() ?? '').toLowerCase();
    return ALLOWED_EXTS.includes(ext);
}

function fileIcon(file: File): string {
    if (file.type.startsWith('image/')) return '🖼️';
    if (isVideo(file)) return '🎬';
    if (file.type === 'application/pdf') return '📄';
    if (file.type === 'text/plain' || /\.(txt|log)$/i.test(file.name)) return '📃';
    return '📎';
}

let fileMsgTimer: number | null = null;

function showFileMsg(text: string, kind: 'ok' | 'err' = 'err'): void {
    fileMsg.textContent = text;
    fileMsg.classList.remove('ok', 'err');
    fileMsg.classList.add('show', kind);
    if (fileMsgTimer !== null) window.clearTimeout(fileMsgTimer);
    fileMsgTimer = window.setTimeout(() => {
        fileMsg.classList.remove('show');
    }, 4000);
}

function renderAttached(): void {
    fileList.replaceChildren();

    attached.forEach((entry, idx) => {
        const wrap = document.createElement('div');
        wrap.className = 'sao-file-item';

        const thumb = document.createElement('div');
        thumb.className = 'sao-file-thumb';

        if (entry.file.type.startsWith('image/') && entry.preview) {
            const img = document.createElement('img');
            img.src = entry.preview;
            img.alt = entry.file.name;
            thumb.appendChild(img);
        } else if (isVideo(entry.file) && entry.preview) {
            thumb.classList.add('video-thumb');
            const img = document.createElement('img');
            img.src = entry.preview;
            img.alt = entry.file.name;
            thumb.appendChild(img);
        } else if (isVideo(entry.file)) {
            thumb.classList.add('video-thumb');
            thumb.textContent = '🎬';
        } else {
            thumb.textContent = fileIcon(entry.file);
        }

        const info = document.createElement('div');
        info.className = 'sao-file-info';
        const name = document.createElement('div');
        name.className = 'sao-file-name';
        name.textContent = entry.file.name;
        const size = document.createElement('div');
        size.className = 'sao-file-size';
        size.textContent = formatBytes(entry.file.size);
        info.appendChild(name);
        info.appendChild(size);

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'sao-file-remove';
        remove.setAttribute('aria-label', 'Remove');
        remove.textContent = '✕';
        remove.addEventListener('click', () => {
            attached.splice(idx, 1);
            renderAttached();
        });

        wrap.appendChild(thumb);
        wrap.appendChild(info);
        wrap.appendChild(remove);
        fileList.appendChild(wrap);
    });
}

/**
 * Extract a representative frame from a video file via <video> + <canvas>.
 * Returns `null` if the browser can't decode or times out.
 */
function generateVideoThumbnail(
    file: File,
    onDone: (dataUrl: string | null) => void,
): void {
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = url;

    let done = false;
    const cleanup = () => URL.revokeObjectURL(url);

    const capture = () => {
        if (done) return;
        done = true;
        try {
            const canvas = document.createElement('canvas');
            const w = Math.min(160, video.videoWidth || 160);
            const h = video.videoHeight
                ? Math.round(w * (video.videoHeight / video.videoWidth))
                : w;
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                onDone(null);
                return;
            }
            ctx.drawImage(video, 0, 0, w, h);
            onDone(canvas.toDataURL('image/jpeg', 0.7));
        } catch {
            onDone(null);
        } finally {
            cleanup();
        }
    };

    video.addEventListener('loadeddata', () => {
        // Seek slightly past zero to avoid black first frame
        try {
            video.currentTime = Math.min(0.2, (video.duration || 1) / 2);
        } catch {
            capture();
        }
    });
    video.addEventListener('seeked', capture);
    video.addEventListener('error', () => {
        done = true;
        cleanup();
        onDone(null);
    });

    // Safety timeout so a stuck file doesn't leave the preview forever pending
    window.setTimeout(() => {
        if (!done) {
            done = true;
            cleanup();
            onDone(null);
        }
    }, 4000);
}

function addFiles(list: FileList | File[]): void {
    const files = Array.from(list);
    const d = dict();

    for (const file of files) {
        if (attached.length >= MAX_FILES) {
            showFileMsg(d.attachTooMany);
            break;
        }
        if (!isAllowed(file)) {
            showFileMsg(d.attachBadType(file.name));
            continue;
        }
        if (file.size > maxSizeFor(file)) {
            showFileMsg(d.attachTooBig(file.name));
            continue;
        }

        const entry: AttachedFile = { file, preview: null };
        attached.push(entry);

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                entry.preview = typeof e.target?.result === 'string' ? e.target.result : null;
                renderAttached();
            };
            reader.readAsDataURL(file);
        } else if (isVideo(file)) {
            generateVideoThumbnail(file, (dataUrl) => {
                entry.preview = dataUrl;
                renderAttached();
            });
        }
    }
    renderAttached();
}

dropzone.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('.sao-file-remove')) return;
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    if (fileInput.files?.length) addFiles(fileInput.files);
    fileInput.value = '';
});

(['dragenter', 'dragover'] as const).forEach((ev) => {
    dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.add('drag-over');
    });
});
(['dragleave', 'drop'] as const).forEach((ev) => {
    dropzone.addEventListener(ev, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzone.classList.remove('drag-over');
    });
});
dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer?.files.length) addFiles(e.dataTransfer.files);
});

// ===== Form submit =====

const form = byId<HTMLFormElement>('support-form');
const submitBtn = byId<HTMLButtonElement>('sup-submit');

const nameMsg = byId('sup-name-msg');
const emailMsg = byId('sup-email-msg');
const subjectMsg = byId('sup-subject-msg');
const messageMsg = byId('sup-message-msg');

function clearErrors(): void {
    [nameInput, emailInput, subjectInput, messageInput].forEach((el) =>
        el.classList.remove('error'),
    );
    [nameMsg, emailMsg, subjectMsg, messageMsg].forEach((el) =>
        el.classList.remove('show', 'ok', 'err'),
    );
}

function setError(
    field: HTMLInputElement | HTMLTextAreaElement,
    msgEl: HTMLElement,
    text: string,
): void {
    field.classList.add('error');
    msgEl.textContent = text;
    msgEl.classList.add('show', 'err');
}

type TicketCategory = TicketInput['category'];

function isValidCategory(value: string): value is TicketCategory {
    return (
        value === 'account' ||
        value === 'bug' ||
        value === 'payment' ||
        value === 'tech' ||
        value === 'other'
    );
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const d = dict();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();
    const categoryRaw = categorySelect.value;

    let ok = true;

    if (name.length === 0) {
        setError(nameInput, nameMsg, d.nameEmpty);
        ok = false;
    }
    if (!validateEmail(email)) {
        setError(emailInput, emailMsg, d.emailBad);
        ok = false;
    }
    if (subject.length === 0) {
        setError(subjectInput, subjectMsg, d.subjectEmpty);
        ok = false;
    } else if (subject.length < 3) {
        setError(subjectInput, subjectMsg, d.subjectShort);
        ok = false;
    }
    if (message.length === 0) {
        setError(messageInput, messageMsg, d.messageEmpty);
        ok = false;
    } else if (message.length < 20) {
        setError(messageInput, messageMsg, d.messageShort);
        ok = false;
    }

    if (!ok) return;

    const category: TicketCategory = isValidCategory(categoryRaw) ? categoryRaw : 'other';

    const input: TicketInput = {
        name,
        email,
        category,
        subject,
        message,
        attachments: attached.map((a) => ({
            name: a.file.name,
            url: '', // Support page doesn't upload files yet, just mocking structure for now
            size: a.file.size,
            type: a.file.type,
        })),
        lang: getCurrentLanguage() as Language,
    };

    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = d.formSubmitting;

    const result = await submitSupportTicket(input);

    submitBtn.disabled = false;
    submitBtn.textContent = originalText;

    if (!result.ok) {
        const msg = result.reason === 'network' ? d.ticketErrNetwork : d.ticketErrGeneric;
        showToast(msg, 'err', { duration: 6000 });
        return;
    }

    showToast(d.successMsg, 'ok');

    // Reset form but keep name/email if user is still logged in
    subjectInput.value = '';
    messageInput.value = '';
    categorySelect.selectedIndex = 0;
    attached.length = 0;
    renderAttached();

    if (!currentUser()) {
        nameInput.value = '';
        emailInput.value = '';
    }
});
