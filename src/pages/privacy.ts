/**
 * Privacy Policy page entry point.
 *
 * Static legal copy — no interactions beyond the language switcher. The i18n
 * runtime sweeps all `data-i18n` / `data-i18n-html` elements on boot and on
 * every language change.
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
import { buildDict, privacyTranslations } from '@translations';

applyAnimationPref();
registerTranslations(buildDict('privacy'));
initI18n();

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

// Keep <title> in sync with the active language
const syncTitle = (lang: Language): void => {
    document.title = `${privacyTranslations[lang].title} | Sword Art Online`;
};
syncTitle(getCurrentLanguage());
onLanguageChange(syncTitle);
