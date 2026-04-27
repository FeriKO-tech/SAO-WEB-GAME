/**
 * Terms of Service page entry point.
 *
 * Static legal copy — structurally identical to the privacy page. Only the
 * translation dictionary differs.
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
import { buildDict, termsTranslations } from '@translations';

applyAnimationPref();
registerTranslations(buildDict('terms'));
initI18n();

initLangSwitcher({
    switcher: byId('lang-switcher'),
    button: byId('lang-btn'),
    currentLabel: byIdMaybe('current-lang'),
});

const syncTitle = (lang: Language): void => {
    document.title = `${termsTranslations[lang].title} | Sword Art Online`;
};
syncTitle(getCurrentLanguage());
onLanguageChange(syncTitle);
