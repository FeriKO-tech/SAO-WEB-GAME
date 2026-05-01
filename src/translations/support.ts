/**
 * Support page translations (all 8 locales).
 *
 * Migrated verbatim from the inline dictionary in `support.html`. Contains:
 *   - Page chrome (title / subtitle / section titles)
 *   - Quick-contact card labels
 *   - FAQ: an **array of Q&A pairs**, rendered to an accordion at runtime.
 *     The `a` field may contain inline HTML (`<a href="...">`) on purpose -
 *     rendered via innerHTML, so links are preserved.
 *   - Contact form labels, select options, validation messages, toasts.
 *   - Attachment validator functions: `attachTooBig(name)` and
 *     `attachBadType(name)` return localised error strings.
 *
 * Keeping this file large but flat keeps the runtime fast (single fetch,
 * zero dynamic imports). If we ever cross 500 kB the FAQ array can be
 * split into `support-faq.{lang}.ts` and code-split later.
 */

import type { LanguageMap } from '@models/i18n';

export interface FaqItem {
    q: string;
    /** Allowed inline HTML: `<a href="...">...</a>`. */
    a: string;
}

export interface SupportDict {
    title: string;
    subtitle: string;

    // Quick contact
    quickTitle: string;
    quickDesc: string;
    quickEmail: string;
    quickEmailDesc: string;
    quickDiscord: string;
    quickDiscordDesc: string;
    quickFaq: string;
    quickFaqDesc: string;
    quickFaqLink: string;

    // FAQ
    faqTitle: string;
    faqDesc: string;
    faq: FaqItem[];

    // Form
    formTitle: string;
    formDesc: string;
    formName: string;
    formEmail: string;
    formCategory: string;
    catAccount: string;
    catBug: string;
    catPayment: string;
    catTech: string;
    catOther: string;
    formSubject: string;
    formMessage: string;
    formMessageHint: string;
    formSubmit: string;
    formSubmitting: string;

    // Attachments
    formAttach: string;
    attachText: string;
    attachBrowse: string;
    attachHint: string;
    attachTooBig: (filename: string) => string;
    attachBadType: (filename: string) => string;
    attachTooMany: string;

    // Form validation messages
    nameEmpty: string;
    emailBad: string;
    subjectEmpty: string;
    subjectShort: string;
    messageEmpty: string;
    messageShort: string;

    successMsg: string;
    ticketErrNetwork: string;
    ticketErrGeneric: string;
}

export const supportTranslations: LanguageMap<SupportDict> = {
    RU: {
        title: 'Поддержка',
        subtitle:
            'Мы здесь, чтобы помочь. Найдите ответ в FAQ, свяжитесь с нами напрямую или отправьте обращение через форму ниже.',

        quickTitle: 'Быстрая связь',
        quickDesc: 'Выберите удобный способ связи.',
        quickEmail: 'Email',
        quickEmailDesc: 'Ответим в течение 24 часов',
        quickDiscord: 'Discord',
        quickDiscordDesc: 'Живое сообщество и поддержка',
        quickFaq: 'База знаний',
        quickFaqDesc: 'Ответы на популярные вопросы',
        quickFaqLink: 'Перейти к FAQ',

        faqTitle: 'Частые вопросы',
        faqDesc: 'Возможно, ответ на ваш вопрос уже здесь.',
        faq: [
            { q: 'Как сбросить пароль?', a: 'На странице входа нажмите «Забыли пароль?» и введите email, указанный при регистрации. Мы отправим ссылку для сброса. Если вошли через Google - управляйте паролем в настройках своего Google-аккаунта.' },
            { q: 'Можно ли изменить логин и email после регистрации?', a: 'Да. Перейдите в <a href="settings.html">Настройки → Профиль</a> и отредактируйте нужные поля. Логин должен быть от 3 до 20 символов и не должен совпадать с уже существующим. Email должен быть корректным и свободным.' },
            { q: 'Как удалить аккаунт?', a: 'В <a href="settings.html">Настройках → Аккаунт</a> есть раздел «Опасная зона». Нажмите «Удалить аккаунт», введите свой логин для подтверждения - действие необратимо, весь прогресс и покупки будут потеряны.' },
            { q: 'Поддерживаются ли мобильные устройства?', a: 'Да. Сайт и игра адаптированы под смартфоны и планшеты. Рекомендуем браузеры: Chrome, Safari, Firefox, Edge - последних версий. На старых устройствах отключите анимации в Настройки → Предпочтения для повышения производительности.' },
            { q: 'Я вошёл через Google - что делать с паролем?', a: 'При авторизации через Google пароль к нашему сайту не создаётся. Вход возможен только через Google. Чтобы изменить пароль к Google-аккаунту, перейдите в <a href="https://myaccount.google.com/security" target="_blank" rel="noopener">настройки безопасности Google</a>.' },
            { q: 'Как сообщить об ошибке в игре?', a: 'Отправьте обращение через форму ниже с категорией «Баг / Ошибка». Укажите: что делали, что ожидали, что произошло, браузер и ОС, приложите скриншот или видео если возможно. Это ускорит разбор.' },
            { q: 'Можно ли играть на нескольких устройствах?', a: 'Да. Ваш прогресс привязан к аккаунту и синхронизируется между устройствами. Просто войдите под одним логином с любого браузера. Одновременные игровые сессии с одного аккаунта не допускаются - более старая будет разлогинена.' },
            { q: 'Я оплатил донат, но не получил награду - что делать?', a: 'Обычно покупки зачисляются мгновенно. Если через 15 минут ничего не пришло - отправьте обращение с категорией «Оплата / Донаты», приложив скриншот или ID транзакции. Мы вернём средства или выдадим покупку вручную.' },
        ],

        formTitle: 'Форма обращения',
        formDesc: 'Опишите проблему подробно, и мы обязательно поможем.',
        formName: 'Ваше имя',
        formEmail: 'Email для ответа',
        formCategory: 'Категория',
        catAccount: 'Аккаунт',
        catBug: 'Баг / Ошибка',
        catPayment: 'Оплата / Донаты',
        catTech: 'Технические проблемы',
        catOther: 'Другое',
        formSubject: 'Тема обращения',
        formMessage: 'Сообщение',
        formMessageHint: 'Минимум 20 символов. Опишите шаги воспроизведения, браузер, время события.',
        formSubmit: 'Отправить обращение',
        formSubmitting: 'Отправка...',

        formAttach: 'Прикрепить файлы',
        attachText: 'Перетащите файлы сюда или ',
        attachBrowse: 'выберите',
        attachHint: 'PNG, JPG, PDF, TXT, LOG · MP4, WEBM, MOV · до 5 МБ (фото/док) и 20 МБ (видео) · максимум 5 файлов',
        attachTooBig: (n) => `✗ Файл "${n}" слишком большой (до 5 МБ для фото/док., 20 МБ для видео)`,
        attachBadType: (n) => `✗ Формат файла "${n}" не поддерживается`,
        attachTooMany: '✗ Максимум 5 файлов',

        nameEmpty: '✗ Укажите имя',
        emailBad: '✗ Некорректный email',
        subjectEmpty: '✗ Укажите тему',
        subjectShort: '✗ Тема слишком короткая (минимум 3 символа)',
        messageEmpty: '✗ Напишите сообщение',
        messageShort: '✗ Сообщение слишком короткое (минимум 20 символов)',

        successMsg: '✓ Обращение отправлено! Мы ответим в течение 24 часов.',
        ticketErrNetwork: 'Сеть недоступна. Попробуйте ещё раз через минуту.',
        ticketErrGeneric: 'Не удалось отправить обращение. Проверьте данные и попробуйте снова.',
    },

    EN: {
        title: 'Support',
        subtitle:
            'We are here to help. Find your answer in the FAQ, contact us directly, or submit a ticket using the form below.',

        quickTitle: 'Quick contact',
        quickDesc: 'Choose a convenient way to reach us.',
        quickEmail: 'Email',
        quickEmailDesc: 'We respond within 24 hours',
        quickDiscord: 'Discord',
        quickDiscordDesc: 'Active community and support',
        quickFaq: 'Knowledge base',
        quickFaqDesc: 'Answers to popular questions',
        quickFaqLink: 'Go to FAQ',

        faqTitle: 'Frequently asked questions',
        faqDesc: 'Your answer might already be here.',
        faq: [
            { q: 'How do I reset my password?', a: 'On the login page click "Forgot password?" and enter the email you used to register. We will send you a reset link. If you signed in via Google - manage your password in your Google account settings.' },
            { q: 'Can I change my username and email after registration?', a: 'Yes. Go to <a href="settings.html">Settings → Profile</a> and edit the fields. Username must be 3–20 characters and unique. Email must be valid and not already taken.' },
            { q: 'How do I delete my account?', a: 'In <a href="settings.html">Settings → Account</a> there is a "Danger zone" section. Click "Delete account", type your username to confirm - the action is irreversible, all progress and purchases will be lost.' },
            { q: 'Are mobile devices supported?', a: 'Yes. The site and game are adapted for phones and tablets. Recommended browsers: Chrome, Safari, Firefox, Edge - latest versions. On older devices disable animations in Settings → Preferences to improve performance.' },
            { q: 'I signed in with Google - what about the password?', a: 'When signing in with Google, no separate password is created on our site. You can only log in via Google. To change your Google password, go to <a href="https://myaccount.google.com/security" target="_blank" rel="noopener">Google security settings</a>.' },
            { q: 'How do I report a bug?', a: 'Submit a ticket via the form below with the "Bug / Error" category. Include: what you did, what you expected, what happened, browser and OS, attach screenshots or video if possible. This speeds up investigation.' },
            { q: 'Can I play on multiple devices?', a: 'Yes. Your progress is tied to your account and syncs between devices. Just log in with the same credentials from any browser. Simultaneous game sessions from one account are not allowed - the older one will be logged out.' },
            { q: 'I paid for a donation but did not get the reward - what should I do?', a: 'Purchases are usually credited instantly. If nothing arrived within 15 minutes - submit a ticket with category "Payment / Donations", attach a screenshot or transaction ID. We will refund or grant the purchase manually.' },
        ],

        formTitle: 'Contact form',
        formDesc: 'Describe the problem in detail and we will help.',
        formName: 'Your name',
        formEmail: 'Reply email',
        formCategory: 'Category',
        catAccount: 'Account',
        catBug: 'Bug / Error',
        catPayment: 'Payment / Donations',
        catTech: 'Technical issues',
        catOther: 'Other',
        formSubject: 'Subject',
        formMessage: 'Message',
        formMessageHint: 'Minimum 20 characters. Describe steps to reproduce, browser, time of event.',
        formSubmit: 'Submit ticket',
        formSubmitting: 'Sending...',

        formAttach: 'Attach files',
        attachText: 'Drag files here or ',
        attachBrowse: 'browse',
        attachHint: 'PNG, JPG, PDF, TXT, LOG · MP4, WEBM, MOV · up to 5 MB (images/docs) and 20 MB (video) · max 5 files',
        attachTooBig: (n) => `✗ File "${n}" is too large (5 MB for images/docs, 20 MB for video)`,
        attachBadType: (n) => `✗ File format "${n}" is not supported`,
        attachTooMany: '✗ Maximum 5 files',

        nameEmpty: '✗ Enter your name',
        emailBad: '✗ Invalid email',
        subjectEmpty: '✗ Enter a subject',
        subjectShort: '✗ Subject is too short (minimum 3 characters)',
        messageEmpty: '✗ Write a message',
        messageShort: '✗ Message is too short (minimum 20 characters)',

        successMsg: '✓ Ticket submitted! We will respond within 24 hours.',
        ticketErrNetwork: 'Network is unavailable. Please try again in a minute.',
        ticketErrGeneric: 'Could not submit the ticket. Please double-check and try again.',
    },

    DE: {
        title: 'Support',
        subtitle:
            'Wir helfen Ihnen gerne. Finden Sie eine Antwort in der FAQ, kontaktieren Sie uns direkt oder senden Sie über das Formular unten eine Anfrage.',

        quickTitle: 'Schneller Kontakt',
        quickDesc: 'Wählen Sie einen bequemen Kontaktweg.',
        quickEmail: 'Email',
        quickEmailDesc: 'Antwort innerhalb von 24 Stunden',
        quickDiscord: 'Discord',
        quickDiscordDesc: 'Aktive Community und Support',
        quickFaq: 'Wissensdatenbank',
        quickFaqDesc: 'Antworten auf häufige Fragen',
        quickFaqLink: 'Zur FAQ',

        faqTitle: 'Häufig gestellte Fragen',
        faqDesc: 'Vielleicht finden Sie die Antwort bereits hier.',
        faq: [
            { q: 'Wie setze ich mein Passwort zurück?', a: 'Klicken Sie auf der Anmeldeseite auf "Passwort vergessen?" und geben Sie Ihre Email ein. Wir senden einen Link zum Zurücksetzen. Wenn Sie sich mit Google angemeldet haben - verwalten Sie das Passwort in den Google-Einstellungen.' },
            { q: 'Kann ich Benutzernamen und Email nach der Registrierung ändern?', a: 'Ja. Gehen Sie zu <a href="settings.html">Einstellungen → Profil</a> und bearbeiten Sie die Felder. Benutzername: 3–20 Zeichen, einzigartig. Email: gültig und nicht vergeben.' },
            { q: 'Wie lösche ich mein Konto?', a: 'In <a href="settings.html">Einstellungen → Konto</a> gibt es den Bereich "Gefahrenzone". Klicken Sie auf "Konto löschen", geben Sie zur Bestätigung Ihren Benutzernamen ein - die Aktion ist unumkehrbar.' },
            { q: 'Werden mobile Geräte unterstützt?', a: 'Ja. Seite und Spiel sind für Smartphones und Tablets optimiert. Empfohlene Browser: Chrome, Safari, Firefox, Edge - neueste Versionen. Auf älteren Geräten deaktivieren Sie Animationen in Einstellungen → Präferenzen.' },
            { q: 'Ich habe mich mit Google angemeldet - was ist mit dem Passwort?', a: 'Bei Google-Anmeldung wird kein separates Passwort erstellt. Anmeldung erfolgt nur über Google. Passwort für Google-Konto ändern Sie in den <a href="https://myaccount.google.com/security" target="_blank" rel="noopener">Google-Sicherheitseinstellungen</a>.' },
            { q: 'Wie melde ich einen Fehler?', a: 'Senden Sie das Formular unten mit Kategorie "Bug / Fehler". Geben Sie an: was Sie getan haben, was erwartet wurde, was passierte, Browser und OS, mit Screenshot oder Video.' },
            { q: 'Kann ich auf mehreren Geräten spielen?', a: 'Ja. Der Fortschritt ist an das Konto gebunden und synchronisiert zwischen Geräten. Melden Sie sich einfach mit denselben Zugangsdaten an. Gleichzeitige Spielsitzungen mit einem Konto sind nicht erlaubt.' },
            { q: 'Ich habe bezahlt, aber keine Belohnung erhalten - was tun?', a: 'Käufe werden normalerweise sofort gutgeschrieben. Wenn nach 15 Minuten nichts kommt - senden Sie eine Anfrage mit Kategorie "Zahlung / Spenden" und fügen Sie Screenshot oder Transaktions-ID bei.' },
        ],

        formTitle: 'Kontaktformular',
        formDesc: 'Beschreiben Sie das Problem ausführlich, wir helfen Ihnen.',
        formName: 'Ihr Name',
        formEmail: 'Antwort-Email',
        formCategory: 'Kategorie',
        catAccount: 'Konto',
        catBug: 'Bug / Fehler',
        catPayment: 'Zahlung / Spenden',
        catTech: 'Technische Probleme',
        catOther: 'Andere',
        formSubject: 'Betreff',
        formMessage: 'Nachricht',
        formMessageHint: 'Mindestens 20 Zeichen. Beschreiben Sie Schritte zur Reproduktion, Browser, Zeitpunkt.',
        formSubmit: 'Anfrage senden',
        formSubmitting: 'Wird gesendet...',

        formAttach: 'Dateien anhängen',
        attachText: 'Dateien hierher ziehen oder ',
        attachBrowse: 'auswählen',
        attachHint: 'PNG, JPG, PDF, TXT, LOG · MP4, WEBM, MOV · bis 5 MB (Bilder/Dok.) und 20 MB (Video) · max. 5 Dateien',
        attachTooBig: (n) => `✗ Datei "${n}" ist zu groß (max. 5 MB für Bilder/Dok., 20 MB für Video)`,
        attachBadType: (n) => `✗ Dateiformat "${n}" wird nicht unterstützt`,
        attachTooMany: '✗ Maximal 5 Dateien',

        nameEmpty: '✗ Geben Sie Ihren Namen ein',
        emailBad: '✗ Ungültige Email',
        subjectEmpty: '✗ Geben Sie einen Betreff ein',
        subjectShort: '✗ Betreff zu kurz (mindestens 3 Zeichen)',
        messageEmpty: '✗ Schreiben Sie eine Nachricht',
        messageShort: '✗ Nachricht zu kurz (mindestens 20 Zeichen)',

        successMsg: '✓ Anfrage gesendet! Wir antworten innerhalb von 24 Stunden.',
        ticketErrNetwork: 'Netzwerk nicht verfügbar. Bitte versuchen Sie es in einer Minute erneut.',
        ticketErrGeneric: 'Anfrage konnte nicht gesendet werden. Bitte prüfen Sie die Daten und versuchen Sie es erneut.',
    },

    FR: {
        title: 'Support',
        subtitle:
            'Nous sommes là pour vous aider. Trouvez une réponse dans la FAQ, contactez-nous directement ou envoyez une demande via le formulaire ci-dessous.',

        quickTitle: 'Contact rapide',
        quickDesc: 'Choisissez un moyen de contact pratique.',
        quickEmail: 'Email',
        quickEmailDesc: 'Réponse sous 24 heures',
        quickDiscord: 'Discord',
        quickDiscordDesc: 'Communauté active et support',
        quickFaq: 'Base de connaissances',
        quickFaqDesc: 'Réponses aux questions fréquentes',
        quickFaqLink: 'Aller à la FAQ',

        faqTitle: 'Questions fréquentes',
        faqDesc: 'La réponse à votre question est peut-être déjà ici.',
        faq: [
            { q: 'Comment réinitialiser mon mot de passe ?', a: "Sur la page de connexion cliquez sur « Mot de passe oublié ? » et entrez votre email. Nous enverrons un lien de réinitialisation. Si vous vous êtes connecté via Google - gérez le mot de passe dans les paramètres Google." },
            { q: "Puis-je changer mon nom d'utilisateur et email après inscription ?", a: 'Oui. Allez dans <a href="settings.html">Paramètres → Profil</a> et modifiez les champs. Nom : 3–20 caractères, unique. Email : valide et non pris.' },
            { q: 'Comment supprimer mon compte ?', a: 'Dans <a href="settings.html">Paramètres → Compte</a> il y a la « Zone de danger ». Cliquez sur « Supprimer le compte », tapez votre nom pour confirmer - action irréversible.' },
            { q: 'Les appareils mobiles sont-ils pris en charge ?', a: 'Oui. Le site et le jeu sont adaptés aux smartphones et tablettes. Navigateurs recommandés : Chrome, Safari, Firefox, Edge - dernières versions. Sur les anciens appareils désactivez les animations dans Paramètres → Préférences.' },
            { q: "Je me suis connecté avec Google - et le mot de passe ?", a: 'Lors de la connexion Google, aucun mot de passe séparé n\'est créé. Connexion uniquement via Google. Pour changer le mot de passe Google, allez dans les <a href="https://myaccount.google.com/security" target="_blank" rel="noopener">paramètres de sécurité Google</a>.' },
            { q: 'Comment signaler un bug ?', a: 'Envoyez une demande avec la catégorie « Bug / Erreur ». Indiquez : ce que vous avez fait, ce qui était attendu, ce qui s\'est passé, navigateur et OS, joignez des captures.' },
            { q: 'Puis-je jouer sur plusieurs appareils ?', a: "Oui. La progression est liée au compte et se synchronise entre les appareils. Connectez-vous simplement avec les mêmes identifiants. Les sessions simultanées d'un même compte ne sont pas autorisées." },
            { q: "J'ai payé mais pas reçu la récompense - que faire ?", a: 'Les achats sont généralement crédités instantanément. Si rien n\'arrive après 15 minutes - envoyez une demande catégorie « Paiement / Dons » avec capture ou ID de transaction.' },
        ],

        formTitle: 'Formulaire de contact',
        formDesc: 'Décrivez le problème en détail et nous vous aiderons.',
        formName: 'Votre nom',
        formEmail: 'Email de réponse',
        formCategory: 'Catégorie',
        catAccount: 'Compte',
        catBug: 'Bug / Erreur',
        catPayment: 'Paiement / Dons',
        catTech: 'Problèmes techniques',
        catOther: 'Autre',
        formSubject: 'Sujet',
        formMessage: 'Message',
        formMessageHint: "Minimum 20 caractères. Décrivez les étapes, navigateur, heure de l'événement.",
        formSubmit: 'Envoyer la demande',
        formSubmitting: 'Envoi...',

        formAttach: 'Joindre des fichiers',
        attachText: 'Glissez les fichiers ici ou ',
        attachBrowse: 'parcourir',
        attachHint: 'PNG, JPG, PDF, TXT, LOG · MP4, WEBM, MOV · jusqu’à 5 Mo (images/docs) et 20 Mo (vidéo) · max 5 fichiers',
        attachTooBig: (n) => `✗ Le fichier « ${n} » est trop volumineux (5 Mo pour images/docs, 20 Mo pour vidéo)`,
        attachBadType: (n) => `✗ Le format du fichier « ${n} » n’est pas supporté`,
        attachTooMany: '✗ Maximum 5 fichiers',

        nameEmpty: '✗ Entrez votre nom',
        emailBad: '✗ Email invalide',
        subjectEmpty: '✗ Entrez un sujet',
        subjectShort: '✗ Sujet trop court (minimum 3 caractères)',
        messageEmpty: '✗ Écrivez un message',
        messageShort: '✗ Message trop court (minimum 20 caractères)',

        successMsg: '✓ Demande envoyée ! Nous répondrons sous 24 heures.',
        ticketErrNetwork: 'Réseau indisponible. Veuillez réessayer dans une minute.',
        ticketErrGeneric: "Impossible d'envoyer la demande. Vérifiez les données et réessayez.",
    },

    PL: {
        title: 'Wsparcie',
        subtitle:
            'Jesteśmy tu, aby pomóc. Znajdź odpowiedź w FAQ, skontaktuj się z nami bezpośrednio lub wyślij zgłoszenie poprzez formularz poniżej.',

        quickTitle: 'Szybki kontakt',
        quickDesc: 'Wybierz wygodny sposób kontaktu.',
        quickEmail: 'Email',
        quickEmailDesc: 'Odpowiedź w ciągu 24 godzin',
        quickDiscord: 'Discord',
        quickDiscordDesc: 'Aktywna społeczność i wsparcie',
        quickFaq: 'Baza wiedzy',
        quickFaqDesc: 'Odpowiedzi na popularne pytania',
        quickFaqLink: 'Przejdź do FAQ',

        faqTitle: 'Często zadawane pytania',
        faqDesc: 'Być może odpowiedź już tutaj jest.',
        faq: [
            { q: 'Jak zresetować hasło?', a: 'Na stronie logowania kliknij „Zapomniałeś hasła?" i wpisz swój email. Wyślemy link do resetu. Jeśli logowałeś się przez Google - zarządzaj hasłem w ustawieniach konta Google.' },
            { q: 'Czy mogę zmienić login i email po rejestracji?', a: 'Tak. Przejdź do <a href="settings.html">Ustawienia → Profil</a> i edytuj pola. Login: 3–20 znaków, unikalny. Email: poprawny i nie zajęty.' },
            { q: 'Jak usunąć konto?', a: 'W <a href="settings.html">Ustawienia → Konto</a> jest sekcja „Strefa niebezpieczna". Kliknij „Usuń konto", wpisz swój login - akcja nieodwracalna.' },
            { q: 'Czy obsługiwane są urządzenia mobilne?', a: 'Tak. Strona i gra są zoptymalizowane pod smartfony i tablety. Zalecane przeglądarki: Chrome, Safari, Firefox, Edge - najnowsze wersje. Na starszych urządzeniach wyłącz animacje w Ustawienia → Preferencje.' },
            { q: 'Zalogowałem się przez Google - co z hasłem?', a: 'Przy logowaniu Google nie tworzymy osobnego hasła. Logowanie tylko przez Google. Aby zmienić hasło Google, przejdź do <a href="https://myaccount.google.com/security" target="_blank" rel="noopener">ustawień bezpieczeństwa Google</a>.' },
            { q: 'Jak zgłosić błąd?', a: 'Wyślij zgłoszenie poprzez formularz z kategorią „Błąd / Bug". Podaj: co robiłeś, czego oczekiwałeś, co się stało, przeglądarkę i OS, dołącz zrzut ekranu lub wideo.' },
            { q: 'Czy mogę grać na wielu urządzeniach?', a: 'Tak. Postęp jest powiązany z kontem i synchronizowany między urządzeniami. Wystarczy zalogować się tymi samymi danymi. Jednoczesne sesje z jednego konta nie są dozwolone.' },
            { q: 'Zapłaciłem za donat, ale nie dostałem nagrody - co robić?', a: 'Zakupy są zazwyczaj zaliczane natychmiast. Jeśli po 15 minutach nic nie przyszło - wyślij zgłoszenie kategoria „Płatność / Donaty" z zrzutem lub ID transakcji.' },
        ],

        formTitle: 'Formularz kontaktowy',
        formDesc: 'Opisz problem szczegółowo, a na pewno pomożemy.',
        formName: 'Twoje imię',
        formEmail: 'Email do odpowiedzi',
        formCategory: 'Kategoria',
        catAccount: 'Konto',
        catBug: 'Błąd / Bug',
        catPayment: 'Płatność / Donaty',
        catTech: 'Problemy techniczne',
        catOther: 'Inne',
        formSubject: 'Temat',
        formMessage: 'Wiadomość',
        formMessageHint: 'Minimum 20 znaków. Opisz kroki reprodukcji, przeglądarkę, czas zdarzenia.',
        formSubmit: 'Wyślij zgłoszenie',
        formSubmitting: 'Wysyłanie...',

        formAttach: 'Załącz pliki',
        attachText: 'Przeciągnij pliki tutaj lub ',
        attachBrowse: 'wybierz',
        attachHint: 'PNG, JPG, PDF, TXT, LOG · MP4, WEBM, MOV · do 5 MB (obrazy/dok.) i 20 MB (wideo) · maksymalnie 5 plików',
        attachTooBig: (n) => `✗ Plik „${n}” jest za duży (5 MB dla obrazów/dok., 20 MB dla wideo)`,
        attachBadType: (n) => `✗ Format pliku „${n}” nie jest obsługiwany`,
        attachTooMany: '✗ Maksymalnie 5 plików',

        nameEmpty: '✗ Podaj imię',
        emailBad: '✗ Nieprawidłowy email',
        subjectEmpty: '✗ Podaj temat',
        subjectShort: '✗ Temat zbyt krótki (minimum 3 znaki)',
        messageEmpty: '✗ Napisz wiadomość',
        messageShort: '✗ Wiadomość zbyt krótka (minimum 20 znaków)',

        successMsg: '✓ Zgłoszenie wysłane! Odpowiemy w ciągu 24 godzin.',
        ticketErrNetwork: 'Sieć niedostępna. Spróbuj ponownie za minutę.',
        ticketErrGeneric: 'Nie udało się wysłać zgłoszenia. Sprawdź dane i spróbuj ponownie.',
    },

    ES: {
        title: 'Soporte',
        subtitle:
            'Estamos aquí para ayudar. Encuentre su respuesta en las FAQ, contáctenos directamente o envíe un ticket usando el formulario.',

        quickTitle: 'Contacto rápido',
        quickDesc: 'Elija un método cómodo para contactarnos.',
        quickEmail: 'Email',
        quickEmailDesc: 'Respuesta en 24 horas',
        quickDiscord: 'Discord',
        quickDiscordDesc: 'Comunidad activa y soporte',
        quickFaq: 'Base de conocimiento',
        quickFaqDesc: 'Respuestas a preguntas populares',
        quickFaqLink: 'Ir a FAQ',

        faqTitle: 'Preguntas frecuentes',
        faqDesc: 'Puede que su respuesta ya esté aquí.',
        faq: [
            { q: '¿Cómo restablezco mi contraseña?', a: 'En la página de inicio haga clic en «¿Olvidó la contraseña?» e ingrese su email. Enviaremos un enlace. Si inició sesión con Google - gestione la contraseña en la configuración de Google.' },
            { q: '¿Puedo cambiar mi usuario y email tras registrarme?', a: 'Sí. Vaya a <a href="settings.html">Configuración → Perfil</a> y edite. Usuario: 3–20 caracteres, único. Email: válido y no usado.' },
            { q: '¿Cómo elimino mi cuenta?', a: 'En <a href="settings.html">Configuración → Cuenta</a> hay «Zona de peligro». Haga clic en «Eliminar cuenta», escriba su usuario para confirmar - acción irreversible.' },
            { q: '¿Los dispositivos móviles son compatibles?', a: 'Sí. El sitio y el juego están adaptados a móviles y tablets. Navegadores recomendados: Chrome, Safari, Firefox, Edge - últimas versiones. En dispositivos antiguos desactive animaciones en Configuración → Preferencias.' },
            { q: 'Inicié sesión con Google - ¿y la contraseña?', a: 'Al iniciar sesión con Google no se crea contraseña separada. Acceso solo vía Google. Para cambiar la contraseña de Google, vaya a la <a href="https://myaccount.google.com/security" target="_blank" rel="noopener">configuración de seguridad de Google</a>.' },
            { q: '¿Cómo reporto un error?', a: 'Envíe un ticket con categoría «Bug / Error». Indique: qué hizo, qué esperaba, qué pasó, navegador y SO, adjunte capturas o video.' },
            { q: '¿Puedo jugar en varios dispositivos?', a: 'Sí. El progreso está ligado a la cuenta y se sincroniza entre dispositivos. Simplemente inicie sesión con las mismas credenciales. Sesiones simultáneas de una cuenta no están permitidas.' },
            { q: 'Pagué una donación pero no recibí la recompensa - ¿qué hago?', a: 'Las compras se acreditan normalmente al instante. Si tras 15 minutos no llega nada - envíe ticket categoría «Pago / Donaciones» con captura o ID de transacción.' },
        ],

        formTitle: 'Formulario de contacto',
        formDesc: 'Describa el problema con detalle y le ayudaremos.',
        formName: 'Su nombre',
        formEmail: 'Email de respuesta',
        formCategory: 'Categoría',
        catAccount: 'Cuenta',
        catBug: 'Bug / Error',
        catPayment: 'Pago / Donaciones',
        catTech: 'Problemas técnicos',
        catOther: 'Otro',
        formSubject: 'Asunto',
        formMessage: 'Mensaje',
        formMessageHint: 'Mínimo 20 caracteres. Describa pasos, navegador, hora del evento.',
        formSubmit: 'Enviar ticket',
        formSubmitting: 'Enviando...',

        formAttach: 'Adjuntar archivos',
        attachText: 'Arrastra los archivos aquí o ',
        attachBrowse: 'selecciona',
        attachHint: 'PNG, JPG, PDF, TXT, LOG · MP4, WEBM, MOV · hasta 5 MB (imágenes/doc.) y 20 MB (video) · máximo 5 archivos',
        attachTooBig: (n) => `✗ El archivo «${n}» es demasiado grande (5 MB para imágenes/doc., 20 MB para video)`,
        attachBadType: (n) => `✗ El formato del archivo «${n}» no es compatible`,
        attachTooMany: '✗ Máximo 5 archivos',

        nameEmpty: '✗ Ingrese su nombre',
        emailBad: '✗ Email inválido',
        subjectEmpty: '✗ Ingrese un asunto',
        subjectShort: '✗ Asunto muy corto (mínimo 3 caracteres)',
        messageEmpty: '✗ Escriba un mensaje',
        messageShort: '✗ Mensaje muy corto (mínimo 20 caracteres)',

        successMsg: '✓ ¡Ticket enviado! Responderemos en 24 horas.',
        ticketErrNetwork: 'Sin conexión. Inténtalo de nuevo en un minuto.',
        ticketErrGeneric: 'No se pudo enviar el ticket. Revisa los datos e inténtalo de nuevo.',
    },

    CZ: {
        title: 'Podpora',
        subtitle:
            'Jsme tu, abychom vám pomohli. Najděte odpověď v FAQ, kontaktujte nás přímo nebo pošlete dotaz přes formulář.',

        quickTitle: 'Rychlý kontakt',
        quickDesc: 'Zvolte pohodlný způsob kontaktu.',
        quickEmail: 'Email',
        quickEmailDesc: 'Odpověď do 24 hodin',
        quickDiscord: 'Discord',
        quickDiscordDesc: 'Aktivní komunita a podpora',
        quickFaq: 'Znalostní báze',
        quickFaqDesc: 'Odpovědi na časté otázky',
        quickFaqLink: 'Přejít na FAQ',

        faqTitle: 'Časté otázky',
        faqDesc: 'Možná je odpověď již zde.',
        faq: [
            { q: 'Jak resetovat heslo?', a: 'Na přihlašovací stránce klikněte na „Zapomněli jste heslo?" a zadejte email. Pošleme odkaz pro reset. Pokud jste se přihlásili přes Google - spravujte heslo v nastavení Google účtu.' },
            { q: 'Mohu změnit uživatelské jméno a email po registraci?', a: 'Ano. Jděte do <a href="settings.html">Nastavení → Profil</a> a upravte pole. Jméno: 3–20 znaků, unikátní. Email: platný a neobsazený.' },
            { q: 'Jak smazat účet?', a: 'V <a href="settings.html">Nastavení → Účet</a> je sekce „Nebezpečná zóna". Klikněte na „Smazat účet", zadejte své jméno - akce nevratná.' },
            { q: 'Jsou podporovány mobilní zařízení?', a: 'Ano. Stránka a hra jsou přizpůsobeny pro mobily a tablety. Doporučené prohlížeče: Chrome, Safari, Firefox, Edge - nejnovější verze. Na starších zařízeních vypněte animace v Nastavení → Preference.' },
            { q: 'Přihlásil jsem se přes Google - co s heslem?', a: 'Při přihlášení Google se nevytváří samostatné heslo. Přihlášení pouze přes Google. Heslo Google změníte v <a href="https://myaccount.google.com/security" target="_blank" rel="noopener">nastavení zabezpečení Google</a>.' },
            { q: 'Jak nahlásit chybu?', a: 'Pošlete dotaz s kategorií „Bug / Chyba". Uveďte: co jste dělali, co se očekávalo, co se stalo, prohlížeč a OS, přiložte screenshoty nebo video.' },
            { q: 'Mohu hrát na více zařízeních?', a: 'Ano. Postup je vázán na účet a synchronizuje se mezi zařízeními. Jednoduše se přihlaste stejnými údaji. Souběžné herní relace z jednoho účtu nejsou povoleny.' },
            { q: 'Zaplatil jsem donat, ale nedostal odměnu - co dělat?', a: 'Nákupy jsou obvykle připsány okamžitě. Pokud do 15 minut nic nepřišlo - pošlete dotaz kategorie „Platba / Donaty" se screenshotem nebo ID transakce.' },
        ],

        formTitle: 'Kontaktní formulář',
        formDesc: 'Popište problém podrobně a pomůžeme vám.',
        formName: 'Vaše jméno',
        formEmail: 'Email pro odpověď',
        formCategory: 'Kategorie',
        catAccount: 'Účet',
        catBug: 'Bug / Chyba',
        catPayment: 'Platba / Donaty',
        catTech: 'Technické problémy',
        catOther: 'Jiné',
        formSubject: 'Předmět',
        formMessage: 'Zpráva',
        formMessageHint: 'Minimálně 20 znaků. Popište kroky reprodukce, prohlížeč, čas události.',
        formSubmit: 'Odeslat dotaz',
        formSubmitting: 'Odesílání...',

        formAttach: 'Přiložit soubory',
        attachText: 'Přetáhněte soubory sem nebo ',
        attachBrowse: 'vyberte',
        attachHint: 'PNG, JPG, PDF, TXT, LOG · MP4, WEBM, MOV · do 5 MB (obr./dok.) a 20 MB (video) · maximálně 5 souborů',
        attachTooBig: (n) => `✗ Soubor „${n}“ je příliš velký (5 MB pro obr./dok., 20 MB pro video)`,
        attachBadType: (n) => `✗ Formát souboru „${n}“ není podporován`,
        attachTooMany: '✗ Maximálně 5 souborů',

        nameEmpty: '✗ Zadejte jméno',
        emailBad: '✗ Neplatný email',
        subjectEmpty: '✗ Zadejte předmět',
        subjectShort: '✗ Předmět je příliš krátký (minimálně 3 znaky)',
        messageEmpty: '✗ Napište zprávu',
        messageShort: '✗ Zpráva je příliš krátká (minimálně 20 znaků)',

        successMsg: '✓ Dotaz odeslán! Odpovíme do 24 hodin.',
        ticketErrNetwork: 'Síť není dostupná. Zkuste to znovu za chvíli.',
        ticketErrGeneric: 'Dotaz se nepodařilo odeslat. Zkontrolujte údaje a zkuste to znovu.',
    },

    IT: {
        title: 'Supporto',
        subtitle:
            'Siamo qui per aiutare. Trova la risposta nelle FAQ, contattaci direttamente o invia una richiesta tramite il modulo sottostante.',

        quickTitle: 'Contatto rapido',
        quickDesc: 'Scegli un modo comodo per contattarci.',
        quickEmail: 'Email',
        quickEmailDesc: 'Risposta entro 24 ore',
        quickDiscord: 'Discord',
        quickDiscordDesc: 'Community attiva e supporto',
        quickFaq: 'Base di conoscenza',
        quickFaqDesc: 'Risposte alle domande popolari',
        quickFaqLink: 'Vai alle FAQ',

        faqTitle: 'Domande frequenti',
        faqDesc: 'Forse la risposta è già qui.',
        faq: [
            { q: 'Come resetto la password?', a: 'Nella pagina di accesso clicca su «Password dimenticata?» e inserisci la tua email. Invieremo un link per il reset. Se hai effettuato l\'accesso con Google - gestisci la password nelle impostazioni Google.' },
            { q: 'Posso cambiare nome utente ed email dopo la registrazione?', a: 'Sì. Vai su <a href="settings.html">Impostazioni → Profilo</a> e modifica i campi. Nome: 3–20 caratteri, unico. Email: valida e non usata.' },
            { q: 'Come elimino il mio account?', a: 'In <a href="settings.html">Impostazioni → Account</a> c\'è la «Zona pericolosa». Clicca su «Elimina account», digita il tuo nome per confermare - azione irreversibile.' },
            { q: 'I dispositivi mobili sono supportati?', a: 'Sì. Il sito e il gioco sono adattati per smartphone e tablet. Browser consigliati: Chrome, Safari, Firefox, Edge - ultime versioni. Su dispositivi vecchi disabilita le animazioni in Impostazioni → Preferenze.' },
            { q: 'Ho effettuato l\'accesso con Google - e la password?', a: 'Con accesso Google non viene creata password separata. Accesso solo tramite Google. Per cambiare password Google vai nelle <a href="https://myaccount.google.com/security" target="_blank" rel="noopener">impostazioni di sicurezza Google</a>.' },
            { q: 'Come segnalo un bug?', a: 'Invia una richiesta con categoria «Bug / Errore». Indica: cosa hai fatto, cosa aspettavi, cosa è successo, browser e OS, allega screenshot o video.' },
            { q: 'Posso giocare su più dispositivi?', a: 'Sì. Il progresso è legato all\'account e si sincronizza tra dispositivi. Basta accedere con le stesse credenziali. Sessioni di gioco simultanee da un account non sono consentite.' },
            { q: 'Ho pagato una donazione ma non ho ricevuto la ricompensa - cosa fare?', a: 'Gli acquisti vengono accreditati istantaneamente. Se dopo 15 minuti non arriva nulla - invia una richiesta categoria «Pagamento / Donazioni» con screenshot o ID transazione.' },
        ],

        formTitle: 'Modulo di contatto',
        formDesc: 'Descrivi il problema in dettaglio e ti aiuteremo.',
        formName: 'Il tuo nome',
        formEmail: 'Email di risposta',
        formCategory: 'Categoria',
        catAccount: 'Account',
        catBug: 'Bug / Errore',
        catPayment: 'Pagamento / Donazioni',
        catTech: 'Problemi tecnici',
        catOther: 'Altro',
        formSubject: 'Oggetto',
        formMessage: 'Messaggio',
        formMessageHint: 'Minimo 20 caratteri. Descrivi i passi, browser, orario evento.',
        formSubmit: 'Invia richiesta',
        formSubmitting: 'Invio...',

        formAttach: 'Allega file',
        attachText: 'Trascina i file qui o ',
        attachBrowse: 'sfoglia',
        attachHint: 'PNG, JPG, PDF, TXT, LOG · MP4, WEBM, MOV · fino a 5 MB (immagini/doc.) e 20 MB (video) · massimo 5 file',
        attachTooBig: (n) => `✗ Il file «${n}» è troppo grande (5 MB per immagini/doc., 20 MB per video)`,
        attachBadType: (n) => `✗ Il formato del file «${n}» non è supportato`,
        attachTooMany: '✗ Massimo 5 file',

        nameEmpty: '✗ Inserisci il nome',
        emailBad: '✗ Email non valida',
        subjectEmpty: '✗ Inserisci un oggetto',
        subjectShort: '✗ Oggetto troppo corto (minimo 3 caratteri)',
        messageEmpty: '✗ Scrivi un messaggio',
        messageShort: '✗ Messaggio troppo corto (minimo 20 caratteri)',

        successMsg: '✓ Richiesta inviata! Risponderemo entro 24 ore.',
        ticketErrNetwork: 'Rete non disponibile. Riprova tra un minuto.',
        ticketErrGeneric: 'Impossibile inviare la richiesta. Controlla i dati e riprova.',
    },

    UA: {
        title: 'Підтримка',
        subtitle:
            'Ми тут, щоб допомогти. Знайдіть відповідь у FAQ, зв\'яжіться з нами безпосередньо або надішліть звернення через форму нижче.',

        quickTitle: 'Швидкий зв\'язок',
        quickDesc: 'Виберіть зручний спосіб зв\'язку.',
        quickEmail: 'Email',
        quickEmailDesc: 'Відповімо протягом 24 годин',
        quickDiscord: 'Discord',
        quickDiscordDesc: 'Активна спільнота та підтримка',
        quickFaq: 'База знань',
        quickFaqDesc: 'Відповіді на популярні питання',
        quickFaqLink: 'Перейти до FAQ',

        faqTitle: 'Часті питання',
        faqDesc: 'Можливо, відповідь на ваше питання вже тут.',
        faq: [
            { q: 'Як скинути пароль?', a: 'На сторінці входу натисніть «Забули пароль?» і введіть email, вказаний при реєстрації. Ми надішлемо посилання для скидання. Якщо увійшли через Google - керуйте паролем в налаштуваннях свого Google-акаунту.' },
            { q: 'Чи можу я змінити логін і email після реєстрації?', a: 'Так. Перейдіть в <a href="settings.html">Налаштування → Профіль</a> і відредагуйте потрібні поля. Логін має бути від 3 до 20 символів і не повинен співпадати з вже існуючим. Email має бути коректним і вільним.' },
            { q: 'Як видалити акаунт?', a: 'В <a href="settings.html">Налаштування → Акаунт</a> є розділ «Небезпечна зона». Натисніть «Видалити акаунт», введіть свій логін для підтвердження - дія незворотна, весь прогрес і покупки будуть втрачені.' },
            { q: 'Підтримуються мобільні пристрої?', a: 'Так. Сайт і гра адаптовані під смартфони та планшети. Рекомендовані браузери: Chrome, Safari, Firefox, Edge - останніх версій. На старих пристроях вимкніть анімації в Налаштування → Переваги для підвищення продуктивності.' },
            { q: 'Я увійшов через Google - що робити з паролем?', a: 'При авторизації через Google пароль до нашого сайту не створюється. Вхід можливий тільки через Google. Щоб змінити пароль до Google-акаунту, перейдіть в <a href="https://myaccount.google.com/security" target="_blank" rel="noopener">налаштування безпеки Google</a>.' },
            { q: 'Як повідомити про помилку в грі?', a: 'Надішліть звернення через форму нижче з категорією «Баг / Помилка». Вкажіть: що робили, чого очікували, що сталося, браузер і ОС, додайте скріншот або відео якщо можливо. Це пришвидшить розбір.' },
            { q: 'Чи можу я грати на кількох пристроях?', a: 'Так. Ваш прогрес прив\'язаний до акаунту і синхронізується між пристроями. Просто увійдіть під одним логіном з будь-якого браузера. Одночасні ігрові сесії з одного акаунту не допускаються - старіша буде розлогінена.' },
            { q: 'Я оплатив донат, але не отримав нагороду - що робити?', a: 'Зазвичай покупки нараховуються миттєво. Якщо через 15 хвилин нічого не прийшло - надішліть звернення з категорією «Оплата / Донати», додавши скріншот або ID транзакції. Ми повернемо кошти або видалимо покупку вручну.' },
        ],

        formTitle: 'Форма звернення',
        formDesc: 'Опишіть проблему детально, і ми обов\'язково допоможемо.',
        formName: 'Ваше ім\'я',
        formEmail: 'Email для відповіді',
        formCategory: 'Категорія',
        catAccount: 'Акаунт',
        catBug: 'Баг / Помилка',
        catPayment: 'Оплата / Донати',
        catTech: 'Технічні проблеми',
        catOther: 'Інше',
        formSubject: 'Тема звернення',
        formMessage: 'Повідомлення',
        formMessageHint: 'Мінімум 20 символів. Опишіть кроки відтворення, браузер, час події.',
        formSubmit: 'Надіслати звернення',
        formSubmitting: 'Надсилання...',

        formAttach: 'Прикріпити файли',
        attachText: 'Перетягніть файли сюди або ',
        attachBrowse: 'виберіть',
        attachHint: 'PNG, JPG, PDF, TXT, LOG · MP4, WEBM, MOV · до 5 МБ (фото/док.) і 20 МБ (відео) · максимум 5 файлів',
        attachTooBig: (n) => `✗ Файл "${n}" занадто великий (до 5 МБ для фото/док., 20 МБ для відео)`,
        attachBadType: (n) => `✗ Формат файлу "${n}" не підтримується`,
        attachTooMany: '✗ Максимум 5 файлів',

        nameEmpty: '✗ Вкажіть ім\'я',
        emailBad: '✗ Некоректний email',
        subjectEmpty: '✗ Вкажіть тему',
        subjectShort: '✗ Тема занадто коротка (мінімум 3 символи)',
        messageEmpty: '✗ Напишіть повідомлення',
        messageShort: '✗ Повідомлення занадто коротке (мінімум 20 символів)',

        successMsg: '✓ Звернення надіслано! Ми відповімо протягом 24 годин.',
        ticketErrNetwork: 'Мережа недоступна. Спробуйте ще раз через хвилину.',
        ticketErrGeneric: 'Не вдалося надіслати звернення. Перевірте дані і спробуйте знову.',
    },
};
