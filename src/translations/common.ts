/**
 * Keys shared across multiple pages.
 *
 * Anything used in 2+ pages (nav labels, footer, generic buttons,
 * validation messages, email-message templates) lives here. Page-specific
 * translations are kept in `src/translations/{page}.ts` and merged at
 * page init via `buildDict()` from `./index.ts`.
 */

import type { LanguageMap } from '@models/i18n';

export interface CommonDict {
    // ===== Header / navigation =====
    nav: string[];                     // ['Discord', 'Forum', 'Support', 'Log In']
    back: string;                      // '← Back to home'
    languageSwitcherLabel: string;
    filtersLabel: string;
    menuToggleLabel: string;
    soundToggleLabel: string;

    // ===== Common actions =====
    cancel: string;
    save: string;
    confirm: string;
    delete: string;
    edit: string;
    close: string;
    ok: string;

    // ===== User menu (when signed in) =====
    profile: string;
    settings: string;
    myTickets: string;
    adminTickets: string;
    logout: string;

    // ===== Post-auth greetings (shown once after login / register) =====
    /** Greeting shown after a successful sign-in. */
    welcomeBackToast: (name: string) => string;
    /** Greeting shown after a successful sign-up. */
    welcomeNewToast: (name: string) => string;

    // ===== Generic email validation messages =====
    emailMsg: {
        noAt: string;
        noLocal: string;
        badDomain: string;
        bad: string;
        ok: string;
        tldShort: string;
        fakeDomain: string;
        taken: string;
        noTld: (tld: string) => string;
    };
}

export const common: LanguageMap<CommonDict> = {
    RU: {
        nav: ['Discord', 'Форум', 'Поддержка', 'Войти'],
        back: '← На главную',
        languageSwitcherLabel: 'Сменить язык',
        filtersLabel: 'Фильтры',
        menuToggleLabel: 'Открыть или закрыть меню',
        soundToggleLabel: 'Включить или выключить звук',
        cancel: 'Отмена',
        save: 'Сохранить',
        confirm: 'Подтвердить',
        delete: 'Удалить',
        edit: 'Редактировать',
        close: 'Закрыть',
        ok: 'Ок',
        profile: 'Профиль',
        settings: 'Настройки',
        myTickets: 'Мои тикеты',
        adminTickets: 'Тикеты поддержки',
        logout: 'Выйти',
        welcomeBackToast: (name) => `С возвращением, ${name}!`,
        welcomeNewToast: (name) => `Добро пожаловать, ${name}!`,
        emailMsg: {
            noAt: '✗ Отсутствует символ @',
            noLocal: '✗ Укажите имя перед @',
            badDomain: '✗ Некорректный домен (напр. gmail.com)',
            bad: '✗ Некорректный формат email',
            ok: '✓ Корректный email',
            tldShort: '✗ Доменная зона слишком короткая',
            fakeDomain: '✗ Такого домена не существует',
            taken: '✗ Этот email уже зарегистрирован',
            noTld: (tld) => `✗ Несуществующая доменная зона .${tld}`,
        },
    },

    EN: {
        nav: ['Discord', 'Forum', 'Support', 'Log In'],
        back: '← Back to home',
        languageSwitcherLabel: 'Change language',
        filtersLabel: 'Filters',
        menuToggleLabel: 'Open or close menu',
        soundToggleLabel: 'Turn sound on or off',
        cancel: 'Cancel',
        save: 'Save',
        confirm: 'Confirm',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        ok: 'OK',
        profile: 'Profile',
        settings: 'Settings',
        myTickets: 'My tickets',
        adminTickets: 'Support inbox',
        logout: 'Log out',
        welcomeBackToast: (name) => `Welcome back, ${name}!`,
        welcomeNewToast: (name) => `Welcome, ${name}!`,
        emailMsg: {
            noAt: '✗ Missing @ character',
            noLocal: '✗ Enter a name before @',
            badDomain: '✗ Invalid domain (e.g. gmail.com)',
            bad: '✗ Invalid email format',
            ok: '✓ Valid email',
            tldShort: '✗ Top-level domain is too short',
            fakeDomain: '✗ Domain does not exist',
            taken: '✗ This email is already registered',
            noTld: (tld) => `✗ Top-level domain .${tld} does not exist`,
        },
    },

    DE: {
        nav: ['Discord', 'Forum', 'Support', 'Anmelden'],
        back: '← Zur Startseite',
        languageSwitcherLabel: 'Sprache ändern',
        filtersLabel: 'Filter',
        menuToggleLabel: 'Menü öffnen oder schließen',
        soundToggleLabel: 'Ton ein- oder ausschalten',
        cancel: 'Abbrechen',
        save: 'Speichern',
        confirm: 'Bestätigen',
        delete: 'Löschen',
        edit: 'Bearbeiten',
        close: 'Schließen',
        ok: 'OK',
        profile: 'Profil',
        settings: 'Einstellungen',
        myTickets: 'Meine Tickets',
        adminTickets: 'Support-Tickets',
        logout: 'Abmelden',
        welcomeBackToast: (name) => `Willkommen zurück, ${name}!`,
        welcomeNewToast: (name) => `Willkommen, ${name}!`,
        emailMsg: {
            noAt: '✗ @-Zeichen fehlt',
            noLocal: '✗ Name vor @ eingeben',
            badDomain: '✗ Ungültige Domain (z.B. gmail.com)',
            bad: '✗ Ungültiges E-Mail-Format',
            ok: '✓ Gültige E-Mail',
            tldShort: '✗ Top-Level-Domain ist zu kurz',
            fakeDomain: '✗ Domain existiert nicht',
            taken: '✗ Diese E-Mail ist bereits registriert',
            noTld: (tld) => `✗ Top-Level-Domain .${tld} existiert nicht`,
        },
    },

    FR: {
        nav: ['Discord', 'Forum', 'Support', 'Connexion'],
        back: "← Retour à l'accueil",
        languageSwitcherLabel: 'Changer de langue',
        filtersLabel: 'Filtres',
        menuToggleLabel: 'Ouvrir ou fermer le menu',
        soundToggleLabel: 'Activer ou couper le son',
        cancel: 'Annuler',
        save: 'Enregistrer',
        confirm: 'Confirmer',
        delete: 'Supprimer',
        edit: 'Modifier',
        close: 'Fermer',
        ok: 'OK',
        profile: 'Profil',
        settings: 'Paramètres',
        myTickets: 'Mes tickets',
        adminTickets: 'Boîte support',
        logout: 'Déconnexion',
        welcomeBackToast: (name) => `Bon retour, ${name} !`,
        welcomeNewToast: (name) => `Bienvenue, ${name} !`,
        emailMsg: {
            noAt: '✗ Caractère @ manquant',
            noLocal: '✗ Entrez un nom avant @',
            badDomain: '✗ Domaine invalide (par ex. gmail.com)',
            bad: "✗ Format d'email invalide",
            ok: '✓ Email valide',
            tldShort: '✗ Le domaine de premier niveau est trop court',
            fakeDomain: "✗ Le domaine n'existe pas",
            taken: '✗ Cet email est déjà enregistré',
            noTld: (tld) => `✗ Le domaine .${tld} n'existe pas`,
        },
    },

    PL: {
        nav: ['Discord', 'Forum', 'Wsparcie', 'Zaloguj'],
        back: '← Na stronę główną',
        languageSwitcherLabel: 'Zmień język',
        filtersLabel: 'Filtry',
        menuToggleLabel: 'Otwórz lub zamknij menu',
        soundToggleLabel: 'Włącz lub wyłącz dźwięk',
        cancel: 'Anuluj',
        save: 'Zapisz',
        confirm: 'Potwierdź',
        delete: 'Usuń',
        edit: 'Edytuj',
        close: 'Zamknij',
        ok: 'OK',
        profile: 'Profil',
        settings: 'Ustawienia',
        myTickets: 'Moje zgłoszenia',
        adminTickets: 'Skrzynka wsparcia',
        logout: 'Wyloguj',
        welcomeBackToast: (name) => `Witaj ponownie, ${name}!`,
        welcomeNewToast: (name) => `Witaj, ${name}!`,
        emailMsg: {
            noAt: '✗ Brak znaku @',
            noLocal: '✗ Podaj nazwę przed @',
            badDomain: '✗ Nieprawidłowa domena (np. gmail.com)',
            bad: '✗ Nieprawidłowy format email',
            ok: '✓ Prawidłowy email',
            tldShort: '✗ Domena najwyższego poziomu jest zbyt krótka',
            fakeDomain: '✗ Domena nie istnieje',
            taken: '✗ Ten email jest już zarejestrowany',
            noTld: (tld) => `✗ Domena .${tld} nie istnieje`,
        },
    },

    ES: {
        nav: ['Discord', 'Foro', 'Soporte', 'Iniciar sesión'],
        back: '← Volver al inicio',
        languageSwitcherLabel: 'Cambiar idioma',
        filtersLabel: 'Filtros',
        menuToggleLabel: 'Abrir o cerrar el menú',
        soundToggleLabel: 'Activar o desactivar el sonido',
        cancel: 'Cancelar',
        save: 'Guardar',
        confirm: 'Confirmar',
        delete: 'Eliminar',
        edit: 'Editar',
        close: 'Cerrar',
        ok: 'OK',
        profile: 'Perfil',
        settings: 'Ajustes',
        myTickets: 'Mis tickets',
        adminTickets: 'Bandeja de soporte',
        logout: 'Cerrar sesión',
        welcomeBackToast: (name) => `¡Bienvenido de vuelta, ${name}!`,
        welcomeNewToast: (name) => `¡Bienvenido, ${name}!`,
        emailMsg: {
            noAt: '✗ Falta el carácter @',
            noLocal: '✗ Ingrese un nombre antes de @',
            badDomain: '✗ Dominio inválido (p.ej. gmail.com)',
            bad: '✗ Formato de email inválido',
            ok: '✓ Email válido',
            tldShort: '✗ El dominio de nivel superior es demasiado corto',
            fakeDomain: '✗ El dominio no existe',
            taken: '✗ Este email ya está registrado',
            noTld: (tld) => `✗ El dominio .${tld} no existe`,
        },
    },

    CZ: {
        nav: ['Discord', 'Fórum', 'Podpora', 'Přihlásit'],
        back: '← Na hlavní stránku',
        languageSwitcherLabel: 'Změnit jazyk',
        filtersLabel: 'Filtry',
        menuToggleLabel: 'Otevřít nebo zavřít menu',
        soundToggleLabel: 'Zapnout nebo vypnout zvuk',
        cancel: 'Zrušit',
        save: 'Uložit',
        confirm: 'Potvrdit',
        delete: 'Smazat',
        edit: 'Upravit',
        close: 'Zavřít',
        ok: 'OK',
        profile: 'Profil',
        settings: 'Nastavení',
        myTickets: 'Moje tikety',
        adminTickets: 'Podpora fronta',
        logout: 'Odhlásit',
        welcomeBackToast: (name) => `Vítej zpět, ${name}!`,
        welcomeNewToast: (name) => `Vítej, ${name}!`,
        emailMsg: {
            noAt: '✗ Chybí znak @',
            noLocal: '✗ Zadejte jméno před @',
            badDomain: '✗ Neplatná doména (např. gmail.com)',
            bad: '✗ Neplatný formát emailu',
            ok: '✓ Platný email',
            tldShort: '✗ Doména nejvyšší úrovně je příliš krátká',
            fakeDomain: '✗ Doména neexistuje',
            taken: '✗ Tento email je již registrován',
            noTld: (tld) => `✗ Doména .${tld} neexistuje`,
        },
    },

    IT: {
        nav: ['Discord', 'Forum', 'Supporto', 'Accedi'],
        back: '← Torna alla home',
        languageSwitcherLabel: 'Cambia lingua',
        filtersLabel: 'Filtri',
        menuToggleLabel: 'Apri o chiudi il menu',
        soundToggleLabel: 'Attiva o disattiva l\'audio',
        cancel: 'Annulla',
        save: 'Salva',
        confirm: 'Conferma',
        delete: 'Elimina',
        edit: 'Modifica',
        close: 'Chiudi',
        ok: 'OK',
        profile: 'Profilo',
        settings: 'Impostazioni',
        myTickets: 'I miei ticket',
        adminTickets: 'Coda supporto',
        logout: 'Esci',
        welcomeBackToast: (name) => `Bentornato, ${name}!`,
        welcomeNewToast: (name) => `Benvenuto, ${name}!`,
        emailMsg: {
            noAt: '✗ Carattere @ mancante',
            noLocal: '✗ Inserisci un nome prima di @',
            badDomain: '✗ Dominio non valido (es. gmail.com)',
            bad: '✗ Formato email non valido',
            ok: '✓ Email valida',
            tldShort: '✗ Il dominio di primo livello è troppo corto',
            fakeDomain: '✗ Il dominio non esiste',
            taken: '✗ Questa email è già registrata',
            noTld: (tld) => `✗ Il dominio .${tld} non esiste`,
        },
    },
};
