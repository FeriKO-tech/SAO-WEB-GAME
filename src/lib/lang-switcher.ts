/**
 * Re-usable language-switcher behaviour.
 *
 * Wires up a dropdown button + links so that clicking a language link
 * calls `setActiveLanguage()` and closes the dropdown. The DOM contract
 * is minimal: a wrapper with an `open` class toggle, a button inside it,
 * and `<a data-lang="RU">`-style links within the dropdown.
 *
 * Usage in markup:
 *   <div class="lang-switcher" id="lang-switcher">
 *     <button id="lang-btn"><span id="current-lang">RU</span> ▼</button>
 *     <div class="lang-dropdown">
 *       <a href="#" data-lang="RU">RU — Русский</a>
 *       ...
 *     </div>
 *   </div>
 *
 * Usage in page entry:
 *   initLangSwitcher({
 *       switcher: byId('lang-switcher'),
 *       button: byId('lang-btn'),
 *       currentLabel: byId('current-lang'),
 *   });
 */

import type { Language } from '@models/user';
import { setActiveLanguage, getCurrentLanguage, onLanguageChange, isSupportedLanguage, t } from './i18n';

interface LangSwitcherOptions {
    /** Root element that receives the `open` class */
    switcher: HTMLElement;
    /** Button that toggles the dropdown */
    button: HTMLElement;
    /** Element whose text reflects the current language code (e.g. "RU") */
    currentLabel?: HTMLElement | null;
    /** Optional page-title template, receives current dict's `title` key */
    titleTemplate?: (currentTitle: string) => string;
}

export function initLangSwitcher(opts: LangSwitcherOptions): void {
    const { switcher, button, currentLabel } = opts;

    const syncExpanded = (isOpen: boolean) => {
        button.setAttribute('aria-expanded', String(isOpen));
    };

    // Toggle on button click
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        const nextOpen = !switcher.classList.contains('open');
        switcher.classList.toggle('open', nextOpen);
        syncExpanded(nextOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!switcher.contains(e.target as Node)) {
            switcher.classList.remove('open');
            syncExpanded(false);
        }
    });

    // Pick a language
    const links = switcher.querySelectorAll<HTMLAnchorElement>('a[data-lang]');
    links.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = link.dataset.lang;
            switcher.classList.remove('open');
            syncExpanded(false);
            if (lang && isSupportedLanguage(lang)) {
                setActiveLanguage(lang);
            }
        });
    });

    // Keep the label and `.active` class in sync with whatever language is active
    const syncUi = (lang: Language) => {
        if (currentLabel) currentLabel.textContent = lang;
        links.forEach((link) => {
            link.classList.toggle('active', link.dataset.lang === lang);
        });
        button.setAttribute('aria-label', t('languageSwitcherLabel'));
    };

    syncExpanded(false);
    syncUi(getCurrentLanguage());
    onLanguageChange(syncUi);
}
