/**
 * 404 page entry point.
 *
 * Served by Firebase Hosting for any path that doesn't resolve to a real
 * page in `dist/`. Keeps the `href="javascript:..."` back-link unfocusable
 * when there's no history (e.g. user landed directly on a bad URL).
 */

import type { Language } from '@models/user';
import {
    applyAnimationPref,
    byId,
    byIdMaybe,
    getCurrentLanguage,
    initI18n,
    initLangSwitcher,
    onLanguageChange,
    registerTranslations,
} from '@lib';
import { buildDict, notFoundTranslations } from '@translations';

applyAnimationPref();
registerTranslations(buildDict('notfound'));
initI18n();

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

// Hide "Back" when there's no real history to go back to
if (window.history.length <= 1) {
    const back = document.querySelector<HTMLAnchorElement>('.notfound-btn--ghost');
    if (back) back.style.display = 'none';
}

const syncTitle = (lang: Language): void => {
    document.title = `404 - ${notFoundTranslations[lang].title} | Sword Art Online`;
};
syncTitle(getCurrentLanguage());
onLanguageChange(syncTitle);
