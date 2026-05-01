import { Language } from '../models/user';

export function getCurrentLanguage(): Language {
    if (typeof window !== 'undefined') {
        const locale = window.location.pathname.split('/')[1];
        // Проверяем, что это допустимый язык, иначе возвращаем дефолтный
        const supported: Language[] = ['ru', 'en', 'de', 'fr', 'pl', 'es', 'cz', 'it', 'ua'];
        return supported.includes(locale as Language) ? (locale as Language) : 'ru';
    }
    return 'ru';
}