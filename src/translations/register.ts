/**
 * Register page translations (all 8 locales).
 *
 * Migrated verbatim from the inline `<script>` dictionary in `register.html`.
 * `back` and `emailMsg` remain shared from `common.ts` - here we only keep
 * the page-specific keys plus `nameMsg` (which only the register form uses).
 *
 * Note: `agree` contains HTML `<a>` tags on purpose - rendered via `innerHTML`
 * so the links to terms/privacy stay inline with the checkbox label.
 */

import type { LanguageMap } from '@models/i18n';

export interface RegisterDict {
    title: string;
    subtitle: string;

    loginLabel: string;
    loginPh: string;
    loginErr: string;

    emailLabel: string;
    emailPh: string;
    emailErr: string;

    passwordLabel: string;
    passwordPh: string;
    passwordErr: string;

    confirmLabel: string;
    confirmPh: string;
    confirmErr: string;

    /** HTML snippet containing `<a>` links - rendered with innerHTML. */
    agree: string;

    orContinueWith: string;
    googleButton: string;

    submit: string;
    submitting: string;

    haveAccount: string;
    loginLink: string;

    successTitle: string;
    successMsg1: string;
    successMsg2: string;

    /** 4 strength labels (index 0 = level 1). */
    strength: string[];

    strengthHints: {
        tooShort: string;
        noCase: string;
        noNumber: string;
        noSpecial: string;
        tooShort10: string;
        great: string;
    };

    nameMsg: {
        tooShort: string;
        tooLong: string;
        ok: string;
        taken: string;
        similar: (existing: string) => string;
    };

    matchOk: string;
    matchFail: string;
    agreeAlert: string;

    // Firebase Auth error toasts
    invalidEmailToast: string;
    weakPasswordToast: string;
    tooManyRequestsToast: string;
    networkErrorToast: string;
    googlePopupBlocked: string;
    googleProviderConflict: string;
    googleSignInError: string;
}

export const registerTranslations: LanguageMap<RegisterDict> = {
    RU: {
        title: 'Регистрация',
        subtitle: 'Создайте аккаунт и погрузитесь в мир SAO',
        loginLabel: 'Логин',
        loginPh: 'Введите имя персонажа',
        loginErr: 'Логин должен быть от 3 до 20 символов',
        emailLabel: 'Email',
        emailPh: 'your@email.com',
        emailErr: 'Введите корректный email',
        passwordLabel: 'Пароль',
        passwordPh: 'Минимум 6 символов',
        passwordErr: 'Пароль должен быть минимум 6 символов',
        confirmLabel: 'Повторите пароль',
        confirmPh: 'Повторите пароль',
        confirmErr: 'Пароли не совпадают',
        agree:
            'Я принимаю <a href="terms.html" target="_blank">условия соглашения</a> и <a href="privacy.html" target="_blank">политику конфиденциальности</a>',
        orContinueWith: 'Или продолжите через',
        googleButton: 'Продолжить с Google',
        submit: 'Создать аккаунт',
        submitting: 'Создаём аккаунт...',
        haveAccount: 'Уже есть аккаунт?',
        loginLink: 'Войти',
        successTitle: 'Добро пожаловать!',
        successMsg1: 'Регистрация успешно завершена.',
        successMsg2: 'Возвращаем на главную страницу...',
        strength: ['Слабый', 'Средний', 'Хороший', 'Надёжный'],
        strengthHints: {
            tooShort: 'Минимум 6 символов',
            noCase: 'Добавьте заглавные и строчные',
            noNumber: 'Добавьте цифры',
            noSpecial: 'Добавьте спецсимволы (!@#$)',
            tooShort10: 'Увеличьте до 10+ символов',
            great: 'Отличный пароль!',
        },
        nameMsg: {
            tooShort: '✗ Минимум 3 символа',
            tooLong: '✗ Максимум 20 символов',
            ok: '✓ Логин свободен',
            taken: '✗ Этот логин уже занят',
            similar: (n) => `⚠ Похож на существующий: ${n}`,
        },
        matchOk: '✓ Пароли совпадают',
        matchFail: '✗ Пароли не совпадают',
        agreeAlert: 'Необходимо принять условия соглашения',
        invalidEmailToast: 'Некорректный email',
        weakPasswordToast: 'Пароль слишком простой',
        tooManyRequestsToast: 'Слишком много попыток. Попробуйте позже.',
        networkErrorToast: 'Ошибка сети - проверьте подключение',
        googlePopupBlocked: 'Браузер заблокировал окно Google. Разрешите всплывающие окна и попробуйте снова.',
        googleProviderConflict: 'Этот email уже зарегистрирован через другой способ входа.',
        googleSignInError: 'Не удалось войти через Google. Попробуйте позже.',
    },

    EN: {
        title: 'Sign Up',
        subtitle: 'Create an account and dive into the world of SAO',
        loginLabel: 'Username',
        loginPh: 'Enter character name',
        loginErr: 'Username must be 3 to 20 characters',
        emailLabel: 'Email',
        emailPh: 'your@email.com',
        emailErr: 'Enter a valid email',
        passwordLabel: 'Password',
        passwordPh: 'Minimum 6 characters',
        passwordErr: 'Password must be at least 6 characters',
        confirmLabel: 'Confirm password',
        confirmPh: 'Repeat password',
        confirmErr: 'Passwords do not match',
        agree:
            'I accept the <a href="terms.html" target="_blank">terms of service</a> and <a href="privacy.html" target="_blank">privacy policy</a>',
        orContinueWith: 'Or continue with',
        googleButton: 'Continue with Google',
        submit: 'Create account',
        submitting: 'Creating account...',
        haveAccount: 'Already have an account?',
        loginLink: 'Log in',
        successTitle: 'Welcome!',
        successMsg1: 'Registration completed successfully.',
        successMsg2: 'Returning to main page...',
        strength: ['Weak', 'Medium', 'Good', 'Strong'],
        strengthHints: {
            tooShort: 'Minimum 6 characters',
            noCase: 'Add uppercase and lowercase',
            noNumber: 'Add numbers',
            noSpecial: 'Add special chars (!@#$)',
            tooShort10: 'Increase to 10+ characters',
            great: 'Excellent password!',
        },
        nameMsg: {
            tooShort: '✗ Minimum 3 characters',
            tooLong: '✗ Maximum 20 characters',
            ok: '✓ Username available',
            taken: '✗ This username is already taken',
            similar: (n) => `⚠ Similar to existing: ${n}`,
        },
        matchOk: '✓ Passwords match',
        matchFail: '✗ Passwords do not match',
        agreeAlert: 'You must accept the terms',
        invalidEmailToast: 'Invalid email address',
        weakPasswordToast: 'Password is too weak',
        tooManyRequestsToast: 'Too many attempts. Try again later.',
        networkErrorToast: 'Network error - check your connection',
        googlePopupBlocked: 'The browser blocked the Google window. Allow popups and try again.',
        googleProviderConflict: 'This email is already registered with another sign-in method.',
        googleSignInError: 'Could not sign in with Google. Please try again later.',
    },

    DE: {
        title: 'Registrierung',
        subtitle: 'Erstellen Sie ein Konto und tauchen Sie in die Welt von SAO ein',
        loginLabel: 'Benutzername',
        loginPh: 'Charaktername eingeben',
        loginErr: 'Benutzername muss 3-20 Zeichen lang sein',
        emailLabel: 'Email',
        emailPh: 'your@email.com',
        emailErr: 'Gültige Email eingeben',
        passwordLabel: 'Passwort',
        passwordPh: 'Mindestens 6 Zeichen',
        passwordErr: 'Passwort muss mindestens 6 Zeichen haben',
        confirmLabel: 'Passwort bestätigen',
        confirmPh: 'Passwort wiederholen',
        confirmErr: 'Passwörter stimmen nicht überein',
        agree:
            'Ich akzeptiere die <a href="terms.html" target="_blank">Nutzungsbedingungen</a> und <a href="privacy.html" target="_blank">Datenschutzrichtlinie</a>',
        orContinueWith: 'Oder weiter mit',
        googleButton: 'Mit Google fortfahren',
        submit: 'Konto erstellen',
        submitting: 'Konto wird erstellt...',
        haveAccount: 'Bereits ein Konto?',
        loginLink: 'Anmelden',
        successTitle: 'Willkommen!',
        successMsg1: 'Registrierung erfolgreich abgeschlossen.',
        successMsg2: 'Zurück zur Hauptseite...',
        strength: ['Schwach', 'Mittel', 'Gut', 'Stark'],
        strengthHints: {
            tooShort: 'Mindestens 6 Zeichen',
            noCase: 'Groß- und Kleinbuchstaben hinzufügen',
            noNumber: 'Zahlen hinzufügen',
            noSpecial: 'Sonderzeichen hinzufügen (!@#$)',
            tooShort10: 'Auf 10+ Zeichen erhöhen',
            great: 'Ausgezeichnetes Passwort!',
        },
        nameMsg: {
            tooShort: '✗ Mindestens 3 Zeichen',
            tooLong: '✗ Maximal 20 Zeichen',
            ok: '✓ Benutzername verfügbar',
            taken: '✗ Dieser Benutzername ist bereits vergeben',
            similar: (n) => `⚠ Ähnlich zu existierendem: ${n}`,
        },
        matchOk: '✓ Passwörter stimmen überein',
        matchFail: '✗ Passwörter stimmen nicht überein',
        agreeAlert: 'Sie müssen die Bedingungen akzeptieren',
        invalidEmailToast: 'Ungültige Email-Adresse',
        weakPasswordToast: 'Passwort zu schwach',
        tooManyRequestsToast: 'Zu viele Versuche. Versuch es später erneut.',
        networkErrorToast: 'Netzwerkfehler - Verbindung prüfen',
        googlePopupBlocked: 'Der Browser hat das Google-Fenster blockiert. Erlauben Sie Popups und versuchen Sie es erneut.',
        googleProviderConflict: 'Diese Email ist bereits mit einer anderen Anmeldemethode registriert.',
        googleSignInError: 'Anmeldung mit Google fehlgeschlagen. Bitte später erneut versuchen.',
    },

    FR: {
        title: 'Inscription',
        subtitle: "Créez un compte et plongez dans l'univers SAO",
        loginLabel: "Nom d'utilisateur",
        loginPh: 'Entrez le nom du personnage',
        loginErr: 'Le nom doit faire 3 à 20 caractères',
        emailLabel: 'Email',
        emailPh: 'your@email.com',
        emailErr: 'Entrez un email valide',
        passwordLabel: 'Mot de passe',
        passwordPh: 'Minimum 6 caractères',
        passwordErr: 'Mot de passe doit faire au moins 6 caractères',
        confirmLabel: 'Confirmer le mot de passe',
        confirmPh: 'Répétez le mot de passe',
        confirmErr: 'Les mots de passe ne correspondent pas',
        agree:
            "J'accepte les <a href=\"terms.html\" target=\"_blank\">conditions d'utilisation</a> et la <a href=\"privacy.html\" target=\"_blank\">politique de confidentialité</a>",
        orContinueWith: 'Ou continuer avec',
        googleButton: 'Continuer avec Google',
        submit: 'Créer un compte',
        submitting: 'Création du compte...',
        haveAccount: 'Déjà un compte ?',
        loginLink: 'Se connecter',
        successTitle: 'Bienvenue !',
        successMsg1: 'Inscription réussie.',
        successMsg2: "Retour à la page d'accueil...",
        strength: ['Faible', 'Moyen', 'Bon', 'Fort'],
        strengthHints: {
            tooShort: 'Minimum 6 caractères',
            noCase: 'Ajoutez majuscules et minuscules',
            noNumber: 'Ajoutez des chiffres',
            noSpecial: 'Ajoutez des caractères spéciaux (!@#$)',
            tooShort10: 'Augmentez à 10+ caractères',
            great: 'Excellent mot de passe !',
        },
        nameMsg: {
            tooShort: '✗ Minimum 3 caractères',
            tooLong: '✗ Maximum 20 caractères',
            ok: '✓ Nom disponible',
            taken: "✗ Ce nom d'utilisateur est déjà pris",
            similar: (n) => `⚠ Similaire à l'existant: ${n}`,
        },
        matchOk: '✓ Mots de passe correspondent',
        matchFail: '✗ Mots de passe ne correspondent pas',
        agreeAlert: 'Vous devez accepter les conditions',
        invalidEmailToast: 'Adresse email invalide',
        weakPasswordToast: 'Mot de passe trop faible',
        tooManyRequestsToast: 'Trop de tentatives. Réessayez plus tard.',
        networkErrorToast: 'Erreur réseau - vérifiez votre connexion',
        googlePopupBlocked: 'Le navigateur a bloqué la fenêtre Google. Autorisez les popups puis réessayez.',
        googleProviderConflict: 'Cet email est déjà enregistré avec une autre méthode de connexion.',
        googleSignInError: 'Connexion Google impossible. Réessayez plus tard.',
    },

    PL: {
        title: 'Rejestracja',
        subtitle: 'Utwórz konto i zanurz się w świecie SAO',
        loginLabel: 'Login',
        loginPh: 'Wpisz imię postaci',
        loginErr: 'Login musi mieć 3-20 znaków',
        emailLabel: 'Email',
        emailPh: 'your@email.com',
        emailErr: 'Wpisz poprawny email',
        passwordLabel: 'Hasło',
        passwordPh: 'Minimum 6 znaków',
        passwordErr: 'Hasło musi mieć minimum 6 znaków',
        confirmLabel: 'Powtórz hasło',
        confirmPh: 'Powtórz hasło',
        confirmErr: 'Hasła nie są zgodne',
        agree:
            'Akceptuję <a href="terms.html" target="_blank">regulamin</a> oraz <a href="privacy.html" target="_blank">politykę prywatności</a>',
        orContinueWith: 'Lub kontynuuj przez',
        googleButton: 'Kontynuuj z Google',
        submit: 'Utwórz konto',
        submitting: 'Tworzenie konta...',
        haveAccount: 'Masz już konto?',
        loginLink: 'Zaloguj się',
        successTitle: 'Witaj!',
        successMsg1: 'Rejestracja zakończona pomyślnie.',
        successMsg2: 'Powrót na stronę główną...',
        strength: ['Słabe', 'Średnie', 'Dobre', 'Silne'],
        strengthHints: {
            tooShort: 'Minimum 6 znaków',
            noCase: 'Dodaj wielkie i małe litery',
            noNumber: 'Dodaj cyfry',
            noSpecial: 'Dodaj znaki specjalne (!@#$)',
            tooShort10: 'Zwiększ do 10+ znaków',
            great: 'Doskonałe hasło!',
        },
        nameMsg: {
            tooShort: '✗ Minimum 3 znaki',
            tooLong: '✗ Maksymalnie 20 znaków',
            ok: '✓ Login dostępny',
            taken: '✗ Ten login jest już zajęty',
            similar: (n) => `⚠ Podobny do istniejącego: ${n}`,
        },
        matchOk: '✓ Hasła są zgodne',
        matchFail: '✗ Hasła nie są zgodne',
        agreeAlert: 'Musisz zaakceptować regulamin',
        invalidEmailToast: 'Nieprawidłowy adres email',
        weakPasswordToast: 'Hasło jest zbyt słabe',
        tooManyRequestsToast: 'Zbyt wiele prób. Spróbuj później.',
        networkErrorToast: 'Błąd sieci - sprawdź połączenie',
        googlePopupBlocked: 'Przeglądarka zablokowała okno Google. Zezwól na wyskakujące okna i spróbuj ponownie.',
        googleProviderConflict: 'Ten email jest już zarejestrowany inną metodą logowania.',
        googleSignInError: 'Nie udało się zalogować przez Google. Spróbuj później.',
    },

    ES: {
        title: 'Registro',
        subtitle: 'Crea una cuenta y sumérgete en el mundo de SAO',
        loginLabel: 'Usuario',
        loginPh: 'Nombre del personaje',
        loginErr: 'Usuario debe tener 3 a 20 caracteres',
        emailLabel: 'Email',
        emailPh: 'your@email.com',
        emailErr: 'Introduce un email válido',
        passwordLabel: 'Contraseña',
        passwordPh: 'Mínimo 6 caracteres',
        passwordErr: 'Contraseña debe tener al menos 6 caracteres',
        confirmLabel: 'Repite la contraseña',
        confirmPh: 'Repite la contraseña',
        confirmErr: 'Las contraseñas no coinciden',
        agree:
            'Acepto los <a href="terms.html" target="_blank">términos del servicio</a> y la <a href="privacy.html" target="_blank">política de privacidad</a>',
        orContinueWith: 'O continuar con',
        googleButton: 'Continuar con Google',
        submit: 'Crear cuenta',
        submitting: 'Creando cuenta...',
        haveAccount: '¿Ya tienes cuenta?',
        loginLink: 'Iniciar sesión',
        successTitle: '¡Bienvenido!',
        successMsg1: 'Registro completado con éxito.',
        successMsg2: 'Volviendo a la página principal...',
        strength: ['Débil', 'Media', 'Buena', 'Fuerte'],
        strengthHints: {
            tooShort: 'Mínimo 6 caracteres',
            noCase: 'Añade mayúsculas y minúsculas',
            noNumber: 'Añade números',
            noSpecial: 'Añade caracteres especiales (!@#$)',
            tooShort10: 'Aumenta a 10+ caracteres',
            great: '¡Excelente contraseña!',
        },
        nameMsg: {
            tooShort: '✗ Mínimo 3 caracteres',
            tooLong: '✗ Máximo 20 caracteres',
            ok: '✓ Usuario disponible',
            taken: '✗ Este usuario ya está en uso',
            similar: (n) => `⚠ Similar a uno existente: ${n}`,
        },
        matchOk: '✓ Las contraseñas coinciden',
        matchFail: '✗ Las contraseñas no coinciden',
        agreeAlert: 'Debes aceptar los términos',
        invalidEmailToast: 'Dirección de email no válida',
        weakPasswordToast: 'La contraseña es demasiado débil',
        tooManyRequestsToast: 'Demasiados intentos. Inténtalo más tarde.',
        networkErrorToast: 'Error de red - comprueba tu conexión',
        googlePopupBlocked: 'El navegador bloqueó la ventana de Google. Permite las ventanas emergentes e inténtalo de nuevo.',
        googleProviderConflict: 'Este email ya está registrado con otro método de acceso.',
        googleSignInError: 'No se pudo iniciar sesión con Google. Inténtalo más tarde.',
    },

    CZ: {
        title: 'Registrace',
        subtitle: 'Vytvořte si účet a ponořte se do světa SAO',
        loginLabel: 'Přihlašovací jméno',
        loginPh: 'Zadejte jméno postavy',
        loginErr: 'Jméno musí mít 3-20 znaků',
        emailLabel: 'Email',
        emailPh: 'your@email.com',
        emailErr: 'Zadejte platný email',
        passwordLabel: 'Heslo',
        passwordPh: 'Minimálně 6 znaků',
        passwordErr: 'Heslo musí mít alespoň 6 znaků',
        confirmLabel: 'Zopakujte heslo',
        confirmPh: 'Zopakujte heslo',
        confirmErr: 'Hesla se neshodují',
        agree:
            'Souhlasím s <a href="terms.html" target="_blank">podmínkami služby</a> a <a href="privacy.html" target="_blank">zásadami ochrany soukromí</a>',
        orContinueWith: 'Nebo pokračujte přes',
        googleButton: 'Pokračovat přes Google',
        submit: 'Vytvořit účet',
        submitting: 'Vytváření účtu...',
        haveAccount: 'Máte již účet?',
        loginLink: 'Přihlásit se',
        successTitle: 'Vítejte!',
        successMsg1: 'Registrace úspěšně dokončena.',
        successMsg2: 'Návrat na hlavní stránku...',
        strength: ['Slabé', 'Střední', 'Dobré', 'Silné'],
        strengthHints: {
            tooShort: 'Minimálně 6 znaků',
            noCase: 'Přidejte velká a malá písmena',
            noNumber: 'Přidejte čísla',
            noSpecial: 'Přidejte speciální znaky (!@#$)',
            tooShort10: 'Zvyšte na 10+ znaků',
            great: 'Vynikající heslo!',
        },
        nameMsg: {
            tooShort: '✗ Minimálně 3 znaky',
            tooLong: '✗ Maximálně 20 znaků',
            ok: '✓ Jméno dostupné',
            taken: '✗ Toto jméno je již používáno',
            similar: (n) => `⚠ Podobné existujícímu: ${n}`,
        },
        matchOk: '✓ Hesla se shodují',
        matchFail: '✗ Hesla se neshodují',
        agreeAlert: 'Musíte přijmout podmínky',
        invalidEmailToast: 'Neplatná emailová adresa',
        weakPasswordToast: 'Heslo je příliš slabé',
        tooManyRequestsToast: 'Příliš mnoho pokusů. Zkuste to později.',
        networkErrorToast: 'Síťová chyba - zkontrolujte připojení',
        googlePopupBlocked: 'Prohlížeč zablokoval okno Google. Povolte vyskakovací okna a zkuste to znovu.',
        googleProviderConflict: 'Tento email je již registrován jinou metodou přihlášení.',
        googleSignInError: 'Přihlášení přes Google se nepodařilo. Zkuste to později.',
    },

    IT: {
        title: 'Registrazione',
        subtitle: 'Crea un account e tuffati nel mondo di SAO',
        loginLabel: 'Nome utente',
        loginPh: 'Inserisci nome del personaggio',
        loginErr: 'Il nome deve avere 3-20 caratteri',
        emailLabel: 'Email',
        emailPh: 'your@email.com',
        emailErr: 'Inserisci un email valido',
        passwordLabel: 'Password',
        passwordPh: 'Minimo 6 caratteri',
        passwordErr: 'Password deve avere almeno 6 caratteri',
        confirmLabel: 'Ripeti password',
        confirmPh: 'Ripeti password',
        confirmErr: 'Le password non coincidono',
        agree:
            'Accetto i <a href="terms.html" target="_blank">termini di servizio</a> e la <a href="privacy.html" target="_blank">privacy policy</a>',
        orContinueWith: 'Oppure continua con',
        googleButton: 'Continua con Google',
        submit: 'Crea account',
        submitting: 'Creazione account...',
        haveAccount: 'Hai già un account?',
        loginLink: 'Accedi',
        successTitle: 'Benvenuto!',
        successMsg1: 'Registrazione completata con successo.',
        successMsg2: 'Ritorno alla pagina principale...',
        strength: ['Debole', 'Media', 'Buona', 'Forte'],
        strengthHints: {
            tooShort: 'Minimo 6 caratteri',
            noCase: 'Aggiungi maiuscole e minuscole',
            noNumber: 'Aggiungi numeri',
            noSpecial: 'Aggiungi caratteri speciali (!@#$)',
            tooShort10: 'Aumenta a 10+ caratteri',
            great: 'Password eccellente!',
        },
        nameMsg: {
            tooShort: '✗ Minimo 3 caratteri',
            tooLong: '✗ Massimo 20 caratteri',
            ok: '✓ Nome disponibile',
            taken: '✗ Questo nome è già in uso',
            similar: (n) => `⚠ Simile a esistente: ${n}`,
        },
        matchOk: '✓ Le password coincidono',
        matchFail: '✗ Le password non coincidono',
        agreeAlert: 'Devi accettare i termini',
        invalidEmailToast: 'Indirizzo email non valido',
        weakPasswordToast: 'La password è troppo debole',
        tooManyRequestsToast: 'Troppi tentativi. Riprova più tardi.',
        networkErrorToast: 'Errore di rete - controlla la connessione',
        googlePopupBlocked: 'Il browser ha bloccato la finestra di Google. Consenti i popup e riprova.',
        googleProviderConflict: 'Questa email è già registrata con un altro metodo di accesso.',
        googleSignInError: 'Accesso con Google non riuscito. Riprova più tardi.',
    },

    UA: {
        title: 'Реєстрація',
        subtitle: 'Створіть акаунт і пориньте у світ SAO',
        loginLabel: 'Логін',
        loginPh: 'Введіть ім\'я персонажа',
        loginErr: 'Логін має бути від 3 до 20 символів',
        emailLabel: 'Email',
        emailPh: 'your@email.com',
        emailErr: 'Введіть коректний email',
        passwordLabel: 'Пароль',
        passwordPh: 'Мінімум 6 символів',
        passwordErr: 'Пароль має бути мінімум 6 символів',
        confirmLabel: 'Повторіть пароль',
        confirmPh: 'Повторіть пароль',
        confirmErr: 'Паролі не співпадають',
        agree:
            'Я приймаю <a href="terms.html" target="_blank">умови угоди</a> і <a href="privacy.html" target="_blank">політику конфіденційності</a>',
        orContinueWith: 'Або продовжити через',
        googleButton: 'Продовжити з Google',
        submit: 'Створити акаунт',
        submitting: 'Створюємо акаунт...',
        haveAccount: 'Вже є акаунт?',
        loginLink: 'Увійти',
        successTitle: 'Ласкаво просимо!',
        successMsg1: 'Реєстрація успішно завершена.',
        successMsg2: 'Повертаємо на головну сторінку...',
        strength: ['Слабкий', 'Середній', 'Хороший', 'Надійний'],
        strengthHints: {
            tooShort: 'Мінімум 6 символів',
            noCase: 'Додайте великі та малі літери',
            noNumber: 'Додайте цифри',
            noSpecial: 'Додайте спецсимволи (!@#$)',
            tooShort10: 'Збільште до 10+ символів',
            great: 'Відмінний пароль!',
        },
        nameMsg: {
            tooShort: '✗ Мінімум 3 символи',
            tooLong: '✗ Максимум 20 символів',
            ok: '✓ Логін вільний',
            taken: '✗ Цей логін вже зайнятий',
            similar: (n) => `⚠ Подібний до існуючого: ${n}`,
        },
        matchOk: '✓ Паролі співпадають',
        matchFail: '✗ Паролі не співпадають',
        agreeAlert: 'Необхідно прийняти умови угоди',
        invalidEmailToast: 'Некоректний email',
        weakPasswordToast: 'Пароль занадто простий',
        tooManyRequestsToast: 'Забагато спроб. Спробуйте пізніше.',
        networkErrorToast: 'Помилка мережі - перевірте підключення',
        googlePopupBlocked: 'Браузер заблокував вікно Google. Дозвольте спливаючі вікна і спробуйте знову.',
        googleProviderConflict: 'Цей email вже зареєстрований через інший спосіб входу.',
        googleSignInError: 'Не вдалося увійти через Google. Спробуйте пізніше.',
    },
};
