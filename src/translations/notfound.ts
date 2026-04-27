/**
 * 404 page translations (all 8 locales).
 *
 * Served by Firebase Hosting when a requested path does not exist under
 * `dist/`. Kept tiny - four keys only.
 */

import type { LanguageMap } from '@models/i18n';

export interface NotFoundDict {
    title: string;
    subtitle: string;
    home: string;
    back: string;
}

export const notFoundTranslations: LanguageMap<NotFoundDict> = {
    RU: {
        title: 'Страница не найдена',
        subtitle: 'Эта страница либо ещё не существует, либо исчезла вместе со своим автором.',
        home: 'Вернуться на главную',
        back: '← Назад',
    },
    EN: {
        title: 'Page not found',
        subtitle: 'This page either does not exist yet or vanished along with its creator.',
        home: 'Back to home',
        back: '← Back',
    },
    DE: {
        title: 'Seite nicht gefunden',
        subtitle: 'Diese Seite existiert noch nicht oder ist mit ihrem Ersteller verschwunden.',
        home: 'Zurück zur Startseite',
        back: '← Zurück',
    },
    FR: {
        title: 'Page introuvable',
        subtitle: 'Cette page n\'existe pas encore ou a disparu avec son créateur.',
        home: 'Retour à l\'accueil',
        back: '← Retour',
    },
    PL: {
        title: 'Strona nie znaleziona',
        subtitle: 'Ta strona jeszcze nie istnieje lub zniknęła wraz ze swoim twórcą.',
        home: 'Powrót do strony głównej',
        back: '← Wstecz',
    },
    ES: {
        title: 'Página no encontrada',
        subtitle: 'Esta página aún no existe o desapareció junto con su creador.',
        home: 'Volver al inicio',
        back: '← Volver',
    },
    CZ: {
        title: 'Stránka nenalezena',
        subtitle: 'Tato stránka buď ještě neexistuje, nebo zmizela spolu se svým tvůrcem.',
        home: 'Zpět na hlavní',
        back: '← Zpět',
    },
    IT: {
        title: 'Pagina non trovata',
        subtitle: 'Questa pagina non esiste ancora o è scomparsa insieme al suo creatore.',
        home: 'Torna alla home',
        back: '← Indietro',
    },
};
