/**
 * Auth-action page translations (all 8 locales).
 *
 * This page replaces Firebase's built-in handler for:
 *   - password reset (`mode=resetPassword`)
 *   - email verification (`mode=verifyEmail` / `verifyAndChangeEmail`)
 *   - email change revert (`mode=recoverEmail`)
 *
 * `back` is shared from `common.ts`.
 */

import type { LanguageMap } from '@models/i18n';

export interface AuthActionDict {
    // ===== Loading =====
    loadingTitle: string;
    loadingSub: string;

    // ===== Password reset form =====
    resetTitle: string;
    resetSub: string;

    passwordLabel: string;
    passwordPh: string;
    passwordErr: string;

    confirmLabel: string;
    confirmPh: string;
    confirmErr: string;

    matchOk: string;
    matchFail: string;

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

    resetSubmit: string;
    resetSubmitting: string;

    // ===== Success states (one per mode) =====
    resetSuccessTitle: string;
    resetSuccessMsg: string;

    verifyTitle: string;
    verifySuccessMsg: string;

    recoverTitle: string;
    recoverSuccessMsg: (email: string) => string;

    // ===== Error states =====
    errorTitle: string;
    errorInvalid: string;
    errorExpired: string;
    errorUserDisabled: string;
    errorUserNotFound: string;
    errorWeakPassword: string;
    errorNetwork: string;
    errorUnknown: string;
    errorUnknownMode: string;
    errorMissingCode: string;

    // ===== CTAs =====
    toLogin: string;
    toHome: string;
}

export const authActionTranslations: LanguageMap<AuthActionDict> = {
    RU: {
        loadingTitle: 'Проверка ссылки',
        loadingSub: 'Подождите секунду…',

        resetTitle: 'Новый пароль',
        resetSub: 'Для аккаунта',
        passwordLabel: 'Новый пароль',
        passwordPh: 'Минимум 6 символов',
        passwordErr: 'Пароль должен быть минимум 6 символов',
        confirmLabel: 'Повторите пароль',
        confirmPh: 'Повторите пароль',
        confirmErr: 'Пароли не совпадают',
        matchOk: '✓ Пароли совпадают',
        matchFail: '✗ Пароли не совпадают',
        strength: ['Очень слабый', 'Слабый', 'Средний', 'Надёжный'],
        strengthHints: {
            tooShort: 'минимум 6 символов',
            noCase: 'добавьте заглавные буквы',
            noNumber: 'добавьте цифру',
            noSpecial: 'добавьте спецсимвол',
            tooShort10: 'длиннее 10 символов - надёжнее',
            great: 'отличный пароль!',
        },
        resetSubmit: 'Сменить пароль',
        resetSubmitting: 'Сохраняем…',

        resetSuccessTitle: 'Пароль изменён',
        resetSuccessMsg: 'Теперь вы можете войти с новым паролем.',
        verifyTitle: 'Email подтверждён',
        verifySuccessMsg: 'Спасибо - ваш email успешно подтверждён.',
        recoverTitle: 'Изменение email отменено',
        recoverSuccessMsg: (email) =>
            `Адрес ${email} восстановлен. Рекомендуем сразу сменить пароль - возможно, ваш аккаунт был скомпрометирован.`,

        errorTitle: 'Ссылка недействительна',
        errorInvalid: 'Ссылка повреждена или уже была использована. Запросите новую.',
        errorExpired: 'Срок действия ссылки истёк. Запросите новую.',
        errorUserDisabled: 'Этот аккаунт заблокирован.',
        errorUserNotFound: 'Аккаунт не найден - возможно, он был удалён.',
        errorWeakPassword: 'Пароль слишком слабый. Минимум 6 символов.',
        errorNetwork: 'Ошибка сети - проверьте подключение и попробуйте снова.',
        errorUnknown: 'Что-то пошло не так. Попробуйте позже.',
        errorUnknownMode: 'Неизвестный тип действия. Проверьте ссылку из письма.',
        errorMissingCode: 'В ссылке не хватает данных. Откройте её из письма заново.',

        toLogin: 'Войти в игру',
        toHome: 'На главную',
    },

    EN: {
        loadingTitle: 'Verifying link',
        loadingSub: 'Just a second…',

        resetTitle: 'New password',
        resetSub: 'For account',
        passwordLabel: 'New password',
        passwordPh: 'At least 6 characters',
        passwordErr: 'Password must be at least 6 characters',
        confirmLabel: 'Confirm password',
        confirmPh: 'Repeat password',
        confirmErr: 'Passwords do not match',
        matchOk: '✓ Passwords match',
        matchFail: '✗ Passwords do not match',
        strength: ['Very weak', 'Weak', 'Medium', 'Strong'],
        strengthHints: {
            tooShort: 'minimum 6 characters',
            noCase: 'add uppercase letters',
            noNumber: 'add a digit',
            noSpecial: 'add a special character',
            tooShort10: 'longer than 10 chars is stronger',
            great: 'excellent password!',
        },
        resetSubmit: 'Change password',
        resetSubmitting: 'Saving…',

        resetSuccessTitle: 'Password changed',
        resetSuccessMsg: 'You can now sign in with your new password.',
        verifyTitle: 'Email verified',
        verifySuccessMsg: 'Thank you - your email has been verified.',
        recoverTitle: 'Email change reverted',
        recoverSuccessMsg: (email) =>
            `Address ${email} has been restored. We recommend changing your password immediately - your account may have been compromised.`,

        errorTitle: 'Link is invalid',
        errorInvalid: 'The link is broken or has already been used. Please request a new one.',
        errorExpired: 'The link has expired. Please request a new one.',
        errorUserDisabled: 'This account has been disabled.',
        errorUserNotFound: 'Account not found - it may have been deleted.',
        errorWeakPassword: 'Password is too weak. At least 6 characters.',
        errorNetwork: 'Network error - check your connection and try again.',
        errorUnknown: 'Something went wrong. Please try again later.',
        errorUnknownMode: 'Unknown action type. Check the link from the email.',
        errorMissingCode: 'The link is missing data. Please reopen it from the email.',

        toLogin: 'Sign in',
        toHome: 'Back to home',
    },

    DE: {
        loadingTitle: 'Link wird überprüft',
        loadingSub: 'Einen Moment…',

        resetTitle: 'Neues Passwort',
        resetSub: 'Für das Konto',
        passwordLabel: 'Neues Passwort',
        passwordPh: 'Mindestens 6 Zeichen',
        passwordErr: 'Passwort muss mindestens 6 Zeichen lang sein',
        confirmLabel: 'Passwort wiederholen',
        confirmPh: 'Passwort wiederholen',
        confirmErr: 'Passwörter stimmen nicht überein',
        matchOk: '✓ Passwörter stimmen überein',
        matchFail: '✗ Passwörter stimmen nicht überein',
        strength: ['Sehr schwach', 'Schwach', 'Mittel', 'Stark'],
        strengthHints: {
            tooShort: 'mindestens 6 Zeichen',
            noCase: 'Großbuchstaben hinzufügen',
            noNumber: 'Ziffer hinzufügen',
            noSpecial: 'Sonderzeichen hinzufügen',
            tooShort10: 'länger als 10 Zeichen ist sicherer',
            great: 'ausgezeichnetes Passwort!',
        },
        resetSubmit: 'Passwort ändern',
        resetSubmitting: 'Wird gespeichert…',

        resetSuccessTitle: 'Passwort geändert',
        resetSuccessMsg: 'Sie können sich jetzt mit dem neuen Passwort anmelden.',
        verifyTitle: 'E-Mail bestätigt',
        verifySuccessMsg: 'Danke - Ihre E-Mail wurde erfolgreich bestätigt.',
        recoverTitle: 'E-Mail-Änderung rückgängig',
        recoverSuccessMsg: (email) =>
            `Die Adresse ${email} wurde wiederhergestellt. Wir empfehlen, das Passwort umgehend zu ändern - Ihr Konto könnte kompromittiert sein.`,

        errorTitle: 'Link ungültig',
        errorInvalid: 'Der Link ist beschädigt oder wurde bereits verwendet. Fordern Sie einen neuen an.',
        errorExpired: 'Der Link ist abgelaufen. Fordern Sie einen neuen an.',
        errorUserDisabled: 'Dieses Konto wurde gesperrt.',
        errorUserNotFound: 'Konto nicht gefunden - möglicherweise wurde es gelöscht.',
        errorWeakPassword: 'Passwort ist zu schwach. Mindestens 6 Zeichen.',
        errorNetwork: 'Netzwerkfehler - prüfen Sie die Verbindung und versuchen Sie es erneut.',
        errorUnknown: 'Etwas ist schiefgegangen. Bitte später erneut versuchen.',
        errorUnknownMode: 'Unbekannter Aktionstyp. Prüfen Sie den Link aus der E-Mail.',
        errorMissingCode: 'Im Link fehlen Daten. Bitte öffnen Sie ihn erneut aus der E-Mail.',

        toLogin: 'Anmelden',
        toHome: 'Zur Startseite',
    },

    FR: {
        loadingTitle: 'Vérification du lien',
        loadingSub: 'Un instant…',

        resetTitle: 'Nouveau mot de passe',
        resetSub: 'Pour le compte',
        passwordLabel: 'Nouveau mot de passe',
        passwordPh: 'Au moins 6 caractères',
        passwordErr: 'Le mot de passe doit contenir au moins 6 caractères',
        confirmLabel: 'Confirmer le mot de passe',
        confirmPh: 'Répétez le mot de passe',
        confirmErr: 'Les mots de passe ne correspondent pas',
        matchOk: '✓ Les mots de passe correspondent',
        matchFail: '✗ Les mots de passe ne correspondent pas',
        strength: ['Très faible', 'Faible', 'Moyen', 'Fort'],
        strengthHints: {
            tooShort: 'au moins 6 caractères',
            noCase: 'ajoutez des majuscules',
            noNumber: 'ajoutez un chiffre',
            noSpecial: 'ajoutez un caractère spécial',
            tooShort10: 'plus de 10 caractères c\'est mieux',
            great: 'excellent mot de passe !',
        },
        resetSubmit: 'Changer le mot de passe',
        resetSubmitting: 'Enregistrement…',

        resetSuccessTitle: 'Mot de passe modifié',
        resetSuccessMsg: 'Vous pouvez maintenant vous connecter avec le nouveau mot de passe.',
        verifyTitle: 'E-mail vérifié',
        verifySuccessMsg: 'Merci - votre e-mail a bien été vérifié.',
        recoverTitle: 'Changement d\'e-mail annulé',
        recoverSuccessMsg: (email) =>
            `L'adresse ${email} a été restaurée. Nous vous recommandons de changer votre mot de passe immédiatement - votre compte pourrait avoir été compromis.`,

        errorTitle: 'Lien invalide',
        errorInvalid: 'Le lien est cassé ou a déjà été utilisé. Veuillez en demander un nouveau.',
        errorExpired: 'Le lien a expiré. Veuillez en demander un nouveau.',
        errorUserDisabled: 'Ce compte a été désactivé.',
        errorUserNotFound: 'Compte introuvable - il a peut-être été supprimé.',
        errorWeakPassword: 'Mot de passe trop faible. Au moins 6 caractères.',
        errorNetwork: 'Erreur réseau - vérifiez votre connexion et réessayez.',
        errorUnknown: 'Une erreur est survenue. Veuillez réessayer plus tard.',
        errorUnknownMode: 'Type d\'action inconnu. Vérifiez le lien de l\'e-mail.',
        errorMissingCode: 'Il manque des données dans le lien. Rouvrez-le depuis l\'e-mail.',

        toLogin: 'Se connecter',
        toHome: 'Accueil',
    },

    PL: {
        loadingTitle: 'Weryfikacja linku',
        loadingSub: 'Chwileczkę…',

        resetTitle: 'Nowe hasło',
        resetSub: 'Dla konta',
        passwordLabel: 'Nowe hasło',
        passwordPh: 'Minimum 6 znaków',
        passwordErr: 'Hasło musi mieć co najmniej 6 znaków',
        confirmLabel: 'Powtórz hasło',
        confirmPh: 'Powtórz hasło',
        confirmErr: 'Hasła nie są zgodne',
        matchOk: '✓ Hasła są zgodne',
        matchFail: '✗ Hasła nie są zgodne',
        strength: ['Bardzo słabe', 'Słabe', 'Średnie', 'Silne'],
        strengthHints: {
            tooShort: 'minimum 6 znaków',
            noCase: 'dodaj wielkie litery',
            noNumber: 'dodaj cyfrę',
            noSpecial: 'dodaj znak specjalny',
            tooShort10: 'dłuższe niż 10 znaków - silniejsze',
            great: 'doskonałe hasło!',
        },
        resetSubmit: 'Zmień hasło',
        resetSubmitting: 'Zapisywanie…',

        resetSuccessTitle: 'Hasło zmienione',
        resetSuccessMsg: 'Możesz teraz zalogować się nowym hasłem.',
        verifyTitle: 'E-mail zweryfikowany',
        verifySuccessMsg: 'Dziękujemy - Twój e-mail został zweryfikowany.',
        recoverTitle: 'Zmiana e-maila cofnięta',
        recoverSuccessMsg: (email) =>
            `Adres ${email} został przywrócony. Zalecamy natychmiastową zmianę hasła - Twoje konto mogło zostać naruszone.`,

        errorTitle: 'Link nieprawidłowy',
        errorInvalid: 'Link jest uszkodzony lub został już użyty. Poproś o nowy.',
        errorExpired: 'Link wygasł. Poproś o nowy.',
        errorUserDisabled: 'To konto zostało zablokowane.',
        errorUserNotFound: 'Nie znaleziono konta - mogło zostać usunięte.',
        errorWeakPassword: 'Hasło jest za słabe. Minimum 6 znaków.',
        errorNetwork: 'Błąd sieci - sprawdź połączenie i spróbuj ponownie.',
        errorUnknown: 'Coś poszło nie tak. Spróbuj później.',
        errorUnknownMode: 'Nieznany typ akcji. Sprawdź link z e-maila.',
        errorMissingCode: 'W linku brakuje danych. Otwórz go ponownie z e-maila.',

        toLogin: 'Zaloguj się',
        toHome: 'Strona główna',
    },

    ES: {
        loadingTitle: 'Verificando el enlace',
        loadingSub: 'Un momento…',

        resetTitle: 'Nueva contraseña',
        resetSub: 'Para la cuenta',
        passwordLabel: 'Nueva contraseña',
        passwordPh: 'Mínimo 6 caracteres',
        passwordErr: 'La contraseña debe tener al menos 6 caracteres',
        confirmLabel: 'Confirmar contraseña',
        confirmPh: 'Repite la contraseña',
        confirmErr: 'Las contraseñas no coinciden',
        matchOk: '✓ Las contraseñas coinciden',
        matchFail: '✗ Las contraseñas no coinciden',
        strength: ['Muy débil', 'Débil', 'Media', 'Fuerte'],
        strengthHints: {
            tooShort: 'mínimo 6 caracteres',
            noCase: 'añade mayúsculas',
            noNumber: 'añade un dígito',
            noSpecial: 'añade un carácter especial',
            tooShort10: 'más de 10 caracteres es más seguro',
            great: '¡contraseña excelente!',
        },
        resetSubmit: 'Cambiar contraseña',
        resetSubmitting: 'Guardando…',

        resetSuccessTitle: 'Contraseña cambiada',
        resetSuccessMsg: 'Ahora puedes iniciar sesión con tu nueva contraseña.',
        verifyTitle: 'Email verificado',
        verifySuccessMsg: 'Gracias - tu email ha sido verificado correctamente.',
        recoverTitle: 'Cambio de email deshecho',
        recoverSuccessMsg: (email) =>
            `La dirección ${email} ha sido restaurada. Recomendamos cambiar la contraseña de inmediato - tu cuenta podría estar comprometida.`,

        errorTitle: 'Enlace no válido',
        errorInvalid: 'El enlace está dañado o ya se ha usado. Solicita uno nuevo.',
        errorExpired: 'El enlace ha caducado. Solicita uno nuevo.',
        errorUserDisabled: 'Esta cuenta ha sido deshabilitada.',
        errorUserNotFound: 'Cuenta no encontrada - puede haber sido eliminada.',
        errorWeakPassword: 'La contraseña es demasiado débil. Mínimo 6 caracteres.',
        errorNetwork: 'Error de red - comprueba la conexión e inténtalo de nuevo.',
        errorUnknown: 'Algo salió mal. Inténtalo más tarde.',
        errorUnknownMode: 'Tipo de acción desconocido. Comprueba el enlace del email.',
        errorMissingCode: 'Faltan datos en el enlace. Ábrelo de nuevo desde el email.',

        toLogin: 'Iniciar sesión',
        toHome: 'Inicio',
    },

    CZ: {
        loadingTitle: 'Ověřování odkazu',
        loadingSub: 'Okamžik…',

        resetTitle: 'Nové heslo',
        resetSub: 'Pro účet',
        passwordLabel: 'Nové heslo',
        passwordPh: 'Minimálně 6 znaků',
        passwordErr: 'Heslo musí mít alespoň 6 znaků',
        confirmLabel: 'Potvrďte heslo',
        confirmPh: 'Zopakujte heslo',
        confirmErr: 'Hesla se neshodují',
        matchOk: '✓ Hesla se shodují',
        matchFail: '✗ Hesla se neshodují',
        strength: ['Velmi slabé', 'Slabé', 'Střední', 'Silné'],
        strengthHints: {
            tooShort: 'minimálně 6 znaků',
            noCase: 'přidejte velká písmena',
            noNumber: 'přidejte číslici',
            noSpecial: 'přidejte speciální znak',
            tooShort10: 'delší než 10 znaků je silnější',
            great: 'vynikající heslo!',
        },
        resetSubmit: 'Změnit heslo',
        resetSubmitting: 'Ukládání…',

        resetSuccessTitle: 'Heslo změněno',
        resetSuccessMsg: 'Nyní se můžete přihlásit s novým heslem.',
        verifyTitle: 'E-mail ověřen',
        verifySuccessMsg: 'Děkujeme - váš e-mail byl úspěšně ověřen.',
        recoverTitle: 'Změna e-mailu vrácena',
        recoverSuccessMsg: (email) =>
            `Adresa ${email} byla obnovena. Doporučujeme okamžitě změnit heslo - váš účet mohl být kompromitován.`,

        errorTitle: 'Odkaz je neplatný',
        errorInvalid: 'Odkaz je poškozen nebo již byl použit. Požádejte o nový.',
        errorExpired: 'Platnost odkazu vypršela. Požádejte o nový.',
        errorUserDisabled: 'Tento účet byl zablokován.',
        errorUserNotFound: 'Účet nenalezen - mohl být smazán.',
        errorWeakPassword: 'Heslo je příliš slabé. Minimálně 6 znaků.',
        errorNetwork: 'Chyba sítě - zkontrolujte připojení a zkuste znovu.',
        errorUnknown: 'Něco se pokazilo. Zkuste to později.',
        errorUnknownMode: 'Neznámý typ akce. Zkontrolujte odkaz z e-mailu.',
        errorMissingCode: 'V odkazu chybí data. Otevřete jej znovu z e-mailu.',

        toLogin: 'Přihlásit se',
        toHome: 'Na hlavní',
    },

    IT: {
        loadingTitle: 'Verifica del link',
        loadingSub: 'Un attimo…',

        resetTitle: 'Nuova password',
        resetSub: 'Per l\'account',
        passwordLabel: 'Nuova password',
        passwordPh: 'Almeno 6 caratteri',
        passwordErr: 'La password deve contenere almeno 6 caratteri',
        confirmLabel: 'Conferma password',
        confirmPh: 'Ripeti la password',
        confirmErr: 'Le password non coincidono',
        matchOk: '✓ Le password coincidono',
        matchFail: '✗ Le password non coincidono',
        strength: ['Molto debole', 'Debole', 'Media', 'Forte'],
        strengthHints: {
            tooShort: 'minimo 6 caratteri',
            noCase: 'aggiungi maiuscole',
            noNumber: 'aggiungi una cifra',
            noSpecial: 'aggiungi un carattere speciale',
            tooShort10: 'più di 10 caratteri è più sicuro',
            great: 'password eccellente!',
        },
        resetSubmit: 'Cambia password',
        resetSubmitting: 'Salvataggio…',

        resetSuccessTitle: 'Password cambiata',
        resetSuccessMsg: 'Ora puoi accedere con la nuova password.',
        verifyTitle: 'Email verificata',
        verifySuccessMsg: 'Grazie - la tua email è stata verificata.',
        recoverTitle: 'Modifica email annullata',
        recoverSuccessMsg: (email) =>
            `L'indirizzo ${email} è stato ripristinato. Consigliamo di cambiare subito la password - il tuo account potrebbe essere stato compromesso.`,

        errorTitle: 'Link non valido',
        errorInvalid: 'Il link è danneggiato o è già stato usato. Richiedine uno nuovo.',
        errorExpired: 'Il link è scaduto. Richiedine uno nuovo.',
        errorUserDisabled: 'Questo account è stato disattivato.',
        errorUserNotFound: 'Account non trovato - potrebbe essere stato eliminato.',
        errorWeakPassword: 'Password troppo debole. Minimo 6 caratteri.',
        errorNetwork: 'Errore di rete - controlla la connessione e riprova.',
        errorUnknown: 'Qualcosa è andato storto. Riprova più tardi.',
        errorUnknownMode: 'Tipo di azione sconosciuto. Controlla il link dall\'email.',
        errorMissingCode: 'Nel link mancano dei dati. Riaprilo dall\'email.',

        toLogin: 'Accedi',
        toHome: 'Home',
    },

    UA: {
        loadingTitle: 'Перевірка посилання',
        loadingSub: 'Зачекайте секунду…',

        resetTitle: 'Новий пароль',
        resetSub: 'Для акаунту',
        passwordLabel: 'Новий пароль',
        passwordPh: 'Мінімум 6 символів',
        passwordErr: 'Пароль має бути мінімум 6 символів',
        confirmLabel: 'Повторіть пароль',
        confirmPh: 'Повторіть пароль',
        confirmErr: 'Паролі не співпадають',
        matchOk: '✓ Паролі співпадають',
        matchFail: '✗ Паролі не співпадають',
        strength: ['Дуже слабкий', 'Слабкий', 'Середній', 'Надійний'],
        strengthHints: {
            tooShort: 'мінімум 6 символів',
            noCase: 'додайте великі літери',
            noNumber: 'додайте цифри',
            noSpecial: 'додайте спецсимволи',
            tooShort10: 'довше 10 символів - надійніше',
            great: 'відмінний пароль!',
        },
        resetSubmit: 'Змінити пароль',
        resetSubmitting: 'Збереження…',

        resetSuccessTitle: 'Пароль змінено',
        resetSuccessMsg: 'Тепер можна увійти з новим паролем.',
        verifyTitle: 'Email підтверджено',
        verifySuccessMsg: 'Дякуємо - ваш email успішно підтверджено.',
        recoverTitle: 'Зміну email скасовано',
        recoverSuccessMsg: (email) =>
            `Адресу ${email} відновлено. Рекомендуємо одразу змінити пароль - можливо, ваш акаунт було скомпрометовано.`,

        errorTitle: 'Посилання недійсне',
        errorInvalid: 'Посилання пошкоджено або вже було використано. Запросіть нове.',
        errorExpired: 'Термін дії посилання закінчився. Запросіть нове.',
        errorUserDisabled: 'Цей акаунт заблоковано.',
        errorUserNotFound: 'Акаунт не знайдено - можливо, його було видалено.',
        errorWeakPassword: 'Пароль занадто простий. Мінімум 6 символів.',
        errorNetwork: 'Помилка мережі - перевірте підключення і спробуйте знову.',
        errorUnknown: 'Щось пішло не так. Спробуйте пізніше.',
        errorUnknownMode: 'Невідомий тип дії. Перевірте посилання з листа.',
        errorMissingCode: 'У посиланні не вистачає даних. Відкрийте його знову з листа.',

        toLogin: 'Увійти в гру',
        toHome: 'На головну',
    },
};
