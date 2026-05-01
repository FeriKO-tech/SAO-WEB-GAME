/**
 * Settings page translations (all 8 locales).
 *
 * Migrated verbatim from the inline `<script>` dictionary in `settings.html`.
 * `back`, `cancel` and `emailMsg` remain in `common.ts` - the page merges them
 * in at runtime via `buildDict('settings')`.
 *
 * Grouping:
 *   - top-level keys map 1:1 to `data-i18n="..."` attributes in markup;
 *   - `msg` is an object accessed from TS for toast / inline error messages
 *     (see `currentDict().msg` in `src/pages/settings.ts`).
 */

import type { LanguageMap } from '@models/i18n';

export interface SettingsDict {
    title: string;

    // Sidebar navigation
    tabProfile: string;
    tabSecurity: string;
    tabPrefs: string;
    tabAccount: string;

    // Profile tab
    profileTitle: string;
    profileDesc: string;
    usernameLabel: string;
    firstNameLabel: string;
    lastNameLabel: string;
    emailLabel: string;
    saveChanges: string;

    // Security tab
    securityTitle: string;
    securityDesc: string;
    currentPwLabel: string;
    newPwLabel: string;
    newPwHint: string;
    confirmPwLabel: string;
    changePwBtn: string;
    googleAuthTitle: string;
    googleAuthDesc: string;
    googleSecurityBtn: string;

    // Preferences tab
    prefsTitle: string;
    prefsDesc: string;
    soundLabel: string;
    soundSub: string;
    animLabel: string;
    animSub: string;

    // Account tab
    accountTitle: string;
    accountDesc: string;
    logoutBtn: string;
    dangerTitle: string;
    dangerDesc: string;
    deleteAccountBtn: string;

    // Delete modal
    deleteTitle: string;
    deleteWarn: string;
    deleteConfirmLabel: string;
    deleteBtn: string;

    // Email-change modal
    emailChangeTitle: string;
    emailChangeDesc: string;
    emailChangeSubmit: string;

    /** Inline / toast messages used from TS. */
    msg: {
        usernameShort: string;
        usernameTaken: string;
        emailBad: string;
        emailTaken: string;
        profileSaved: string;
        pwCurrentWrong: string;
        pwShort: string;
        pwMismatch: string;
        pwChanged: string;
        pwTooManyRequests: string;
        accountDeleted: string;
        reauthRequired: string;
        loggedOut: string;
        googleEditBlocked: string;
        currentPwRequired: string;
        emailChangeSent: string;
        unknownError: string;
    };
}

export const settingsTranslations: LanguageMap<SettingsDict> = {
    RU: {
        title: 'Настройки',
        tabProfile: 'Профиль',
        tabSecurity: 'Безопасность',
        tabPrefs: 'Предпочтения',
        tabAccount: 'Аккаунт',

        profileTitle: 'Профиль',
        profileDesc: 'Управляйте своими публичными данными в игре.',
        usernameLabel: 'Логин',
        firstNameLabel: 'Имя',
        lastNameLabel: 'Фамилия',
        emailLabel: 'Email',
        saveChanges: 'Сохранить изменения',

        securityTitle: 'Безопасность',
        securityDesc: 'Измените пароль, чтобы защитить аккаунт.',
        currentPwLabel: 'Текущий пароль',
        newPwLabel: 'Новый пароль',
        newPwHint: 'Минимум 6 символов',
        confirmPwLabel: 'Повторите новый пароль',
        changePwBtn: 'Изменить пароль',
        googleAuthTitle: 'Вы вошли через Google',
        googleAuthDesc:
            'Пароль управляется через ваш Google-аккаунт. Чтобы изменить его, перейдите в настройки безопасности Google.',
        googleSecurityBtn: 'Безопасность Google →',

        prefsTitle: 'Предпочтения',
        prefsDesc: 'Настройте интерфейс и поведение игры под себя.',
        soundLabel: 'Звук в игре',
        soundSub: 'Фоновая музыка и эффекты',
        animLabel: 'Анимации интерфейса',
        animSub: 'Отключите для слабых устройств',

        accountTitle: 'Аккаунт',
        accountDesc: 'Управление сессией и аккаунтом.',
        logoutBtn: 'Выйти из аккаунта',
        dangerTitle: 'Опасная зона',
        dangerDesc:
            'Удаление аккаунта необратимо. Все ваши данные, прогресс и покупки будут безвозвратно потеряны.',
        deleteAccountBtn: 'Удалить аккаунт',

        deleteTitle: 'Удалить аккаунт?',
        deleteWarn:
            'Это действие необратимо. Весь ваш прогресс, инвентарь и достижения будут безвозвратно удалены.',
        deleteConfirmLabel: 'Для подтверждения введите свой логин',
        deleteBtn: 'Удалить навсегда',

        emailChangeTitle: 'Подтвердите смену email',
        emailChangeDesc: 'Мы отправим письмо на новый адрес. Email сменится только после клика по ссылке в письме. Подтвердите текущий пароль, чтобы продолжить.',
        emailChangeSubmit: 'Отправить письмо',

        msg: {
            usernameShort: 'Логин должен быть от 3 до 20 символов',
            usernameTaken: 'Этот логин уже занят',
            emailBad: 'Некорректный email',
            emailTaken: 'Этот email уже зарегистрирован',
            profileSaved: 'Профиль успешно обновлён',
            pwCurrentWrong: 'Неверный текущий пароль',
            pwShort: 'Новый пароль слишком короткий',
            pwMismatch: 'Новые пароли не совпадают',
            pwChanged: 'Пароль успешно изменён',
            pwTooManyRequests: 'Слишком много попыток. Попробуйте через несколько минут.',
            accountDeleted: 'Аккаунт удалён',
            reauthRequired: 'Для удаления аккаунта войдите заново',
            loggedOut: 'Вы вышли из аккаунта',
            googleEditBlocked: 'Этот параметр нельзя изменить для Google-аккаунта',
            currentPwRequired: 'Введите текущий пароль',
            emailChangeSent: 'Письмо с подтверждением отправлено на новый адрес. Кликните ссылку в письме, чтобы завершить смену email.',
            unknownError: 'Что-то пошло не так. Попробуйте позже.',
        },
    },

    EN: {
        title: 'Settings',
        tabProfile: 'Profile',
        tabSecurity: 'Security',
        tabPrefs: 'Preferences',
        tabAccount: 'Account',

        profileTitle: 'Profile',
        profileDesc: 'Manage your public in-game data.',
        usernameLabel: 'Username',
        firstNameLabel: 'First name',
        lastNameLabel: 'Last name',
        emailLabel: 'Email',
        saveChanges: 'Save changes',

        securityTitle: 'Security',
        securityDesc: 'Change your password to protect your account.',
        currentPwLabel: 'Current password',
        newPwLabel: 'New password',
        newPwHint: 'Minimum 6 characters',
        confirmPwLabel: 'Repeat new password',
        changePwBtn: 'Change password',
        googleAuthTitle: 'You signed in with Google',
        googleAuthDesc:
            'Password is managed via your Google account. Go to Google security settings to change it.',
        googleSecurityBtn: 'Google Security →',

        prefsTitle: 'Preferences',
        prefsDesc: 'Customize the interface and game behavior.',
        soundLabel: 'In-game sound',
        soundSub: 'Background music and effects',
        animLabel: 'UI animations',
        animSub: 'Disable on weak devices',

        accountTitle: 'Account',
        accountDesc: 'Manage your session and account.',
        logoutBtn: 'Sign out',
        dangerTitle: 'Danger zone',
        dangerDesc:
            'Account deletion is irreversible. All your data, progress, and purchases will be lost forever.',
        deleteAccountBtn: 'Delete account',

        deleteTitle: 'Delete account?',
        deleteWarn:
            'This action is irreversible. All your progress, inventory, and achievements will be permanently deleted.',
        deleteConfirmLabel: 'Type your username to confirm',
        deleteBtn: 'Delete forever',

        emailChangeTitle: 'Confirm email change',
        emailChangeDesc: "We'll send a confirmation link to the new address. Your email changes only after you click the link. Confirm your current password to continue.",
        emailChangeSubmit: 'Send verification',

        msg: {
            usernameShort: 'Username must be 3-20 characters',
            usernameTaken: 'This username is already taken',
            emailBad: 'Invalid email',
            emailTaken: 'This email is already registered',
            profileSaved: 'Profile updated successfully',
            pwCurrentWrong: 'Current password is incorrect',
            pwShort: 'New password is too short',
            pwMismatch: 'New passwords do not match',
            pwChanged: 'Password changed successfully',
            pwTooManyRequests: 'Too many attempts. Try again in a few minutes.',
            accountDeleted: 'Account deleted',
            reauthRequired: 'Please sign in again to continue',
            loggedOut: 'Signed out',
            googleEditBlocked: 'This setting cannot be changed for a Google account',
            currentPwRequired: 'Enter your current password',
            emailChangeSent: 'Verification email sent to the new address. Click the link inside to finish changing your email.',
            unknownError: 'Something went wrong. Please try again later.',
        },
    },

    DE: {
        title: 'Einstellungen',
        tabProfile: 'Profil',
        tabSecurity: 'Sicherheit',
        tabPrefs: 'Präferenzen',
        tabAccount: 'Konto',

        profileTitle: 'Profil',
        profileDesc: 'Verwalten Sie Ihre öffentlichen Spieldaten.',
        usernameLabel: 'Benutzername',
        firstNameLabel: 'Vorname',
        lastNameLabel: 'Nachname',
        emailLabel: 'Email',
        saveChanges: 'Änderungen speichern',

        securityTitle: 'Sicherheit',
        securityDesc: 'Ändern Sie Ihr Passwort zum Schutz des Kontos.',
        currentPwLabel: 'Aktuelles Passwort',
        newPwLabel: 'Neues Passwort',
        newPwHint: 'Mindestens 6 Zeichen',
        confirmPwLabel: 'Neues Passwort wiederholen',
        changePwBtn: 'Passwort ändern',
        googleAuthTitle: 'Sie haben sich mit Google angemeldet',
        googleAuthDesc:
            'Das Passwort wird über Ihr Google-Konto verwaltet. Ändern Sie es in den Google-Sicherheitseinstellungen.',
        googleSecurityBtn: 'Google-Sicherheit →',

        prefsTitle: 'Präferenzen',
        prefsDesc: 'Passen Sie Oberfläche und Spielverhalten an.',
        soundLabel: 'Spiel-Sound',
        soundSub: 'Hintergrundmusik und Effekte',
        animLabel: 'UI-Animationen',
        animSub: 'Auf schwachen Geräten deaktivieren',

        accountTitle: 'Konto',
        accountDesc: 'Sitzung und Konto verwalten.',
        logoutBtn: 'Abmelden',
        dangerTitle: 'Gefahrenzone',
        dangerDesc:
            'Kontolöschung ist unumkehrbar. Alle Daten, Fortschritt und Käufe gehen für immer verloren.',
        deleteAccountBtn: 'Konto löschen',

        deleteTitle: 'Konto löschen?',
        deleteWarn:
            'Diese Aktion ist unumkehrbar. Alle Fortschritte, Inventar und Erfolge werden dauerhaft gelöscht.',
        deleteConfirmLabel: 'Geben Sie zur Bestätigung Ihren Benutzernamen ein',
        deleteBtn: 'Für immer löschen',

        emailChangeTitle: 'Email-Wechsel bestätigen',
        emailChangeDesc: 'Wir senden einen Bestätigungslink an die neue Adresse. Die Email wechselt erst nach Klick auf den Link. Bestätige dein aktuelles Passwort, um fortzufahren.',
        emailChangeSubmit: 'Email senden',

        msg: {
            usernameShort: 'Benutzername muss 3-20 Zeichen haben',
            usernameTaken: 'Dieser Benutzername ist bereits vergeben',
            emailBad: 'Ungültige Email',
            emailTaken: 'Diese Email ist bereits registriert',
            profileSaved: 'Profil erfolgreich aktualisiert',
            pwCurrentWrong: 'Aktuelles Passwort ist falsch',
            pwShort: 'Neues Passwort ist zu kurz',
            pwMismatch: 'Neue Passwörter stimmen nicht überein',
            pwChanged: 'Passwort erfolgreich geändert',
            pwTooManyRequests: 'Zu viele Versuche. Versuch es in ein paar Minuten erneut.',
            accountDeleted: 'Konto gelöscht',
            reauthRequired: 'Bitte erneut anmelden, um fortzufahren',
            loggedOut: 'Abgemeldet',
            googleEditBlocked:
                'Diese Einstellung kann bei einem Google-Konto nicht geändert werden',
            currentPwRequired: 'Aktuelles Passwort eingeben',
            emailChangeSent: 'Bestätigungs-Email an die neue Adresse gesendet. Klicke den Link, um die Änderung abzuschließen.',
            unknownError: 'Etwas ist schiefgelaufen. Bitte später erneut versuchen.',
        },
    },

    FR: {
        title: 'Paramètres',
        tabProfile: 'Profil',
        tabSecurity: 'Sécurité',
        tabPrefs: 'Préférences',
        tabAccount: 'Compte',

        profileTitle: 'Profil',
        profileDesc: 'Gérez vos données publiques en jeu.',
        usernameLabel: "Nom d'utilisateur",
        firstNameLabel: 'Prénom',
        lastNameLabel: 'Nom',
        emailLabel: 'Email',
        saveChanges: 'Enregistrer les modifications',

        securityTitle: 'Sécurité',
        securityDesc: 'Modifiez votre mot de passe pour protéger votre compte.',
        currentPwLabel: 'Mot de passe actuel',
        newPwLabel: 'Nouveau mot de passe',
        newPwHint: 'Minimum 6 caractères',
        confirmPwLabel: 'Répétez le nouveau mot de passe',
        changePwBtn: 'Changer le mot de passe',
        googleAuthTitle: 'Vous êtes connecté avec Google',
        googleAuthDesc:
            'Le mot de passe est géré via votre compte Google. Allez dans les paramètres de sécurité Google pour le modifier.',
        googleSecurityBtn: 'Sécurité Google →',

        prefsTitle: 'Préférences',
        prefsDesc: "Personnalisez l'interface et le comportement du jeu.",
        soundLabel: 'Son du jeu',
        soundSub: 'Musique de fond et effets',
        animLabel: "Animations d'interface",
        animSub: 'Désactivez sur les appareils faibles',

        accountTitle: 'Compte',
        accountDesc: 'Gérez votre session et votre compte.',
        logoutBtn: 'Se déconnecter',
        dangerTitle: 'Zone de danger',
        dangerDesc:
            'La suppression du compte est irréversible. Toutes les données, progression et achats seront perdus à jamais.',
        deleteAccountBtn: 'Supprimer le compte',

        deleteTitle: 'Supprimer le compte ?',
        deleteWarn:
            'Cette action est irréversible. Toute progression, inventaire et réalisations seront définitivement supprimés.',
        deleteConfirmLabel: "Tapez votre nom d'utilisateur pour confirmer",
        deleteBtn: 'Supprimer à jamais',

        emailChangeTitle: "Confirmer le changement d'email",
        emailChangeDesc: "Nous enverrons un lien de confirmation à la nouvelle adresse. L'email ne change qu'après avoir cliqué sur le lien. Confirmez votre mot de passe actuel pour continuer.",
        emailChangeSubmit: "Envoyer l'email",

        msg: {
            usernameShort: "Le nom d'utilisateur doit avoir 3-20 caractères",
            usernameTaken: "Ce nom d'utilisateur est déjà pris",
            emailBad: 'Email invalide',
            emailTaken: 'Cet email est déjà enregistré',
            profileSaved: 'Profil mis à jour avec succès',
            pwCurrentWrong: 'Le mot de passe actuel est incorrect',
            pwShort: 'Nouveau mot de passe trop court',
            pwMismatch: 'Les nouveaux mots de passe ne correspondent pas',
            pwChanged: 'Mot de passe modifié avec succès',
            pwTooManyRequests: 'Trop de tentatives. Réessayez dans quelques minutes.',
            accountDeleted: 'Compte supprimé',
            reauthRequired: 'Reconnectez-vous pour continuer',
            loggedOut: 'Déconnecté',
            googleEditBlocked:
                'Ce paramètre ne peut pas être modifié pour un compte Google',
            currentPwRequired: 'Saisissez votre mot de passe actuel',
            emailChangeSent: 'Email de vérification envoyé à la nouvelle adresse. Cliquez sur le lien pour finaliser le changement.',
            unknownError: "Une erreur s'est produite. Réessayez plus tard.",
        },
    },

    PL: {
        title: 'Ustawienia',
        tabProfile: 'Profil',
        tabSecurity: 'Bezpieczeństwo',
        tabPrefs: 'Preferencje',
        tabAccount: 'Konto',

        profileTitle: 'Profil',
        profileDesc: 'Zarządzaj swoimi publicznymi danymi w grze.',
        usernameLabel: 'Login',
        firstNameLabel: 'Imię',
        lastNameLabel: 'Nazwisko',
        emailLabel: 'Email',
        saveChanges: 'Zapisz zmiany',

        securityTitle: 'Bezpieczeństwo',
        securityDesc: 'Zmień hasło, aby zabezpieczyć konto.',
        currentPwLabel: 'Aktualne hasło',
        newPwLabel: 'Nowe hasło',
        newPwHint: 'Minimum 6 znaków',
        confirmPwLabel: 'Powtórz nowe hasło',
        changePwBtn: 'Zmień hasło',
        googleAuthTitle: 'Zalogowano przez Google',
        googleAuthDesc:
            'Hasło jest zarządzane przez Twoje konto Google. Aby je zmienić, przejdź do ustawień bezpieczeństwa Google.',
        googleSecurityBtn: 'Bezpieczeństwo Google →',

        prefsTitle: 'Preferencje',
        prefsDesc: 'Dostosuj interfejs i zachowanie gry.',
        soundLabel: 'Dźwięk w grze',
        soundSub: 'Muzyka tła i efekty',
        animLabel: 'Animacje interfejsu',
        animSub: 'Wyłącz na słabych urządzeniach',

        accountTitle: 'Konto',
        accountDesc: 'Zarządzaj sesją i kontem.',
        logoutBtn: 'Wyloguj się',
        dangerTitle: 'Strefa niebezpieczna',
        dangerDesc:
            'Usunięcie konta jest nieodwracalne. Wszystkie dane, postęp i zakupy zostaną utracone na zawsze.',
        deleteAccountBtn: 'Usuń konto',

        deleteTitle: 'Usunąć konto?',
        deleteWarn:
            'Ta akcja jest nieodwracalna. Cały postęp, ekwipunek i osiągnięcia zostaną trwale usunięte.',
        deleteConfirmLabel: 'Wpisz swój login, aby potwierdzić',
        deleteBtn: 'Usuń na zawsze',

        emailChangeTitle: 'Potwierdź zmianę emaila',
        emailChangeDesc: 'Wyślemy link potwierdzający na nowy adres. Email zmieni się dopiero po kliknięciu w link. Potwierdź obecne hasło, aby kontynuować.',
        emailChangeSubmit: 'Wyślij email',

        msg: {
            usernameShort: 'Login musi mieć 3-20 znaków',
            usernameTaken: 'Ten login jest już zajęty',
            emailBad: 'Nieprawidłowy email',
            emailTaken: 'Ten email jest już zarejestrowany',
            profileSaved: 'Profil zaktualizowany pomyślnie',
            pwCurrentWrong: 'Aktualne hasło jest nieprawidłowe',
            pwShort: 'Nowe hasło jest za krótkie',
            pwMismatch: 'Nowe hasła nie są zgodne',
            pwChanged: 'Hasło zmienione pomyślnie',
            pwTooManyRequests: 'Zbyt wiele prób. Spróbuj za kilka minut.',
            accountDeleted: 'Konto usunięte',
            reauthRequired: 'Zaloguj się ponownie, aby kontynuować',
            loggedOut: 'Wylogowano',
            googleEditBlocked: 'Tego ustawienia nie można zmienić dla konta Google',
            currentPwRequired: 'Wpisz obecne hasło',
            emailChangeSent: 'Email weryfikacyjny został wysłany na nowy adres. Kliknij link, aby dokończyć zmianę.',
            unknownError: 'Coś poszło nie tak. Spróbuj później.',
        },
    },

    ES: {
        title: 'Configuración',
        tabProfile: 'Perfil',
        tabSecurity: 'Seguridad',
        tabPrefs: 'Preferencias',
        tabAccount: 'Cuenta',

        profileTitle: 'Perfil',
        profileDesc: 'Gestione sus datos públicos en el juego.',
        usernameLabel: 'Usuario',
        firstNameLabel: 'Nombre',
        lastNameLabel: 'Apellido',
        emailLabel: 'Email',
        saveChanges: 'Guardar cambios',

        securityTitle: 'Seguridad',
        securityDesc: 'Cambie la contraseña para proteger la cuenta.',
        currentPwLabel: 'Contraseña actual',
        newPwLabel: 'Nueva contraseña',
        newPwHint: 'Mínimo 6 caracteres',
        confirmPwLabel: 'Repetir nueva contraseña',
        changePwBtn: 'Cambiar contraseña',
        googleAuthTitle: 'Inició sesión con Google',
        googleAuthDesc:
            'La contraseña se gestiona a través de su cuenta Google. Vaya a la configuración de seguridad de Google para cambiarla.',
        googleSecurityBtn: 'Seguridad de Google →',

        prefsTitle: 'Preferencias',
        prefsDesc: 'Personalice la interfaz y el comportamiento del juego.',
        soundLabel: 'Sonido del juego',
        soundSub: 'Música de fondo y efectos',
        animLabel: 'Animaciones de la interfaz',
        animSub: 'Desactive en dispositivos débiles',

        accountTitle: 'Cuenta',
        accountDesc: 'Gestione la sesión y la cuenta.',
        logoutBtn: 'Cerrar sesión',
        dangerTitle: 'Zona de peligro',
        dangerDesc:
            'La eliminación de la cuenta es irreversible. Todos los datos, progreso y compras se perderán para siempre.',
        deleteAccountBtn: 'Eliminar cuenta',

        deleteTitle: '¿Eliminar cuenta?',
        deleteWarn:
            'Esta acción es irreversible. Todo el progreso, inventario y logros serán eliminados permanentemente.',
        deleteConfirmLabel: 'Escriba su usuario para confirmar',
        deleteBtn: 'Eliminar para siempre',

        emailChangeTitle: 'Confirmar cambio de email',
        emailChangeDesc: 'Enviaremos un enlace de confirmación a la nueva dirección. El email cambia solo después de hacer clic en el enlace. Confirma tu contraseña actual para continuar.',
        emailChangeSubmit: 'Enviar email',

        msg: {
            usernameShort: 'El usuario debe tener 3-20 caracteres',
            usernameTaken: 'Este usuario ya está en uso',
            emailBad: 'Email inválido',
            emailTaken: 'Este email ya está registrado',
            profileSaved: 'Perfil actualizado con éxito',
            pwCurrentWrong: 'La contraseña actual es incorrecta',
            pwShort: 'Nueva contraseña demasiado corta',
            pwMismatch: 'Las nuevas contraseñas no coinciden',
            pwChanged: 'Contraseña cambiada con éxito',
            pwTooManyRequests: 'Demasiados intentos. Inténtalo en unos minutos.',
            accountDeleted: 'Cuenta eliminada',
            reauthRequired: 'Inicia sesión de nuevo para continuar',
            loggedOut: 'Sesión cerrada',
            googleEditBlocked:
                'Este ajuste no se puede cambiar para una cuenta de Google',
            currentPwRequired: 'Introduce tu contraseña actual',
            emailChangeSent: 'Email de verificación enviado a la nueva dirección. Haz clic en el enlace para completar el cambio.',
            unknownError: 'Algo salió mal. Inténtalo más tarde.',
        },
    },

    CZ: {
        title: 'Nastavení',
        tabProfile: 'Profil',
        tabSecurity: 'Zabezpečení',
        tabPrefs: 'Preference',
        tabAccount: 'Účet',

        profileTitle: 'Profil',
        profileDesc: 'Spravujte svá veřejná data ve hře.',
        usernameLabel: 'Přihlašovací jméno',
        firstNameLabel: 'Jméno',
        lastNameLabel: 'Příjmení',
        emailLabel: 'Email',
        saveChanges: 'Uložit změny',

        securityTitle: 'Zabezpečení',
        securityDesc: 'Změňte heslo pro ochranu účtu.',
        currentPwLabel: 'Aktuální heslo',
        newPwLabel: 'Nové heslo',
        newPwHint: 'Minimálně 6 znaků',
        confirmPwLabel: 'Zopakujte nové heslo',
        changePwBtn: 'Změnit heslo',
        googleAuthTitle: 'Přihlášeni přes Google',
        googleAuthDesc:
            'Heslo je spravováno přes váš účet Google. Pro změnu přejděte do nastavení zabezpečení Google.',
        googleSecurityBtn: 'Zabezpečení Google →',

        prefsTitle: 'Preference',
        prefsDesc: 'Přizpůsobte si rozhraní a chování hry.',
        soundLabel: 'Zvuk ve hře',
        soundSub: 'Hudba na pozadí a efekty',
        animLabel: 'Animace rozhraní',
        animSub: 'Vypněte na slabších zařízeních',

        accountTitle: 'Účet',
        accountDesc: 'Správa relace a účtu.',
        logoutBtn: 'Odhlásit se',
        dangerTitle: 'Nebezpečná zóna',
        dangerDesc:
            'Smazání účtu je nevratné. Všechna data, postup a nákupy budou navždy ztraceny.',
        deleteAccountBtn: 'Smazat účet',

        deleteTitle: 'Smazat účet?',
        deleteWarn:
            'Tato akce je nevratná. Veškerý postup, inventář a úspěchy budou trvale smazány.',
        deleteConfirmLabel: 'Pro potvrzení zadejte své přihlašovací jméno',
        deleteBtn: 'Smazat navždy',

        emailChangeTitle: 'Potvrďte změnu emailu',
        emailChangeDesc: 'Zašleme potvrzovací odkaz na novou adresu. Email se změní až po kliknutí na odkaz. Pro pokračování potvrďte současné heslo.',
        emailChangeSubmit: 'Odeslat email',

        msg: {
            usernameShort: 'Jméno musí mít 3-20 znaků',
            usernameTaken: 'Toto jméno je již používáno',
            emailBad: 'Neplatný email',
            emailTaken: 'Tento email je již zaregistrován',
            profileSaved: 'Profil úspěšně aktualizován',
            pwCurrentWrong: 'Aktuální heslo je nesprávné',
            pwShort: 'Nové heslo je příliš krátké',
            pwMismatch: 'Nová hesla se neshodují',
            pwChanged: 'Heslo úspěšně změněno',
            pwTooManyRequests: 'Příliš mnoho pokusů. Zkuste to za několik minut.',
            accountDeleted: 'Účet smazán',
            reauthRequired: 'Přihlaste se znovu pro pokračování',
            loggedOut: 'Odhlášeno',
            googleEditBlocked: 'Toto nastavení nelze změnit pro účet Google',
            currentPwRequired: 'Zadejte současné heslo',
            emailChangeSent: 'Ověřovací email byl odeslán na novou adresu. Klikněte na odkaz pro dokončení změny.',
            unknownError: 'Něco se pokazilo. Zkuste to později.',
        },
    },

    IT: {
        title: 'Impostazioni',
        tabProfile: 'Profilo',
        tabSecurity: 'Sicurezza',
        tabPrefs: 'Preferenze',
        tabAccount: 'Account',

        profileTitle: 'Profilo',
        profileDesc: 'Gestisci i tuoi dati pubblici nel gioco.',
        usernameLabel: 'Nome utente',
        firstNameLabel: 'Nome',
        lastNameLabel: 'Cognome',
        emailLabel: 'Email',
        saveChanges: 'Salva modifiche',

        securityTitle: 'Sicurezza',
        securityDesc: "Cambia la password per proteggere l'account.",
        currentPwLabel: 'Password attuale',
        newPwLabel: 'Nuova password',
        newPwHint: 'Minimo 6 caratteri',
        confirmPwLabel: 'Ripeti la nuova password',
        changePwBtn: 'Cambia password',
        googleAuthTitle: 'Accesso effettuato con Google',
        googleAuthDesc:
            'La password è gestita tramite il tuo account Google. Vai alle impostazioni di sicurezza Google per modificarla.',
        googleSecurityBtn: 'Sicurezza Google →',

        prefsTitle: 'Preferenze',
        prefsDesc: "Personalizza l'interfaccia e il comportamento del gioco.",
        soundLabel: 'Audio del gioco',
        soundSub: 'Musica di sottofondo ed effetti',
        animLabel: "Animazioni dell'interfaccia",
        animSub: 'Disabilita su dispositivi lenti',

        accountTitle: 'Account',
        accountDesc: 'Gestisci sessione e account.',
        logoutBtn: 'Disconnetti',
        dangerTitle: 'Zona pericolosa',
        dangerDesc:
            "L'eliminazione dell'account è irreversibile. Tutti i dati, progressi e acquisti andranno persi per sempre.",
        deleteAccountBtn: 'Elimina account',

        deleteTitle: 'Eliminare account?',
        deleteWarn:
            "Questa azione è irreversibile. Tutti i progressi, l'inventario e i risultati saranno eliminati definitivamente.",
        deleteConfirmLabel: 'Digita il tuo nome utente per confermare',
        deleteBtn: 'Elimina per sempre',

        emailChangeTitle: "Conferma il cambio di email",
        emailChangeDesc: "Invieremo un link di conferma al nuovo indirizzo. L'email cambia solo dopo aver cliccato sul link. Conferma la password attuale per continuare.",
        emailChangeSubmit: 'Invia email',

        msg: {
            usernameShort: 'Il nome deve avere 3-20 caratteri',
            usernameTaken: 'Questo nome è già in uso',
            emailBad: 'Email non valida',
            emailTaken: 'Questa email è già registrata',
            profileSaved: 'Profilo aggiornato con successo',
            pwCurrentWrong: 'La password attuale è errata',
            pwShort: 'Nuova password troppo corta',
            pwMismatch: 'Le nuove password non coincidono',
            pwChanged: 'Password cambiata con successo',
            pwTooManyRequests: 'Troppi tentativi. Riprova tra qualche minuto.',
            accountDeleted: 'Account eliminato',
            reauthRequired: 'Accedi di nuovo per continuare',
            loggedOut: 'Disconnesso',
            googleEditBlocked:
                'Questa impostazione non può essere modificata per un account Google',
            currentPwRequired: 'Inserisci la password attuale',
            emailChangeSent: "Email di verifica inviata al nuovo indirizzo. Clicca sul link per completare la modifica.",
            unknownError: "Qualcosa è andato storto. Riprova più tardi.",
        },
    },

    UA: {
        title: 'Налаштування',
        tabProfile: 'Профіль',
        tabSecurity: 'Безпека',
        tabPrefs: 'Переваги',
        tabAccount: 'Акаунт',

        profileTitle: 'Профіль',
        profileDesc: 'Керуйте своїми публічними даними в грі.',
        usernameLabel: 'Логін',
        firstNameLabel: 'Ім\'я',
        lastNameLabel: 'Прізвище',
        emailLabel: 'Email',
        saveChanges: 'Зберегти зміни',

        securityTitle: 'Безпека',
        securityDesc: 'Змініть пароль, щоб захистити акаунт.',
        currentPwLabel: 'Поточний пароль',
        newPwLabel: 'Новий пароль',
        newPwHint: 'Мінімум 6 символів',
        confirmPwLabel: 'Повторіть новий пароль',
        changePwBtn: 'Змінити пароль',
        googleAuthTitle: 'Ви увійшли через Google',
        googleAuthDesc:
            'Пароль керується через ваш Google-акаунт. Щоб змінити його, перейдіть в налаштування безпеки Google.',
        googleSecurityBtn: 'Безпека Google →',

        prefsTitle: 'Переваги',
        prefsDesc: 'Налаштуйте інтерфейс та поведінку гри під себе.',
        soundLabel: 'Звук у грі',
        soundSub: 'Фонова музика та ефекти',
        animLabel: 'Анімації інтерфейсу',
        animSub: 'Вимкніть для слабких пристроїв',

        accountTitle: 'Акаунт',
        accountDesc: 'Керування сесією та акаунтом.',
        logoutBtn: 'Вийти з акаунту',
        dangerTitle: 'Небезпечна зона',
        dangerDesc:
            'Видалення акаунту незворотнє. Всі ваші дані, прогрес та покупки будуть безповоротно втрачені.',
        deleteAccountBtn: 'Видалити акаунт',

        deleteTitle: 'Видалити акаунт?',
        deleteWarn:
            'Ця дія незворотна. Весь ваш прогрес, інвентар та досягнення будуть безповоротно видалені.',
        deleteConfirmLabel: 'Для підтвердження введіть свій логін',
        deleteBtn: 'Видалити назавжди',

        emailChangeTitle: 'Підтвердьте зміну email',
        emailChangeDesc: 'Ми надішлемо лист на нову адресу. Email зміниться тільки після кліку по посиланню в листі. Підтвердьте поточний пароль, щоб продовжити.',
        emailChangeSubmit: 'Надіслати лист',

        msg: {
            usernameShort: 'Логін має бути від 3 до 20 символів',
            usernameTaken: 'Цей логін вже зайнятий',
            emailBad: 'Некоректний email',
            emailTaken: 'Цей email вже зареєстрований',
            profileSaved: 'Профіль успішно оновлено',
            pwCurrentWrong: 'Невірний поточний пароль',
            pwShort: 'Новий пароль занадто короткий',
            pwMismatch: 'Нові паролі не співпадають',
            pwChanged: 'Пароль успішно змінено',
            pwTooManyRequests: 'Забагато спроб. Спробуйте через кілька хвилин.',
            accountDeleted: 'Акаунт видалено',
            reauthRequired: 'Для видалення акаунту увійдіть знову',
            loggedOut: 'Ви вийшли з акаунту',
            googleEditBlocked: 'Цей параметр не можна змінити для Google-акаунту',
            currentPwRequired: 'Введіть поточний пароль',
            emailChangeSent: 'Лист із підтвердженням надіслано на нову адресу. Клікніть посилання в листі, щоб завершити зміну email.',
            unknownError: 'Щось пішло не так. Спробуйте пізніше.',
        },
    },
};
