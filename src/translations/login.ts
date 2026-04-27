/**
 * Login page translations (all 8 locales).
 *
 * Migrated verbatim from the inline `<script>` dictionary in `login.html`.
 * The `back` key is intentionally omitted - it lives in `common.ts`.
 */

import type { LanguageMap } from '@models/i18n';

export interface LoginDict {
    title: string;
    subtitle: string;

    loginLabel: string;
    loginPh: string;
    loginErr: string;

    passwordLabel: string;
    passwordPh: string;
    passwordErr: string;

    remember: string;
    forgot: string;
    orContinueWith: string;
    googleButton: string;

    submit: string;
    submitting: string;

    noAccount: string;
    registerLink: string;

    successTitle: string;
    successMsg1: string;
    successMsg2: string;

    // Firebase Auth error mapping
    accountNotFound: string;
    wrongPassword: string;
    invalidEmail: string;
    tooManyRequests: string;
    networkError: string;
    userDisabled: string;
    googlePopupBlocked: string;
    googleProviderConflict: string;
    googleRegisterRequired: string;
    googleSignInError: string;
    unknownError: string;

    // Forgot-password modal
    forgotTitle: string;
    forgotDesc: string;
    forgotSubmit: string;
    forgotSuccess: string;
    cancel: string;
}

export const loginTranslations: LanguageMap<LoginDict> = {
    RU: {
        title: 'Вход',
        subtitle: 'Добро пожаловать обратно, герой',
        loginLabel: 'Email',
        loginPh: 'Введите email',
        loginErr: 'Введите email',
        passwordLabel: 'Пароль',
        passwordPh: 'Введите пароль',
        passwordErr: 'Введите пароль',
        remember: 'Запомнить меня',
        forgot: 'Забыли пароль?',
        orContinueWith: 'Или продолжите через',
        googleButton: 'Продолжить с Google',
        submit: 'Войти в игру',
        submitting: 'Выполняется вход...',
        noAccount: 'Ещё нет аккаунта?',
        registerLink: 'Зарегистрироваться',
        successTitle: 'С возвращением!',
        successMsg1: 'Авторизация успешна.',
        successMsg2: 'Переходим в игру...',
        accountNotFound: 'Аккаунта с таким email не существует',
        wrongPassword: 'Неверный email или пароль',
        invalidEmail: 'Некорректный email',
        tooManyRequests: 'Слишком много попыток. Попробуйте через несколько минут.',
        networkError: 'Ошибка сети - проверьте подключение',
        userDisabled: 'Этот аккаунт заблокирован',
        googlePopupBlocked: 'Браузер заблокировал окно Google. Разрешите всплывающие окна и попробуйте снова.',
        googleProviderConflict: 'Этот email уже зарегистрирован через другой способ входа.',
        googleRegisterRequired: 'Для первого входа через Google завершите регистрацию на странице создания аккаунта.',
        googleSignInError: 'Не удалось войти через Google. Попробуйте позже.',
        unknownError: 'Не удалось войти. Попробуйте позже.',
        forgotTitle: 'Сброс пароля',
        forgotDesc: 'Введите email от вашего аккаунта - пришлём письмо со ссылкой для сброса пароля.',
        forgotSubmit: 'Отправить ссылку',
        forgotSuccess: 'Если аккаунт существует, письмо уже отправлено. Проверьте почту.',
        cancel: 'Отмена',
    },

    EN: {
        title: 'Sign In',
        subtitle: 'Welcome back, hero',
        loginLabel: 'Email',
        loginPh: 'Enter email',
        loginErr: 'Enter email',
        passwordLabel: 'Password',
        passwordPh: 'Enter password',
        passwordErr: 'Enter password',
        remember: 'Remember me',
        forgot: 'Forgot password?',
        orContinueWith: 'Or continue with',
        googleButton: 'Continue with Google',
        submit: 'Log in',
        submitting: 'Signing in...',
        noAccount: "Don't have an account?",
        registerLink: 'Sign up',
        successTitle: 'Welcome back!',
        successMsg1: 'Authorization successful.',
        successMsg2: 'Going to the game...',
        accountNotFound: 'No account found with this email',
        wrongPassword: 'Wrong email or password',
        invalidEmail: 'Invalid email address',
        tooManyRequests: 'Too many attempts. Try again in a few minutes.',
        networkError: 'Network error - check your connection',
        userDisabled: 'This account has been disabled',
        googlePopupBlocked: 'The browser blocked the Google window. Allow popups and try again.',
        googleProviderConflict: 'This email is already registered with another sign-in method.',
        googleRegisterRequired: 'Complete your first Google sign-up on the registration page.',
        googleSignInError: 'Could not sign in with Google. Please try again later.',
        unknownError: "Couldn't sign in. Please try again later.",
        forgotTitle: 'Reset password',
        forgotDesc: 'Enter your account email - we\'ll send a link to reset your password.',
        forgotSubmit: 'Send link',
        forgotSuccess: 'If the account exists, a reset email is on its way. Check your inbox.',
        cancel: 'Cancel',
    },

    DE: {
        title: 'Anmelden',
        subtitle: 'Willkommen zurück, Held',
        loginLabel: 'Email',
        loginPh: 'Email eingeben',
        loginErr: 'Email eingeben',
        passwordLabel: 'Passwort',
        passwordPh: 'Passwort eingeben',
        passwordErr: 'Passwort eingeben',
        remember: 'Angemeldet bleiben',
        forgot: 'Passwort vergessen?',
        orContinueWith: 'Oder weiter mit',
        googleButton: 'Mit Google fortfahren',
        submit: 'Anmelden',
        submitting: 'Anmeldung...',
        noAccount: 'Noch kein Konto?',
        registerLink: 'Registrieren',
        successTitle: 'Willkommen zurück!',
        successMsg1: 'Anmeldung erfolgreich.',
        successMsg2: 'Gehe zum Spiel...',
        accountNotFound: 'Konto mit dieser Email nicht gefunden',
        wrongPassword: 'Falsche Email oder Passwort',
        invalidEmail: 'Ungültige Email-Adresse',
        tooManyRequests: 'Zu viele Versuche. Versuch es in ein paar Minuten erneut.',
        networkError: 'Netzwerkfehler - überprüfen Sie die Verbindung',
        userDisabled: 'Dieses Konto wurde deaktiviert',
        googlePopupBlocked: 'Der Browser hat das Google-Fenster blockiert. Erlauben Sie Popups und versuchen Sie es erneut.',
        googleProviderConflict: 'Diese Email ist bereits mit einer anderen Anmeldemethode registriert.',
        googleRegisterRequired: 'Schließen Sie die erste Google-Registrierung auf der Registrierungsseite ab.',
        googleSignInError: 'Anmeldung mit Google fehlgeschlagen. Bitte später erneut versuchen.',
        unknownError: 'Anmeldung fehlgeschlagen. Bitte später erneut versuchen.',
        forgotTitle: 'Passwort zurücksetzen',
        forgotDesc: 'Gib deine Konto-Email ein - wir senden dir einen Link zum Zurücksetzen.',
        forgotSubmit: 'Link senden',
        forgotSuccess: 'Falls das Konto existiert, ist die Email unterwegs. Prüfe dein Postfach.',
        cancel: 'Abbrechen',
    },

    FR: {
        title: 'Connexion',
        subtitle: 'Bon retour, héros',
        loginLabel: 'Email',
        loginPh: "Entrez l'email",
        loginErr: "Entrez l'email",
        passwordLabel: 'Mot de passe',
        passwordPh: 'Entrez le mot de passe',
        passwordErr: 'Entrez le mot de passe',
        remember: 'Se souvenir de moi',
        forgot: 'Mot de passe oublié ?',
        orContinueWith: 'Ou continuer avec',
        googleButton: 'Continuer avec Google',
        submit: 'Se connecter',
        submitting: 'Connexion...',
        noAccount: 'Pas de compte ?',
        registerLink: "S'inscrire",
        successTitle: 'Bon retour !',
        successMsg1: 'Connexion réussie.',
        successMsg2: 'Accès au jeu...',
        accountNotFound: 'Aucun compte trouvé avec cet email',
        wrongPassword: 'Email ou mot de passe incorrect',
        invalidEmail: 'Adresse email invalide',
        tooManyRequests: 'Trop de tentatives. Réessayez dans quelques minutes.',
        networkError: 'Erreur réseau - vérifiez votre connexion',
        userDisabled: 'Ce compte a été désactivé',
        googlePopupBlocked: 'Le navigateur a bloqué la fenêtre Google. Autorisez les popups puis réessayez.',
        googleProviderConflict: 'Cet email est déjà enregistré avec une autre méthode de connexion.',
        googleRegisterRequired: 'Terminez votre première inscription Google sur la page d\'inscription.',
        googleSignInError: 'Connexion Google impossible. Réessayez plus tard.',
        unknownError: 'Connexion impossible. Réessayez plus tard.',
        forgotTitle: 'Réinitialiser le mot de passe',
        forgotDesc: 'Saisissez l\'email de votre compte - nous enverrons un lien de réinitialisation.',
        forgotSubmit: 'Envoyer le lien',
        forgotSuccess: 'Si le compte existe, l\'email est en route. Vérifiez votre boîte de réception.',
        cancel: 'Annuler',
    },

    PL: {
        title: 'Logowanie',
        subtitle: 'Witaj ponownie, bohaterze',
        loginLabel: 'Email',
        loginPh: 'Wpisz email',
        loginErr: 'Wpisz email',
        passwordLabel: 'Hasło',
        passwordPh: 'Wpisz hasło',
        passwordErr: 'Wpisz hasło',
        remember: 'Zapamiętaj mnie',
        forgot: 'Zapomniałeś hasła?',
        orContinueWith: 'Lub kontynuuj przez',
        googleButton: 'Kontynuuj z Google',
        submit: 'Zaloguj się',
        submitting: 'Logowanie...',
        noAccount: 'Nie masz konta?',
        registerLink: 'Zarejestruj się',
        successTitle: 'Witaj ponownie!',
        successMsg1: 'Autoryzacja pomyślna.',
        successMsg2: 'Przechodzę do gry...',
        accountNotFound: 'Nie znaleziono konta z tym emailem',
        wrongPassword: 'Nieprawidłowy email lub hasło',
        invalidEmail: 'Nieprawidłowy adres email',
        tooManyRequests: 'Zbyt wiele prób. Spróbuj za kilka minut.',
        networkError: 'Błąd sieci - sprawdź połączenie',
        userDisabled: 'To konto zostało wyłączone',
        googlePopupBlocked: 'Przeglądarka zablokowała okno Google. Zezwól na wyskakujące okna i spróbuj ponownie.',
        googleProviderConflict: 'Ten email jest już zarejestrowany inną metodą logowania.',
        googleRegisterRequired: 'Zakończ pierwszą rejestrację Google na stronie rejestracji.',
        googleSignInError: 'Nie udało się zalogować przez Google. Spróbuj później.',
        unknownError: 'Nie można się zalogować. Spróbuj później.',
        forgotTitle: 'Resetuj hasło',
        forgotDesc: 'Wpisz email konta - wyślemy link do resetu hasła.',
        forgotSubmit: 'Wyślij link',
        forgotSuccess: 'Jeśli konto istnieje, email jest w drodze. Sprawdź skrzynkę.',
        cancel: 'Anuluj',
    },

    ES: {
        title: 'Iniciar sesión',
        subtitle: 'Bienvenido de vuelta, héroe',
        loginLabel: 'Email',
        loginPh: 'Introduce email',
        loginErr: 'Introduce email',
        passwordLabel: 'Contraseña',
        passwordPh: 'Introduce la contraseña',
        passwordErr: 'Introduce la contraseña',
        remember: 'Recuérdame',
        forgot: '¿Olvidaste la contraseña?',
        orContinueWith: 'O continuar con',
        googleButton: 'Continuar con Google',
        submit: 'Iniciar sesión',
        submitting: 'Iniciando sesión...',
        noAccount: '¿No tienes cuenta?',
        registerLink: 'Regístrate',
        successTitle: '¡Bienvenido de vuelta!',
        successMsg1: 'Autorización exitosa.',
        successMsg2: 'Entrando al juego...',
        accountNotFound: 'No se encontró cuenta con este email',
        wrongPassword: 'Email o contraseña incorrectos',
        invalidEmail: 'Dirección de email no válida',
        tooManyRequests: 'Demasiados intentos. Inténtalo en unos minutos.',
        networkError: 'Error de red - comprueba tu conexión',
        userDisabled: 'Esta cuenta ha sido deshabilitada',
        googlePopupBlocked: 'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo de nuevo.',
        googleProviderConflict: 'Este email ya está registrado con otro método de acceso.',
        googleRegisterRequired: 'Completa tu primer registro con Google en la página de registro.',
        googleSignInError: 'No se pudo iniciar sesión con Google. Inténtalo más tarde.',
        unknownError: 'No se pudo iniciar sesión. Inténtalo más tarde.',
        forgotTitle: 'Restablecer contraseña',
        forgotDesc: 'Introduce el email de tu cuenta - te enviaremos un enlace para restablecerla.',
        forgotSubmit: 'Enviar enlace',
        forgotSuccess: 'Si la cuenta existe, el email está en camino. Revisa tu bandeja.',
        cancel: 'Cancelar',
    },

    CZ: {
        title: 'Přihlášení',
        subtitle: 'Vítej zpět, hrdino',
        loginLabel: 'Email',
        loginPh: 'Zadejte email',
        loginErr: 'Zadejte email',
        passwordLabel: 'Heslo',
        passwordPh: 'Zadejte heslo',
        passwordErr: 'Zadejte heslo',
        remember: 'Zapamatovat si mě',
        forgot: 'Zapomněli jste heslo?',
        orContinueWith: 'Nebo pokračujte přes',
        googleButton: 'Pokračovat přes Google',
        submit: 'Přihlásit se',
        submitting: 'Přihlašování...',
        noAccount: 'Ještě nemáte účet?',
        registerLink: 'Zaregistrovat se',
        successTitle: 'Vítej zpět!',
        successMsg1: 'Autorizace úspěšná.',
        successMsg2: 'Přecházíme do hry...',
        accountNotFound: 'Nenalezen účet s tímto emailem',
        wrongPassword: 'Nesprávný email nebo heslo',
        invalidEmail: 'Neplatná emailová adresa',
        tooManyRequests: 'Příliš mnoho pokusů. Zkuste to za několik minut.',
        networkError: 'Síťová chyba - zkontrolujte připojení',
        userDisabled: 'Tento účet byl deaktivován',
        googlePopupBlocked: 'Prohlížeč zablokoval okno Google. Povolte vyskakovací okna a zkuste to znovu.',
        googleProviderConflict: 'Tento email je již registrován jinou metodou přihlášení.',
        googleRegisterRequired: 'Dokončete první registraci přes Google na registrační stránce.',
        googleSignInError: 'Přihlášení přes Google se nepodařilo. Zkuste to později.',
        unknownError: 'Nepodařilo se přihlásit. Zkuste to později.',
        forgotTitle: 'Obnovit heslo',
        forgotDesc: 'Zadejte email účtu - zašleme odkaz pro obnovení hesla.',
        forgotSubmit: 'Odeslat odkaz',
        forgotSuccess: 'Pokud účet existuje, email je na cestě. Zkontrolujte schránku.',
        cancel: 'Zrušit',
    },

    IT: {
        title: 'Accedi',
        subtitle: 'Bentornato, eroe',
        loginLabel: 'Email',
        loginPh: "Inserisci l'email",
        loginErr: "Inserisci l'email",
        passwordLabel: 'Password',
        passwordPh: 'Inserisci la password',
        passwordErr: 'Inserisci la password',
        remember: 'Ricordami',
        forgot: 'Hai dimenticato la password?',
        orContinueWith: 'Oppure continua con',
        googleButton: 'Continua con Google',
        submit: 'Accedi',
        submitting: 'Accesso in corso...',
        noAccount: 'Non hai un account?',
        registerLink: 'Registrati',
        successTitle: 'Bentornato!',
        successMsg1: 'Autorizzazione riuscita.',
        successMsg2: 'Accesso al gioco...',
        accountNotFound: 'Nessun account trovato con questa email',
        wrongPassword: 'Email o password errati',
        invalidEmail: 'Indirizzo email non valido',
        tooManyRequests: 'Troppi tentativi. Riprova tra qualche minuto.',
        networkError: 'Errore di rete - controlla la connessione',
        userDisabled: 'Questo account è stato disabilitato',
        googlePopupBlocked: 'Il browser ha bloccato la finestra di Google. Consenti i popup e riprova.',
        googleProviderConflict: 'Questa email è già registrata con un altro metodo di accesso.',
        googleRegisterRequired: 'Completa la prima registrazione Google nella pagina di registrazione.',
        googleSignInError: 'Accesso con Google non riuscito. Riprova più tardi.',
        unknownError: 'Impossibile accedere. Riprova più tardi.',
        forgotTitle: 'Reimposta password',
        forgotDesc: 'Inserisci l\'email del tuo account - invieremo un link per reimpostarla.',
        forgotSubmit: 'Invia link',
        forgotSuccess: 'Se l\'account esiste, l\'email è in arrivo. Controlla la casella.',
        cancel: 'Annulla',
    },
};
